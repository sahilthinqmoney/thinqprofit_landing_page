/**
 * Navigation content.
 *
 * ── There is nothing to navigate between ───────────────────────────────────
 *
 * The header carried two three-column mega-menus — Products and Platform,
 * eighteen destinations — and every one of them pointed at `#products` or
 * `#platform`, two anchors that no longer exist on this page. A mega-menu whose
 * eighteen links all scroll to the same place is a decoration that costs a
 * keyboard user eighteen tab stops.
 *
 * The deeper reason is what the page now is. A waitlist page has one action, and
 * navigation exists to help a reader choose between destinations. There are no
 * destinations: there is one scroll, four sections long, ending in a form. So
 * the bar is the mark and the action, which is the whole of what a reader can do
 * here.
 *
 * `megaMenus`, `directLinks` and `mobileOrder` used to be exported as empty
 * arrays so `Navbar` could keep mapping over them. They are gone with the
 * machinery that read them: three empty arrays feeding 750 lines of unreachable
 * menu is not a feature in waiting, and the menu is recoverable from this file's
 * history if a second destination ever arrives.
 */

export const wordmark = 'Thinq'

/** Alt text for the logo lockup. */
export const wordmarkAlt = 'Thinq home'

export const signupLabel = 'Join the waitlist'
