/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { AddToCartResult } from "@/context/cart";
import type { ToastType } from "@/context/toast";

type ToastFn = (message: string, options?: { subtitle?: string; type?: ToastType }) => void;

/**
 * Turns an add-to-cart outcome into the matching toast. Shared so every entry
 * point (product page, card, mobile CTA) reports the same thing — and so none of
 * them claim success for a request that never happened.
 */
export function toastAddResult(result: AddToCartResult, productName: string, toast: ToastFn) {
  switch (result.status) {
    case "added":
      toast("Added to cart", { subtitle: productName });
      return;
    case "already-in-cart":
      toast("Already in your cart", { subtitle: productName, type: "info" });
      return;
    case "needs-auth":
      // The auth modal is now on screen and explains the next step itself.
      return;
    case "error":
      toast("Couldn't add to cart", { subtitle: result.message, type: "error" });
      return;
  }
}
