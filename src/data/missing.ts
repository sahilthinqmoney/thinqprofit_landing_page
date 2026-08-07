/**
 * §3 — "What you're missing". One feature, in depth, and nothing else.
 *
 * ── Why one section carries one feature ────────────────────────────────────
 *
 * This replaces a four-section run of one-sentence claims. That run was built on
 * a sound observation — Robinhood's homepage puts exactly one item in each of
 * its nine sections, and a feature grid is never the unit — but it applied the
 * observation to a page that had already shipped. A waitlist page has not. The
 * reader is not choosing between brokers on feature count; they are deciding
 * whether an unlaunched product is worth a phone number, and that decision is
 * made by ONE thing being unarguably better, not by six things being present.
 *
 * So the depth goes here and the list goes to §4, which is explicitly a summary
 * and says so. Selling one feature and mentioning the rest is a stronger page
 * than selling six.
 *
 * ── The narrative opens on a failure, and it is the reader's ───────────────
 *
 * "It happened at 11:40. You saw it at 12:15." Two timestamps and a gap. No
 * instrument is named, no price is quoted, no direction is implied — which is
 * what keeps it inside docs/art-direction.md §2.1 and DESIGN.md §8, both of
 * which refuse fabricated market data. A clock is not market data. The moment
 * this sentence names a symbol or a level it becomes an invented trade.
 *
 * The third line is the one that does the work: "Not because you were slow." The
 * page is not selling the reader a fix for their own inadequacy — it is naming a
 * structural limit. Forty instruments across a six-hour session is not an
 * attention problem, it is an arithmetic one, and a product that tells its buyer
 * they were slow has insulted them in the first paragraph.
 */

export interface MissingContent {
  heading: string
  narrative: string
  pain: string
  solution: string
  finePrint: string
  clipText1: string
  clipText2: string
}

export const missing: MissingContent = {
  heading: 'It happened at 11:40. You saw it at 12:15.',
  narrative: '',
  pain: '',
  solution: 'You were on another instrument. There are forty of them and the session is six hours long.',
  finePrint: 'Thinq writes market commentary, not investment advice.',
  clipText1: '11:40 · 24,780 gave way',
  clipText2: '12:15 · you opened the chart',
}
