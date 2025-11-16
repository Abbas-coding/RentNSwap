import { Search, CalendarDays, ArrowRightLeft, MessageCircle, ShieldCheck, Repeat, HelpCircle } from "lucide-react";

const rentSteps = [
  {
    icon: <Search size={28} className="text-emerald-500" />,
    title: "1. Find Your Item",
    description: "Browse our marketplace or use the search bar to find the specific gear you need. Filter by category, location, and price to narrow down your options.",
  },
  {
    icon: <CalendarDays size={28} className="text-emerald-500" />,
    title: "2. Book Your Dates",
    description: "Select your desired rental dates on the item's page. The owner will be notified to approve your request.",
  },
  {
    icon: <MessageCircle size={28} className="text-emerald-500" />,
    title: "3. Coordinate Pickup",
    description: "Once your booking is approved, use our secure messaging system to arrange a time and place for pickup with the owner.",
  },
  {
    icon: <Repeat size={28} className="text-emerald-500" />,
    title: "4. Return & Review",
    description: "Meet the owner to return the item at the end of your rental period. Leave a review to share your experience with the community.",
  },
];

const swapSteps = [
  {
    icon: <ArrowRightLeft size={28} className="text-sky-500" />,
    title: "1. Propose a Swap",
    description: "Find a swap-eligible item you want and click 'Request Swap'. Choose one of your own swap-eligible items to offer in return.",
  },
  {
    icon: <MessageCircle size={28} className="text-sky-500" />,
    title: "2. Negotiate the Terms",
    "description": "The other user can accept, reject, or make a counter-offer. You can add cash to balance the value. All negotiations happen in your Swap Hub.",
  },
  {
    icon: <ShieldCheck size={28} className="text-sky-500" />,
    title: "3. Arrange the Exchange",
    "description": "Once both parties agree, use our messaging system to coordinate a safe and convenient exchange of the items.",
  },
  {
    icon: <Repeat size={28} className="text-sky-500" />,
    title: "4. Complete the Swap",
    "description": "After the exchange, mark the swap as complete. Consider leaving a review for the other user to build trust in the community.",
  },
];

const faqs = [
  {
    q: "How are payments handled?",
    a: "Currently, payments and deposits are handled directly between users. We plan to integrate a secure escrow system with Stripe for cashless transactions in a future update.",
  },
  {
    q: "What if an item I rent gets damaged?",
    a: "We recommend documenting the item's condition at pickup. In case of damage, the owner's deposit can be used for repairs. If there's a disagreement, you can file a dispute for admin moderation.",
  },
  {
    q: "Do I have to swap items of the same value?",
    a: "No. Our swap system allows you to add a cash adjustment to your offer, making it easy to trade items of different values.",
  },
  {
    q: "Is it safe to meet with strangers?",
    a: "We encourage all users to meet in public, well-lit places. Always check a user's reviews and rating before arranging a rental or swap.",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How Rent & Swap Works
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            A simple, secure, and community-driven way to rent or swap items.
          </p>
        </div>

        {/* Renting Section */}
        <div className="mt-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">How to Rent an Item</h2>
            <p className="mt-2 text-base text-slate-500">
              Get access to what you need, right when you need it.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {rentSteps.map((step) => (
              <div key={step.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  {step.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Swapping Section */}
        <div className="mt-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">How to Swap an Item</h2>
            <p className="mt-2 text-base text-slate-500">
              Trade what you have for what you want.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {swapSteps.map((step) => (
              <div key={step.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
                  {step.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2">
              <HelpCircle className="text-slate-500" />
              <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            </div>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-y-10 gap-x-8 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-base font-semibold leading-7 text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
