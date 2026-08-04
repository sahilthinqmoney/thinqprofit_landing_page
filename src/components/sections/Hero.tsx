import { useEffect, useState } from 'react'
import Container from '../ui/Container'
import Disclosure from '../ui/Disclosure'
import Button from '../ui/Button'
import { SCALE } from '../ui/SectionShell'
import { hero, offerQualifier } from '../../data/hero'
import MediaBackdrop from '../ui/MediaBackdrop'

/**
 * §2 Hero — full-bleed motion with the copy and the form set on top of it.
 *
 * ── What changed: the hero now contains the conversion, not a link to it ───
 *
 * It used to carry a button that scrolled 5,000px to a closing section. That is
 * the right structure for a page selling an account-opening journey, where the
 * decision needs the whole argument first. It is the wrong structure for a
 * waitlist: the ask is a phone number, the cost of giving it is a fortnightly
 * message, and a reader who is already convinced by the offer in the
 * announcement bar should not have to scroll past four sections of persuasion to
 * act on it.
 *
 * So the form is here, above the fold, and the closing section carries the same
 * component for the reader who needed the argument. `WaitlistForm` is one
 * component mounted twice precisely so those two cannot drift.
 *
 * ── The opening motion is unchanged, and the reason it survives ────────────
 *
 * The headline arrives a line at a time, settling out of a blur while the field
 * behind it resolves — the page's one authored motion moment. Everything below
 * the fold uses the quiet `Reveal` and nothing else.
 *
 * Nothing rises as a promise. The motion damps DOWNWARD into place, never up:
 * docs/motion-brief.md §7 rules out upward motion on a broker page because the
 * eye reads it as a claim about returns. That rule is independent of what the
 * page is selling and it applies to a waitlist page exactly as it applied to an
 * account-opening one.
 *
 * ── The H1 no longer carries art-directed breaks ──────────────────────────
 *
 * "The chart tells you what just moved." carries no `\n`. An older headline was
 * set as three hand-broken lines and this file did the splitting; the string
 * wraps on its own at every width now, and a `\n` that agrees with where the
 * text would break anyway is a comment rather than a direction. The per-line
 * settle machinery stays — it animates whatever lines the string produces, which
 * is two on a desktop and three on a phone.
 *
 * The market-risk disclosure stays in its opaque rail at the foot of the
 * section: mandatory, visible in the first viewport, never collapsed, and never
 * behind a blur. `--header-stack` now sums the announcement bar AND the nav so
 * the rail still lands above the fold.
 */

export default function Hero() {
  const lines = hero.headline.split('\n')
  const settled = useOpeningSettle()

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[calc(100svh-var(--header-stack))] w-full flex-col justify-between overflow-hidden bg-bg pt-16 pb-0 lg:pt-24"
    >
      {/* Full-bleed background media layer */}
      <MediaBackdrop alt={hero.mediaAlt} video="/media/hero/hero_section_bg.mp4" focus="center" />

      {/* Top Ambient Keynote Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,255,255,0.12),rgba(255,255,255,0))]"
      />

      {/* Light radial scrim overlay ensuring video details are 60% visible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.35)_70%,rgba(5,5,5,0.75)_100%)]"
      />

      <div className="flex flex-1 items-center my-auto py-8">
        <Container>
          <div className="mx-auto max-w-[52em] text-center">
            {/* Premium Glowing Eyebrow Badge */}
            <div
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-surface/80 px-4 py-1.5 text-xs font-mono tracking-wider text-fg-muted backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] transition-[opacity,transform] duration-700"
              style={{
                transitionTimingFunction: 'var(--ease-out-expo)',
                opacity: settled ? 1 : 0,
                transform: settled ? 'translateY(0)' : 'translateY(-6px)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chrome opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-chrome" />
              </span>
              <span>{hero.eyebrow}</span>
            </div>

            {/* Display H1 Headline with Metallic Depth */}
            <h1
              className={`display-lead mt-6 font-display tracking-tight text-balance drop-shadow-[0_4px_24px_rgba(255,255,255,0.12)] ${SCALE.hero}`}
              style={{
                fontVariationSettings: settled
                  ? '"wdth" 82, "wght" 580'
                  : '"wdth" 75, "wght" 250',
              }}
            >
              {lines.map((line: string, index: number) => (
                <span key={line} className="block overflow-hidden pb-[0.12em]">
                  <span
                    className="block bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent transition-[opacity,transform,filter] duration-[900ms]"
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
              <p className="mt-6 max-w-[34em] mx-auto text-[1.0625rem] sm:text-[1.1875rem] leading-[1.65] text-fg-muted text-balance font-normal">
                {hero.subheadline}
              </p>

              {/* Glassmorphic Offer Highlight Card */}
              <div className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-surface/60 px-5 py-2.5 text-xs sm:text-sm text-fg-muted backdrop-blur-xl shadow-lg">
                <span className="font-medium text-fg">{hero.primaryCta}</span>
                <span className="text-fg-subtle">·</span>
                <span>{offerQualifier}</span>
              </div>

              {/* High-End Primary CTA Button */}
              <div className="mt-8 flex items-center justify-center">
                <Button href="#final-cta" size="lg" className="shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:shadow-[0_0_32px_rgba(255,255,255,0.25)] transition-all duration-300">
                  Get early access
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Statutory Disclosure Rail pinned seamlessly at bottom fold */}
      <div className="relative w-full border-t border-white/10 bg-surface/40 backdrop-blur-xl mt-auto">
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
