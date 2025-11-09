import { CheckCircle2, Clock, Sparkles } from "lucide-react";

const phases = [
  {
    title: "Phase 4 focus",
    bullets: [
      "Auth, Listings, Booking, Swap flows wired to Mongo/Express API",
      "Messaging preview + dashboard placeholders",
      "Responsive UI kit aligned with mint & sky palette",
    ],
  },
  {
    title: "Next steps",
    bullets: ["Real payment rails", "Cloud storage for media", "Realtime chat + notifications"],
  },
];

const faqs = [
  { q: "How do deposits work?", a: "Escrow placeholder today; Stripe/PayPal integration arrives next sprint." },
  { q: "Do swaps require matching value?", a: "No—cash adjustments let owners balance high-value trades." },
  { q: "What if items get damaged?", a: "Dispute workflows + review system kick in; admin dashboard moderates outcomes." },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-white/90 p-8 shadow-lg ring-1 ring-emerald-50">
        <h1 className="text-3xl font-semibold text-slate-900">How Rent & Swap works</h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          The journey mirrors the execution plan: authenticate, discover listings, book or propose
          a swap, message owners, and leave reviews—all powered by the modular backend we just
          scaffolded.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {phases.map((phase) => (
            <article key={phase.title} className="rounded-2xl border border-emerald-100 p-6">
              <h2 className="text-xl font-semibold text-slate-900">{phase.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {phase.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Sparkles className="text-[var(--rs-primary)]" size={18} />
            Execution timeline
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["Discover", "Book/swap", "Return & review"].map((step, index) => (
              <div key={step} className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
                <p className="text-xs uppercase tracking-wide text-emerald-400">Step {index + 1}</p>
                <p className="text-base font-semibold text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-emerald-100 p-6">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <CheckCircle2 className="text-[var(--rs-primary)]" size={18} />
              Accountability loop
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Authenticated users list items → renters book or propose swaps → deposit + messaging keep
              both sides aligned → reviews close the loop. Each module from the Project Overview is mapped to
              a dedicated service in the backend.
            </p>
          </article>
          <article className="rounded-3xl border border-emerald-100 p-6">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Clock className="text-sky-500" size={18} />
              FAQ
            </div>
            <ul className="mt-4 space-y-4 text-sm text-slate-600">
              {faqs.map((faq) => (
                <li key={faq.q}>
                  <p className="font-semibold text-slate-900">{faq.q}</p>
                  <p>{faq.a}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
