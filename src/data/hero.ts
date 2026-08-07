import type { HeroContent } from '../types'

/**
 * §2 copy — the hero.
 *
 * The rule the section is built on: the hero STATES, it does not argue. A hero
 * that argues is one the reader has to evaluate; a hero that states gets scanned
 * and passed.
 *
 * Note that the offer line under the headline is NOT here — Hero.tsx renders it
 * as markup, because the emphasis on "6 Months" and "₹0 brokerage" needs spans a
 * plain string cannot carry. It lived here once, drifted out of sync, and was
 * removed rather than kept as a second place to be wrong.
 */
export const hero: HeroContent = {
  headline: 'Trading that talks back.',

  /**
   * Describes the machined form that actually ships behind the copy, not a
   * chart. art-direction.md §2.1 bans any price, percentage, currency symbol or
   * P&L in a plate — "including partial, out of focus, or on a reflected
   * surface" — so the alt text must not invent market data either.
   */
  mediaAlt:
    'A large brushed aluminium form curving out of darkness, lit along one edge by a single soft light.',

  /**
   * Mandatory, visible in the first viewport, never collapsed, never behind a
   * blur. A waitlist for a broker is still a broker's page.
   */
  riskDisclosure:
    'Investments in the securities market are subject to market risk. Read all the related documents carefully before investing.',
}
