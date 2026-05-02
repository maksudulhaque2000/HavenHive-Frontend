"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, CalendarCheck2, Contact, LayoutGrid, Users } from "lucide-react";
import { bookingService } from "@/lib/services/booking";
import { contactService } from "@/lib/services/contact";
import { propertyService } from "@/lib/services/property";
import { userService } from "@/lib/services/user";
import { Booking, Contact as ContactMessage, Property, StatsResponse, User } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import DashboardShell, { DashboardMenuItem } from "@/components/layout/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency, formatDate } from "@/lib/utils";

const menu: DashboardMenuItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: <LayoutGrid className="h-4 w-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Properties", href: "/admin/properties", icon: <Building2 className="h-4 w-4" /> },
  { label: "Bookings", href: "/admin/bookings", icon: <CalendarCheck2 className="h-4 w-4" /> },
  { label: "Contacts", href: "/admin/contacts", icon: <Contact className="h-4 w-4" /> },
];

export default function AdminDashboardView() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [propertyStats, setPropertyStats] = useState({ total: 0, published: 0, draft: 0, featured: 0 });
  const [monthlyPropertiesData, setMonthlyPropertiesData] = useState<any[]>([]);
  const [monthlyUsersData, setMonthlyUsersData] = useState<any[]>([]);
  const [typeDistributionData, setTypeDistributionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [usersResponse, propertiesResponse, bookingsResponse, contactsResponse, statsResponse] = await Promise.all([
          userService.getAll(),
          propertyService.getAll({ limit: 6 }),
          bookingService.getAll(),
          contactService.getAll(),
          propertyService.getStats(),
        ]);

        setUsers(usersResponse.data || []);
        setProperties(propertiesResponse.data || []);
        setBookings(bookingsResponse.data || []);
        setContacts(contactsResponse.data || []);
        const statsData: Partial<StatsResponse> = statsResponse.data || {};
        setPropertyStats({
          total: statsData.total ?? 0,
          published: statsData.published ?? 0,
          draft: statsData.draft ?? 0,
          featured: statsData.featured ?? 0,
        });

        // Prepare chart data from fetched lists (derived from existing records)
        try {
          // last 12 months labels
          const months = Array.from({ length: 12 }).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (11 - i));
            return d;
          });

          const monthLabels = months.map((d) => d.toLocaleString(undefined, { month: "short", year: "numeric" }));

          const propMonthly = monthLabels.map((label, idx) => {
            const start = new Date(months[idx].getFullYear(), months[idx].getMonth(), 1);
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
            const count = (propertiesResponse.data || []).filter((p: Property) => {
              const created = p.createdAt ? new Date(p.createdAt) : new Date(0);
              return created >= start && created < end;
            }).length;
            return { month: label, count };
          });

          const userMonthly = monthLabels.map((label, idx) => {
            const start = new Date(months[idx].getFullYear(), months[idx].getMonth(), 1);
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
            const count = (usersResponse.data || []).filter((u: User) => {
              const created = u.createdAt ? new Date(u.createdAt) : new Date(0);
              return created >= start && created < end;
            }).length;
            return { month: label, count };
          });

          const typeMap: Record<string, number> = {};
          (propertiesResponse.data || []).forEach((p: Property) => {
            const t = p.type || "other";
            typeMap[t] = (typeMap[t] || 0) + 1;
          });
          const typeData = Object.keys(typeMap).map((k) => ({ name: k, value: typeMap[k] }));

          setMonthlyPropertiesData(propMonthly);
          setMonthlyUsersData(userMonthly);
          setTypeDistributionData(typeData);
        } catch (err) {
          // silently ignore chart derivation errors
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <DashboardShell title="Admin Dashboard" subtitle={`System overview for ${user?.name || "admin"}.`} menu={menu}>
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Users</p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-100">{users.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Properties</p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-100">{propertyStats.total || properties.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Bookings</p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-100">{bookings.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Messages</p>
            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-100">{contacts.length}</p>
          </Card>
        </section>
        <section className="grid gap-6 xl:grid-cols-3">
          <Card className="p-4">
            <span className="section-label">Monthly Listings</span>
            <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">New properties (last 12 months)</h3>
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPropertiesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1B2B5E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <span className="section-label">User Registrations</span>
            <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">Monthly new users</h3>
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyUsersData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#F5A623" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <span className="section-label">Property Types</span>
            <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">Type distribution</h3>
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                    {typeDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={["#1B2B5E", "#F5A623", "#065F46", "#991B1B", "#6B7280"][index % 5]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-6">
            <span className="section-label">Health</span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Property metrics</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Published</p>
                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{propertyStats.published || 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Draft</p>
                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{propertyStats.draft || 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Featured</p>
                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{propertyStats.featured || 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Revenue hint</p>
                <p className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">{formatCurrency((properties[0]?.price || 0) + (bookings.length * 100))}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/admin/properties"><Button variant="outline">Manage properties</Button></Link>
              <Link href="/admin/users"><Button variant="outline">Manage users</Button></Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="section-label">Recent items</span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Recent system activity</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{booking.property.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{booking.user.name} • {formatDate(booking.visitDate)}</p>
                  </div>
                  <Badge variant={booking.status === "confirmed" ? "success" : booking.status === "cancelled" ? "danger" : "warning"}>{booking.status}</Badge>
                </div>
              ))}
              {contacts.slice(0, 3).map((contact) => (
                <div key={contact._id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{contact.subject}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{contact.name} • {contact.email}</p>
                  </div>
                  <Badge variant={contact.status === "resolved" ? "success" : contact.status === "in-progress" ? "warning" : "info"}>{contact.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Card className="p-6">
            <span className="section-label">Users</span>
            <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">Latest users</h3>
            <div className="mt-4 space-y-3">
              {users.slice(0, 4).map((item) => (
                <div key={item._id || item.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.email} • {item.role}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <span className="section-label">Properties</span>
            <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">Latest properties</h3>
            <div className="mt-4 space-y-3">
              {properties.slice(0, 4).map((item) => (
                <div key={item._id || item.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.location.city} • {item.status}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <span className="section-label">Messages</span>
            <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">Latest contact requests</h3>
            <div className="mt-4 space-y-3">
              {contacts.slice(0, 4).map((item) => (
                <div key={item._id || item.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{item.subject}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
}