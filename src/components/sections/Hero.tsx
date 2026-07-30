import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Disclosure from '../ui/Disclosure'
import MediaBackdrop from '../ui/MediaBackdrop'
import { hero, heroHeadlineDisplay } from '../../data/hero'

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
      {/*
        A1, from docs/art-direction.md §3 — rendered by `tools/plates`, four
        art-directed crops plus an 8s loop for the two widest.

        This is the swap this file's header comment described, and it is worth
        stating what it cost and what it bought. It cost the procedural field:
        ~6 KB of canvas that read the palette from the tokens and could never
        drift from them. It bought the subject the rest of the page is now made
        of — the same machined aluminium as Products, Platform, Onboarding and
        the closing plate, lit by the same key, graded to the same black point.
        Six sections reading as one shoot is §5.5's test, and a procedural field
        in the hero was the one frame that could never join it.

        The loop is served at ≥769px only. Below that `MediaBackdrop` falls to
        the `mobile` and `tablet` crops, which is §4.2's rule and not a
        bandwidth optimisation: on a phone the copy is full-width and
        top-anchored, so the dead zone is somewhere else entirely and a 16:9
        frame cropped to 9:16 reserves nothing.
      */}
      <MediaBackdrop
        alt={hero.mediaAlt}
        image={{
          mobile: '/media/hero/hero-mobile.webp',
          tablet: '/media/hero/hero-tablet.webp',
          desktop: '/media/hero/hero-desktop.webp',
          wide: '/media/hero/hero-wide.webp',
        }}
        video={{ webm: '/media/hero/hero.webm', mp4: '/media/hero/hero.mp4' }}
        poster="/media/hero/hero-poster.webp"
      />

      {/* Scrim sized and placed to sit under the copy, not across the frame —
          it overscans the section so its soft edge never lands inside it.

          The RGB is `--color-bg` exactly (5,5,5), not a tint of it. A scrim is a
          thickening of the ground, so any drift between the two shows up as a
          cast in the falloff — and against a neutral alloy field a scrim carrying
          even a couple of points of blue or warmth reads as a haze laid over the
          page rather than as the page getting darker. It also has to agree with
          the `to-bg` fade directly below it, which is #050505 by definition. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[20%] -bottom-[20%] -top-[25%] -z-10"
        style={{
          backgroundImage:
            'radial-gradient(58% 62% at 30% 46%, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.7) 44%, rgba(5,5,5,0) 100%)',
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
              /*
               * 120px at the top end, leading below 1, tracking to -0.045em.
               *
               * The hero is the only place on this page allowed to be loud, and
               * the whole page's seriousness depends on it landing. At 104px with
               * 1.02 leading the three lines read as large text; at 120px with
               * 0.98 they read as a mark — the lines nearly touch, which is what
               * makes a stacked headline behave as one block instead of three
               * sentences. Tracking has to tighten with size or the extra width
               * just spreads the words apart.
               *
               * The measure tightens with it: at 9em the three lines break where
               * they are written to break, and the block reads as a sculpted
               * shape rather than as a paragraph that happens to be large.
               */
              /* The floor rises with the rest of the ladder. At a 3rem floor the
                 hero rendered 48px on a phone against a `lead` section title's
                 new 40px — 1.2×, close enough that the page's largest statement
                 stopped reading as the largest. 3.25rem restores it to 1.3×. */
              className={`display display-flex m-0 text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.98] tracking-[-0.045em] text-fg ${
                settled ? '' : 'display-settling'
              }`}
              style={{ maxWidth: '9em' }}
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
              {/* One size up from body, and the only line of prose in the
                  viewport. `fg-muted` at 13.08:1 — a step below the headline in
                  rank, nowhere near the floor.

                  30em, not 26: the line is 54 characters, which sets to ~27em at
                  this size, so a 26em measure broke it one word early and left
                  "funds." alone on a second line. A one-line subhead under a
                  three-line headline is the whole shape of this hero; an orphan
                  turns it into a paragraph. */}
              <p className="mt-12 max-w-[30em] text-lg leading-relaxed text-fg-muted">
                {hero.subheadline}
              </p>

              {/*
                One action. `hero.secondaryCta` ("See pricing") is deliberately
                not rendered here.

                Two actions side by side is a choice, and a stranger deciding
                whether to trust you with money should not be handed a choice
                before they have been given a reason. Removing it also leaves the
                alloy ring as the only interactive thing in the viewport, which is
                the entire point of reserving that treatment for one control.

                It costs nothing, because the path is not lost: `Pricing` is a
                top-level nav item three inches above this, and the Pricing
                section states the rate card in full. The string stays in the deck.

                `items-start` is not cosmetic — a flex column defaults to
                `stretch`, which stretches the rim wrapper full-width while the
                dark core inside stays content-width, turning a 2px ring into
                slabs of metal either side of the label.
              */}
              <div className="mt-14 flex flex-col items-start">
                <Button
                  href="#final-cta"
                  size="lg"
                  trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />}
                >
                  {hero.primaryCta}
                </Button>
              </div>

              {/*
                `hero.supportLine` is deliberately not rendered. It read "Free
                account opening · Aadhaar eKYC · Ready to trade the same day" —
                and all three facts belong to sections that state them properly:
                Onboarding owns eKYC and same-day activation, Pricing owns free
                opening. In the hero they were a third block of text competing
                with the one line that matters, and three unsupported claims in
                small grey type is what a hero looks like when nobody was willing
                to choose. The string stays in the deck for whoever needs it.
              */}
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
