const steps = [
  { title: "Propose", body: "Pick your item + optional cash adjustment to initiate a swap." },
  { title: "Negotiate", body: "Chat, counter, or accept directly from the unified proposal inbox." },
  { title: "Confirm", body: "Owner approval locks items, triggers deposits, and schedules the exchange." },
];

export default function SwapHub() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">Swap Engine</p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Smarter trading for every lifestyle
        </h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">
          This page will host the swap discovery feed plus proposal modals once the backend swap
          endpoints land.
        </p>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-emerald-100/60">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase text-emerald-400">Step {index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
