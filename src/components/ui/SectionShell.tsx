import type { ReactNode } from 'react'
import Container from './Container'
import FocusPull from './FocusPull'

/**
 * Heading steps. Assignment is by the section's weight in the page, not by
 * taste at each call site:
 *
 *   lead     — the three sections a visitor came for: what you trade, what it
 *              costs, how you open an account.
 *   standard — everything else that is a section in its own right.
 *   minor    — bands that support a neighbour rather than stand alone.
 *
 * Before this, every H2 on the page rendered at the identical clamp, which
 * flattened the document into a list of equal-weight slabs.
 */
const SCALE = {
  lead: 'text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.08]',
  standard: 'text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.14]',
  minor: 'text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.2]',
} as const

/**
 * The single content rail. Every section sits in it, so the page has one left
 * edge from the nav to the footer.
 *
 * `Container` caps the *page* at 1760px, which is the right measure for
 * full-bleed media and the nav. It is far too wide to read across, so sections
 * previously each invented their own inner width — `84rem` in three files,
 * `max-w-3xl lg:max-w-4xl` in another, `4xl` rising to `1440px` in another.
 * Six different measures inside one container is the uniformity defect that
 * reads as "assembled" rather than "designed". This is now the only one.
 */
const RAIL = 'w-full max-w-[84rem]'

interface SectionShellProps {
  id: string
  heading: string
  subheading?: string
  children: ReactNode
  /** Slightly raised background, for alternating section rhythm. */
  tone?: 'base' | 'raised'
  /**
   * Centre the heading block.
   *
   * Default **false**. The page reads left-flush from the nav down, and the
   * media sections park their copy against a left or right margin — a centred
   * heading over left-aligned content leaves the two sharing no axis. Reserve
   * `centered` for a section that is genuinely one centred statement.
   */
  centered?: boolean
  /** Heading step. See SCALE — assign by the section's weight, not by feel. */
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
 * content — all inside one shared rail.
 *
 * There is no eyebrow. A category label sitting above a heading ("Pricing"
 * above "Priced plainly, in advance") is decoration wearing the costume of
 * information — the heading already says what the section is, and the label
 * only survives because it is easy to add.
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
  centered = false,
  scale = 'standard',
  fullHeight = true,
  seamless = false,
  className = '',
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-28 sm:py-32 lg:py-40 ${
        seamless ? '' : 'border-t border-border-soft'
      } ${fullHeight ? 'flex min-h-svh flex-col justify-center' : ''} ${
        tone === 'raised' ? 'bg-surface/30' : ''
      } ${className}`}
    >
      <Container>
        <div className={RAIL}>
          {/*
            The heading block comes into focus rather than arriving: it enters
            slightly over-scaled and soft and resolves as it reaches reading
            position, scrubbed to the wheel. Applied here rather than per section
            so every heading on the page shares one gesture — nine sections route
            through this component, and hand-applying it would guarantee nine
            slightly different versions.

            Scoped to the heading and subheading deliberately. The content below
            keeps its own `Reveal`, and nothing that carries a disclosure, a
            statutory line or a `[BRACKETED]` value is inside an entrance that
            starts at zero opacity — a reader who stops scrolling mid-tween has to
            still be able to read those.

            The subheading sits in a reading measure even when the rail is wide —
            a single sentence set across 1344px is not a sentence.
          */}
          <FocusPull className={`max-w-[38em] ${centered ? 'mx-auto text-center' : ''}`}>
            <h2 className={`display text-fg ${SCALE[scale]}`}>{heading}</h2>
            {subheading && (
              <p className="mt-4 text-base leading-relaxed text-fg-muted">{subheading}</p>
            )}
          </FocusPull>

          {/* More space above a heading than below it, and more between the
              heading block and its content than inside that content. The gap is
              what tells a reader the heading is finished. */}
          <div className="mt-16 sm:mt-20 lg:mt-24">{children}</div>
        </div>
      </Container>
    </section>
  )
}
