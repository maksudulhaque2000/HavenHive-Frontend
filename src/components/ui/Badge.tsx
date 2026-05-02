"use client";

import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
}

export default function Badge({ variant = "neutral", size = "md", className = "", children, ...props }: BadgeProps) {
  const styles = {
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-200",
    info: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200",
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full font-semibold uppercase tracking-wide", styles[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}