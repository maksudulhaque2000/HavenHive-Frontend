"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "@/components/layout/PrivateRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { userService } from "@/lib/services/user";
import { User } from "@/types";
import { adminMenu } from "@/components/admin/adminMenu";

function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userService.getAll();
        setUsers(response.data || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <DashboardShell title="Admin Users" subtitle="Manage accounts and roles." menu={adminMenu}>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">All users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Wishlist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="px-6 py-4"><Badge variant="neutral">{user.role}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={user.isVerified ? "success" : "warning"}>{user.isVerified ? "Verified" : "Pending"}</Badge></td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.wishlist?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}

export default function AdminUsersPage() {
  return <PrivateRoute roles={["admin"]}><AdminUsersContent /></PrivateRoute>;
}