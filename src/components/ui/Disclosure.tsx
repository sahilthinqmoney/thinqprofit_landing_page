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
 * Non-negotiable, from design-system/thinqprofit/pages/landing.md §9: always
 * live text, never baked into an image, never behind a blur, always clearing
 * 4.5:1.
 *
 * `note` uses fg-muted (13.22:1 on the ground, 11.70:1 on the lightest surface
 * it can land on). Never fg-subtle — at ~5:1 that is fine-print-legible by
 * declaration, and a disclosure should not sit at the bottom of the legible
 * range when a token 2.5x brighter is free.
 *
 * For `risk`, the icon and the ruled box are load-bearing, not decoration. The
 * warning amber is the accent copper's nearest neighbour in the palette — 30.76
 * deg of hue apart, the smallest gap there is — so a reader who cannot resolve
 * the two must still get "risk disclosure" from the glyph and the border. The
 * border is deliberately below 3:1: it traces the box rather than fencing it,
 * and the panel is identified by its icon and its 8.6:1 text.
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
