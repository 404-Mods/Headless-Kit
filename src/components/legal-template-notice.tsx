/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

/**
 * Shown on the Terms and Privacy pages.
 *
 * The legal copy shipped with this template is a generic starting point, not
 * legal advice — it has not been reviewed for any particular jurisdiction or
 * business. Anyone deploying the store needs to replace it with terms that
 * actually describe what they sell and how they handle data.
 *
 * Delete this component (and its two usages) once you have done that.
 */
export function LegalTemplateNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] px-4 py-3">
      <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <p className="text-xs leading-relaxed text-fg/60">
        <span className="font-bold text-accent">Template placeholder.</span>{" "}
        This page ships with the storefront as a starting point and is not legal
        advice. Replace it with terms reviewed for your own business and
        jurisdiction before you take real payments, then remove this notice.
      </p>
    </div>
  );
}
