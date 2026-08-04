import MediaSection from '../ui/MediaSection'
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
      scrim={0.88}
      scrimAt="26% 50%"
      measure="13em"
      headline={missing.heading}
      body={missing.solution}
      finePrint={missing.finePrint}
      aside={
        <div className="relative group flex items-center justify-center">
          {/* Seamless Floating Mechanical Flip Clock with Ultra-Soft Ambient Fade */}
          <img
            src="/media/flip-clock.png"
            alt="Mechanical flip clock displaying 11:40 market moment"
            className="w-full h-auto max-h-[520px] object-contain opacity-90 [mask-image:radial-gradient(ellipse_85%_85%_at_center,black_45%,transparent_100%)] drop-shadow-[0_24px_48px_rgba(0,0,0,0.95)] transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        </div>
      }
      media={{
        alt: 'Feature Focus',
      }}
    />
  )
}
