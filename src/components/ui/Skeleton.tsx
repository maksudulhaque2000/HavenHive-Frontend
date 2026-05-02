"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "avatar" | "property-card";
}

export default function Skeleton({ variant = "card", className = "", ...props }: SkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded",
    card: "h-48 w-full rounded-2xl",
    avatar: "h-12 w-12 rounded-full",
    "property-card": "h-72 w-full rounded-2xl",
  };

  return <div className={cn("animate-pulse bg-slate-200/80 dark:bg-slate-800", variants[variant], className)} {...props} />;
}