import { useEffect, useMemo, useState } from "react";
import { swapsApi, type Swap } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { SwapOfferCard } from "@/components/SwapOfferCard";
import { Link } from "react-router-dom";
import { ArrowRightLeft, Inbox } from "lucide-react";

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
    if (!user?._id) return { incomingSwaps: [], outgoingSwaps: [] };
    
    const incoming = swaps.filter((s) => s.receiver?._id === user._id);
    const outgoing = swaps.filter((s) => s.proposer?._id === user._id);
    
    return { incomingSwaps: incoming, outgoingSwaps: outgoing };
  }, [swaps, user]);

  const handleSwapAction = async (
    swap: Swap,
    payload: { status: string; cashAdjustment?: number; notes?: string }
  ) => {
    try {
      await swapsApi.updateStatus(swap._id, payload);
      setActionMessage(`Swap status updated to ${payload.status}.`);
      setTimeout(() => setActionMessage(null), 3000);
      refreshSwaps();
    } catch (error) {
      setActionMessage(
        error instanceof Error ? error.message : "Unable to update swap at this time."
      );
    }
  };

  const currentSwaps = activeTab === "incoming" ? incomingSwaps : outgoingSwaps;

  if (loading) {
      return (
          <div className="mx-auto max-w-6xl px-4 py-12">
              <div className="h-32 w-full animate-pulse rounded-2xl bg-slate-200 mb-8"></div>
              <div className="grid gap-6 sm:grid-cols-2">
                  {[1,2].map(i => <div key={i} className="h-64 w-full animate-pulse rounded-2xl bg-slate-200"></div>)}
              </div>
          </div>
      )
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)]">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">Swap Hub</h1>
            <p className="text-slate-600">Manage your barter proposals and negotiations.</p>
        </div>

        <div className="mb-8 flex gap-2 rounded-xl bg-white p-1 shadow-sm border border-slate-200 w-fit">
            <button
                onClick={() => setActiveTab("incoming")}
                className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition ${
                    activeTab === "incoming" 
                    ? "bg-[var(--rs-primary)] text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
            >
                <Inbox size={16} />
                Incoming ({incomingSwaps.length})
            </button>
            <button
                onClick={() => setActiveTab("outgoing")}
                className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition ${
                    activeTab === "outgoing" 
                    ? "bg-[var(--rs-primary)] text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
            >
                <ArrowRightLeft size={16} />
                Outgoing ({outgoingSwaps.length})
            </button>
        </div>

        {actionMessage && (
            <div className="mb-6 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">
                {actionMessage}
            </div>
        )}

        {currentSwaps.length > 0 ? (
            <div className="grid gap-6">
                {currentSwaps.map((swap) => (
                    <SwapOfferCard
                        key={swap._id}
                        swap={swap}
                        currentUserId={user?._id || ""}
                        onAction={handleSwapAction}
                    />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                    <ArrowRightLeft size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No swaps found</h3>
                <p className="mt-2 max-w-xs text-slate-500">
                    {activeTab === "incoming" 
                        ? "You don't have any incoming swap offers." 
                        : "You haven't proposed any swaps yet."}
                </p>
                {activeTab === "outgoing" && (
                    <div className="mt-6">
                        <Link to="/browse" className="rounded-xl bg-[var(--rs-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0ea5e9]">
                            Browse to Swap
                        </Link>
                    </div>
                )}
            </div>
        )}
      </section>
    </div>
  );
}
