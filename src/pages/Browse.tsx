const filters = ["Location", "Category", "Availability", "Price range"];
const highlightCategories = ["Outdoor gear", "Event looks", "Furniture", "Tools & DIY"];

export default function Browse() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--rs-primary)]">
          Rentals marketplace
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Browse trusted listings nearby
        </h1>
        <p className="text-base text-slate-500">
          Filter by what matters most—our Phase 4 scope covers the Renting module first.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {filters.map((filter) => (
              <li
                key={filter}
                className="rounded-xl border border-transparent px-3 py-2 transition hover:border-emerald-100 hover:bg-emerald-50"
              >
                {filter}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="grid gap-4 rounded-2xl bg-white/90 p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            {highlightCategories.map((category) => (
              <article key={category} className="rounded-2xl border border-emerald-50 p-4 text-left">
                <p className="text-sm font-semibold uppercase text-emerald-400">Category</p>
                <h3 className="text-lg font-semibold text-slate-900">{category}</h3>
                <p className="text-sm text-slate-500">
                  Placeholder cards until the listing service connects to the API.
                </p>
              </article>
            ))}
          </div>
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Listings grid</h3>
            <p className="mt-2 text-sm text-slate-600">
              Coming soon — this section will stream paginated inventory via React Query once the
              Item Service endpoints land.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
