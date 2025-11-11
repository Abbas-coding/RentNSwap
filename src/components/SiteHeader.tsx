import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search, Leaf } from "lucide-react";
import logoUrl from "../assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/rent", label: "Rent" },
  { to: "/swap", label: "Swap" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/community", label: "Community" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100/70 bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-9xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand */}
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

        {/* Search */}
        <div className="hidden flex-1 items-center lg:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
            <input
              placeholder="Find cameras, tools, outfits, and more…"
              className="h-11 w-full rounded-2xl border border-emerald-100 bg-white/90 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-[var(--rs-primary)] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30"
            />
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive
                    ? "text-[var(--rs-primary)]"
                    : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user?.email && (
            <span className="text-xs text-slate-400">Hi, {user.email}</span>
          )}
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-emerald-100 px-4 text-sm font-semibold text-slate-700 transition hover:border-[var(--rs-primary)] hover:text-[var(--rs-primary)]"
              >
                <Leaf size={16} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex h-11 items-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/list"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-emerald-100 px-4 text-sm font-semibold text-slate-700 transition hover:border-[var(--rs-primary)] hover:text-[var(--rs-primary)]"
              >
                <Leaf size={16} />
                List an item
              </Link>
              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-2xl bg-[var(--rs-primary)] px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/70 transition hover:bg-[var(--rs-primary-dark)]"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-2xl border border-emerald-100 p-2 text-slate-600"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-emerald-50 bg-white/95 px-4 pb-6 pt-4 shadow-2xl md:hidden">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
              <input
                className="h-11 w-full rounded-2xl border border-emerald-100 bg-white pl-10 pr-4 text-sm text-slate-700"
                placeholder="Search the marketplace"
              />
            </div>
          </div>
          <nav className="grid gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-2xl border border-emerald-100 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/list"
                  className="rounded-2xl border border-emerald-100 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                  onClick={() => setOpen(false)}
                >
                  List an item
                </Link>
                <Link
                  to="/login"
                  className="rounded-2xl bg-[var(--rs-primary)] px-4 py-3 text-center text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
