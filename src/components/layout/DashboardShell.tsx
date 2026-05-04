"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

export interface DashboardMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  menu: DashboardMenuItem[];
  children: React.ReactNode;
}

export default function DashboardShell({ title, subtitle, menu, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const sidebarWidth = collapsed ? "lg:w-20" : "lg:w-64";

  return (
    <div className="min-h-[calc(100vh-5rem)] lg:flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 mt-20 hidden h-[calc(100vh-5rem)] border-r border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:flex lg:flex-col",
          sidebarWidth
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">HavenHive</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role === "admin" ? "Admin Console" : "User Area"}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Collapse sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {menu.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-l-4 px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "border-secondary bg-primary text-white shadow-soft"
                    : "border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <Button variant="outline" fullWidth onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
            {!collapsed ? "Logout" : ""}
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 mt-20 w-72 transform border-r border-slate-200 bg-white shadow-lift transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">HavenHive</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role === "admin" ? "Admin Console" : "User Area"}</p>
          </div>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close sidebar" className="rounded-xl border border-slate-200 p-2 dark:border-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {menu.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-l-4 px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "border-secondary bg-primary text-white shadow-soft"
                    : "border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className={cn("flex-1", "lg:pl-64", collapsed && "lg:pl-20")}>
        <header className="sticky top-20 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-700 transition-colors lg:hidden dark:border-slate-800 dark:text-slate-300" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button type="button" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-700 transition-colors dark:border-slate-800 dark:text-slate-300" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary" />
              </button>
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="px-4 py-8 sm:px-6 lg:px-8">{children}</section>
      </div>
    </div>
  );
}
