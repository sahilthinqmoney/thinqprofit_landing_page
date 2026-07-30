/**
 * §5 Products — copy source: docs/landing-page-copy.md §5.1–§5.8.
 * Icons: design-system/thinqprofit/pages/landing.md §8 — Products row.
 *
 * Marketing prose here is tightened against the deck rather than transcribed
 * from it: the deck writes long, and a product row that needs three clauses to
 * say what it is has not said it. `title` and `body` are ordinary product copy
 * and stay short — one sentence, the noun first.
 *
 * What is NOT editable:
 *
 *  - every [SQUARE BRACKET] — an unverified compliance placeholder. Do not
 *    fill, paraphrase or delete them. Trimming the prose *around* a placeholder
 *    is fine; the token itself is not copy.
 *  - every `disclosure` string — risk warnings and registration numbers, live
 *    regulatory text, carried verbatim.
 *
 * `CopyText` is not the line between those two. It is a renderer: it tokenizes
 * any deck string so the placeholders inside it are flagged in warning colour,
 * and being wrapped in it says nothing about whether a string is compliance-
 * bearing. The disclosures and the brackets are the guard.
 */
import type { Product } from '../types'

/** Section header block — copy deck §5. There is no eyebrow; see DESIGN.md §3. */
export interface ProductsSectionCopy {
  heading: string
  subheading: string
}

export const productsSection: ProductsSectionCopy = {
  heading: 'One account, every Indian market',
  subheading: 'Equity, derivatives, commodities and funds in one portfolio view.',
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

export const products: Product[] = [
  {
    id: 'stocks-etfs',
    title: 'Stocks & ETFs',
    body: 'Every NSE and BSE listing, plus index ETFs, held in your own demat account.',
    bullets: [
      'Delivery and intraday on one screen',
      'Fundamentals, filings and results',
      'SIPs on eligible ETFs',
    ],
    cta: 'Explore stocks',
    href: '#',
    icon: 'trending-up',
  },
  {
    id: 'futures-options',
    title: 'Futures & Options',
    body: 'Full option chain, live Greeks, and a payoff builder that shows the position before you place it.',
    bullets: [
      'Index and stock derivatives',
      'Multi-leg baskets as one order',
      'SPAN and exposure margin calculator',
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
    body: 'Direct plans only — no distributor commission built into your NAV.',
    bullets: [
      'SIPs from [₹AMOUNT] a month',
      'Switch, pause or step up',
      'Holdings alongside your stocks',
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
    body: 'Mainboard and SME issues over UPI; funds stay blocked in your bank account until allotment.',
    bullets: ['Live and upcoming issues', 'Pre-filled applications', 'Allotment status in-app'],
    cta: 'See open IPOs',
    href: '#',
    icon: 'rocket',
  },
  {
    id: 'commodities',
    title: 'Commodities',
    body: 'Gold, silver, crude, natural gas and agri contracts on MCX.',
    bullets: [
      'MCX futures and options',
      'Evening session support',
      'Contract specs and expiry calendar',
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
    bullets: ['Hedge or trade the pair', 'Same order types as equity F&O'],
    cta: 'Explore currency',
    href: '#',
    icon: 'banknote',
  },
  {
    id: 'bonds-gsecs',
    title: 'Bonds & G-Secs',
    body: 'Government securities, T-Bills, SDLs and corporate bonds.',
    bullets: ['Yield and maturity up front', 'Interest and redemption tracked'],
    cta: 'Explore bonds',
    href: '#',
    icon: 'landmark',
  },
  {
    id: 'baskets',
    title: 'Baskets',
    body: 'Thematic sets of stocks and ETFs you buy, rebalance or exit in one order.',
    bullets: ['Weightings and rationale up front', 'One-tap rebalance', 'SIP into a basket'],
    cta: 'Explore baskets',
    href: '#',
    icon: 'boxes',
    disclosure:
      'Baskets are not advisory recommendations unless explicitly marked as such and issued under our Research Analyst registration [INH000XXXXXX].',
  },
]
