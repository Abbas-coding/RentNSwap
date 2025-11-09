import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logoUrl from "../assets/logo.png";

type SwitchLink = {
  helper: string;
  label: string;
  to: string;
};

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  switchLink: SwitchLink;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  switchLink,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F9FAFB] via-white to-[#E8FFF4]">
      <div className="mx-auto w-full flex-1 px-4 py-8 sm:px-6 lg:max-w-7xl">
        <div className="mb-8 flex items-center justify-between shadow shadow-green-100">
          <Link to="/" className="flex items-center gap-3 rounded-2xl px-2 py-1">
          <img src={logoUrl} alt="Rent & Swap" className="h-14 w-14" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-emerald-950">
              Rent & Swap
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-emerald-500">
              Share more. Spend less.
            </span>
          </div>
        </Link>
          <Link
            to={switchLink.to}
            className="rounded-full border border-emerald-100/80 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[var(--rs-primary)] hover:text-[var(--rs-primary)]"
          >
            {switchLink.label}
          </Link>
        </div>
        <div className="mx-auto mt-[6rem] max-w-md rounded-3xl border border-gray-300 px-6 py-8 shadow-xl **shadow-gray-400/40** ring-1 ring-emerald-50 sm:px-8">
          <div className="mb-8 space-y-1 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500 sm:text-base">{subtitle}</p>
            )}
          </div>
          {children}
          <p className="mt-8 text-center text-sm text-slate-500">
            {switchLink.helper}{" "}
            <Link
              to={switchLink.to}
              className="font-semibold text-[var(--rs-primary)] hover:text-[var(--rs-primary-dark)]"
            >
              {switchLink.label}
            </Link>
          </p>
        </div>
      </div>
      <footer className="py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Rent &amp; Swap
      </footer>
    </div>
  );
}
