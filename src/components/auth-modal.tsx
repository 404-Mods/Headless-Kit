"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useCart } from "@/context/cart";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, GameController02Icon, ArrowRight01Icon, Shield01Icon } from "@hugeicons/core-free-icons";

export function AuthModal() {
  const { needsAuth, authLinks, clearAuth } = useCart();

  if (!needsAuth) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
        onClick={clearAuth}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-fg/10 bg-surface-panel shadow-2xl shadow-black/60">
        {/* Gradient top bar */}
        <div className="h-1 w-full bg-linear-to-r from-brand via-info to-accent" />

        {/* Close */}
        <button
          onClick={clearAuth}
          className="absolute right-4 top-4 rounded-lg p-1 text-fg/30 transition-colors hover:text-fg/70"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
        </button>

        <div className="p-6 pt-5">
          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 border border-brand/25">
            <HugeiconsIcon icon={GameController02Icon} className="h-6 w-6 text-brand" />
          </div>

          {/* Copy */}
          <h2 className="mb-2 text-lg font-black text-fg">Link your game account</h2>
          <p className="mb-5 text-sm leading-relaxed text-fg/45">
            To receive in-game items, you need to link your game account. You&apos;ll be sent back here automatically once it&apos;s done.
          </p>

          {/* Auth link buttons */}
          <div className="space-y-2.5">
            {authLinks.length > 0 ? (
              authLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="group flex w-full items-center justify-between rounded-xl border border-fg/8 bg-fg/4 px-4 py-3 text-sm font-semibold text-fg transition-all duration-200 hover:border-brand/40 hover:bg-brand/10"
                >
                  <span>Continue with {link.name}</span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="h-4 w-4 text-fg/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg"
                  />
                </a>
              ))
            ) : (
              <p className="text-center text-xs text-fg/30">No auth methods available.</p>
            )}
          </div>

          {/* Trust note */}
          <div className="mt-5 flex items-center gap-2 text-[10px] text-fg/25">
            <HugeiconsIcon icon={Shield01Icon} className="h-3.5 w-3.5 shrink-0" />
            Powered by Tebex · Your account is never stored by us
          </div>
        </div>
      </div>
    </div>
  );
}
