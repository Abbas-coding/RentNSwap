import { useEffect, useState } from "react";
import { insightsApi } from "@/lib/api";
import { Users, ShieldCheck, MapPin, Heart, Star } from "lucide-react";

const guidelines = [
  {
    icon: <Users size={28} className="text-emerald-500" />,
    title: "Be Respectful",
    description: "Treat every member of the community with kindness and respect. Clear and polite communication is key to a positive experience for everyone.",
  },
  {
    icon: <ShieldCheck size={28} className="text-emerald-500" />,
    title: "Be Honest",
    description: "Provide accurate and truthful descriptions of your items, including any flaws or quirks. Transparency builds trust.",
  },
  {
    icon: <MapPin size={28} className="text-emerald-500" />,
    title: "Meet Safely",
    description: "When exchanging items, always arrange to meet in a public, well-lit place. Your safety is our top priority.",
  },
  {
    icon: <Heart size={28} className="text-emerald-500" />,
    title: "Handle with Care",
    description: "Treat items you rent or swap as if they were your own. Return them on time and in the same condition you received them.",
  },
];

export default function Community() {
  const [stats, setStats] = useState({
    sharedItems: 0,
    locations: 0,
    avgRating: 0,
  });
  const [testimonials, setTestimonials] = useState<
    { quote: string; author: string; location: string }[]
  >([]);

  useEffect(() => {
    // In a real app, this would be an actual API call.
    // For now, we use the placeholder data from the insights API.
    insightsApi.community().then((data) => {
      setStats(data.stats);
      setTestimonials(data.testimonials);
    });
  }, []);

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome to the Rent & Swap Community
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Share more, waste less, and connect with your neighbors.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-emerald-600">{stats.sharedItems}+</p>
            <p className="mt-1 text-sm font-medium text-slate-700">Items Shared</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-emerald-600">{stats.locations}+</p>
            <p className="mt-1 text-sm font-medium text-slate-700">Active Neighborhoods</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-emerald-600">{stats.avgRating.toFixed(1)}/5</p>
            <p className="mt-1 text-sm font-medium text-slate-700">Average Rating</p>
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="mt-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Our Community Guidelines</h2>
            <p className="mt-2 text-base text-slate-500">
              Simple rules to ensure a safe and trustworthy environment for everyone.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {guidelines.map((guideline) => (
              <div key={guideline.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  {guideline.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{guideline.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{guideline.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stories Section */}
        <div className="mt-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Community Stories</h2>
            <p className="mt-2 text-base text-slate-500">
              Hear from members of the Rent & Swap community.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((story) => (
              <figure key={story.author} className="rounded-2xl bg-white p-6 shadow-sm">
                <blockquote className="text-slate-700">
                  <p>“{story.quote}”</p>
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-x-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-slate-900">{story.author}</div>
                    <div className="text-slate-600">{story.location}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
