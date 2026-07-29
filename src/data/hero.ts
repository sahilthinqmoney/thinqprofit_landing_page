import type { HeroContent, Registration } from '../types'

/**
 * §3 Hero + §4 Trust strip — docs/landing-page-copy.md
 * All strings verbatim from the copy deck. [SQUARE BRACKET] values are
 * deliberate compliance placeholders — do not invent replacements.
 */

export const hero: HeroContent = {
  eyebrow: 'SEBI-registered broker · NSE · BSE · MCX · CDSL',
  headline: 'Your money. Your market. One app.',
  subheadline:
    'Stocks, ETFs, F&O, commodities and direct mutual funds — on a platform that loads fast, prices plainly, and stays out of your way.',
  primaryCta: 'Open free account',
  secondaryCta: 'See pricing',
  supportLine: 'Free account opening · Aadhaar eKYC · Ready to trade the same day',
  mediaAlt: 'ThinqProfit app showing a Nifty 50 chart with an open buy order',
  riskDisclosure:
    'Investments in the securities market are subject to market risk. Read all the related documents carefully before investing.',
}

/** §3 "Hero visual — description for design", carried through to the placeholder. */
export const heroMediaLabel =
  'App on a dark field, order ticket open over a Nifty 50 candlestick chart. Second card floating: holdings list with day change. No fabricated P&L figures — use neutral, obviously-illustrative numbers.'

/**
 * Mandated stamp on the hero visual (§3 and landing.md §9 accessibility gate:
 * "Hero visual carries a visible 'Illustrative' stamp — never a real-looking P&L").
 */
export const heroIllustrativeStamp = 'Illustrative. Not a recommendation.'

/** §4 label. Deliberately not an H2 — nothing competes with the H1. */
export const trustLabel = 'Registered and regulated'

/**
 * §4 items.
 * TODO (compliance): replace all five with verified registration and member
 * codes before launch. If any segment is not yet live, remove the row entirely —
 * do not display an unregistered segment.
 */
export const registrations: Registration[] = [
  { authority: 'SEBI Registered Broker', value: '[INZ000XXXXXX]', icon: 'shield-check' },
  { authority: 'NSE Member', value: '[Member code]', icon: 'landmark' },
  { authority: 'BSE Member', value: '[Member code]', icon: 'building-2' },
  { authority: 'MCX Member', value: '[Member code]', icon: 'boxes' },
  { authority: 'CDSL Depository Participant', value: '[IN-DP-XXX-XXXX]', icon: 'vault' },
]
