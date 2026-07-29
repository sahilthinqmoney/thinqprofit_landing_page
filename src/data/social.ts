/**
 * Social proof content — copy deck §12 (Testimonials) and §13 (Stats band).
 *
 * COMPLIANCE NOTES, carried over from docs/landing-page-copy.md:
 *  - §13: publish only numbers you can substantiate on request. Delete any row
 *    you cannot evidence — an unverifiable stat is worse than a missing one.
 *  - §12: every quote below is a placeholder written to show tone and length.
 *    Replace with real, consented, verifiable customer quotes. Do not publish
 *    invented testimonials, and do not publish any quote that states or implies
 *    a return figure — SEBI advertising rules and consumer protection law both
 *    apply.
 *
 * Every [SQUARE BRACKET] value is a deliberate TODO. Do not invent a number.
 * `id` is a stable slug taken from the subject of the quote, so the React key
 * survives reordering and survives the swap to a real consented attribution.
 */

import type { Stat, Testimonial } from '../types'

/* -------------------------------------------------------------------------- */
/* §13 Stats band                                                             */
/* -------------------------------------------------------------------------- */

export const stats: Stat[] = [
  { value: '[X lakh+]', label: 'Accounts opened' },
  { value: '[₹X crore+]', label: 'Daily turnover' },
  { value: '[X ms]', label: 'Median order placement' },
  { value: '[X.X/5]', label: 'Average app rating' },
  { value: '[99.X%]', label: 'Platform uptime, last 12 months' },
]

/* -------------------------------------------------------------------------- */
/* §12 Testimonials                                                           */
/* -------------------------------------------------------------------------- */

export const testimonials: Testimonial[] = [
  {
    id: 'contract-note',
    quote:
      "I moved over because I was tired of guessing what a trade would cost. The contract note now matches the number the app showed me.",
    name: '[Name]',
    city: '[City]',
    meta: 'Investing since [YEAR]',
  },
  {
    id: 'option-chain',
    quote:
      "The option chain loads before I've finished deciding. That sounds small until you've used something that doesn't.",
    name: '[Name]',
    city: '[City]',
    meta: 'F&O trader',
  },
  {
    id: 'tax-report',
    quote:
      "I opened the account for the direct mutual funds and stayed for the tax report. Filing took an evening instead of a weekend.",
    name: '[Name]',
    city: '[City]',
    meta: 'SIP investor',
  },
]

/** Required line under the testimonial block. Do not omit. */
export const testimonialDisclaimer: string =
  'Individual experiences vary. Testimonials are not indicative of future performance or of any specific outcome.'
