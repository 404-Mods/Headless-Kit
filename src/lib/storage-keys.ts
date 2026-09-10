/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

/**
 * Browser storage keys, in one place.
 *
 * Namespaced so a store sharing an origin with another app can't collide.
 * Change PREFIX if you deploy more than one storefront on the same domain —
 * note that doing so orphans any carts saved under the old prefix.
 */
const PREFIX = "storefront";

export const STORAGE_KEYS = {
  /** Tebex basket identifier — survives reloads so the cart persists. */
  basketIdent: `${PREFIX}:basket-ident`,
  /** Package the shopper was adding when they were sent off to link an account. */
  pendingPackage: `${PREFIX}:pending-package`,
  /** Whether the abandoned-cart banner was dismissed this session. */
  cartBannerDismissed: `${PREFIX}:cart-banner-dismissed`,
  /** Saved-for-later package IDs. */
  wishlist: `${PREFIX}:wishlist`,
  /** Recently viewed package IDs, most recent first. */
  recentlyViewed: `${PREFIX}:recently-viewed`,
  /** Chosen colour theme, when the shopper has overridden the default. */
  theme: `${PREFIX}:theme`,
} as const;
