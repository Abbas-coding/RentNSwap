import { Route, Routes, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import SwapHub from "./pages/SwapHub";
import HowItWorks from "./pages/HowItWorks";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import ListItem from "./pages/ListItem";
import ItemDetails from "./pages/ItemDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ProposeSwap from "./pages/ProposeSwap";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/swap" element={<SwapHub />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/community" element={<Community />} />
        <Route path="/items/:itemId" element={<ItemDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <ListItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/propose-swap"
          element={
            <ProtectedRoute>
              <ProposeSwap />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
