import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../layouts/AuthLayout";
import { PasswordInput } from "../components/ui/PasswordInput";

const SignupSchema = z
  .object({
    identifier: z
      .string()
      .min(3, "Enter your email or phone")
      .max(70, "Too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string().min(6),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

type SignupForm = z.infer<typeof SignupSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(SignupSchema) });

  const onSubmit = async (data: SignupForm) => {
    // TODO: replace with API call
    await new Promise((r) => setTimeout(r, 600));
    alert(JSON.stringify({ identifier: data.identifier }, null, 2));
  };

  return (
    <AuthLayout
      title="Rent & Swap"
      subtitle="Signup to start your journey"
      bottomLink={{ text: "Already have an account? [Login]", to: "/login" }}
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
          <label className="mb-1 block text-sm font-medium">Password</label>
          <PasswordInput
            autoComplete="new-password"
            placeholder="Create a strong password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Confirm Password
          </label>
          <PasswordInput
            autoComplete="new-password"
            placeholder="Repeat password"
            {...register("confirm")}
          />
          {errors.confirm && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirm.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium shadow hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? "Creating account…" : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
}
