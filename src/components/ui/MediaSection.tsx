import type { ReactNode } from 'react'
import FocusPull from './FocusPull'
import MediaBackdrop from './MediaBackdrop'
import type { ImageSources, VideoSources } from './MediaBackdrop'

/**
 * Desktop heights are deliberately unequal. This is the single biggest
 * departure from the old page, where eleven consecutive `min-h-svh` sections
 * scrolled past as identical slabs. Below 768px every section is content-sized
 * instead — a fixed height on a phone just clips copy.
 *
 * `min-h`, not `h`: the section carries `overflow-hidden` so the scrim's
 * overscan never escapes it, which means a hard height would silently clip any
 * section whose copy outgrew the frame — and the copy here comes from a deck
 * that is still being edited.
 */
/**
 * The brief is that every section covers the full screen, so all four steps
 * resolve to the viewport. They are kept as distinct names because they still
 * drive the type scale below (`step = scale ?? height`) and because unequal
 * heights are the first thing to reach for if the full-screen rhythm is ever
 * relaxed.
 *
 * `min-h-svh`, not a fixed px height: content taller than the viewport grows
 * rather than clipping, and `svh` keeps mobile browser chrome out of it.
 */
const HEIGHT = {
  epic: 'min-h-svh',
  tall: 'min-h-svh',
  mid: 'min-h-svh',
  short: 'min-h-svh',
} as const

/**
 * Copy is parked with percentage margins, not a grid column, so the asset can
 * be shot/rendered with its negative space exactly where the words land and the
 * two never fight. Sections alternate side to break the rhythm.
 */
const PLACE = {
  left: 'md:ml-[6%] md:mr-[46%] md:items-start md:text-left',
  right: 'md:ml-[46%] md:mr-[8%] md:items-start md:text-left',
  center: 'md:mx-auto md:items-center md:text-center',
} as const

/** The section's own `md:py-24` supplies the inset; these only pick the edge. */
const ANCHOR = {
  top: 'md:justify-start',
  center: 'md:justify-center',
  bottom: 'md:justify-end',
} as const

/**
 * Display steps, on ONE ladder with `SectionShell`.
 *
 * `tall` used to render at 72px against SectionShell's `lead` at 52 — so Platform
 * and Onboarding, both mid-page, outranked Products and Pricing, which are the
 * sections a visitor arrives for. With two competing ladders nothing read as
 * primary. `tall` now matches `lead` exactly, and the hero at 104px is the only
 * heading on the page above this scale.
 *
 * Leading opens up as the size drops — a grotesk this tight
 * needs the air at 2.25rem that it does not need at 5.75rem, where the line
 * length itself does the separating. Tracking and the variable-axis coordinate
 * come from `.display`; setting them per step would fight the optical sizing
 * the face is already doing.
 */
const SCALE = {
  epic: 'text-[clamp(2.5rem,4.6vw,4rem)] leading-[1.05]',
  tall: 'text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08]',
  mid: 'text-[clamp(2rem,3.4vw,3rem)] leading-[1.1]',
  short: 'text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.14]',
} as const

interface MediaSectionProps {
  id: string
  height?: keyof typeof HEIGHT
  place?: keyof typeof PLACE
  anchor?: keyof typeof ANCHOR
  /** Type step. Defaults to matching the height. */
  scale?: keyof typeof SCALE
  /**
   * Scrim strength, 0–1, tuned per asset. Set 0 when the plate is already dark
   * enough — a blanket `bg-black/50` over every section is the tell we are
   * removing, not a default to reach for.
   */
  scrim?: number
  /** Where the scrim's dense core sits. Put it under the copy, not the middle. */
  scrimAt?: string
  /** `\n` is an art-directed line break, honoured at ≥768px only. */
  headline: string
  /**
   * Which face the headline is set in.
   *
   * `serif` is reserved for the page's single editorial moment — the closing
   * statement. A serif used once is a change of register and lands; a serif
   * used in three places is just a second default. If you are reaching for this
   * on a second section, the answer is no.
   */
  voice?: 'display' | 'serif'
  /**
   * Measure in `em`, not `px` or `ch`, so the headline breaks in the same place
   * at every breakpoint instead of re-ragging as the clamp resizes it.
   */
  measure?: string
  body?: ReactNode
  actions?: ReactNode
  /** Disclosures live inside the section, under the CTA — never in a legal ghetto. */
  finePrint?: ReactNode
  /** Extra content below the CTA, still inside the overlay. */
  children?: ReactNode
  media: {
    alt: string
    image?: ImageSources
    video?: VideoSources
    poster?: string
    tone?: string
  }
  className?: string
}

