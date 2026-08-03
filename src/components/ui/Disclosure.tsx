import { TriangleAlert } from 'lucide-react'

interface DisclosureProps {
  children: string
  /** `risk` gets the warning treatment; `note` is quieter statutory text. */
  tone?: 'risk' | 'note'
  className?: string
}

/**
 * Regulatory disclosure text.
 *
 * Rules from design-system/thinqprofit/pages/landing.md §9:
 *  - always live text, never baked into an image
 *  - never behind a blur or glass effect
 *  - must clear 4.5:1 contrast
 *
 * `note` uses fg-muted #D7D1CE: 13.2245:1 on the ground #0A0808, 12.5683:1 on
 * `surface` and 11.7024:1 on `surface-raised`, so it clears the floor on every
 * surface this component can land on. The "6.1:1 on bg" written here previously
 * was wrong on the old ground too, not merely stale — under platinum fg-muted
 * #cfcfcf measured 13.08:1 on #050505. Never fg-subtle: at 5.3087:1 / 4.6977:1
 * it is legal-fine-print-legible by declaration, and a disclosure should not sit
 * at the bottom of the legible range when a token 2.5x brighter is free.
 *
 * ── `risk`, and why its icon and border are load-bearing ──────────────────
 *
 * The warning token is #E8A13C, 9.1275:1 on the ground and 8.6746:1 on
 * `surface`. It is the accent's nearest chromatic neighbour — 71.79 deg against
 * the accent's 41.03 deg, a 30.76 deg gap, where the loss rose sits 35.86 deg
 * away and gain sits 130.12 deg away. 30.76 deg is separable but it is the
 * smallest gap in the palette, so this panel is not allowed to rest on hue: the
 * TriangleAlert glyph and the ruled box are what say "risk disclosure" to a
 * reader who cannot resolve amber from copper, and neither may be removed as
 * decoration. (§4 condition 2's principle — meaning never rests on hue alone.)
 *
 * The two alpha layers, measured on the ground so nobody assumes them:
 * `bg-warning/5` composites to #15100B, 1.0568:1 — a tint that lifts the box off
 * the page without becoming a surface, and the text on it is 8.6371:1.
 * `border-warning/25` composites to #422E15, 1.5538:1 against the ground and
 * 1.4703:1 against its own fill. That is deliberately NOT a 3:1 boundary: it
 * traces the box rather than fencing it, and the panel is identified by its icon
 * and its 8.64:1 text, not by its edge. On `surface` the same layers land at
 * #20160F (1.0697:1) and #4A3419 (1.6242:1) with text at 8.1097:1.
 */
export default function Disclosure({ children, tone = 'note', className = '' }: DisclosureProps) {
  if (tone === 'risk') {
    return (
      <p
        className={`flex items-start gap-2 rounded-lg border border-warning/25 bg-warning/5 px-3 py-2.5 text-xs leading-relaxed text-warning ${className}`}
      >
        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        <span>{children}</span>
      </p>
    )
  }

  return (
    <p className={`text-xs leading-relaxed text-fg-muted ${className}`}>{children}</p>
  )
}
