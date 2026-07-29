/**
 * §5 Products — copy source: docs/landing-page-copy.md §5.1–§5.8 (verbatim).
 * Icons: design-system/thinqprofit/pages/landing.md §8 — Products row.
 *
 * Every [SQUARE BRACKET] below is a deliberate placeholder for compliance.
 * Do not fill, paraphrase or delete them here.
 */
import type { Product } from '../types'

/** Section header block — copy deck §5. */
export interface ProductsSectionCopy {
  eyebrow: string
  heading: string
  subheading: string
}

export const productsSection: ProductsSectionCopy = {
  eyebrow: 'What you can trade',
  heading: 'One account, every Indian market',
  subheading:
    'Equity, derivatives, commodities and funds — settled into a single portfolio view, so you always know what you actually own.',
}

/**
 * The two cards that carry the grid's visual weight: the widest segment
 * (Stocks & ETFs) and the one with a mandatory risk disclosure (F&O).
 * They must stay at indices 0 and 1 — the reveal stagger assumes it.
 */
export const featuredProductIds: readonly string[] = ['stocks-etfs', 'futures-options']

/**
 * Disclosures that must render with the warning treatment (Disclosure tone="risk").
 * The F&O derivatives disclosure is legally required on the card — never truncate it,
 * never hide it behind a hover or a "read more".
 */
export const riskDisclosureIds: readonly string[] = ['futures-options']

/**
 * Double-width tiles on the wide (xl) four-column bento: the two lead cards plus
 * the two remaining disclosure carriers, i.e. every card that has to hold a
 * disclosure block as well as three bullets.
 *
 * The spans pack to exact rows of four in the order `products` is declared —
 * `2+2 / 2+1+1 / 1+1+2` — and to exact rows of six at `lg` (`3+3 / 2+2+2 /
 * 2+2+2`). Reordering the array or this list leaves a hole in the grid.
 */
export const wideTileIds: readonly string[] = [
  'stocks-etfs',
  'futures-options',
  'mutual-funds',
  'baskets',
]

export const products: Product[] = [
  {
    id: 'stocks-etfs',
    title: 'Stocks & ETFs',
    body: 'Buy and hold across NSE and BSE, from blue chips to small caps. Shares land in your demat account; ETFs give you an index in one line item.',
    bullets: [
      'Delivery and intraday from the same screen',
      'Company fundamentals, filings and results in-app',
      'Fractional-friendly SIPs on eligible ETFs',
    ],
    cta: 'Explore stocks',
    href: '#',
    icon: 'trending-up',
  },
  {
    id: 'futures-options',
    title: 'Futures & Options',
    body: 'A full option chain with live Greeks, open interest and implied volatility, plus a payoff builder that shows you the shape of a position before you place it.',
    bullets: [
      'Index and stock derivatives across NSE segments',
      'Multi-leg baskets placed as a single order',
      'Margin calculator with SPAN and exposure breakdown',
    ],
    cta: 'Explore F&O',
    href: '#',
    icon: 'layers',
    disclosure:
      'Derivatives carry a high risk of loss. SEBI studies have found that a large majority of individual traders in the equity F&O segment incur net losses. [Insert the current SEBI-published figure and study reference — verify before publishing.]',
  },
  {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    body: 'Direct plans only. No distributor commission is built into your NAV, which is the entire point.',
    bullets: [
      'Start an SIP from [₹AMOUNT] a month',
      'Switch, pause or step up without paperwork',
      'Consolidated holdings alongside your stocks',
    ],
    cta: 'Explore mutual funds',
    href: '#',
    icon: 'pie-chart',
    disclosure:
      'Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.',
  },
  {
    id: 'ipo',
    title: 'IPO',
    body: 'Apply to mainboard and SME issues with UPI. Funds stay blocked in your bank account until allotment — they never sit with us.',
    bullets: [
      'Live and upcoming issue calendar',
      'Pre-filled applications from your existing details',
      'Allotment status without leaving the app',
    ],
    cta: 'See open IPOs',
    href: '#',
    icon: 'rocket',
  },
  {
    id: 'commodities',
    title: 'Commodities',
    body: 'Trade gold, silver, crude oil, natural gas and agri contracts on MCX, with position and margin tracking that matches your equity view.',
    bullets: [
      'Full MCX futures and options coverage',
      'Evening session support',
      'Contract specs and expiry calendar built in',
    ],
    cta: 'Explore commodities',
    href: '#',
    icon: 'gem',
  },
  {
    // Copy deck §5.6 carries an internal build note, not display copy:
    // "Note for compliance: confirm eligibility and underlying-exposure
    // requirements before this section goes live." Kept here so it is not lost.
    id: 'currency',
    title: 'Currency',
    body: 'USDINR, EURINR, GBPINR and JPYINR derivatives on the NSE currency segment.',
    bullets: ['Hedge exposure or trade the pair directly', 'Same order types as equity F&O'],
    cta: 'Explore currency',
    href: '#',
    icon: 'banknote',
  },
  {
    id: 'bonds-gsecs',
    title: 'Bonds & G-Secs',
    body: "Government securities, T-Bills, SDLs and corporate bonds — the part of a portfolio that isn't supposed to be exciting.",
    bullets: [
      'Yield and maturity shown before you commit',
      'Interest and redemption tracked automatically',
    ],
    cta: 'Explore bonds',
    href: '#',
    icon: 'landmark',
  },
  {
    id: 'baskets',
    title: 'Baskets',
    body: 'Thematic sets of stocks and ETFs you can buy, rebalance or exit in a single order, instead of managing twelve tickers by hand.',
    bullets: [
      'Weightings and rationale shown up front',
      'One-tap rebalance when the basket updates',
      'SIP into a basket, not just a fund',
    ],
    cta: 'Explore baskets',
    href: '#',
    icon: 'boxes',
    disclosure:
      'Baskets are not advisory recommendations unless explicitly marked as such and issued under our Research Analyst registration [INH000XXXXXX].',
  },
]
