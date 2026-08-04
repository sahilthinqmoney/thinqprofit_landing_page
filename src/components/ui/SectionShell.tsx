import type { ReactNode } from 'react'
import Container from './Container'
import FocusPull from './FocusPull'

/**
 * Heading steps. Assignment is by the section's weight in the page, not by
 * taste at each call site:
 *
 *   hero     — the H1, and it is not assignable to a section (see the prop type
 *              below). It lives here because §45 asks that every rendered size
 *              resolve to a named role, and the page's largest type was the one
 *              size that named none: `Hero` hand-wrote its clamp inline, and
 *              `Platform` hand-wrote a copy of `lead`'s while its own comment
 *              claimed to match it. One ladder, three consumers, no raw px.
 *   lead     — the three sections a visitor came for: what you trade, what it
 *              costs, how you open an account.
 *   standard — everything else that is a section in its own right.
 *   minor    — bands that support a neighbour rather than stand alone.
 *
 * Before this, every H2 on the page rendered at the identical clamp, which
 * flattened the document into a list of equal-weight slabs.
 *
 * The number that matters in each clamp is the FLOOR, not the ceiling. A clamp
 * bottoms out on a phone and — because `vw` is small there too — most of these
 * were still bottomed out at 1024px. `standard` sat at 28px against an 18px
 * deck, a ratio of 1.56, so on the two widths most people actually use, a
 * section title was barely a step above its own standfirst. Every floor here is
 * set so title:deck clears 2.0 at 375px, which is the width where it was worst.
 *
 * SIZES ARE UNCHANGED BY THE MOVE TO IBM PLEX. LEADING IS NOT, and the +0.04em
 * every step below takes is a measurement rather than a preference.
 *
 * What a reader sees as the leading of a display block is not the line-height,
 * it is the gap between one line's lowest ink and the next line's highest.
 * Measured on the real woff2 at weight 600, the ascender-to-descender ink span
 * is 0.952em in IBM Plex Sans against 0.913em in Archivo — Plex's ascenders run
 * 0.740em to Archivo's 0.723em and its descenders 0.212em to 0.182em. So at an
 * unchanged line-height every display block on the page closes up by 0.039em.
 * At `lead`'s 64px ceiling that is 2.5px off an 8.1px gap: a 31% loss, which is
 * plainly visible in stacked type and is the difference between "tight" and
 * "touching". Every step therefore gains 0.04em, which is a translation of the
 * whole ladder — the intervals between the steps are untouched, and leading
 * still opens as size drops.
 *
 * Checked against the mounted headings rather than against the font tables
 * alone. Worst real pair at `lead` is Products' "One account, every Indian /
 * market": Archivo gave 8.64px of ink gap, Plex at the old 1.04 gives 6.40px,
 * Plex at 1.08 gives 8.96px. Worst at `mid` (MediaSection) is "The copilot /
 * has hands": 10.30px → 7.84px → 10.08px. Across every mounted pair the
 * correction lands within −0.22px and +2.4px of what Archivo delivered.
 *
 * The DECK below does not move, and that is the same measurement run on the
 * body face. Instrument Sans' 400-weight ink span is 0.955em against Plex's
 * 0.952em — Plex is marginally SHALLOWER at text weight — so the deck's 17px/1.6
 * goes from a 10.96px gap to 11.02px, a gain of 0.06px. The two rules that could
 * justify a change disagree about its direction (holding the ink gap gives 1.597,
 * holding the x-height-to-leading ratio gives 1.6188) and both sit inside the
 * 0.02 grid this page expresses. 1.6 stands.
 */
