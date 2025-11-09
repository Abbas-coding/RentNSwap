import { useEffect, useState } from "react";
import { insightsApi } from "@/lib/api";

export default function Community() {
  const [stats, setStats] = useState({
    sharedItems: 0,
    locations: 0,
    avgRating: 0,
  });
  const [testimonials, setTestimonials] = useState<
    { quote: string; author: string }[]
  >([]);

  useEffect(() => {
    insightsApi.community().then((data) => {
      setStats(data.stats);
      setTestimonials(data.testimonials);
    });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Community impact</h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Narratives, sustainability data, and success stories powered by real listings and
          bookings from the database.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <article className="rounded-2xl bg-emerald-50/70 p-6 text-center">
            <p className="text-3xl font-semibold text-emerald-700">{stats.sharedItems}</p>
            <p className="text-sm text-emerald-900/70">Shared items</p>
            <p className="text-xs text-emerald-900/60">Lifecycle extended</p>
          </article>
          <article className="rounded-2xl bg-emerald-50/70 p-6 text-center">
            <p className="text-3xl font-semibold text-emerald-700">{stats.locations}</p>
            <p className="text-sm text-emerald-900/70">Active neighborhoods</p>
            <p className="text-xs text-emerald-900/60">Across cities</p>
          </article>
          <article className="rounded-2xl bg-emerald-50/70 p-6 text-center">
            <p className="text-3xl font-semibold text-emerald-700">{stats.avgRating}/5</p>
            <p className="text-sm text-emerald-900/70">Avg. rating</p>
            <p className="text-xs text-emerald-900/60">Reviews & deposits</p>
          </article>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {testimonials.map((story) => (
            <article key={story.author} className="rounded-3xl border border-emerald-100/60 bg-emerald-50/40 p-6">
              <p className="text-base italic text-slate-700">“{story.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">{story.author}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-dashed border-emerald-200 p-6 text-center text-sm text-slate-600">
          Coming soon: interactive impact map, carbon savings calculator, and community badges once we ship
          the analytics service mentioned in the execution plan.
        </div>
      </div>
    </section>
  );
}
