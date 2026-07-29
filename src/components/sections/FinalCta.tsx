import { Check } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import Reveal from '../ui/Reveal'
import { finalCta } from '../../data/footer'

/**
 * §16 Final CTA. Copy verbatim from docs/landing-page-copy.md.
 *
 * Constraints honoured here:
 *  - indigo CTA, never green — landing.md §1 conflict 2
 *  - no urgency mechanics, no countdown — landing.md §10
 *  - the market-risk disclosure is live text directly beneath the CTA, at
 *    fg-muted (6.1:1), never behind a blur — landing.md §9
 */
export default function FinalCta() {
  const supportItems = finalCta.supportLine.split(' · ')

  return (
    <section id="final-cta" className="border-t border-border-soft py-12 sm:py-16 lg:py-24">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface/70 px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-16">
            {/* Soft indigo glow. Decorative, sits behind the content. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-[-14rem] h-[26rem] w-[46rem] max-w-[150vw] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]" />
              <div className="absolute bottom-[-12rem] left-[-6rem] h-[18rem] w-[18rem] rounded-full bg-accent-soft/10 blur-[100px]" />
            </div>

            {/* Same H2 scale as SectionShell — landing.md §3, no local override. */}
            <h2 className="mx-auto max-w-3xl text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-fg">
              {finalCta.heading}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
              {finalCta.subheading}
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button href="#onboarding" size="lg">
                {finalCta.primaryCta}
              </Button>
              <Button href="#support" variant="secondary" size="lg">
                {finalCta.secondaryCta}
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-fg-muted sm:text-[0.8125rem]">
              {supportItems.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-bg/50 px-3 py-1.5"
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
                  {/* "[X]-hour activation" carries an unfilled figure — flag it. */}
                  <CopyText as="span" source={item} className="tabular" />
                </li>
              ))}
            </ul>

            <div className="mx-auto mt-10 max-w-2xl border-t border-border-soft pt-6">
              <Disclosure>{finalCta.disclosure}</Disclosure>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
