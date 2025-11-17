import { useState } from "react";
import AdminOverview from "@/components/admin/AdminOverview";
import UserManagement from "@/components/admin/UserManagement";
import ListingManagement from "@/components/admin/ListingManagement";
import BookingManagement from "@/components/admin/BookingManagement";
import SwapManagement from "@/components/admin/SwapManagement";

type AdminTab = "overview" | "users" | "listings" | "bookings" | "swaps";

const tabs: { id: AdminTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "listings", label: "Listings" },
  { id: "bookings", label: "Bookings" },
  { id: "swaps", label: "Swaps" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <UserManagement />;
      case "listings":
        return <ListingManagement />;
      case "bookings":
        return <BookingManagement />;
      case "swaps":
        return <SwapManagement />;
      default:
        return null;
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600">
          Manage users, listings, and platform activity.
        </p>
      </div>

      <div className="mb-6 flex space-x-4 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-[var(--rs-primary)] text-[var(--rs-primary)]"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{renderContent()}</div>
    </section>
  );
}
