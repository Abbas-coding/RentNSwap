import { Link, useNavigate, useLocation, type Location } from "react-router-dom";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../layouts/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { authApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const LoginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Enter your email or phone")
    .max(70, "Too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

const inputStyles =
  "h-12 rounded-2xl border-emerald-100/80 bg-white text-base text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-[var(--rs-primary)] focus:ring-[#38BDF8]/50";
const passwordWrapperStyles =
  "[&>input]:h-12 [&>input]:rounded-2xl [&>input]:border-emerald-100/80 [&>input]:bg-white [&>input]:text-base [&>input]:text-slate-900 [&>input]:placeholder:text-slate-400 [&>input]:shadow-sm [&>input]:focus:border-[var(--rs-primary)] [&>input]:focus:ring-[#38BDF8]/50 [&>button]:text-slate-400 [&>button]:hover:text-slate-700";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(LoginSchema) });
  const navigate = useNavigate();
  const location = useLocation();
  const showCreationNotice = useMemo(
    () => Boolean(location.state && (location.state as { accountCreated?: boolean }).accountCreated),
    [location.state]
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const { setSession } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const response = await authApi.login(data);
      setSession(response.token, response.user);
      const from = (location.state as { from?: Location })?.from;
      navigate(from?.pathname ?? "/");
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Unable to sign in right now.";
      setServerError(message);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to rent, list, or swap your next find"
      switchLink={{
        helper: "New to Rent & Swap?",
        label: "Create an account",
        to: "/signup",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {showCreationNotice && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-700">
            Account created! Sign in to continue.
          </div>
        )}
        <div className="space-y-2">
          <Label
            htmlFor="identifier"
            className="text-sm font-semibold text-slate-600"
          >
            Email or Phone
          </Label>
          <Input
            id="identifier"
            type="text"
            autoComplete="username"
            placeholder="you@example.com / 03xx-xxxxxxx"
            className={inputStyles}
            aria-invalid={!!errors.identifier}
            {...register("identifier")}
          />
          {errors.identifier && (
            <p className="text-sm text-red-500">{errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-slate-600"
            >
              Password
            </Label>
            <Link
              to="#"
              className="text-xs font-semibold text-[var(--rs-primary)] hover:text-[var(--rs-primary-dark)]"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={passwordWrapperStyles}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-center text-red-500">{serverError}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-2xl bg-[var(--rs-primary)] text-base font-semibold text-white shadow-lg shadow-emerald-200/60 transition hover:bg-[var(--rs-primary-dark)] focus-visible:ring-[#38BDF8]/60 disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-xs text-slate-400">
          By continuing you accept our{" "}
          <span className="font-semibold text-[var(--rs-primary)]">
            community guidelines
          </span>
          .
        </p>
      </form>
    </AuthLayout>
  );
}
