import {
  Activity,
  ArrowRight,
  Bell,
  ChartCandlestick,
  Code,
  FileText,
  Filter,
  FlaskConical,
  GitBranch,
  Table2,
  Timer,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import Button from '../ui/Button'
import MediaPlaceholder from '../ui/MediaPlaceholder'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'

import {
  platformCta,
  platformEyebrow,
  platformHeading,
  platformMediaAlt,
  platformMediaLabel,
  platformSubheading,
  tools,
} from '../../data/platform'

/** Icon names come from design-system/thinqprofit/pages/landing.md §8, Platform row. */
const iconMap: Record<string, LucideIcon> = {
  'candlestick-chart': ChartCandlestick,
  'table-2': Table2,
  filter: Filter,
  bell: Bell,
  timer: Timer,
  'git-branch': GitBranch,
  'flask-conical': FlaskConical,
  code: Code,
  'file-text': FileText,
  activity: Activity,
}

interface PlatformProps {
  /** Anchor target. Matches the nav's Platform link. */
  id?: string
}

/**
 * §6 Platform & tools.
 *
 * Deliberately not the Products card grid: a sticky terminal panel on the left,
 * a dense divided spec list on the right. Rows shift background on hover —
 * no lift transform (landing.md §5).
 */
export default function Platform({ id = 'platform' }: PlatformProps) {
  return (
    <SectionShell
      id={id}
      eyebrow={platformEyebrow}
      heading={platformHeading}
      subheading={platformSubheading}
      centered={false}
      tone="raised"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Terminal panel — sticks while the spec list scrolls past it. */}
        <div className="lg:col-span-5">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border-soft bg-surface/40 p-3">
                {/* Decorative window chrome, so the placeholder reads as a terminal. */}
                <div aria-hidden="true" className="flex items-center gap-1.5 px-2 pb-3 pt-1">
                  <span className="h-2 w-2 rounded-full bg-border" />
                  <span className="h-2 w-2 rounded-full bg-border" />
                  <span className="h-2 w-2 rounded-full bg-border" />
                  <span className="ml-3 h-px flex-1 bg-border-soft" />
                </div>
                <MediaPlaceholder
                  kind="image"
                  aspect="aspect-video lg:aspect-[4/5]"
                  label={platformMediaLabel}
                  alt={platformMediaAlt}
                />
              </div>

              <div className="mt-6 hidden lg:block">
                <Button href="#" variant="secondary" aria-label={platformCta}>
                  {platformCta}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Spec list — one tool per row, hairline separated. */}
        <div className="lg:col-span-7">
          <ol className="divide-y divide-border-soft border-y border-border-soft">
            {tools.map((tool, index) => {
              const Icon = iconMap[tool.icon] ?? Activity
              return (
                <li key={tool.title}>
                  {/* Stagger capped at 240ms — nothing waits past ~250ms (landing.md §6). */}
                  <Reveal delay={Math.min(index, 4) * 60}>
                    <div className="flex items-start gap-4 rounded-lg px-2 py-5 transition-colors duration-200 hover:bg-surface/60 sm:px-3">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border-soft bg-surface text-accent-soft">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold leading-[1.4] text-fg">
                          {tool.title}
                        </h3>
                        <p className="mt-1.5 text-base leading-relaxed text-fg-muted">{tool.body}</p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="tabular hidden shrink-0 pt-1 text-xs font-medium tracking-widest text-fg-muted sm:block"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ol>

          <div className="mt-8 lg:hidden">
            <Button href="#" variant="secondary" fullWidth aria-label={platformCta}>
              {platformCta}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
