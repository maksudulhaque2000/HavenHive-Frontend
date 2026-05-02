"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: Array<"user" | "agent" | "admin">;
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, hydrate } = useAuth();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!token || !user) {
      window.localStorage.setItem("havenhive_redirect_after_login", pathname);
      router.replace("/auth/login");
      return;
    }

    if (roles && !roles.includes(user.role)) {
      router.replace(user.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    }
  }, [pathname, roles, router, token, user]);

  if (!token || !user || (roles ? !roles.includes(user.role) : false)) {
    return <LoadingSpinner fullPage />;
  }

  return <>{children}</>;
}