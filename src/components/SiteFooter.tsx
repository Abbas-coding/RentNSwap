import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin, Twitter } from "lucide-react";

const productLinks = [
  { to: "/rent", label: "Browse rentals" },
  { to: "/swap", label: "Discover swaps" },
  { to: "/list", label: "List your item" },
  { to: "/pricing", label: "Pricing" },
];

const companyLinks = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/careers", label: "Careers" },
];

const supportLinks = [
  { to: "/help-center", label: "Help center" },
  { to: "/trust", label: "Trust & safety" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
];

export default function SiteFooter() {
  const socials = [
    { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  ];

  return (
    <footer className="mt-16 bg-gradient-to-br from-[#F9FAFB] via-white to-[#E8FFF4]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 text-center sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:text-left">
        <div className="space-y-4 text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
            Rent & Swap
          </p>
          <p className="text-base text-slate-600">
            A community-powered marketplace for renting and swapping the goods
            you love—keeping gear in use and out of storage.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-slate-600 lg:justify-start">
            <Mail size={16} className="text-[var(--rs-primary)]" />
            support@rentnswap.com
          </div>
          <div className="flex justify-center gap-3 pt-2 lg:justify-start">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 text-slate-600 transition hover:border-[var(--rs-primary)] hover:text-[var(--rs-primary)]"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {[productLinks, companyLinks, supportLinks].map((section, idx) => (
          <div key={idx} className="text-center lg:text-left">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {idx === 0 ? "Product" : idx === 1 ? "Company" : "Support"}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {section.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="transition hover:text-[var(--rs-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-emerald-100/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <p>© {new Date().getFullYear()} Rent & Swap. All rights reserved.</p>
          <p>Designed for circular living ♻️</p>
        </div>
      </div>
    </footer>
  );
}
