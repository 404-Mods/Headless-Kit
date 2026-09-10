/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type React from "react";

/**
 * Generic package mark used as the default storefront logo.
 *
 * It is inline SVG rather than an <Image> so it inherits the theme: the gradient
 * references the same `--color-*` custom properties as everything else, so
 * re-theming the store re-themes the logo. Replace the paths with your own mark
 * and it keeps working the same way.
 *
 * A static copy lives at /assets/logos/logo.svg for metadata and favicons, which
 * cannot reference CSS custom properties.
 */
export function LogoMark({
  title = "Logo",
  ...props
}: React.ComponentProps<"svg"> & { title?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" role="img" aria-label={title} {...props}>
      <defs>
        <linearGradient id="logo-mark-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-brand)" />
          <stop offset="55%" stopColor="var(--color-info)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      {/* isometric box — reads as "a package" at any size */}
      <path
        d="M16 2.75 L28.4 9.4 V22.6 L16 29.25 L3.6 22.6 V9.4 Z"
        stroke="url(#logo-mark-gradient)"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M3.6 9.4 L16 16.05 L28.4 9.4 M16 16.05 V29.25"
        stroke="url(#logo-mark-gradient)"
        strokeWidth="2.1"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
