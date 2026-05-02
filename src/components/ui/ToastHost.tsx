"use client";

import { useEffect, useState } from "react";
import { toastEvents, ToastEvent } from "./toast-events";
import { cn } from "@/lib/utils";

export default function ToastHost() {
  const [toasts, setToasts] = useState<Array<ToastEvent & { id: number }>>([]);

  useEffect(() => {
    let nextId = 1;
    const unsubscribe = toastEvents.subscribe((toast) => {
      const id = nextId++;
      setToasts((current) => [...current, { ...toast, id }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 3500);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[110] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto rounded-2xl border px-4 py-3 shadow-lift backdrop-blur",
            toast.type === "success" && "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-100",
            toast.type === "error" && "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/80 dark:text-red-100",
            toast.type === "warning" && "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/80 dark:text-amber-100",
            toast.type === "info" && "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/80 dark:text-sky-100"
          )}
        >
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}