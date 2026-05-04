"use client";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  loading,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const resolvedLoading = loading ?? isLoading;

  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-sm hover:bg-primary/95 hover:shadow-md disabled:bg-slate-400",
    secondary:
      "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/95 hover:shadow-md disabled:bg-slate-400",
    danger:
      "bg-danger text-danger-foreground shadow-sm hover:bg-danger/95 hover:shadow-md disabled:bg-slate-400",
    ghost:
      "bg-transparent text-primary hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50",
    outline:
      "border border-slate-300 bg-white text-slate-900 hover:border-primary hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-base",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-light disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950",
        fullWidth && "w-full",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || resolvedLoading}
      {...props}
    >
      {resolvedLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : leftIcon}
      <span>{children}</span>
      {!resolvedLoading && rightIcon}
    </button>
  );
}
