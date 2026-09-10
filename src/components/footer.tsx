/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DiscordIcon,
  TwitterIcon,
  YoutubeIcon,
  InstagramIcon,
  TiktokIcon,
  Github01Icon,
} from "@hugeicons/core-free-icons";
import { site, activeSocials, type SocialLink } from "@/config/site";
import { LogoMark } from "@/components/logo";
import { PoweredBy } from "@/components/powered-by";

/**
 * Icon and label for each supported platform. These are third-party brand
 * colours, so they stay as literals rather than theme tokens.
 */
const PLATFORMS: Record<SocialLink["platform"], { icon: typeof DiscordIcon; label: string; color: string }> = {
  discord: { icon: DiscordIcon, label: "Discord", color: "#5865F2" },
  x: { icon: TwitterIcon, label: "X", color: "#ffffff" },
  youtube: { icon: YoutubeIcon, label: "YouTube", color: "#FF0000" },
  instagram: { icon: InstagramIcon, label: "Instagram", color: "#E4405F" },
  tiktok: { icon: TiktokIcon, label: "TikTok", color: "#ffffff" },
  github: { icon: Github01Icon, label: "GitHub", color: "#ffffff" },
};

export function Footer() {
  return (
    <footer className="border-t border-fg/5 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <LogoMark
              title={site.name}
              className="h-5 w-5 opacity-40 transition-opacity group-hover:opacity-70"
            />
            <span className="text-xs font-black tracking-widest text-fg/25 uppercase transition-colors group-hover:text-fg/50">
              {site.name}
            </span>
          </Link>

          {/* Only rendered for socials that have a URL configured. */}
          {activeSocials.length > 0 && (
            <div className="flex items-center gap-1">
              {activeSocials.map((s) => {
                const meta = PLATFORMS[s.platform];
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={meta.label}
                    className="group/icon relative flex h-7 w-7 items-center justify-center rounded-md text-fg/25 transition-all duration-300 hover:text-fg/80"
                    style={{ "--icon-color": meta.color } as React.CSSProperties}
                  >
                    <div className="absolute inset-0 rounded-md bg-fg/0 transition-all duration-300 group-hover/icon:bg-[var(--icon-color)]/10" />
                    <HugeiconsIcon icon={meta.icon} size={13} className="relative z-10" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col items-center gap-2 border-t border-fg/5 pt-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-xs text-fg/20 transition-colors hover:text-fg/50">Terms</Link>
            <Link href="/privacy" className="text-xs text-fg/20 transition-colors hover:text-fg/50">Privacy Policy</Link>
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="text-xs text-fg/20">
              © {new Date().getFullYear()} {site.legalEntity}. All rights reserved.
            </p>
            {/* Licence condition 2 — see LICENSE before removing. */}
            <PoweredBy />
          </div>
        </div>
      </div>
    </footer>
  );
}
