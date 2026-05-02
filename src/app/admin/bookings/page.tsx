"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "@/components/layout/PrivateRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { bookingService } from "@/lib/services/booking";
import { Booking } from "@/types";
import { adminMenu } from "@/components/admin/adminMenu";
import { formatDate } from "@/lib/utils";

function AdminBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingService.getAll();
        setBookings(response.data || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <DashboardShell title="Admin Bookings" subtitle="Track and manage visit requests." menu={adminMenu}>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">All bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Property</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Visit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{booking.property.title}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{booking.user.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{formatDate(booking.visitDate)}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{booking.type}</td>
                  <td className="px-6 py-4"><Badge variant={booking.status === "confirmed" ? "success" : booking.status === "cancelled" ? "danger" : "warning"}>{booking.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}

export default function AdminBookingsPage() {
  return <PrivateRoute roles={["admin"]}><AdminBookingsContent /></PrivateRoute>;
}