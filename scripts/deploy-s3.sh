#!/usr/bin/env bash
#
# Build and publish the landing page to S3, then invalidate CloudFront.
#
# Cache-Control is set HERE, at upload time, because CloudFront serves whatever
# metadata S3 holds. `aws s3 sync` with no --cache-control stores none, and the
# current live bundle has exactly that problem: /assets/*.js is served with no
# Cache-Control at all. Hashed assets can then be re-fetched on every visit,
# and — worse — index.html can be cached, leaving a browser pinned to an old
# bundle whose asset hashes no longer exist in the bucket.
set -euo pipefail

: "${S3_BUCKET:?set S3_BUCKET, e.g. thinq-spa-prod}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?set CLOUDFRONT_DISTRIBUTION_ID}"

npm run build

# THE REGRESSION GUARD, and it is the reason this script exists rather than two
# aws commands in a runbook.
#
# An absolute API base in the bundle is the defect that broke the waitlist: the
# browser then talks to another host, cannot read the host-only tq_csrf cookie,
# and every POST is refused. It reached production through a gitignored
# .env.production, so nothing in review could have caught it. The built output
# is the only place the mistake is visible, so that is where it is checked.
if grep -rqE 'https://[a-z.]*api\.thinq\.co' dist/assets/ 2>/dev/null; then
  echo "REFUSING TO DEPLOY: an absolute authService URL is compiled into the bundle." >&2
  echo "  found: $(grep -rhoE 'https://[a-z.]*api\.thinq\.co[^\"'\''\`]*' dist/assets/ | sort -u | head -1)" >&2
  echo "  AUTH_BASE must stay relative (/api/auth/v1) so the API is same-origin." >&2
  echo "  Unset VITE_AUTH_BASE_URL — check .env.production, .env.local and the shell." >&2
  exit 1
fi

# Hashed filenames, so they can be cached forever and never invalidated.
aws s3 sync dist/ "s3://${S3_BUCKET}/" --delete \
  --exclude index.html \
  --cache-control 'public, max-age=31536000, immutable'

# The entry point is the one file that must never be served stale: it names the
# asset hashes for this release.
aws s3 cp dist/index.html "s3://${S3_BUCKET}/index.html" \
  --cache-control 'public, max-age=0, must-revalidate' \
  --content-type 'text/html; charset=utf-8'

# Only index.html needs invalidating; every other path is content-addressed.
aws cloudfront create-invalidation \
  --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths '/' '/index.html'

echo "deployed to s3://${S3_BUCKET}, invalidated / and /index.html"
