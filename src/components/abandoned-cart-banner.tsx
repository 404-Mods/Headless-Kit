"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useSyncExternalStore } from "react";
import { useCart } from "@/context/cart";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

const DISMISSED_KEY = STORAGE_KEYS.cartBannerDismissed;
const DISMISSED_EVENT = "vs:cart-banner-dismissed";

function subscribeDismissed(onChange: () => void) {
  window.addEventListener(DISMISSED_EVENT, onChange);
  return () => window.removeEventListener(DISMISSED_EVENT, onChange);
}

function getDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return true;
  }
}

/** Treat as dismissed during SSR so the banner never flashes before hydration. */
function getDismissedOnServer(): boolean {
  return true;
}

export function AbandonedCartBanner() {
  const { basketIdent, items, openCart } = useCart();
  const dismissed = useSyncExternalStore(subscribeDismissed, getDismissed, getDismissedOnServer);

  function dismiss() {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // storage unavailable (private mode) — the event still hides it for this session
    }
    window.dispatchEvent(new Event(DISMISSED_EVENT));
  }

  // Show only when there's a saved basket, the cart has items, and it wasn't dismissed
  if (dismissed || !basketIdent || items.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-30 sm:bottom-6 sm:left-auto sm:right-20 sm:w-72">
      <div className="flex items-center gap-3 rounded-2xl border border-brand/30 bg-surface-raised/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand/15">
          <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4 text-brand" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-fg">You left something behind</p>
          <button
            onClick={() => { openCart(); dismiss(); }}
            className="mt-0.5 text-[10px] font-semibold text-brand hover:underline"
          >
            View your cart →
          </button>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-fg/30 transition-colors hover:bg-fg/5 hover:text-fg"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
