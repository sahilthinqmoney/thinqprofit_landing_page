/**
 * Google Analytics 4, via the official gtag.js tag.
 *
 * Deliberately the whole implementation: one module, two exported functions, no
 * npm package. `react-ga4` and friends wrap the same three lines of dataLayer
 * bookkeeping that appear below and add a dependency to keep current, and the
 * tag itself is a documented, stable interface. This file can be deleted and
 * its two call sites removed to take analytics out entirely.
 *
 * ── Why the tag is not in index.html ───────────────────────────────────────
 *
 * The copy-paste snippet Google gives you goes in <head>. It is not used here
 * for two reasons. The measurement ID would be hardcoded into markup rather
 * than following this project's existing `import.meta.env.VITE_*` convention
 * (authService.ts does the same thing for its base URL), and the page-view side
 * needs to coordinate with App.tsx's routing anyway — see below. Loading the
 * script from here keeps both halves in one place.
 */

/**
 * The property this page reports to.
 *
 * A GA4 measurement ID is not a secret: it is visible in the network tab of
 * every browser that loads the page, and it authorises nothing. The env var is
 * here to let a staging build point somewhere else, not to hide anything, and
 * the default is the real ID so a build with no environment configured still
 * measures rather than silently going dark.
 */
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? 'G-WLSFSXZLEK'

const TAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`

type GtagArgs = [command: string, ...rest: unknown[]]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: GtagArgs) => void
  }
}

/**
 * Guards against a second initialisation.
 *
 * Module scope, not component state: this survives re-renders, StrictMode's
 * double-invoked effects in development, and any future second call site. A
 * second `gtag('config')` for the same property is not harmless — it re-arms
 * the tag and is the usual cause of doubled sessions.
 */
let initialised = false

/**
 * The last URL reported, so the same one is never reported twice in a row.
 *
 * This is load-bearing rather than defensive. On /terms the app mounts with
 * `route` at its initial 'home' and an effect immediately corrects it to
 * 'terms', so the route effect fires twice against one URL — see App.tsx, where
 * the initial state is deliberately 'home' on every path to keep the first
 * client render matching the prerendered HTML. Without this, every arrival on
 * /terms would be counted as two page views. It also absorbs StrictMode's
 * double-invoked effects in development.
 *
 * Two DIFFERENT URLs in sequence always report, so a reader moving between
 * pages is never under-counted; only an immediate repeat of the identical URL
 * is dropped.
 */
let lastTrackedUrl: string | undefined

function gtag(...args: GtagArgs): void {
  window.dataLayer?.push(args)
}

/**
 * The URL to report, with the query string removed.
 *
 * Nothing on this site routes on a query parameter, so dropping the search
 * removes only noise — but it also means a link someone forwards with a
 * tracking or identifying parameter on it cannot carry that parameter into
 * analytics. The hash is kept: the footer links to /terms#privacy and friends,
 * and which section a reader opened is ordinary page-level information.
 */
function currentPage(): { path: string; location: string } {
  const { origin, pathname, hash } = window.location
  const path = `${pathname}${hash}`
  return { path, location: `${origin}${path}` }
}

/**
 * Loads gtag.js and configures the property. Safe to call more than once.
 *
 * `send_page_view: false` is the one departure from the stock snippet. By
 * default `config` fires a page view immediately, which would race the first
 * `trackPageView()` below and double-count every arrival. Suppressing it makes
 * this module the single source of page views — the initial one included —
 * which is what keeps the count honest across client-side navigation.
 */
export function initAnalytics(): void {
  if (initialised || typeof window === 'undefined') return
  initialised = true

  window.dataLayer = window.dataLayer ?? []
  window.gtag = gtag

  /*
   * `async`, so this never blocks parsing or the first paint. It is still a
   * third-party request competing for bandwidth with the hero, which is why it
   * is not `defer`red further: analytics that loads after the reader has left
   * measures nothing, and `async` is the balance the official tag strikes too.
   */
  const script = document.createElement('script')
  script.async = true
  script.src = TAG_SRC
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', MEASUREMENT_ID, { send_page_view: false })
}

/**
 * Reports one page view for the URL currently in the address bar.
 *
 * Called from App.tsx whenever `route` changes, which covers both the initial
 * load and the client-side transitions that produce no new document — pressing
 * Back after following /terms is the common one, and gtag.js cannot see that on
 * its own because no navigation occurs.
 *
 * Only page-level fields are sent. No form values, no phone number, no session
 * or OTP state: nothing this function can reach contains any of them, and
 * nothing should be added here that does.
 */
export function trackPageView(): void {
  if (!initialised || typeof window === 'undefined') return

  const { path, location } = currentPage()
  if (location === lastTrackedUrl) return
  lastTrackedUrl = location

  gtag('event', 'page_view', {
    page_path: path,
    page_location: location,
    page_title: document.title,
  })
}
