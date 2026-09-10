/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Discount01Icon, ArrowRight01Icon, FlashIcon } from "@hugeicons/core-free-icons";
import { getPackages } from "@/lib/tebex";
import { slugify } from "@/lib/utils";
import { isDiscounted, discountPercent } from "@/lib/pricing";

export async function SaleBanner() {
  const packages = await getPackages().catch(() => []);
  const sale = packages.filter(isDiscounted).slice(0, 4);
  if (sale.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-b border-accent/10 bg-linear-to-r from-accent/5 via-brand/5 to-info/5 px-6 py-8">
      {/* Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-64 rounded-full bg-accent/8 blur-[80px]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15">
              <HugeiconsIcon icon={FlashIcon} className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
                On Sale Now
              </p>
              <p className="text-[10px] text-fg/30">{sale.length} items discounted</p>
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sale.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/products/${slugify(pkg.name)}`}
              className="group relative overflow-hidden rounded-xl border border-accent/15 bg-fg/2 transition-all hover:border-accent/30 hover:bg-fg/4"
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden">
                {pkg.image ? (
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface-raised">
                    <HugeiconsIcon icon={Discount01Icon} className="h-6 w-6 text-fg/10" />
                  </div>
                )}
                {/* Discount pill */}
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 text-[9px] font-black text-surface">
                  <HugeiconsIcon icon={Discount01Icon} className="h-2.5 w-2.5" />
                  {discountPercent(pkg)}% OFF
                </div>
              </div>

              <div className="p-3">
                <p className="line-clamp-1 text-xs font-bold text-fg group-hover:text-accent">
                  {pkg.name}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-accent">
                    {pkg.currency} {pkg.total_price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-fg/25 line-through">
                    {pkg.currency} {pkg.base_price.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
