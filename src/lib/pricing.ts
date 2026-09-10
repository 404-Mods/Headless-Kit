/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

/**
 * Discount maths derived from prices rather than from Tebex's `discount` field.
 *
 * `discount` on a Tebex package is a monetary AMOUNT, not a percentage — but the
 * UI was rendering it as `{pkg.discount}% OFF`, so a $5.25 discount displayed as
 * "5.25% OFF" and a package whose prices were equal could still claim a sale.
 *
 * `base_price` and `total_price` are unambiguous, so everything here is computed
 * from those two. That stays correct whichever way `discount` is interpreted.
 */

interface Priced {
  base_price: number;
  total_price: number;
}

/** True when the package genuinely costs less than its base price. */
export function isDiscounted(pkg: Priced): boolean {
  return pkg.base_price > 0 && pkg.total_price < pkg.base_price;
}

/** Whole-number percentage off, e.g. 15 for "15% OFF". Zero when not discounted. */
export function discountPercent(pkg: Priced): number {
  if (!isDiscounted(pkg)) return 0;
  return Math.round((1 - pkg.total_price / pkg.base_price) * 100);
}

/** Money saved against the base price. Zero when not discounted. */
export function savedAmount(pkg: Priced): number {
  if (!isDiscounted(pkg)) return 0;
  return Math.round((pkg.base_price - pkg.total_price) * 100) / 100;
}
