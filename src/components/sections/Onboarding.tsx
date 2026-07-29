import { ArrowRight, Check, Clock, FileSignature, IdCard, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionShell from '../ui/SectionShell'
import Button from '../ui/Button'
import CopyText from '../ui/CopyText'
import Reveal from '../ui/Reveal'
import { requirements, steps, timingNote } from '../../data/onboarding'

/** Icon names live in the data file; the components are resolved here. */
const iconMap: Record<string, LucideIcon> = {
  'id-card': IdCard,
  'file-signature': FileSignature,
  wallet: Wallet,
}

/**
 * §8 Onboarding — three numbered steps on a connecting rail (horizontal on
 * desktop, vertical on mobile), then the requirements checklist and the
 * activation-time note.
 */
export default function Onboarding() {
  return (
    <SectionShell
      id="onboarding"
      eyebrow="Getting started"
      heading="Open an account before your chai gets cold"
      subheading="Fully online, Aadhaar-based, and no branch visit — assuming your KYC details are current."
    >
      <div className="relative">
        {/* Desktop rail: runs behind the number circles, step 1 through step 3. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 hidden md:block">
          <div className="mx-[16.6%] h-px bg-border-soft" />
        </div>

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon] ?? IdCard
            const isLast = index === steps.length - 1

            return (
              <li key={step.title} className="relative">
                {/* Mobile rail segment, bleeding across the 2.5rem row gap. */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-10 left-6 top-14 w-px bg-border-soft md:hidden"
                  />
                )}

                <Reveal delay={index * 60} className="flex gap-4 md:block">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/60 bg-bg text-base font-semibold tabular text-accent-soft">
                    {index + 1}
                  </span>

                  <div className="md:mt-6">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="h-4 w-4 shrink-0 text-accent-soft"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="text-lg font-semibold leading-[1.4] text-fg">{step.title}</h3>
                    </div>
                    <CopyText
                      source={step.body}
                      className="mt-2 max-w-sm text-base leading-relaxed text-fg-muted"
                    />
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>

      <Reveal delay={180}>
        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface/60">
          {/* Requirements strip */}
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2 sm:p-6">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-fg-muted">
              {"You'll need:"}
            </span>
            <ul className="flex flex-wrap gap-2">
              {requirements.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface-raised px-3 py-1.5 text-sm text-fg"
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-accent-soft"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Timing note + CTA */}
          <div className="flex flex-col gap-5 border-t border-border-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6">
            <p className="flex items-start gap-2 text-base leading-relaxed text-fg-muted">
              <Clock className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {/* Through CopyText so the unfilled [X] activation SLA reads as a
                  placeholder, not as a published figure. */}
              <CopyText as="span" source={timingNote} />
            </p>
            <Button href="#onboarding" size="lg" className="shrink-0">
              Start account opening
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  )
}
