/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCategory, getCategories, getSubcategories, getParentInfo } from "@/lib/tebex";
import { processDescription } from "@/lib/utils";
import { CategoryFilters } from "@/components/category-filters";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, GridViewIcon, Package01Icon, FlashIcon, Discount01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { tint } from "@/lib/color";
import { isDiscounted } from "@/lib/pricing";

// Catalog-backed page: re-rendered on the same cadence as src/lib/tebex.ts.
// Without this the page would be prerendered once at build time and never update.
export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const cats = await getCategories();
    return cats.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cats = await getCategories();
    const cat = cats.find((c) => c.slug === slug);
    if (!cat) return { title: "Category" };
    return { title: cat.name };
  } catch {
    return { title: "Category" };
  }
}

// ── Skeleton ──────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-3 w-8 animate-pulse rounded bg-fg/8" />
        <div className="h-3 w-2 animate-pulse rounded bg-fg/5" />
        <div className="h-3 w-24 animate-pulse rounded bg-fg/8" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-3 w-20 animate-pulse rounded bg-fg/5" />
        <div className="h-8 w-48 animate-pulse rounded bg-fg/8" />
        <div className="h-3 w-16 animate-pulse rounded bg-fg/5" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-fg/5 bg-fg/2">
            <div className="aspect-video w-full animate-pulse bg-fg/5" />
            <div className="space-y-2 p-4">
              <div className="h-2.5 w-16 animate-pulse rounded bg-fg/5" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-fg/8" />
              <div className="h-3 w-full animate-pulse rounded bg-fg/5" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-fg/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Content (async) ───────────────────────────────────────
async function CategoryContent({ slug }: { slug: string }) {
  let allCats;
  try {
    allCats = await getCategories(true);
  } catch {
    notFound();
  }

  const match = allCats.find((c) => c.slug === slug);
  if (!match) notFound();

  let category;
  try {
    category = await getCategory(match.id, true);
  } catch {
    notFound();
  }

  const parentInfo = getParentInfo(category);
  const subcategories = getSubcategories(allCats, category.id);
  const packages = category.packages ?? [];
  const processedDescription = category.description
    ? await processDescription(category.description)
    : null;
  const saleCount = packages.filter(isDiscounted).length;

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-fg/5">
        <Image
          src="/assets/backgrounds/panel.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          style={{ filter: "saturate(0.5)" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-surface/60 via-surface/40 to-surface" />
        <div className="absolute inset-0 bg-linear-to-r from-surface/80 via-transparent to-surface/80" />
        {/* Glows */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-150 -translate-x-1/2 rounded-full bg-brand/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-40 w-80 rounded-full bg-accent/8 blur-[90px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 sm:py-18">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 text-xs text-fg/30">
            <Link href="/categories" className="transition-colors hover:text-fg/60">Categories</Link>
            {parentInfo && (
              <>
                <span>/</span>
                <Link href={`/category/${parentInfo.slug}`} className="transition-colors hover:text-fg/60">
                  {parentInfo.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-fg/50">{category.name}</span>
          </nav>

          {/* Back link */}
          <Link
            href={parentInfo ? `/category/${parentInfo.slug}` : "/categories"}
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-fg/30 transition-colors hover:text-brand"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-3.5 w-3.5" />
            {parentInfo ? parentInfo.name : "All Categories"}
          </Link>

          <h1 className="mb-3 max-w-xl text-4xl font-black leading-tight text-fg sm:text-5xl">
            <span className="bg-linear-to-r from-brand via-info to-accent bg-clip-text text-transparent">
              {category.name}
            </span>
          </h1>

          {processedDescription && (
            <div
              className="mb-6 max-w-md text-base leading-relaxed text-fg/45 [&_p]:mb-2 [&_p]:text-fg/45 [&_strong]:font-semibold [&_strong]:text-fg/75 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: processedDescription }}
            />
          )}

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            <div
              className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold text-fg/60 backdrop-blur-sm"
              style={{ borderColor: tint("var(--color-brand)", 19), backgroundColor: tint("var(--color-brand)", 6) }}
            >
              <HugeiconsIcon icon={Package01Icon} className="h-3.5 w-3.5" style={{ color: "var(--color-brand)" }} />
              {packages.length} {packages.length === 1 ? "item" : "items"}
            </div>
            <div
              className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold text-fg/60 backdrop-blur-sm"
              style={{ borderColor: tint("var(--color-info)", 19), backgroundColor: tint("var(--color-info)", 6) }}
            >
              <HugeiconsIcon icon={FlashIcon} className="h-3.5 w-3.5" style={{ color: "var(--color-info)" }} />
              Instant delivery
            </div>
            {saleCount > 0 && (
              <div
                className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold text-fg/60 backdrop-blur-sm"
                style={{ borderColor: tint("var(--color-accent)", 19), backgroundColor: tint("var(--color-accent)", 6) }}
              >
                <HugeiconsIcon icon={Discount01Icon} className="h-3.5 w-3.5" style={{ color: "var(--color-accent)" }} />
                {saleCount} on sale
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Packages ── */}
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Subcategory cards (shown when this is a parent category) */}
        {subcategories.length > 0 && (
          <div className="mb-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/30">
              Subcategories
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subcategories.map((sub) => {
                const subCount = sub.packages?.length ?? 0;
                return (
                  <Link
                    key={sub.id}
                    href={`/category/${sub.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-fg/6 bg-fg/2 px-4 py-3.5 transition-all duration-200 hover:border-brand/30 hover:bg-brand/6"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-fg/8 bg-fg/4 transition-colors group-hover:border-brand/30 group-hover:bg-brand/10">
                      <HugeiconsIcon icon={GridViewIcon} className="h-4 w-4 text-fg/35 transition-colors group-hover:text-brand" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg/80 transition-colors group-hover:text-fg">
                        {sub.name}
                      </p>
                      <p className="text-[11px] text-fg/30">
                        {subCount} {subCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5 shrink-0 text-fg/20 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Package grid */}
        {packages.length > 0 ? (
          <>
            {subcategories.length > 0 && (
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/30">
                Items in this category
              </p>
            )}
            <CategoryFilters packages={packages} />
          </>
        ) : subcategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fg/5">
              <HugeiconsIcon icon={GridViewIcon} className="h-7 w-7 text-fg/20" />
            </div>
            <div>
              <p className="text-base font-bold text-fg/50">No packages in this category</p>
              <p className="mt-1 text-sm text-fg/25">Check back soon.</p>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent slug={slug} />
    </Suspense>
  );
}
