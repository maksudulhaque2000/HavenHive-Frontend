"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const getAvatarUrl = () => {
    if (!user?.avatar) return null;
    if (typeof user.avatar === "string") {
      return user.avatar;
    }
    if (typeof user.avatar === "object" && user.avatar?.url) {
      return user.avatar.url;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();
  const userInitial = user?.name.slice(0, 1).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container flex h-16 items-center justify-between gap-4 sm:h-20 lg:gap-8">
        <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-primary sm:text-2xl flex-shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-xs text-white shadow-sm sm:h-11 sm:w-11 sm:text-sm">HH</span>
          HavenHive
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Link href="/properties" className="text-base font-medium text-slate-700 transition-colors hover:text-primary dark:text-slate-200">
            Properties
          </Link>
          <Link href="/blogs" className="text-base font-medium text-slate-700 transition-colors hover:text-primary dark:text-slate-200">
            Blogs
          </Link>
          <Link href="/about" className="text-base font-medium text-slate-700 transition-colors hover:text-primary dark:text-slate-200">
            About
          </Link>
          <Link href="/contact" className="text-base font-medium text-slate-700 transition-colors hover:text-primary dark:text-slate-200">
            Contact
          </Link>
          {user && (
            <Link href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="text-base font-medium text-slate-700 transition-colors hover:text-primary dark:text-slate-200">
              {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          {user ? (
            <>
              <div className="hidden text-right xl:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
              </div>
              <Link href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900 overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user.name}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </Link>
              <Button variant="outline" size="md" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="md">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="md">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="md" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="container flex flex-col gap-2">
            <Link href="/properties" className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
              Properties
            </Link>
            <Link href="/blogs" className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
              Blogs
            </Link>
            <Link href="/about" className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
              About
            </Link>
            <Link href="/contact" className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
              Contact
            </Link>
            {user && (
              <Link href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
                {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
              </Link>
            )}
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-2">
                  <div className="h-10 w-10 rounded-full bg-slate-900 dark:bg-slate-100 text-sm font-semibold text-white dark:text-slate-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                  </div>
                </div>
                <Button variant="danger" fullWidth size="md" onClick={handleLogout} className="mt-2">
                  Logout
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/auth/login">
                  <Button variant="outline" fullWidth size="md">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button fullWidth size="md">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
