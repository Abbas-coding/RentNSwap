import { useEffect, useState } from "react";
import { ArrowRightLeft, Coins, MessageCircle, ShieldCheck } from "lucide-react";
import { itemsApi, swapsApi, type Item } from "@/lib/api";

const steps = [
  { title: "Propose", body: "Pick your item + optional cash adjustment to initiate a swap." },
  { title: "Negotiate", body: "Chat, counter, or accept directly from the unified proposal inbox." },
  { title: "Confirm", body: "Owner approval locks items, triggers deposits, and schedules the exchange." },
];

export default function SwapHub() {
  const [items, setItems] = useState<Item[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);

  useEffect(() => {
    itemsApi.list().then((res) => setItems(res.items));
    swapsApi.list().then((res) => setSwaps(res.swaps));
  }, []);

  const suggestedMatches = items.slice(0, 2).map((item, index) => {
    const partner = items[(index + 1) % items.length];
    return {
      ownerItem: item.title,
      owner: item.location,
      seekerItem: partner?.title ?? item.title,
      seeker: partner?.location ?? "Unknown",
      adjustment: item.swapEligible ? "+$40" : "even swap",
    };
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">Swap engine</p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Smarter trading for every lifestyle</h1>
        <p className="text-sm text-slate-500 sm:text-base">
          Live data from your inventory fuels match suggestions and proposal timelines. Bookings + swaps share the same backend foundation.
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

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 p-6">
            <div className="mb-4 flex items-center gap-3">
              <ArrowRightLeft className="text-[var(--rs-primary)]" size={20} />
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Suggested matches</p>
            </div>
            <div className="space-y-4">
              {suggestedMatches.map((match, idx) => (
                <article key={`${match.ownerItem}-${idx}`} className="rounded-2xl border border-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-400">{match.adjustment}</p>
                  <div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-400">Owner ({match.owner})</p>
                      <p className="font-semibold">{match.ownerItem}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Seeker ({match.seeker})</p>
                      <p className="font-semibold">{match.seekerItem}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 p-6">
            <div className="mb-4 flex items-center gap-3">
              <MessageCircle className="text-sky-500" size={20} />
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent proposals</p>
            </div>
            <div className="space-y-4">
              {swaps.slice(0, 3).map((proposal) => (
                <article key={proposal._id} className="rounded-2xl border border-emerald-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {proposal.proposerItem?.title} ↔ {proposal.receiverItem?.title}
                  </p>
                  <p className="text-xs text-emerald-500">{proposal.status}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(proposal.updatedAt).toLocaleString()}
                  </p>
                </article>
              ))}
              {swaps.length === 0 && (
                <p className="text-sm text-slate-500">
                  No swaps yet—seed the DB or create one to populate this feed.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center text-sm text-slate-600">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Coins className="text-amber-400" size={18} />
            <ShieldCheck className="text-emerald-500" size={18} />
            <span>Escrow, deposits, and dispute handling will plug into this flow in upcoming sprints.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
