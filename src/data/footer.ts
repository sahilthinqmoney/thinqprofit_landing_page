import type { RegistrationLine } from '../types'

/**
 * §7 Close + §8 Footer and legal.
 *
 * Every [SQUARE BRACKET] below is an unfilled compliance placeholder and renders
 * visibly flagged through `CopyText`. The instruction that governs them has not
 * changed and is worth restating in full, because it is the one rule in this
 * repo with a legal consequence attached:
 *
 *   Publishing a broker landing page with invented SEBI or exchange
 *   registration numbers is a regulatory offence, not a typo.
 *
 * Do not fill these from imagination, from a competitor's footer, or from an
 * older draft. Compliance supplies the verified values. Every one of them is a
 * blocking item in docs/go-live-checklist.md.
 */

export const tagline = 'It’s your money. Don’t give it away.'

export const registrationLines: RegistrationLine[] = [
  { label: 'Entity', value: '[Legal entity] Private Limited' },
  { label: 'SEBI Registration', value: '[INZ000000000]' },
  { label: 'Exchanges', value: 'Member: NSE, BSE' },
  { label: 'Registered office', value: '[address]' },
  { label: 'Compliance Officer', value: '[name, email, phone]' },
  { label: 'Investor Grievances', value: '[email]' },
]

export const scoresLink = {
  before: 'Unresolved complaints can be escalated to SEBI through ',
  linkLabel: 'SCORES',
  href: 'https://scores.sebi.gov.in',
  after: ', the regulator’s online complaint redressal system.',
}

export interface StatutoryDisclosure {
  id: string
  title: string
  body: string
  tone: 'risk' | 'note'
}

export const statutoryDisclosures: StatutoryDisclosure[] = [
  {
    id: 'brokerage-scope',
    title: 'Zero Brokerage Scope',
    body: 'Six months at zero brokerage covers Thinq\'s own brokerage only. Securities Transaction Tax, exchange transaction charges, SEBI turnover fee, GST and stamp duty apply on every trade, are not ours to waive, and are itemised on your contract note.',
    tone: 'note',
  },
  {
    id: 'indicative-figures',
    title: 'Indicative Figures & Non-Advisory',
    body: 'Levels, annotations and position figures shown in the product are computed from live market data and are indicative; figures shown on this page are illustrative. Nothing on this page or in the product is a recommendation to buy or sell any security. Thinq does not provide investment advice or research services.',
    tone: 'note',
  },
  {
    id: 'algo-latency',
    title: 'Order Routing & Framework',
    body: 'Order routing and latency depend on exchange systems and connectivity. Agentic features are subject to SEBI\'s framework for retail algorithmic trading and to exchange approval.',
    tone: 'note',
  },
  {
    id: 'derivatives-risk',
    title: 'Derivatives Risk Disclosure',
    body: '[Prescribed derivatives risk disclosure — exchange-approved wording, verbatim, at required prominence]',
    tone: 'risk',
  },
  {
    id: 'market-risk',
    title: 'Market Risk',
    body: 'Investments in the securities market are subject to market risks; read all the related documents carefully before investing.',
    tone: 'note',
  },
]

/* -------------------------------------------------------------------------- */
/* §8.4 Bottom bar                                                            */
/* -------------------------------------------------------------------------- */

/** Year is computed at render; the entity name stays a placeholder. */
export const copyrightEntity = 'Thinq'
export const copyrightSuffix = 'All rights reserved.'

/*
 * `bottomBarLinks` — Terms, Privacy, Risk disclosure — is gone, and it is the
 * same argument the deleted link columns lost: all three pointed at `#`.
 *
 * The claim that they are "documents a waitlist member is entitled to read
 * before joining" is true, and it is the reason they cannot ship as dead
 * anchors. Restore this export the day the three documents have URLs; until
 * then the bottom bar is the copyright line and nothing else.
 */
