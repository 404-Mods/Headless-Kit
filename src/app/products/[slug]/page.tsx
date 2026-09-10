/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPackages, getCategories } from "@/lib/tebex";
import { slugify, processDescription } from "@/lib/utils";
import { getRequirements, getFeatures } from "@/lib/product-meta";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PackageCard } from "@/components/package-card";
import { ProductImage, ProductVideo, CopyLinkButton } from "@/components/product-actions";
import { MobileStickyCTA } from "@/components/mobile-sticky-cta";
import { WishlistButton } from "@/components/wishlist-button";
import { RecentlyViewed, RecordProductView } from "@/components/recently-viewed";
import { ProductReviews } from "@/components/product-reviews";
import { SaleCountdown } from "@/components/sale-countdown";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Discount01Icon,
  CheckmarkBadge04Icon,
  CheckmarkCircle01Icon,
  FlashIcon,
  Shield01Icon,
  SparklesIcon,
  Settings01Icon,
  BrushIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { tint } from "@/lib/color";
import { isDiscounted, discountPercent, savedAmount } from "@/lib/pricing";

// ── Helpers ───────────────────────────────────────────────────

function isNewProduct(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;
}

function extractDescriptionImages(html: string): string[] {
  const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
  return matches.map((m) => m[1]).filter((src) => src.startsWith("http"));
}


