"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { createContext, useContext, useCallback, useState, type ReactNode } from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  subtitle?: string;
  type: ToastType;
  leaving: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, options?: { subtitle?: string; type?: ToastType }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION = 3200;
const LEAVE_DURATION = 260;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    // Mark as leaving first so animation plays
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, LEAVE_DURATION);
  }, []);

  const toast = useCallback(
    (message: string, options?: { subtitle?: string; type?: ToastType }) => {
      const id = Math.random().toString(36).slice(2, 9);
      const newToast: Toast = {
        id,
        message,
        subtitle: options?.subtitle,
        type: options?.type ?? "success",
        leaving: false,
      };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
