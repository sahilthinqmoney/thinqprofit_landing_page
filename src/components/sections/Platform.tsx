import { ArrowRight } from 'lucide-react'

import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import SignalCanvas from '../ui/SignalCanvas'

import { platformCta, platformHeading, platformSubheading, tools } from '../../data/platform'

/**
 * Art-directed rag. The headline honours `\n` at ≥768px only, so this is a
 * desktop-only instruction — below that the headline re-rags to the viewport.
 *
 * The break isolates "ten seconds" on its own line, because that phrase is the
 * entire claim. Derived from the copy string rather than retyped, so a deck edit
 * can never leave a stale headline on the page: if the phrase moves, `replace`
 * no-ops and the raw string renders unbroken.
 *
 * The longest resulting line, "Built for the", sets well inside the 9em measure
 * in Archivo at the display tracking, so none of the three lines can re-rag by
 * accident as the clamp resizes the type. The headline is unchanged by the copy
 * cut below it — shortening a headline is what re-rags a measure, and this one
 * was already the minimal form.
 */
const headline = platformHeading.replace(' ten seconds ', '\nten seconds\n')

interface PlatformProps {
  /** Anchor target. Matches the nav's Platform link. */
  id?: string
}

/**
 * §6 Platform & tools — full-bleed, copy overlaid on the media.
 *
 * Replaces the boxed layout this section used to run: a sticky faux-macOS
 * terminal panel beside a numbered spec list. The window chrome, the 01–10
 * ordinals and the per-row icon tiles are all gone. Three separate decorations
 * competing over a ten-item list is what made the section read as a template,
 * and none of them survive being set on top of a moving plate. What is left is
 * the thing that does: bare text on hairlines.
 *
 * The ten `tool.body` descriptions do not come along. With copy in the right 46%
 * of a viewport-tall frame, the headline/body/CTA stack already spends about
 * half of it; ten two-to-four-line descriptions need ~500px more and would be
 * clipped by the section's `overflow-hidden`. The capability names carry the
 * breadth claim on their own — the descriptions belong on the tour page the CTA
 * points at, not compressed to four-line slivers here.
 *
 * The backdrop is a live canvas (SignalCanvas), not the briefed macro clip that
 * MediaBackdrop was holding space for. There is no image pipeline here, and a
 * pending field is a placeholder either way; a procedural plate is the same
 * darkness, costs a few KB instead of megabytes, loops with no seam, and is
 * matched to the tokens in index.css rather than to a plate. Its concept —
 * scattered marks with a route resolving through them — says "instrumentation"
 * without rendering a single UI element, which was §5.2's whole brief.
 *
 * This section builds its own frame rather than going through `MediaSection`,
 * for exactly one reason: `MediaSection` hard-wires `MediaBackdrop` as its
 * backdrop layer, and there is no seam to pass a canvas through. Every measure
 * below — heights, placement, type step, scrim geometry — is `MediaSection`'s
 * `height="tall" place="right" anchor="center" scrim={0.86} scrimAt="68% 50%"`
 * transcribed, so the section sits in the page's rhythm unchanged. Only the
 * backdrop layer differs.
 *
 * Constraints honoured:
 *  - no hue at all in this frame, not merely no green or red. The section is
 *    white on ink; the only coloured tokens left in the system are gain, loss
 *    and warning, and none of the three is section decoration.
 *  - `accent` is spent on the CTA alone. It is the brightest surface in the
 *    palette and the only one that moves, and with no hue to carry it that
 *    luminance is the whole signal — so the field behind it runs on `chrome`, a
 *    deliberate step down, and only the route's few lit pixels reach accent. The
 *    dead zone below keeps even those out of the copy column, so nothing near
 *    the button is as bright as the button.
 *  - nothing sits behind blur or glass. The scrim is a flat radial pinned at
 *    z-index -1 behind live text. `text-white/80` resolves to #CDCDCD on this
 *    ink — 12.8:1, measured where the copy actually sits rather than at the
 *    field's brightest point, because the dead zone excludes the two.
 */
