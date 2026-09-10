"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useSyncExternalStore } from "react";
import { createIdStore } from "@/lib/persistent-ids";
import { STORAGE_KEYS } from "@/lib/storage-keys";

/** Saved-for-later packages. Unbounded — the shopper decides how many. */
export const wishlistStore = createIdStore(STORAGE_KEYS.wishlist);

/** Browsing history, newest first. Capped so it stays a rail, not an archive. */
export const RECENTLY_VIEWED_LIMIT = 8;
export const recentlyViewedStore = createIdStore(
  STORAGE_KEYS.recentlyViewed,
  RECENTLY_VIEWED_LIMIT
);

export function useWishlist(): number[] {
  return useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot
  );
}

export function useRecentlyViewed(): number[] {
  return useSyncExternalStore(
    recentlyViewedStore.subscribe,
    recentlyViewedStore.getSnapshot,
    recentlyViewedStore.getServerSnapshot
  );
}
