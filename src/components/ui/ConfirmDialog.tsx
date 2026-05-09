"use client";

import Modal from "./Modal";
import Button from "./Button";
import { AlertCircle, Trash2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  danger?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  danger = false,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const IconComponent = danger ? Trash2 : AlertCircle;
  const iconColor = danger ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400";
  const iconBg = danger ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30";

  return (
    <Modal open={open} onClose={onCancel}>
      <div className="mb-6 flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}>
          <IconComponent className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {message}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
        <Button 
          variant="secondary" 
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button 
          variant={danger ? "destructive" : "primary"} 
          onClick={onConfirm}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          )}
          {isLoading ? `${confirmLabel}ing...` : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
