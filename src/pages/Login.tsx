import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../layouts/AuthLayout";
import { PasswordInput } from "../components/ui/PasswordInput";

const LoginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Enter your email or phone")
    .max(70, "Too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: LoginForm) => {
    // TODO: replace with API call
    await new Promise((r) => setTimeout(r, 600));
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your Rent & Swap journey"
      bottomLink={{ text: "Don't have an account? [Signup]", to: "/signup" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Email or Phone
          </label>
          <input
            type="text"
            autoComplete="username"
            placeholder="you@example.com / 03xx-xxxxxxx"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400/60"
            {...register("identifier")}
          />
          {errors.identifier && (
            <p className="mt-1 text-xs text-red-600">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link
              to="#"
              className="text-xs text-slate-600 underline underline-offset-4"
            >
              Forgot Password?
            </Link>
          </div>
          <PasswordInput
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium shadow hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
}
