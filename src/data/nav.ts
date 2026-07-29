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
 * flag (three-column panels span the container, single-column panels don't),
 * and a footer that can carry copy after the link.
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
            description: 'Buy and hold from NSE and BSE',
            href: '#products',
            icon: 'TrendingUp',
          },
          {
            label: 'Mutual Funds',
            description: 'Direct plans, zero commission',
            href: '#products',
            icon: 'ChartPie',
          },
          {
            label: 'IPO',
            description: 'Apply with UPI in a few taps',
            href: '#products',
            icon: 'Rocket',
          },
          {
            label: 'Bonds & G-Secs',
            description: 'Fixed income for the boring part of your portfolio',
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
            description: 'Index and stock derivatives with a full option chain',
            href: '#products',
            icon: 'ChartCandlestick',
          },
          {
            label: 'Intraday',
            description: 'Same-day equity positions with MIS margins',
            href: '#products',
            icon: 'Timer',
          },
          {
            label: 'Commodities',
            description: 'Gold, silver, crude and more on MCX',
            href: '#products',
            icon: 'Gem',
          },
          {
            label: 'Currency',
            description: 'USDINR and major pairs on the NSE currency segment',
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
            description: 'Margin Trading Facility for delivery positions',
            href: '#products',
            icon: 'Scale',
          },
          {
            label: 'Baskets',
            description: 'Thematic portfolios you can buy in one order',
            href: '#products',
            icon: 'Boxes',
          },
          {
            label: 'SIP',
            description: 'Automate weekly or monthly investing',
            href: '#products',
            icon: 'Repeat',
          },
          {
            label: 'Referrals',
            description: 'Bring a friend, both of you benefit',
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
            description: 'iOS and Android',
            href: '#platform',
            icon: 'Smartphone',
          },
          {
            label: 'ThinqProfit Web',
            description: 'Full trading terminal in the browser',
            href: '#platform',
            icon: 'Globe',
          },
          {
            label: 'ThinqProfit Pro',
            description: 'Multi-chart desktop layout for active traders',
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
            description: '100+ indicators, drawing tools, saved layouts',
            href: '#platform',
            icon: 'ChartCandlestick',
          },
          {
            label: 'Option Chain',
            description: 'Live Greeks, OI, IV and payoff builder',
            href: '#platform',
            icon: 'Table2',
          },
          {
            label: 'Screeners',
            description: 'Filter the whole market on 60+ parameters',
            href: '#platform',
            icon: 'Filter',
          },
          {
            label: 'Alerts',
            description: 'Price, indicator and OI triggers on your phone',
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
            description: 'REST and WebSocket access for your own systems',
            href: '#platform',
            icon: 'Code',
          },
          {
            label: 'Strategy Builder',
            description: 'Construct and test multi-leg option strategies',
            href: '#platform',
            icon: 'GitBranch',
          },
          {
            label: 'Paper Trading',
            description: 'Practise with live data and no money at risk',
            href: '#platform',
            icon: 'FlaskConical',
          },
          {
            label: 'Reports',
            description: 'Tax P&L, capital gains, and ledger exports',
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
            description: 'Guided courses from first trade to F&O',
            href: '#learn',
            icon: 'GraduationCap',
          },
          {
            label: 'Market Digest',
            description: 'A five-minute read before the open',
            href: '#learn',
            icon: 'Newspaper',
          },
          {
            label: 'Glossary',
            description: 'Plain-language definitions, no jargon loops',
            href: '#learn',
            icon: 'BookOpen',
          },
          {
            label: 'Videos',
            description: 'Short walkthroughs of every screen in the app',
            href: '#learn',
            icon: 'CirclePlay',
          },
          {
            label: 'Calculators',
            description: 'Brokerage, margin, SIP and options payoff',
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
