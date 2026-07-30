import Container from '../ui/Container'
import CopyText from '../ui/CopyText'
import Reveal from '../ui/Reveal'
import { stats } from '../../data/social'

/**
 * §13 Stats band.
 *
 * COMPOSITION — the page's one edge-to-edge punctuation band: five flagged
 * figures on a single baseline under the only brushed seam in the document.
 * No heading, no full height, no rail-width heading block above it — it is the
 * only thing on the page that is a beat rather than a section, and the only one
 * whose top edge runs past the container to the viewport.
 *
 * Punctuation between Learn (§11) and Testimonials (§12), not a section: no
 * SectionShell, no heading, no full height. Five figures, five labels, one rule.
 *
 * Three things changed from the first cut, all of them subtractions:
 *
 *  1. The per-cell hairline grid is gone. Eleven internal rules to separate five
 *     facts drew a table around data that is not tabular, and boxed each figure
 *     in on four sides. Space does that job here; the only line left is the
 *     seam above the band, and it is `.rule-chrome` — a brushed edge that fades
 *     at both ends, which is the whole reason that utility exists and its only
 *     use on the page.
 *
 *  2. The uppercase `tracking-[0.14em]` micro-labels are gone. That treatment
 *     had spread far enough across the page to stop reading as a decision, and
 *     it costs legibility at 12px for no gain. The labels are sentence case at
 *     14px in `fg-muted` (8.07:1) — quieter than the figure without shouting
 *     about being a label.
 *
 *  3. Centred text is now left-aligned. Tabular figures want a shared left edge;
 *     centring them means the digits sit on a different axis in every cell.
 *
 * Type: sans, never `.display`. Instrument Sans has true tabular figures and
 * Instrument Serif does not, and a band of numbers is exactly where a digit
 * jumping its advance width would show. `.tabular` at weight 500, per
 * design-system/thinqprofit/pages/landing.md §3.
 *
 * Height is the one thing that had to move as the sections around it opened up.
 * A band at `py-12` between two neighbours running `py-40` stops reading as a
 * beat and starts reading as a line the layout forgot to space — punctuation
 * still needs a gap on both sides of it. It is now `py-16 → py-24`, which is
 * comfortably under half of what a full section takes, so it is still visibly
 * a different kind of thing, and no longer pinched between them.
 *
 * Sizing is bounded by the placeholders, not by the finished numbers. Every
 * value here is still an unfilled deck token rendering through `CopyText`, so
 * the widest thing this band has to hold is `[₹X crore+]` (~5.1em) — wider than
 * any real figure that replaces it. The clamp tops out at 40px, which keeps that
 * token inside its column at the tightest point of the 5-across grid (1024px,
 * ~166px per column) and leaves the band correctly proportioned once the values
 * shorten to real numbers rather than suddenly under-filled.
 */
export default function Stats() {
  return (
    <section id="stats" aria-label="ThinqProfit by the numbers">
      {/* Full-bleed seam. Sits outside Container so it runs edge to edge and
          fades out where the viewport does. */}
      <div className="rule-chrome h-px w-full" aria-hidden="true" />

      <Container>
        {/* The rail. `SectionShell` caps its content at 84rem inside the same
            1760px Container, so a band that fills the Container edge to edge
            starts its first figure ~200px left of every heading above and below
            it on an ultrawide display. One left edge from the nav to the footer
            is the point; a punctuation band is not exempt from it. */}
        <div className="w-full max-w-[84rem]">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 py-16 sm:grid-cols-3 sm:py-20 lg:grid-cols-5 lg:gap-x-8 lg:py-24">
            {stats.map((stat, index) => (
              // The Reveal element IS the grid cell: it keeps `dl > div > (dt, dd)`
              // valid and gives each figure its own 60ms step, capped at 180ms.
              <Reveal
                key={stat.label}
                delay={Math.min(index, 3) * 60}
                className="grid min-w-0 content-start gap-y-2.5"
              >
                {/* dt before dd in the DOM for correct <dl> semantics; the figure
                    sits on top visually via explicit grid rows, so reading order
                    and DOM order stay identical (WCAG 1.3.2). */}
                <dt className="row-start-2 text-sm leading-snug text-fg-muted">{stat.label}</dt>
                <CopyText
                  as="dd"
                  source={stat.value}
                  className="tabular row-start-1 text-[clamp(1.75rem,2.2vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-fg"
                />
              </Reveal>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
