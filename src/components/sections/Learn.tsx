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
 * Nothing here is boxed except the aside, which holds the formats, the single
 * CTA and the mandatory advisory-boundary disclaimer. No per-row icons and no
 * bordered tiles: Products and Platform both shed theirs in the same pass, and
 * five decorative glyphs would put the chrome back on the quietest section on
 * the page. The stair geometry and the ordinals carry the sequence on their own.
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
 * padding sits inside the border. The `2xl` step widens because the container
 * does — at 1664px a 44px tread reads as a typo rather than as a stair.
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
      eyebrow="Learn"
      heading="Understand the trade before you place it"
      subheading="Free, open to everyone, and written in the language people actually use — no account required."
    >
      {/* 8/4 rather than 50/50: the ladder needs the run, and the aside is a
          short list plus one button — at half of 1664px it would be a very wide
          box holding four lines. */}
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
                <Reveal
                  delay={Math.min(index, 3) * 60}
                  className={`pl-5 sm:pl-7 2xl:pl-9 ${isLast ? 'pb-1' : 'pb-10 2xl:pb-12'}`}
                >
                  {/* Decorative: the <ol> already carries the sequence, and the
                      stair states it a second time visually. */}
                  <span aria-hidden="true" className="tabular text-sm text-fg-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3 className="mt-2 text-lg font-medium leading-snug text-fg sm:text-xl">
                    {track.title}
                  </h3>
                  {/* The rung is wide; the line is not. Running prose stays
                      inside a readable measure however far the stair travels. */}
                  <p className="mt-2 max-w-[62ch] text-base leading-relaxed text-fg-muted 2xl:text-lg">
                    {track.body}
                  </p>
                </Reveal>
              </li>
            )
          })}
        </ol>

        {/* ---------------------------------------------------------------- */}
        {/* Formats, the one CTA, and the advisory boundary                   */}
        {/* ---------------------------------------------------------------- */}
        <Reveal delay={120} className="lg:col-span-4">
          <div className="rounded-2xl border border-border bg-surface/70 p-6 2xl:p-8">
            <h3 className="text-base font-medium leading-snug text-fg">Formats</h3>

            {/* Hairline rows rather than pill chips — four bordered chips here
                would read as four more cards on a page that has enough. */}
            <ul className="mt-4 border-t border-border-soft">
              {formats.map((format) => (
                <li
                  key={format}
                  className="border-b border-border-soft py-3 text-base leading-relaxed text-fg-muted"
                >
                  {format}
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Button href="#" size="lg">
                Start learning — free
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Button>
              {/* Regulatory statement, not decoration — live text at 4.5:1,
                  never behind blur (landing.md §9). */}
              <Disclosure tone="note" className="mt-5">
                {learnDisclaimer}
              </Disclosure>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
