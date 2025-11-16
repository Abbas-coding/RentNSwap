import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { type Item, API_BASE_URL } from "@/lib/api";

interface ItemCardProps {
  item: Item;
  currentUserId?: string;
  onBookClick: (item: Item) => void;
  onSwapClick: (item: Item) => void;
}

export function ItemCard({ item, currentUserId, onBookClick, onSwapClick }: ItemCardProps) {
  const imageUrl =
    item.images && item.images.length > 0
      ? `${API_BASE_URL}/${item.images[0]}`
      : "/placeholder.svg"; // A fallback image

  const isOwner = currentUserId === item.owner?._id;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-50 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <Link to={`/items/${item._id}`} className="block aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-emerald-400">
          <span>{item.swapEligible ? "Swap eligible" : "Rental only"}</span>
          <span className="text-slate-400">{item.location}</span>
        </div>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          <Link to={`/items/${item._id}`}>{item.title}</Link>
        </h3>
        <p className="mt-1 text-sm text-slate-500">${item.pricePerDay}/day</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Star size={14} className="text-amber-400" />
            {item.rating?.toFixed(1) ?? "New"}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} />
            {item.category}
          </span>
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <Link
            to={`/items/${item._id}`}
            className="flex-1 rounded-2xl border border-emerald-100 px-3 py-2 text-center text-xs font-semibold text-slate-600 transition hover:border-[var(--rs-primary)]"
          >
            View details
          </Link>
          <button
            className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
              isOwner
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : "border border-emerald-100 text-[var(--rs-primary)] hover:border-[var(--rs-primary)]"
            }`}
            onClick={() => onBookClick(item)}
            disabled={isOwner}
          >
            Book item
          </button>
          {item.swapEligible && (
            <button
              className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                isOwner
                  ? "cursor-not-allowed bg-slate-50 text-slate-400"
                  : "border border-emerald-100 text-slate-600 hover:border-[var(--rs-primary)]"
              }`}
              disabled={isOwner}
              onClick={() => onSwapClick(item)}
            >
              Swap
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
