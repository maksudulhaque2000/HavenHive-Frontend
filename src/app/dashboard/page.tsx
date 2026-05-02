"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { bookingService } from "@/lib/services/booking";
import { userService } from "@/lib/services/user";
import { Booking } from "@/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const loadData = async () => {
      try {
        const bookingData = await bookingService.getAll();
        setBookings(bookingData.data || []);

        const statsData = await userService.getStats();
        setStats(statsData.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  if (!user || isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-gray-600 text-sm">Wishlist Items</p>
            <p className="text-4xl font-bold text-primary">{stats.wishlistCount || 0}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Role</p>
            <p className="text-2xl font-bold capitalize">{stats.role || user.role}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Email Status</p>
            <p className={`text-xl font-bold ${stats.isVerified ? "text-green-600" : "text-yellow-600"}`}>
              {stats.isVerified ? "Verified" : "Pending"}
            </p>
          </Card>
        </div>
      )}

      {/* Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <Card>
            <p className="text-gray-600 text-center py-8">No bookings yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/properties/${booking.property._id}`}>
                      <h3 className="text-xl font-bold text-primary hover:underline">
                        {booking.property.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600">
                      {formatCurrency(booking.property.price)} • {booking.property.location.city}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Visit Date: {formatDate(booking.visitDate)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
