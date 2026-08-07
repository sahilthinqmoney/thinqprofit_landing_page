import type { ReactNode } from 'react'
import FocusPull from './FocusPull'
import MediaBackdrop from './MediaBackdrop'
import { GUTTER_X, RAIL, SECTION_Y } from '../../lib/layout'
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
  mid: 'min-h-[65vh] py-12',
  short: 'min-h-[50vh] py-8',
} as const



/**
 * Copy is parked with percentage margins, not a grid column, so the asset can
 * be shot/rendered with its negative space exactly where the words land and the
 * two never fight. Sections alternate side to break the rhythm.
 */
const PLACE = {
  /*
   * `left` takes NO left margin. The gutter comes from the wrapper below, which
   * now runs Container's exact padding ladder — so a full-bleed section's copy
   * starts on the same left edge as every flat section's heading.
   *
   * It used to be `md:ml-[6%]`, and that was a unit mismatch rather than a
   * design decision: 6% of the frame is 86px at 1440 against Container's fixed
   * 48px, so Onboarding's headline sat 38px inboard of the nine headings above
   * and below it. One left edge from the nav to the footer is the page's rule,
   * and a percentage cannot hold it — the offset changes with every viewport
   * width, so the two edges were never wrong by the same amount twice.
   *
   * The percentage stays on the OPPOSITE margin, which is where it belongs: how
   * much of the frame the copy leaves for the asset genuinely is a fraction of
   * the frame, and has no edge to align to.
   */
  left: 'md:mr-[46%] md:items-start md:text-left',
  right: 'md:ml-[46%] md:items-start md:text-left',
  center: 'md:mx-auto md:items-center md:text-center',
} as const

/** The inner rail's `SECTION_Y` supplies the inset; these only pick the edge. */
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
 * primary. `tall` now matches `lead` exactly, and `SCALE.hero` — the H1's step,
 * exported from `SectionShell` — is the only thing on the page above this scale.
 *
 * Leading opens up as the size drops: a display cut this tight needs the air at
 * 2.125rem that it does not need at 4.5rem, where the line length itself does
 * the separating. Tracking and the variable-axis coordinate come from
 * `.display`; setting them per step would fight the face.
 *
 * EVERY LEADING HERE GAINED +0.04em ON THE MOVE TO IBM PLEX, and the sizes did
 * not. The full derivation is in `SectionShell`'s SCALE, because both ladders
 * take the same correction and it must not be re-argued in two places; the short
 * form is that Plex's ascender-to-descender ink span measures 0.952em at weight
 * 600 against Archivo's 0.913em, so at an unchanged line-height the gap between
 * lines closes by 0.039em everywhere.
 *
 * Checked at the two steps that render. `mid` carries all four Terminal claim
 * plates: worst pair is "The copilot / has hands", where Archivo gave a 10.30px
 * ink gap, Plex at the old 1.08 gives 7.84px, and Plex at 1.12 gives 10.08px.
 * The art-directed `\n` breaks all hold inside the 9em (504px) measure those
 * plates use — widest line 346.7px in Plex against 337.1px in Archivo — so this
 * is leading alone and no plate re-rags. `mid` also carries the closing
 * statement, where it is overridden: `.display-quiet` declares its own 1.24 and
 * wins on source order, which is deliberate and documented in index.css.
 */
