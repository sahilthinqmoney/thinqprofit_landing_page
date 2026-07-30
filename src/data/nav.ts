/**
 * Announcement bar (§1) and navigation (§2) content.
 * Copy source: docs/landing-page-copy.md — verbatim, including [PLACEHOLDERS].
 */
import type { Announcement, MegaMenu, MenuColumn, NavItem } from '../types'

/* -------------------------------------------------------------------------- */
/* 1. Announcement bar                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Local extension of `Announcement`. Two of the three deck variants place the
 * link mid-sentence, so the shared shape (message + trailing link) cannot carry
 * the words that follow it. `trailing` holds those words so the line stays
 * verbatim. Still assignable to `Announcement[]`.
 */
export interface AnnouncementVariant extends Announcement {
  /** Copy that follows the inline link. */
  trailing?: string
  /** Render a lucide arrow after the link (deck variant A ends in "→"). */
  linkArrow?: boolean
}

export const announcements: AnnouncementVariant[] = [
  {
    id: 'promo',
    message: 'Account opening is free until [DATE].',
    linkLabel: 'Get started in under 10 minutes',
    href: '#onboarding',
    linkArrow: true,
  },
  {
    id: 'regulatory',
    message: 'Investor Charter and monthly complaint data are published in our',
    linkLabel: 'Investor Relations',
    href: '#',
    trailing: 'section.',
  },
  {
    id: 'launch',
    message: 'New: GTT orders are now live on stocks and F&O.',
    linkLabel: 'See what changed',
    href: '#',
  },
]

/** Deck §1 — dismiss label. */
export const dismissLabel = 'Close announcement'

/* -------------------------------------------------------------------------- */
/* 2. Navigation                                                              */
/* -------------------------------------------------------------------------- */

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
          {
            label: 'Bonds & G-Secs',
            href: '#products',
            icon: 'Landmark',
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
          {
            label: 'Currency',
            href: '#products',
            icon: 'Banknote',
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
          {
            label: 'Referrals',
            href: '#products',
            icon: 'UserPlus',
          },
        ],
      },
    ],
    footer: {
      text: 'New to markets? Start with',
      linkLabel: 'ThinqProfit Learn',
      href: '#learn',
      trailing: '— free, no account needed.',
    },
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
            label: 'Screeners',
            href: '#platform',
            icon: 'Filter',
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
          {
            label: 'Reports',
            href: '#platform',
            icon: 'FileText',
          },
        ],
      },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    wide: false,
    // The deck gives this menu a flat list with no column heading (§2.5).
    columns: [
      {
        heading: '',
        items: [
          {
            label: 'Learn Hub',
            href: '#learn',
            icon: 'GraduationCap',
          },
          {
            label: 'Market Digest',
            href: '#learn',
            icon: 'Newspaper',
          },
          {
            label: 'Glossary',
            href: '#learn',
            icon: 'BookOpen',
          },
          {
            label: 'Videos',
            href: '#learn',
            icon: 'CirclePlay',
          },
          {
            label: 'Calculators',
            href: '#learn',
            icon: 'Calculator',
          },
        ],
      },
    ],
  },
]

/** Deck §2.2 — top-level entries that are plain links, not mega-menus. */
export const directLinks: NavItem[] = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'Support', href: '#support' },
]

/** Deck §18.5 — canonical button labels. */
export const loginLabel = 'Log in'
export const signupLabel = 'Open free account'

/** Deck §2.6 — mobile sheet order: Products → Platform → Pricing → Learn → Support. */
export const mobileOrder: string[] = ['Products', 'Platform', 'Pricing', 'Learn', 'Support']
