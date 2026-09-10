"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useState, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, GridViewIcon, FilterIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { PackageCard } from "@/components/package-card";
import type { TebexPackage } from "@/lib/types";
import { isDiscounted, discountPercent } from "@/lib/pricing";

interface ProductsBrowserProps {
  packages: TebexPackage[];
  categories: { id: number; name: string }[];
}

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name" | "discount";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "discount", label: "Biggest discount" },
  { value: "name", label: "Name A–Z" },
];

const comparators: Record<SortKey, (a: TebexPackage, b: TebexPackage) => number> = {
  // Discounted first, matching the original default.
  featured: (a, b) => Number(isDiscounted(b)) - Number(isDiscounted(a)),
  newest: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  "price-asc": (a, b) => a.total_price - b.total_price,
  "price-desc": (a, b) => b.total_price - a.total_price,
  discount: (a, b) => discountPercent(b) - discountPercent(a),
  name: (a, b) => a.name.localeCompare(b.name),
};

export function ProductsBrowser({ packages, categories }: ProductsBrowserProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [saleOnly, setSaleOnly] = useState(false);

  /** Ceiling for the price slider, rounded up so the handle can reach the top. */
  const priceCeiling = useMemo(() => {
    const highest = packages.reduce((m, p) => Math.max(m, p.total_price), 0);
    return Math.max(1, Math.ceil(highest));
  }, [packages]);

  const effectiveMax = maxPrice ?? priceCeiling;

  const filtered = useMemo(() => {
    let result = packages;
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category.id === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }
    if (saleOnly) {
      result = result.filter(isDiscounted);
    }
    if (maxPrice !== null) {
      result = result.filter((p) => p.total_price <= maxPrice);
    }
    return [...result].sort(comparators[sort]);
  }, [packages, search, activeCategory, sort, maxPrice, saleOnly]);

  const hasFilter =
    search.trim() !== "" || activeCategory !== "all" || saleOnly || maxPrice !== null;

  function clearAll() {
    setSearch("");
    setActiveCategory("all");
    setSaleOnly(false);
    setMaxPrice(null);
  }

  return (
    <div className="space-y-5">

      {/* Search input */}
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/25"
        />
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-fg/8 bg-fg/3 py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-fg/25 outline-none transition-all focus:border-brand/50 focus:bg-fg/5 focus:ring-1 focus:ring-brand/20"
        />
      </div>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
              activeCategory === "all"
                ? "border-brand/50 bg-brand/20 text-fg"
                : "border-fg/8 bg-fg/3 text-fg/45 hover:border-fg/15 hover:text-fg/70"
            }`}
          >
            All
            <span className={`ml-1.5 text-[10px] font-normal ${activeCategory === "all" ? "text-fg/60" : "text-fg/25"}`}>
              {packages.length}
            </span>
          </button>
          {categories.map((cat) => {
            const count = packages.filter((p) => p.category.id === cat.id).length;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                  active
                    ? "border-brand/50 bg-brand/20 text-fg"
                    : "border-fg/8 bg-fg/3 text-fg/45 hover:border-fg/15 hover:text-fg/70"
                }`}
              >
                {cat.name}
                <span className={`ml-1.5 text-[10px] font-normal ${active ? "text-fg/60" : "text-fg/25"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Sort + price + sale filters */}
      <div className="flex flex-wrap items-center gap-3 border-y border-fg/5 py-3">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FilterIcon} className="h-3.5 w-3.5 text-fg/25" />
          <label htmlFor="sort" className="text-[11px] font-bold uppercase tracking-wider text-fg/30">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-fg/8 bg-surface px-2.5 py-1.5 text-xs font-semibold text-fg/70 outline-none transition-colors hover:border-fg/15 focus:border-brand/50"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="max-price" className="text-[11px] font-bold uppercase tracking-wider text-fg/30">
            Max
          </label>
          <input
            id="max-price"
            type="range"
            min={0}
            max={priceCeiling}
            step={1}
            value={effectiveMax}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMaxPrice(v >= priceCeiling ? null : v);
            }}
            className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-fg/10 accent-[var(--color-brand)]"
          />
          <span className="min-w-14 text-xs font-semibold tabular-nums text-fg/50">
            {maxPrice === null ? "Any" : `${packages[0]?.currency ?? ""} ${maxPrice}`}
          </span>
        </div>

        <button
          onClick={() => setSaleOnly((v) => !v)}
          aria-pressed={saleOnly}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
            saleOnly
              ? "border-accent/50 bg-accent/20 text-fg"
              : "border-fg/8 bg-fg/3 text-fg/45 hover:border-fg/15 hover:text-fg/70"
          }`}
        >
          On sale
        </button>

        {hasFilter && (
          <button
            onClick={clearAll}
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-fg/30 transition-colors hover:text-fg"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {hasFilter && (
        <p className="text-xs text-fg/30">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
          {search.trim() && (
            <>
              {" "}for{" "}
              <span className="text-fg/50">&ldquo;{search.trim()}&rdquo;</span>
            </>
          )}
        </p>
      )}

      {/* Grid or empty state */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fg/5">
            <HugeiconsIcon icon={GridViewIcon} className="h-7 w-7 text-fg/20" />
          </div>
          {search.trim() ? (
            <div>
              <p className="text-base font-bold text-fg/50">
                No results for &ldquo;{search}&rdquo;
              </p>
              <button
                onClick={clearAll}
                className="mt-2 text-sm font-semibold text-brand hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div>
              <p className="text-base font-bold text-fg/50">Nothing matches those filters</p>
              <button
                onClick={clearAll}
                className="mt-2 text-sm font-semibold text-brand hover:underline"
              >
                View all products
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
