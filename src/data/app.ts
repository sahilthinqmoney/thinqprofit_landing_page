/**
 * §9 Mobile app — docs/landing-page-copy.md
 *
 * Every string below is verbatim from the copy deck. The `[X.X]` and `[TODO: …]`
 * markers in `ratingLine` are deliberate: real store ratings must be substituted
 * (or the line deleted) before launch. Do not invent a rating.
 */
import type { AppFeature } from '../types'

/* -------------------------------------------------------------------------- */
/* Local types — not in src/types.ts, so they live here.                       */
/* -------------------------------------------------------------------------- */

/**
 * No `icon` field, deliberately. The store badges are brand marks and lucide
 * ships none — its `Apple` glyph is a piece of fruit, not the Apple Inc. wordmark.
 * Footer.tsx documents the same constraint for the social row. The deck's labels
 * ("Download on the App Store", "Get it on Google Play") name the stores
 * unambiguously on their own.
 */
export interface AppStoreCta {
  label: string
  href: string
}

export interface AppCopy {
  eyebrow: string
  heading: string
  body: string
  storeCtas: AppStoreCta[]
  qrLine: string
  /** Contains unfilled placeholders on purpose — see the deck's TODO. */
  ratingLine: string
}

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

export const appCopy: AppCopy = {
  eyebrow: 'On the go',
  heading: 'The whole market, in your pocket',
  /*
   * The second sentence went entirely: biometric login and alerts are the first
   * and third items of the feature line directly beneath this paragraph, so it
   * was previewing a list the reader reaches two seconds later. "Minus the
   * excuses" went with it — a joke is not a claim.
   */
  body: 'Order entry, live charts, positions and funds — everything the web terminal does.',
  storeCtas: [
    { label: 'Download on the App Store', href: '#' },
    { label: 'Get it on Google Play', href: '#' },
  ],
  qrLine: 'Scan to install',
  ratingLine:
    '[X.X] on the App Store · [X.X] on Google Play [TODO: use live ratings or delete this line]',
}

/**
 * These set as one flowed `·` line in MobileApp, so each label has to read as a
 * noun phrase rather than a sentence — the explanatory tails ("for your…",
 * "Works on a… — orders queue and confirm") were what made the run of them
 * scan as prose instead of as a list.
 */
export const appFeatures: AppFeature[] = [
  { label: 'Face ID and fingerprint login', icon: 'scan-face' },
  { label: 'Watchlist and holdings widgets', icon: 'layout-grid' },
  { label: 'Alerts for orders, triggers and margin calls', icon: 'bell-ring' },
  { label: 'Order queuing on a patchy connection', icon: 'wifi-off' },
]
