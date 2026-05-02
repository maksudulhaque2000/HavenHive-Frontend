"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, Heart, Home, Mail, Sparkles } from "lucide-react";
import { bookingService } from "@/lib/services/booking";
import { propertyService } from "@/lib/services/property";
import { userService } from "@/lib/services/user";
import { Booking, Property } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import DashboardShell, { DashboardMenuItem } from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PropertyCard from "@/components/property/PropertyCard";
import { formatDate } from "@/lib/utils";

const menu: DashboardMenuItem[] = [
  { label: "Dashboard", href: "/dashboard/user", icon: <Home className="h-4 w-4" /> },
  { label: "My Profile", href: "/profile", icon: <Sparkles className="h-4 w-4" /> },
  { label: "Explore Properties", href: "/properties", icon: <Home className="h-4 w-4" /> },
  { label: "Contact Support", href: "/contact", icon: <Mail className="h-4 w-4" /> },
];

export default function UserDashboardView() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({ wishlistCount: 0, role: "user", isVerified: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [bookingResponse, propertyResponse, statsResponse] = await Promise.all([
          bookingService.getAll(),
          propertyService.getFeatured(),
          userService.getStats(),
        ]);

        setBookings(bookingResponse.data || []);
        setFeaturedProperties(propertyResponse.data || []);
        setStats(statsResponse.data || { wishlistCount: 0, role: user?.role || "user", isVerified: false });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [user?.role]);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <DashboardShell title="User Dashboard" subtitle={`Welcome back, ${user?.name || "there"}.`} menu={menu}>
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-secondary" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Saved properties</p>
            </div>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-100">{stats.wishlistCount || 0}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <CalendarCheck2 className="h-5 w-5 text-secondary" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Bookings</p>
            </div>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-100">{bookings.length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-secondary" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Verification</p>
            </div>
            <p className={`mt-3 text-4xl font-black ${stats.isVerified ? "text-emerald-600" : "text-amber-600"}`}>
              {stats.isVerified ? "Verified" : "Pending"}
            </p>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <span className="section-label">My bookings</span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Upcoming visits</h2>
              </div>
              <Link href="/properties">
                <Button size="sm" variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Browse more
                </Button>
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
                No bookings yet. Explore properties and schedule a visit.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{booking.property.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(booking.visitDate)} • {booking.property.location.city}</p>
                    </div>
                    <Badge variant={booking.status === "confirmed" ? "success" : booking.status === "cancelled" ? "danger" : "warning"}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <span className="section-label">Quick actions</span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Next steps</h2>
            <div className="mt-5 space-y-3">
              <Link href="/properties">
                <Button fullWidth variant="outline" leftIcon={<Home className="h-4 w-4" />}>
                  Search properties
                </Button>
              </Link>
              <Link href="/profile">
                <Button fullWidth variant="outline" leftIcon={<Sparkles className="h-4 w-4" />}>
                  Update profile
                </Button>
              </Link>
              <Link href="/contact">
                <Button fullWidth variant="outline" leftIcon={<Mail className="h-4 w-4" />}>
                  Contact support
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <div>
            <span className="section-label">Recommended</span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Featured homes you may like</h2>
          </div>
          {featuredProperties.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {featuredProperties.slice(0, 3).map((property) => (
                <PropertyCard key={property.slug || property._id} property={property} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-slate-500 dark:text-slate-400">No featured properties are available right now.</Card>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}