# Cloudflare Rules

Recommended Cloudflare configuration for the routes this storefront exposes.

- API routes:
  - /api/featured (GET)
  - /api/basket (POST)
  - /api/basket/{ident} (GET)
  - /api/basket/{ident}/auth (GET)
  - /api/basket/{ident}/add (POST)
  - /api/basket/{ident}/remove (POST)
- Checkout pages:
  - /checkout/success
  - /checkout/cancel

Apply these in the Cloudflare dashboard for the zone serving your store.

## 1) WAF Managed Rules

- Enable Cloudflare Managed Rules.
- Enable OWASP Core Ruleset.
- Start in default sensitivity, then tune false positives.

## 2) Custom WAF Rules (method hardening)

Create these custom rules with action Block.

1. Only allow POST to basket creation endpoint

Expression:
(http.request.uri.path eq "/api/basket" and http.request.method ne "POST")

2. Only allow GET to basket read endpoint

Expression:
(http.request.uri.path matches "^/api/basket/[^/]+$" and http.request.method ne "GET")

3. Only allow POST to add/remove endpoints

Expression:
((http.request.uri.path matches "^/api/basket/[^/]+/(add|remove)$") and http.request.method ne "POST")

4. Only allow GET to auth links endpoint

Expression:
(http.request.uri.path matches "^/api/basket/[^/]+/auth$" and http.request.method ne "GET")

5. Only allow GET to featured endpoint

Expression:
(http.request.uri.path eq "/api/featured" and http.request.method ne "GET")

## 3) Rate Limiting Rules

Use action Managed Challenge for first rollout.

1. Basket creation abuse guard

- Expression:
  (http.request.uri.path eq "/api/basket" and http.request.method eq "POST")
- Suggested threshold:
  10 requests per 1 minute per IP
- Mitigation timeout:
  10 minutes

2. Basket mutation guard (add/remove)

- Expression:
  (http.request.uri.path matches "^/api/basket/[^/]+/(add|remove)$" and http.request.method eq "POST")
- Suggested threshold:
  40 requests per 1 minute per IP
- Mitigation timeout:
  10 minutes

3. Basket read/auth scraping guard

- Expression:
  (http.request.uri.path matches "^/api/basket/[^/]+(/auth)?$" and http.request.method eq "GET")
- Suggested threshold:
  120 requests per 1 minute per IP
- Mitigation timeout:
  5 minutes

4. Featured endpoint scrape guard

- Expression:
  (http.request.uri.path eq "/api/featured" and http.request.method eq "GET")
- Suggested threshold:
  120 requests per 1 minute per IP
- Mitigation timeout:
  5 minutes

## 4) Cache Rules

Create rules in this order (top to bottom).

1. Bypass cache for all API and checkout paths

Expression:
(starts_with(http.request.uri.path, "/api/") or starts_with(http.request.uri.path, "/checkout/"))

Setting:
- Cache eligibility: Bypass cache

2. Cache immutable Next static assets

Expression:
starts_with(http.request.uri.path, "/_next/static/")

Setting:
- Cache eligibility: Eligible for cache
- Edge TTL: 1 month (or respect origin if already immutable)

3. Cache public assets

Expression:
starts_with(http.request.uri.path, "/assets/")

Setting:
- Cache eligibility: Eligible for cache
- Edge TTL: 7 days (increase if versioned filenames are used)

4. Optional: cache by extension for static files

Expression:
(http.request.uri.path matches "\\.(?:css|js|mjs|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$")

Setting:
- Cache eligibility: Eligible for cache
- Edge TTL: 7 days

## 5) Bot Rules

- Enable Super Bot Fight Mode (or Bot Management if plan supports it).
- Add custom rule for obvious automation on API paths with Managed Challenge:

Expression:
(starts_with(http.request.uri.path, "/api/") and cf.bot_management.score lt 30)

Action:
Managed Challenge

If your plan does not expose bot score, skip this custom rule and rely on rate limiting.

## 6) TLS and Edge Settings

- SSL/TLS mode: Full (strict)
- Minimum TLS version: 1.2
- Enable TLS 1.3
- Enable HTTP/3
- Always Use HTTPS: On
- Brotli: On

## 7) Rules to avoid for this app

- Do not cache /api/* responses.
- Do not cache /checkout/* responses.
- Do not add strict country blocks unless you know your customer geography.
- Do not block all bots globally; use challenge and rate limits first.

## 8) Validation checklist

After applying rules:

1. Add product to cart from a normal browser session.
2. Change quantities quickly to ensure rate limits are not too tight.
3. Complete checkout and verify /checkout/success and /checkout/cancel load.
4. Call /api/featured repeatedly and verify cache/rate behavior.
5. Review Security Analytics for false positives before switching challenge to block.
