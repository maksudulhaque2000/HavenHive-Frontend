"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const setSession = useAuthStore((state) => state.setSession);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    // Hydrate on mount
    hydrate();
    setIsLoading(false);
  }, [hydrate]);

  return { user, token, logout, setSession, hydrate, isLoading };
}