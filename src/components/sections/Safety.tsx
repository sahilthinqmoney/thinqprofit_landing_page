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
 * §10 Safety & protection.
 *
 * `seamless`: Onboarding above is a full-bleed MediaSection, and a hairline
 * ruled across the bottom of a photograph reads as a mistake. Base tone, because
 * the mobile-app band below is a solid raised surface — two raised bands in a
 * row and the boundary between them disappears.
 *
 * The pillars stay a 3×2 hairline grid at the wider container. 6×1 gives six
 * 260px slivers whose titles wrap to three lines each; 2×3 gives 800px cells
 * holding two lines of copy, which is a letterbox, not a card. 3×2 lands at
 * 555px per cell at 1664px — a normal card measure — so the width goes into
 * padding rather than into stretching the cells, and the icon loses its bordered
 * tile: Products and Platform both dropped theirs, and a boxed glyph inside a
 * boxed cell is chrome on chrome.
 *
 * The honest note is the most important line in the section — the deck marks it
 * "keep this, do not soften it". It is capped well inside the container and set
 * a step larger than the pillar titles. A 1664px-wide warning panel holding one
 * 137-character sentence would be a thinner statement, not a louder one.
 */
export default function Safety() {
  return (
    <SectionShell
      id="safety"
      seamless
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
                className="flex w-full flex-col gap-3 p-6 lg:p-7 2xl:p-9"
              >
                <Icon
                  className="h-5 w-5 text-accent-soft"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="text-lg font-medium leading-snug text-fg 2xl:text-xl">
                  {pillar.title}
                </h3>
                <CopyText source={pillar.body} className="text-base leading-relaxed text-fg-muted" />
              </Reveal>
            </li>
          )
        })}
      </ul>

      {/* Honest note. */}
      <Reveal delay={120}>
        <div className="mx-auto mt-10 max-w-3xl border-l-2 border-warning py-1 pl-6 sm:mt-14 sm:pl-8">
          <p className="flex items-center gap-2 text-sm text-warning">
            <TriangleAlert className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            Honest note
          </p>
          {/* A step above the pillar titles so it stays the loudest line in the
              section, and capped at ~58 characters at that size. */}
          <CopyText
            source={honestNote}
            className="mt-3 text-xl leading-relaxed text-warning 2xl:text-2xl"
          />
        </div>
      </Reveal>
    </SectionShell>
  )
}
