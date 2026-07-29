import type { ReactNode } from 'react'
import Container from './Container'

/**
 * Three heading steps, so a lead section and a minor one no longer render at
 * exactly the same size. Previously every H2 on the page was the same clamp,
 * which flattened the whole document into a list of equal-weight slabs.
 */
const SCALE = {
  lead: 'text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.08] tracking-[-0.03em]',
  standard: 'text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] tracking-[-0.02em]',
  minor: 'text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.2] tracking-[-0.015em]',
} as const

interface SectionShellProps {
  id: string
  heading: string
  subheading?: string
  children: ReactNode
  /** Slightly raised background, for alternating section rhythm. */
  tone?: 'base' | 'raised'
  /** Centre the heading block. Default true. */
  centered?: boolean
  /** Heading step. Default 'standard'. */
  scale?: keyof typeof SCALE
  /**
   * Fill the viewport and centre the content vertically.
   *
   * Default **true** — the brief is that every section covers the full screen.
   *
   * `min-h-svh`, not `h-screen`: a section whose content exceeds the viewport
   * grows rather than clipping, and `svh` (not `vh`) keeps mobile browser
   * chrome from pushing the section past the fold.
   *
   * Opt out with `fullHeight={false}` only for the deliberate thin bands
   * (TrustStrip, Stats), which are punctuation between sections rather than
   * sections in their own right.
   */
  fullHeight?: boolean
  /** Drop the hairline above the section — for a band that follows full-bleed media. */
  seamless?: boolean
  className?: string
}

/**
 * Standard section wrapper for the text-and-data bands: H2, subheading, then
 * content.
 *
 * There is no eyebrow. A category label sitting above a heading ("Pricing"
 * above "Priced plainly, in advance") is decoration wearing the costume of
 * information — the heading already says what the section is, and the label
 * only survives because it is easy to add. The headings here were rewritten to
 * stand alone; nothing was lost with the labels.
 *
 * Sections that lead with imagery use `MediaSection` instead, which bleeds to
 * the viewport edge and overlays its copy on the asset.
 */
export default function SectionShell({
  id,
  heading,
  subheading,
  children,
  tone = 'base',
  centered = true,
  scale = 'standard',
  fullHeight = true,
  seamless = false,
  className = '',
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-20 sm:py-24 lg:py-28 ${
        seamless ? '' : 'border-t border-border-soft'
      } ${fullHeight ? 'flex min-h-svh flex-col justify-center' : ''} ${
        tone === 'raised' ? 'bg-surface/30' : ''
      } ${className}`}
    >
      <Container>
        <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
          <h2 className={`display text-fg ${SCALE[scale]}`}>{heading}</h2>
          {subheading && <p className="mt-4 text-base leading-relaxed text-fg-muted">{subheading}</p>}
        </div>

        <div className="mt-12 sm:mt-16">{children}</div>
      </Container>
    </section>
  )
}
