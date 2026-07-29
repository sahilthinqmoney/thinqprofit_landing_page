import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import CopyText from '../ui/CopyText'
import { stats } from '../../data/social'

/**
 * §13 Stats band.
 *
 * Deliberately NOT a SectionShell — no heading, no eyebrow. This is punctuation
 * between Learn (§11) and Testimonials (§12): five figures on hairlines, and
 * nothing else competing for attention.
 *
 * Values carry `.tabular` at weight 500 so the digits sit on a fixed advance
 * width (design-system/thinqprofit/pages/landing.md §3).
 *
 * Every value is still a `[PLACEHOLDER]` in the deck, so each renders through
 * `CopyText` and reads as unfilled rather than as a published number.
 *
 * Layout: 2-up on mobile, 5-across from lg. Hairlines are drawn per cell rather
 * than with a gap trick so the rules reflow correctly when the grid wraps.
 */
export default function Stats() {
  return (
    <section
      id="stats"
      aria-label="ThinqProfit by the numbers"
      className="border-t border-border-soft"
    >
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, index) => {
            // Mobile (2 cols): no left rule on the first cell of each row,
            // no top rule on the first row. Desktop (5 cols): a single row.
            const rules = [
              'border-border-soft',
              index % 2 === 0 ? 'border-l-0' : 'border-l',
              index < 2 ? 'border-t-0' : 'border-t',
              index % 5 === 0 ? 'lg:border-l-0' : 'lg:border-l',
              'lg:border-t-0',
            ].join(' ')

            return (
              // The Reveal element IS the grid cell: it keeps `dl > div > (dt, dd)`
              // valid and gives each figure its own 60ms step, capped at 180ms.
              <Reveal
                key={stat.label}
                delay={Math.min(index, 3) * 60}
                className={`grid justify-items-center gap-2 px-3 py-9 text-center sm:px-5 lg:py-11 ${rules}`}
              >
                {/* dt before dd in the DOM for correct <dl> semantics. The figure
                    sits on top visually via explicit grid rows, so reading order
                    and DOM order stay identical (WCAG 1.3.2). */}
                <dt className="row-start-2 text-xs font-medium uppercase leading-snug tracking-[0.14em] text-fg-muted">
                  {stat.label}
                </dt>
                <CopyText
                  as="dd"
                  source={stat.value}
                  className="tabular row-start-1 text-xl font-medium leading-none tracking-tight text-fg sm:text-2xl lg:text-3xl"
                />
              </Reveal>
            )
          })}
        </dl>
      </Container>
    </section>
  )
}