const SCALE = {
  epic: 'text-[clamp(2.75rem,5.2vw,4.5rem)] leading-[1.06]',
  tall: 'text-[clamp(2.5rem,4.6vw,4rem)] leading-[1.08]',
  mid: 'text-[clamp(2.25rem,4.1vw,3.5rem)] leading-[1.12]',
  short: 'text-[clamp(2.125rem,3.9vw,3.25rem)] leading-[1.14]',
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
   * Which voice the headline is set in.
   *
   * `quiet` is reserved for the page's single editorial moment — the closing
   * statement. Used once it is a change of register and lands; used in three
   * places it is just a second default. If you are reaching for this on a
   * second section, the answer is no.
   *
   * It was `serif` and it selected `.display-serif`, which set Newsreader. Both
   * are gone with the move to a single IBM Plex family, and the rename is not
   * cosmetic: a prop value naming a face the page no longer loads is exactly
   * the falsified rationale this codebase refuses, and the class it pointed at
   * had already been deleted — so `voice="quiet"` was silently falling through
   * this ternary to `.display` and the closing statement was rendering in the
   * loud voice, with the whole argument for a quiet one written and unapplied.
   */
  voice?: 'display' | 'quiet'
  /**
   * Measure in `em`, not `px` or `ch`, so the headline breaks in the same place
   * at every breakpoint instead of re-ragging as the clamp resizes it.
   */
  measure?: string
  body?: ReactNode
  actions?: ReactNode
  /**
   * Content for the half of the frame `place` reserves for the asset.
   *
   * `place` has always parked the copy against one margin and left 46% of the
   * frame for the plate to be read in. That reservation is correct when the
   * plate has a subject in it; it is dead space when the plate is a dark
   * gradient, which is what §3's terminal crop actually renders as at desktop
   * widths — a machined edge in the far corner and 46% of near-black between it
   * and the words.
   *
   * So the slot is optional and it is a slot, not a second copy column: it takes
   * the reserved area on `md` and up, and on a phone it stacks under the copy,
   * where the percentage margins do not apply at all.
   *
   * Absolutely positioned rather than a grid column on purpose. The copy block's
   * height is what sets the section's height, and a two-column grid would let a
   * tall aside push the section taller than its own headline needs — which is
   * how a full-bleed band stops being able to promise `min-h-svh` and starts
   * being however tall its illustration is.
   */
  aside?: ReactNode
  /** Disclosures live inside the section, under the CTA — never in a legal ghetto. */
  finePrint?: ReactNode
  /** Extra content below the CTA, still inside the overlay. */
  children?: ReactNode
  media: {
    alt: string
    image?: ImageSources | string
    video?: VideoSources | string
    poster?: string
    tone?: string
    blur?: boolean
  }
  /** Optional top-level background ambient layer (full bleed) */
  bgAmbient?: ReactNode
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
  aside,
  finePrint,
  children,
  media,
  bgAmbient,
  className = '',
}: MediaSectionProps) {
  const step = scale ?? height

  /*
   * The aside takes the margin the copy gives up, mirrored off `place` so the
   * two can never end up on the same side. `left` copy runs to 54% and the
   * aside starts at 58%, which leaves a 4% channel between them — enough that
   * the two blocks read as adjacent rather than as one wrapped column, and not
   * so much that the aside is pushed into the gutter.
   */
  const ASIDE_PLACE = {
    left: 'md:left-[48%] md:right-0',
    right: 'md:left-0 md:right-[48%]',
    center: 'md:inset-x-0',
  } as const

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
      {bgAmbient}


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

      {/* `Container` + `RAIL`, reproduced exactly — 1760px cap and gutter
          ladder on the outside, 84rem rail within it. Both layers are needed:
          the outer one is Container, the inner one is what every `SectionShell`
          puts inside Container, and skipping the inner one is what left this
          section's copy starting at 128px on a 1920px display while every flat
          section above and below it started at 288px.

          The section itself still bleeds to the viewport edge — only the copy is
          railed. That is the whole point of the split. */}
      <div className={`mx-auto flex w-full max-w-[1760px] flex-1 flex-col ${GUTTER_X} ${SECTION_Y}`}>
        <div className={`relative flex flex-1 flex-col ${RAIL} ${ANCHOR[anchor]}`}>
          {/* Scrim overscans the section so its soft edge never lands inside the
              frame.

              The ink is `--color-bg` mixed toward transparent, not a literal
              triple. It was `rgba(5,5,5,a)`, which was the ground when it was
              written and is now 1.0522:1 below it — so every full-bleed section
              on the page was being darkened toward a value that is not the page,
              at chroma 0.0000 against the ground's 0.0038. On a copper-lit plate
              that is the one place a cool cast shows: the scrim's falloff runs
              straight into the warm crest it is supposed to sit under. Mixing
              the token cannot drift from it. Alpha stops are unchanged (`scrim`,
              `scrim × 0.72`, 0), so the falloff is identical and only its hue
              moves. `Platform` transcribes this geometry and already made the
              same move. */}
          {scrim > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[20%] -bottom-[20%] -top-[25%]"
              style={{
                zIndex: -1,
                backgroundImage: `radial-gradient(58% 62% at ${scrimAt}, color-mix(in oklab, var(--color-bg) ${(scrim * 100).toFixed(1)}%, transparent) 0%, color-mix(in oklab, var(--color-bg) ${(scrim * 72).toFixed(1)}%, transparent) 44%, transparent 100%)`,
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
                /* The optical ladder, picked off the step rather than the
                   section: `epic` and `tall` render 40–72px, which is where
                   `.display-lead`'s lighter weight and tighter track are solved
                   for; `mid` and `short` render 34–56px and take `.display`. The
                   quiet voice opts out of both — it declares its own axis
                   coordinate, which is the whole point of it. */
                voice === 'quiet'
                  ? 'display-quiet'
                  : step === 'epic' || step === 'tall'
                    ? 'display-lead'
                    : 'display'
              } ${SCALE[step]}`}
            >
              <span className="block" style={{ maxWidth: measure }}>
                {headline}
              </span>
            </FocusPull>

            {/* Same deck step as `SectionShell` — 17px in a 30em measure. A
                full-bleed section's standfirst and a flat one's have to match, or
                the page has two ideas about what a subtitle is. */}
            {body && (
              <div className="mt-5 max-w-[30em] text-[1.0625rem] leading-[1.6] text-fg-muted lg:mt-6">
                {body}
              </div>
            )}

            {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}

            {children}

            {/*
              `fg-subtle`, not `text-white/55`, and this is a live text slot —
              `Terminal` passes plain strings through it, so the colour declared
              here is the colour those sentences render in. (`FinalCta` passes a
              `Disclosure`, which sets its own and overrides this by
              inheritance.)

              White at 55% composites to #919090 over the new ground: 6.275:1,
              chroma 0.0012. `fg-subtle` is 5.3087:1 on bg and 4.7179:1 on the
              raised surface — a real drop, and it is the right trade twice over.
              First, this text is read directly beside body copy set in `fg-muted`
              at chroma 0.0078, and a dead-neutral grey next to a warm one is the
              cool-patch defect the whole palette moved to avoid. Second, an
              alpha's contrast is a property of whatever it lands on, and this
              slot always lands on a media plate under a scrim — so the 6.275:1
              was never the number that rendered.

              THE HALF OF THAT ARGUMENT THAT WAS WRONG, corrected rather than
              trimmed, because it pointed the wrong way. It said "5.3087:1 is a
              floor the token guarantees". It is not a floor, it is a CEILING:
              5.3087:1 is the value on `bg`, and every surface this slot can
              actually sit on is lighter than `bg`, so the token can only go
              down from there — 5.0620:1 on `surface`, 4.7179:1 on
              `surface-raised`, and on a lit plate it goes under 4.5:1. Swapping
              an alpha for a token buys a number that is COMPUTABLE, not one
              that is guaranteed.

              So here is the constraint with its number, which is what the claim
              should have been. `fg-subtle` holds 4.5:1 only while the pixel
              behind it stays below relative luminance Y 0.0120 — about neutral
              #1D1D1D. Measured on the rendered page at 1920/1440/1024/768/390,
              the brightest pixel under any glyph in this slot is #0A0909 and the
              worst ratio is 5.2846:1, so it holds today with ~11% of headroom in
              contrast terms; `PendingField`'s own lit face #251E1B would put it
              at 4.3588:1, which is the margin this slot is working inside.
              `FinalCta` states the same constraint from the plate's side (its
              scrim puts the ceiling at plate grey 89, 4.5071:1) and that is the
              form to copy: the plate is the variable, the token is not.

              It clears 4.5:1 at this 13px size on every surface it renders on.
              `Platform` made this exact move for its deck and states the same
              second reason.
            */}
            {finePrint && (
              <div className="mt-8 max-w-[46em] text-[0.8125rem] leading-relaxed text-fg-subtle">
                {finePrint}
              </div>
            )}

            {/*
              The aside, on a phone. It follows the copy in the DOM at every
              width, so the reading order and the focus order are the same order
              at both — the desktop version only moves where it PAINTS, via
              absolute positioning, and never where it sits in the document.

              That is the whole reason this is one element with a responsive
              position rather than two elements with a `hidden md:block` pair:
              duplicating it would put the same content in the accessibility
              tree twice, and hiding one copy per breakpoint is how a screen
              reader ends up reading a section that is not on the screen.
            */}
            {aside && (
              <div
                className={`mt-12 w-full md:absolute md:top-1/2 md:mt-0 md:w-auto md:-translate-y-1/2 ${ASIDE_PLACE[place]}`}
              >
                {aside}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
