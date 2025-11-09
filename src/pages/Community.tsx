const stats = [
  { label: "Shared items", value: "12K+" },
  { label: "Active neighborhoods", value: "180+" },
  { label: "Avg. rating", value: "4.9/5" },
];

export default function Community() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Community impact</h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Narratives, sustainability data, and success stories will live here. For now this acts as
          a placeholder referencing the Project Overview’s emphasis on trust and eco-minded swaps.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl bg-emerald-50/70 p-6 text-center">
              <p className="text-3xl font-semibold text-emerald-700">{stat.value}</p>
              <p className="text-sm text-emerald-900/70">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