/**
 * Full-bleed section: media pinned behind, copy overlaid on it.
 *
 * Stacking is flat by design — the backdrop sits at `z-index: -999` and the
 * scrim at `-1`, both inside this section's stacking context, so the copy stays
 * in normal document flow and needs no z-index. Nothing is layered *over* the
 * text, which is what keeps live disclosure text selectable and contrast-safe.
 *
 * This lives outside `Container` on purpose: Container caps at 1760px, and a
 * bleed section must reach the viewport edge. The inner rail re-imposes that cap
 * on the copy alone so percentage margins stay sane on an ultrawide display.
 */
export default function MediaSection({
  id,
  height = 'tall',
  place = 'left',
  anchor = 'center',
  scale,
  scrim = 0.82,
  scrimAt = '32% 50%',
  headline,
  voice = 'display',
  measure = '11em',
  body,
  actions,
  finePrint,
  children,
  media,
  className = '',
}: MediaSectionProps) {
  const step = scale ?? height

  /*
   * `isolate` is load-bearing, not decoration. `relative` alone does not open a
   * stacking context, so the backdrop at z-index:-999 and the scrim at -1 would
   * resolve against the root and paint *behind* App's opaque `bg-bg` wrapper —
   * the media would render, invisibly, under the page.
   */
  return (
    <section
      id={id}
      className={`relative isolate flex w-full scroll-mt-24 flex-col overflow-hidden ${HEIGHT[height]} ${className}`}
    >
      {/*
        The plate is lit on the side the copy is NOT on. `place` already encodes
        that, so the caller never has to state it twice and the two cannot drift
        apart — which they would the moment this was a separate prop.

        Only reaches the no-asset plate; a real image or video ignores it.
      */}
      <MediaBackdrop
        focus={place === 'right' ? 'left' : place === 'center' ? 'center' : 'right'}
        {...media}
      />

      <div className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col px-5 py-20 sm:px-6 md:px-0 md:py-24">
        <div className={`relative flex flex-1 flex-col ${ANCHOR[anchor]}`}>
          {/* Scrim overscans the section so its soft edge never lands inside the frame. */}
          {scrim > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[20%] -bottom-[20%] -top-[25%]"
              style={{
                zIndex: -1,
                backgroundImage: `radial-gradient(58% 62% at ${scrimAt}, rgba(5,5,5,${scrim}) 0%, rgba(5,5,5,${(scrim * 0.72).toFixed(3)}) 44%, rgba(5,5,5,0) 100%)`,
              }}
            />
          )}

          <div className={`flex flex-col items-start text-left ${PLACE[place]}`}>
            {/*
              The headline comes into focus against its plate, matching the
              treatment every `SectionShell` heading gets — so a full-bleed
              section and a flat one share one gesture instead of reading as two
              systems.

              Only the headline. The body, the CTA and `finePrint` are left
              untouched on purpose: `finePrint` is where disclosures live, and a
              disclosure inside an entrance that starts at zero opacity is
              illegible to anyone who stops scrolling mid-tween.
            */}
            <FocusPull
              as="h2"
              className={`m-0 whitespace-normal text-fg md:whitespace-pre-line ${
                voice === 'serif' ? 'display-serif' : 'display'
              } ${SCALE[step]}`}
            >
              <span className="block" style={{ maxWidth: measure }}>
                {headline}
              </span>
            </FocusPull>

            {/* Same deck step as `SectionShell` — 18px in a 34em measure. A
                full-bleed section's standfirst and a flat one's have to match, or
                the page has two ideas about what a subtitle is. */}
            {body && (
              <div className="mt-5 max-w-[34em] text-lg leading-relaxed text-fg-muted">{body}</div>
            )}

            {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}

            {children}

            {finePrint && (
              <div className="mt-8 max-w-[46em] text-[0.8125rem] leading-relaxed text-white/55">
                {finePrint}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
