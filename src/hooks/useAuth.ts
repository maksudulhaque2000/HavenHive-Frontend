"use client";

import { useAuthStore } from "@/store/auth";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const setSession = useAuthStore((state) => state.setSession);
  const hydrate = useAuthStore((state) => state.hydrate);

  return { user, token, logout, setSession, hydrate };
}