/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { getPackages } from "@/lib/tebex";
import { PackageCard } from "@/components/package-card";

export async function NewArrivals() {
  const packages = await getPackages().catch(() => []);

  // Sort by ID descending (highest ID = newest), exclude limited-time items so they stay in "sale"
  const arrivals = packages
    .filter((p) => !p.expiration_date)
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  if (arrivals.length === 0) return null;

  return (
    <section className="border-b border-fg/5 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/15">
              <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4 text-info" />
            </div>
            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.3em] text-info">
                Just dropped
              </p>
              <h2 className="text-xl font-black text-fg">New arrivals</h2>
            </div>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-xs font-semibold text-fg/35 transition-colors hover:text-fg"
          >
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
