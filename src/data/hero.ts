import type { HeroContent, Registration } from '../types'

/**
 * §3 Hero + §4 Trust strip — docs/landing-page-copy.md
 * All strings verbatim from the copy deck. [SQUARE BRACKET] values are
 * deliberate compliance placeholders — do not invent replacements.
 */

export const hero: HeroContent = {
  eyebrow: 'SEBI-registered broker · NSE · BSE · MCX · CDSL',
  headline: 'Your money. Your market. One app.',
  /*
   * The instrument list, and nothing else.
   *
   * This has been cut twice. The deck ran three trailing claims — "loads fast,
   * prices plainly, and stays out of your way" — and the first pass kept one of
   * them. That last one goes too: Platform owns speed ("the ten seconds that
   * matter"), Pricing owns plain pricing ("Priced plainly, in advance"), and
   * "stays out of your way" is a claim about the product that the product's own
   * section is better placed to make.
   *
   * What a first-time visitor needs from a broker's hero is *what can I trade
   * here*. That is substance, it is unarguable, and the H1 above already carries
   * the consolidation promise in three words. A hero that argues is a hero the
   * reader has to evaluate; a hero that states gets scanned and passed.
   */
  subheadline: 'Stocks, ETFs, F&O, commodities and direct mutual funds.',
  primaryCta: 'Open free account',
  secondaryCta: 'See pricing',
  supportLine: 'Free account opening · Aadhaar eKYC · Ready to trade the same day',
  /*
   * The deck asked for "a Nifty 50 chart with an open buy order". That is a
   * fabricated interface showing invented market data, which motion-brief §7
   * rules out — a rendered candlestick is made-up price history no matter how
   * it is labelled. The hero carries an abstract plate instead, and this string
   * describes what actually ships. See docs/art-direction.md.
   */
  mediaAlt: 'A machined aluminium form at rest in near-black, one edge catching warm light',
  riskDisclosure:
    'Investments in the securities market are subject to market risk. Read all the related documents carefully before investing.',
}

/**
 * The H1 as it is set, with art-directed line breaks.
 *
 * `hero.headline` stays the flat string for meta tags and anywhere the breaks
 * would be wrong. Here the ragging is a design decision, not a consequence of
 * whatever width the viewport happens to be — the same reason the H1's measure
 * is expressed in `em` rather than pixels. Honoured at ≥768px only; below that
 * the copy wraps naturally.
 */
export const heroHeadlineDisplay = 'Your money.\nYour market.\nOne app.'

/**
 * §3 "Hero visual — description for design".
 *
 * Rewritten away from the deck. The original asked for an order ticket over a
 * Nifty 50 candlestick chart with "neutral, obviously-illustrative numbers" —
 * but motion-brief §7 rules out fabricated interfaces and chart forms outright,
 * on the grounds that a rendered candlestick is invented price history whether
 * or not it is captioned as illustrative. The full brief for what ships instead
 * is in docs/art-direction.md.
 *
 * Currently unreferenced: the hero renders `HeroCanvas`, which needs no
 * placeholder. Kept so the description survives to whoever wires the real plate.
 */
export const heroMediaLabel =
  'A single machined aluminium form at rest in near-black, lit from high and behind so only its top edge catches. Left 45% of frame stays dark and low-contrast for the headline. No interface, no numbers, no chart forms, no green or red.'

/**
 * Was: the mandated "Illustrative" stamp for the hero visual (§3, landing.md §9
 * accessibility gate). It exists to stop a real-looking P&L being mistaken for
 * live data — and there is no longer a fabricated screenshot on the page to
 * stamp. Kept, unreferenced, because the requirement returns the moment anyone
 * puts a product mock back in the hero.
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
