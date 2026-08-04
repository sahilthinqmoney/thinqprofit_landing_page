import MediaSection from '../ui/MediaSection'
import { plateImage } from '../../lib/media'
import { missing } from '../../data/missing'

/**
 * §3 — "What you're missing". The page's one deep section.
 *
 * ── Why this is a full-bleed plate and not a flat band ────────────────────
 *
 * The section directly below it (§4, the capability summary) is flat ink and a
 * ledger of rows, and the one below that (§5, security) is a flat ladder. Three
 * flat sections in sequence is the monotony docs/art-direction.md warns about,
 * and the one that should carry the image is the one carrying the argument.
 *
 * The plate is `terminal`, whose subject reserves the right of the frame — so
 * the copy parks left and the scrim's dense core sits at 26%, under the words,
 * rather than across the middle of the picture. DESIGN.md §5.5's rule is that
 * the plate is lit on the side the copy is NOT on; `MediaSection` derives that
 * from `place` so the two cannot drift apart.
 *
 * No video. §4.2 permits motion on exactly two plates — the hero and the
 * closing — and this is neither. The scroll opens and closes on movement and
 * holds still in between.
 *
 * ── The composition of the copy ───────────────────────────────────────────
 *
 * Four blocks, in the order a person actually experiences the problem:
 *
 *   1. The two timestamps, as the H2. A gap, stated as a fact.
 *   2. "Not because you were slow." — set larger than body, because it is the
 *      sentence that decides whether the reader keeps reading or feels accused.
 *   3. The arithmetic. Forty instruments, two hundred strikes, six hours.
 *   4. What the product does about it.
 *
 * Blocks 2–4 are three separate paragraphs at three different weights rather
 * than one body block, and that is the whole layout: the section is a short
 * argument, so its shape is a short argument rather than a heading with prose
 * under it.
 *
 * ── No CTA ────────────────────────────────────────────────────────────────
 *
 * The page has two conversion points — the hero and the close — and both carry
 * the same form. A button here would be a third ask competing with both, and it
 * would interrupt the one section on the page that is making an argument rather
 * than requesting something.
 */
export default function Missing() {
  return (
    <MediaSection
      id="missing"
      className="isolate"
      height="tall"
      place="left"
      anchor="center"
      /*
       * Denser than `MediaSection`'s 0.82 default. This section carries four
       * stacked copy blocks rather than the usual headline-and-sentence, so the
       * dark area under the words has to hold for their full height — and the
       * plate's own subject is bright along the edge nearest the copy column.
       */
      scrim={0.88}
      scrimAt="26% 50%"
      measure="13em"
      headline={missing.heading}
      /*
       * The `body` slot renders at 17px in a 30em measure — `MediaSection`'s
       * standfirst step, shared with `SectionShell` so a full-bleed section and a
       * flat one agree about what a subtitle is.
       *
       * The narrative line is passed here rather than as a child because it IS
       * the standfirst: it is the sentence that qualifies the headline. It takes
       * `text-fg` and a display step above the slot's default, which is the one
       * override in this section — see the note above on why this line is set
       * larger than the prose under it.
       */
      body={
        <span className="display block text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.25] text-fg">
          {missing.narrative}
        </span>
      }
      finePrint={missing.finePrint}
      media={{
        alt: 'A machined aluminium form receding into darkness, one edge catching a single soft light.',
        image: plateImage(missing.plate),
      }}
    >
      {/*
        The pain and the solution, in the `children` slot below the standfirst.

        Both are `max-w-[34em]` rather than the slot's default, because they are
        prose rather than a deck — two sentences that have to be read, not
        scanned. 34em at 16px is ~544px, which is inside the 45–75 character band
        this page treats as a reading measure.
      */}
      <p className="mt-8 max-w-[34em] text-base leading-relaxed text-fg-muted">{missing.pain}</p>

      {/*
        The solution paragraph is the only one in the section set in `fg` rather
        than `fg-muted`. It is the claim; everything above it is the setup, and
        the one-step lift is what says so without adding a heading, a rule, an
        icon or a badge to say it instead.
      */}
      <p className="mt-6 max-w-[34em] text-base leading-relaxed text-fg">{missing.solution}</p>
    </MediaSection>
  )
}
