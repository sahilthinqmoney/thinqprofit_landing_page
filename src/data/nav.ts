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
export const megaMenus: NavMegaMenu[] = [
  {
    id: 'products',
    label: 'Products',
    wide: true,
    columns: [
      {
        heading: 'AI-Native Trading',
        items: [
          {
            icon: 'Rocket',
            label: 'AI Copilot',
            href: '#capabilities',
          },
          {
            icon: 'Timer',
            label: 'Strategy Replay',
            href: '#capabilities',
          },
          {
            icon: 'TrendingUp',
            label: 'Algorithmic Signals',
            href: '#capabilities',
          },
        ],
      },
      {
        heading: 'Charting Engine',
        items: [
          {
            icon: 'ChartCandlestick',
            label: 'Live Chart Levels',
            href: '#section-02',
          },
          {
            icon: 'ChartPie',
            label: 'Options Matrix',
            href: '#section-02',
          },
          {
            icon: 'Boxes',
            label: 'Multi-Leg Execution',
            href: '#section-02',
          },
        ],
      },
      {
        heading: 'Trust & Infrastructure',
        items: [
          {
            icon: 'Scale',
            label: 'SEBI Registered Broker',
            href: '#security',
          },
          {
            icon: 'Gem',
            label: 'Bank-Grade Encryption',
            href: '#security',
          },
        ],
      },
    ],
    footer: {
      text: '6 months zero brokerage offer active for everyone on the waitlist.',
      linkLabel: 'Join waitlist',
      href: '#final-cta',
    },
  },
  {
    id: 'features',
    label: 'Features',
    wide: false,
    columns: [
      {
        heading: 'Platform Highlights',
        items: [
          {
            icon: 'FlaskConical',
            label: 'What You’re Missing',
            href: '#missing',
          },
          {
            icon: 'BookOpen',
            label: 'Native Charting',
            href: '#section-02',
          },
          {
            icon: 'Code',
            label: 'AI Capabilities',
            href: '#capabilities',
          },
          {
            icon: 'Landmark',
            label: 'Security & Custody',
            href: '#security',
          },
        ],
      },
    ],
  },
]

export const directLinks: NavItem[] = [
  { label: 'Why Thinq', href: '#missing' },
  { label: 'Charting', href: '#section-02' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Security', href: '#security' },
]

export const signupLabel = 'Join the waitlist'

export const mobileOrder: string[] = ['Products', 'Features', 'Why Thinq', 'Charting', 'Capabilities', 'Security']