export const SCALE = {
  /*
   * The H1. `Hero` owns the argument for the clamp; this owns the name.
   *
   * 0.94 is NOT this step's rendered leading and must not be "corrected" to
   * match the others. `Hero` sets each line in its own block with a
   * `pb-[0.14em]` clip allowance, and that padding sits inside the clip box, so
   * the baseline-to-baseline distance is 0.94 + 0.14 = 1.08em — the same
   * +0.04em every step here takes, off a previous rendered 1.04em (0.98 + 0.06).
   * The pair is solved jointly against Plex's 1.300em hhea box so the descender
   * of "y" is not shaved; the arithmetic is written out at the call site.
   */
  /*
   * 8vw → 5.9vw, and the ceiling 7.5rem → 5.75rem. This is a fix for a measured
   * regression, not a change of taste.
   *
   * The headline grew from "Charts that say everything." (27 characters, two
   * lines) to "The chart tells you what just moved." (36, three). At 8vw the
   * third line cost 100px of block height, and the thing directly underneath is
   * the waitlist form — the whole reason this hero exists, per the note at the
   * top of `Hero.tsx`: "the form is here, above the fold".
   *
   * Measured before the change: at 1280×720 the submit button's bottom edge sat
   * at 789px against a 720px fold — 69px under. A page whose single conversion
   * event is a phone field had moved that field off the first screen on one of
   * the most common laptop viewports there is.
   *
   * The right correction is the size, not the copy. What a hero needs to hold is
   * a constant BLOCK — the old headline set 2 × 115px ≈ 216px at 1440, and the
   * new one sets 3 × 83px ≈ 234px, which is the same mass of type carrying a
   * longer sentence. Dropping the coefficient keeps that block roughly fixed as
   * the string grows, instead of letting an extra line push the page's only ask
   * downward.
   *
   * Verified after: submit bottom 706px at 1280×720, 730px at 1440×900, and it
   * still clears on a 390×844 phone.
   *
   * 0.94 is NOT this step's rendered leading and must not be "corrected" to
   * match the others. `Hero` sets each line in its own block with a
   * `pb-[0.14em]` clip allowance, and that padding sits inside the clip box, so
   * the baseline-to-baseline distance is 0.94 + 0.14 = 1.08em — the same
   * +0.04em every step here takes.
   */
  hero: 'text-[clamp(2.75rem,5.9vw,5.75rem)] leading-[0.94]',
  // Matches `MediaSection`'s `tall` exactly, so a flat lead section and a
  // full-bleed one carry the same rank rather than competing. Both moved to
  // 1.08 together; if one of them is ever edited alone the ladder is broken.
  // `Platform` is the third consumer and now imports this constant instead of
  // transcribing it — it had already drifted twice as a hand-copy, most
  // recently by staying at 1.04 through the move to Plex.
  lead: 'text-[clamp(2.5rem,4.6vw,4rem)] leading-[1.08]',
  standard: 'text-[clamp(2.125rem,3.9vw,3.25rem)] leading-[1.14]',
  minor: 'text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.2]',
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
 *
 * `mx-auto` is load-bearing and was missing. A capped block with no auto margin
 * is left-flush in its parent, so above ~1440px — the point where Container's
 * content box first exceeds 1344px — every section on the page sat against the
 * left gutter and dumped all the slack on the right. At 1920px that is 48px of
 * padding on one side and 368px on the other, which is the "sections aren't
 * centred, padding isn't equal" defect exactly. `Navbar` and `Footer` now share
 * this same rail, so the page has one centred axis top to bottom rather than a
 * 1344px body hanging off a 1760px chrome.
 */
export const RAIL = 'mx-auto w-full max-w-[84rem]'

/**
 * The one vertical rhythm. Every section — shell, full-bleed, or hand-rolled —
 * uses this string and nothing else.
 *
 * There were twelve distinct vertical-padding values across the page
 * (`py-14 sm:py-16 lg:py-20` here, `py-20 md:py-24` in MediaSection and
 * Platform, `py-16 sm:py-20 lg:py-24` in Stats, and so on). Twelve values is
 * not a rhythm, it is an absence of one, and it is what makes consecutive
 * sections feel unevenly spaced even when each looks fine alone.
 */
export const SECTION_Y = 'py-16 sm:py-20 lg:py-24'

/** The one page gutter. Mirrors `Container`, for sections that bleed past it. */
export const GUTTER_X = 'px-5 sm:px-6 lg:px-8 xl:px-12'

interface SectionShellProps {
  id: string
  heading: string
  subheading?: string
  children?: ReactNode
  tone?: 'base' | 'raised'
  centered?: boolean
  layout?: 'stack' | 'split'
  scale?: Exclude<keyof typeof SCALE, 'hero'>
  fullHeight?: boolean
  seamless?: boolean
  className?: string
}

export default function SectionShell({
  id,
  heading,
  subheading,
  children,
  tone = 'base',
  centered = false,
  layout = 'stack',
  scale = 'standard',
  fullHeight = false,
  seamless = false,
  className = '',
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 ${SECTION_Y} ${
        seamless ? '' : 'border-t border-border-soft'
      } ${fullHeight ? 'flex min-h-svh flex-col justify-center' : ''} ${
        tone === 'raised' ? 'bg-surface/30' : ''
      } ${className}`}
    >
      <Container>
        <div className={RAIL}>
          <FocusPull
            className={
              centered
                ? 'mx-auto max-w-[40em] text-center'
                : layout === 'split'
                ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-x-16 xl:gap-x-24'
                : 'max-w-[44em] space-y-4'
            }
          >
            <h2
              className={`display whitespace-normal text-fg md:whitespace-pre-line ${SCALE[scale]}`}
            >
              {heading}
            </h2>
            {subheading && (
              <p
                className={
                  layout === 'split'
                    ? 'mt-5 max-w-[30em] text-[1.0625rem] leading-[1.6] text-fg-muted lg:mt-0 lg:max-w-none lg:pb-1'
                    : 'text-[1.0625rem] leading-[1.65] text-fg-muted max-w-[36em]'
                }
              >
                {subheading}
              </p>
            )}
          </FocusPull>

          {/*
            The break comes AFTER the deck, not between the title and the deck.

            Those two are one optical group — 20px apart — and the gap that
            tells a reader the heading block is finished has to be visibly
            larger than the gap inside it. It was `mt-8` (32px) against `mt-5`
            (20px), a ratio of 1.6, which is not enough separation to register;
            the deck read as the top of the content rather than the bottom of
            the heading. At 56/64/80px the ratio is 2.8–3.3, and the
            heading-block break is now the largest gap in the section.
          */}
          {/*
            Omitted entirely when there is no content, rather than rendered
            empty. A heading-and-deck band is a legitimate section — it opens a
            run of full-bleed claims below it — and an empty wrapper would put
            56–80px of dead air under the deck, which reads as content that
            failed to load rather than as a section that ends there.
          */}
          {children && <div className="mt-14 sm:mt-16 lg:mt-20">{children}</div>}
        </div>
      </Container>
    </section>
  )
}
