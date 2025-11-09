import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { insightsApi, itemsApi, type Item } from "@/lib/api";

const highlights = [
  { title: "Verified owners", body: "Trust & safety checkpoints across every listing." },
  { title: "Flexible swaps", body: "Offer items 1:1 or add cash to balance value." },
  { title: "Sustainable wins", body: "Keep products in motion and lighten your footprint." },
];

const roadmap = [
  { label: "Week 1", detail: "Auth + Listings API ready" },
  { label: "Week 2", detail: "Bookings & approvals" },
  { label: "Week 3", detail: "Swap engine + inbox" },
  { label: "Week 4", detail: "Reviews, admin panel, polish" },
];

export default function Home() {
  const [stats, setStats] = useState([
    { label: "Items shared", value: "—", detail: "Loading..." },
    { label: "Cities live", value: "—", detail: "Loading..." },
    { label: "Avg. rating", value: "—", detail: "Loading..." },
  ]);
  const [trending, setTrending] = useState<{ name: string; price: string }[]>([]);

  useEffect(() => {
    insightsApi
      .overview()
      .then((data) => {
        setStats([
          { label: "Items shared", value: String(data.stats.items), detail: "Cameras, dresses, tools & more" },
          { label: "Bookings logged", value: String(data.stats.bookings), detail: "Lifecycle checkpoints" },
          { label: "Avg. rating", value: `${data.stats.avgRating}/5`, detail: "Reviews & deposits drive trust" },
        ]);
        setTrending(
          data.trending.map((entry) => ({ name: entry.title, price: entry.price }))
        );
      })
      .catch(() => {
        // leave placeholders
      });
  }, []);

  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  useEffect(() => {
    itemsApi
      .list({ featured: true })
      .then((res) => setFeaturedItems(res.items))
      .catch(() => setFeaturedItems([]));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-[var(--rs-primary)]">
            Community-driven sharing
          </span>
          <div>
            <h1 className="text-4xl font-semibold text-emerald-950 sm:text-5xl">
              Rent smarter. Swap greener.
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Everything we build in Phase 4 ladders up to this experience: browse curated listings,
              lock bookings with deposits, or negotiate swaps without leaving the app.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/rent"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--rs-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/70 transition hover:bg-[var(--rs-primary-dark)]"
            >
              Explore rentals <ArrowRight size={16} />
            </Link>
            <Link
              to="/list"
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[var(--rs-primary)] hover:text-[var(--rs-primary)]"
            >
              List an item <Leaf size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-semibold text-emerald-600">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-900">Execution roadmap</h2>
          <p className="mt-2 text-sm text-slate-600">
            Built on React + Express + MongoDB. Booking, swaps, messaging, and reviews will
            progressively activate as each module ships.
          </p>
          <ul className="mt-6 space-y-4">
            {highlights.map((highlight) => (
              <li key={highlight.title} className="rounded-2xl border border-emerald-100 p-4">
                <p className="text-sm font-semibold uppercase text-emerald-400">
                  {highlight.title}
                </p>
                <p className="text-sm text-slate-600">{highlight.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--rs-primary)]">
            Coming up
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {roadmap.map((item) => (
              <li key={item.label} className="rounded-2xl border border-emerald-50 p-3">
                <p className="text-xs uppercase tracking-wide text-emerald-400">{item.label}</p>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[var(--rs-primary)]" size={20} />
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
              Trending categories
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => (
              <article key={item._id} className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.location} • ${item.pricePerDay}/day
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-600">
            Listings feed fueled by MongoDB content—update the Item Service to instantly refresh this view.
          </p>
        </div>
      </div>
    </section>
  );
}
