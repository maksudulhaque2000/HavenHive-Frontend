import { create } from "zustand";
import { AuthSession, User } from "@/types";
import { AUTH_TOKEN_KEY } from "@/lib/api-client";

const USER_KEY = "havenhive_user";

const readStorage = (): AuthSession | null => {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const userRaw = window.localStorage.getItem(USER_KEY);

    if (!token || !userRaw) {
      return null;
    }

    const user = JSON.parse(userRaw) as User;
    
    // Validate token and user object
    if (!user || typeof user !== "object") {
      // Clear invalid data
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      return null;
    }
    
    return { token, user };
  } catch (error) {
    console.error("Error reading auth storage:", error);
    // Clear invalid data
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
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
  isLoading: true,
  error: null,
  setUser: (user) => {
    set({ user });
    if (user) {
      try {
        window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
    } else {
      try {
        window.localStorage.removeItem(USER_KEY);
      } catch (error) {
        console.error("Error removing user from localStorage:", error);
      }
    }
  },
  setSession: (session) => {
    if (!session) {
      set({ user: null, token: null });
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
          window.localStorage.removeItem(USER_KEY);
        } catch (error) {
          console.error("Error clearing auth storage:", error);
        }
      }
      return;
    }

    set({ user: session.user, token: session.token });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(AUTH_TOKEN_KEY, session.token);
        window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
      } catch (error) {
        console.error("Error saving session to localStorage:", error);
      }
    }
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
      } catch (error) {
        console.error("Error clearing auth during logout:", error);
      }
    }
  },
  hydrate: () => {
    try {
      const session = readStorage();
      if (!session) {
        set({ user: null, token: null, isLoading: false });
        return;
      }

      set({ user: session.user, token: session.token, isLoading: false });
    } catch (error) {
      console.error("Error hydrating auth:", error);
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
