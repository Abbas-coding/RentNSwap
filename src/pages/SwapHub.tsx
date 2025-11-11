import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft, Coins, MessageCircle, ShieldCheck } from "lucide-react";
import { itemsApi, swapsApi, type Item, type Swap } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const steps = [
  { title: "Propose", body: "Pick your item + optional cash adjustment to initiate a swap." },
  { title: "Negotiate", body: "Chat, counter, or accept directly from the unified proposal inbox." },
  { title: "Confirm", body: "Owner approval locks items, triggers deposits, and schedules the exchange." },
];

export default function SwapHub() {
  const [items, setItems] = useState<Item[]>([]);
  const [ownedItems, setOwnedItems] = useState<Item[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [swapForm, setSwapForm] = useState({
    proposerItemId: "",
    receiverItemId: "",
    cashAdjustment: "0",
  });
  const [swapStatus, setSwapStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [counterInput, setCounterInput] = useState<{ id: string; value: string } | null>(null);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const refreshSwaps = async () => {
    if (!isAuthenticated) {
      setSwaps([]);
      return;
    }
    try {
      const refreshed = await swapsApi.list();
      setSwaps(refreshed.swaps);
    } catch {
      setSwaps([]);
    }
  };

  useEffect(() => {
    itemsApi.list().then((res) => setItems(res.items));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setOwnedItems([]);
      return;
    }
    itemsApi
      .list({ owned: true })
      .then((res) => setOwnedItems(res.items))
      .catch(() => setOwnedItems([]));
  }, [isAuthenticated]);

  useEffect(() => {
    refreshSwaps();
  }, [isAuthenticated]);

  useEffect(() => {
    if (ownedItems.length && items.length) {
      setSwapForm((prev) => ({
        ...prev,
        proposerItemId: prev.proposerItemId || ownedItems[0]._id,
        receiverItemId:
          prev.receiverItemId || items.find((item) => item._id !== ownedItems[0]._id)?._id || "",
      }));
    }
  }, [items, ownedItems]);

  const suggestedMatches = useMemo(() => {
    if (items.length < 2) return [];
    return items.slice(0, 2).map((item, index) => {
      const partner = items[(index + 1) % items.length];
      return {
        ownerItem: item.title,
        owner: item.location,
        seekerItem: partner?.title ?? item.title,
        seeker: partner?.location ?? "Unknown",
        adjustment: item.swapEligible ? "+$40" : "even swap",
      };
    });
  }, [items]);

  const handleSwapSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSwapStatus(null);

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/swap" } } });
      return;
    }

    const proposerItem = ownedItems.find((item) => item._id === swapForm.proposerItemId);
    const receiverItem = items.find((item) => item._id === swapForm.receiverItemId);

    if (!proposerItem || !receiverItem || !receiverItem.owner?._id) {
      setSwapStatus({ type: "error", message: "Select two valid items to propose a swap." });
      return;
    }

    try {
      await swapsApi.create({
        proposerItemId: proposerItem._id,
        receiverItemId: receiverItem._id,
        receiverId: receiverItem.owner._id,
        cashAdjustment: Number(swapForm.cashAdjustment) || 0,
      });
      setSwapStatus({ type: "success", message: "Swap proposal sent!" });
      refreshSwaps();
    } catch (error) {
      setSwapStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send swap proposal.",
      });
    }
  };

  const handleSwapAction = async (
    swap: Swap,
    payload: { status: string; cashAdjustment?: number; notes?: string }
  ) => {
    try {
      await swapsApi.updateStatus(swap._id, payload);
      setActionMessage(`Swap "${swap.proposerItem?.title}" updated to ${payload.status}.`);
      setCounterInput(null);
      refreshSwaps();
    } catch (error) {
      setActionMessage(
        error instanceof Error ? error.message : "Unable to update swap at this time."
      );
    }
  };

  const getSwapActions = (swap: Swap) => {
    if (!user) return [];
    const isReceiver = swap.receiver?._id === user.id;
    const isProposer = swap.proposer?._id === user.id;

    if (swap.status === "pending" && isReceiver) {
      return ["accept", "counter", "reject"];
    }
    if (swap.status === "counter") {
      if (isProposer) {
        return ["accept", "reject"];
      }
      if (isReceiver) {
        return ["counter"];
      }
    }
    return [];
  };

  const renderSwapActions = (swap: Swap) => {
    const actions = getSwapActions(swap);
    if (!actions.length) return null;

    return (
      <div className="mt-3 space-y-3 text-xs text-slate-600">
        <div className="flex flex-wrap gap-2">
          {actions.includes("accept") && (
            <button
              className="rounded-2xl border border-emerald-100 px-3 py-2 font-semibold text-[var(--rs-primary)] transition hover:border-[var(--rs-primary)]"
              onClick={() => handleSwapAction(swap, { status: "accepted" })}
            >
              Accept
            </button>
          )}
          {actions.includes("reject") && (
            <button
              className="rounded-2xl border border-emerald-100 px-3 py-2 font-semibold text-red-500 transition hover:border-red-500"
              onClick={() => handleSwapAction(swap, { status: "rejected" })}
            >
              Reject
            </button>
          )}
          {actions.includes("counter") && (
            <button
              className="rounded-2xl border border-emerald-100 px-3 py-2 font-semibold text-slate-600 transition hover:border-[var(--rs-primary)]"
              onClick={() =>
                setCounterInput({
                  id: swap._id,
                  value: String(swap.cashAdjustment ?? 0),
                })
              }
            >
              Counter offer
            </button>
          )}
        </div>
        {counterInput?.id === swap._id && (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSwapAction(swap, {
                status: "counter",
                cashAdjustment: Number(counterInput.value) || 0,
              });
            }}
          >
            <input
              type="number"
              className="w-24 rounded-2xl border border-emerald-100 px-3 py-1 text-xs"
              value={counterInput.value}
              onChange={(e) => setCounterInput((prev) => (prev ? { ...prev, value: e.target.value } : prev))}
            />
            <button className="rounded-2xl bg-[var(--rs-primary)] px-3 py-1 text-xs font-semibold text-white">
              Send counter
            </button>
          </form>
        )}
      </div>
    );
  };

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
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Suggested matches
              </p>
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
              {suggestedMatches.length === 0 && (
                <p className="text-sm text-slate-500">Add more items to unlock suggestions.</p>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100 p-6">
            <div className="mb-4 flex items-center gap-3">
              <MessageCircle className="text-sky-500" size={20} />
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Recent proposals
              </p>
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

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Propose a swap
            </p>
            {isAuthenticated ? ownedItems.length ? (
              <form className="mt-4 space-y-4" onSubmit={handleSwapSubmit}>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-slate-500">
                    Your item
                  </label>
                  <select
                    className="w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                    value={swapForm.proposerItemId}
                    onChange={(e) => setSwapForm((prev) => ({ ...prev, proposerItemId: e.target.value }))}
                  >
                    {ownedItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-slate-500">
                    Item to request
                  </label>
                  <select
                    className="w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                    value={swapForm.receiverItemId}
                    onChange={(e) => setSwapForm((prev) => ({ ...prev, receiverItemId: e.target.value }))}
                  >
                    {items.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-slate-500">
                    Cash adjustment
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                    value={swapForm.cashAdjustment}
                    onChange={(e) => setSwapForm((prev) => ({ ...prev, cashAdjustment: e.target.value }))}
                  />
                </div>
                {swapStatus && (
                  <p
                    className={`text-sm ${
                      swapStatus.type === "success" ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {swapStatus.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[var(--rs-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Send proposal
                </button>
              </form>
            ) : (
              <p className="mt-4 rounded-2xl border border-emerald-100 p-4 text-sm text-slate-500">
                Add a listing first—only your items can be offered in a swap.
              </p>
            ) : (
              <p className="mt-4 rounded-2xl border border-emerald-100 p-4 text-sm text-slate-500">
                Sign in to send swap proposals and see responses.
              </p>
            )}
          </div>
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center text-sm text-slate-600">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Coins className="text-amber-400" size={18} />
              <ShieldCheck className="text-emerald-500" size={18} />
              <span>Escrow, deposits, and dispute handling will plug into this flow in upcoming sprints.</span>
            </div>
          </div>
        </div>
        {actionMessage && (
          <p className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-center text-xs text-emerald-700">
            {actionMessage}
          </p>
        )}
      </div>
    </section>
  );
}
