# Deploying the landing page

S3 behind CloudFront, with `/api/*` proxied to authService so the browser only
ever talks to one origin. Cloudflare is DNS only and is not in the request path.

    Browser ─▶ thinq.co ─┬─ /            ─▶ CloudFront ─▶ S3 (this bundle)
                         └─ /api/auth/v1/* ─▶ CloudFront ─▶ api.thinq.co ─▶ nginx ─▶ :8080

## Why /api must be same-origin — do not undo this

`authService` sets `tq_csrf` **host-only**, with no `Domain` attribute. A page on
`https://thinq.co` therefore cannot read a cookie belonging to `api.thinq.co`,
cannot echo it in `X-Tq-Csrf`, and every POST is refused with
`VALIDATION_FAILED`. `AUTH_BASE` in `src/lib/authService.ts` defaults to the
relative `/api/auth/v1` for that reason.

Setting `VITE_AUTH_BASE_URL` to an absolute URL breaks the waitlist. It has done
so once already, from a gitignored `.env.production` that no code review could
see. `scripts/deploy-s3.sh` greps the built bundle and refuses to publish if an
absolute `api.thinq.co` URL is compiled in.

## Deploying

    export S3_BUCKET=thinq-spa-prod
    export CLOUDFRONT_DISTRIBUTION_ID=EXXXXXXXXXXXXX
    npm run deploy

The script builds, runs the guard, uploads with the right `Cache-Control` per
path, and invalidates only `index.html`.

## CloudFront — one-time configuration

**Origins**

| Origin | Settings |
|---|---|
| S3 bucket | Origin Access Control, bucket private, REST endpoint (not the website endpoint) |
| `api.thinq.co` | HTTPS only, port 443, **origin path empty** |

Origin path must be empty: the SPA requests `/api/auth/v1/...` and the service
already serves that prefix. Anything here prepends it twice and every route 404s.

**Behaviours**, `/api/*` ordered ABOVE `Default (*)`:

| | `/api/*` | `Default (*)` |
|---|---|---|
| Origin | `api.thinq.co` | S3 |
| Methods | GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE | GET, HEAD |
| Cache policy | **CachingDisabled** | CachingOptimized |
| Origin request policy | **AllViewerExceptHostHeader** | — |
| Response headers policy | none | the security headers below |

Three of those are deliberate departures from the console defaults, and each
default fails quietly:

- **CachingDisabled** — the default caches GET, and `GET /api/auth/v1/session`
  would then be served from cache, showing one visitor's account status to
  another. POST is never cached, so only the read paths would be wrong.
- **AllViewerExceptHostHeader** — CloudFront's default strips cookies and most
  headers, so `tq_csrf` and `X-Tq-Csrf` never reach the service. The
  *ExceptHostHeader* variant is required rather than plain `AllViewer` because
  nginx sits in front of the service and may match on `server_name`.
- **All methods** — without POST, `/otp/send` is refused at the edge and nothing
  reaches the service log.

**Custom error responses** — replaces the Worker's SPA fallback:

| Error code | Response page | Response code |
|---|---|---|
| 403 | `/index.html` | 200 |
| 404 | `/index.html` | 200 |

403 is needed because a private bucket answers a missing key with 403, not 404.

**Response headers policy** — these were in `vercel.json` and were lost in the
move to S3; the live site currently sends none of them. Attach to the default
behaviour only, never to `/api/*`, where the service sets its own `Cache-Control`
and CORS.

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |

## Verify by BODY, never by status

An unmatched `/api/*` falls through to S3, which 403s, and the custom error
response above rewrites that to `index.html` with **status 200**. `curl -I`
therefore reports success for a path that never reached the service.

    curl -s https://thinq.co/api/auth/v1/healthz            # must print: ok
    curl -s -o /dev/null -w '%{content_type}\n' \
         https://thinq.co/api/auth/v1/config                # must be application/json

In the service journal, a working request has **no `OPTIONS` line** — same-origin
requests are never preflighted. That absence is the confirmation.

## What this replaced

The repo previously deployed as a Cloudflare Worker (`worker/index.ts`,
`wrangler.jsonc`) that served the assets and proxied `/api/*` to a Cloudflare
Tunnel at `auth.thinq.co`. Both are removed. `vercel.json` went with them.

Two things that design gave and this one does not:

- **A JSON envelope when the service is unreachable.** The Worker answered
  `{"ok":false,"error":{"code":"UPSTREAM_UNAVAILABLE"}}`, which the client already
  handles. CloudFront returns its own HTML error page instead, which surfaces as
  "answered 504 text/html rather than JSON".
- **Origin concealment.** The tunnel dialled out, so port 8080 could be closed
  entirely. Reaching the origin directly instead means locking it down by hand:
  restrict the security group to the `com.amazonaws.global.cloudfront.origin-facing`
  prefix list, and add a shared `X-Origin-Verify` header that CloudFront sends and
  nginx demands. The prefix list alone proves only "some CloudFront distribution".
