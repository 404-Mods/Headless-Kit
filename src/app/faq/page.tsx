/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { Metadata } from "next";
import { site } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { tint } from "@/lib/color";
import {
  HelpCircleIcon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
  UserGroup02Icon,
  DeliveryBox01Icon,
  CreditCardIcon,
  Discount01Icon,
  SecurityLockIcon,
} from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${site.name} — delivery, payments, refunds, and more.`,
};

const FAQ_SECTIONS = [
  {
    icon: DeliveryBox01Icon,
    color: "var(--color-brand)",
    title: "Assets & Products",
    questions: [
      {
        q: "What kind of products are sold here?",
        a: "Digital goods made by community creators — scripts, templates, design assets, tools, and open-source releases. Every listing says exactly what you get before you buy.",
      },
      {
        q: "Are assets ready to use out of the box?",
        a: "Yes. Every item is tested and packaged for direct use. Each product page lists compatibility details and any requirements.",
      },
      {
        q: "Can I preview an asset before buying?",
        a: "Most products include preview images and videos on the product page. If you need more detail before purchasing, feel free to reach out in Discord.",
      },
      {
        q: "What licence do I get with a purchase?",
        a: "Licensing terms vary per product — check the individual product page for usage rights. Some items are open source, others grant a personal, non-transferable licence.",
      },
    ],
  },
  {
    icon: CreditCardIcon,
    color: "var(--color-accent)",
    title: "Payments",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "Payments are processed through Tebex, which supports major credit/debit cards, PayPal, and various regional payment methods depending on your country.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. We never store or handle your card details. All transactions go through Tebex — a PCI-compliant payment platform trusted by thousands of gaming communities worldwide.",
      },
      {
        q: "Will I receive a receipt?",
        a: "Tebex sends an automated email receipt to the address used during checkout. Check your spam folder if you don't see it within a few minutes.",
      },
      {
        q: "Are prices in USD or another currency?",
        a: "Prices are listed in USD by default. Tebex will convert to your local currency at checkout based on current exchange rates.",
      },
    ],
  },
  {
    icon: Discount01Icon,
    color: "var(--color-info)",
    title: "Refunds",
    questions: [
      {
        q: "Can I get a refund?",
        a: "Because assets are delivered digitally, we generally do not offer refunds once a download link or delivery has been issued. If there was a technical error or duplicate charge, contact us in Discord within 48 hours and we'll review it.",
      },
      {
        q: "What if I accidentally bought the wrong item?",
        a: "Contact us in Discord as soon as possible before the asset is delivered. We may be able to swap it for the correct one at our discretion.",
      },
      {
        q: "What if the asset doesn't work as described?",
        a: "If a purchased asset is broken or behaves differently from its description, we'll work with the creator to fix it or issue a replacement. Open a support ticket in Discord with your transaction ID and a description of the issue.",
      },
    ],
  },
  {
    icon: UserGroup02Icon,
    color: "var(--color-brand)",
    title: "Creators",
    questions: [
      {
        q: "Who makes the assets on the marketplace?",
        a: "Everything is made by verified community creators — independent developers and designers vetted for quality and originality.",
      },
      {
        q: "How do creators get paid?",
        a: "Creators earn a revenue share on every sale. The store handles the platform, payments, and delivery so creators can focus on building.",
      },
      {
        q: "Can I sell my own assets on the marketplace?",
        a: "Yes. If you build scripts, templates, assets or tools, get in touch and we would love to feature your work.",
      },
      {
        q: "How do I know an asset is high quality?",
        a: "Every asset goes through a review process before being listed. Our team checks for functionality, originality, and production quality before approving a product.",
      },
    ],
  },
  {
    icon: SecurityLockIcon,
    color: "var(--color-accent)",
    title: "Account & Security",
    questions: [
      {
        q: "Do I need a Tebex account to buy?",
        a: "You can checkout as a guest, but creating a free Tebex account lets you view your order history and makes future purchases faster.",
      },
      {
        q: "How are my downloads or deliveries protected?",
        a: "Deliveries are tied to the account used at checkout. Sharing or redistributing purchased assets is prohibited under our terms of service.",
      },
      {
        q: "I think someone made a purchase using my account. What do I do?",
        a: "Contact Tebex support immediately to secure your account, then open a ticket in our Discord so we can investigate the delivery on our end.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="relative min-h-screen bg-surface">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-fg/5">
        {/* Background image */}
        <Image
          src="/assets/backgrounds/main.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          style={{ filter: "saturate(0.5)" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-surface/60 via-surface/40 to-surface" />
        <div className="absolute inset-0 bg-linear-to-r from-surface/80 via-transparent to-surface/80" />
        {/* Purple glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-150 -translate-x-1/2 rounded-full bg-brand/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">
          {/* Eyebrow */}
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
            <HugeiconsIcon icon={HelpCircleIcon} className="h-3 w-3" />
            Got Questions?
          </p>

          <h1 className="mb-4 max-w-xl text-4xl font-black leading-tight text-fg sm:text-5xl">
            Frequently asked{" "}
            <span className="bg-linear-to-r from-brand via-info to-accent bg-clip-text text-transparent">
              questions.
            </span>
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-fg/45">
            Everything you need to know about buying, delivery, refunds and licensing. Can&apos;t find your answer? Get in touch.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: DeliveryBox01Icon, label: "Assets & Products", color: "var(--color-brand)" },
              { icon: CreditCardIcon, label: "Payments & Refunds", color: "var(--color-accent)" },
              { icon: SecurityLockIcon, label: "Delivery & Access", color: "var(--color-info)" },
            ].map(({ icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold text-fg/60 backdrop-blur-sm"
                style={{ borderColor: tint(color, 19), backgroundColor: tint(color, 6) }}
              >
                <HugeiconsIcon icon={icon} className="h-3.5 w-3.5" style={{ color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ SECTIONS ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl space-y-16">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              {/* Section header */}
              <div className="mb-7 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: tint(section.color, 9), border: `1px solid ${tint(section.color, 19)}` }}
                >
                  <HugeiconsIcon icon={section.icon} className="h-4.5 w-4.5" style={{ color: section.color }} />
                </div>
                <h2 className="text-xl font-black text-fg">{section.title}</h2>
                <div className="flex-1 h-px bg-fg/5" />
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {section.questions.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-fg/5 bg-fg/2 transition-all duration-200 open:border-fg/10 open:bg-fg/4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
                      <span className="text-sm font-semibold text-fg/80 group-open:text-fg">{item.q}</span>
                      <span className="shrink-0 text-fg/30 transition-transform duration-200 group-open:rotate-45">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-5 pt-1">
                      <p className="text-sm leading-relaxed text-fg/45">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STILL NEED HELP ── */}
      <section className="border-t border-fg/5 px-6 py-20">
        <div
          className="mx-auto max-w-3xl overflow-hidden relative rounded-3xl border border-brand/15 bg-linear-to-br from-surface-elevated to-surface-raised px-8 py-14 text-center"
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-30"
            style={{ backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--color-brand) 15%, transparent) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-72 -translate-x-1/2 rounded-full bg-brand/15 blur-[80px]" />
          <div className="relative z-10">
            <h2 className="mb-3 text-2xl font-black text-fg">Still have questions?</h2>
            <p className="mb-7 text-sm text-fg/45">
              Our community team is active in Discord around the clock. Open a support ticket and we&apos;ll get back to you fast.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://discord.gg/7g7BEGDSRW"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full bg-linear-to-r from-brand to-info px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:scale-[1.03]"
              >
                <HugeiconsIcon icon={UserGroup02Icon} className="h-4 w-4" />
                Open a Ticket in Discord
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <Link
                href="/products"
                className="flex items-center gap-2 rounded-full border border-fg/15 bg-fg/5 px-8 py-3 text-sm font-semibold text-fg/70 backdrop-blur-sm transition-all duration-300 hover:border-fg/25 hover:text-fg"
              >
                <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
