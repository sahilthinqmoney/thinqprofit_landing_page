import {
  ArrowRight,
  BookOpen,
  ChartCandlestick,
  Footprints,
  PiggyBank,
  Receipt,
  ShieldAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Button from '../ui/Button'
import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'
import { formats, learnDisclaimer, tracks } from '../../data/learn'

/**
 * §11 ThinqProfit Learn.
 *
 * A course ledger, not a card grid. Products (§5) is a bento of bordered cards
 * and Platform (§6) is a tools list beside a sticky media panel; a syllabus is
 * neither — it is an ordered sequence you read top to bottom, so it renders as
 * numbered rows hung off a continuous vertical spine, with the level/duration
 * cell right-aligned like a ledger column.
 *
 * Deliberately no card chrome and no media panel: this is the one text-led
 * section on a page that is otherwise dense with framed visuals, which is what
 * keeps it from reading as a re-skin of the two sections around it.
 */
interface LearnProps {
  id?: string
}

const trackIcons: Record<string, LucideIcon> = {
  footprints: Footprints,
  'chart-candlestick': ChartCandlestick,
  'shield-alert': ShieldAlert,
  'piggy-bank': PiggyBank,
  receipt: Receipt,
}

export default function Learn({ id = 'learn' }: LearnProps) {
  return (
    <SectionShell
      id={id}
      eyebrow="Learn"
      heading="Understand the trade before you place it"
      subheading="Free, open to everyone, and written in the language people actually use — no account required."
      tone="raised"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Track ledger                                                        */}
      {/* ------------------------------------------------------------------ */}
      <ol className="divide-y divide-border-soft border-y border-border-soft">
        {tracks.map((track, index) => {
          const Icon = trackIcons[track.icon] ?? BookOpen

          return (
            <li key={track.title}>
              {/* Stagger capped at 3 steps so nothing waits past 180ms (§6). */}
              <Reveal delay={Math.min(index, 3) * 60}>
                <a
                  href="#"
                  className="group grid grid-cols-[2.25rem_1fr] items-start gap-x-4 rounded-lg py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6 sm:py-7"
                >
                  {/* Rail: ordinal over glyph, no bordered tile — the tiles are
                      Products' and Platform's chrome, and reusing them is what
                      made this section read as a re-skin. */}
                  <div className="flex flex-col items-start gap-2.5 pt-0.5" aria-hidden="true">
                    <span className="tabular text-xl font-semibold leading-none tracking-tight text-fg-muted transition-colors duration-200 group-hover:text-accent-soft sm:text-2xl">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon className="h-[18px] w-[18px] text-accent-soft" strokeWidth={1.5} />
                  </div>

                  {/* Spine: the left hairline runs the full row height, so the
                      rows join into one continuous rule down the section. */}
                  <div className="min-w-0 border-l border-border-soft pl-4 transition-colors duration-200 group-hover:border-accent/50 sm:pl-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
                      <h3 className="text-lg font-semibold leading-[1.4] text-fg transition-colors duration-200 group-hover:text-accent-soft">
                        {track.title}
                      </h3>
                      {/* Level/duration is not in the copy deck — it renders as
                          an unfilled placeholder rather than an invented value. */}
                      <CopyText as="span" source={track.marker} className="text-sm leading-relaxed" />
                    </div>
                    <p className="mt-2 text-base leading-relaxed text-fg-muted">{track.body}</p>
                  </div>
                </a>
              </Reveal>
            </li>
          )
        })}
      </ol>

      {/* ------------------------------------------------------------------ */}
      {/* Formats                                                             */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={120}>
        <div className="mt-10">
          <h3 className="text-lg font-semibold leading-[1.4] text-fg">Formats</h3>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {formats.map((format) => (
              <li
                key={format}
                className="inline-flex items-start gap-2.5 rounded-xl border border-border-soft bg-surface/60 px-3.5 py-2.5 text-base leading-relaxed text-fg-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.6875rem] h-1 w-1 shrink-0 rounded-full bg-accent-soft"
                />
                {format}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* CTA + advisory-boundary disclaimer. The disclaimer is a regulatory
          statement, not decoration — it renders as live text at 4.5:1. */}
      <Reveal delay={180}>
        <div className="mt-10 flex flex-col gap-5 border-t border-border-soft pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <Button href="#" size="lg" className="self-start sm:self-auto">
            Start learning — free
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <Disclosure tone="note" className="sm:max-w-md">
            {learnDisclaimer}
          </Disclosure>
        </div>
      </Reveal>
    </SectionShell>
  )
}
