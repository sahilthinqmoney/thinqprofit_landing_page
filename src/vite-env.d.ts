/// <reference types="vite/client" />

/**
 * Build-time configuration.
 *
 * `VITE_AUTH_BASE_URL` overrides where authService is reached, and PRODUCTION
 * MUST LEAVE IT UNSET. The default in src/lib/authService.ts is the relative
 * `/api/auth/v1`, which is the only arrangement that works: `tq_csrf` is set
 * host-only, so a page can read the token it has to echo in `X-Tq-Csrf` only
 * when the service answers on the origin serving that page.
 *
 * This comment previously said the opposite — that every environment but local
 * development had to set it. Following that produced a build pointing at
 * https://api.thinq.co, a token the page could not read, and a waitlist where
 * every submission was refused. See DEPLOY.md.
 *
 * Use it to aim a LOCAL build at a remote service, from `.env.local`, and only
 * where that service's CORS allowlist admits the origin — the calls send
 * credentials, which a wildcard origin cannot satisfy.
 */
interface ImportMetaEnv {
  readonly VITE_AUTH_BASE_URL?: string
  /**
   * Overrides the GA4 property this page reports to. Optional: src/lib/analytics.ts
   * defaults to the production measurement ID, so an unconfigured build still
   * measures. Not a secret — it is readable in the page's own network requests.
   */
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * The year the bundle was built, substituted by `define` in vite.config.ts.
 * Constant across the prerender and the browser, which is the point of it.
 */
declare const __BUILD_YEAR__: number

/**
 * hls.js publishes types for `hls.js` but not for its `./light` subpath, which
 * is the same API with the subtitle, alternate-audio and DRM controllers left
 * out. Re-exporting the main package's types keeps the call site fully typed
 * rather than pushing it through `any`.
 */
declare module 'hls.js/light' {
  export * from 'hls.js'
  export { default } from 'hls.js'
}
