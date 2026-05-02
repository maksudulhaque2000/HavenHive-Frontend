"use client";

import { useEffect, useState } from "react";
import PrivateRoute from "@/components/layout/PrivateRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { propertyService } from "@/lib/services/property";
import { Property } from "@/types";
import { adminMenu } from "@/components/admin/adminMenu";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

function AdminPropertiesContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await propertyService.getAll({ limit: 100, sort: "-createdAt" });
        setProperties(response.data || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <DashboardShell title="Admin Properties" subtitle="Monitor all property listings." menu={adminMenu}>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">All properties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">City</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {properties.map((property) => (
                <tr key={property._id || property.id}>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                    <Link href={`/properties/${property.slug || property._id}`} className="hover:underline">{property.title}</Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{property.location?.city}</td>
                  <td className="px-6 py-4"><Badge variant={property.status === "published" ? "success" : property.status === "draft" ? "warning" : "neutral"}>{property.status}</Badge></td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{formatCurrency(property.price)}</td>
                  <td className="px-6 py-4"><Badge variant={property.featured ? "info" : "neutral"}>{property.featured ? "Featured" : "No"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}

export default function AdminPropertiesPage() {
  return <PrivateRoute roles={["admin"]}><AdminPropertiesContent /></PrivateRoute>;
}