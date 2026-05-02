"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return <div className="container py-12 text-center">Access Denied</div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">Users</h3>
          <p className="text-gray-600 mb-4">Manage user accounts and roles</p>
        </Card>
        <Card className="hover:shadow-lg cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">Properties</h3>
          <p className="text-gray-600 mb-4">Monitor and manage all properties</p>
        </Card>
        <Card className="hover:shadow-lg cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">Bookings</h3>
          <p className="text-gray-600 mb-4">View and manage property bookings</p>
        </Card>
        <Card className="hover:shadow-lg cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">Contact Messages</h3>
          <p className="text-gray-600 mb-4">Handle customer inquiries and support</p>
        </Card>
      </div>
    </div>
  );
}
