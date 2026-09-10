/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { Metadata } from "next";
import { site } from "@/config/site";
import { LogoMark } from "@/components/logo";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { tint } from "@/lib/color";
import {
  UserGroup02Icon,
  Shield01Icon,
  HeartCheckIcon,
  Globe02Icon,
  GameController01Icon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
  BrushIcon,
} from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${site.name} — a creator-powered store built by the people who make the things it sells.`,
  openGraph: {
    title: `About — ${site.name}`,
    description: "A marketplace built by creators, for the community.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About — ${site.name}`,
    description: "A marketplace built by creators, for the community.",
  },
};

const STATS = [
  { value: "1,000+", label: "Active Players" },
  { value: "100%", label: "Creator-Made Assets" },
  { value: "24/7", label: "Support" },
  { value: "3+", label: "Years Running" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-fg/5">
        {/* Background image */}
        <Image
          src="/assets/backgrounds/alligator.png"
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
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-3 w-3" />
            {site.name}
          </p>

          <h1 className="mb-4 max-w-xl text-4xl font-black leading-tight text-fg sm:text-5xl">
            Made by creators,{" "}
            <span className="bg-linear-to-r from-brand via-info to-accent bg-clip-text text-transparent">
              sold direct.
            </span>
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-fg/45">
            {site.name} is where the community&apos;s designers and developers sell their work.
            Every script, template and asset you see was built by a real person from this
            community.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: UserGroup02Icon, label: "Community Run", color: "var(--color-brand)" },
              { icon: BrushIcon, label: "100% Creator-Made", color: "var(--color-accent)" },
              { icon: GameController01Icon, label: "Instant Delivery", color: "var(--color-info)" },
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

      {/* Stats bar */}
      <section className="border-b border-fg/5 bg-fg/1 px-6 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black text-fg">{stat.value}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-fg/30">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand">
              What This Store Is
            </p>
            <h2 className="mb-5 text-3xl font-black text-fg leading-tight">
              A marketplace built on real creative work.
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-fg/50">
              <p>
                This store exists to give creators a place to sell their work directly — scripts,
                templates, design assets and tools. Every item you browse was designed and built by
                a real member of this community, not repackaged from a generic bundle.
              </p>
              <p>
                Creators earn revenue on every sale and keep ownership of what they make. There is
                no gatekeeper taking a cut for shelf space, and no middleman deciding what gets
                listed.
              </p>
              <p>
                Payments are handled by Tebex, so your financial information stays with a platform
                trusted by thousands of communities worldwide — it never touches our servers.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.creatorApplyUrl || `mailto:${site.supportEmail}`}
                className="inline-flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-5 py-2.5 text-sm font-bold text-fg transition-all hover:bg-brand/20"
              >
                <HugeiconsIcon icon={UserGroup02Icon} className="h-4 w-4 text-brand" />
                Become a Creator
              </a>
              {site.parentSite.url && (
                <a
                  href={site.parentSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-fg/10 bg-fg/5 px-5 py-2.5 text-sm font-bold text-fg/60 transition-all hover:bg-fg/10 hover:text-fg"
                >
                  <HugeiconsIcon icon={Globe02Icon} className="h-4 w-4" />
                  {site.parentSite.label}
                </a>
              )}
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div
              className="overflow-hidden rounded-3xl border border-fg/5 p-8"
              style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 20%, var(--color-surface-elevated), var(--color-surface-raised))" }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--color-brand) 8%, transparent) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/15">
                  <LogoMark title={site.name} className="h-12 w-12" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-fg/30">{site.name}</p>
                  <h3 className="mt-1 text-xl font-black text-fg">The Marketplace</h3>
                  <p className="mt-2 text-xs text-fg/40">Powered by Tebex</p>
                </div>
                <div className="h-px w-full bg-fg/5" />
                <div className="grid w-full grid-cols-3 gap-3">
                  {[
                    { icon: GameController01Icon, label: "Instant" },
                    { icon: Shield01Icon, label: "Secure" },
                    { icon: HeartCheckIcon, label: "Trusted" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-fg/3 p-3">
                      <HugeiconsIcon icon={icon} className="h-5 w-5 text-brand" />
                      <span className="text-[10px] font-semibold text-fg/40">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-brand/15 blur-[60px]" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-fg/5 bg-fg/1 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand">
              Simple as it gets
            </p>
            <h2 className="text-3xl font-black text-fg">How it works</h2>
          </div>

          <div className="relative grid gap-0 sm:grid-cols-3">
            {/* Connector line — visible on sm+ */}
            <div className="pointer-events-none absolute left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] top-9 hidden h-px bg-linear-to-r from-brand/30 via-info/30 to-accent/30 sm:block" />

            {[
              {
                step: "01",
                color: "var(--color-brand)",
                title: "Browse creator assets",
                body: "Explore scripts, templates, assets and tools — all made by real community members.",
              },
              {
                step: "02",
                color: "var(--color-info)",
                title: "Checkout with Tebex",
                body: "Add items to your cart and pay securely through Tebex. Enter your in-game username to link the delivery.",
              },
              {
                step: "03",
                color: "var(--color-accent)",
                title: "Download & use your asset",
                body: "Digital assets are delivered instantly after payment. Scripts, clothing packs, and MLOs ready to use straight away.",
              },
            ].map(({ step, color, title, body }) => (
              <div key={step} className="relative flex flex-col items-center gap-4 px-6 pb-10 text-center sm:pb-0">
                {/* Step badge */}
                <div
                  className="relative z-10 flex h-18 w-18 items-center justify-center rounded-2xl border text-2xl font-black"
                  style={{ backgroundColor: tint(color, 7), borderColor: tint(color, 19), color }}
                >
                  {step}
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-bold text-fg">{title}</h3>
                  <p className="text-xs leading-relaxed text-fg/45">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-black text-fg">See who makes it all.</h2>
          <p className="mt-3 text-sm text-fg/40">
            Every asset has a creator behind it. Meet them, then browse their work.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/creators"
              className="flex items-center gap-2 rounded-xl bg-brand px-7 py-3 text-sm font-bold text-white transition-all hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20"
            >
              <HugeiconsIcon icon={BrushIcon} className="h-4 w-4" />
              Meet the Creators
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-xl border border-fg/10 bg-fg/5 px-7 py-3 text-sm font-bold text-fg/60 transition-all hover:bg-fg/10 hover:text-fg"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
