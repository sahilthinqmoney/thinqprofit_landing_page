import Button from '../ui/Button'
import Container from '../ui/Container'
import MediaPlaceholder from '../ui/MediaPlaceholder'
import Reveal from '../ui/Reveal'
import { appCopy, appFeatures } from '../../data/app'

/**
 * §9 Mobile app.
 *
 * The page's deliberate palette break: a flat raised-surface band sitting
 * between two full-bleed media sections, so the eye gets one solid colour block
 * between two photographic ones. It is intentionally NOT a `MediaSection` — a
 * third consecutive image is exactly the monotony this beat exists to break.
 *
 * The whole visual idea is the bottom crop. Copy is centred, the device sits
 * below the CTAs and is cut off by the section's own bottom edge
 * (`overflow-hidden` + a translate that pushes it past that edge). No side
 * column, no floating device on a glow — the section frame does the work.
 *
 * Height is fixed at 880px from `md` up so the crop lands in the same place on
 * every desktop rather than drifting with copy length; below 768px the section
 * is content-sized, because a fixed height on a phone just clips words.
 *
 * Store CTAs stay secondary — the page has exactly one primary action, and it
 * isn't "download an app" (landing.md §1, conflict 3).
 */
interface MobileAppProps {
  id?: string
}

export default function MobileApp({ id = 'mobile-app' }: MobileAppProps) {
  return (
    <section
      id={id}
      className="relative flex min-h-svh scroll-mt-24 flex-col justify-center overflow-hidden bg-surface-raised"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Centred copy                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Container>
        {/* Wrapper is wider than the copy needs on purpose: the headline and
            body carry their own measure caps, and the flowed feature line wants
            the extra width so it settles on two lines instead of three. */}
        <div className="mx-auto max-w-[56rem] pt-20 text-center">
          <Reveal>
            {/* Plain muted label, not an uppercase accent chip — the coloured
                tracking-[0.2em] eyebrow is the generic-AI-page tell, and indigo
                is reserved for the action, not for decoration. */}
            <p className="text-base text-fg-muted">{appCopy.eyebrow}</p>

            <h2 className="mx-auto mt-4 max-w-[13em] text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.03em] text-fg">
              {appCopy.heading}
            </h2>

            <p className="mx-auto mt-5 max-w-[34em] text-base leading-relaxed text-fg-muted">
              {appCopy.body}
            </p>
          </Reveal>

          {/* Features survive as one quiet flowed line. As bordered chips they
              read as four more cards on a page that already has enough. */}
          <Reveal delay={60}>
            {/* Inline `li`s, not flex items: this has to wrap as one run of
                prose. As a flex row the separator is its own box, so a label
                that wraps internally leaves its `·` stranded on the line above.
                The separator is glued to the label it follows with a
                non-breaking space, so a line can only ever break *after* it. */}
            <ul className="mx-auto mt-6 max-w-[54rem] text-sm leading-relaxed text-fg-muted">
              {appFeatures.map((feature, index) => (
                <li key={feature.label} className="inline">
                  {feature.label}
                  {index < appFeatures.length - 1 && (
                    <span aria-hidden="true" className="text-fg-subtle">
                      {'\u00A0· '}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Text-only store CTAs. lucide ships no brand marks — its `Apple`
              glyph is a piece of fruit, not the Apple Inc. wordmark — and
              Footer.tsx makes the same call for the social row. The deck's
              labels name both stores unambiguously without a badge. */}
          <Reveal delay={120}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {appCopy.storeCtas.map((cta) => (
                <Button key={cta.label} href={cta.href} variant="secondary">
                  {cta.label}
                </Button>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* Device — centred, cropped by the section's bottom edge               */}
      {/* ------------------------------------------------------------------ */}
      {/* Outer div does the positioning only: from `md` it pins to the bottom of
          the fixed 880px band, below that it is a normal flow row. It must stay
          transform-free, or it would become the containing block for its own
          absolute positioning. The negative margin is the mobile counterweight
          to the crop translate below — that translate moves the device down
          without moving its box, and without this the gap under the CTAs reads
          as ~210px of dead band on a phone. */}
      <div className="-mt-20 flex justify-center md:absolute md:inset-x-0 md:bottom-0 md:mt-0">
        {/* The crop. `translate-y` shifts the device visually without changing
            its layout box, so the section's bottom edge stays exactly where the
            box ends and everything below it is clipped. The md/lg steps are
            measured against the copy stack, not guessed: they hold the visible
            slice at ~325px so the device never climbs into the CTA row — the
            clearance runs 54px at 1280–1600 and widens below that. */}
        <div className="w-[16rem] translate-y-[30%] sm:w-[17rem] md:w-[18rem] md:translate-y-[43%] lg:w-[20rem] lg:translate-y-[48.5%]">
          <Reveal delay={180}>
            {/* Minimal bezel: hairline border, large radius. No speaker pill, no
                home indicator, no blurred accent glow behind it. */}
            <div className="rounded-[2.25rem] border border-border bg-surface p-2">
              {/* Wrapper clips the placeholder's own radius to the bezel's inner
                  curve — two rounded-* utilities on one element resolve by
                  stylesheet order, not source order. */}
              <div className="overflow-hidden rounded-[1.75rem]">
                {/* `pb` is scaffolding, not styling: MediaPlaceholder centres its
                    brief in its own box, and roughly the lower 40% of that box is
                    off-frame here, so the brief would be cut mid-sentence.
                    Padding-bottom lifts it into the visible half. It leaves with
                    the placeholder when the real screenshot lands — the reserved
                    9/19 box is unchanged, so nothing shifts (CLS). */}
                <MediaPlaceholder
                  kind="screen"
                  aspect="aspect-[9/19]"
                  className="pb-[78%]"
                  label="Screen stays dark — the real UI is composited in later. No prices, P&L or chart forms."
                  alt="The ThinqProfit app running on a phone"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
