"use client";

import { MoonStar, SunMedium } from "lucide-react";
import Button from "./Button";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      className="transition-transform duration-300"
    >
      {theme === "dark" ? (
        <SunMedium className="h-5 w-5 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <MoonStar className="h-5 w-5 transition-transform duration-300 -rotate-90 scale-100" />
      )}
    </Button>
  );
}