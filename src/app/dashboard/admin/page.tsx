"use client";

import PrivateRoute from "@/components/layout/PrivateRoute";
import AdminDashboardView from "@/components/dashboard/AdminDashboardView";

export default function AdminDashboardPage() {
  return (
    <PrivateRoute roles={["admin"]}>
      <AdminDashboardView />
    </PrivateRoute>
  );
}