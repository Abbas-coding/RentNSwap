import { authStorage } from "@/lib/auth";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

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

async function apiUploadRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: HeadersInit = {
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

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  role?: "user" | "admin";
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Item {
  _id: string;
  owner?: { _id: string; email?: string };
  title: string;
  category: string;
  description: string;
  pricePerDay: number;
  deposit: number;
  location: string;
  rating: number;
  swapEligible: boolean;
  tags: string[];
  images: string[];
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
  createdAt?: string;
}

export interface Swap {
  _id: string;
  proposer: { _id: string; email?: string };
  receiver: { _id: string; email?: string };
  proposerItem?: Item;
  receiverItem?: Item;
  cashAdjustment?: number;
  status: string;
  notes?: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  item: string;
  rating: number;
  comment?: string;
  fromUser: { email?: string } | string;
  createdAt: string;
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
  updatedAt: string;
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
  me: () => apiRequest<{ user: AuthUser }>("/api/auth/me", { auth: true }),
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
    return apiRequest<{ items: Item[] }>(`/api/items${qs ? `?${qs}` : ""}`,{auth:true});
  },
  get: (id: string) => apiRequest<{ item: Item; reviews: Review[]; reviewStats: { count: number; average: number } }>(`/api/items/${id}`),
  create: (payload: FormData) =>
    apiUploadRequest<{ item: Item }>("/api/items", {
      method: "POST",
      body: payload,
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
  updateStatus: (id: string, status: string) =>
    apiRequest<{ booking: Booking }>(`/api/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      auth: true,
    }),
};

export const swapsApi = {
  list: () => apiRequest<{ swaps: Swap[] }>("/api/swaps", { auth: true }),
  create: (payload: {
    proposerItemId: string;
    receiverItemId: string;
    receiverId: string;
    cashAdjustment?: number;
    notes?: string;
  }) =>
    apiRequest<{ swap: Swap }>("/api/swaps", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),
  updateStatus: (id: string, payload: { status: string; cashAdjustment?: number; notes?: string }) =>
    apiRequest<{ swap: Swap }>(`/api/swaps/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      auth: true,
    }),
};

export const reviewsApi = {
  listForItem: (itemId: string) =>
    apiRequest<{ reviews: Review[]; stats: { count: number; average: number } }>(`/api/reviews/item/${itemId}`),
  create: (payload: { itemId: string; bookingId: string; rating: number; comment?: string }) =>
    apiRequest<{ review: Review }>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }),
};

export const adminApi = {
  overview: () => apiRequest<{ stats: Record<string, number>; latestBookings: Booking[]; topCategories: { _id: string; total: number }[] }>(
    "/api/admin/overview",
    { auth: true }
  ),
};

export const insightsApi = {
  overview: () =>
    apiRequest<{
      stats: Record<string, number>;
      trending: { title: string; price: string }[];
    }>("/api/insights/overview"),
  community: () =>
    apiRequest<{
      stats: { sharedItems: number; locations: number; avgRating: number };
      testimonials: { quote: string; author: string }[];
    }>("/api/insights/community"),
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

