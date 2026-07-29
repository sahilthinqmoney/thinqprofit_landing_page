import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Disclosure from '../ui/Disclosure'
import HeroCanvas from '../ui/HeroCanvas'
import { hero, heroHeadlineDisplay } from '../../data/hero'

/**
 * §3 Hero — full-bleed motion with the copy set on top of it.
 *
 * The background is a live canvas (HeroCanvas), not a video file: ~6 KB against
 * 2-3 MB, sharp at any DPR, palette read from the tokens, seamless loop. The
 * concept is docs/motion-brief.md §4 variant A — disorder resolving into an
 * orbital band, right of frame so the headline keeps the left.
 *
 * This is the page's one authored motion moment. The headline arrives a line at
 * a time, each settling out of a blur while the field behind it is still
 * finding its shape — the type resolving as the noise resolves. Everything
 * below the fold uses the quiet `Reveal` and nothing else; if every section
 * performed, none of them would land, and this one would stop meaning anything.
 *
 * Note what it is not: nothing rises as a *promise*. The motion damps downward
 * into place, never up. motion-brief §7 rules out upward motion on a broker
 * page because the eye reads it as a claim about returns.
 *
 * The market-risk disclosure stays. It is mandatory and it is not decoration —
 * copy deck §3 requires it visible, adjacent to the hero, never collapsed, and
 * landing.md §10 forbids putting it behind a blur, so the rail is opaque.
 *
 * To swap in a real video later: drop <HeroCanvas /> for a <MediaBackdrop
 * video={…} poster={…} />. Encoding targets are in docs/motion-brief.md §6.
 */
export default function Hero() {
  const lines = heroHeadlineDisplay.split('\n')
  const settled = useOpeningSettle()

  return (
    /*
     * The hero is one viewport *minus the header stack above it*, not a full
     * `svh`. At a plain `min-h-svh` the announcement bar and nav push the
     * disclosure rail off the bottom of the first screen — and copy deck §3
     * requires that disclosure visible in the first viewport, not merely on the
     * page. `--header-stack` is declared in index.css so the two stay in step.
     */
    <section
      id="hero"
      className="relative isolate flex min-h-[calc(100svh-var(--header-stack))] w-full flex-col overflow-hidden"
    >
      {/* Animated field. Decorative, aria-hidden, pauses offscreen. */}
      <HeroCanvas className="-z-20" />

      {/* Scrim sized and placed to sit under the copy, not across the frame —
          it overscans the section so its soft edge never lands inside it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[20%] -bottom-[20%] -top-[25%] -z-10"
        style={{
          backgroundImage:
            'radial-gradient(58% 62% at 30% 46%, rgba(11,11,13,0.94) 0%, rgba(11,11,13,0.7) 44%, rgba(11,11,13,0) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="flex flex-1 items-center pt-28 pb-20 md:pt-0 md:pb-0">
        <Container>
          <div className="md:mr-[46%]">
            {/*
              No kicker. The registration line that used to sit here repeated,
              word for word, the trust strip directly below it — a label whose
              only job was filling the space above a headline. The headline
              opens the page now.
            */}
            {/*
              The width flex is the interactive half of the opening: the
              headline starts narrow and light and *widens* into its final
              coordinate, so the type resolves as the field behind it resolves.
              It reads as the words being drawn rather than revealed.

              `display-settling` is only applied while the settle is pending —
              once it drops, `.display` reasserts and the transition on
              `.display-flex` carries it across. The transition itself is gated
              in CSS to ≥768px and no-preference, because animating
              `font-variation-settings` re-lays-out text on every frame.
            */}
            <h1
              className={`display display-flex m-0 text-[clamp(3rem,7vw,5.75rem)] leading-[1.04] text-fg ${
                settled ? '' : 'display-settling'
              }`}
              style={{ maxWidth: '10em' }}
            >
              {lines.map((line, index) => (
                // The clipping wrapper is what makes it read as arriving from
                // somewhere rather than fading in place.
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <span
                    className="block transition-[opacity,transform,filter] duration-[900ms]"
                    style={{
                      transitionTimingFunction: 'var(--ease-out-expo)',
                      transitionDelay: `${90 + index * 110}ms`,
                      opacity: settled ? 1 : 0,
                      transform: settled ? 'translateY(0)' : 'translateY(-0.14em)',
                      filter: settled ? 'blur(0)' : 'blur(10px)',
                    }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <div
              className="transition-[opacity,transform] duration-700"
              style={{
                transitionTimingFunction: 'var(--ease-out-expo)',
                transitionDelay: `${90 + lines.length * 110}ms`,
                opacity: settled ? 1 : 0,
                transform: settled ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              <p className="mt-8 max-w-[34em] text-base leading-relaxed text-fg-muted">
                {hero.subheadline}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href="#onboarding"
                  size="lg"
                  trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />}
                >
                  {hero.primaryCta}
                </Button>
                <Button href="#pricing" variant="ghost" size="lg">
                  {hero.secondaryCta}
                </Button>
              </div>

              {/* `fg-muted` (8.07:1), not `fg-subtle` (3.75:1) — this is a
                  marketing claim, and index.css reserves subtle for footer meta
                  and legal fine print, where 3.75:1 is the documented floor. */}
              <p className="mt-8 text-[0.8125rem] leading-relaxed text-fg-muted">
                {hero.supportLine}
              </p>
            </div>
          </div>
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

/**
 * Drives the opening. Returns `true` once the settle should run — immediately
 * and without animation under Reduce Motion, otherwise on the frame after mount
 * so the transition has a start state to move from.
 *
 * Two nested frames, not one: a single rAF can land in the same paint as the
 * initial render, in which case the browser never observes the "before" values
 * and the headline simply appears.
 */
function useOpeningSettle() {
  const [settled, setSettled] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setSettled(false)
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSettled(true))
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  return settled
}
