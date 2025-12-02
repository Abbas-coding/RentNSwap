import { useEffect, useMemo, useState } from "react";
import { bookingsApi, itemsApi, type Booking } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Package, Calendar, Clock } from "lucide-react";

type BookingTab = "myRentals" | "myListingsBookings";

const bookingActions: Record<string, { label: string; value: string; style: string }[]> = {
  pending: [
    { label: "Approve", value: "approved", style: "bg-emerald-600 text-white hover:bg-emerald-700" },
    { label: "Decline", value: "cancelled", style: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" },
  ],
  approved: [{ label: "Mark Active", value: "active", style: "bg-blue-600 text-white hover:bg-blue-700" }],
  active: [{ label: "Complete", value: "completed", style: "bg-slate-900 text-white hover:bg-slate-800" }],
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
  
  const statusConfig = useMemo(() => {
    switch (booking.status) {
      case "pending": return { color: "bg-amber-100 text-amber-700", label: "Pending" };
      case "approved": return { color: "bg-blue-100 text-blue-700", label: "Approved" };
      case "active": return { color: "bg-emerald-100 text-emerald-700", label: "Active" };
      case "completed": return { color: "bg-slate-100 text-slate-700", label: "Completed" };
      case "cancelled": return { color: "bg-red-100 text-red-700", label: "Cancelled" };
      default: return { color: "bg-slate-100 text-slate-500", label: booking.status };
    }
  }, [booking.status]);

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="mb-4 flex items-start justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
          <span className="text-xs text-slate-400">
            {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
          </span>
        </div>
        
        <Link to={`/items/${booking.item._id}`} className="group mb-2 block">
          <h3 className="font-bold text-slate-900 group-hover:text-[var(--rs-primary)] group-hover:underline">
            {booking.item.title}
          </h3>
        </Link>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <span>
              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-slate-400" />
            <span>
              {isOwnerView 
                ? `Renter: ${booking.renter?.email ?? "Unknown"}` 
                : `Owner: ${booking.owner?.email ?? "Unknown"}`}
            </span>
          </div>
        </div>
      </div>

      {isOwnerView && actions.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-4 flex gap-2">
          {actions.map((action) => (
            <button
              key={action.value}
              onClick={() => onStatusChange(booking, action.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${action.style}`}
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
  const [activeTab, setActiveTab] = useState<BookingTab>("myRentals");
  const [myRentals, setMyRentals] = useState<Booking[]>([]);
  const [myListingsBookings, setMyListingsBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingCount, setListingCount] = useState(0);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
        bookingsApi.list("renter"), 
        bookingsApi.list("owner"),
        itemsApi.list({ owned: true })
    ])
      .then(([renterBookings, ownerBookings, ownedItems]) => {
        setMyRentals(renterBookings.bookings);
        setMyListingsBookings(ownerBookings.bookings);
        setListingCount(ownedItems.items.length);
      })
      .catch((error) => {
        console.error("Failed to fetch dashboard data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (booking: Booking, nextStatus: string) => {
    try {
      const res = await bookingsApi.updateStatus(booking._id, nextStatus);
      setMyListingsBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? res.booking : b))
      );
      setActionNotice(`Booking status updated to ${nextStatus}.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (error) {
      setActionNotice("Failed to update status.");
    }
  };

  const currentBookings = activeTab === "myRentals" ? myRentals : myListingsBookings;

  if (loading) {
      return (
          <div className="mx-auto max-w-6xl px-4 py-12">
              <div className="h-32 w-full animate-pulse rounded-2xl bg-slate-200 mb-8"></div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1,2,3].map(i => <div key={i} className="h-48 w-full animate-pulse rounded-2xl bg-slate-200"></div>)}
              </div>
          </div>
      )
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)]">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Header & Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto_auto]">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Welcome back to your activity center.</p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-4 shadow-sm border border-slate-200 text-center min-w-[140px]">
                <p className="text-xs font-bold uppercase text-slate-400">My Rentals</p>
                <p className="text-2xl font-bold text-slate-900">{myRentals.length}</p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-4 shadow-sm border border-slate-200 text-center min-w-[140px]">
                <p className="text-xs font-bold uppercase text-slate-400">Active Listings</p>
                <p className="text-2xl font-bold text-emerald-600">{listingCount}</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 rounded-xl bg-white p-1 shadow-sm border border-slate-200 w-fit">
            <button
                onClick={() => setActiveTab("myRentals")}
                className={`rounded-lg px-6 py-2.5 text-sm font-bold transition ${
                    activeTab === "myRentals" 
                    ? "bg-[var(--rs-primary)] text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
            >
                Rentals
            </button>
            <button
                onClick={() => setActiveTab("myListingsBookings")}
                className={`rounded-lg px-6 py-2.5 text-sm font-bold transition ${
                    activeTab === "myListingsBookings" 
                    ? "bg-[var(--rs-primary)] text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
            >
                Requests
            </button>
        </div>

        {actionNotice && (
            <div className="mb-6 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">
                {actionNotice}
            </div>
        )}

        {/* Grid */}
        {currentBookings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                    {activeTab === "myRentals" ? <Package size={32} className="text-slate-400" /> : <Leaf size={32} className="text-slate-400" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900">No bookings found</h3>
                <p className="mt-2 max-w-xs text-slate-500">
                    {activeTab === "myRentals" 
                        ? "You haven't rented anything yet." 
                        : "You don't have any booking requests on your listings."}
                </p>
                <div className="mt-6">
                    {activeTab === "myRentals" ? (
                        <Link to="/browse" className="rounded-xl bg-[var(--rs-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0ea5e9]">
                            Browse Listings
                        </Link>
                    ) : (
                        <Link to="/list" className="rounded-xl bg-[var(--rs-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0ea5e9]">
                            Create Listing
                        </Link>
                    )}
                </div>
            </div>
        )}
      </section>
    </div>
  );
}
