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
  body: 'Order entry, live charts, positions and funds — the mobile app does everything the web terminal does, minus the excuses. Biometric login, instant UPI funding, and alerts that arrive when they matter.',
  storeCtas: [
    { label: 'Download on the App Store', href: '#' },
    { label: 'Get it on Google Play', href: '#' },
  ],
  qrLine: 'Scan to install',
  ratingLine:
    '[X.X] on the App Store · [X.X] on Google Play [TODO: use live ratings or delete this line]',
}

export const appFeatures: AppFeature[] = [
  { label: 'Face ID and fingerprint login', icon: 'scan-face' },
  { label: 'Widgets for your watchlist and holdings', icon: 'layout-grid' },
  { label: 'Push alerts for orders, triggers and margin calls', icon: 'bell-ring' },
  { label: 'Works on a patchy connection — orders queue and confirm', icon: 'wifi-off' },
]
