import Button from '../ui/Button'
import Container from '../ui/Container'
import MediaPlaceholder from '../ui/MediaPlaceholder'
import Reveal from '../ui/Reveal'
import { appCopy, appFeatures } from '../../data/app'

/**
 * §9 Mobile app.
 *
 * The page's deliberate material break. Every neighbour on this stretch either
 * bleeds a photograph to the viewport edge or sits on flat ink; this band is
 * neither. It is one solid plate of `surface` under `.surface-chrome` — a
 * brushed-metal wash, not a texture — closed at the top by `.rule-chrome`, so
 * the boundary reads as the lip of a machined surface rather than as another
 * hairline divider. That is the whole reason the section is not a MediaSection:
 * a third consecutive image is exactly the monotony this beat exists to break.
 *
 * The second reason it is not a MediaSection is the crop. Copy is centred, and
 * the device is cut off by the section's own bottom edge (`overflow-hidden` plus
 * a translate that pushes it past that edge). No side column, no device floating
 * on a glow — the section frame does the work, and the phone reads as an object
 * continuing past the page rather than as an image pasted onto it.
 *
 * Clearance is reserved, not guessed. From `md` the device is pinned to the
 * bottom and shows ~350px above the crop, so the copy column carries a matching
 * `pb` and the flex centring resolves inside what is left. The gap between the
 * store CTAs and the top of the phone therefore stays ~50px at short viewports
 * and opens up on tall ones, instead of drifting into the CTA row.
 *
 * What is not here:
 *  - No eyebrow. `appCopy.eyebrow` ("On the go") is dropped outright — a
 *    category label above a heading is decoration wearing the costume of
 *    information, and the heading already says where this runs.
 *  - No `appCopy.qrLine`. "Scan to install" is a caption for a QR code that does
 *    not exist, and one cannot be fabricated here.
 *  - No `appCopy.ratingLine`. It is `[X.X] on the App Store · [X.X] on Google
 *    Play` — every value in it is an unfilled placeholder, so rendering it (even
 *    correctly flagged through CopyText) would put two warning-orange stubs
 *    beside the store buttons and communicate nothing. The deck's own TODO says
 *    "use live ratings or delete this line"; until real ratings land, deleted.
 *
 * Store CTAs stay secondary — the page has exactly one primary action, and it
 * isn't "download an app" (landing.md §1, conflict 3). For the same reason
 * neither takes Button's `trailing` well, which the Hero holds alone.
 */
interface MobileAppProps {
  id?: string
}

export default function MobileApp({ id = 'mobile-app' }: MobileAppProps) {
  return (
    <section
      id={id}
      className="surface-chrome relative flex min-h-svh scroll-mt-24 flex-col justify-center overflow-hidden"
    >
      {/* The plate's top lip. Full-bleed, so it runs edge to edge rather than
          stopping at the container gutter — a metallic edge that stops short of
          the viewport reads as a rule under a heading, not as the boundary of a
          surface. Absolute, so it stays out of the flex centring. */}
      <div aria-hidden="true" className="rule-chrome absolute inset-x-0 top-0 h-px" />

      {/* ------------------------------------------------------------------ */}
      {/* Centred copy                                                        */}
      {/* ------------------------------------------------------------------ */}
      {/* The bottom pad is the device's visible slice, reserved. Below `md` the
          phone is a normal flow row, so the pad would only be dead space. */}
      <Container className="pt-24 sm:pt-28 md:pb-[25rem]">
        {/* Wider than the copy needs on purpose: the headline and body carry
            their own measure caps, and the flowed feature line wants the extra
            width so it settles on two lines instead of three. */}
        <div className="mx-auto max-w-[56rem] text-center">
          <Reveal>
            {/* `.display` sets the face, the 400 weight and the tracking — size
                carries the emphasis, so there is no `font-medium` here and no
                hand-tuned `tracking-*` fighting the utility.
                The 12em cap is art direction: it holds the line just short of
                fitting, so `text-wrap: balance` (also from `.display`) resolves
                the heading to two even lines broken at the comma on every
                desktop width, instead of flipping between one and two. */}
            <h2 className="display mx-auto max-w-[12em] text-[clamp(2.5rem,5.5vw,4rem)] leading-[1.05] text-fg">
              {appCopy.heading}
            </h2>

            <p className="mx-auto mt-6 max-w-[34em] text-base leading-relaxed text-fg-muted">
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
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          the band, below that it is a normal flow row. It must stay
          transform-free, or it would become the containing block for its own
          absolute positioning. The negative margin is the mobile counterweight
          to the crop translate below — that translate moves the device down
          without moving its box, and without this the gap under the CTAs reads
          as ~170px of dead band on a phone. */}
      <div className="-mt-20 flex justify-center md:absolute md:inset-x-0 md:bottom-0 md:mt-0">
        {/* The crop. `translate-y` shifts the device visually without changing
            its layout box, so the section's bottom edge stays exactly where the
            box ends and everything below it is clipped. The md/lg steps hold the
            visible slice at ~350px, which is what the copy column reserves. */}
        <div className="w-[16rem] translate-y-[30%] sm:w-[17rem] md:w-[18rem] md:translate-y-[43%] lg:w-[20rem] lg:translate-y-[48.5%]">
          <Reveal delay={180}>
            {/* One hairline and a radius, nothing else. No speaker pill, no home
                indicator, no accent glow. The edge is `chrome`, not `border`,
                because that is the token's job — a machined lip on a metal
                plate — and the body goes to `bg` so the phone reads darker than
                the surface it stands on, the way a real object would. */}
            <div className="rounded-[2.25rem] border border-chrome/20 bg-bg p-2">
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
