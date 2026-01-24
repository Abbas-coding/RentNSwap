import { useEffect, useState } from "react";
import { adminApi, type Item, API_BASE_URL } from "@/lib/api";
import { Search, MoreVertical, MapPin, ArrowRightLeft } from "lucide-react";

export default function ListingManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getAllListings()
      .then((res) => {
        setItems(res.items);
        setFilteredItems(res.items);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load listings.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.owner?.email?.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings..."
            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-[var(--rs-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--rs-primary)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-900">{filteredItems.length}</span> listings
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading listings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Listing</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="transition hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                          <img 
                            src={item.images?.[0] ? `${API_BASE_URL}/${item.images[0]}` : "/placeholder.svg"} 
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.title}</div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={10} /> {item.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {item.owner?.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      ${item.pricePerDay}<span className="text-xs font-normal text-slate-500">/day</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.swapEligible ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <ArrowRightLeft size={12} /> Swap + Rent
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          Rent Only
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                      No listings found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

