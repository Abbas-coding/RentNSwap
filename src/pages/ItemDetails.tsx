import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { itemsApi, reviewsApi, bookingsApi, type Item, type Review, type Booking } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ItemDetails() {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{ count: number; average: number }>({ count: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ bookingId: "", rating: "5", comment: "" });
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [eligibleBookings, setEligibleBookings] = useState<Booking[]>([]);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    itemsApi
      .get(itemId)
      .then((res) => {
        setItem(res.item);
        setReviews(res.reviews);
        setStats(res.reviewStats);
      })
      .finally(() => setLoading(false));
  }, [itemId]);

  useEffect(() => {
    if (!isAuthenticated || !itemId) return;
    bookingsApi
      .list("renter")
      .then((res) =>
        setEligibleBookings(
          res.bookings.filter(
            (booking) => booking.item._id === itemId && booking.status === "completed"
          )
        )
      )
      .catch(() => setEligibleBookings([]));
  }, [isAuthenticated, itemId]);

  const averageLabel = useMemo(
    () => (stats.count ? `${stats.average.toFixed(1)} / 5 (${stats.count} reviews)` : "No reviews yet"),
    [stats]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!itemId || !form.bookingId) {
      setFormStatus({ type: "error", message: "Select a completed booking to review." });
      return;
    }
    setFormStatus(null);
    try {
      await reviewsApi.create({
        itemId,
        bookingId: form.bookingId,
        rating: Number(form.rating),
        comment: form.comment,
      });
      setFormStatus({ type: "success", message: "Review submitted!" });
      const refreshed = await itemsApi.get(itemId);
      setReviews(refreshed.reviews);
      setStats(refreshed.reviewStats);
      setForm((prev) => ({ ...prev, comment: "" }));
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to submit review.",
      });
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-center text-sm text-slate-500">Loading item…</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-center text-sm text-slate-500">Item not found.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100" />
            <p className="text-sm text-slate-500">Category: {item.category}</p>
            <p className="text-sm text-slate-500">Location: {item.location}</p>
            <p className="text-sm text-slate-500">Price: ${item.pricePerDay}/day</p>
            <p className="text-sm text-slate-500">Deposit: ${item.deposit}</p>
            <p className="text-xs uppercase tracking-wide text-emerald-500">{averageLabel}</p>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{item.title}</h1>
            <p className="mt-4 whitespace-pre-line text-sm text-slate-600">{item.description}</p>
            <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 p-4 text-sm text-slate-500">
              Availability: {item.availability?.length ? item.availability.join(", ") : "Flexible"}
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recent reviews</h2>
            <div className="mt-4 space-y-4">
              {reviews.length ? (
                reviews.map((review) => (
                  <article key={review._id} className="rounded-2xl border border-emerald-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {typeof review.fromUser === "string"
                        ? review.fromUser
                        : review.fromUser?.email ?? "User"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()} • {review.rating}/5
                    </p>
                    {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500">Be the first to review this item.</p>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Leave a review</h3>
            {isAuthenticated ? (
              eligibleBookings.length ? (
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-slate-500">
                      Completed booking
                    </label>
                    <select
                      className="w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                      value={form.bookingId}
                      onChange={(e) => setForm((prev) => ({ ...prev, bookingId: e.target.value }))}
                    >
                      <option value="">Select booking</option>
                      {eligibleBookings.map((booking) => (
                        <option key={booking._id} value={booking._id}>
                          {new Date(booking.startDate).toLocaleDateString()} -{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-slate-500">Rating</label>
                    <select
                      className="w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                      value={form.rating}
                      onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-slate-500">
                      Comment
                    </label>
                    <textarea
                      className="h-24 w-full rounded-2xl border border-emerald-100 px-4 py-2 text-sm"
                      value={form.comment}
                      onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                    />
                  </div>
                  {formStatus && (
                    <p
                      className={`text-sm ${
                        formStatus.type === "success" ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {formStatus.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[var(--rs-primary)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Submit review
                  </button>
                </form>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  Complete a booking for this item to leave a review.
                </p>
              )
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Sign in to review. Completed bookings will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
