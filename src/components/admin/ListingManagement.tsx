import { useEffect, useState } from "react";
import { adminApi, type Item } from "@/lib/api";

export default function ListingManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getAllListings()
      .then((res) => setItems(res.items))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load listings.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <p className="text-center text-sm text-red-500">{error}</p>;
  }

  if (loading) {
    return <p className="text-center text-sm text-slate-500">Loading listings…</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Owner
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Price/Day
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Swap Eligible
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {items.map((item) => (
            <tr key={item._id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{item.title}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{item.owner?.email}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">${item.pricePerDay}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {item.swapEligible ? "Yes" : "No"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <button className="text-emerald-600 hover:text-emerald-900">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
