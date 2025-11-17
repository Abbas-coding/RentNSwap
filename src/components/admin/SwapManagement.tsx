import { useEffect, useState } from "react";
import { adminApi, type Swap } from "@/lib/api";

export default function SwapManagement() {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getAllSwaps()
      .then((res) => setSwaps(res.swaps))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load swaps.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <p className="text-center text-sm text-red-500">{error}</p>;
  }

  if (loading) {
    return <p className="text-center text-sm text-slate-500">Loading swaps…</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Proposer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Receiver
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {swaps.map((swap) => (
            <tr key={swap._id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                {swap.proposer?.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {swap.receiver?.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{swap.status}</td>
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
