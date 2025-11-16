import { useEffect, useMemo, useState } from "react";
import { bookingsApi, type Booking } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";

type BookingTab = "myRentals" | "myListingsBookings";

const bookingActions: Record<string, { label: string; value: string }[]> = {
  pending: [
    { label: "Approve", value: "approved" },
    { label: "Cancel", value: "cancelled" },
  ],
  approved: [{ label: "Mark active", value: "active" }],
  active: [{ label: "Complete", value: "completed" }],
};

function BookingCard({
  booking,
  isOwnerView,
  onStatusChange,
}: {
  booking: Booking;
  isOwnerView: boolean;
  onStatusChange: (booking: Booking, nextStatus: string) => void;
}) {
  const actions = isOwnerView ? bookingActions[booking.status] ?? [] : [];
  const statusColor = useMemo(() => {
    switch (booking.status) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-blue-500";
      case "active":
        return "text-green-500";
      case "completed":
        return "text-gray-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-slate-500";
    }
  }, [booking.status]);

  return (
    <article className="rounded-2xl border border-emerald-50 p-4">
      <div className="flex flex-wrap items-center justify-between text-sm font-semibold text-slate-900">
        <Link to={`/items/${booking.item._id}`} className="hover:underline">
          {booking.item.title}
        </Link>
        <p className={`text-xs font-medium uppercase tracking-wide ${statusColor}`}>
          {booking.status}
        </p>
      </div>
      <p className="text-xs text-slate-500">
        {isOwnerView ? `Renter: ${booking.renter?.email ?? "N/A"}` : `Owner: ${booking.owner?.email ?? "N/A"}`} •{" "}
        {new Date(booking.startDate).toLocaleDateString()} -{" "}
        {new Date(booking.endDate).toLocaleDateString()}
      </p>
      {isOwnerView && actions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.value}
              type="button"
              className="rounded-2xl border border-emerald-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[var(--rs-primary)] hover:text-[var(--rs-primary)]"
              onClick={() => onStatusChange(booking, action.value)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<BookingTab>("myRentals");
  const [myRentals, setMyRentals] = useState<Booking[]>([]);
  const [myListingsBookings, setMyListingsBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([bookingsApi.list("renter"), bookingsApi.list("owner")])
      .then(([renterBookings, ownerBookings]) => {
        setMyRentals(renterBookings.bookings);
        setMyListingsBookings(ownerBookings.bookings);
      })
      .catch((error) => {
        console.error("Failed to fetch bookings:", error);
        setMyRentals([]);
        setMyListingsBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (booking: Booking, nextStatus: string) => {
    try {
      const res = await bookingsApi.updateStatus(booking._id, nextStatus);
      setMyListingsBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? res.booking : b))
      );
      setActionNotice(`Booking for ${booking.item.title} updated to ${nextStatus}.`);
    } catch (error) {
      setActionNotice(
        error instanceof Error ? error.message : "Unable to update booking status right now."
      );
    }
  };

  const currentBookings = activeTab === "myRentals" ? myRentals : myListingsBookings;
  const noBookingsMessage =
    activeTab === "myRentals"
      ? "You haven't rented any items yet. Explore the Browse page to find your next rental!"
      : "No one has booked your items yet. List an item to start earning!";

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Your Activity Overview</h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Manage your rentals and bookings on your listed items.
        </p>
      </div>

      <div className="mb-6 flex space-x-4 border-b border-emerald-100">
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "myRentals"
              ? "border-b-2 border-[var(--rs-primary)] text-[var(--rs-primary)]"
              : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("myRentals")}
        >
          My Rentals
        </button>
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "myListingsBookings"
              ? "border-b-2 border-[var(--rs-primary)] text-[var(--rs-primary)]"
              : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("myListingsBookings")}
        >
          My Listings' Bookings
        </button>
      </div>

      {actionNotice && (
        <p className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-emerald-700">
          {actionNotice}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-emerald-50 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200" />
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-slate-200" />
            </div>
          ))}
        </div>
      ) : currentBookings.length > 0 ? (
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              isOwnerView={activeTab === "myListingsBookings"}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
          <h3 className="text-xl font-semibold text-slate-900">No bookings found</h3>
          <p className="mt-2 text-sm text-slate-600">{noBookingsMessage}</p>
          <div className="mt-4 flex justify-center gap-4">
            {activeTab === "myRentals" && (
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--rs-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/70 transition hover:bg-[var(--rs-primary-dark)]"
              >
                Browse Items <ArrowRight size={16} />
              </Link>
            )}
            {activeTab === "myListingsBookings" && (
              <Link
                to="/list"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--rs-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/70 transition hover:bg-[var(--rs-primary-dark)]"
              >
                List an Item <Leaf size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
