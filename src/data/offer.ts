import type { PlateId } from '../lib/media'

/**
 * §6 — "What the list gets". The offer, stated in full, once.
 *
 * ── This section exists because the announcement bar cannot carry terms ────
 *
 * The bar says "six months of zero Thinq brokerage, statutory charges apply".
 * That is the claim and its qualifier, and it is as much as one line can hold.
 * What it cannot say is when the six months start, what segments it covers,
 * whether there is a turnover condition, or which charges "statutory" means. A
 * reader who wants those answers currently has nowhere to go — and an offer whose
 * terms are not on the page is an offer the reader is right to distrust.
 *
 * So: the terms in full, at body size, in the section. Not in a modal, not
 * behind a "T&Cs apply" link, and not set smaller than the claim they qualify.
 *
 * ── There is no rate card, and that is deliberate ──────────────────────────
 *
 * What we charge after month six is not stated anywhere on this page. The
 * previous build shipped a pricing section where every rate was an unfilled
 * `[₹X per executed order]` placeholder, which made the section's own heading —
 * "Priced plainly, in advance" — the one claim it could not support. Rather than
 * repeat that, the page says nothing about post-offer pricing at all.
 *
 * That is an honest silence rather than a hidden term: nobody on the waitlist is
 * being charged anything, the offer's own duration is stated exactly, and a rate
 * card invented before it is signed off would be a price we might not honour. It
 * is recorded in docs/go-live-checklist.md as a decision, not an omission, so
 * that the next person to notice the gap finds the reasoning instead of filling
 * it in.
 */

export interface OfferContent {
  plate: PlateId
  /** `\n` is an art direction, honoured at ≥768px only. */
  heading: string
  /** The one-sentence version, rendered as the deck. */
  summary: string
  /** The terms, in full. Each is a separate commitment, so each is its own line. */
  terms: string[]
  /** Heading for the statutory block. */
  statutoryHeading: string
  /** The charges that still apply, named individually. */
  statutory: string
  /**
   * The sentence that makes the statutory block checkable rather than merely
   * disclosed. A charge itemised on a contract note is one the customer can
   * audit against this page.
   */
  statutoryProof: string
}

export const offer: OfferContent = {
  /*
   * `scale`, from the plate set. It is the one plate whose subject is a single
   * balanced form — the section is about a quantity and its conditions, and the
   * plate that reads as a mechanism suits an offer better than the plates that
   * read as an instrument or a lens.
   */
  plate: 'scale',

  /*
   * No line break. "Six months at zero brokerage." sets inside the measure at
   * every width the `mid` clamp produces, so a hand-written `\n` would either be
   * ignored or fight the wrap.
   *
   * "At zero" rather than "of zero": the bar already says "six months of zero
   * Thinq brokerage" and this is the same offer stated as a rate rather than as
   * a duration. Two identical sentences in one scroll read as a page that
   * duplicated a block by accident.
   */
  heading: 'Six months at zero brokerage.',

  summary:
    'Zero Thinq brokerage on equity, futures and options for six months, starting the day your account activates.',

  /*
   * Three terms, and the two that matter are the absences. "No tiers" and "no
   * minimum turnover" are the conditions a reader assumes are hiding in an offer
   * like this, and naming them as absent is the only way to answer a suspicion
   * the reader has not voiced. The third states the boundary of the word "zero"
   * — it is our fee, and nothing else.
   */
  terms: [
    'Six months from the day your account activates, not from the day you join the list.',
    'Equity delivery, equity intraday, futures and options. No tiers, no minimum turnover, no volume conditions.',
    'Zero refers to Thinq’s brokerage. It is the only charge we control, and it is the only one we are waiving.',
  ],

  statutoryHeading: 'What still applies',

  /*
   * Named individually rather than collected under "statutory charges", because
   * the collective noun is exactly what lets a reader assume it means something
   * small. Five named charges is a different sentence from "taxes and fees", and
   * this page is being read by people who will see all five on a contract note
   * in month one of an offer that told them trading was free.
   */
  statutory:
    'Securities Transaction Tax, exchange transaction charges, the SEBI turnover fee, GST and stamp duty are levied by the government and the exchanges. They are not ours to waive, and they apply from your first trade.',

  statutoryProof:
    'Every one of them is itemised, line by line, on the contract note you get for each trading day.',
}
