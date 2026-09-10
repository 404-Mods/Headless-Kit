/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HeartCheckIcon,
  FlashIcon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
  PenToolIcon,
  BrushIcon,
} from "@hugeicons/core-free-icons";
import { SlideUpText } from "@/components/spell/slide-up-text";
import { BlurReveal } from "@/components/spell/blur-reveal";
import { SaleBanner } from "@/components/sale-banner";
import { NewArrivals } from "@/components/new-arrivals";
import { HomeHero } from "@/components/home-hero";
import { LogoMark } from "@/components/logo";
import { site } from "@/config/site";
import { tint } from "@/lib/color";

const STEPS = [
  { num: "01", color: "var(--color-brand)", icon: ShoppingBag01Icon, title: "Find something you want", body: "Browse scripts, templates, open-source tools, and creator assets — all built by real community members." },
  { num: "02", color: "var(--color-info)", icon: ArrowRight01Icon, title: "Add to cart & checkout", body: "Select your items, review the order, then pay securely through Tebex. Takes under a minute." },
  { num: "03", color: "var(--color-accent)", icon: FlashIcon, title: "Instant delivery", body: "Digital goods are delivered automatically the moment payment clears — no tickets, no waiting on a human." },
  { num: "04", color: "var(--color-brand)", icon: HeartCheckIcon, title: "Build something with it", body: "Ship your project, use your assets, fork the source. The creators get paid. Everyone wins." },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-surface">

      <HomeHero />

      <SaleBanner />

      <NewArrivals />

      {/* ══ BENTO ══ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-12 text-center">
            <BlurReveal as="p" className="mb-3 text-[10px] font-bold tracking-[0.3em] text-brand uppercase" speedReveal={2}>
              Why shop here
            </BlurReveal>
            <h2 className="text-4xl font-black text-fg md:text-5xl text-center">
              <SlideUpText stagger={0.04} className="justify-center">Built by creators. Sold direct.</SlideUpText>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* ── BIG CARD (col-span-2) ── */}
            <div className="group relative overflow-hidden rounded-3xl border border-fg/8 bg-fg/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-fg/15 md:col-span-2">
              {/* dot grid bg */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{ backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--color-brand) 25%, transparent) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
              />
              {/* glow */}
              <div className="pointer-events-none absolute -top-16 left-1/4 h-48 w-72 rounded-full bg-brand/15 blur-[80px] transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1">
                    <HugeiconsIcon icon={BrushIcon} className="h-3 w-3 text-brand" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand">Creator-Made</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-black text-fg leading-tight md:text-3xl">
                    Made by the people<br />who use it.
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-fg/45">
                    Every item here was built by a working member of the community — not repackaged from a generic bundle. Scripts, templates, assets and tools, made by people who run them in production.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Scripts", "Templates", "Assets", "Tools", "Open Source"].map((tag, i) => {
                    const colors = ["var(--color-brand)", "var(--color-accent)", "var(--color-info)", "var(--color-brand)", "var(--color-accent)"];
                    return (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-1 text-xs font-bold"
                        style={{ backgroundColor: tint(colors[i], 9), color: colors[i], border: `1px solid ${tint(colors[i], 19)}` }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── INSTANT DELIVERY ── */}
            <div className="group relative overflow-hidden rounded-3xl border border-accent/10 bg-accent/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/20">
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent/10 blur-[60px] transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 border border-accent/20">
                  <HugeiconsIcon icon={FlashIcon} className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-black text-fg">In your hands<br />instantly.</h3>
                  <p className="text-xs leading-relaxed text-fg/45">Delivered the moment checkout completes. No tickets, no waiting on a human.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent/60">Auto-delivery</span>
                </div>
              </div>
            </div>

            {/* ── SCRIPTS ── */}
            <div className="group relative overflow-hidden rounded-3xl border border-fg/8 bg-fg/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-info/25">
              <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-info/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex h-full flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-info/12 border border-info/20">
                  <HugeiconsIcon icon={PenToolIcon} className="h-6 w-6 text-info" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-black text-fg">Scripts</h3>
                  <p className="text-xs leading-relaxed text-fg/45">Game server scripts, Discord bots, and web tools built by developers who run them in production.</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Node", "Lua", "Python"].map((t) => (
                    <span key={t} className="rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-bold text-info/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── TEMPLATES ── */}
            <div className="group relative overflow-hidden rounded-3xl border border-fg/8 bg-fg/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/25">
              <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-brand/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex h-full flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/12 border border-brand/20">
                  <HugeiconsIcon icon={ShoppingBag01Icon} className="h-6 w-6 text-brand" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-black text-fg">Templates</h3>
                  <p className="text-xs leading-relaxed text-fg/45">Production-ready starter kits. Spin up your next project in minutes, not hours.</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js", "Vite", "TypeScript"].map((t) => (
                    <span key={t} className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── OPEN SOURCE ── */}
            <div className="group relative overflow-hidden rounded-3xl border border-fg/8 bg-fg/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/25">
              <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-accent/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex h-full flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/12 border border-accent/20">
                  <HugeiconsIcon icon={HeartCheckIcon} className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-black text-fg">Open Source</h3>
                  <p className="text-xs leading-relaxed text-fg/45">Free releases from the community. Source-available, forkable, and built to share.</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Free", "Community", "Forkable"].map((t) => (
                    <span key={t} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section className="relative z-20 -my-10 overflow-hidden">
        <div className="-rotate-1 scale-105 bg-gradient-to-r from-brand via-accent to-info py-10">
          <div className="rotate-1">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {site.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl font-black text-white md:text-5xl">{stat.value}</div>
                    <div className="mt-1 text-sm font-bold tracking-wider text-fg/70 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="relative overflow-hidden border-t border-fg/5 py-28">
        {/* subtle bg glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-175 -translate-x-1/2 rounded-full bg-brand/8 blur-[120px]" />

        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">

            {/* Header */}
            <div className="mb-16 flex flex-col items-center gap-3 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">How It Works</span>
              </div>
              <h2 className="text-4xl font-black text-fg md:text-5xl">
                <SlideUpText stagger={0.04} className="justify-center">From creator to you.</SlideUpText>
              </h2>
              <p className="max-w-md text-sm text-fg/40">Four steps. No friction.</p>
            </div>

            {/* Steps */}
            <div className="relative">
              {/* Connector line — desktop only */}
              <div className="pointer-events-none absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-linear-to-b from-brand/40 via-info/40 to-accent/40 lg:block" />

              <div className="flex flex-col gap-6">
                {STEPS.map((step, i) => (
                  <div
                    key={step.num}
                    className="group relative flex items-start gap-6 rounded-2xl border border-fg/5 bg-fg/2 p-6 transition-all duration-300 hover:border-fg/10 hover:bg-fg/4 lg:pl-16"
                  >
                    {/* Step dot on the connector line — desktop */}
                    <div
                      className="absolute left-4.25 top-6 hidden h-3 w-3 rounded-full ring-2 ring-surface lg:block"
                      style={{ backgroundColor: step.color }}
                    />

                    {/* Number + icon block */}
                    <div className="relative shrink-0">
                      {/* Big decorative number */}
                      <span
                        className="pointer-events-none absolute -top-5 left-0 select-none text-7xl font-black leading-none opacity-5"
                        style={{ color: step.color }}
                      >
                        {step.num}
                      </span>
                      {/* Icon circle */}
                      <div
                        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105"
                        style={{ backgroundColor: tint(step.color, 8), borderColor: tint(step.color, 19) }}
                      >
                        <HugeiconsIcon icon={step.icon} className="h-5 w-5" style={{ color: step.color }} />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 pt-1">
                      <div className="mb-1 flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>{step.num}</span>
                      </div>
                      <h3 className="mb-1.5 text-base font-bold text-fg">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-fg/45">{step.body}</p>
                    </div>

                    {/* Arrow — not on last */}
                    {i < STEPS.length - 1 && (
                      <div className="hidden shrink-0 self-center text-fg/10 lg:block">
                        <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ CLOSING CTA ══ */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-5xl overflow-hidden relative rounded-3xl border border-brand/20 bg-gradient-to-br from-surface-elevated to-surface-raised px-8 py-20 text-center">
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
            style={{ backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--color-brand) 12%, transparent) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-brand/20 blur-[80px]" />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/15 backdrop-blur-sm">
              <LogoMark title={site.name} className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-fg md:text-5xl">
                <SlideUpText>Find your next build.</SlideUpText>
              </h2>
              <p className="mt-4 max-w-md mx-auto text-base text-fg/45">
                Browse the latest drops from the community&apos;s creators — built with care, sold direct.
              </p>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-accent px-10 py-4 text-base font-bold text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Shop Now
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
