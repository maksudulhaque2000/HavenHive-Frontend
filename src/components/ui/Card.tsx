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
      "border border-slate-200 bg-white shadow-soft hover:-translate-y-0.5 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900",
  };

  return (
    <div
      className={cn("rounded-xl p-6 transition-all duration-300", variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
