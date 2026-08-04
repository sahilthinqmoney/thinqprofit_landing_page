import { useEffect, useState } from 'react'
import Container from '../ui/Container'
import Disclosure from '../ui/Disclosure'
import WaitlistForm from '../ui/WaitlistForm'
import { SCALE } from '../ui/SectionShell'
import { hero, offerQualifier } from '../../data/hero'
import { cadencePromise, waitlistCount, waitlistCountNoun } from '../../data/waitlist'

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
 * "Charts that say everything." is four words. The previous headline was set as
 * three hand-broken lines and this file did the splitting; there is nothing to
 * split now, and a `\n` that agrees with where the text would wrap anyway is a
 * comment rather than a direction. The per-line settle machinery stays — it
 * animates whatever lines the string produces, which today is one on a desktop
 * and two on a phone.
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
      className="relative isolate flex min-h-[calc(100svh-var(--header-stack))] w-full flex-col overflow-hidden bg-bg"
    >
      {/* Full-bleed background clip. `aria-hidden` because it carries no
          information — the alt text that describes it lives in `hero.mediaAlt`
          for the day this becomes a `<picture>` again. */}
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

      {/*
        The scrim is denser than it was, and it has to be: the copy block below
        it grew from a headline and a button to a headline, a paragraph, an
        offer line, a form and a count. A gradient tuned for three elements
        leaves the fifth one sitting on whatever the video is doing.

        It runs left-to-right rather than as a radial core, because the form's
        input is a `bg-surface` fill that needs a predictable ground behind its
        border for the full width of the copy column, not a soft falloff that is
        dark under the headline and thin under the field.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/85 to-bg/30"
      />

      <div className="flex flex-1 items-center pt-24 pb-16 md:pt-0 md:pb-0">
        <Container>
          <div className="md:mr-[42%]">
            {/*
              The badge. A bordered chip rather than bare text, because at 12px
              on a moving video an unbordered line reads as a caption that failed
              to load; the rule around it is what says "this is a label".

              `chrome`, not `accent`. The form's submit button is two elements
              below and it is the one copper object in this section — a copper
              chip above it would put the action colour on something that cannot
              be acted on, which is §4 rule 1 exactly.
            */}
            <p
              className="inline-flex items-center rounded-full border border-border-soft bg-surface/60 px-3 py-1.5 text-xs font-medium tracking-wide text-fg-muted backdrop-blur-sm transition-[opacity,transform] duration-700"
              style={{
                transitionTimingFunction: 'var(--ease-out-expo)',
                opacity: settled ? 1 : 0,
                transform: settled ? 'translateY(0)' : 'translateY(-6px)',
              }}
            >
              {hero.eyebrow}
            </p>

            {/*
              `SCALE.hero`, imported rather than hand-written, and this is a
              REGRESSION FIX rather than a refinement — worth recording because
              the failure was silent and lasted two commits.

              The H1 carried `display-lead font-display leading-[0.94em]` and no
              font-size at all. None of those three sets one: `.display-lead` is
              a VOICE (axis coordinates, tracking, `text-wrap`) and deliberately
              declares no size, because `SectionShell` owns the ladder. Tailwind's
              preflight resets `h1` to `font-size: inherit`, so the page's largest
              statement was rendering at 16px body size — visually a bold
              paragraph. It happened during the copper retheme, which replaced the
              old inline `text-[clamp(3.25rem,8vw,7.5rem)]` with the voice class
              and did not put the size back.

              The lesson is the one `SectionShell`'s own note already stated and
              this file was the exception to: every rendered size resolves to a
              NAMED role. `SCALE.hero` is the H1's step, it is excluded from
              `SectionShell`'s assignable steps by its type, and importing it here
              is what stops the hero's size and the section ladder drifting apart
              — which is exactly what happened while it was a literal.

              `leading-[0.94em]` goes with it. `SCALE.hero` ships `leading-[0.94]`
              unitless, which on this element resolves to the same measure, and
              the +0.14em clip allowance on each line block below makes the real
              baseline-to-baseline 1.08em. Two declarations of one value is how
              they end up disagreeing.
            */}
            <h1
              className={`display-lead mt-7 font-display tracking-tight text-fg ${SCALE.hero}`}
              style={{
                fontVariationSettings: settled
                  ? '"wdth" 82, "wght" 580'
                  : '"wdth" 75, "wght" 250',
              }}
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
              <p className="mt-8 max-w-[32em] text-lg leading-relaxed text-fg-muted">
                {hero.subheadline}
              </p>

              {/*
                The offer, and its qualifier on the same line at the same size.

                `fg` on the claim and `fg-muted` on the limit is a one-step
                difference — deliberately small. The qualifier is not fine print
                and must never be set as such: the gap between "six months of
                zero brokerage" and what a customer actually pays is exactly the
                gap this sentence exists to close.
              */}
              <p className="mt-6 max-w-[32em] text-base leading-relaxed">
                <span className="font-medium text-fg">{hero.primaryCta}</span>{' '}
                <span className="text-fg-muted">{offerQualifier}</span>
              </p>

              <WaitlistForm variant="hero" className="mt-8" />

              {/*
                Social proof and the frequency promise, on one line.

                The count is set in `.tabular` — IBM Plex Mono, tabular figures —
                which is DESIGN.md §5's rule for every numeral on the page. It
                also means the number does not change width as it ticks, so a
                live count cannot reflow the sentence beside it.

                The cadence promise sits here rather than under the field on
                purpose. Under the field it reads as a disclaimer about the form;
                beside the count it reads as what the other 2,412 people
                receive, which is the same fact stated as evidence.
              */}
              <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-fg-muted">
                <span>
                  <span className="tabular font-medium text-fg">
                    {waitlistCount.toLocaleString('en-IN')}
                  </span>{' '}
                  {waitlistCountNoun}
                </span>
                <span aria-hidden="true" className="text-fg-subtle">
                  ·
                </span>
                <span>{cadencePromise}</span>
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* The disclosure rail. Opaque, never `backdrop-blur` — landing.md §10
          rules out glass behind legal copy, because the contrast it yields
          depends on whatever is scrolling past behind it. */}
      <div className="relative border-t border-border-soft bg-bg">
        <Container>
          <div className="py-4">
            <Disclosure tone="note" className="max-w-3xl">
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
