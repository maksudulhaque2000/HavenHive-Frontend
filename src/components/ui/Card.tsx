"use client";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "bordered" | "elevated";
}

export default function Card({ variant = "elevated", className = "", children, ...props }: CardProps) {
  const variants = {
    flat: "bg-white/80 dark:bg-slate-900/80",
    bordered: "border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
    elevated:
      "border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700",
  };

  return (
    <div
      className={cn("rounded-xl p-6 sm:p-7 transition-all duration-300", variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
