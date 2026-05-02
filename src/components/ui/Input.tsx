"use client";

import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  as?: "input" | "textarea";
  rows?: number;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  prefix,
  suffix,
  as = "input",
  rows = 4,
  ...props
}: InputProps) {
  const inputId = id || `input-${label || props.name || "field"}`;
  const sharedStyles = cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
    error
      ? "border-danger focus:border-danger focus:ring-danger/20"
      : "border-slate-200 focus:border-primary focus:ring-primary/15 dark:border-slate-700",
    prefix ? "pl-11" : undefined,
    suffix ? "pr-11" : undefined,
    className
  );

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{prefix}</div>}
        {suffix && <div className="absolute inset-y-0 right-3 flex items-center text-slate-400">{suffix}</div>}
        {as === "textarea" ? (
          <textarea id={inputId} rows={rows} className={sharedStyles} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        ) : (
          <input id={inputId} className={sharedStyles} {...props} />
        )}
      </div>
      {error && <span className="text-xs font-medium text-danger">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>}
    </div>
  );
}
