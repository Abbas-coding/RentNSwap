import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUserName(user: { firstName?: string; lastName?: string; email?: string } | null | undefined): string {
  if (!user) return "Unknown User";
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email || "User";
}

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }
  return `${API_URL}/${path}`;
}
