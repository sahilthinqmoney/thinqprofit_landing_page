import Button from '../ui/Button'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import { plateImage } from '../../lib/media'
import { appCopy, appFeatures } from '../../data/app'


/** Plate A7's four art-directed crops — see `src/lib/media.ts`. */
const deviceImage = plateImage('device')

/**
 * Feathers the device plate into this section's metal band.
 *
 * Every plate is graded to bottom out on `#050505`, the page ink, so its frame
 * edge dissolves into the page rather than sitting on it. That is right on the
 * sections that sit on ink and wrong here: this band is `surface` under
 * `.surface-chrome`, several levels lighter, so the plate's own ground reads as
 * a darker rectangle laid on the metal and the asset's bounding box shows on
 * three sides.
 *
 * The centre is above the middle because the device is top-anchored and its
 * lower half is already cut by the section's bottom edge — there is nothing to
 * blend down there.
 */
const MASK = 'radial-gradient(86% 52% at 50% 26%, #000 6%, transparent 92%)'

/**
 * The ink pool the plate sits in.
 *
 * Feathering the image alone is not enough on its own: the plate's ground *is*
 * the page ink, several levels darker than this band, so however softly the
 * asset fades it is still fading from a darker value to a lighter one across
 * its own footprint. Laying a pool of that same ink under it — wider than the
 * image on every side — means the only transition left is the pool's, which is
 * a soft radial with no straight edges anywhere in it.
 *
 * Deliberately not a `box-shadow` or a `blur`: both would put a halo around a
 * rectangle, and the rectangle is the thing being hidden.
 */
const POOL =
  'radial-gradient(62% 54% at 50% 34%, #050505 0%, rgba(5,5,5,0.82) 42%, rgba(5,5,5,0) 100%)'

