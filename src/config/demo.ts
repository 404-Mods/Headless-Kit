/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */

/**
 * Demo mode serves a built-in fixture catalogue instead of calling Tebex, and
 * runs the cart entirely in the browser.
 *
 * It powers the public demo, and it means `npm run dev` on a fresh clone gives
 * you a working storefront to click around before you have a token.
 *
 * Enable with `NEXT_PUBLIC_DEMO_MODE=true`. It is NEXT_PUBLIC because the cart
 * runs client-side and has to know. Setting a real TEBEX_TOKEN does not disable
 * it — demo mode always wins, so a demo deployment can never accidentally
 * transact against a live store.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
