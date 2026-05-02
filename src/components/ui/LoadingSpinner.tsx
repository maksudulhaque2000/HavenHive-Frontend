"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
  label?: string;
}

export default function LoadingSpinner({ size = "md", fullPage = false, label = "Loading" }: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-9 w-9",
    lg: "h-14 w-14",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
      <div className={cn(sizes[size], "animate-spin rounded-full border-4 border-slate-200 border-t-primary dark:border-slate-700")} />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
}
