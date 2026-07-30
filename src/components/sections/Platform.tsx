import { ArrowRight } from 'lucide-react'

import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import MediaBackdrop from '../ui/MediaBackdrop'
import { plateImage } from '../../lib/media'
import { GUTTER_X, RAIL, SECTION_Y } from '../ui/SectionShell'

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

/**
 * §A4's "alt text to ship", verbatim. It describes the subject rather than
 * naming a file, so it survives the asset being re-rendered.
 */
const platformPlateAlt =
  'A macro view across the edge of dark glass, one narrow band in sharp focus and the rest falling away.'

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
      {/*
        Plate A4, replacing the `SignalCanvas` field this section ran while
        there was no image pipeline. Two reasons, and neither is that the canvas
        looked bad.

        **The page's motion budget.** Robinhood's homepage carries video on
        exactly two sections — the opening and the closing — and nothing moving
        in between. This page now matches that: the hero loop and the closing
        loop, with every mid-page section still. A live canvas here made
        Platform a third moving surface, competing with the two that are meant
        to bracket the scroll.

        **§5.5's system read.** The test is whether the plates look like one
        shoot: same room, same key, same black point. A procedural field is the
        one frame that could never join that set — it is made of different
        material, lit by nothing, and graded by hand. §A4's macro glass edge is
        lit by the same 5600K key as the other five and bottoms out on the same
        ink.

        The dead zone moves with it and gets stricter: the canvas took a
        `deadZone` prop and kept its marks out of the right 54%; the plate
        reserves x 44–100%, y 14–86% *in the render*, before the grade, so the
        copy column contains no edges rather than merely no bright ones (§2.7).
      */}
      <MediaBackdrop
        alt={platformPlateAlt}
        image={plateImage('platform')}
        tone="var(--color-bg)"
      />

      {/* `MediaSection`'s rail, imported rather than transcribed. It had drifted:
          this kept `md:px-0`, which drops the gutter to zero from 768px, while
          MediaSection had moved to Container's full ladder. Two full-bleed
          sections with different gutters is exactly the uneven padding the rest
          of this pass is removing. */}
      <div
        className={`mx-auto flex w-full max-w-[1760px] flex-1 flex-col ${GUTTER_X} ${SECTION_Y}`}
      >
        <div className={`relative flex flex-1 flex-col md:justify-center ${RAIL}`}>
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
              /* Matches `MediaSection`'s `tall` and `SectionShell`'s `lead`. This heading
                 is hand-written because the section renders SignalCanvas rather than
                 a MediaSection, and it kept the old 4.5rem cap after the ladder was
                 unified — rendering at 72px against every lead section's 56px. */
              className="display m-0 whitespace-normal text-[clamp(2.5rem,4.6vw,4rem)] leading-[1.04] text-fg md:whitespace-pre-line"
              style={{ maxWidth: '9em' }}
            >
              {headline}
            </h2>

            {/* The shared deck step. This was the page's only 16px deck, set in
                `white/70` — a full step under every other standfirst and dimmer
                than the tool list beneath it, so the section's own body copy
                out-ranked its subtitle. `fg-muted` rather than a white alpha
                because an alpha's contrast depends on whatever the scrim happens
                to resolve to underneath it. */}
            <div className="mt-5 max-w-[30em] text-[1.0625rem] leading-[1.6] text-fg-muted lg:mt-6">
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
            <Reveal variant="shear" delay={120} className="mt-10 w-full">
              {/* Row-major fill, so the visual order matches the DOM order a
                  screen reader announces. Capped to the same RENDERED width as
                  the deck above it so the two blocks share a right edge instead
                  of the list sprawling to the full 46% column on a wide display.

                  The cap is 31.875em and that number is arithmetic, not taste:
                  `em` resolves against each element's own font size, so matching
                  the deck means matching px, not `em`. The deck is 30em at 17px
                  = 510px; this list is 16px, so it needs 510 / 16 = 31.875em.
                  It was 34em back when the deck was also 16px — when the deck
                  moved to the 17px step, an unchanged 34em here would have
                  silently pushed the list 34px past the deck's right edge.

                  `text-base`, not a 15px step: it is the page's body-copy floor,
                  and at 16px the longest name ("Baskets & multi-leg") still
                  clears the 157px column the 46% rail leaves at 768px, so
                  nothing wraps and the block stays well inside the section. */}
              <ul
                aria-label="Platform capabilities"
                className="grid max-w-[31.875em] grid-cols-1 gap-x-8 sm:grid-cols-2 sm:gap-x-10"
              >
                {tools.map((tool) => (
                  <li
                    key={tool.title}
                    className="border-t border-white/15 py-3 text-base leading-snug text-fg-muted"
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
