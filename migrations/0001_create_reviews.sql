-- Product reviews.
--
-- Apply locally:   npx wrangler d1 migrations apply storefront-reviews --local
-- Apply remotely:  npx wrangler d1 migrations apply storefront-reviews --remote

CREATE TABLE IF NOT EXISTS reviews (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id  INTEGER NOT NULL,
  author      TEXT    NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT    NOT NULL,
  -- SHA-256 of the submitter's IP. Used only for rate limiting; the raw
  -- address is never stored.
  client_hash TEXT    NOT NULL,
  -- Set to 'hidden' to take a review down without deleting it.
  status      TEXT    NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Product pages read by package, newest first.
CREATE INDEX IF NOT EXISTS idx_reviews_package
  ON reviews (package_id, status, created_at DESC);

-- Rate limiting counts recent rows per submitter.
CREATE INDEX IF NOT EXISTS idx_reviews_client
  ON reviews (client_hash, created_at);
