"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight text-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm text-white shadow-soft">HH</span>
          HavenHive
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/properties" className="font-medium text-slate-700 hover:text-primary dark:text-slate-200">
            Properties
          </Link>
          <Link href="/blogs" className="font-medium text-slate-700 hover:text-primary dark:text-slate-200">
            Blogs
          </Link>
          <Link href="/about" className="font-medium text-slate-700 hover:text-primary dark:text-slate-200">
            About
          </Link>
          <Link href="/contact" className="font-medium text-slate-700 hover:text-primary dark:text-slate-200">
            Contact
          </Link>
          {user && (
            <Link href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="font-medium text-slate-700 hover:text-primary dark:text-slate-200">
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <>
              <div className="hidden text-right xl:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
              </div>
              <Link href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                {user.name.slice(0, 1).toUpperCase()}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-soft dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="container flex flex-col gap-3">
            <Link href="/properties" className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
              Properties
            </Link>
            <Link href="/blogs" className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
              Blogs
            </Link>
            <Link href="/about" className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
              About
            </Link>
            <Link href="/contact" className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
              Contact
            </Link>
            {user && (
              <Link href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
                Dashboard
              </Link>
            )}
            {user ? (
              <Button variant="danger" fullWidth onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth/login">
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button fullWidth>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
