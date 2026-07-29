/**
 * §7 Pricing — copy from docs/landing-page-copy.md §7, verbatim.
 *
 * EVERY [SQUARE BRACKET] BELOW IS A DELIBERATE PLACEHOLDER. Do not fill these in
 * from memory or from a competitor's rate card. Under SEBI's true-to-label rules
 * the charges shown here must match what is actually levied, and exchange,
 * clearing and statutory charges must be passed through at actuals and shown
 * separately. Compliance signs off on this table verbatim before launch.
 */
import type { AccountCharge, BrokerageRow, Plan } from '../types'

export const pricingEyebrow = 'Pricing'
export const pricingHeading = 'Priced plainly, in advance'
export const pricingSubheading =
  'One rate card. No hidden platform fee, no charge for calling support, no surprise on the contract note.'

/** Column headers for the brokerage rate card. */
export const brokerageColumns = { segment: 'Segment', rate: 'Brokerage' } as const

export const brokerage: BrokerageRow[] = [
  { segment: 'Equity delivery', rate: '[₹0 / ₹X per order]' },
  { segment: 'Equity intraday', rate: '[₹X or Y% per executed order, whichever is lower]' },
  { segment: 'Equity F&O', rate: '[₹X per executed order]' },
  { segment: 'Currency F&O', rate: '[₹X per executed order]' },
  { segment: 'Commodity F&O', rate: '[₹X per executed order]' },
  { segment: 'Mutual funds (direct)', rate: '[₹0]' },
  { segment: 'IPO application', rate: '[₹0]' },
  { segment: 'Bonds & G-Secs', rate: '[₹X]' },
]

/**
 * Always-visible line under the brokerage table. Never collapse or hide this.
 * The deck's inline `[full rate card](#)` link markup is preserved verbatim and
 * rendered through `CopyText`, so the link stays inside the sentence.
 */
export const statutoryLine =
  'Plus statutory and exchange charges at actuals — STT/CTT, exchange transaction charges, SEBI turnover fees, stamp duty and GST. See the [full rate card](#) for the complete breakdown.'

/** Column headers for the account charges table. */
export const accountChargeColumns = { item: 'Item', amount: 'Amount' } as const

export const accountChargesHeading = 'Account charges'

export const accountCharges: AccountCharge[] = [
  { item: 'Account opening', amount: '[₹0]' },
  { item: 'Annual demat maintenance (AMC)', amount: '[₹X per year]' },
  { item: 'Call & Trade', amount: '[₹X per order]' },
  { item: 'Auto square-off (intraday)', amount: '[₹X per order]' },
  { item: 'Physical statement request', amount: '[₹X]' },
]

export const plansHeading = 'Plan tiers'

/**
 * No "Most popular" badge. Deck §7 gives each tier a name, price, blurb and
 * feature list and nothing else; a popularity claim is a statistic, and §13
 * allows only numbers we can substantiate on request.
 */
export const plans: Plan[] = [
  {
    name: 'Basic',
    price: '[₹0]',
    cadence: '',
    blurb: 'For investors who buy and hold.',
    features: [
      'Equity delivery and mutual funds',
      'Charts, screeners and alerts',
      'Standard support',
    ],
    cta: 'Open free account',
    highlighted: false,
  },
  {
    name: 'Active',
    price: '[₹X/month]',
    cadence: '',
    blurb: 'For traders who are in the market most days.',
    features: [
      'Everything in Basic',
      'Advanced option chain and strategy builder',
      'Priority support queue',
      '[N] free GTT orders per month',
    ],
    cta: 'Open free account',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '[₹X/month]',
    cadence: '',
    blurb: 'For high-frequency and systematic traders.',
    features: [
      'Everything in Active',
      'API access with higher rate limits',
      'Multi-chart desktop terminal',
      'Dedicated relationship manager',
    ],
    cta: 'Open free account',
    highlighted: false,
  },
]

export const finePrint =
  'Charges are subject to change with prior notice as required by exchange and SEBI regulations.'
