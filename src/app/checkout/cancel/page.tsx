/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";

export const metadata = { title: "Checkout Cancelled" };

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
        <HugeiconsIcon icon={Cancel01Icon} className="h-10 w-10 text-red-400" />
      </div>
      <h1 className="text-3xl font-black text-fg">Checkout Cancelled</h1>
      <p className="mt-3 max-w-sm text-base text-fg/40">
        No worries — your cart is still saved. You can complete your purchase whenever you&apos;re ready.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-hover"
        >
          <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </div>
  );
}