/**
 * §9 Mobile app.
 *
 * The page's deliberate material break. Every neighbour on this stretch either
 * bleeds a photograph to the viewport edge or sits on flat ink; this band is
 * neither. It is one solid plate of `surface` under `.surface-chrome` — a
 * brushed-metal wash, not a texture — closed at the top by a plain `border`
 * hairline. That is the whole reason the section is not a MediaSection: a third
 * consecutive image is exactly the monotony this beat exists to break.
 *
 * The top edge used to be `.rule-chrome`. It is not any more, because that
 * brushed hairline is reserved for exactly one seam on the page — the Stats
 * band — and a metallic edge used twice stops reading as the boundary of
 * something machined and starts reading as a divider style.
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
          stopping at the container gutter — an edge that stops short of the
          viewport reads as a rule under a heading, not as the boundary of a
          surface. Absolute rather than a border on the section itself, so it
          stays out of both the flex centring and the `min-h-svh` box. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 border-t border-border" />

      {/* ------------------------------------------------------------------ */}
      {/* Centred copy                                                        */}
      {/* ------------------------------------------------------------------ */}
      {/* The bottom pad is the device's visible slice, reserved. Below `md` the
          phone is a normal flow row, so it only needs `SECTION_Y`'s ordinary
          bottom air — which was missing entirely, leaving the feature line
          sitting on the section's bottom edge on every phone. */}
      <Container className="pb-16 pt-28 sm:pb-20 sm:pt-32 md:pb-[25rem]">
        {/* Wider than the copy needs on purpose: the headline and body carry
            their own measure caps, and the flowed feature line wants the extra
            width so it settles on two lines instead of three. */}
        <div className="mx-auto max-w-[56rem] text-center">
          <Reveal variant="scale">
            {/* `.display` sets the face, the 400 weight and the tracking — size
                carries the emphasis, so there is no `font-medium` here and no
                hand-tuned `tracking-*` fighting the utility.
                The 12em cap is art direction: it holds the line just short of
                fitting, so `text-wrap: balance` (also from `.display`) resolves
                the heading to two even lines broken at the comma on every
                desktop width, instead of flipping between one and two. */}
            <h2 /* `standard`, not a display step. This is a punctuation band between two
                media sections — at 64px it outranked Products and Pricing, which are
                sections a visitor actually arrives for. */
            className="display mx-auto max-w-[14em] text-[clamp(2.125rem,3.9vw,3.25rem)] leading-[1.1] text-fg">
              {appCopy.heading}
            </h2>

            {/* The deck step — 17px in a 30em measure, matching `SectionShell`
                and `MediaSection` exactly.

                This section writes its own copy block rather than passing `body`
                to `MediaSection`, so it never picked up the deck step when the
                page was unified on one: it sat at `text-base`, the same 16px as
                every paragraph on the page, and so read as the section's first
                sentence rather than as its standfirst. `mt-5`, not `mt-6`, for
                the same reason — the gap under a heading is part of the step. */}
            <p className="mx-auto mt-5 max-w-[30em] text-[1.0625rem] leading-[1.6] text-fg-muted lg:mt-6">
              {appCopy.body}
            </p>
          </Reveal>

          {/* Features survive as one quiet flowed line. As bordered chips they
              read as four more cards on a page that already has enough. */}
          <Reveal variant="scale" delay={60}>
            {/* Inline `li`s, not flex items: this has to wrap as one run of
                prose. As a flex row the separator is its own box, so a label
                that wraps internally leaves its `·` stranded on the line above.
                The separator is glued to the label it follows with a
                non-breaking space, so a line can only ever break *after* it. */}
            <ul className="mx-auto mt-8 max-w-[54rem] text-sm leading-relaxed text-fg-muted">
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
          <Reveal variant="scale" delay={120}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          <Reveal variant="scale" delay={180}>
            {/* One hairline and a radius, nothing else. No speaker pill, no home
                indicator, no accent glow, and deliberately not `.card`: a lit
                top edge and a cast shadow would make the device read as another
                panel lying on the plate, when the point is that it is standing
                *in* it and being cut by the section's bottom edge. The edge is
                `chrome`, not `border`, because that is the token's job — a
                machined lip on a metal plate — and the body goes to `bg` so the
                phone reads darker than the surface it stands on, the way a real
                object would.

                The alpha is 26%, up from 20%. `chrome` dropped from #C8CCD4 to
                #A9AEB8, losing 30% of its relative luminance, and because the
                border composites over this element's own `bg-bg` fill, that loss
                lands on the hairline directly: at 20% the edge resolved to
                #262729 and separated from the plate around it by 1.27:1, against
                1.37:1 before the token moved. On a 1px line at near-black that
                is the difference between an edge and a suggestion. 26% takes it
                to #303134 and 1.46:1 — slightly clearer than the old bezel, not
                merely level with it — and 26% is not a fresh number: it is the
                one alpha index.css already commits to for a visible chrome edge,
                on `.card-lift:hover`. Reusing it keeps every machined edge on
                the page mixed at one strength.

                The radius is now `--radius-card`, the page's only card radius,
                rather than the hand-picked 2.25rem it carried before. A device
                bezel is a physical edge like every other on the page and has no
                claim to a radius of its own. */}
            {/*
              Plate A7, rendered by `tools/plates`. It replaces two things at
              once: the `APP SCREEN PLACEHOLDER` box — which shipped the words
              "the real UI is composited in later" to every visitor — and the
              CSS bezel that used to frame it.

              The bezel goes because the render already has one. A 1px
              `border-chrome/26` is a drawn approximation of a machined lip; the
              plate carries the real thing — a fillet where the front face turns
              into the side wall, catching one specular hairline down the left
              edge under the same 5600K key every other plate is lit by. Keeping
              both would put a drawn edge around a photographed one, which reads
              as a phone inside a phone. The old comment argued for "one hairline
              and a radius, nothing else"; this is that argument satisfied in the
              render rather than in the stylesheet.

              **The screen is empty, and that is the requirement, not a
              shortfall.** motion-brief §7 rule 5 forbids fabricated interfaces
              and art-direction.md §3 is explicit: ship a screenshot of the real
              product, or ship the dark screen. This is the dark screen — flush
              glass taking a diagonal grade and nothing else. No chart forms, no
              rows, no glyphs, no invented figures.

              `aspect-[9/19]` is unchanged from the placeholder it replaces, so
              the reserved box is identical and nothing shifts on decode (CLS).
            */}
            {/*
              The mask is structural, not a flourish. Every plate is graded to
              bottom out on `#050505` — the page ink — so that its frame edge
              dissolves into the page instead of sitting on it. That is exactly
              right on the eight sections that sit on ink, and wrong here: this
              is the one band on the page built from `surface` under
              `.surface-chrome`, several levels *lighter* than ink, so the
              plate's own ground reads as a darker rectangle laid on the metal
              and the asset's bounding box becomes visible on three sides.

              Feathering the plate into its surroundings is the fix that keeps
              the grade correct for every other section. The radial is centred
              above the middle because the device is top-anchored and its lower
              half is already cut by the section's bottom edge — there is
              nothing to blend down there.
            */}
            {/* Inline rather than an arbitrary utility: Tailwind's arbitrary-value
                parser does not emit this one reliably (the gradient carries both
                a hex and percentages), and a mask that silently fails to compile
                looks exactly like a mask that is too weak — which cost a round of
                debugging here. */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-[55%] -top-[10%] bottom-0"
                style={{ backgroundImage: POOL }}
              />
              <picture
                className="relative block"
                style={{
                  maskImage: MASK,
                  WebkitMaskImage: MASK,
                }}
              >
                <source media="(min-width: 1280px)" srcSet={deviceImage.wide} />
                <source media="(max-width: 425px)" srcSet={deviceImage.mobile} />
                <source media="(max-width: 768px)" srcSet={deviceImage.tablet} />
                <img
                  src={deviceImage.desktop}
                  alt="The ThinqProfit app on a phone, screen dark"
                  className="block aspect-[9/19] w-full object-cover object-top"
                />
              </picture>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
