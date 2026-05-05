"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
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
        <Footer />
      </body>
    </html>
  );
}
