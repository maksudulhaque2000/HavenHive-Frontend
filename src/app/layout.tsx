"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import Navbar from "@/components/ui/Navbar";
import ToastHost from "@/components/ui/ToastHost";
import { useDarkMode } from "@/hooks/useDarkMode";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { hydrate } = useAuthStore();
  const { theme } = useDarkMode();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <html lang="en">
      <body>
        <ToastHost />
        <Navbar />
        <main className="min-h-screen page-background">
          {children}
        </main>
        <footer className="mt-12 border-t border-slate-200 bg-white/90 py-8 text-slate-600 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400">
          <div className="container text-center text-sm">
            <p>&copy; 2026 HavenHive. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
