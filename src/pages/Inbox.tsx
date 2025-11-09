const conversations = ["Booking: DSLR kit", "Swap: Road bike", "Support: Deposit question"];

export default function Inbox() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Inbox</h1>
        <p className="mt-2 text-sm text-slate-600">
          Real-time chat (Socket.io) is on the roadmap; this stub illustrates the layout for thread
          list + active chat from the plan.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            {conversations.map((thread) => (
              <button
                key={thread}
                className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-left text-sm text-slate-600 transition hover:border-[var(--rs-primary)] hover:text-slate-900"
              >
                {thread}
              </button>
            ))}
          </aside>
          <div className="rounded-2xl border border-dashed border-emerald-200 p-6 text-center text-sm text-slate-500">
            Chat window placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
