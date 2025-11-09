import { useEffect, useMemo, useState } from "react";
import { bookingsApi, type Booking } from "@/lib/api";

const ownerWidgets = [
  {
    title: "Pending approvals",
    description: "Incoming bookings or swap proposals awaiting your decision.",
    key: "pending",
  },
  { title: "Active rentals", description: "Keep tabs on return dates and deposits.", key: "active" },
  { title: "Completed", description: "Wrap reviews and deposit releases.", key: "completed" },
];

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    bookingsApi
      .list("owner")
      .then((res) => setBookings(res.bookings))
      .catch(() => setBookings([]));
  }, []);

  const checklist = useMemo(() => {
    return bookings.slice(0, 3).map(
      (booking) =>
        `Review ${booking.renter?.email ?? "renter"} request for ${booking.item.title} (${booking.status}).`
    );
  }, [bookings]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
          Owner dashboard
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Operational overview</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Powered by real bookings pulled from MongoDB. As Item & Booking services expand, this page
          will surface deeper analytics.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ownerWidgets.map((widget) => (
          <article key={widget.title} className="rounded-2xl border border-emerald-100 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">{widget.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{widget.description}</p>
            <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 p-4 text-sm text-slate-500">
              {bookings.filter((b) => b.status === widget.key).length} records
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Upcoming bookings
            </p>
            <span className="text-xs text-slate-400">{bookings.length} total</span>
          </div>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article key={booking._id} className="rounded-2xl border border-emerald-50 p-4">
                <div className="flex flex-wrap items-center justify-between text-sm font-semibold text-slate-900">
                  <p>{booking.item.title}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
                    {booking.status}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  {booking.renter?.email ?? "renter"} •{" "}
                  {new Date(booking.startDate).toLocaleDateString()} -{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </article>
            ))}
            {bookings.length === 0 && (
              <p className="text-sm text-slate-500">No bookings yet. Create one from the Browse page.</p>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Owner checklist
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {checklist.length ? (
              checklist.map((task) => (
                <li key={task} className="rounded-2xl border border-emerald-50 p-3">
                  {task}
                </li>
              ))
            ) : (
              <li className="rounded-2xl border border-emerald-50 p-3 text-slate-500">
                No tasks right now—you're all caught up.
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
