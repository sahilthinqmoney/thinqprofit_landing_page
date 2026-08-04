import type { SafetyPillar } from '../types'

/**
 * §5 — Security and trust.
 *
 * ── BUILD NOTE, blocking ───────────────────────────────────────────────────
 *
 * Six of the commitments below are statements about systems that either exist or
 * do not. They are not marketing claims and they are not aspirations: "two-factor
 * authentication on every withdrawal request" is either true of the withdrawal
 * flow on launch day or it is a false statement about security published by a
 * SEBI-registered broker.
 *
 * Every one of them is listed in docs/go-live-checklist.md as a blocking item
 * requiring sign-off from whoever owns the system it describes. Do not soften
 * them into "designed to" or "helps protect" — a hedged security claim is worse
 * than an absent one, because it reads as a commitment to a customer and as a
 * disclaimer to a lawyer. If a claim cannot be signed off, delete the row.
 *
 * ── Why this is a ladder and not a grid ────────────────────────────────────
 *
 * The section renders in three tiers of descending weight, and the assignment is
 * by what a stranger is actually asking. The question is never "do you encrypt
 * data at rest"; it is "if this company disappears, where is my money". So
 * custody is tier 1 at full display size, the two facts that qualify custody are
 * tier 2, and the hygiene commitments — true of every competent broker, and
 * therefore proving nothing on their own — are a quiet ledger at the bottom.
 *
 * A 3×2 grid of identical cells would say those three ranks are equal. They are
 * not, and the layout is where that gets said.
 */

/**
 * The regulatory proof, rendered as the section's deck.
 *
 * MCX is absent here as it is in the trust band: the page claims equity, futures
 * and options, so a commodities membership displayed under a security heading
 * would be a scope claim made by the section whose job is to be believed.
 */
export const securityHeadline = 'Where your money sits.'
export const securityBody =
  'SEBI-registered broker. Member NSE and BSE. Funds settle to your own bank, securities to your own demat with the depository. Client funds segregated as the regulations require and reported to the exchange. Two-factor on login and on withdrawal. Encrypted in transit and at rest. Every order and modification timestamped. Your data is never sold.'

export const regulatoryProof =
  'Thinq is a SEBI-registered broker and a member of the NSE and the BSE. Funds settle to your own bank account. Securities are held in your own demat account.'

/**
 * The three tiers, flattened into one ordered list — `Security.tsx` slices it as
 * [0], [1..3) and [3..]. The order is fixed by that slicing and is not cosmetic;
 * reordering this array silently re-ranks the section.
 *
 * Tier 1 (index 0) — custody. The answer to the only question that matters.
 * Tier 2 (index 1–2) — the two facts that qualify custody: whose money it is
 *   while it sits there, and who is watching.
 * Tier 3 (index 3+) — hygiene. Real commitments, quietly set, because saying
 *   them loudly invites the reader to wonder why they needed saying.
 */
export const pillars: SafetyPillar[] = [
  {
    title: 'Securities sit in your demat account',
    body: 'Every share you buy is credited directly to your own demat account, held in your name, not in a pooled account we control.',
    icon: 'vault',
  },
  {
    title: 'Client funds are segregated and reported',
    body: 'Client money is held separately from the company’s own, and the balances are reported to the exchange.',
    icon: 'split',
  },
  {
    title: 'Two-factor on login and on withdrawal',
    /*
     * The withdrawal half is the half that matters and it is stated second so it
     * lands last. Every broker has 2FA on login. Requiring a second factor on
     * the request that moves money out is the one a reader should check for, and
     * most do not have it.
     */
    body: 'Every login is behind two factors, and so is every request to withdraw money — the second one is where it counts.',
    icon: 'key-round',
  },
  {
    title: 'Encrypted in transit and at rest',
    body: 'Data is encrypted end to end on the wire and encrypted again where it is stored.',
    icon: 'lock',
  },
  {
    title: 'Sessions you can end from anywhere',
    /*
     * "Instantly" is a commitment to a system property — the kill has to
     * propagate, not be queued. Flagged in the checklist for exactly that
     * reason: an "instant" logout that takes effect on the next token refresh is
     * not instant, and the word is the claim.
     */
    body: 'See every active session and end any of them instantly, from any device you are still signed in on.',
    icon: 'shield-check',
  },
  {
    title: 'A complete, timestamped order trail',
    /*
     * "Retrievable by you" is the operative clause. Every broker keeps an audit
     * trail because regulation requires one; the claim here is that the customer
     * can pull their own, which is the version that is useful in a dispute.
     */
    body: 'Every order, modification and cancellation is timestamped and retrievable by you, not just by us.',
    icon: 'message-square-warning',
  },
]

/**
 * The section's terminal statement — the largest sentence in it, set below the
 * ladder with a rule above it and a large measure of air.
 *
 * It is the data-privacy commitment, promoted out of the hygiene tier and given
 * the closing position, because it is the only claim in the list a competitor
 * would find genuinely expensive to match. "Never traded against" is a statement
 * about the business model: it says the firm does not take the other side of its
 * customers' orders. That is a real constraint on how revenue can be earned, and
 * it is the sentence to fight for if anyone proposes softening it.
 *
 * Keep it, do not soften it, and do not move it into the ledger.
 */
export const honestNote = 'Your data is never sold, and your order flow is never traded against.'
