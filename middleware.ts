/**
 * Password gate for the whole site, run at the edge before anything is served.
 *
 * The page is pre-launch and still carries unfilled compliance placeholders —
 * `[Legal entity] Private Limited`, `[INZ000000000]` — and a waitlist form that
 * discards every number typed into it. See docs/go-live-checklist.md. None of
 * that should be reachable by a stranger who guesses the deployment URL, so
 * every request is challenged until the checklist is closed and this file is
 * deleted.
 *
 * Why this rather than Vercel's own Deployment Protection: on the Hobby plan,
 * Standard Protection leaves the production domain public, and locking that down
 * means Pro. Password Protection is a $150/month add-on. This runs on any plan
 * and covers the custom domain too.
 *
 * What it is NOT: this is a shared secret, so anyone let in can pass it on, and
 * revoking means rotating SITE_PASSWORD and locking out everyone at once. It is
 * enough to keep a half-finished broker page away from strangers and crawlers.
 * It is not enough to sit in front of anything holding customer data.
 *
 * ── Two constraints this file is written around ─────────────────────────────
 *
 * The first draft failed the Vercel build with `Unhandled type: "ColonToken"`
 * after the Vite build had already succeeded — thrown while compiling this file,
 * not the site. It carried return type annotations (`): Response | undefined {`)
 * and an `export const config` matcher, neither of which appears in any of
 * Vercel's own middleware examples. Both are gone: parameter annotations only,
 * which the documented examples do use, and no config export at all. Middleware
 * runs on every route by default, which is the matcher this needs anyway.
 *
 * Second: on non-Next.js projects, falling off the end of the function is not
 * how a request is passed through. `next()` from `@vercel/functions` is, and
 * returning nothing instead would have gated the site behind a blank response.
 */

import { next } from '@vercel/functions'

/** The username half is fixed; only the password is secret. */
const USER = 'thinq'

/**
 * Compares in time that does not depend on where the first difference falls.
 * A remote timing attack across the public internet against a header comparison
 * is close to theoretical, but the constant-time version is four lines.
 */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export default function middleware(request: Request) {
  /**
   * Read through `globalThis` rather than naming `process` directly.
   *
   * Vercel type-checks this file with its own tsconfig, not the project's —
   * middleware.ts sits outside `tsconfig.app.json`'s `include: ["src"]` — and
   * that config does not list `node` in `types`, so a bare `process` is
   * TS2591: "Cannot find name 'process'". The obvious patch, a local
   * `declare const process`, trades that for TS2451 on any build where the Node
   * types ARE in scope. Naming no global at the type level avoids both.
   *
   * The value is still read at build time, so a variable added in the dashboard
   * after this deployment was built is invisible to it until a redeploy.
   */
  const env = (globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> }
  }).process?.env

  const password = env?.SITE_PASSWORD

  /**
   * Fails closed, and says why. The alternative — serving the site when the
   * variable is missing — turns one forgotten setting in the Vercel dashboard
   * into a silently public pre-launch page, which is the exact thing this file
   * exists to prevent.
   */
  if (!password) {
    return new Response(
      'SITE_PASSWORD is not set on this deployment. Set it in Vercel > Settings > Environment Variables.',
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const header = request.headers.get('authorization') ?? ''
  const expected = `Basic ${btoa(`${USER}:${password}`)}`

  if (safeEqual(header, expected)) return next()

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Thinq pre-launch", charset="UTF-8"',
      /**
       * A 401 must never be cached: a shared cache holding it would keep
       * challenging a reader who has already authenticated.
       */
      'Cache-Control': 'no-store',
    },
  })
}
