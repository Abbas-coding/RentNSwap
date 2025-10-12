import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import logoUrl from "../assets/logo.jpg"; // place your logo file in src/assets (exported as svg/png)

const nav = [
  { to: "/rent", label: "Rent" },
  { to: "/swap", label: "Swap" },
  { to: "/how-it-works", label: "How it works" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-emerald-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logoUrl} alt="Rent & Swap" className="h-16 w-16" />
            <span className="font-semibold text-lg text-emerald-900">
              Rent & Swap
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive
                      ? "text-emerald-900"
                      : "text-emerald-800/80 hover:text-emerald-900"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          {/* Search (desktop) */}
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-700/70" />
              <input
                placeholder="What are you looking for?"
                className="w-full rounded-xl border border-emerald-200 bg-white/70 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/list" className="btn-ghost">
              List your item
            </Link>
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-emerald-100/60"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile sheet */}
        {open && (
          <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 py-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-700/70" />
                <input
                  className="w-full rounded-xl border border-emerald-200 bg-white/70 pl-9 pr-3 py-2 text-sm"
                  placeholder="Search items"
                />
              </div>
            </div>
            <nav className="grid gap-2">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className="rounded-lg px-3 py-2 text-emerald-900 hover:bg-emerald-100/60"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex items-center gap-2">
              <Link
                to="/list"
                className="btn-ghost flex-1"
                onClick={() => setOpen(false)}
              >
                List your item
              </Link>
              <Link
                to="/login"
                className="btn-primary flex-1"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
