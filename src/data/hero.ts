import type { HeroContent } from '../types'

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
  headline: 'Trading that talks back.',

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
 * `eyebrow`, `subheadline` and `primaryCta` went the same way, and the
 * subheadline is the one worth recording. Hero.tsx renders that sentence as
 * markup — two `<span>`s carrying the emphasis on "6 Months" and "₹0
 * brokerage" — so it never read the string, and the two copies drifted apart
 * until a capitalisation fix had to be applied twice. A copy deck that the page
 * does not read is not a source of truth; it is a second place to be wrong.
 *
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

/**
 * `trustLabel` and `registrations` went with the trust strip they fed, and the
 * band itself went with them — see the note in App.tsx. The four authorities it
 * named are not lost: §5's `regulatoryProof` states the SEBI/NSE/BSE membership
 * in a sentence, and §8's `registrationLines` carries every code, including the
 * CDSL participant ID, as the footer's registration block.
 *
 * The blocking TODO that lived here moves with the data rather than dying with
 * it: the codes in `src/data/footer.ts` are still unverified placeholders and
 * still block launch. That is the one copy of them the page now has.
 */
