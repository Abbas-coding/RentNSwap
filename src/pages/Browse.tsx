import { useEffect, useState } from "react";
import { SlidersHorizontal, MapPin, Star, Clock4, Filter } from "lucide-react";
import { itemsApi, type Item } from "@/lib/api";

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
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = chips.find((chip) => chip.label === activeChip)?.category;
    setLoading(true);
    itemsApi
      .list(category ? { category } : undefined)
      .then((res) => setItems(res.items))
      .finally(() => setLoading(false));
  }, [activeChip]);

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
            <button className="w-full rounded-2xl border border-emerald-50 px-4 py-3 text-left transition hover:border-[var(--rs-primary)]">
              <p className="font-semibold text-slate-800">Location</p>
              <p className="text-xs text-slate-500">Detect current city</p>
            </button>
            <button className="w-full rounded-2xl border border-emerald-50 px-4 py-3 text-left transition hover:border-[var(--rs-primary)]">
              <p className="font-semibold text-slate-800">Availability</p>
              <p className="text-xs text-slate-500">Calendar component coming soon</p>
            </button>
            <button className="w-full rounded-2xl border border-emerald-50 px-4 py-3 text-left transition hover:border-[var(--rs-primary)]">
              <p className="font-semibold text-slate-800">Price per day</p>
              <p className="text-xs text-slate-500">Slider placeholder</p>
            </button>
            <button className="w-full rounded-2xl border border-emerald-50 px-4 py-3 text-left transition hover:border-[var(--rs-primary)]">
              <p className="font-semibold text-slate-800">Swap eligible</p>
              <p className="text-xs text-slate-500">Toggle filters for swap-friendly listings</p>
            </button>
          </div>
          <div className="rounded-2xl border border-dashed border-emerald-200 p-4 text-center text-xs text-slate-500">
            Saved filters & alerts will appear here once user preferences ship.
          </div>
        </aside>
        <div className="space-y-6">
          {loading ? (
            <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
              Loading listings…
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((listing) => (
                <article key={listing._id} className="rounded-3xl border border-emerald-50 bg-white p-4 shadow-sm">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100" />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-emerald-400">
                      <span>{listing.swapEligible ? "Swap eligible" : "Rental only"}</span>
                      <span className="text-slate-400">{listing.location}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
                    <p className="text-sm text-slate-500">${listing.pricePerDay}/day</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Star size={14} className="text-amber-400" />
                        {listing.rating?.toFixed(1) ?? "4.8"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {listing.category}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock4 size={14} />
                        1h response
                      </span>
                    </div>
                  </div>
                </article>
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
    </section>
  );
}
