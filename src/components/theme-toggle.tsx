"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun01Icon, Moon02Icon, ComputerIcon } from "@hugeicons/core-free-icons";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export type ThemeChoice = "system" | "light" | "dark";

const ORDER: ThemeChoice[] = ["system", "light", "dark"];

const META: Record<ThemeChoice, { icon: typeof Sun01Icon; label: string }> = {
  system: { icon: ComputerIcon, label: "System theme" },
  light: { icon: Sun01Icon, label: "Light theme" },
  dark: { icon: Moon02Icon, label: "Dark theme" },
};

// ── external store, so every mounted toggle agrees and no effect writes state ──

const listeners = new Set<() => void>();

function currentTheme(): ThemeChoice {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" || attr === "dark" ? attr : "system";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => { listeners.delete(onChange); };
}

/**
 * Applies the choice by setting (or clearing) `data-theme` on <html>.
 * Clearing it hands control back to the prefers-color-scheme media query.
 */
export function setTheme(choice: ThemeChoice) {
  if (choice === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", choice);
  }
  try {
    if (choice === "system") localStorage.removeItem(STORAGE_KEYS.theme);
    else localStorage.setItem(STORAGE_KEYS.theme, choice);
  } catch {
    // Storage blocked — the choice still applies for this page view.
  }
  listeners.forEach((fn) => fn());
}

export function ThemeToggle() {
  // Server render always reports "system"; the inline script in the layout has
  // already set the real attribute before paint, so there is no flash.
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "system" as ThemeChoice);
  const { icon, label } = META[theme];

  function cycle() {
    setTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]);
  }

  return (
    <button
      onClick={cycle}
      aria-label={`${label}. Click to change.`}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-fg/10 bg-fg/5 text-fg/60 transition-all duration-300 hover:border-brand/40 hover:bg-brand/10 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <HugeiconsIcon icon={icon} className="h-4 w-4" />
    </button>
  );
}
