import { ArrowRight } from 'lucide-react'

import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import MediaBackdrop from '../ui/MediaBackdrop'
import { plateImage } from '../../lib/media'
import { GUTTER_X, RAIL, SCALE, SECTION_Y } from '../ui/SectionShell'

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
 * The three lines still clear the 9em measure, but the numbers behind that
 * changed with the face and one of the claims did not survive. Measured in IBM
 * Plex Sans at `'wdth' 82, 'wght' 600, letter-spacing -0.028em` against the
 * 4rem clamp ceiling — 9em at 64px = 576px:
 *
 *   "Built for the"   277.4px in Archivo → 303.6px in Plex, 52.7% of measure
 *   widest of the three                     311.6px in Plex, 54.1% of measure
 *
 * So "Built for the" is NOT the longest line any more — Plex's wider lowercase
 * moves that to another of the three — and the old sentence naming it as the
 * longest is dropped rather than re-pointed, since which line is widest is not
 * the load-bearing fact. The load-bearing fact is the 45.9% of slack, which is
 * what stops any of the three re-ragging as the clamp resizes the type.
 *
 * The headline is unchanged by the copy cut below it — shortening a headline is
 * what re-rags a measure, and this one was already the minimal form.
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
 * The backdrop is plate A4 through `MediaBackdrop` — a still. It ran a live
 * canvas (`SignalCanvas`) while there was no image pipeline, and this paragraph
 * still described that canvas long after the plate replaced it; the argument
 * for the swap is at the call site below. `SignalCanvas` has no importer
 * anywhere in `src` now.
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
 *  - one hue in this frame, and it is the brand's. Gain, loss and warning stay
 *    out entirely, and none of the three is ever section decoration.
 *  - `accent` is spent on the CTA and on nothing else in this frame. The
 *    previous version of this bullet said "on the CTA and on the live route",
 *    and re-argued the field's colour against `chrome` — both describe the
 *    canvas this section no longer renders. There is no route and no field to
 *    pick: the backdrop is a photographed plate, and sampled off the shipped
 *    WebP it is pure greyscale (0.0% of pixels with r ≠ g ≠ b) with a floor of
 *    #030303 and a peak of #676767. So the CTA is the only chromatic thing in
 *    the frame by construction, not by budget. What the plate's own render
 *    reserves — x 44–100%, y 14–86% — is what keeps its lit pixels out of the
 *    copy column, so nothing near the button competes with the button.
 *  - nothing sits behind blur or glass. The scrim is a flat radial pinned at
 *    z-index -1 behind live text, and the copy is on tokens rather than on
 *    white alphas, which is a change this bullet had not caught up with. It
 *    claimed `text-white/80` resolves to #CDCDCD, 12.8:1. Recomputed: white at
 *    80% composites to #CDCDCD / 12.8208:1 on the old #050505 and to #CECECE /
 *    12.6948:1 on the new #0A0808 — but neither is what renders, because the
 *    deck moved to `fg-muted` and there is no `text-white/80` left in this file.
 *    The number that IS live is `--color-fg-muted` #D7D1CE at 13.2245:1 on the
 *    ground, and it barely moves with the plate: at the scrim's 86% core over
 *    the plate's own median (#0a0a0a) the composite resolves to #0A0808 — the
 *    ground exactly — so 13.2245:1 is measured where the copy actually sits,
 *    not assumed. The two worst cases, both computed against the plate's
 *    brightest sampled pixel (#676767) rather than its median: under the 86%
 *    core, #171515 and 12.0403:1; under the 61.9% ring at the scrim's 44% stop,
 *    #2D2C2C and 9.2167:1. The floor for the whole section is therefore 9.22:1,
 *    2.0× body copy's 4.5:1, and it is a floor rather than a guess because the
 *    plate is a fixed asset. A white alpha would have had none of these
 *    guarantees — that is the reason the deck is a token.
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

              Geometry is MediaSection's, transcribed. The ink is not, and the
              reason has changed twice, so it is restated from measurement
              rather than carried. It used to read: "that file still writes the
              scrim as literal `rgba(11,11,13,a)`, which now sits *lighter* than
              `bg`". MediaSection has since moved to `rgba(5,5,5,a)`
              (MediaSection.tsx:211), so the hex named here is gone — but the
              defect did not go with it, it inverted. `rgba(5,5,5,a)` is 1.0202:1
              *darker* than today's ground, so that scrim now mixes toward a
              value below its own ground: it keeps darkening past the page and
              lands a cool near-black core under the copy on a ground at OKLCH
              hue 17.6°.

              Mixing the token with transparent avoids both failures by
              construction — the scrim can only ever converge on whatever `bg`
              is, so its core is the page and not a fourth value. Measured here:
              the 86% core over the plate's median resolves to #0A0808 exactly,
              which is why the deck's contrast can be quoted as a flat 13.2245:1
              rather than as a range. */}
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
              /* `SCALE.lead` — the named step, referenced rather than transcribed.
                 This section builds its own frame instead of going through
                 `MediaSection`, so it needs the step without the wrapper; that is a
                 reason to import the ladder, not to hand-copy it.

                 It was hand-copied, and the copy drifted twice. First it kept a
                 4.5rem cap after the ladder was unified, rendering at 72px against
                 every lead section's 56px. Then the move to IBM Plex opened every
                 display step by +0.04em — `SectionShell`'s `lead` and
                 `MediaSection`'s `tall` both went 1.04 → 1.08 — and this copy stayed
                 at 1.04, so the one mounted section still carrying a hand-written
                 clamp was also the only one rendering Plex at Archivo's leading. At
                 the step's 64px ceiling that is 2.56px of ink gap (0.04em × 64px)
                 missing from a three-line headline. The derivation for the +0.04em is
                 in `SectionShell`'s SCALE and is not restated here, which is the
                 point of referencing the step.

                 §45 — "every rendered size resolves to a named role" — is why this is
                 the fix rather than editing the number: a clamp transcribed by hand
                 resolves to no role, and a role that lives in one place cannot drift
                 a third time. */
              className={`display m-0 whitespace-normal ${SCALE.lead} text-fg md:whitespace-pre-line`}
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
                {/* The row rule is `border-soft`, not `white/15`. Two reasons,
                    both measured. It is the same argument the deck above
                    already makes for `fg-muted` over an alpha — an alpha's
                    contrast is a property of whatever it lands on, and this one
                    lands on a photographed plate — and on a warm ground a white
                    alpha is no longer neutral by accident: `white/15`
                    composites to #2F2D2D at OKLCH chroma 0.0029 and hue 17.32°,
                    a dead grey drawn across a section whose every other line is
                    warm. `--color-border-soft` #251D1A is chroma 0.0138 at hue
                    41.61°, on the accent's own hue line.

                    The cost, stated rather than glossed: the rule drops from
                    1.4595:1 to 1.2076:1 against the ground, a 1.2086:1 step
                    down. That is a real dimming and it is the correct one —
                    `border-soft`'s declared role is section hairlines and row
                    rules, which is exactly what these are, and ten of them
                    stacked at `border`'s 1.4520:1 would out-draw the copy they
                    separate. Over the scrim core the pairing is unchanged,
                    because that core resolves to the ground. */}
                {tools.map((tool) => (
                  <li
                    key={tool.title}
                    className="border-t border-border-soft py-3 text-base leading-snug text-fg-muted"
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
