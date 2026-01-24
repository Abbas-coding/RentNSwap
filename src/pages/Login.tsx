import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { ArrowRight, Loader2 } from "lucide-react";
import logoUrl from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { token, user } = await authApi.login({ email, password });
      setSession(token, user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left: Image Side (Hidden on mobile) */}
      <div className="hidden w-1/2 bg-slate-900 lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop" 
          alt="Community sharing" 
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute bottom-0 left-0 z-20 p-12 text-white">
          <h2 className="text-4xl font-bold leading-tight">Share more.<br/>Waste less.</h2>
          <p className="mt-4 text-lg text-slate-200 max-w-md">
            Join a community of creators and neighbors sharing the items they love.
          </p>
        </div>
      </div>

      {/* Right: Form Side */}
      <div className="flex w-full flex-col justify-center bg-white px-4 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <Link to="/" className="mb-8 flex items-center gap-2">
              <img src={logoUrl} alt="Rent & Swap" className="h-10 w-10" />
              <span className="text-lg font-bold text-slate-900">Rent & Swap</span>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-slate-600">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-[var(--rs-primary)] focus:ring-1 focus:ring-[var(--rs-primary)]"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-[var(--rs-primary)] focus:ring-1 focus:ring-[var(--rs-primary)]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--rs-primary)] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-[#0ea5e9] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign in <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-[var(--rs-primary)] hover:underline">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
