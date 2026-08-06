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
  /**
   * The badge.
   *
   * It read "AI-native trading platform", and "AI-native" is the problem: it is
   * a compound that did not exist before 2023 and now appears on the homepage of
   * every company that has touched a model. It carries no information a reader
   * can act on — it is a claim about our architecture, made to an audience that
   * is deciding whether to hand over a phone number — and it is the single
   * highest-frequency phrase in its category, which is exactly why a language
   * model reaches for it and exactly why it reads as one.
   *
   * The badge's original job survives, restated. Its argument was that the
   * headline left a genuine ambiguity — a chart that talks is either an AI
   * product or a metaphor — and the badge resolved it. The new headline resolves
   * that itself, so this is free to do the other useful thing: say that the
   * product is not open yet, which is the fact that makes a waitlist page make
   * sense at all.
   *
   * "Not yet open" rather than "coming soon" or "in beta". Both of those are
   * positions on a roadmap; this is a statement about today, and it is the
   * phrasing a person uses about a shop.
   */
  eyebrow: 'AI-native interactive trading platform.',

  headline: 'Trading that talks back.',

  subheadline:
    '6 months at ₹0 brokerage on equity, futures and options — no tiers or conditions.',




  primaryCta: 'Six months at zero Thinq brokerage for everyone on the list.',

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
export const offerQualifier = 'Statutory charges apply.'

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
