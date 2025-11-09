import { authStorage } from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = RequestInit & { auth?: boolean };

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (options.auth) {
    const token = authStorage.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data && (data.message as string)) || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    createdAt: string;
  };
}

export interface Item {
  _id: string;
  title: string;
  category: string;
  description: string;
  pricePerDay: number;
  deposit: number;
  location: string;
  rating: number;
  swapEligible: boolean;
  tags: string[];
}

export interface Booking {
  _id: string;
  item: Item;
  renter: { email?: string };
  owner: { email?: string };
  startDate: string;
  endDate: string;
  status: string;
  deposit: number;
}

export interface ConversationSummary {
  _id: string;
  subject: string;
  lastMessage?: { text: string; createdAt: string };
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  subject: string;
  messages: { sender: { email?: string } | string; text: string; createdAt: string }[];
}

export const authApi = {
  login: (payload: { identifier: string; password: string }) =>
    apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  signup: (payload: { identifier: string; password: string }) =>
    apiRequest<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const itemsApi = {
  list: (params?: Record<string, string | boolean>) => {
    const search = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) search.append(key, String(value));
      });
    }
    const qs = search.toString();
    return apiRequest<{ items: Item[] }>(`/api/items${qs ? `?${qs}` : ""}`);
  },
  create: (payload: Partial<Item>) =>
    apiRequest<{ item: Item }>("/api/items", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),
};

export const bookingsApi = {
  list: (role: "owner" | "renter" | "all" = "owner") =>
    apiRequest<{ bookings: Booking[] }>(`/api/bookings?role=${role}`, { auth: true }),
  create: (payload: { itemId: string; startDate: string; endDate: string; deposit?: number }) =>
    apiRequest<{ booking: Booking }>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),
};

export const swapsApi = {
  list: () => apiRequest<{ swaps: unknown[] }>("/api/swaps"),
};

export const insightsApi = {
  overview: () => apiRequest<{ stats: Record<string, number>; trending: { title: string; price: string }[] }>("/api/insights/overview"),
  community: () =>
    apiRequest<{ stats: { sharedItems: number; locations: number; avgRating: number }; testimonials: { quote: string; author: string }[] }>(
      "/api/insights/community"
    ),
};

export const conversationsApi = {
  list: () => apiRequest<{ conversations: ConversationSummary[] }>("/api/conversations", { auth: true }),
  get: (id: string) => apiRequest<{ conversation: Conversation }>(`/api/conversations/${id}`, { auth: true }),
  sendMessage: (id: string, text: string) =>
    apiRequest<{ conversation: Conversation }>(`/api/conversations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ text }),
      auth: true,
    }),
};
