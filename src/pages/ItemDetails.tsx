import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { itemsApi, reviewsApi, bookingsApi, type Item, type Review, type Booking, conversationsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { getImageUrl } from "@/lib/utils";
import { MapPin, Star, User, ShieldCheck, Calendar as CalendarIcon, MessageSquare, ArrowRightLeft } from "lucide-react";

export default function ItemDetails() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{ count: number; average: number }>({ count: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({ startDate: "", endDate: "" });
  const [bookingStatus, setBookingStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: "5", comment: "" });
  const [reviewStatus, setReviewStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [eligibleBookings, setEligibleBookings] = useState<Booking[]>([]);

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

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!itemId || !reviewForm.bookingId) {
      setReviewStatus({ type: "error", message: "Select a completed booking to review." });
      return;
    }
    setReviewStatus(null);
    try {
      await reviewsApi.create({
        itemId,
        bookingId: reviewForm.bookingId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewStatus({ type: "success", message: "Review submitted!" });
      const refreshed = await itemsApi.get(itemId);
      setReviews(refreshed.reviews);
      setStats(refreshed.reviewStats);
      setReviewForm((prev) => ({ ...prev, comment: "" }));
    } catch (error) {
      setReviewStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to submit review.",
      });
    }
  };

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
        navigate("/login", { state: { from: { pathname: `/items/${itemId}` } } });
        return;
    }
    if (!item || !isBookingFormValid) return;
    setBookingStatus(null);
    setIsBooking(true);

    try {
      await bookingsApi.create({
        itemId: item._id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        deposit: item.deposit,
      });
      setBookingStatus({ type: "success", message: "Booking requested! Owner will approve shortly." });
      // Reset form after success
      setBookingForm({ startDate: "", endDate: "" });
    } catch (error) {
      setBookingStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to request this booking.",
      });
    } finally {
        setIsBooking(false);
    }
  };

  const handleMessageOwner = async () => {
    if (!isAuthenticated || !user || !item || !item.owner?._id) {
      navigate("/login", { state: { from: { pathname: `/items/${itemId}` } } });
      return;
    }

    if (user._id === item.owner._id) {
      return;
    }

    try {
      const subject = `Inquiry: ${item.title}`;
      const initialMessage = `Hi, I'm interested in your listing "${item.title}".`;

      const res = await conversationsApi.create({
        participantId: item.owner._id,
        subject,
        initialMessage,
        context: { kind: "inquiry", ref: item._id },
      });
      navigate(`/inbox?conversationId=${res.conversation._id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/3 rounded bg-slate-200"></div>
          <div className="h-96 w-full rounded-2xl bg-slate-200"></div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="col-span-2 space-y-4">
              <div className="h-4 w-full rounded bg-slate-200"></div>
              <div className="h-4 w-5/6 rounded bg-slate-200"></div>
            </div>
            <div className="h-64 rounded-2xl bg-slate-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return <div className="py-20 text-center text-slate-500">Item not found.</div>;
  }

  const mainImage = getImageUrl(item.images[0]);

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{item.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="fill-amber-400 text-amber-400" size={16} />
              <span className="font-semibold text-slate-900">{stats.average.toFixed(1)}</span>
              <span>({stats.count} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="font-medium underline">{item.location}</span>
            </div>
            {item.category && (
                <>
                <span>•</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    {item.category}
                </span>
                </>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className={`mb-10 overflow-hidden rounded-3xl ${item.images.length > 1 ? "grid gap-4 sm:grid-cols-4 sm:gap-4 md:h-[480px]" : "h-[480px]"}`}>
          <div className={`${item.images.length > 1 ? "col-span-4 h-64 sm:col-span-2 sm:h-full md:col-span-2" : "h-full w-full"}`}>
            <img src={mainImage} alt={item.title} className="h-full w-full object-cover transition hover:opacity-95" />
          </div>
          {item.images.length > 1 && (
            <div className="hidden grid-cols-1 gap-4 sm:col-span-2 sm:grid sm:grid-cols-2 md:col-span-2">
              {item.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative h-full w-full overflow-hidden bg-slate-100">
                  <img src={getImageUrl(img)} alt={`Gallery ${i}`} className="h-full w-full object-cover transition hover:scale-105" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <div className="border-b border-slate-200 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Hosted by {item.owner?.email?.split('@')[0] || 'User'}</h2>
                  <p className="text-sm text-slate-500">Joined in 2024</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <User size={24} />
                </div>
              </div>
            </div>

            <div className="border-b border-slate-200 py-8">
              <div className="space-y-4 text-slate-600">
                <div className="flex gap-4">
                    <ShieldCheck className="shrink-0 text-emerald-500" />
                    <div>
                        <p className="font-medium text-slate-900">Verified Listing</p>
                        <p className="text-sm">This item has been verified for authenticity and quality.</p>
                    </div>
                </div>
                {item.swapEligible && (
                    <div className="flex gap-4">
                        <ArrowRightLeft className="shrink-0 text-[var(--rs-primary)]" />
                        <div>
                            <p className="font-medium text-slate-900">Swap Eligible</p>
                            <p className="text-sm">The owner is open to swapping this item.</p>
                        </div>
                    </div>
                )}
              </div>
            </div>

            <div className="border-b border-slate-200 py-8">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">About this item</h2>
              <p className="whitespace-pre-line leading-relaxed text-slate-600">{item.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="py-8">
              <h2 className="mb-6 text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Star className="fill-slate-900" size={20} /> 
                {stats.average.toFixed(1)} · {stats.count} reviews
              </h2>
              
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="rounded-2xl bg-slate-50 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                            {typeof review.fromUser !== 'string' ? review.fromUser?.email?.[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-slate-900">
                                {typeof review.fromUser !== 'string' ? review.fromUser?.email?.split('@')[0] : 'User'}
                            </p>
                            <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-slate-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No reviews yet.</p>
                )}
              </div>

              {/* Review Form (Only visible if eligible) */}
              {isAuthenticated && eligibleBookings.length > 0 && (
                <div className="mt-8 rounded-2xl border border-slate-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold">Leave a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <select
                            className="rounded-xl border-slate-200 text-sm"
                            value={reviewForm.bookingId}
                            onChange={(e) => setReviewForm({ ...reviewForm, bookingId: e.target.value })}
                        >
                            <option value="">Select booking...</option>
                            {eligibleBookings.map(b => (
                                <option key={b._id} value={b._id}>
                                    {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                        <select
                            className="rounded-xl border-slate-200 text-sm"
                            value={reviewForm.rating}
                            onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                        >
                            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                        </select>
                    </div>
                    <textarea 
                        className="w-full rounded-xl border-slate-200 text-sm"
                        rows={3}
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                    <button className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                        Post Review
                    </button>
                    {reviewStatus && (
                        <p className={`text-sm ${reviewStatus.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {reviewStatus.message}
                        </p>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="relative">
            <div className="sticky top-24 rounded-3xl border border-slate-200 p-6 shadow-xl shadow-slate-200/50">
              <div className="mb-6 flex items-baseline justify-between">
                <div>
                    <span className="text-2xl font-bold text-slate-900">${item.pricePerDay}</span>
                    <span className="text-slate-500"> / day</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Star size={12} className="fill-slate-900 text-slate-900" />
                    <span className="text-slate-900">{stats.average.toFixed(1)}</span>
                </div>
              </div>

              {isOwner ? (
                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                      <p className="text-sm font-medium text-slate-900">This is your listing</p>
                      <p className="text-xs text-slate-500">Manage it from your dashboard.</p>
                      <Link to="/dashboard" className="mt-3 inline-block text-xs font-semibold text-[var(--rs-primary)] hover:underline">
                          Go to Dashboard
                      </Link>
                  </div>
              ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-300">
                        <div className="border-r border-slate-300 px-3 py-2">
                            <label className="block text-[10px] font-bold uppercase text-slate-500">Start</label>
                            <input 
                                type="date" 
                                className="w-full border-none p-0 text-sm focus:ring-0"
                                value={bookingForm.startDate}
                                onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="px-3 py-2">
                            <label className="block text-[10px] font-bold uppercase text-slate-500">End</label>
                            <input 
                                type="date" 
                                className="w-full border-none p-0 text-sm focus:ring-0"
                                value={bookingForm.endDate}
                                onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })}
                                min={bookingForm.startDate || new Date().toISOString().split("T")[0]}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isBookingFormValid || isBooking}
                        className="w-full rounded-xl bg-[var(--rs-primary)] py-3.5 text-base font-bold text-white transition hover:bg-[#0ea5e9] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isBooking ? "Requesting..." : "Book Now"}
                    </button>

                    {item.swapEligible && (
                        <Link
                            to="/propose-swap"
                            state={{ item }}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            <ArrowRightLeft size={16} />
                            Request Swap
                        </Link>
                    )}

                    <p className="text-center text-xs text-slate-500">You won't be charged yet</p>

                    {bookingStatus && (
                        <p className={`text-center text-xs font-medium ${bookingStatus.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {bookingStatus.message}
                        </p>
                    )}

                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <div className="flex justify-between py-1 text-sm text-slate-600">
                            <span className="underline">Deposit (Refundable)</span>
                            <span>${item.deposit}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900">
                            <span>Total before tax</span>
                            <span>${item.pricePerDay * (Math.max(1, (new Date(bookingForm.endDate).getTime() - new Date(bookingForm.startDate).getTime()) / (1000 * 3600 * 24))) || 0}</span>
                        </div>
                    </div>
                  </form>
              )}
              
              {!isOwner && (
                  <button 
                    onClick={handleMessageOwner}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl p-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  >
                      <MessageSquare size={18} />
                      Contact Owner
                  </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

