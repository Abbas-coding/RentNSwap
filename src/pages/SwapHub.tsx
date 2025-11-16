import { useEffect, useMemo, useState } from "react";
import { swapsApi, type Swap } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { SwapOfferCard } from "@/components/SwapOfferCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type SwapTab = "incoming" | "outgoing";

export default function SwapHub() {
  const [activeTab, setActiveTab] = useState<SwapTab>("incoming");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();

  const refreshSwaps = async () => {
    if (!isAuthenticated) {
      setSwaps([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const refreshed = await swapsApi.list();
      setSwaps(refreshed.swaps);
    } catch {
      setSwaps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSwaps();
  }, [isAuthenticated]);

  const { incomingSwaps, outgoingSwaps } = useMemo(() => {
    const incoming = swaps.filter((s) => s.receiver?._id === user?.id);
    const outgoing = swaps.filter((s) => s.proposer?._id === user?.id);
    return { incomingSwaps: incoming, outgoingSwaps: outgoing };
  }, [swaps, user]);

  const handleSwapAction = async (
    swap: Swap,
    payload: { status: string; cashAdjustment?: number; notes?: string }
  ) => {
    try {
      await swapsApi.updateStatus(swap._id, payload);
      setActionMessage(`Swap updated to ${payload.status}.`);
      refreshSwaps();
    } catch (error) {
      setActionMessage(
        error instanceof Error ? error.message : "Unable to update swap at this time."
      );
    }
  };

  const currentSwaps = activeTab === "incoming" ? incomingSwaps : outgoingSwaps;
  const noSwapsMessage =
    activeTab === "incoming"
      ? "You have no incoming swap offers at this time."
      : "You have not sent any swap offers. You can propose a swap from an item's detail page.";

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Swap Inbox</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Manage your incoming and outgoing swap proposals.
        </p>
      </div>

      <div className="mb-6 flex space-x-4 border-b border-slate-200">
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "incoming"
              ? "border-b-2 border-[var(--rs-primary)] text-[var(--rs-primary)]"
              : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("incoming")}
        >
          Incoming Offers ({incomingSwaps.length})
        </button>
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "outgoing"
              ? "border-b-2 border-[var(--rs-primary)] text-[var(--rs-primary)]"
              : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("outgoing")}
        >
          Outgoing Offers ({outgoingSwaps.length})
        </button>
      </div>

      {actionMessage && (
        <p className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-emerald-700">
          {actionMessage}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="h-6 w-3/4 animate-pulse rounded-md bg-slate-200" />
              <div className="mt-4 h-12 w-full animate-pulse rounded-md bg-slate-200" />
            </div>
          ))}
        </div>
      ) : currentSwaps.length > 0 ? (
        <div className="space-y-4">
          {currentSwaps.map((swap) => (
            <SwapOfferCard
              key={swap._id}
              swap={swap}
              currentUserId={user?.id ?? ""}
              onAction={handleSwapAction}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <h3 className="text-xl font-semibold text-slate-800">No swaps here</h3>
          <p className="mt-2 text-sm text-slate-600">{noSwapsMessage}</p>
          {activeTab === "outgoing" && (
            <Link
              to="/browse"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--rs-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Browse Items <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
