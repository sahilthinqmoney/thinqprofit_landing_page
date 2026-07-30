/**
 * Navigation content (§2). Copy source: docs/landing-page-copy.md — verbatim,
 * including [PLACEHOLDERS].
 *
 * The announcement bar (§1) and its three copy variants are gone with the
 * component: a dismissable strip above the nav is a fourth message competing
 * with the headline before the reader has had the first.
 */
import type { MegaMenu, MenuColumn, NavItem } from '../types'

export const wordmark = 'ThinqProfit'
/** Deck §2.1 — alt text for the logo lockup. */
export const wordmarkAlt = 'ThinqProfit home'

/** Footer strip under an open mega-menu (deck §2.3). */
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
 *
 * `wide` marks the three-column panels. They track the container width but stop
 * at a ceiling set in `Navbar` — past ~1200px three columns of short links stop
 * looking like a menu and start looking like an empty shelf. Single-column
 * panels (`wide: false`) are sized to their own content and anchored to their
 * trigger instead.
 */
export interface NavMegaMenu extends Omit<MegaMenu, 'footer'> {
  id: string
  columns: MenuColumn[]
  wide: boolean
  footer?: MenuFooter
}

/**
 * Two menus, three links each.
 *
 * Both panels used to run twelve items, and a third menu (Learn) carried five
 * more — twenty-nine destinations in a header for a page with seven sections.
 * A mega-menu that lists everything is a sitemap wearing a nav's costume. Each
 * column now names the three things a visitor picks a broker over; the rest are
 * still reachable from the footer, which is where an exhaustive list belongs.
 *
 * The Products panel's footer strip is gone with it — it pointed at a Learn hub
 * that no longer has a section on this page.
 */
export const megaMenus: NavMegaMenu[] = [
  {
    id: 'products',
    label: 'Products',
    wide: true,
    columns: [
      {
        heading: 'Invest',
        items: [
          {
            label: 'Stocks & ETFs',
            href: '#products',
            icon: 'TrendingUp',
          },
          {
            label: 'Mutual Funds',
            href: '#products',
            icon: 'ChartPie',
          },
          {
            label: 'IPO',
            href: '#products',
            icon: 'Rocket',
          },
        ],
      },
      {
        heading: 'Trade',
        items: [
          {
            label: 'Futures & Options',
            href: '#products',
            icon: 'ChartCandlestick',
          },
          {
            label: 'Intraday',
            href: '#products',
            icon: 'Timer',
          },
          {
            label: 'Commodities',
            href: '#products',
            icon: 'Gem',
          },
        ],
      },
      {
        heading: 'Grow',
        items: [
          {
            label: 'MTF',
            href: '#products',
            icon: 'Scale',
          },
          {
            label: 'Baskets',
            href: '#products',
            icon: 'Boxes',
          },
          {
            label: 'SIP',
            href: '#products',
            icon: 'Repeat',
          },
        ],
      },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    wide: true,
    columns: [
      {
        heading: 'Apps',
        items: [
          {
            label: 'ThinqProfit Mobile',
            href: '#platform',
            icon: 'Smartphone',
          },
          {
            label: 'ThinqProfit Web',
            href: '#platform',
            icon: 'Globe',
          },
          {
            label: 'ThinqProfit Pro',
            href: '#platform',
            icon: 'LayoutGrid',
          },
        ],
      },
      {
        heading: 'Tools',
        items: [
          {
            label: 'Charts',
            href: '#platform',
            icon: 'ChartCandlestick',
          },
          {
            label: 'Option Chain',
            href: '#platform',
            icon: 'Table2',
          },
          {
            label: 'Alerts',
            href: '#platform',
            icon: 'Bell',
          },
        ],
      },
      {
        heading: 'Build',
        items: [
          {
            label: 'API',
            href: '#platform',
            icon: 'Code',
          },
          {
            label: 'Strategy Builder',
            href: '#platform',
            icon: 'GitBranch',
          },
          {
            label: 'Paper Trading',
            href: '#platform',
            icon: 'FlaskConical',
          },
        ],
      },
    ],
  },
]

/**
 * Deck §2.2 — top-level entries that are plain links, not mega-menus.
 *
 * Empty, and both entries went for the same reason: a nav link to an anchor that
 * no longer exists is worse than no link. Support went with the Support section;
 * Pricing went with the Pricing section, which was removed because every rate in
 * it was still an unfilled placeholder.
 *
 * Kept as an exported empty array rather than deleted — `Navbar` maps over it in
 * two places, and a third top-level link is the likeliest next nav change.
 */
export const directLinks: NavItem[] = []

/** Deck §18.5 — canonical button labels. */
export const loginLabel = 'Log in'
export const signupLabel = 'Open free account'

/** Mobile sheet order — the three top-level entries, in header order. */
export const mobileOrder: string[] = ['Products', 'Platform', 'Pricing']
