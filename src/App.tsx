import { Route, Routes, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Temporary home placeholder
function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-5xl font-semibold text-emerald-900">
          Why buy when you can Rent & Swap?
        </h1>
        <p className="mt-3 text-emerald-900/80">
          Find everything you need—without the commitment of buying.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4">
            <div className="aspect-video rounded-xl bg-emerald-100" />
            <h3 className="mt-3 font-medium">Item Name</h3>
            <p className="text-sm text-emerald-900/70">Rent for $10/day</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/rent" element={<Home />} />
        <Route path="/swap" element={<Home />} />
        <Route path="/how-it-works" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
