/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { DEMO_MODE } from "@/config/demo";
import { attribution } from "@/config/attribution";

/**
 * Sits above the navbar in demo mode.
 *
 * A demo storefront that looks exactly like a real one is a trap — someone will
 * eventually try to buy something. This says plainly what it is, up front.
 */
export function DemoBanner() {
  if (!DEMO_MODE) return null;

  return (
    <div className="relative z-50 border-b border-info/20 bg-info/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center">
        <HugeiconsIcon icon={InformationCircleIcon} className="h-3.5 w-3.5 shrink-0 text-info" />
        <p className="text-xs text-fg/60">
          <span className="font-bold text-fg/80">Demo store.</span>{" "}
          Products are samples and checkout is disabled — nothing here can be bought.
        </p>
        {attribution.url && (
          <a
            href={attribution.url}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-1 text-xs font-bold text-info transition-colors hover:text-fg"
          >
            Get {attribution.product}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            />
          </a>
        )}
      </div>
    </div>
  );
}
