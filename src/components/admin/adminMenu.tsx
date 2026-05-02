import { Building2, CalendarCheck2, Contact, LayoutGrid, Users } from "lucide-react";
import { DashboardMenuItem } from "@/components/layout/DashboardShell";

export const adminMenu: DashboardMenuItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: <LayoutGrid className="h-4 w-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Properties", href: "/admin/properties", icon: <Building2 className="h-4 w-4" /> },
  { label: "Bookings", href: "/admin/bookings", icon: <CalendarCheck2 className="h-4 w-4" /> },
  { label: "Contacts", href: "/admin/contacts", icon: <Contact className="h-4 w-4" /> },
];