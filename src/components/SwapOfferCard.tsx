import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightLeft, Coins } from "lucide-react";
import { type Swap, API_BASE_URL } from "@/lib/api";

interface SwapOfferCardProps {
  swap: Swap;
  currentUserId: string;
  onAction: (
    swap: Swap,
    payload: { status: string; cashAdjustment?: number; notes?: string }
  ) => void;
}

function SwapItem({ item }: { item: Swap["proposerItem"] }) {
  if (!item) return null;
  const imageUrl =
    item.images && item.images.length > 0
      ? `${item.images[0]}`
      : "/placeholder.svg";

  return (
    <div className="flex items-center gap-3">
      <img
        src={imageUrl}
        alt={item.title}
        className="h-12 w-12 rounded-lg object-cover"
      />
      <div>
        <p className="text-sm font-semibold text-slate-700">{item.title}</p>
        <Link
          to={`/items/${item._id}`}
          className="text-xs text-slate-500 hover:underline"
        >
          View Item
        </Link>
      </div>
    </div>
  );
}

export function SwapOfferCard({ swap, currentUserId, onAction }: SwapOfferCardProps) {
  const [isCountering, setIsCountering] = useState(false);
  const [counterValue, setCounterValue] = useState(
    String(swap.cashAdjustment ?? 0)
  );

  const { isReceiver, isProposer, userRole, otherUser } = useMemo(() => {
    const isProposer = swap.proposer?._id === currentUserId;
    const isReceiver = swap.receiver?._id === currentUserId;
    let userRole: "proposer" | "receiver" | "observer" = "observer";
    if (isProposer) userRole = "proposer";
    if (isReceiver) userRole = "receiver";
    const otherUser = isProposer ? swap.receiver : swap.proposer;
    return { isReceiver, isProposer, userRole, otherUser };
  }, [swap, currentUserId]);

  const availableActions = useMemo(() => {
    if (swap.status === "pending" && isReceiver) {
      return ["accept", "counter", "reject"];
    }
    if (swap.status === "counter" && isProposer) {
      return ["accept", "reject"];
    }
    return [];
  }, [swap.status, isReceiver, isProposer]);

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAction(swap, {
      status: "counter",
      cashAdjustment: Number(counterValue) || 0,
    });
    setIsCountering(false);
  };

  const statusConfig = useMemo(() => {
    switch (swap.status) {
      case "pending":
        return { text: "Pending", color: "text-yellow-600 bg-yellow-50" };
      case "accepted":
        return { text: "Accepted", color: "text-green-600 bg-green-50" };
      case "rejected":
        return { text: "Rejected", color: "text-red-600 bg-red-50" };
      case "counter":
        return { text: "Countered", color: "text-blue-600 bg-blue-50" };
      default:
        return { text: swap.status, color: "text-slate-600 bg-slate-50" };
    }
  }, [swap.status]);

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">
            {userRole === "proposer" ? "Your Offer To" : "Offer From"}{" "}
            <span className="font-semibold text-slate-700">
              {otherUser?.email ?? "..."}
            </span>
          </p>
          <p className="text-xs text-slate-400">
            Last updated: {new Date(swap.updatedAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}
        >
          {statusConfig.text}
        </span>
      </div>

      <div className="my-4 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <SwapItem item={swap.proposerItem} />
        <ArrowRightLeft
          size={20}
          className="mx-auto text-slate-400"
        />
        <SwapItem item={swap.receiverItem} />
      </div>

      {swap.cashAdjustment !== 0 && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-2 text-sm">
          <Coins size={16} className="text-amber-500" />
          <span className="font-semibold text-slate-700">
            Cash Adjustment: ${swap.cashAdjustment}
          </span>
        </div>
      )}

      {availableActions.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-xs text-slate-600">
          <div className="flex flex-wrap gap-2">
            {availableActions.includes("accept") && (
              <button
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-100"
                onClick={() => onAction(swap, { status: "accepted" })}
              >
                Accept
              </button>
            )}
            {availableActions.includes("reject") && (
              <button
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-700 transition hover:bg-red-100"
                onClick={() => onAction(swap, { status: "rejected" })}
              >
                Reject
              </button>
            )}
            {availableActions.includes("counter") && (
              <button
                className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-200"
                onClick={() => setIsCountering(!isCountering)}
              >
                Counter Offer
              </button>
            )}
          </div>
          {isCountering && (
            <form
              className="flex items-center gap-2 rounded-lg bg-slate-50 p-2"
              onSubmit={handleCounterSubmit}
            >
              <label
                htmlFor={`counter-${swap._id}`}
                className="text-xs font-medium text-slate-600"
              >
                New Amount:
              </label>
              <input
                id={`counter-${swap._id}`}
                type="number"
                className="w-24 rounded-md border-slate-200 px-2 py-1 text-xs"
                value={counterValue}
                onChange={(e) => setCounterValue(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-md bg-[var(--rs-primary)] px-3 py-1 text-xs font-semibold text-white"
              >
                Send Counter
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}
