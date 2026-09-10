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
  title: "Terms of Service",
  description: `Terms of Service for ${site.name}.`,
};

const LAST_UPDATED = "January 1, 2026";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-surface">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-fg/5 px-6 py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 0%, ${tint("var(--color-brand)", 6)}, transparent 70%)` }}
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h1 className="mb-3 text-4xl font-black tracking-tight text-fg lg:text-5xl">
            Terms of Service
          </h1>
          <p className="text-sm text-fg/30">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl space-y-10 text-sm leading-relaxed text-fg/55">

          <LegalTemplateNotice />

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">1. Acceptance of Terms</h2>
            <p>
              By purchasing from {site.name} you agree to these Terms of Service. If you do not agree, do not complete a purchase. We reserve the right to update these terms at any time; continued use of the store constitutes acceptance of any revised terms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">2. Products &amp; Delivery</h2>
            <p>
              All products sold through this store are digital goods. Items are delivered automatically once payment is confirmed, to the email address or linked account provided at checkout. {site.legalEntity} is not responsible for non-delivery caused by incorrect account details submitted at checkout.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">3. Payments</h2>
            <p>
              All transactions are processed securely through Tebex Ltd. {site.legalEntity} does not store or process payment card details. By completing a purchase you also agree to{" "}
              <a href="https://www.tebex.io/terms" target="_blank" rel="noopener noreferrer" className="text-info underline underline-offset-2 hover:text-fg">
                Tebex&apos;s Terms of Service
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">4. Refund Policy</h2>
            <p>
              Because items are delivered digitally and immediately upon payment confirmation, all sales are final and non-refundable unless:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A technical error caused a duplicate charge.</li>
              <li>The item was not delivered due to a fault on our side.</li>
              <li>The item significantly differs from its description.</li>
            </ul>
            <p>
              Refund requests must be submitted to{" "}
              <a href={`mailto:${site.supportEmail}`} className="text-info underline underline-offset-2 hover:text-fg">
                {site.supportEmail}
              </a>{" "}
              within 48 hours of purchase. We reserve the right to refuse requests that do not meet the above criteria.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">5. Prohibited Use</h2>
            <p>You may not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Resell, redistribute, or transfer purchased items unless the item&apos;s licence explicitly permits it.</li>
              <li>Attempt to exploit, reverse-engineer, or duplicate store items outside the terms of their licence.</li>
              <li>Use chargebacks or payment disputes as a substitute for contacting our support team.</li>
              <li>Purchase items on behalf of another person without their consent.</li>
            </ul>
            <p>
              Violations may result in permanent removal of access to the store without a refund.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">6. Intellectual Property</h2>
            <p>
              All assets available in this store are the intellectual property of {site.legalEntity} or the respective creator. Purchasing an item grants you a personal, non-exclusive, non-transferable licence to use it, subject to any additional licence terms supplied with the item.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">7. Limitation of Liability</h2>
            <p>
              {site.legalEntity} provides all items &quot;as is.&quot; To the fullest extent permitted by applicable law, {site.legalEntity} shall not be liable for any indirect, incidental, or consequential damages arising from the purchase or use of store items. Our total liability in connection with any purchase shall not exceed the amount paid for that purchase.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">8. Governing Law</h2>
            <p>
              These terms are governed by applicable law. Any disputes shall be resolved through our support channels in the first instance before any other action is taken.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-fg">9. Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href={`mailto:${site.supportEmail}`} className="text-info underline underline-offset-2 hover:text-fg">
                {site.supportEmail}
              </a>
              .
            </p>
          </div>

          <div className="pt-4 border-t border-fg/5">
            <Link href="/privacy" className="text-xs text-brand hover:text-fg transition-colors">
              Read our Privacy Policy →
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
