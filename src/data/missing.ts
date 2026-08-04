import type { PlateId } from '../lib/media'

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
  /** Which rendered plate backs the section. */
  plate: PlateId
  /** `\n` is an art direction, honoured at ≥768px only (DESIGN.md §3). */
  heading: string
  /** The gap, stated as a fact about the reader's day. */
  narrative: string
  /** The arithmetic. Numbers are counts of instruments, never prices. */
  pain: string
  /** What the product does about it, in the present tense. */
  solution: string
  /**
   * Pinned to the claim it qualifies, never batched into the footer. A page that
   * says an AI reads the market to you and puts the word "commentary" four
   * thousand pixels away has built the Cortex-PDF structure this repo refuses.
   */
  finePrint: string
}

export const missing: MissingContent = {
  /*
   * `terminal`, the same plate the old §7 opened on. It is the one plate in the
   * set whose subject reserves the left third, which is where this section's
   * copy parks — see `Missing.tsx`, which sets `place="left"` and puts the
   * scrim's dense core at 26%.
   */
  plate: 'terminal',

  /*
   * The break isolates the second timestamp on its own line, so the gap between
   * the two is a gap on the page as well as in the sentence. Both lines clear
   * the measure at every width the clamp produces; neither re-rags.
   */
  heading: 'It happened at 11:40.\nYou saw it at 12:15.',

  narrative: 'Not because you were slow.',

  /*
   * Forty and two hundred are counts of things on a screen, not figures about
   * money, so neither needs a `[PLACEHOLDER]` and neither is a claim we could be
   * held to. They are also deliberately the real order of magnitude: an NSE
   * options chain runs to hundreds of live strikes, and a trader watching two
   * dozen underlyings is ordinary rather than exceptional.
   */
  pain: 'Forty instruments. Two hundred strikes on the chain. Six hours. Somewhere in there, the one move you were waiting for happened while you were reading a different tab.',

  /*
   * Present tense, and no future tense anywhere in it. "Will surface" and
   * "learns your style" are the two verbs a pre-launch AI page reaches for, and
   * both describe a product that does not exist yet. This describes one that
   * does, or the sentence should not be on the page.
   *
   * "On-screen" is doing real work: it says the output is text on the chart, not
   * a notification, not an email, not a chat window in a sidebar. A sidebar
   * assistant is the shape the whole market shipped; the claim here is that the
   * reading happens where the reader is already looking.
   */
  solution:
    'Thinq watches all of it, continuously, and writes what changed on the chart in plain English — what moved, what it means, and whether it is worth your attention.',

  /*
   * The boundary, stated at the same rank as the claim. Market commentary is not
   * investment advice, and this is the sentence a regulator reads first. It says
   * nothing about whether the commentary is correct, and must never be edited
   * into something that does.
   */
  finePrint: 'Thinq writes market commentary, not investment advice.',
}
