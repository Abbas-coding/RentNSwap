import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStatus } from "@/lib/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthed = useAuthStatus();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
