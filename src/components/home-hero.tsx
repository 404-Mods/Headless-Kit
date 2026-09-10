"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroup02Icon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
  CheckmarkBadge04Icon,
} from "@hugeicons/core-free-icons";
import { SlideUpText } from "@/components/spell/slide-up-text";
import { BlurReveal } from "@/components/spell/blur-reveal";
import { tint } from "@/lib/color";
import { site } from "@/config/site";

const TICKER = [
  "Creator-Made",
  "Instant Delivery",
  "Powered by Tebex",
  "Secure Checkout",
  "Support Creators",
  "Regular New Drops",
  "Open Source",
  "No Middleman",
];

export function HomeHero() {
  return (
    <>
      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden border-b border-fg/5">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/backgrounds/hero.svg"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/40 to-surface" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/60 via-transparent to-surface/60" />
          <div className="absolute left-1/2 top-[-80px] h-72 w-[600px] -translate-x-1/2 rounded-full bg-brand/18 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-48 w-64 rounded-full bg-accent/8 blur-[100px]" />
          <div className="absolute bottom-0 right-1/3 h-48 w-64 rounded-full bg-info/8 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--color-brand) 25%, transparent) 1px, transparent 1px)", backgroundSize: "36px 36px" }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(ellipse 85% 75% at 50% 40%, transparent 35%, var(--color-surface) 85%)" }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-28">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 backdrop-blur-sm"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} className="h-3.5 w-3.5 text-accent" />
              <BlurReveal as="span" className="text-xs font-bold tracking-wide text-accent" speedReveal={2}>
                {`${site.name} Marketplace`}
              </BlurReveal>
            </motion.div>

            <div className="mb-6">
              <h1 className="text-5xl font-black tracking-tight text-fg sm:text-6xl lg:text-7xl leading-[0.93]">
                <SlideUpText stagger={0.05}>Built by the people</SlideUpText>
              </h1>
              <motion.h1
                className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[0.93] bg-gradient-to-r from-brand via-info to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
              >
                who use it.
              </motion.h1>
            </div>

            <div className="mb-9">
              <SlideUpText className="max-w-lg text-base leading-relaxed text-fg/55 md:text-lg" delay={0.5}>
                Scripts, templates, assets and tools — made by the community, sold direct. Every purchase goes straight to the people who built it.
              </SlideUpText>
            </div>

            <motion.div
              className="mb-8 flex flex-col items-center gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.8, ease: "easeOut" }}
            >
              <Link
                href="/products"
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-info px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-brand/40 hover:shadow-xl"
              >
                <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
                Browse Products
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/creators"
                className="flex items-center gap-2 rounded-full border border-fg/15 bg-fg/[0.06] px-8 py-3 text-sm font-semibold text-fg/70 backdrop-blur-sm transition-all duration-300 hover:border-fg/25 hover:bg-fg/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30"
              >
                <HugeiconsIcon icon={UserGroup02Icon} className="h-4 w-4" />
                Meet the Creators
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              {[
                { label: "Scripts & Tools", color: "var(--color-brand)" },
                { label: "Templates", color: "var(--color-accent)" },
                { label: "Creator Assets", color: "var(--color-info)" },
              ].map((tag) => (
                <div
                  key={tag.label}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-fg/70 backdrop-blur-sm"
                  style={{ borderColor: tint(tag.color, 25), backgroundColor: tint(tag.color, 7) }}
                >
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                  {tag.label}
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <section className="relative z-20 border-y border-fg/5 bg-surface/80 py-4 backdrop-blur-sm overflow-hidden">
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{ animation: "ticker 35s linear infinite", width: "max-content" }}
        >
          {[...TICKER, ...TICKER].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-8">
              <HugeiconsIcon icon={CheckmarkBadge04Icon} className="h-4 w-4 shrink-0 text-brand" />
              <span className="text-sm font-semibold text-fg/50">{item}</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>
    </>
  );
}
