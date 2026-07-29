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

/**
 * Section copy. Previously hardcoded in the component — the outlier on a page
 * that keeps every string in `src/data/`.
 *
 * `\n` in `heading` is an art-directed break, honoured by MediaSection at
 * ≥768px only; below that the headline re-rags naturally.
 */
export interface OnboardingCopy {
  eyebrow: string
  heading: string
  subheading: string
  cta: string
  /**
   * Brief for the still that sits behind this section — motion-brief §5.6,
   * constrained by §7. Until the asset lands, MediaBackdrop renders it as the
   * pending field's label, which is intentional: the copy can be judged for
   * contrast now.
   */
  mediaAlt: string
}

export const onboardingCopy: OnboardingCopy = {
  eyebrow: 'Getting started',
  /*
   * Three lines, not two. The copy column is 46% of the frame, so "Open an
   * account before" overruns it and re-wraps on its own — stranding "before"
   * alone on line two. Breaking it deliberately keeps the three lines close to
   * equal length instead.
   */
  heading: 'Open an account\nbefore your chai\ngets cold',
  subheading:
    'Fully online, Aadhaar-based, and no branch visit — assuming your KYC details are current.',
  cta: 'Start account opening',
  mediaAlt:
    'Three luminous nodes linking one after another along a single path in an ink-navy void, indigo fading to cyan, each link settling before the next begins. Unhurried, right of frame; the left stays dark. No interface, no numbers, no green or red.',
}

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

/** Requirements — flowed into a single comma-separated line under the steps. */
export const requirements: string[] = [
  'PAN card',
  'Aadhaar linked to your mobile number',
  'Bank account details',
  'Signature and photo',
]

export const timingNote =
  "Most accounts are activated within [X] working hours. Some cases need extra verification and take longer — we'll tell you which, and why."
