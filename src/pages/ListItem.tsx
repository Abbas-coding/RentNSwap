const sections = [
  "Item basics (title, category, description)",
  "Pricing & availability",
  "Swap eligibility and deposit",
  "Photo upload queue",
];

export default function ListItem() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">List an item</h1>
        <p className="mt-2 text-sm text-slate-600">
          Form inputs will hook into the Item Service once the API exposes CRUD endpoints. These
          cards mirror the execution plan’s component inventory.
        </p>
        <div className="mt-6 space-y-4">
          {sections.map((section) => (
            <article key={section} className="rounded-2xl border border-emerald-100 p-4">
              <p className="text-sm font-semibold text-slate-700">{section}</p>
              <p className="text-xs text-slate-500">Placeholder controls go here.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
