const ownerWidgets = [
  {
    title: "Pending approvals",
    description: "Incoming bookings or swap proposals awaiting your decision.",
  },
  { title: "Active rentals", description: "Keep tabs on return dates and deposits." },
  { title: "Disputes & reviews", description: "Moderate issues and respond to feedback promptly." },
];

export default function Dashboard() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
          Owner dashboard
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Operational overview</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Real data will arrive once booking/swap endpoints expand; this scaffold aligns with the
          Project Execution Plan’s Sprint order.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ownerWidgets.map((widget) => (
          <article key={widget.title} className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">{widget.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{widget.description}</p>
            <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 p-4 text-xs uppercase tracking-wide text-slate-400">
              Data placeholder
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
