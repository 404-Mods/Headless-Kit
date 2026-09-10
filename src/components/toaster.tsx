"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Cancel01Icon,
  InformationCircleIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { useToast, type ToastType } from "@/context/toast";

const ICONS: Record<ToastType, typeof CheckmarkCircle01Icon> = {
  success: CheckmarkCircle01Icon,
  error: Cancel01Icon,
  info: InformationCircleIcon,
};

const COLORS: Record<ToastType, string> = {
  success: "var(--color-brand)",
  error: "var(--color-accent)",
  info: "var(--color-info)",
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-9999 flex flex-col gap-2 pointer-events-none sm:top-5 sm:right-5">
      {toasts.map((t) => {
        const icon = ICONS[t.type];
        const color = COLORS[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-85 items-start gap-3 overflow-hidden rounded-2xl border border-fg/8 bg-surface-raised/95 px-4 py-3.5 shadow-2xl shadow-black/50 backdrop-blur-xl ${
              t.leaving ? "toast-leave" : "toast-enter"
            }`}
          >
            {/* Accent left bar */}
            <div
              className="mt-0.5 h-4 w-0.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />

            {/* Icon */}
            <HugeiconsIcon
              icon={icon}
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color }}
            />

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-fg leading-snug">{t.message}</p>
              {t.subtitle && (
                <p className="mt-0.5 text-xs text-fg/40 leading-snug">{t.subtitle}</p>
              )}
            </div>

            {/* Dismiss */}
            <button
              onClick={() => dismiss(t.id)}
              className="mt-0.5 shrink-0 text-fg/20 transition-colors hover:text-fg/60"
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
