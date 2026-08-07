import { useEffect, useState } from 'react'
import Container from '../ui/Container'
import Disclosure from '../ui/Disclosure'
import Button from '../ui/Button'
import { SCALE } from '../../lib/layout'
import { hero } from '../../data/hero'
import MediaBackdrop from '../ui/MediaBackdrop'


/**
 * §2 Hero — full-bleed clip with the copy and the phone field on top of it.
 *
 * The hero CONTAINS the conversion rather than linking to it. The ask is a phone
 * number and the cost of giving it is a fortnightly message, so a reader already
 * convinced by the offer should not have to scroll four sections to act on it.
 *
 * Two rules govern the opening motion:
 *
 *  - The headline settles out of a blur, a line at a time, while the field
 *    behind it resolves. This is the page's one authored motion moment.
 *  - Nothing rises. The motion damps DOWNWARD into place, because
 *    docs/motion-brief.md §7 reads upward motion on a broker page as a claim
 *    about returns.
 *
 * The headline is split on `\n`, so it animates whatever lines the string
 * produces — the current copy carries no breaks and wraps on its own.
 *
 * The market-risk disclosure sits in an opaque rail at the foot of the section:
 * mandatory, visible in the first viewport, never collapsed, never behind a
 * blur.
 */

export default function Hero() {
  const lines = hero.headline.split('\n')
  const settled = useOpeningSettle()

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-svh w-full flex-col justify-between overflow-hidden bg-bg pt-0 pb-0"
    >

      {/* Full-bleed background media layer */}
      <MediaBackdrop alt={hero.mediaAlt} video="/clips/hero-backdrop.mp4" focus="center" />



      {/* Top Ambient Keynote Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,255,255,0.12),rgba(255,255,255,0))]"
      />

      {/* Dark overlay with balanced opacity to enhance background visibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-black/20 bg-[radial-gradient(ellipse_80%_80%_at_50%_45%,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.5)_100%)]"
      />


      <div className="flex flex-1 flex-col items-center justify-center my-auto py-0">


        <Container>
          <div className="mx-auto max-w-[52em] text-center">
            {/* Display H1 Headline with Metallic Depth */}
            <h1
              className={`display-lead mt-4 font-display tracking-tight text-balance drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] ${SCALE.hero}`}
              style={{
                fontVariationSettings: settled
                  ? '"wdth" 82, "wght" 580'
                  : '"wdth" 75, "wght" 250',
              }}
            >
              {lines.map((line: string, index: number) => (
                <span key={line} className="block overflow-hidden pb-[0.12em]">
                  <span
                    className="block bg-gradient-to-b from-white via-white/95 to-white/80 bg-clip-text text-transparent transition-[opacity,transform] duration-[900ms]"
                    style={{
                      transitionTimingFunction: 'var(--ease-out-expo)',
                      transitionDelay: `${90 + index * 110}ms`,
                      opacity: settled ? 1 : 0,
                      transform: settled ? 'translateY(0)' : 'translateY(-0.14em)',
                    }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            {/* Subheadline & Value Proposition */}
            <div
              className="transition-[opacity,transform] duration-700"
              style={{
                transitionTimingFunction: 'var(--ease-out-expo)',
                transitionDelay: `${90 + lines.length * 110}ms`,
                opacity: settled ? 1 : 0,
                transform: settled ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              <p className="mt-6 max-w-[34em] mx-auto text-[1.0625rem] sm:text-[1.1875rem] leading-[1.65] text-white/80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] text-balance font-normal">
                <span className="font-semibold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">6 Months</span> at{' '}
                <span className="font-semibold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">₹0 brokerage</span> on equity, futures and options — no tiers or conditions.
              </p>



              {/* High-End Mobile Number Input + Join the waitlist CTA Lockup */}
              <div className="mt-8 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
                <div className="w-full flex flex-col items-start gap-1.5">
                  <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase ml-4">
                    MOBILE NUMBER
                  </span>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const el = document.getElementById('final-cta')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  >
                    <div className="relative flex-1 w-full flex items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl px-5 py-3 text-white transition-all duration-300 focus-within:border-white/50 focus-within:bg-black/60 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                      <span className="text-white/80 font-mono text-sm font-medium mr-3 border-r border-white/20 pr-3 shrink-0">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Mobile number"
                        className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none font-normal"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto shrink-0 shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:shadow-[0_0_32px_rgba(255,255,255,0.25)] transition-all duration-300"
                    >
                      Join the waitlist
                    </Button>
                  </form>
                </div>
              </div>


            </div>
          </div>
        </Container>
      </div>

      {/* Statutory Disclosure Rail pinned seamlessly at bottom fold */}
      <div className="relative w-full border-t border-white/10 bg-surface/40 mt-auto">

        <Container>
          <div className="py-3.5 text-center">
            <Disclosure tone="note" className="max-w-4xl mx-auto text-xs text-fg-subtle">
              {hero.riskDisclosure}
            </Disclosure>
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
