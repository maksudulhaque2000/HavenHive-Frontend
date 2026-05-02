"use client";

import PrivateRoute from "@/components/layout/PrivateRoute";
import UserDashboardView from "@/components/dashboard/UserDashboardView";

export default function UserDashboardPage() {
  return (
    <PrivateRoute roles={["user", "agent"]}>
      <UserDashboardView />
    </PrivateRoute>
  );
}