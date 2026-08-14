/**
 * The edge in front of the site.
 *
 * Two jobs. Everything under /api/ is forwarded to authService; everything else
 * is the static bundle, served by the assets binding exactly as it was before
 * this file existed.
 *
 * ── Why the API is proxied rather than called directly ─────────────────────
 *
 * authService runs on its own host, and a browser cannot reach it from this
 * origin. Three separate reasons, each measured against the live service and
 * each fatal on its own:
 *
 *   1. Its CORS allowlist admits https://thinq.co and https://www.thinq.co and
 *      nothing else — no other origin gets an Access-Control-Allow-Origin
 *      header back, so a preflight from anywhere else simply fails.
 *   2. The CSRF scheme cannot survive a cross-origin split. `tq_csrf` is set by
 *      the service's own host as `Path=/; SameSite=Strict`, host-only, and
 *      `document.cookie` only ever reads cookies belonging to the page's own
 *      origin. The token the client is required to echo in `X-Tq-Csrf` would be
 *      permanently invisible to it, and a SameSite=Strict cookie is not sent on
 *      cross-site requests regardless.
 *   3. This site is HTTPS and the service is plain HTTP, which the browser
 *      refuses outright as mixed content.
 *
 * Proxying answers all three at once: the browser only ever talks to this
 * origin, so there is no preflight to fail, nothing mixed to block, and
 * Set-Cookie lands on this domain where script can read it and where
 * SameSite=Strict is satisfied by every same-site call the page makes.
 *
 * ── The unencrypted hop, stated plainly ───────────────────────────────────
 *
 * AUTH_ORIGIN below is http, because the service has no TLS — https on that
 * host does not answer. So the leg between this Worker and the service crosses
 * the public internet in the clear, carrying OTP codes and session cookies.
 * That is a deliberate, temporary acceptance, made explicitly, to get the flow
 * working before TLS exists. It should not stay.
 *
 * Fixing it needs no change here beyond the scheme and host: put the service
 * behind a Cloudflare Tunnel, or give it a certificate, then point AUTH_ORIGIN
 * at https and delete this note.
 */

interface Env {
  /** The static bundle, bound by wrangler.jsonc. */
  ASSETS: Fetcher
  /** Overridable per environment; the default is the current deployment. */
  AUTH_ORIGIN?: string
}

/** Where authService listens. See the note above about the scheme. */
const DEFAULT_AUTH_ORIGIN = 'http://13.201.234.55:8080'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request)
    }

    const origin = env.AUTH_ORIGIN ?? DEFAULT_AUTH_ORIGIN
    const target = new URL(url.pathname + url.search, origin)

    /*
     * The request is forwarded whole: method, headers, body. The headers matter
     * as much as the body here — `X-Tq-Csrf` is what makes a write legal, and
     * `Cookie` carries both the CSRF token and the session, neither of which
     * the service can identify the caller without.
     *
     * `redirect: 'manual'` so a redirect from the service is handed back to the
     * browser as-is rather than being followed here, where the browser's
     * cookies for the hop would not apply.
     */
    const upstream = new Request(target.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'manual',
    })

    let response: Response
    try {
      response = await fetch(upstream)
    } catch {
      /*
       * The service is unreachable. Answered in authService's own envelope so
       * the client's existing error handling applies unchanged — it branches on
       * error.code, and UPSTREAM_UNAVAILABLE already means "no code was sent,
       * offer a retry". A bare 502 would reach the client as an unparseable
       * body instead.
       */
      return Response.json(
        { ok: false, error: { code: 'UPSTREAM_UNAVAILABLE' } },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    /*
     * Set-Cookie is passed through untouched, and that is the point of the
     * proxy: the service sets `tq_csrf` host-only with no Domain, so the
     * browser attributes it to THIS origin, which is what finally makes it
     * readable by script and sendable on same-site requests.
     *
     * `no-store` because an authentication response must never be held by a
     * cache — not the edge's, not the browser's. Cloudflare would not normally
     * cache a POST, but /session and /config are GETs whose answers are
     * per-visitor.
     */
    const headers = new Headers(response.headers)
    headers.set('Cache-Control', 'no-store')

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
} satisfies ExportedHandler<Env>
