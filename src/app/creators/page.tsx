/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { Metadata } from "next";
import { site } from "@/config/site";
import { creators, type CreatorPlatform } from "@/config/creators";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { tint } from "@/lib/color";
import {
  BrushIcon,
  ArrowRight01Icon,
  ShoppingBag01Icon,
  Diamond01Icon,
  UserGroup02Icon,
  PenToolIcon,
  Car01Icon,
  ClothesIcon,
  Building04Icon,
  TwitterIcon,
  DiscordIcon,
  GithubIcon,
} from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Creators",
  description: `Meet the creators building for ${site.name}.`,
};

/** Icons for the platforms a creator can link. */
const CREATOR_ICONS: Record<CreatorPlatform, typeof DiscordIcon> = {
  Discord: DiscordIcon,
  X: TwitterIcon,
  GitHub: GithubIcon,
};

const ASSET_TYPES = [
  { icon: PenToolIcon, color: "var(--color-brand)", label: "Scripts & Tools", body: "Automation, integrations, and gameplay or workflow tooling built to run clean in production." },
  { icon: Building04Icon, color: "var(--color-accent)", label: "Templates & Starters", body: "Production-ready project scaffolds that save people the first week of setup." },
  { icon: ClothesIcon, color: "var(--color-info)", label: "Design Assets", body: "UI kits, icon sets, textures, and models packaged for drop-in use." },
  { icon: Car01Icon, color: "var(--color-brand)", label: "Open Source", body: "Free, source-available releases that the whole community can fork and build on." },
];

const PERKS = [
  { title: "Revenue share", body: "Earn a percentage of every sale of your work, paid out directly through Tebex." },
  { title: "Creator badge", body: "Get a verified creator profile on the store and in the community." },
  { title: "Early access", body: "Try new store features and feedback channels before they go public." },
  { title: "Community reach", body: "Your work is put in front of everyone who visits the store." },
];

export default function CreatorsPage() {
  return (
    <div className="relative min-h-screen bg-surface">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-fg/5">
        {/* Background image */}
        <Image
          src="/assets/backgrounds/waterway.jpg"
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
            <HugeiconsIcon icon={BrushIcon} className="h-3 w-3" />
            The People Behind the Assets
          </p>

          <h1 className="mb-4 max-w-xl text-4xl font-black leading-tight text-fg sm:text-5xl">
            Meet our{" "}
            <span className="bg-linear-to-r from-brand via-info to-accent bg-clip-text text-transparent">
              creators.
            </span>
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-fg/45">
            Every item in this store was built by someone in our community — designers, developers and artists who care about the craft.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: BrushIcon, label: "Verified Creators", color: "var(--color-brand)" },
              { icon: Diamond01Icon, label: "Revenue Share", color: "var(--color-accent)" },
              { icon: UserGroup02Icon, label: "1,000+ Community Members", color: "var(--color-info)" },
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

      {/* ── CREATOR CARDS ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand">Roster</p>
            <h2 className="text-3xl font-black text-fg">Current Creators</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-linear-to-r from-brand via-accent to-info" />
          </div>

          {creators.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-fg/10 bg-fg/2 py-16 text-center">
              <p className="text-base font-bold text-fg/50">No creators listed yet</p>
              <p className="max-w-sm text-sm text-fg/25">
                Add people to <code className="rounded bg-fg/5 px-1.5 py-0.5 text-fg/40">src/config/creators.ts</code> and they will appear here.
              </p>
            </div>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {creators.map((creator) => (
              <div
                key={creator.handle}
                className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-fg/8 bg-fg/3 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-fg/15 hover:bg-fg/6"
              >
                {/* Accent glow */}
                <div
                  className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full blur-[60px] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: tint(creator.accent, 13) }}
                />

                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-black text-fg"
                    style={{ backgroundColor: tint(creator.accent, 15), border: `1px solid ${tint(creator.accent, 25)}` }}
                  >
                    {creator.initials}
                  </div>
                  <div>
                    <p className="text-base font-bold text-fg">{creator.name}</p>
                    <p className="text-xs text-fg/40">{creator.role}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-fg/50">{creator.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {creator.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: tint(creator.accent, 9), color: creator.accent }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {creator.socials.map(({ platform, url }) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-fg/8 bg-fg/4 text-fg/40 transition-all duration-200 hover:border-fg/20 hover:bg-fg/8 hover:text-fg"
                    >
                      <HugeiconsIcon icon={CREATOR_ICONS[platform]} className="h-4 w-4" />
                    </a>
                  ))}
                </div>

              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ── ASSET TYPES ── */}
      <section className="border-y border-fg/5 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">What we make</p>
            <h2 className="text-3xl font-black text-fg">Types of creator assets</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-linear-to-r from-brand via-accent to-info" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ASSET_TYPES.map((type) => (
              <div
                key={type.label}
                className="flex flex-col gap-3 rounded-2xl border border-fg/5 bg-fg/2 p-6 transition-all duration-300 hover:border-fg/10 hover:bg-fg/4"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: tint(type.color, 8) }}
                >
                  <HugeiconsIcon icon={type.icon} className="h-5 w-5" style={{ color: type.color }} />
                </div>
                <p className="text-sm font-bold text-fg">{type.label}</p>
                <p className="text-xs leading-relaxed text-fg/40">{type.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BECOME A CREATOR ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand">Join the team</p>
              <h2 className="mb-4 text-4xl font-black text-fg leading-tight">
                Become a<br />
                <span className="bg-linear-to-r from-brand to-info bg-clip-text text-transparent">
                  {site.name} Creator.
                </span>
              </h2>
              <p className="mb-8 text-base leading-relaxed text-fg/50">
                If you build scripts, templates, assets or tools, we&apos;d love to feature your work. You earn revenue, we handle the platform.
              </p>
              <a
                href={site.creatorApplyUrl || `mailto:${site.supportEmail}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-brand to-info px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-brand/40"
              >
                <HugeiconsIcon icon={UserGroup02Icon} className="h-4 w-4" />
                Become a Creator
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

            {/* Right — perks */}
            <div className="grid gap-3 sm:grid-cols-2">
              {PERKS.map((perk) => (
                <div
                  key={perk.title}
                  className="flex flex-col gap-2 rounded-2xl border border-fg/5 bg-fg/2 p-5"
                >
                  <div className="h-1 w-8 rounded-full bg-linear-to-r from-brand to-accent" />
                  <p className="text-sm font-bold text-fg">{perk.title}</p>
                  <p className="text-xs leading-relaxed text-fg/40">{perk.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="border-t border-fg/5 px-6 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-3 text-2xl font-black text-fg">Browse creator work now.</h2>
          <p className="mb-6 text-sm text-fg/40">Everything in the store was made by real people from this community.</p>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:scale-[1.03] hover:bg-brand-hover"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
            Shop the Store
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

    </div>
  );
}
