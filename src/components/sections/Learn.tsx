import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import Disclosure from '../ui/Disclosure'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'
import { formats, learnDisclaimer, tracks } from '../../data/learn'

/**
 * §11 ThinqProfit Learn.
 *
 * A staircase, not a card grid and not a divided row list. The five tracks are a
 * path — first trade through to filing taxes — so each rung steps one tread to
 * the right of the one above it, joined by a hairline riser. Read top to bottom
 * the spine descends diagonally across the section, which is the one thing
 * neither of the treatments this section has previously worn could say:
 * Products (§5) is a bleeding media rail over a three-column row list, Platform
 * (§6) is a bare two-column name list on a plate. Sequence is Learn's content,
 * so sequence is its layout.
 *
 * NOTHING HERE IS BOXED. That was a deliberate call by a previous author and it
 * still holds: no per-row icons, no bordered tiles, no cards. Products and
 * Platform both shed theirs in the same pass, and five decorative glyphs would
 * put the chrome back on the quietest section on the page. This revision extends
 * the rule to the last hold-out — the formats/CTA column, which used to sit in a
 * `rounded-2xl border` panel. A bordered box holding a hairline list, a button
 * and a disclosure was the generic aside pattern, and it was also the only thing
 * on the page that could put a bordered list inside a bordered box. It is now
 * one horizontal rule and the content under it; proximity groups it, and the
 * rule weights separate it from the ladder (`border-border` above the column,
 * `border-border-soft` between its rows).
 *
 * The 01–05 ordinals stay, because here they are content rather than decoration:
 * the tracks run in learning order, beginner through derivatives to taxes, and
 * a reader landing mid-list needs to know they are partway along a path. So they
 * are set to earn the room they take — Instrument Serif via `.display` at ~2×
 * the track title, in `chrome-dim`, sharing a baseline with the title rather
 * than stacked above it. Size and face carry the emphasis; the weight never
 * moves. They stay `aria-hidden` because the `<ol>` already exposes position to
 * assistive tech, and a visible numeral would have it announced twice.
 *
 * The advisory-boundary disclaimer is the section's one hard requirement: live
 * text, `fg-muted` at 13.08:1, never behind a blur, sitting directly under the
 * action it qualifies (landing.md §9).
 *
 * Below `md` the treads collapse to zero and the rungs stack against one
 * straight spine — a staircase needs width to read as one, and 375px has none.
 */
interface LearnProps {
  id?: string
}

/**
 * Stair geometry, index-addressed. Rung n is offset by n treads; the riser that
 * joins it back to rung n−1 is exactly one tread wide (`md:w-11` = 2.75rem,
 * `2xl:w-16` = 4rem), so the two always meet whatever the breakpoint.
 *
 * Margin, not padding: the left hairline has to travel with the rung, and
 * padding sits inside the border. The `2xl` step widens because the rail does —
 * across 84rem a 44px tread reads as a typo rather than as a stair.
 */
const rungOffset: string[] = [
  '',
  'md:ml-[2.75rem] 2xl:ml-[4rem]',
  'md:ml-[5.5rem] 2xl:ml-[8rem]',
  'md:ml-[8.25rem] 2xl:ml-[12rem]',
  'md:ml-[11rem] 2xl:ml-[16rem]',
]

export default function Learn({ id = 'learn' }: LearnProps) {
  const lastIndex = tracks.length - 1

  return (
    <SectionShell
      id={id}
      heading="Understand the trade before you place it"
      subheading="Free, and no account required."
    >
      {/* 8/4 rather than 50/50: the ladder needs the run, and the aside is a
          short list plus one button — at half the rail it would be a very wide
          column holding four lines. */}
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        {/* ---------------------------------------------------------------- */}
        {/* The path — five rungs, each one tread further along               */}
        {/* ---------------------------------------------------------------- */}
        <ol className="lg:col-span-8">
          {tracks.map((track, index) => {
            const isLast = index === lastIndex

            return (
              <li
                key={track.title}
                className={`relative border-l border-border-soft ${rungOffset[index] ?? ''}`}
              >
                {/* Riser: joins this rung's spine back to the previous one. It
                    sits in the margin the offset opens up, so it needs no width
                    of its own in the flow. */}
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 hidden h-px -translate-x-full bg-border-soft md:block md:w-11 2xl:w-16"
                  />
                )}

                {/* Stagger capped at 180ms — nothing waits past ~250ms (§6). */}
                <Reveal variant="left"
                  delay={Math.min(index, 3) * 60}
                  className={`pl-5 sm:pl-7 2xl:pl-9 ${isLast ? 'pb-1' : 'pb-10 2xl:pb-12'}`}
                >
                  {/* `items-baseline`, so the serif ordinal and the sans title
                      sit on one line rather than the numeral pushing the title
                      down. The numeral overhangs that baseline on both sides,
                      which is what makes it read as a chapter mark instead of a
                      label — and it costs no extra height per rung, so all five
                      still clear the fold on a laptop. */}
                  <div className="flex items-baseline gap-4 sm:gap-5 2xl:gap-6">
                    <span
                      aria-hidden="true"
                      className="display tabular shrink-0 leading-none text-chrome-dim text-[1.75rem] sm:text-[2rem] 2xl:text-[2.375rem]"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0">
                      <h3 className="text-lg font-medium leading-snug text-fg sm:text-xl 2xl:text-2xl">
                        {track.title}
                      </h3>
                      {/* The rung is wide; the line is not. Running prose stays
                          inside a readable measure however far the stair
                          travels. */}
                      <p className="mt-2 max-w-[62ch] text-base leading-relaxed text-fg-muted 2xl:text-lg">
                        {track.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>

        {/* ---------------------------------------------------------------- */}
        {/* Formats, the one CTA, and the advisory boundary                   */}
        {/* ---------------------------------------------------------------- */}
        {/* One rule across the top of the column and nothing else holding it.
            `border-border` here against `border-border-soft` on the rows below
            is the whole hierarchy: the heavier line says "different block", the
            lighter ones only separate items. A horizontal rule also cannot be
            mistaken for a sixth rung, which is what a `border-l` on this column
            would have looked like next to the ladder. */}
        <Reveal variant="left" delay={120} className="border-t border-border pt-6 lg:col-span-4 2xl:pt-8">
          <h3 className="text-base font-medium leading-snug text-fg">Formats</h3>

          {/* Hairline rows, not pill chips. A `rounded-*` bordered chip per
              format would read as four more little cards on a page that has
              enough of them, and these are four plain nouns — they need
              separating, not containing. */}
          <ul className="mt-4">
            {formats.map((format) => (
              <li
                key={format}
                className="border-t border-border-soft py-3 text-base leading-relaxed text-fg-muted"
              >
                {format}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {/* No `trailing` well — that is reserved for the page's single
                primary action, which the Hero holds. The arrow rides inline. */}
            <Button href="#" size="lg">
              Start learning — free
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Button>
            {/* Regulatory statement, not decoration — live text at 4.5:1,
                never behind blur (landing.md §9). It sits under the CTA on
                purpose: the boundary belongs next to the thing it qualifies. */}
            <Disclosure tone="note" className="mt-5 max-w-[52ch]">
              {learnDisclaimer}
            </Disclosure>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
