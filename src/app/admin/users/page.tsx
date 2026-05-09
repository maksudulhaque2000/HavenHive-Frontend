"use client";

import { useEffect, useState } from "react";
import { Lock, Unlock, Trash2 } from "lucide-react";
import PrivateRoute from "@/components/layout/PrivateRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { userService } from "@/lib/services/user";
import { User } from "@/types";
import { adminMenu } from "@/components/admin/adminMenu";

function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: "user" | "agent" | "admin" }>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(""); // Clear previous errors
      const response = await userService.getAll();
      setUsers(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to load users";
      setError(errorMessage);
      console.error("Load users error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      setError("");
      await userService.blockUser(userId);
      setSuccess("User has been blocked successfully");
      await loadUsers();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to block user";
      setError(errorMessage);
      console.error("Block user error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      setError("");
      await userService.unblockUser(userId);
      setSuccess("User has been unblocked successfully");
      await loadUsers();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to unblock user";
      setError(errorMessage);
      console.error("Unblock user error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(userId);
      setError("");
      await userService.delete(userId);
      setSuccess("User has been deleted successfully");
      await loadUsers();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete user";
      setError(errorMessage);
      console.error("Delete user error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string) => {
    const newRole = selectedRole[userId];
    if (!newRole) return;

    try {
      setActionLoading(userId);
      setError("");
      await userService.updateUserRole(userId, newRole);
      setSuccess(`User role updated to ${newRole}`);
      setSelectedRole({ ...selectedRole, [userId]: "" as any });
      await loadUsers();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update user role";
      setError(errorMessage);
      console.error("Update role error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <DashboardShell title="Admin Users" subtitle="Manage accounts and roles." menu={adminMenu}>
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            All users ({users.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedRole[user._id || user.id || ""] || user.role}
                        onChange={(e) => setSelectedRole({ ...selectedRole, [user._id || user.id || ""]: e.target.value as any })}
                        className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white dark:bg-slate-900 dark:border-slate-600"
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                      {selectedRole[user._id || user.id || ""] && selectedRole[user._id || user.id || ""] !== user.role && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateRole(user._id || user.id || "")}
                          isLoading={actionLoading === (user._id || user.id)}
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Badge variant={user.isVerified ? "success" : "warning"}>
                        {user.isVerified ? "Verified" : "Pending"}
                      </Badge>
                      <Badge variant={user.isBlocked ? "danger" : "neutral"}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.isBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnblockUser(user._id || user.id || "")}
                          isLoading={actionLoading === (user._id || user.id)}
                          leftIcon={<Unlock className="h-4 w-4" />}
                        >
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBlockUser(user._id || user.id || "")}
                          isLoading={actionLoading === (user._id || user.id)}
                          leftIcon={<Lock className="h-4 w-4" />}
                        >
                          Block
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteUser(user._id || user.id || "")}
                        isLoading={actionLoading === (user._id || user.id)}
                        leftIcon={<Trash2 className="h-4 w-4" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
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
  return (
    <PrivateRoute roles={["admin"]}>
      <AdminUsersContent />
    </PrivateRoute>
  );
}