// Rendered on demand, then reused for the catalog TTL — see src/lib/tebex.ts.
export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const pkgs = await getPackages();
    const pkg = pkgs.find((p) => slugify(p.name) === slug);
    if (!pkg) return { title: "Product" };
    const plainDesc = (await processDescription(pkg.description)).replace(/<[^>]*>/g, "").slice(0, 160);
    return {
      title: pkg.name,
      description: plainDesc,
      openGraph: {
        title: `${pkg.name} — ${site.name}`,
        description: plainDesc,
        type: "website",
        images: pkg.image ? [{ url: pkg.image, width: 1200, height: 630, alt: pkg.name }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${pkg.name} — ${site.name}`,
        description: plainDesc,
        images: pkg.image ? [pkg.image] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let pkgs;
  try {
    pkgs = await getPackages();
  } catch {
    notFound();
  }

  const pkg = pkgs.find((p) => slugify(p.name) === slug);
  if (!pkg) notFound();

  let categorySlug: string;
  try {
    const categories = await getCategories();
    const cat = categories.find((c) => c.id === pkg.category.id);
    categorySlug = cat?.slug ?? slugify(pkg.category.name);
  } catch {
    categorySlug = slugify(pkg.category.name);
  }

  const hasDiscount = isDiscounted(pkg);
  const isNew = isNewProduct(pkg.created_at);
  const decodedDescription = await processDescription(pkg.description);
  const galleryImages = extractDescriptionImages(decodedDescription);
  const requirements = getRequirements(pkg.id);
  const features = getFeatures(pkg.id);
  const relatedPkgs = pkgs
    .filter((p) => p.category.id === pkg.category.id && p.id !== pkg.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden border-b border-fg/5">
        {/* Background image */}
        <Image
          src="/assets/backgrounds/hero.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-25 scale-110"
          style={{ filter: "saturate(0.5) blur(1px)" }}
        />

        {/* Dot-grid texture */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-size-[24px_24px]" />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-surface/40 via-surface/20 to-surface" />
        <div className="absolute inset-0 bg-linear-to-r from-surface/90 via-surface/40 to-transparent" />

        {/* Glows */}
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-80 rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-10">
          {/* Back link */}
          <Link
            href={`/category/${categorySlug}`}
            className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-fg/30 transition-colors hover:text-brand"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-3.5 w-3.5" />
            Back to {pkg.category.name}
          </Link>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left — text */}
            <div className="max-w-xl">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand backdrop-blur-sm">
                {pkg.category.name}
              </span>

              <h1 className="mb-5 text-3xl font-black leading-tight text-fg sm:text-4xl lg:text-5xl">
                {pkg.name}
              </h1>

              {/* Badges share a row and wrap. Previously two `flex w-fit` spans sat
                  as bare siblings, so they stacked flush against one another. */}
              {(hasDiscount || isNew) && (
                <div className="flex flex-wrap items-center gap-2">
                  {hasDiscount && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/90 px-3 py-1 text-xs font-black text-surface">
                      <HugeiconsIcon icon={Discount01Icon} className="h-3 w-3" />
                      {discountPercent(pkg)}% OFF
                    </span>
                  )}
                  {isNew && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-info/40 bg-info/10 px-3 py-1 text-xs font-black text-info">
                      <HugeiconsIcon icon={SparklesIcon} className="h-3 w-3" />
                      NEW
                    </span>
                  )}
                </div>
              )}

              {/* Trust pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { icon: FlashIcon, label: "Instant delivery", color: "var(--color-accent)" },
                  { icon: Shield01Icon, label: "Secure checkout", color: "var(--color-info)" },
                  { icon: CheckmarkBadge04Icon, label: "Creator verified", color: "var(--color-brand)" },
                ].map(({ icon, label, color }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 rounded-full border border-fg/8 bg-fg/4 px-3 py-1.5 text-[10px] font-semibold text-fg/50 backdrop-blur-sm"
                  >
                    <HugeiconsIcon icon={icon} className="h-3 w-3" style={{ color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-10">

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* Main image card */}
            <ProductImage
              image={pkg.image}
              name={pkg.name}
              hasDiscount={hasDiscount}
              discount={discountPercent(pkg)}
              galleryImages={galleryImages}
            />

            {/* Preview video */}
            <ProductVideo description={decodedDescription} name={pkg.name} />

            {/* Description */}
            {decodedDescription && (
              <div className="rounded-2xl border border-fg/5 bg-fg/2 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/35">
                  <span className="h-px flex-1 bg-fg/8" />
                  About this product
                  <span className="h-px flex-1 bg-fg/8" />
                </h2>
                <div
                  className="
                    text-sm leading-relaxed text-fg/60
                    [&_p]:mb-3 [&_p]:text-fg/60 [&_p]:leading-relaxed
                    [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-fg/60
                    [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-fg/60
                    [&_li]:mb-1 [&_li]:text-fg/60
                    [&_strong]:font-semibold [&_strong]:text-fg/85
                    [&_em]:italic
                    [&_a]:text-info [&_a]:no-underline [&_a:hover]:underline
                    [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-fg
                    [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-fg
                    [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-fg/90
                    [&_blockquote]:border-l-2 [&_blockquote]:border-fg/20 [&_blockquote]:pl-4 [&_blockquote]:text-fg/40
                    [&_hr]:border-fg/10 [&_hr]:my-4
                    [&_img]:hidden
                    [&_code]:rounded [&_code]:bg-fg/8 [&_code]:px-1 [&_code]:text-xs [&_code]:text-fg/70
                  "
                  dangerouslySetInnerHTML={{ __html: decodedDescription }}
                />
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="rounded-2xl border border-fg/5 bg-fg/2 p-5">
                <h2 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/35">
                  <span className="h-px flex-1 bg-fg/8" />
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3 w-3" />
                  Features
                  <span className="h-px flex-1 bg-fg/8" />
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {features.map((feat) => (
                    <div
                      key={feat.label}
                      className="flex items-start gap-3 rounded-xl border border-fg/5 bg-fg/2 px-3.5 py-2.5"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-info/30 bg-info/10">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3 w-3 text-info" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-fg/80">{feat.label}</p>
                        {feat.description && (
                          <p className="text-[10px] leading-relaxed text-fg/30">{feat.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="rounded-2xl border border-fg/5 bg-fg/2 p-5">
              <h2 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/35">
                <span className="h-px flex-1 bg-fg/8" />
                <HugeiconsIcon icon={Settings01Icon} className="h-3 w-3" />
                Requirements
                <span className="h-px flex-1 bg-fg/8" />
              </h2>
              {requirements.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {requirements.map((req) => (
                    <div
                      key={req.label}
                      className="flex items-center gap-3 rounded-xl border border-fg/5 bg-fg/2 px-3.5 py-2.5"
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: tint(req.color, 9), border: `1px solid ${tint(req.color, 19)}` }}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: req.color }} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-fg/80">{req.label}</p>
                        <p className="truncate text-[10px] text-fg/30">{req.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-fg/25 py-2">No requirements listed yet.</p>
              )}
            </div>

          </div>

          {/* ── Right column — sticky purchase panel ── */}
          <div className="lg:sticky lg:top-24 space-y-4 self-start">

            {/* Purchase card */}
            <div className="overflow-hidden rounded-2xl border border-fg/8 bg-fg/2 shadow-2xl shadow-black/30">

              {/* Accent top bar */}
              <div className="h-1 w-full bg-linear-to-r from-brand via-info to-accent" />

              <div className="space-y-5 p-6">

                {/* Category badge */}
                <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">
                  {pkg.category.name}
                </span>

                {/* Price block */}
                <div className="rounded-xl border border-fg/5 bg-surface/60 p-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-fg">
                      {pkg.currency} {pkg.total_price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-fg/30 line-through">
                        {pkg.currency} {pkg.base_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-accent">
                      <HugeiconsIcon icon={Discount01Icon} className="h-3.5 w-3.5" />
                      You save {pkg.currency} {savedAmount(pkg).toFixed(2)} ({discountPercent(pkg)}% off)
                    </p>
                  )}
                </div>

                {/* Expiry countdown */}
                {pkg.expiration_date && (
                  <SaleCountdown expirationDate={pkg.expiration_date} variant="panel" />
                )}

                {/* CTA */}
                <AddToCartButton pkg={pkg} />

                {/* Save for later */}
                <WishlistButton packageId={pkg.id} packageName={pkg.name} variant="detail" />

                {/* Copy link */}
                <CopyLinkButton name={pkg.name} />

                <p className="text-center text-[10px] text-fg/20">
                  Powered by Tebex · Secure payment
                </p>
              </div>
            </div>

            {/* Meta card */}
            <div className="rounded-2xl border border-fg/5 bg-fg/2 divide-y divide-fg/5 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 text-xs">
                <span className="text-fg/30">Delivery</span>
                <span className="font-semibold text-accent">Instant</span>
              </div>
              {pkg.disable_quantity && (
                <div className="flex items-center justify-between px-5 py-3 text-xs">
                  <span className="text-fg/30">Quantity</span>
                  <span className="font-semibold text-fg/60">Fixed (1)</span>
                </div>
              )}
            </div>

            {/* Creator card */}
            <Link
              href="/creators"
              className="group flex items-center gap-3 rounded-2xl border border-fg/5 bg-fg/2 p-4 transition-all duration-200 hover:border-fg/10 hover:bg-fg/4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10">
                <HugeiconsIcon icon={BrushIcon} className="h-5 w-5 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-fg">Community Creator</p>
                <p className="text-[11px] text-fg/40">Made by our verified creator team</p>
              </div>
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 shrink-0 text-fg/20 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg/40" />
            </Link>

          </div>
        </div>

        {/*
          Full width, below the two-column layout.

          These used to be grid children: "More from" was nested inside the 340px
          sticky sidebar, so lg:grid-cols-3 squeezed three cards into a column far
          too narrow for them — and because the sidebar is sticky and self-start,
          a tall sidebar ran over the sections beneath it.
        */}
        <div className="mt-16 space-y-16">

          {/* ── Reviews ── */}
          <ProductReviews packageId={pkg.id} packageName={pkg.name} />

          {/* ── Related products ── */}
          {relatedPkgs.length > 0 && (
            <section>
              <h2 className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/35">
                <span className="h-px flex-1 bg-fg/8" />
                More from {pkg.category.name}
                <span className="h-px flex-1 bg-fg/8" />
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPkgs.map((p) => (
                  <PackageCard key={p.id} pkg={p} />
                ))}
              </div>
            </section>
          )}

          {/* ── Recently viewed ── */}
          <RecentlyViewed excludeId={pkg.id} />
        </div>
      </div>

      {/* Records this view for the rail above. Renders nothing. */}
      <RecordProductView packageId={pkg.id} />

      {/* ── Mobile sticky CTA ── */}
      <MobileStickyCTA pkg={pkg} />
    </div>
  );
}
