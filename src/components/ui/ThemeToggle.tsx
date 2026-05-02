"use client";

import { MoonStar, SunMedium } from "lucide-react";
import Button from "./Button";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </Button>
  );
}