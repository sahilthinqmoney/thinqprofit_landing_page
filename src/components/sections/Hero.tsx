import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Disclosure from '../ui/Disclosure'
import { hero } from '../../data/hero'

/**
 * §3 Hero — full-bleed motion with the copy set on top of it.
 *
 * The background is A1 from docs/art-direction.md §3 — a brushed aluminium form
 * curving out of darkness, its mass in the right 40% so the headline keeps the
 * left. Four art-directed crops and an 8s loop, rendered by `tools/plates` and
 * served through `MediaBackdrop`.
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
 * `HeroCanvas` is kept in the tree, unreferenced. It is the fallback if the
 * plate set is ever pulled, and it is the only thing on the page that renders
 * at device pixel ratio rather than at a fixed crop.
 *
 * THE ART-DIRECTED BREAKS SURVIVE THE FACE CHANGE, with one edge to know about.
 * `heroHeadlineDisplay` carries `\n` as art direction and each line renders in
 * its own block, so the breaks are not a wrap and cannot re-rag with the clamp.
 * What CAN change is whether a hand-written line outgrows its column, and Plex
 * sets these lines 5.1–7.1% wider than Archivo: at 120px, 600.4 / 626.8 /
 * 434.9px against 571.2 / 585.3 / 425.1px. Against the 9em measure that is 58.0%
 * where Archivo was 54.2% — no line is close. The binding case is the phone,
 * where the copy runs full width and the clamp bottoms out at 52px: "Your
 * market." sets 271.6px in Plex against 253.7px in Archivo, so inside a 375px
 * viewport's 335px column it clears by 63.4px, and inside a 320px viewport's
 * 280px column by 8.4px. It wraps below a 312px viewport where Archivo wrapped
 * below 294px. No device that ships is below 320px, so this is a margin that
 * narrowed rather than a break — recorded because 8.4px is not much, and because
 * the copy is out of scope to change.
 */
export default function Hero() {
  const lines = hero.headline.split('\n')
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
      className="relative isolate flex min-h-[calc(100svh-var(--header-stack))] w-full flex-col overflow-hidden bg-[#050505] bg-bg"
    >
      {/* Full-bleed background video clip */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center"
      >
        <source src="/media/hero/hero_section_bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay scrim to maintain legibility for the hero copy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-bg/50 bg-gradient-to-r from-bg/85 via-bg/40 to-transparent"
      />

      <div className="flex flex-1 items-center pt-28 pb-20 md:pt-0 md:pb-0">
        <Container>
          <div className="md:mr-[46%]">
            <h1
              className="display-lead font-display leading-[0.94em] tracking-tight"
              style={{ fontVariationSettings: settled ? '"wdth" 82, "wght" 580' : '"wdth" 75, "wght" 250' }}
            >
              {lines.map((line: string, index: number) => (
                <span key={line} className="block overflow-hidden pb-[0.14em]">
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
              <p className="mt-12 max-w-[30em] text-lg leading-relaxed text-fg-muted">
                {hero.subheadline}
              </p>

              <div className="mt-14 flex flex-col items-start">
                <Button
                  href="#final-cta"
                  size="lg"
                  trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />}
                >
                  {hero.primaryCta}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* backdrop-blur: landing.md §10 rules out glass behind legal copy,
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
