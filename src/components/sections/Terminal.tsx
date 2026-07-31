import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import MediaSection from '../ui/MediaSection'
import { plateImage } from '../../lib/media'

import {
  capabilities,
  terminalCta,
  terminalFinePrint,
  terminalHeading,
  terminalPlateAlt,
  terminalSubheading,
} from '../../data/terminal'

/**
 * §7 Terminal — full-bleed, copy overlaid on plate A8.
 *
 * This goes through `MediaSection` rather than building its own frame. Platform
 * immediately above does build its own, and that is not a house style to copy:
 * it does so for exactly one reason, stated in its header — `MediaSection`
 * hard-wires `MediaBackdrop` as its backdrop layer and there is no seam to pass
 * a canvas through, so a section running a procedural field has to transcribe
 * every measure by hand. This section ships a real plate, so it has no such
 * problem and inherits the rail, the gutter ladder, the type scale and the scrim
 * geometry instead of restating them. Every measure Platform transcribes is a
 * measure that can drift.
 *
 * **The four capabilities are prose, not a list, and that is a contrast
 * decision before it is a taste one.**
 *
 * art-direction §2.7 licenses a plate's dead zone up to `#38383c` (relative
 * luminance 0.0400) over a floor of `#050505` (0.00152). A `border-soft`
 * hairline is `#1c1c21` — luminance **0.0128** — which sits *inside* that
 * range. So the same rule drawn across a 510px run is lighter than the plate
 * under part of its length and darker under the rest: it fades in and out.
 * `border` `#2b2b31` (0.0246) has the identical problem. The first token that
 * is reliably lighter than the licensed ceiling everywhere is `chrome-dim`
 * (0.187), a twelvefold jump that would make a row rule the brightest non-button
 * mark in the frame.
 *
 * **Hairlines are a flat-ink device.** Platform gets away with them because its
 * particular plate happens to run far below the licensed ceiling under the copy
 * column — that is luck, and it is not a property this section can inherit by
 * copying the markup.
 *
 * Two more reasons the prose is right, both structural:
 *
 *  - **Platform above is `border-t` + name; Safety below is `border-t` + name +
 *    sentence.** A third ruled ledger between them is one section rendered three
 *    times, which is the flattening DESIGN.md §5.5 names. This section draws no
 *    rule at all.
 *  - **A claim that needs a qualifier belongs in a sentence.** "Compliance-gated"
 *    and "per-bar fidelity" are not self-explanatory the way "Alerts" is.
 *    Platform proved the other half of that rule when it deleted ten
 *    descriptions and kept the bare names.
 *
 * `scale="mid"`, not the `tall` default. `tall` and `SectionShell`'s `lead`
 * resolve to the identical clamp, so Platform above and Safety below both render
 * their H2 at 64px; a third at 64px is the two-competing-ladders failure
 * `MediaSection`'s own SCALE comment documents. `mid` is 56px — one measurable
 * step under both neighbours, which is the honest ranking: Platform names the
 * terminal, this says what is inside it, Safety says the money is safe.
 *
 * The recital and the CTA go in `children` rather than `actions` because
 * `MediaSection` renders `actions` above `children`, and the button has to
 * follow the argument rather than interrupt it.
 *
 * WebGL budget: this section adds **zero** contexts. `variant="secondary"` is a
 * bordered control with no `LiquidMetalSurface`, so the page stays at its
 * current ~10–11 against a browser cap near 16 (DESIGN.md §2). A metal button
 * three screens into the scroll would also be competing with the hero and the
 * closing CTA, which are the two actions the page actually wants.
 */
export default function Terminal({ id = 'terminal' }: { id?: string }) {
  return (
    <MediaSection
      id={id}
      height="tall"
      /* Platform parks its copy right; §5.5 forbids two neighbours sharing a
         composition, so this parks left and plate A8 reserves the left of every
         frame to match. */
      place="left"
      anchor="center"
      scale="mid"
      /* Tuned to this plate rather than defaulted: A8's lit region is its right
         third, so the scrim's dense core sits at 26% — under the copy, not in
         the middle of the frame. */
      scrim={0.86}
      scrimAt="26% 50%"
      /* 9em at the `mid` cap is 504px, which lands within 6px of the deck's 30em
         at 17px (510px) and the recital's 31.875em at 16px (510px). Three type
         sizes, three `em` values, one terminating column — the block has a right
         edge that nothing draws. Stated in `em` and not px because the headline
         is a clamp, so a px measure is correct at exactly one viewport width. */
      measure="9em"
      headline={terminalHeading}
      body={terminalSubheading}
      finePrint={terminalFinePrint}
      media={{
        alt: terminalPlateAlt,
        image: plateImage('terminal'),
        tone: 'var(--color-bg)',
      }}
    >
      {/* One reveal around the whole argument, not four staggered items. A
          per-item stagger reads as an entrance animation playing at the reader;
          the block should arrive with the copy it belongs to, one beat behind
          it. `settle` is the default damping — nothing rises, because the eye
          reads upward motion on a broker page as a claim about returns (§6). */}
      <Reveal variant="settle" delay={120} className="mt-14 w-full sm:mt-16 lg:mt-20">
        {/*
          Capped at the deck's *rendered* width, not its `em` value. `em`
          resolves against each element's own font size, so matching a 30em deck
          set at 17px (510px) from a 16px context needs 510 / 16 = 31.875em.
          Copying `30em` here would pull the block 20px short of the deck's right
          edge and the shared terminating column would be gone.

          `text-wrap: pretty` rather than `balance`: balance evens every line and
          flattens the deliberate rag, where pretty only prevents an orphan.
          Hyphenation off — a hyphenated break in a two-line claim reads as the
          text having run out of room.
        */}
        <div
          className="max-w-[31.875em] space-y-8"
          style={{ textWrap: 'pretty', hyphens: 'none' }}
        >
          {capabilities.map((capability) => (
            <p
              key={capability.lead}
              className="text-base leading-relaxed text-fg-muted"
            >
              {/*
                Rank carried by one weight step and one value step at a single
                size — DESIGN.md §3 sets one body size for the whole page, so the
                size axis is already spoken for.

                Not `.display` inline. That class runs `letter-spacing: -0.035em`,
                which index.css describes as about as tight as the face goes
                before its counters start closing up — at display size. At 16px
                it closes them. -0.01em is the equivalent optical correction for
                a run-in at body size.
              */}
              <span className="font-semibold tracking-[-0.01em] text-fg">
                {capability.lead}
              </span>{' '}
              {capability.body}
            </p>
          ))}
        </div>

        {/* 40–48px: more than the 32px between items, less than the 56–80px
            break above the block, so the CTA reads as belonging to the argument
            rather than as the next thing. */}
        <div className="mt-10 flex flex-wrap items-center gap-3 sm:mt-12">
          <Button href="#final-cta" variant="secondary">
            {terminalCta}
          </Button>
        </div>
      </Reveal>
    </MediaSection>
  )
}
