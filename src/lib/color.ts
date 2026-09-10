/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

/**
 * Theme colours are CSS custom properties (see the `@theme` block in
 * `src/app/globals.css`), so the old hex-with-alpha-suffix trick no longer
 * works — you cannot append an alpha channel to `var(--color-brand)`.
 *
 * `tint` produces the same translucent fill via `color-mix`, which works with
 * custom properties, plain hex, and any other CSS colour.
 */
export function tint(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}
