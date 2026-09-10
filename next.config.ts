import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    // Must list every `quality` value used in the app or Next 16 warns and clamps.
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dunb17ur4ymx4.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;

// Exposes wrangler.toml bindings (D1, KV, …) to `next dev`, so features backed
// by them behave the same locally as they do on Workers. No-ops in production.
initOpenNextCloudflareForDev();
