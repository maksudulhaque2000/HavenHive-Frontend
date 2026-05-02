"use client";

import { cn } from "@/lib/utils";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const styles = {
    success: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
    error: "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
    warning: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
    info: "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ⓘ",
  };

  return (
    <div className={cn("flex items-start justify-between gap-3 rounded-xl border px-4 py-3", styles[type])}>
      <div className="flex gap-3">
        <span className="mt-0.5 text-lg font-bold">{icons[type]}</span>
        <p className="text-sm leading-6">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-lg font-bold opacity-60 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
}