export default function Platform({ id = 'platform' }: PlatformProps) {
  return (
    /*
     * `isolate` is load-bearing, not decoration. `relative` alone does not open
     * a stacking context, so the backdrop at z-index:-999 and the scrim at -1
     * would resolve against the root and paint behind App's opaque `bg-bg`
     * wrapper — the canvas would render, invisibly, under the page.
     */
    <section
      id={id}
      className="relative isolate flex min-h-svh w-full scroll-mt-24 flex-col overflow-hidden"
    >
      {/* Backdrop region. Same pin as MediaBackdrop: behind everything in this
          section's stacking context, so the copy stays in normal document flow
          and needs no z-index of its own. The tone is the page's own ink, taken
          from the token and not a hex — the canvas supplies the light, and a
          backdrop that is a few levels off `bg` shows up as a seam at the
          section boundary where nothing else is lit. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg)', zIndex: -999 }}
      >
        {/* Copy owns the right 46% from 768px up, so the field is kept out of
            the right 54% entirely and feathers back in over 18% of the width —
            the lit route never reaches the text at all, and the scrim below is
            working on ink rather than fighting it. */}
        <SignalCanvas deadZone={{ side: 'right', extent: 0.54, feather: 0.18 }} />
      </div>

      <div className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col px-5 py-20 sm:px-6 md:px-0 md:py-24">
        <div className="relative flex flex-1 flex-col md:justify-center">
          {/* Scrim overscans the section so its soft edge never lands inside the
              frame. Its dense core sits under the copy, not in the middle.

              Geometry is MediaSection's, transcribed. The ink is not: that file
              still writes the scrim as literal `rgba(11,11,13,a)`, which was the
              plate colour of the superseded palette and now sits *lighter* than
              `bg` — a scrim mixed toward a value above its own ground stops
              darkening and starts hazing, lifting a faint rectangle under the
              copy. Mixing the token with transparent keeps it a scrim and keeps
              it tied to whatever `bg` is. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[20%] -bottom-[20%] -top-[25%]"
            style={{
              zIndex: -1,
              backgroundImage:
                'radial-gradient(58% 62% at 68% 50%, color-mix(in oklab, var(--color-bg) 86%, transparent) 0%, color-mix(in oklab, var(--color-bg) 61.9%, transparent) 44%, transparent 100%)',
            }}
          />

          <div className="flex flex-col items-start text-left md:ml-[46%] md:mr-[8%] md:items-start md:text-left">
            <h2
              className="display m-0 whitespace-normal text-[clamp(2.75rem,5.4vw,4.5rem)] leading-[1.07] text-fg md:whitespace-pre-line"
              style={{ maxWidth: '9em' }}
            >
              {headline}
            </h2>

            <div className="mt-6 max-w-[34em] text-base leading-relaxed text-white/70">
              {platformSubheading}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#" aria-label={platformCta}>
                {platformCta}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </div>

            {/* One reveal for the whole block, not ten staggered rows. A per-item
                stagger across a ten-item list reads as an entrance animation
                playing at the reader; the list should simply arrive with the
                copy it belongs to, one beat behind it. */}
            <Reveal delay={120} className="mt-10 w-full">
              {/* Row-major fill, so the visual order matches the DOM order a
                  screen reader announces. Capped at the same 34em as the body
                  copy above it so the two blocks share a right edge instead of
                  the list sprawling to the full 46% column on a wide display.

                  `text-base`, not a 15px step: `em` resolves against each
                  element's own font size, so 34em on a 15px list is 510px
                  against the body's 544px — the shared right edge this cap
                  exists for only lines up if both blocks are set at 16px. It is
                  also the page's body-copy floor. At 16px the longest name
                  ("Baskets & multi-leg") still clears the 157px column the 46%
                  rail leaves at 768px, so nothing wraps and the block stays well
                  inside the section's fixed height. */}
              <ul
                aria-label="Platform capabilities"
                className="grid max-w-[34em] grid-cols-1 gap-x-8 sm:grid-cols-2 sm:gap-x-10"
              >
                {tools.map((tool) => (
                  <li
                    key={tool.title}
                    className="border-t border-white/15 py-3 text-base leading-snug text-white/80"
                  >
                    {tool.title}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
