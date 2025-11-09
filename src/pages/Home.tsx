const highlights = [
  { title: "Verified owners", body: "Trust & safety checkpoints across every listing." },
  { title: "Flexible swaps", body: "Offer items 1:1 or add cash to balance value." },
  { title: "Sustainable wins", body: "Keep products in motion and lighten your footprint." },
];

export default function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-[var(--rs-primary)]">
            Community-driven sharing
          </span>
          <div>
            <h1 className="text-4xl font-semibold text-emerald-950 sm:text-5xl">
              Rent smarter. Swap greener.
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Everything we build in Phase 4 ladders up to this experience: browse curated listings,
              lock bookings with deposits, or negotiate swaps without leaving the app.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Items shared", value: "12K+" },
              { label: "Locations", value: "180+" },
              { label: "Avg. rating", value: "4.9/5" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-semibold text-emerald-600">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-900"> roadmap snapshot</h2>
          <p className="mt-2 text-sm text-slate-600">
            Built on React + Express + MongoDB. Booking, swaps, messaging, and reviews will
            progressively activate as each module ships.
          </p>
          <ul className="mt-6 space-y-4">
            {highlights.map((highlight) => (
              <li key={highlight.title} className="rounded-2xl border border-emerald-100 p-4">
                <p className="text-sm font-semibold uppercase text-emerald-400">
                  {highlight.title}
                </p>
                <p className="text-sm text-slate-600">{highlight.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-12 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
        <p className="text-sm text-slate-600">
          Listings feed coming soon — waiting on Item Service endpoints described in
          Project-Execution-Plan Phase 4.
        </p>
      </div>
    </section>
  );
}
