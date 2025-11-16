import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, MapPin, Star, Clock4, Filter, Search } from "lucide-react";
import { bookingsApi, itemsApi, type Item } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ItemCard } from "@/components/ItemCard";
import { useDebounce } from "@/hooks/useDebounce";

const chips = [
  { label: "All gear", category: undefined },
  { label: "Photography", category: "Photography" },
  { label: "Fashion", category: "Fashion" },
  { label: "Events", category: "Events" },
  { label: "Outdoors", category: "Outdoors" },
  { label: "DIY", category: "DIY" },
];

export default function Browse() {
  const [activeChip, setActiveChip] = useState(chips[0].label);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingItem, setBookingItem] = useState<Item | null>(null);
  const [bookingForm, setBookingForm] = useState({ startDate: "", endDate: "" });
  const [bookingStatus, setBookingStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params: Record<string, string | boolean> = {};
    const category = chips.find((chip) => chip.label === activeChip)?.category;
    if (category) params.category = category;
    if (filters.location) params.location = filters.location;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (debouncedSearchTerm) params.q = debouncedSearchTerm;

    setLoading(true);
    itemsApi
      .list(Object.keys(params).length ? params : undefined)
      .then((res) => setItems(res.items))
      .finally(() => setLoading(false));
  }, [activeChip, filters, debouncedSearchTerm]);

  const openBookingModal = (item: Item) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/rent" } } });
      return;
    }
    setBookingItem(item);
    setBookingForm({ startDate: "", endDate: "" });
    setBookingStatus(null);
  };

  const submitBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!bookingItem) return;
    setBookingStatus(null);
    if (!bookingForm.startDate || !bookingForm.endDate) {
      setBookingStatus({ type: "error", message: "Select start and end dates." });
      return;
    }

    try {
      await bookingsApi.create({
        itemId: bookingItem._id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        deposit: bookingItem.deposit,
      });
      setBookingStatus({ type: "success", message: "Booking requested! Owner will approve shortly." });
    } catch (error) {
      setBookingStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to request booking.",
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--rs-primary)]">
          Rentals marketplace
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Browse trusted listings nearby
        </h1>
        <p className="text-base text-slate-500">
          Filter by what matters most—our Phase 4 scope covers the Renting module first.
        </p>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                chip.label === activeChip
                  ? "border-[var(--rs-primary)] bg-[var(--rs-primary)]/10 text-[var(--rs-primary)]"
                  : "border-emerald-100 text-slate-500 hover:border-[var(--rs-primary)]/40"
              }`}
              onClick={() => setActiveChip(chip.label)}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[var(--rs-primary)] hover:text-[var(--rs-primary)]">
          <SlidersHorizontal size={16} />
          Advanced filters
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Filter size={16} />
            Quick filters
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                <input
                  className="w-full rounded-2xl border border-emerald-100 px-10 py-2 text-sm"
                  placeholder="Item name, keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">Location</label>
              <input
                className="w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                placeholder="City or area"
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">Price per day</label>
              <div className="flex gap-2">
                <input
                  className="w-1/2 rounded-2xl border border-emerald-100 px-3 py-2 text-sm"
                  placeholder="Min"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                />
                <input
                  className="w-1/2 rounded-2xl border border-emerald-100 px-3 py-2 text-sm"
                  placeholder="Max"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
            </div>
            <button className="w-full rounded-2xl border border-emerald-50 px-4 py-3 text-left text-xs text-slate-500 transition hover:border-[var(--rs-primary)]">
              Availability calendar (coming soon)
            </button>
          </div>
          <div className="rounded-2xl border border-dashed border-emerald-200 p-4 text-center text-xs text-slate-500">
            Saved filters & alerts will appear here once user preferences ship.
          </div>
        </aside>
        <div className="space-y-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-emerald-50 bg-white p-4 shadow-sm">
                  <div className="aspect-video animate-pulse rounded-2xl bg-slate-200" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded-md bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((listing) => (
                <ItemCard key={listing._id} item={listing} />
              ))}
            </div>
          )}
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Map & availability grid</h3>
            <p className="mt-2 text-sm text-slate-600">
              Coming soon — this section will stream paginated inventory via React Query, include a
              small map preview, and refresh when filters change.
            </p>
          </div>
        </div>
      </div>

      {bookingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Book “{bookingItem.title}”
                </h3>
                <p className="text-xs text-slate-500">{bookingItem.location}</p>
              </div>
              <button
                className="rounded-full border border-emerald-100 px-3 py-1 text-xs text-slate-500"
                onClick={() => setBookingItem(null)}
              >
                Close
              </button>
            </div>
            <form className="mt-4 space-y-4" onSubmit={submitBooking}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">Start date</label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                  value={bookingForm.startDate}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">End date</label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                  value={bookingForm.endDate}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="rounded-2xl bg-emerald-50/60 p-3 text-xs text-slate-600">
                Deposit due at pickup: ${bookingItem.deposit}. Messaging + approvals happen in the
                dashboard.
              </div>
              {bookingStatus && (
                <p
                  className={`text-sm ${
                    bookingStatus.type === "success" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {bookingStatus.message}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-2xl bg-[var(--rs-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Submit request
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

