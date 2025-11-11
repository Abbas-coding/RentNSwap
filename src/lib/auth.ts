const TOKEN_KEY = "rs_token";
const subscribers = new Set<() => void>();

const notify = () => {
  subscribers.forEach((callback) => callback());
};

export const authStorage = {
  getToken: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  setToken: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    notify();
  },
  clearToken: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    notify();
  },
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
};
