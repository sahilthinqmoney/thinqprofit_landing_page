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
 *  - must clear 4.5:1 contrast — `note` uses fg-muted (6.1:1 on bg), not fg-subtle
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
