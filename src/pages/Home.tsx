import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { insightsApi, itemsApi, type Item } from "@/lib/api";
import { ItemCard } from "@/components/ItemCard"; // Import ItemCard

const highlights = [
  { title: "Verified owners", body: "Trust & safety checkpoints across every listing." },
  { title: "Flexible swaps", body: "Offer items 1:1 or add cash to balance value." },
  { title: "Sustainable wins", body: "Keep products in motion and lighten your footprint." },
];

const openBookingModal = (item: Item) => {
    console.log("");
  };

export default function Home() {
  const [stats, setStats] = useState([
    { label: "Items shared", value: "—", detail: "Loading..." },
    { label: "Cities live", value: "—", detail: "Loading..." },
    { label: "Avg. rating", value: "—", detail: "Loading..." },
  ]);
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);

  useEffect(() => {
    insightsApi
      .overview()
      .then((data) => {
        setStats([
          { label: "Items shared", value: String(data.stats.items), detail: "Cameras, dresses, tools & more" },
          { label: "Bookings logged", value: String(data.stats.bookings), detail: "Lifecycle checkpoints" },
          { label: "Avg. rating", value: `${data.stats.avgRating}/5`, detail: "Reviews & deposits drive trust" },
        ]);
      })
      .catch(() => {
        // leave placeholders
      });
  }, []);

  useEffect(() => {
    itemsApi
      .list({ featured: true })
      .then((res) => setFeaturedItems(res.items))
      .catch(() => setFeaturedItems([]));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero Section */}
      <div className="text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-[var(--rs-primary)]">
          Community-driven sharing
        </span>
        <h1 className="mt-4 text-4xl font-semibold text-emerald-950 sm:text-5xl">
          Rent smarter. Swap greener.
        </h1>
        <p className="mt-4 text-base text-slate-600 sm:text-lg max-w-2xl mx-auto">
          Discover a world of possibilities. Rent what you need, when you need it, or swap items with your community. Sustainable, flexible, and fair.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
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
      </div>

      {/* Value Propositions */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {highlights.map((highlight) => (
          <div key={highlight.title} className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{highlight.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{highlight.body}</p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-semibold text-emerald-600">{stat.value}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="text-xs text-slate-400">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* Featured Items Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900 text-center">Featured Items</h2>
        <p className="mt-2 text-base text-slate-500 text-center">
          Hand-picked items from our vibrant community.
        </p>
        {featuredItems.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <ItemCard onBookClick={openBookingModal} key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">No featured items yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Be the first to list an item and see it featured here!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
