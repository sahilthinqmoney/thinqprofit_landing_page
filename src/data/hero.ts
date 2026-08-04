import type { HeroContent, Registration } from '../types'

/**
 * §2 Hero + the registration band under it.
 *
 * ── What changed, and the one rule that survived intact ────────────────────
 *
 * The page used to sell a brokerage account. It now sells a place on a list for
 * a product that has not opened, and that inverts what the hero has to do: a
 * broker's hero answers "what can I trade here", a waitlist hero answers "why
 * should I care before it exists". Those are different sentences and the old
 * one — "Stocks, ETFs, F&O, commodities and direct mutual funds" — is an
 * inventory, which is exactly the answer nobody is asking for yet.
 *
 * What survived is the rule underneath it: the hero STATES, it does not argue.
 * A hero that argues is one the reader has to evaluate; a hero that states gets
 * scanned and passed. Everything below is a statement.
 */

export const hero: HeroContent = {
  /**
   * The badge, and it is not an eyebrow.
   *
   * DESIGN.md §3 removed the eyebrow prop outright — "a category label sitting
   * above a heading is decoration wearing the costume of information" — and the
   * distinction that lets this one exist is that it is not a label for the
   * heading. "Charts that say everything" does not tell a reader what kind of
   * product this is; a chart that talks is either an AI product or a metaphor,
   * and which one it is happens to be the whole claim. The badge is the answer,
   * placed before the question can be misread.
   *
   * Three words, no verb, no adjective about the trader. Every competitor hero
   * in this market leads with one — Elite, Pro, Super-powered — and the page
   * refuses that register everywhere it appears.
   */
  eyebrow: 'AI-native trading platform',

  /**
   * The H1. Four words, one full stop, no line breaks.
   *
   * It carries no `\n`, which is a change from the three-line stair that stood
   * here, and the reason is arithmetic rather than taste. At the H1's 120px
   * ceiling "Charts that say everything." sets ~1,430px in IBM Plex at the
   * display axis — past any measure the hero column has — so the line breaks
   * naturally at every width, and an art-directed break would only be honoured
   * at widths where the clamp has already made the decision. A hand-written
   * break that agrees with the wrap is not art direction, it is a comment.
   *
   * The full stop stays. It is the difference between a headline and a claim.
   */
  headline: 'Charts that say everything.',

  /**
   * The value proposition, in one sentence with three clauses.
   *
   * The three clauses are the product, and they are ordered by what a trader
   * checks first: what is in play, what changed, what is noise. The third is the
   * one no competitor offers, because naming something as noise is a judgment a
   * feature list cannot make — a screener surfaces everything and lets you sort.
   */
  subheadline:
    'The chart reads price action back to you — what is in play, what just changed, and what is only noise.',

  /**
   * The offer, repeated from the announcement bar deliberately.
   *
   * It is the one repetition on the page and it is not an accident of assembly:
   * the bar is chrome a reader can scroll past without registering, and the
   * hero is where the offer has to be attached to the action it pays for. The
   * qualifier travels with it, in `offerQualifier`, for the same reason it
   * travels in the bar.
   */
  primaryCta: 'Six months of zero brokerage for everyone on the list.',

  /**
   * A1, from docs/art-direction.md §3, unchanged by the copy rewrite.
   *
   * The alt text describes what actually ships behind the copy — a machined
   * form, not a chart. §2.1 bans any price, percentage, currency symbol or P&L
   * in a plate "including partial, out of focus, or on a reflected surface", and
   * the constraint tightened rather than relaxed when the headline started
   * talking about charts: a hero that says "charts that say everything" over a
   * rendered candlestick is inventing the market data the sentence is about.
   */
  mediaAlt:
    'A large brushed aluminium form curving out of darkness, lit along one edge by a single soft light.',

  /**
   * Mandatory, visible in the first viewport, never collapsed, never behind a
   * blur. This requirement is independent of what the page is selling — a
   * waitlist for a broker is still a broker's page.
   */
  riskDisclosure:
    'Investments in the securities market are subject to market risk. Read all the related documents carefully before investing.',
}

/**
 * The offer's qualifier. Rendered adjacent to `primaryCta`, at the same size.
 *
 * "Zero brokerage" is a claim about our fee and nothing else. §6 itemises what
 * still applies; this is the sentence that stops the hero's version of the claim
 * being read as "free".
 */
export const offerQualifier = 'Statutory charges still apply.'

/**
 * Was the art-directed three-line H1. Deleted rather than kept unreferenced: it
 * held copy that no longer exists anywhere on the page, and an exported string
 * nothing imports is a copy deck pretending to be code.
 *
 * The `heroIllustrativeStamp` export went with it, and that one is worth a note.
 * It existed to stamp a fabricated P&L screenshot as illustrative. There is no
 * product mock on this page — and the moment anyone puts one back, the stamp is
 * a requirement, not an option. It is recorded in docs/go-live-checklist.md so
 * the requirement outlives the string.
 */

/** §5's band label. Deliberately not an H2 — nothing competes with the H1. */
export const trustLabel = 'Registered and regulated'

/**
 * The registration band.
 *
 * MCX is gone. The page no longer claims commodities anywhere — the capability
 * list is equity, futures and options — and a membership displayed for a segment
 * the product does not offer is a claim about scope made by the trust band,
 * which is the one band on the page whose entire job is to be believed.
 *
 * TODO (blocking): replace every value with a verified code before launch. If a
 * segment is not live, remove the row rather than showing an unfilled one.
 * `TrustStrip` suppresses a code while it is a `[PLACEHOLDER]`, so the authority
 * name renders today and the number waits.
 */
export const registrations: Registration[] = [
  { authority: 'SEBI Registered Broker', value: '[INZ000XXXXXX]', icon: 'shield-check' },
  { authority: 'NSE Member', value: '[Member code]', icon: 'landmark' },
  { authority: 'BSE Member', value: '[Member code]', icon: 'building-2' },
  { authority: 'CDSL Depository Participant', value: '[IN-DP-XXX-XXXX]', icon: 'vault' },
]
