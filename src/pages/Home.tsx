export default function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-[var(--rs-primary)]">
          Community-driven sharing
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-emerald-950 sm:text-5xl">
          Why buy when you can Rent &amp; Swap?
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Access thousands of well-cared-for items from neighbors near you—pay
          only for the days you need them or trade what you already own.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((card) => (
          <article
            key={card}
            className="card flex flex-col gap-3 p-4 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-100" />
            <div>
              <p className="text-sm font-semibold uppercase text-[var(--rs-primary)]">
                Featured
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                Item Name #{card}
              </h3>
              <p className="text-sm text-slate-500">Rent for $10/day</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
