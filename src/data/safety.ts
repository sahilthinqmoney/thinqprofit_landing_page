import type { SafetyPillar } from '../types'

/**
 * §10 Safety & protection — docs/landing-page-copy.md
 *
 * Copy is verbatim. Icons follow design-system/thinqprofit/pages/landing.md §8
 * (Safety row): vault, split, key-round, shield-check, lock,
 * message-square-warning — in that order.
 */

export const pillars: SafetyPillar[] = [
  {
    title: 'Shares in your demat account',
    body: "Every share you buy is credited directly to your CDSL demat account, held in your name. We can't move them without your authorisation.",
    icon: 'vault',
  },
  {
    title: 'Funds handled per SEBI norms',
    body: 'Client funds are kept in designated client bank accounts, segregated from ours, with settlement at the frequency SEBI mandates.',
    icon: 'split',
  },
  {
    title: 'You authorise every debit',
    body: 'Selling requires your explicit approval each time, through CDSL TPIN or a SEBI-approved equivalent. No blanket power of attorney.',
    icon: 'key-round',
  },
  {
    title: 'Account security',
    body: "Two-factor authentication on every login, TOTP support, device binding, and session alerts when something signs in that shouldn't.",
    icon: 'shield-check',
  },
  {
    title: 'Encryption and monitoring',
    body: 'Data encrypted in transit and at rest, with continuous monitoring and independent security audits.',
    icon: 'lock',
  },
  {
    title: 'Transparent grievance route',
    body: 'If something goes wrong, the escalation path is published: our support desk, then our compliance officer, then SEBI SCORES and the Smart ODR portal.',
    icon: 'message-square-warning',
  },
]

/**
 * The honest note. The copy deck marks this "keep this, do not soften it" —
 * it is rendered prominently, never as a footnote.
 */
export const honestNote =
  'Regulation protects how your assets are held. It does not protect you from market losses. Prices fall, and no broker can change that.'
