import {
  KeyRound,
  Lock,
  MessageSquareWarning,
  ShieldCheck,
  Split,
  TriangleAlert,
  Vault,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionShell from '../ui/SectionShell'
import CopyText from '../ui/CopyText'
import Reveal from '../ui/Reveal'
import { honestNote, pillars } from '../../data/safety'

/** Icon set fixed by design-system/thinqprofit/pages/landing.md §8 (Safety row). */
const iconMap: Record<string, LucideIcon> = {
  vault: Vault,
  split: Split,
  'key-round': KeyRound,
  'shield-check': ShieldCheck,
  lock: Lock,
  'message-square-warning': MessageSquareWarning,
}

/**
 * §10 Safety & protection. Raised tone for contrast against Onboarding and the
 * mobile-app pitch either side of it. The pillars sit in a hairline grid rather
 * than detached cards — custody rules read better as a ledger than as marketing
 * tiles. The honest note gets its own warning-toned panel: the copy deck marks
 * it "keep this, do not soften it", so it is never rendered as fine print.
 */
export default function Safety() {
  return (
    <SectionShell
      id="safety"
      tone="raised"
      eyebrow="Safety"
      heading="Your money and your shares stay yours"
      subheading="Client assets sit where regulation says they should — not on our balance sheet."
    >
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border-soft sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar, index) => {
          const Icon = iconMap[pillar.icon] ?? ShieldCheck

          return (
            // The <li> stays the grid cell so the hairline gap-px rules survive;
            // the Reveal sits inside it and carries the 60ms stagger, capped at
            // 180ms so no pillar waits past the motion budget.
            <li
              key={pillar.title}
              className="flex bg-surface transition-colors duration-200 hover:bg-surface-raised"
            >
              <Reveal
                delay={Math.min(index, 3) * 60}
                className="flex w-full flex-col gap-3 p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-soft bg-bg/60">
                  <Icon className="h-5 w-5 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold leading-[1.4] text-fg">{pillar.title}</h3>
                <CopyText source={pillar.body} className="text-base leading-relaxed text-fg-muted" />
              </Reveal>
            </li>
          )
        })}
      </ul>

      {/* Honest note — the most important line in this section. */}
      <Reveal delay={120}>
        <div className="mt-8 rounded-2xl border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-6 sm:mt-10 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-warning">
            <TriangleAlert className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            Honest note
          </p>
          {/* Sized a step above the pillar H3 (18px) so it stays the loudest
              line in the section — deck §10: "keep this, do not soften it". */}
          <CopyText
            source={honestNote}
            className="mt-3 max-w-3xl text-lg leading-relaxed text-warning sm:text-xl"
          />
        </div>
      </Reveal>
    </SectionShell>
  )
}
