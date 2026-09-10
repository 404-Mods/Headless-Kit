/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import Link from "next/link";
import Image from "next/image";
import { getCategories, getRootCategories, getSubcategories, shouldShowSetupHelp } from "@/lib/tebex";
import { stripHtmlAndMarkdown } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ArrowRight01Icon, Package01Icon, Store01Icon, FlashIcon, BrushIcon, FolderOpenIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { StoreSetupNotice } from "@/components/store-setup-notice";
import { tint } from "@/lib/color";

// Catalog-backed page: re-rendered on the same cadence as src/lib/tebex.ts.
// Without this the page would be prerendered once at build time and never update.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Categories",
  description: `Browse every product category on ${site.name}.`,
};

export default async function CategoriesPage() {
  const allCategories = await getCategories(true).catch(() => []);

  const rootCategories = getRootCategories(allCategories);
  const totalItems = allCategories.reduce((n, c) => n + (c.packages?.length ?? 0), 0);

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
        {/* Purple glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-150 -translate-x-1/2 rounded-full bg-brand/15 blur-[100px]" />
        {/* Pink glow */}
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-40 w-80 rounded-full bg-accent/8 blur-[90px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">
          {/* Eyebrow */}
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
            <HugeiconsIcon icon={Store01Icon} className="h-3 w-3" />
            {site.name}
          </p>

          <h1 className="mb-4 max-w-xl text-4xl font-black leading-tight text-fg sm:text-5xl">
            Browse by{" "}
            <span className="bg-linear-to-r from-brand via-info to-accent bg-clip-text text-transparent">
              category.
            </span>
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-fg/45">
            Find exactly what you need — from creator scripts to custom templates. Every item is community-made and delivered instantly.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: GridViewIcon,   label: `${rootCategories.length} categories`,   color: "var(--color-brand)" },
              { icon: Package01Icon,  label: `${totalItems} items`,               color: "var(--color-accent)" },
              { icon: BrushIcon,      label: "Made by creators",                  color: "var(--color-info)" },
              { icon: FlashIcon,      label: "Instant delivery",                  color: "var(--color-brand)" },
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

            {/* View all products CTA */}
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-4 py-2 text-xs font-bold text-fg/70 backdrop-blur-sm transition-all duration-200 hover:border-brand/40 hover:bg-brand/10 hover:text-fg"
            >
              <HugeiconsIcon icon={Store01Icon} className="h-3.5 w-3.5" />
              View all products
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 opacity-60" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Category grid ── */}
      <main className="mx-auto max-w-6xl px-6 py-16">
      {rootCategories.length === 0 && shouldShowSetupHelp() ? (
        <StoreSetupNotice />
      ) : rootCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fg/5">
            <HugeiconsIcon icon={GridViewIcon} className="h-7 w-7 text-fg/20" />
          </div>
          <p className="text-sm font-semibold text-fg/30">No categories found</p>
        </div>
      ) : (
        <div className="space-y-10">
          {rootCategories.map((cat) => {
            const subcats = getSubcategories(allCategories, cat.id);
            const count = cat.packages?.length ?? 0;
            const preview = cat.packages?.slice(0, 3) ?? [];
            const hasSubcats = subcats.length > 0;

            return (
              <div key={cat.id}>
                {/* ── Parent category card ── */}
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-fg/6 bg-fg/2 p-6 transition-all duration-300 hover:border-fg/12 hover:bg-fg/4"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-br from-brand/5 to-accent/5" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-fg/8 bg-fg/5 transition-colors group-hover:border-brand/30 group-hover:bg-brand/10">
                        <HugeiconsIcon icon={hasSubcats ? FolderOpenIcon : GridViewIcon} className="h-5 w-5 text-fg/40 transition-colors group-hover:text-brand" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-fg/90 transition-colors group-hover:text-fg">
                          {cat.name}
                        </h2>
                        {cat.description ? (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-fg/35">
                            {stripHtmlAndMarkdown(cat.description)}
                          </p>
                        ) : null}

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {count > 0 && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-fg/30">
                              <HugeiconsIcon icon={Package01Icon} className="h-3.5 w-3.5" />
                              {count} {count === 1 ? "item" : "items"}
                            </span>
                          )}
                          {hasSubcats && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-fg/30">
                              <HugeiconsIcon icon={FolderOpenIcon} className="h-3.5 w-3.5" />
                              {subcats.length} {subcats.length === 1 ? "subcategory" : "subcategories"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Package preview thumbnails */}
                    {preview.length > 0 && (
                      <div className="hidden sm:flex shrink-0 gap-1.5">
                        {preview.map((pkg) =>
                          pkg.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={pkg.id} src={pkg.image} alt={pkg.name} className="h-10 w-10 rounded-lg object-cover opacity-60 ring-1 ring-fg/10 transition-opacity group-hover:opacity-80" />
                          ) : (
                            <div key={pkg.id} className="flex h-10 w-10 items-center justify-center rounded-lg bg-fg/5 ring-1 ring-fg/8">
                              <HugeiconsIcon icon={Package01Icon} className="h-3.5 w-3.5 text-fg/20" />
                            </div>
                          )
                        )}
                        {count > 3 && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fg/5 ring-1 ring-fg/8">
                            <span className="text-[10px] font-bold text-fg/30">+{count - 3}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Browse
                      <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>

                {/* ── Subcategory cards ── */}
                {hasSubcats && (
                  <div className="mt-2 ml-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 border-l border-fg/5 pl-4">
                    {subcats.map((sub) => {
                      const subCount = sub.packages?.length ?? 0;
                      return (
                        <Link
                          key={sub.id}
                          href={`/category/${sub.slug}`}
                          className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-fg/5 bg-fg/1.5 px-4 py-3 transition-all duration-200 hover:border-brand/25 hover:bg-brand/5"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-fg/8 bg-fg/4 transition-colors group-hover:border-brand/30 group-hover:bg-brand/10">
                            <HugeiconsIcon icon={GridViewIcon} className="h-3.5 w-3.5 text-fg/35 transition-colors group-hover:text-brand" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-fg/75 transition-colors group-hover:text-fg">
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
                )}
              </div>
            );
          })}
        </div>
      )}
      </main>
    </>
  );
}
