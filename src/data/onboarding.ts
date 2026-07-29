import type { OnboardingStep } from '../types'

/**
 * §8 Onboarding (how it works) — docs/landing-page-copy.md
 *
 * Copy is verbatim from the deck. The [X] in `timingNote` is a deliberate
 * compliance placeholder: activation time must be filled with the real,
 * verified SLA before launch. Do not guess a number. It renders through
 * `ui/CopyText`, which flags it in warning colour so an unfilled value cannot
 * be mistaken for a published figure.
 */

export const steps: OnboardingStep[] = [
  {
    title: 'Verify yourself',
    body: "Enter your PAN and Aadhaar-linked mobile number. We pull your KYC from the registry, so you're not re-typing what the system already has.",
    icon: 'id-card',
  },
  {
    title: 'Add your details',
    body: "Link your bank account, complete video verification, and appoint a nominee. eSign with Aadhaar OTP and you're done with paperwork.",
    icon: 'file-signature',
  },
  {
    title: 'Fund and trade',
    body: 'Add money by UPI or net banking. Your demat account activates and you can place your first order the same day.',
    icon: 'wallet',
  },
]

/** Requirements strip — rendered as a chip row behind the label "You'll need:". */
export const requirements: string[] = [
  'PAN card',
  'Aadhaar linked to your mobile number',
  'Bank account details',
  'Signature and photo',
]

export const timingNote =
  "Most accounts are activated within [X] working hours. Some cases need extra verification and take longer — we'll tell you which, and why."
