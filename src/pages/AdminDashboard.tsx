import { useEffect, useState } from "react";
import { adminApi, type Booking } from "@/lib/api";

type Overview = {
  stats: Record<string, number>;
  latestBookings: Booking[];
  topCategories: { _id: string; total: number }[];
  disputes: Array<{
    _id: string;
    status: string;
    description: string;
    updatedAt: string;
  }>;
};

export default function AdminDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .overview()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load admin overview.")
      );
  }, []);

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-center text-sm text-red-500">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-center text-sm text-slate-500">Loading admin overview…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
          Admin & Analytics
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Platform overview</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Key metrics pulled from MongoDB. Extend this dashboard with more filters as additional
          modules roll out.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(data.stats).map(([key, value]) => (
          <article key={key} className="rounded-2xl border border-emerald-100 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">{key}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Latest bookings
          </p>
          <div className="mt-4 space-y-3">
            {data.latestBookings.map((booking) => (
              <article key={booking._id} className="rounded-2xl border border-emerald-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{booking.item.title}</p>
                <p className="text-xs text-slate-500">
                  {booking.renter?.email ?? "renter"} • {booking.status}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Top categories
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {data.topCategories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center justify-between rounded-2xl border border-emerald-50 px-4 py-2"
              >
                <span>{cat._id}</span>
                <span className="text-slate-400">{cat.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Disputes
        </p>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {data.disputes.map((dispute) => (
            <article key={dispute._id} className="rounded-2xl border border-emerald-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{dispute.description}</p>
              <p className="text-xs text-emerald-500">{dispute.status}</p>
              <p className="text-xs text-slate-400">
                Updated {new Date(dispute.updatedAt).toLocaleString()}
              </p>
            </article>
          ))}
          {!data.disputes.length && (
            <p className="text-sm text-slate-500">No disputes logged yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
