import { useEffect, useState } from "react";
import { adminApi, type Booking } from "@/lib/api";

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getAllBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load bookings.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <p className="text-center text-sm text-red-500">{error}</p>;
  }

  if (loading) {
    return <p className="text-center text-sm text-slate-500">Loading bookings…</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Item
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Renter
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Dates
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
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{booking.item.title}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{booking.renter?.email}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{booking.status}</td>
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
