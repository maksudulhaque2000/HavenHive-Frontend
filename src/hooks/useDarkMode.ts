"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "havenhive_theme";

export function useDarkMode() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = stored || preferred;
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const applyTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    
    // Add smooth transition
    const html = document.documentElement;
    html.style.transition = "background-color 0.3s ease, color 0.3s ease";
    
    // Apply theme
    html.classList.toggle("dark", nextTheme === "dark");
    
    // Remove transition after it completes
    setTimeout(() => {
      html.style.transition = "";
    }, 300);
  };

  return {
    theme,
    setTheme: applyTheme,
    toggleTheme: () => applyTheme(theme === "dark" ? "light" : "dark"),
  };
}