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
      </div>
    </section>
  );
}
