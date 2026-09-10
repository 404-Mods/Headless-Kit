/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { Metadata } from "next";
import Link from "next/link";
import { tint } from "@/lib/color";
import { site } from "@/config/site";
import { LegalTemplateNotice } from "@/components/legal-template-notice";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${site.name}.`,
};

const LAST_UPDATED = "April 29, 2026";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-surface">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-fg/5 px-6 py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 0%, ${tint("var(--color-accent)", 3)}, transparent 70%)` }}
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h1 className="mb-3 text-4xl font-black tracking-tight text-fg lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-fg/30">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl space-y-10 text-sm leading-relaxed text-fg/55">

          <LegalTemplateNotice />

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">1. Overview</h2>
            <p>
              {site.legalEntity} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates this marketplace. This policy explains what information we collect when you use the store, how it is used, and your rights. We are committed to handling your data responsibly and transparently.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">2. Information We Collect</h2>
            <p>We collect only the minimum data required to operate the store:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-fg/80 font-medium">Account identifier</span> — provided by you at checkout so purchases can be delivered to the right account.</li>
              <li><span className="text-fg/80 font-medium">Transaction records</span> — order IDs and purchase history provided to us by Tebex for support and delivery verification.</li>
              <li><span className="text-fg/80 font-medium">Browser storage</span> — a basket identifier is stored in your browser&apos;s localStorage to persist your cart between sessions. No personal data is stored here.</li>
            </ul>
            <p>
              We do <strong className="text-fg/70">not</strong> collect or store payment card details, email addresses, or IP addresses directly. This data is handled exclusively by Tebex.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To deliver purchased items to your account.</li>
              <li>To investigate support requests and verify transactions.</li>
              <li>To prevent fraud and abuse of the store.</li>
            </ul>
            <p>We do not sell, rent, or share your information with third parties for marketing purposes.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">4. Third-Party Services</h2>
            <p>
              Payments are processed by{" "}
              <a href="https://www.tebex.io" target="_blank" rel="noopener noreferrer" className="text-info underline underline-offset-2 hover:text-fg">
                Tebex Ltd
              </a>
              , a PCI-DSS compliant payment platform. When you check out, you are subject to Tebex&apos;s own privacy policy and terms. We recommend reviewing them at{" "}
              <a href="https://www.tebex.io/privacy" target="_blank" rel="noopener noreferrer" className="text-info underline underline-offset-2 hover:text-fg">
                tebex.io/privacy
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">5. Data Retention</h2>
            <p>
              Transaction records tied to your account identifier are retained for as long as necessary to provide ongoing support and verify delivery history. You may request deletion of your data by contacting us, subject to any legal obligations we may have to retain certain records.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">6. Cookies &amp; Local Storage</h2>
            <p>
              This store does not use tracking cookies. We use browser localStorage solely to store your shopping basket ID so your cart persists between page loads. This data never leaves your browser and is not transmitted to our servers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">7. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the right to access, correct, or request deletion of personal data we hold about you. To exercise these rights, contact us at {site.supportEmail} and we will respond promptly.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. The &quot;Last updated&quot; date at the top of this page will reflect any changes. Continued use of the store after changes are posted constitutes acceptance of the revised policy.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">9. Contact</h2>
            <p>
              Questions or data requests? Contact us at{" "}
              <a href={`mailto:${site.supportEmail}`} className="text-info underline underline-offset-2 hover:text-fg">
                {site.supportEmail}
              </a>
              .
            </p>
          </div>

          <div className="pt-4 border-t border-fg/5">
            <Link href="/terms" className="text-xs text-brand hover:text-fg transition-colors">
              Read our Terms of Service →
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
