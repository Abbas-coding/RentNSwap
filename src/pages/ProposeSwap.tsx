import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { itemsApi, swapsApi, type Item, API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRightLeft, CheckCircle2 } from "lucide-react";

// A smaller card for the item selection grid
function ItemSelectionCard({
  item,
  isSelected,
  onSelect,
}: {
  item: Item;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const imageUrl = item.images?.[0] ? `${API_BASE_URL}/${item.images[0]}` : "/placeholder.svg";
  return (
    <button
      onClick={onSelect}
      className={`relative w-full overflow-hidden rounded-2xl border-2 text-left transition ${
        isSelected ? "border-[var(--rs-primary)]" : "border-transparent hover:border-slate-300"
      }`}
    >
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-white text-[var(--rs-primary)]">
          <CheckCircle2 size={24} />
        </div>
      )}
      <div className="aspect-square">
        <img src={imageUrl} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="bg-white p-3">
        <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
        <p className="text-xs text-slate-500">{item.category}</p>
      </div>
    </button>
  );
}

// A larger card for the main comparison view
function SwapDisplayCard({ item, type }: { item: Item | null; type: "offer" | "receive" }) {
  const placeholderText = type === "offer" ? "Select your item below" : "Item to receive";
  const imageUrl = item?.images?.[0] ? `${API_BASE_URL}/${item.images[0]}` : "/placeholder.svg";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="aspect-video overflow-hidden rounded-lg">
        <img src={`${imageUrl ?? ""} `} alt={item?.title ?? placeholderText} className="h-full w-full object-cover" />
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {type === "offer" ? "Your Item" : "Their Item"}
        </p>
        <h3 className="truncate text-lg font-bold text-slate-900">{item?.title ?? placeholderText}</h3>
        {item && (
          <Link
            to={`/items/${item._id}`}
            className="text-xs font-medium text-emerald-600 hover:underline"
            // target="_blank"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ProposeSwap() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [receiverItem] = useState<Item | null>(location.state?.item);
  const [ownedItems, setOwnedItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [cashAdjustment, setCashAdjustment] = useState("0");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!location.state?.item) {
      navigate("/browse");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (isAuthenticated && receiverItem) {
      itemsApi
        .list({ owned: true })
        .then((res) => {
          const swappableItems = res.items.filter(
            (item) => item.swapEligible && item._id !== receiverItem._id
          );
          setOwnedItems(swappableItems);
        })
        .catch(() => setOwnedItems([]));
    }
  }, [isAuthenticated, receiverItem]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (!receiverItem || !selectedItem) {
      setStatus({ type: "error", message: "You must select an item to offer." });
      return;
    }

    try {
      await swapsApi.create({
        proposerItemId: selectedItem._id,
        receiverItemId: receiverItem._id,
        receiverId: receiverItem.owner?._id ?? "",
        cashAdjustment: Number(cashAdjustment),
        notes,
      });
      setStatus({ type: "success", message: "Swap proposal sent successfully!" });
      setTimeout(() => navigate("/swap"), 2000);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send swap proposal.",
      });
    }
  };

  if (!receiverItem) {
    return null; // Or a loading spinner
  }

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Propose a Swap</h1>
          <p className="text-lg text-slate-600">
            Select one of your items to propose a swap with{" "}
            <span className="font-semibold">{receiverItem.owner?.email}</span>.
          </p>
        </div>

        {/* Main Comparison View */}
        <div className="relative my-10 grid items-start gap-6 md:grid-cols-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowRightLeft size={32} className="text-slate-400" />
          </div>
          <SwapDisplayCard item={selectedItem} type="offer" />
          <SwapDisplayCard item={receiverItem} type="receive" />
        </div>

        {/* Item Selector */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">1. Choose Your Item to Offer</h2>
          {ownedItems.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {ownedItems.map((item) => (
                <ItemSelectionCard
                  key={item._id}
                  item={item}
                  isSelected={selectedItem?._id === item._id}
                  onSelect={() => setSelectedItem(item)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-600">You have no other swap-eligible items to offer.</p>
              <Link to="/list" className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:underline">
                + List a New Item
              </Link>
            </div>
          )}
        </div>

        {/* Form and Submission */}
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">2. Finalize Your Offer</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="cashAdjustment" className="block text-sm font-medium text-slate-700">
                Add Cash (Optional)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="cashAdjustment"
                  name="cashAdjustment"
                  value={cashAdjustment}
                  onChange={(e) => setCashAdjustment(e.target.value)}
                  className="block w-full rounded-lg border-slate-300 py-2 pl-7 pr-4 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Use a negative number to request cash from the other party.
              </p>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
                Add a Message (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="Any comments on item condition or why you'd like to swap?"
              />
            </div>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-6">
            {status && (
              <p className={`mb-4 text-center text-sm font-medium ${
                  status.type === "success" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {status.message}
              </p>
            )}
            <button
              type="submit"
              disabled={!selectedItem}
              className="w-full rounded-xl bg-[var(--rs-primary)] py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              Send Swap Proposal
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

