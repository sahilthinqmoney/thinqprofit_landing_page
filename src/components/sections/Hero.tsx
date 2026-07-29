import { ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Disclosure from '../ui/Disclosure'
import HeroCanvas from '../ui/HeroCanvas'
import Reveal from '../ui/Reveal'
import { hero, heroHeadlineDisplay } from '../../data/hero'

/**
 * §3 Hero — full-bleed motion with the copy set on top of it.
 *
 * The background is a live canvas (HeroCanvas), not a video file: ~6 KB against
 * 2-3 MB, sharp at any DPR, palette read from the tokens, seamless loop. The
 * concept is docs/motion-brief.md §4 variant A — disorder resolving into an
 * orbital band, right of frame so the headline keeps the left.
 *
 * Mechanically this is the same section as `MediaSection`, hand-built because
 * the hero needs two things that primitive does not carry: a `<canvas>` in
 * place of a `<picture>`/`<video>`, and the disclosure rail pinned to the
 * bottom edge. Everything else matches deliberately — fixed 900px desktop
 * height rather than `min-h-svh`, copy parked by percentage margin, measure in
 * `em`, art-directed line breaks, and a radial scrim sized to the copy instead
 * of a flat wash over the whole frame.
 *
 * The market-risk disclosure stays. It is mandatory and it is not decoration —
 * copy deck §3 requires it visible, adjacent to the hero, never collapsed, and
 * landing.md §10 forbids putting it behind a blur, so the rail is opaque.
 *
 * To swap in a real video later: drop <HeroCanvas /> for a <MediaBackdrop
 * video={…} poster={…} />. Encoding targets are in docs/motion-brief.md §6.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex w-full flex-col overflow-hidden min-h-svh"
    >
      {/* Animated field. Decorative, aria-hidden, pauses offscreen. */}
      <HeroCanvas className="-z-20" />

      {/* Scrim sized and placed to sit under the copy, not across the frame —
          it overscans the section so its soft edge never lands inside it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[20%] -top-[25%] -bottom-[20%] -z-10"
        style={{
          backgroundImage:
            'radial-gradient(58% 62% at 30% 46%, rgba(15,23,42,0.94) 0%, rgba(15,23,42,0.7) 44%, rgba(15,23,42,0) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="flex flex-1 items-center pt-28 pb-20 md:pt-0 md:pb-0">
        <Container>
          <Reveal className="md:mr-[46%]">
            {/* No pill, no chip, no icon tile: the registration line is quiet
                white, one step down. A bordered badge with a backdrop-blur is
                exactly the treatment this redesign is removing. */}
            <p className="text-base text-white/45">{hero.eyebrow}</p>

            <h1
              className="mt-6 whitespace-normal text-[clamp(2.75rem,6.4vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white md:whitespace-pre-line"
              style={{ maxWidth: '9em' }}
            >
              {heroHeadlineDisplay}
            </h1>

            <p className="mt-7 max-w-[32em] text-base leading-relaxed text-white/70">
              {hero.subheadline}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#onboarding" size="lg">
                {hero.primaryCta}
              </Button>
              <Button href="#pricing" variant="ghost" size="lg">
                {hero.secondaryCta}
              </Button>
            </div>

            <p className="mt-7 text-[0.8125rem] leading-relaxed text-white/50">
              {hero.supportLine}
            </p>
          </Reveal>
        </Container>
      </div>

      {/* Mandatory market-risk disclosure — live text on an opaque rail. No
          backdrop-blur: landing.md §10 rules out glass behind legal copy,
          because the contrast it yields depends on whatever is scrolling past. */}
      <div className="relative border-t border-border-soft bg-bg">
        <Container>
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Disclosure tone="note" className="max-w-3xl">
              {hero.riskDisclosure}
            </Disclosure>

            <a
              href="#registrations"
              aria-label="Scroll to registrations"
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full text-xs text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              Scroll
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </Container>
      </div>
    </section>
  )
}
