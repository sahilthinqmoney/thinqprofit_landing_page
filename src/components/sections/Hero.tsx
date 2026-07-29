import { Info, ShieldCheck, TriangleAlert } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Disclosure from '../ui/Disclosure'
import MediaPlaceholder from '../ui/MediaPlaceholder'
import Reveal from '../ui/Reveal'
import { hero, heroIllustrativeStamp, heroMediaLabel } from '../../data/hero'

/**
 * §3 Hero. Copy verbatim from docs/landing-page-copy.md.
 *
 * Constraints honoured here:
 *  - H1 at clamp(2.25rem, 5vw, 3.75rem) — landing.md §3
 *  - no auto-playing ticker animation — landing.md §10
 *  - visible "Illustrative" stamp on the hero visual — landing.md §9
 *  - market-risk disclosure is live text below the fold, never collapsed — §3
 */
export default function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden">
      {/* Soft indigo field behind the fold. Decorative only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[60rem] max-w-[160vw] -translate-x-1/2 rounded-full bg-accent/25 blur-[130px]" />
        <div className="absolute right-[-10rem] top-[10rem] h-[22rem] w-[22rem] rounded-full bg-accent-soft/10 blur-[110px]" />
      </div>

      <Container>
        <div className="grid items-center gap-12 pb-12 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pb-20 lg:pt-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-[0.6875rem] font-medium leading-normal text-accent-soft sm:text-xs">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {hero.eyebrow}
            </p>

            <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-fg">
              {hero.headline}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
              {hero.subheadline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#onboarding" size="lg">
                {hero.primaryCta}
              </Button>
              <Button href="#pricing" variant="secondary" size="lg">
                {hero.secondaryCta}
              </Button>
            </div>

            <p className="mt-5 text-[0.8125rem] leading-relaxed text-fg-muted">
              {hero.supportLine}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative rounded-3xl border border-border-soft bg-surface/40 p-2.5 sm:p-3.5">
              <MediaPlaceholder
                kind="screen"
                label={heroMediaLabel}
                alt={hero.mediaAlt}
                aspect="aspect-[4/5] sm:aspect-[16/11]"
              />

              {/* Required stamp — solid background, no blur behind legal text. */}
              <p className="absolute left-5 top-5 inline-flex max-w-[calc(100%_-_2.5rem)] items-center gap-1.5 rounded-full border border-warning/35 bg-bg px-2.5 py-1 text-[0.6875rem] font-medium leading-normal text-warning sm:left-6 sm:top-6">
                <TriangleAlert className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {heroIllustrativeStamp}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* Mandatory adjacent disclosure — sits directly below the hero fold, not buried. */}
      <div className="border-t border-border-soft bg-surface/25">
        <Container>
          <div className="flex items-start gap-3 py-4">
            <Info
              className="mt-px h-4 w-4 shrink-0 text-fg-muted"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <Disclosure tone="note" className="max-w-3xl">
              {hero.riskDisclosure}
            </Disclosure>
          </div>
        </Container>
      </div>
    </section>
  )
}
