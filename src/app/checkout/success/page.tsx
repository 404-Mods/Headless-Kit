/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
  DeliveryBox01Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { tint } from "@/lib/color";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

const STEPS = [
  {
    color: "var(--color-brand)",
    icon: CheckmarkCircle01Icon,
    title: "Payment confirmed",
    body: "Your Tebex receipt has been sent to the email used at checkout.",
  },
  {
    color: "var(--color-info)",
    icon: DeliveryBox01Icon,
    title: "Asset on its way",
    body: "Downloads and in-game deliveries are processed automatically. Check your email for links.",
  },
  {
    color: "var(--color-accent)",
    icon: HelpCircleIcon,
    title: "Need help?",
    body: "If anything doesn't arrive within 15 minutes, open a support ticket in Discord.",
  },
];

export default function CheckoutSuccessPage() {
  return (
    <div className="relative min-h-[80vh] bg-surface">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-150 -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />

      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">

        {/* Icon */}
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-12 w-12 text-emerald-400" />
        </div>

        <h1 className="mb-3 text-3xl font-black text-fg">Order confirmed!</h1>
        <p className="mb-10 max-w-sm text-base text-fg/40">
          Your purchase is complete. Here&apos;s what happens next.
        </p>

        {/* Steps */}
        <div className="mb-10 w-full space-y-3 text-left">
          {STEPS.map(({ color, icon, title, body }, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-fg/5 bg-fg/2 px-5 py-4"
            >
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: tint(color, 9), border: `1px solid ${tint(color, 19)}` }}
              >
                <HugeiconsIcon icon={icon} className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-fg">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-fg/40">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white transition-all hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
            Continue shopping
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-7 py-3 text-sm font-bold text-fg/60 transition-all hover:bg-fg/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
