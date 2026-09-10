"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart";
import { site } from "@/config/site";
import { LogoMark } from "@/components/logo";
import { useWishlist } from "@/lib/collections";
import { ThemeToggle } from "@/components/theme-toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  ShoppingBag01Icon,
  ArrowLeft01Icon,
  InformationCircleIcon,
  BrushIcon,
  HelpCircleIcon,
  Menu01Icon,
  Cancel01Icon,
  Home01Icon,
  GridViewIcon,
} from "@hugeicons/core-free-icons";

const NAV_LINKS = [
  { href: "/", label: "HOME", icon: Home01Icon },
  { href: "/about", label: "ABOUT US", icon: InformationCircleIcon },
  { href: "/categories", label: "CATEGORIES", icon: GridViewIcon },
  { href: "/creators", label: "CREATORS", icon: BrushIcon },
  { href: "/faq", label: "FAQ", icon: HelpCircleIcon },
];

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const wishlist = useWishlist();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu on route change. Adjusting state during render (rather than in
  // an effect) avoids the extra commit + flash of the still-open menu.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setMenuOpen(false);
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function navClass(href: string) {
    const active = isActive(href);
    return `group relative flex items-center gap-1.5 py-1 text-sm font-semibold transition-colors ${
      active ? "text-fg" : "text-fg/60 hover:text-fg"
    }`;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-fg/5 bg-surface/90 backdrop-blur-md">
        <div className="relative flex items-center justify-between px-4 py-3 sm:px-6">

          {/* Logo — left */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative h-8 w-8 transition-transform group-hover:scale-105">
              <LogoMark title={site.name} className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-fg uppercase">{site.name}</span>
              {site.wordmarkSuffix && (
                <span className="text-[10px] tracking-wider text-fg/50">{site.wordmarkSuffix}</span>
              )}
            </div>
          </Link>

          {/* Desktop nav links — absolutely centred so logo+buttons stay at edges */}
          <div className="pointer-events-none absolute inset-x-0 hidden items-center justify-center gap-6 lg:flex">
            <div className="pointer-events-auto flex items-center gap-6">
              {NAV_LINKS.filter((l) => l.href !== "/").map(({ href, label, icon }) => (
                <Link key={href} href={href} className={navClass(href)}>
                  <HugeiconsIcon icon={icon} className="h-4 w-4" />
                  <span>{label}</span>
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-linear-to-r from-brand to-accent origin-left transition-transform duration-300 ${
                      isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center justify-end gap-2 lg:gap-3">
            {site.parentSite.url && (
              <a
                href={site.parentSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-4 py-2 text-sm font-medium text-fg/60 backdrop-blur-sm transition-all duration-300 hover:border-brand/40 hover:bg-brand/10 hover:text-fg"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="h-3.5 w-3.5" />
                {site.parentSite.label}
              </a>
            )}

            <ThemeToggle />

            {/* Saved items */}
            <Link
              href="/wishlist"
              aria-label={wishlist.length > 0 ? `Saved items (${wishlist.length})` : "Saved items"}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-fg/10 bg-fg/5 text-fg/60 transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <HugeiconsIcon icon={FavouriteIcon} className="h-4 w-4" />
              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-surface">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-fg/10 bg-fg/5 text-fg/60 transition-all duration-300 hover:border-brand/40 hover:bg-brand/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-fg/10 bg-fg/5 text-fg/60 transition-all duration-300 hover:border-brand/40 hover:bg-brand/10 hover:text-fg lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel — drops from top-right */}
      <div
        className={`fixed right-4 top-16 z-50 w-56 rounded-2xl border border-fg/8 bg-surface-raised shadow-2xl shadow-black/50 transition-all duration-200 ease-out lg:hidden ${
          menuOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-2 gap-0.5">
          {NAV_LINKS.map(({ href, label, icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand/15 text-fg"
                    : "text-fg/50 hover:bg-fg/5 hover:text-fg"
                }`}
              >
                <HugeiconsIcon
                  icon={icon}
                  className={`h-4 w-4 shrink-0 ${active ? "text-brand" : "text-fg/30"}`}
                />
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
                )}
              </Link>
            );
          })}

          {site.parentSite.url && (
            <>
              {/* Divider */}
              <div className="my-2 h-px bg-fg/5" />

              {/* Main site link */}
              <a
                href={site.parentSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-fg/40 transition-colors hover:bg-fg/5 hover:text-fg"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4 shrink-0 text-fg/20" />
                {site.parentSite.label}
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
