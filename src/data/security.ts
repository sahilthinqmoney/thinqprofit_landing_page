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
  'SEBI-registered broker and member of NSE & BSE. Your funds settle to your bank, securities to your demat, and client funds are strictly segregated.'

export const regulatoryProof =
  'Thinq is a SEBI-registered broker and a member of the NSE and the BSE. Funds settle to your own bank account. Securities are held in your own demat account.'

export const pillars: SafetyPillar[] = [
  {
    title: 'Securities sit in your demat account',
    body: 'Every share is credited directly to your own demat account held in your name.',
    icon: 'vault',
  },
  {
    title: 'Client funds are segregated and reported',
    body: 'Client money is strictly separated from company funds and reported daily to exchanges.',
    icon: 'split',
  },
  {
    title: 'Two-factor on login and on withdrawal',
    body: 'Mandatory 2FA authentication for all account logins and money withdrawals.',
    icon: 'key-round',
  },
  {
    title: 'Encrypted in transit and at rest',
    body: 'Bank-grade end-to-end encryption for data in transit and stored at rest.',
    icon: 'lock',
  },
  {
    title: 'Sessions you can end from anywhere',
    body: 'View active device sessions and terminate any session remotely in one tap.',
    icon: 'shield-check',
  },
  {
    title: 'A complete, timestamped order trail',
    body: 'Every order, modification, and cancellation is permanently logged and accessible.',
    icon: 'message-square-warning',
  },
]

export const honestNote = 'Your trade data is never sold, and your order flow is never traded against.'

