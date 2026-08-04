/**
 * Navigation content.
 *
 * ── Both mega-menus are gone, and this is the second time this file has been
 *    cut for the same reason ────────────────────────────────────────────────
 *
 * The header carried two three-column panels — Products and Platform, eighteen
 * destinations — and every one of them pointed at `#products` or `#platform`,
 * two anchors that no longer exist on this page. A mega-menu whose eighteen
 * links all scroll to the same place is a decoration that costs a keyboard user
 * eighteen tab stops.
 *
 * The deeper reason is what the page now is. A waitlist page has one action, and
 * navigation exists to help a reader choose between destinations. There are no
 * destinations: there is one scroll, four sections long, ending in a form. So
 * the nav is three anchors into that scroll and the action, which is the whole
 * of what a reader can do here.
 *
 * `megaMenus` stays exported as an empty array rather than being deleted.
 * `Navbar` maps over it in three places (desktop bar, mobile sheet entries, the
 * accordion), and its `NavMegaMenu` type is what those maps are typed against —
 * removing the export would mean deleting working, tested menu machinery that
 * becomes correct again the moment this page grows a second destination.
 */
import type { MegaMenu, MenuColumn, NavItem } from '../types'

export const wordmark = 'Thinq'
/** Alt text for the logo lockup. */
export const wordmarkAlt = 'Thinq home'

/** Footer strip under an open mega-menu. */
export interface MenuFooter {
  text: string
  linkLabel: string
  href: string
  /** Copy that follows the inline link. */
  trailing?: string
}

/**
 * Local extension of `MegaMenu`: adds a stable `id` for ARIA wiring, a `wide`
 * flag, and a footer that can carry copy after the link.
 */
export interface NavMegaMenu extends Omit<MegaMenu, 'footer'> {
  id: string
  columns: MenuColumn[]
  wide: boolean
  footer?: MenuFooter
}

/** See the header note. Empty by design, not by accident. */
export const megaMenus: NavMegaMenu[] = []

/**
 * Three anchors, in scroll order, and each one names a question rather than a
 * category. "The offer" is a thing a reader wants; "Pricing" is a page a company
 * has. The distinction is the whole reason these are not called Product,
 * Features and Pricing.
 *
 * §4 (the capability summary) is deliberately not in here. It is a list that
 * supports §3 rather than a section a reader would navigate TO, and a nav entry
 * for it would put four links in a bar that reads better with three.
 */
export const directLinks: NavItem[] = [
  { label: 'What you’re missing', href: '#missing' },
  { label: 'Security', href: '#security' },
  { label: 'The offer', href: '#offer' },
]

/**
 * The single action label, used by the desktop bar and the mobile sheet.
 *
 * `loginLabel` is deleted rather than emptied. There is nothing to log in to —
 * the product has not opened, which is the premise of the entire page — and a
 * "Log in" control beside a "Join the waitlist" button invites the reader to try
 * an account they cannot have. It was pointing at `#`.
 */
export const signupLabel = 'Join the waitlist'

/**
 * Mobile sheet order. Matches `directLinks` exactly: `Navbar` resolves each
 * label against `megaMenus` first and `directLinks` second, so with no menus
 * left these three resolve straight to links.
 */
export const mobileOrder: string[] = ['What you’re missing', 'Security', 'The offer']
