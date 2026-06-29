"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  if (!open) return null;

  const variantStyles = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-accent hover:bg-accent/90",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-4 ${
            variant === "danger" ? "bg-red-100" :
            variant === "warning" ? "bg-yellow-100" : "bg-accent/10"
          }`}>
            <AlertTriangle className={`h-6 w-6 ${
              variant === "danger" ? "text-red-500" :
              variant === "warning" ? "text-yellow-500" : "text-accent"
            }`} />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className={`flex-1 text-white ${variantStyles[variant]}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Processing..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
