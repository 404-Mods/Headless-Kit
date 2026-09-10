/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings01Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

const STEPS = [
  {
    title: "Get your webstore token",
    body: "In the Tebex Creator Panel, open your store and go to Store Settings → API Keys. Copy the public webstore token — not a secret key.",
  },
  {
    title: "Add it to .env.local",
    code: "TEBEX_TOKEN=your-token-here\nNEXT_PUBLIC_STORE_URL=http://localhost:3000",
    body: "Copy .env.example if you haven't already.",
  },
  {
    title: "Restart the dev server",
    body: "Environment variables are read at boot, so the running server won't pick up the change on its own.",
  },
];

/**
 * Shown in place of the empty catalogue when TEBEX_TOKEN is missing.
 *
 * Without this, a fresh clone renders "No packages yet" and gives no indication
 * that the store simply isn't connected — the single most confusing thing a new
 * adopter can hit. Rendered in development only; production keeps the neutral
 * empty state so a misconfigured deploy never leaks setup details to shoppers.
 */
export function StoreSetupNotice() {
  return (
    <div className="mx-auto max-w-2xl py-16">
      <div className="overflow-hidden rounded-2xl border border-brand/25 bg-surface-raised">
        <div className="h-1 w-full bg-linear-to-r from-brand via-info to-accent" />

        <div className="p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10">
              <HugeiconsIcon icon={Settings01Icon} className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-black text-fg">Your storefront isn&apos;t connected yet</h2>
              <p className="mt-1 text-sm leading-relaxed text-fg/45">
                Everything renders — there&apos;s just no catalogue to show until you point it at a
                Tebex store.
              </p>
            </div>
          </div>

          <ol className="space-y-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-fg/10 bg-fg/5 text-[11px] font-bold text-fg/50">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-fg">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-fg/40">{step.body}</p>
                  {step.code && (
                    <pre className="mt-2 overflow-x-auto rounded-lg border border-fg/8 bg-surface px-3 py-2 text-[11px] leading-relaxed text-info">
                      <code>{step.code}</code>
                    </pre>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-fg/5 pt-5">
            <a
              href="https://docs.tebex.io/developers/headless-api/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-brand transition-colors hover:text-fg"
            >
              Headless API docs
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-fg/25">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" />
              Shown in development only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
