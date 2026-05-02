"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, hydrate } = useAuth();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    router.replace(user.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
  }, [router, user]);

  return <LoadingSpinner fullPage />;
}
