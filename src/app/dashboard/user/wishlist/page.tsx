"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PropertyCard from "@/components/property/PropertyCard";
import { useAuth } from "@/hooks/useAuth";
import { propertyService } from "@/lib/services/property";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function WishlistPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const menu = [
    { label: "Dashboard", href: "/dashboard/user", icon: <></> },
    { label: "My Profile", href: "/profile", icon: <></> },
    { label: "Explore Properties", href: "/properties", icon: <></> },
    { label: "Contact Support", href: "/contact", icon: <></> },
  ];

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (!user?.wishlist || user.wishlist.length === 0) {
          setProperties([]);
          return;
        }
        const list = await Promise.all(
          user.wishlist.map(async (id) => {
            try {
              const res = await propertyService.getById(id);
              return res.data;
            } catch {
              return null;
            }
          })
        );
        setProperties(list.filter(Boolean));
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [user?.wishlist]);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <DashboardShell title="My Wishlist" subtitle="Saved properties you loved." menu={menu}>
      <div className="space-y-6">
        {properties.length === 0 ? (
          <div className="p-8 text-center text-slate-600">No saved properties yet.</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p._id || p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
