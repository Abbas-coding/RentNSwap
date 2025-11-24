import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { itemsApi, reviewsApi, bookingsApi, type Item, type Review, type Booking, conversationsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = "http://localhost:4000";

export default function ItemDetails() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{ count: number; average: number }>({ count: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ bookingId: "", rating: "5", comment: "" });
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [eligibleBookings, setEligibleBookings] = useState<Booking[]>([]);

  // State for booking modal
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ startDate: "", endDate: "" });
  const [bookingStatus, setBookingStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { isAuthenticated, user } = useAuth();

  const isOwner = useMemo(() => {
    return isAuthenticated && user?._id === item?.owner?._id;
  }, [isAuthenticated, user, item]);

  const isBookingFormValid = useMemo(() => {
    const { startDate, endDate } = bookingForm;
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start < end && start >= today;
  }, [bookingForm]);

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

  const handleReviewSubmit = async (event: React.FormEvent) => {
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

  const openBookingModal = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/items/${itemId}` } } });
      return;
    }
    setBookingModalOpen(true);
    setBookingForm({ startDate: "", endDate: "" });
    setBookingStatus(null);
  };

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!item || !isBookingFormValid) return;
    setBookingStatus(null);

    try {
      await bookingsApi.create({
        itemId: item._id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        deposit: item.deposit,
      });
      setBookingStatus({ type: "success", message: "Booking requested! The owner will approve it shortly." });
      setTimeout(() => {
        setBookingModalOpen(false);
      }, 2000);
    } catch (error) {
      setBookingStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to request this booking.",
      });
    }
  };

  const handleMessageOwner = async () => {
    if (!isAuthenticated || !user || !item || !item.owner?._id) {
      navigate("/login", { state: { from: { pathname: `/items/${itemId}` } } });
      return;
    }

    if (user._id === item.owner._id) {
      // Should be disabled by isOwner, but as a safeguard
      console.warn("Cannot message yourself.");
      return;
    }

    try {
      const subject = `Regarding your listing: ${item.title}`;
      const initialMessage = `Hi ${item.owner?.email},\n\nI'm interested in your listing "${item.title}".`;

      const res = await conversationsApi.create({
        participantId: item.owner._id,
        subject,
        initialMessage,
        context: {
          kind: "inquiry", // Assuming a new context kind for items
          ref: item._id,
        },
      });
      navigate(`/inbox?conversationId=${res.conversation._id}`);
    } catch (error) {
      console.error("Failed to create or find conversation:", error);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="aspect-video animate-pulse rounded-3xl bg-slate-200" />
              <div className="grid grid-cols-4 gap-2">
                <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
                <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded-md bg-slate-200" />
              <div className="h-20 w-full animate-pulse rounded-md bg-slate-200" />
              <div className="h-6 w-1/4 animate-pulse rounded-md bg-slate-200" />
            </div>
          </div>
        </div>
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
    <>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="aspect-video overflow-hidden rounded-3xl border">
                <img
                  src={`${API_BASE_URL}/${item.images[0]}`}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-2xl border"
                    >
                      <img
                        src={`${API_BASE_URL}/${img}`}
                        alt={`${item.title} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
                {item.category}
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">{item.title}</h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                <span>
                  Owner:{" "}
                  <span className="font-medium text-slate-700">{item.owner?.email ?? "N/A"}</span>
                </span>
                <span>
                  Location: <span className="font-medium text-slate-700">{item.location}</span>
                </span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm text-slate-600">{item.description}</p>

              <div className="mt-auto pt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Price</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${item.pricePerDay}
                      <span className="text-base font-normal text-slate-500">/day</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/propose-swap"
                      state={{ item }}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition text-center ${
                        isOwner || !item.swapEligible
                          ? "cursor-not-allowed bg-slate-50 text-slate-400"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      onClick={(e) => {
                        if (isOwner || !item.swapEligible) e.preventDefault();
                      }}
                    >
                      Request Swap
                    </Link>
                                      <button
                                        className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg transition ${
                                          isOwner
                                            ? "cursor-not-allowed bg-slate-50 text-slate-400"
                                            : "bg-[var(--rs-primary)] text-white shadow-emerald-200/60 hover:opacity-90"
                                        }`}
                                        disabled={isOwner}
                                        onClick={openBookingModal}
                                      >
                                        Book Now
                                      </button>
                                      {!isOwner && isAuthenticated && (
                                        <button
                                          className="rounded-2xl border border-emerald-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[var(--rs-primary)] hover:text-[var(--rs-primary)]"
                                          onClick={handleMessageOwner}
                                        >
                                          Message Owner
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Reviews ({stats.count})</h2>
              <p className="text-sm text-slate-500">{averageLabel}</p>
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
                  <p className="mt-4 text-sm text-slate-500">Be the first to review this item.</p>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Leave a review</h3>
              {isAuthenticated ? (
                eligibleBookings.length ? (
                  <form className="mt-4 space-y-4" onSubmit={handleReviewSubmit}>
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

      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Book “{item.title}”
                </h3>
                <p className="text-xs text-slate-500">{item.location}</p>
              </div>
              <button
                className="rounded-full border border-emerald-100 px-3 py-1 text-xs text-slate-500"
                onClick={() => setBookingModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form className="mt-4 space-y-4" onSubmit={handleBookingSubmit}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">Start date</label>
                <input
                  type="date"
                  className={`w-full rounded-2xl border px-4 py-2 text-sm ${
                    bookingForm.startDate && !isBookingFormValid ? "border-red-400" : "border-emerald-100"
                  }`}
                  value={bookingForm.startDate}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">End date</label>
                <input
                  type="date"
                  className={`w-full rounded-2xl border px-4 py-2 text-sm ${
                    bookingForm.endDate && !isBookingFormValid ? "border-red-400" : "border-emerald-100"
                  }`}
                  value={bookingForm.endDate}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  min={bookingForm.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="rounded-2xl bg-emerald-50/60 p-3 text-xs text-slate-600">
                Deposit due at pickup: ${item.deposit}. Messaging + approvals happen in the dashboard.
              </div>
              {bookingStatus && (
                <p
                  className={`text-sm ${
                    bookingStatus.type === "success" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {bookingStatus.message}
                </p>
              )}
              <button
                type="submit"
                className={`w-full rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg transition ${
                  isBookingFormValid
                    ? "bg-[var(--rs-primary)] text-white shadow-emerald-200/60 hover:opacity-90"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
                disabled={!isBookingFormValid}
              >
                Submit request
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
