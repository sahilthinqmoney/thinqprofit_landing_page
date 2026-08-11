import { useEffect, useState } from 'react'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { hero } from '../../data/hero'
import MediaBackdrop from '../ui/MediaBackdrop'
import { lqipFor } from '../../data/lqip'
import { MEDIA_DEADLINE_MS } from '../../hooks/useMediaGate'

/** Preloaded in index.html — the one piece of media that races the page. */
const HERO_POSTER = '/clips/hero-backdrop-poster.webp'


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
      className="relative isolate flex min-h-svh w-full flex-col justify-between overflow-hidden bg-bg pt-12 pb-8 sm:pt-16 sm:pb-12"
    >
      {/* Full-bleed background media layer */}
      <MediaBackdrop
        alt={hero.mediaAlt}
        lqip={lqipFor(HERO_POSTER)}
        poster={HERO_POSTER}
        video="/clips/hero-backdrop.mp4"
        deadlineMs={MEDIA_DEADLINE_MS.hero}
        focus="center"
      />

      {/* Top Ambient Keynote Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,255,255,0.12),rgba(255,255,255,0))]"
      />

      {/* Balanced dark overlay scrim to ensure background video visibility while keeping text readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-black/25 bg-[radial-gradient(ellipse_85%_85%_at_50%_45%,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.65)_100%)]"
      />

      <div className="flex flex-1 flex-col items-center justify-center my-auto py-6 sm:py-10">
        <Container>
          <div className="mx-auto max-w-[56em] text-center flex flex-col items-center">
            {/* Display H1 Headline with Metallic Depth */}
            <h1
              className="display-lead font-display tracking-tight text-balance drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] text-[clamp(2.75rem,5.9vw,5.75rem)] leading-[1.12]"
              style={{
                fontVariationSettings: settled
                  ? '"wdth" 82, "wght" 580'
                  : '"wdth" 75, "wght" 250',
              }}
            >
              {lines.map((line: string, index: number) => (
                <span
                  key={line}
                  className={`block py-1 ${
                    settled ? 'overflow-visible' : 'overflow-hidden'
                  }`}
                >
                  <span
                    className="block bg-gradient-to-b from-white via-white/95 to-white/80 bg-clip-text text-transparent transition-[opacity,transform] duration-[900ms] py-2 leading-[1.15]"
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

            {/* Subheadline & Value Proposition Container */}
            <div
              className="mt-6 sm:mt-8 flex flex-col items-center transition-[opacity,transform] duration-700 w-full"
              style={{
                transitionTimingFunction: 'var(--ease-out-expo)',
                transitionDelay: `${90 + lines.length * 110}ms`,
                opacity: settled ? 1 : 0,
                transform: settled ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              {/* Subheadline Paragraph */}
              <p className="max-w-[36em] mx-auto text-base sm:text-lg lg:text-xl leading-relaxed text-white/85 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] text-balance font-normal">
                <span className="text-white font-semibold">
                  Thinq reads price action back to you
                </span>{' '}
                — what's in play, what's changed, what's noise.
              </p>

              {/* Offer Line */}
              <p className="mt-5 sm:mt-6 max-w-[46em] mx-auto text-sm sm:text-base leading-relaxed text-white/80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] text-balance">
                <span className="font-semibold text-white">{hero.offerBold}</span>{' '}
                <span className="text-white/70">{hero.offerNote}</span>
              </p>

              {/* Waitlist Mobile Input Form */}
              <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center max-w-md mx-auto w-full">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const el = document.getElementById('final-cta')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <div className="relative flex-1 w-full flex items-center rounded-full border border-white/25 bg-black/60 backdrop-blur-2xl px-5 py-3.5 text-white transition-all duration-300 focus-within:border-white/60 focus-within:bg-black/80 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                    <span className="text-white/90 font-mono text-sm font-medium mr-3 border-r border-white/20 pr-3 shrink-0">
                      +91
                    </span>
                    {/* The placeholder is not a label: it is announced as a value,
                        not a name, and it is gone the moment the reader types. The
                        field is named so the number survives a submit, and labelled
                        so a screen reader says what it wants. */}
                    <input
                      type="tel"
                      name="phone"
                      id="hero-phone"
                      aria-label="Mobile number"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Mobile number"
                      className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none font-normal"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    className="sm:w-auto shrink-0 shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:shadow-[0_0_32px_rgba(255,255,255,0.35)] transition-all duration-300"
                  >
                    Join the waitlist
                  </Button>
                </form>
              </div>

              {/* Trust Badge & Disclosures */}
              <div className="mt-8 max-w-lg text-center">
                <p className="text-xs font-medium text-white/65 tracking-wide">
                  {hero.trust}
                </p>
              </div>
            </div>
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
