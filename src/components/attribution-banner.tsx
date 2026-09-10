"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useEffect } from "react";
import { attribution, CREDIT } from "@/config/attribution";

/**
 * One-line credit in the browser console, for developers who look under the
 * hood. Renders nothing and logs once per page load.
 */
export function AttributionBanner() {
  useEffect(() => {
    const suffix = attribution.url ? ` — ${attribution.url}` : "";
    // Styled so it reads as a banner rather than stray debug output.
    console.log(
      `%c${CREDIT}%c${suffix}`,
      "font-weight:bold;color:#7172b2",
      "color:inherit"
    );
  }, []);

  return null;
}
