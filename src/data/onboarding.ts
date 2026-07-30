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
   * constrained by §7. Documentation for whoever shoots it, and not rendered:
   * MediaBackdrop draws a designed plate until the asset lands, so the overlaid
   * copy can still be judged for contrast against a representative ground.
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
  /*
   * The trailing qualification stays. "Fully online, no branch visit" is only
   * true when the registry already holds current KYC, and stripping the
   * condition would turn a qualified process description into an unqualified
   * service promise. Only the connectives went.
   */
  subheading: 'Fully online, Aadhaar-based, no branch visit — if your KYC is current.',
  cta: 'Start account opening',
  mediaAlt:
    'Three luminous nodes linking one after another along a single path in an ink-navy void, indigo fading to cyan, each link settling before the next begins. Unhurried, right of frame; the left stays dark. No interface, no numbers, no green or red.',
}

/**
 * The three detail lines are the only substance this section carries — which
 * documents, what eSign does, how the first deposit works — so the facts are
 * intact and only the reassurance around them was cut ("so you're not re-typing
 * what the system already has", "and you're done with paperwork"). A step that
 * lost a fact would be a shorter line that told the reader less.
 */
export const steps: OnboardingStep[] = [
  {
    title: 'Verify yourself',
    body: 'Enter your PAN and Aadhaar-linked mobile number. We pull your KYC from the registry.',
    icon: 'id-card',
  },
  {
    title: 'Add your details',
    body: 'Link your bank account, complete video verification, appoint a nominee, then eSign with Aadhaar OTP.',
    icon: 'file-signature',
  },
  {
    title: 'Fund and trade',
    body: 'Add money by UPI or net banking. Your demat account activates and you can trade the same day.',
    icon: 'wallet',
  },
]

/**
 * Requirements — flowed into a single comma-separated line under the steps.
 * Stripped to the nouns: a reader scanning a checklist does not need "card",
 * "details" or "your mobile number" spelled out to know what to fetch.
 */
export const requirements: string[] = [
  'PAN',
  'Aadhaar linked to mobile',
  'bank details',
  'signature and photo',
]

export const timingNote =
  "Most accounts are activated within [X] working hours. Some cases need extra verification and take longer — we'll tell you which, and why."
