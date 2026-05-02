import { create } from "zustand";
import { AuthSession, User } from "@/types";
import { AUTH_TOKEN_KEY } from "@/lib/api-client";

const USER_KEY = "havenhive_user";

const readStorage = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const userRaw = window.localStorage.getItem(USER_KEY);

  if (!token || !userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as User;
    return { token, user };
  } catch {
    return null;
  }
};

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  setUser: (user) => {
    set({ user });
    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  },
  setSession: (session) => {
    if (!session) {
      set({ user: null, token: null });
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
      }
      return;
    }

    set({ user: session.user, token: session.token });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_TOKEN_KEY, session.token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    }
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
  },
  hydrate: () => {
    const session = readStorage();
    if (!session) {
      set({ user: null, token: null });
      return;
    }

    set({ user: session.user, token: session.token });
  },
}));
