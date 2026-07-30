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

/**
 * Four, not seven.
 *
 * Commodities, Currency and Baskets are real segments and are still one click
 * away in the nav and the footer — but a landing page is not a catalogue, and a
 * reader deciding whether to trust a broker with a PAN is not choosing between
 * seven asset classes. What is left is the two that carry the business and the
 * two that most first accounts are opened for.
 */
export const products: Product[] = [
  {
    id: 'stocks-etfs',
    title: 'Stocks & ETFs',
    body: 'Every NSE and BSE listing, plus index ETFs, held in your own demat account.',
    cta: 'Explore stocks',
    href: '#',
    icon: 'trending-up',
  },
  {
    id: 'futures-options',
    title: 'Futures & Options',
    body: 'Full option chain, live Greeks, and a payoff builder that shows the position before you place it.',
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
    cta: 'See open IPOs',
    href: '#',
    icon: 'rocket',
  },
]
