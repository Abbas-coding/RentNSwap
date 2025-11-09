import { useState } from "react";
import { itemsApi } from "@/lib/api";

const categories = ["Photography", "Fashion", "Events", "Outdoors", "DIY"];
const availabilityOptions = ["Weekdays", "Weekends", "Flexible"];

export default function ListItem() {
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    description: "",
    pricePerDay: "",
    deposit: "",
    location: "",
    swapEligible: "no",
  });
  const [availability, setAvailability] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    try {
      await itemsApi.create({
        title: form.title,
        category: form.category,
        description: form.description,
        pricePerDay: Number(form.pricePerDay),
        deposit: Number(form.deposit),
        location: form.location,
        swapEligible: form.swapEligible === "yes",
        availability,
      });
      setStatus({ type: "success", message: "Listing saved to MongoDB!" });
      setForm({
        title: "",
        category: categories[0],
        description: "",
        pricePerDay: "",
        deposit: "",
        location: "",
        swapEligible: "no",
      });
      setAvailability([]);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to save. Please check your inputs.",
      });
    }
  };

  const toggleAvailability = (slot: string) => {
    setAvailability((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">List an item</h1>
        <p className="mt-2 text-sm text-slate-600">
          Connected directly to the Item Service. Submitted forms persist in MongoDB and appear on
          the Browse & Home pages instantly.
        </p>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-4 rounded-2xl border border-emerald-100 p-5">
            <p className="text-sm font-semibold text-slate-700">Item basics</p>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">Title</label>
              <input
                className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm"
                placeholder="e.g. Sony A7 IV creator kit"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">Category</label>
                <select
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">Location</label>
                <input
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm"
                  placeholder="Downtown"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">Description</label>
              <textarea
                className="h-24 w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm"
                placeholder="Tell renters about the item, what you include, and usage notes."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-emerald-100 p-5">
            <p className="text-sm font-semibold text-slate-700">Pricing & availability</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">Price per day</label>
                <input
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm"
                  type="number"
                  min="0"
                  value={form.pricePerDay}
                  onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">Deposit</label>
                <input
                  className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm"
                  type="number"
                  min="0"
                  value={form.deposit}
                  onChange={(e) => setForm({ ...form, deposit: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">Availability</label>
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleAvailability(slot)}
                    className={`rounded-full border px-4 py-2 text-xs ${
                      availability.includes(slot)
                        ? "border-[var(--rs-primary)] bg-[var(--rs-primary)]/10 text-[var(--rs-primary)]"
                        : "border-emerald-100 text-slate-600"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-emerald-100 p-5">
            <p className="text-sm font-semibold text-slate-700">Swap settings</p>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">Swap eligible?</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, swapEligible: "yes" })}
                  className={`rounded-2xl border px-4 py-2 text-xs ${
                    form.swapEligible === "yes"
                      ? "border-[var(--rs-primary)] bg-[var(--rs-primary)]/10 text-[var(--rs-primary)]"
                      : "border-emerald-100 text-slate-600"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, swapEligible: "no" })}
                  className={`rounded-2xl border px-4 py-2 text-xs ${
                    form.swapEligible === "no"
                      ? "border-[var(--rs-primary)] bg-[var(--rs-primary)]/10 text-[var(--rs-primary)]"
                      : "border-emerald-100 text-slate-600"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">
                Cash adjustment guidance
              </label>
              <input
                className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm"
                placeholder="e.g. +$40 for higher value swaps"
              />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-emerald-100 p-5">
            <p className="text-sm font-semibold text-slate-700">Photos</p>
            <div className="rounded-2xl border border-dashed border-emerald-200 p-6 text-center text-sm text-slate-500">
              Drag media here. Cloudinary/S3 integration hooks in later per execution plan.
            </div>
          </section>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[var(--rs-primary)] py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/60"
          >
            Save listing
          </button>
          {status && (
            <p
              className={`text-center text-sm ${
                status.type === "success" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
