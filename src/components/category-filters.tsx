"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useState, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterIcon,
  Discount01Icon,
  ArrowUpDownIcon,
} from "@hugeicons/core-free-icons";
import { PackageCard } from "@/components/package-card";
import type { TebexPackage } from "@/lib/types";
import { isDiscounted } from "@/lib/pricing";

type SortKey = "default" | "price-asc" | "price-desc" | "newest" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A–Z" },
];

interface CategoryFiltersProps {
  packages: TebexPackage[];
}

export function CategoryFilters({ packages }: CategoryFiltersProps) {
  const [sort, setSort] = useState<SortKey>("default");
  const [saleOnly, setSaleOnly] = useState(false);

  const filtered = useMemo(() => {
    const list = saleOnly ? packages.filter(isDiscounted) : [...packages];
    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.total_price - b.total_price); break;
      case "price-desc": list.sort((a, b) => b.total_price - a.total_price); break;
      case "newest":     list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case "name":       list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [packages, sort, saleOnly]);

  const hasSaleItems = packages.some(isDiscounted);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Sort dropdown */}
        <div className="relative flex items-center gap-2">
          <HugeiconsIcon icon={ArrowUpDownIcon} className="h-3.5 w-3.5 text-fg/30" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none rounded-xl border border-fg/8 bg-fg/4 px-3 py-2 pr-8 text-xs font-semibold text-fg/70 transition-colors hover:border-fg/15 focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-surface-raised">
                {o.label}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-fg/30" fill="none" viewBox="0 0 12 12">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Sale toggle */}
        {hasSaleItems && (
          <button
            onClick={() => setSaleOnly((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              saleOnly
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-fg/8 bg-fg/4 text-fg/50 hover:border-fg/15 hover:text-fg/70"
            }`}
          >
            <HugeiconsIcon icon={Discount01Icon} className="h-3.5 w-3.5" />
            Sale only
          </button>
        )}

        {/* Result count */}
        <span className="ml-auto text-xs text-fg/25">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <HugeiconsIcon icon={FilterIcon} className="h-8 w-8 text-fg/15" />
          <p className="text-sm font-semibold text-fg/30">No packages match your filters</p>
          <button
            onClick={() => { setSort("default"); setSaleOnly(false); }}
            className="text-xs text-brand hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
