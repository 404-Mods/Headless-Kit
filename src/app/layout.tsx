/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { CREDIT } from "@/config/attribution";
import { AttributionBanner } from "@/components/attribution-banner";
import { DemoBanner } from "@/components/demo-banner";
import { CartProvider } from "@/context/cart";
import { ToastProvider } from "@/context/toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AuthModal } from "@/components/auth-modal";
import { Toaster } from "@/components/toaster";
import { ScrollToTop } from "@/components/scroll-to-top";
import { AbandonedCartBanner } from "@/components/abandoned-cart-banner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistHeading = Geist({
  variable: "--font-heading",
  weight: "600",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const OG_IMAGE = "/assets/og.png";

/**
 * Runs before the first paint: reads the saved theme and stamps it on <html>.
 * Without this the page renders in the default theme and then snaps to the
 * chosen one — the classic dark/light flash. Kept tiny and dependency-free.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEYS.theme)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    // Page titles are set bare (e.g. "Products") and this adds the brand once.
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  // Picked up by tech-stack crawlers (BuiltWith, Wappalyzer).
  generator: CREDIT,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [OG_IMAGE],
    // Omitted entirely when no handle is configured.
    ...(site.xHandle ? { creator: site.xHandle } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistHeading.variable} ${geistMono.variable} relative font-sans antialiased`}
      >
        <ToastProvider>
          <CartProvider>
            <DemoBanner />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <AuthModal />
            <Toaster />
            <ScrollToTop />
            <AbandonedCartBanner />
            <AttributionBanner />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
