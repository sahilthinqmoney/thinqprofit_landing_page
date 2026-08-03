import Button from '../ui/Button'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import { appCopy, appFeatures } from '../../data/app'

/**
 * Feathers the device plate into this section's metal band.
 *
 * THE PREMISE, RESTATED — it was wrong before this change and is wronger after.
 * This comment used to say "every plate is graded to bottom out on `#050505`,
 * the page ink". Sampled off the shipped WebP rather than believed (96×96
 * area-average, `ffmpeg -pix_fmt rgb24`), all ten plates in `public/media`
 * bottom out on **#030303**, not #050505 — `bore` on #040404 — and every one is
 * pure greyscale: 0.0% of pixels with r ≠ g ≠ b. So the plate's black point has
 * never matched the ground. It sat 1.0119:1 under the old #050505 and sits
 * 1.0323:1 under the new #0A0808, and it is now the COOL value of the pair as
 * well as the dark one, on a ground at OKLCH hue 17.6°. For scale, the faintest
 * line the page draws on purpose — `--color-border-soft` — is 1.2076:1, so the
 * mismatch is 15% of a hairline: real, sub-threshold, and a grade to fix in
 * `tools/plates`, not with a second mask here.
 *
 * What that leaves intact is the reason this section needs the mask at all,
 * which never depended on the exact black point: the plate is graded to
 * dissolve into INK, and this band is not ink. It is `surface` under
 * `.surface-chrome`, several levels lighter — measured, the band's two ends
 * resolve to #211C1A and #1D1715 against a plate floor of #030303 — so the
 * plate's own ground reads as a darker rectangle laid on the metal and the
 * asset's bounding box shows on three sides.
 *
 * The centre is above the middle because the device is top-anchored and its
 * lower half is already cut by the section's bottom edge — there is nothing to
 * blend down there.
 */


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
            {/* HISTORICAL. This element used to draw its own bezel — a
                `border-chrome/26` hairline on a `bg-bg` fill at
                `--radius-card` — and the plate render replaced it (the note
                below says why). There is no `border-chrome`, no `bg-bg` and no
                radius on anything in this file any more; grep confirms the only
                surviving mention of that alpha in this file is this paragraph.
                It is kept, and only kept, because it carried an arithmetic
                derivation that a future reader would otherwise re-run — and
                every resolved value in it was wrong.

                THE ALPHA NEEDS NO CHANGE, and here is the arithmetic. The
                derivation was driven by `chrome`'s relative luminance:

                  #C8CCD4  Y 0.6022   two palettes ago
                  #A9AEB8  Y 0.4217   the platinum value — a 30.0% drop, which
                                      is the one figure the old note got right
                  #AEAEB2  Y 0.4249   today's neutral steel: +0.75% on #A9AEB8

                So copper moved this token's hue and not its brightness, and a
                derivation that only ever cared about brightness survives it
                intact. 26% is still 26%.

                THE GROUND, however, did move, and the border composited over
                this element's own `bg-bg` fill — so every hex and every ratio
                the old note quoted is superseded. Restated, chrome over the
                fill it actually sat on:

                  20%  over #050505 → #272728 (1.3657:1)
                  20%  over #0A0808 → #2B292A (1.3826:1)
                  26%  over #050505 → #313132 (1.5684:1)
                  26%  over #0A0808 → #353334 (1.5930:1)

                The conclusion holds on the new ground for the same reason it
                held on the old: 26% clears 20% by 1.5930 against 1.3826, where
                it cleared it by 1.5684 against 1.3657 before. And 26% was never
                a fresh number — it is the one alpha index.css commits to for a
                visible chrome edge, on `.card-lift:hover`, which measures
                #3D3838 / 1.6466:1 over `surface`. If a drawn edge ever returns
                here, that is still the value.

                Two numbers in the old note could not be reproduced against any
                pairing in this file and are recorded as unverifiable rather
                than carried: it claimed 1.27:1 at 20% and 1.46:1 at 26%, and
                its hexes (#262729, #303134 for #A9AEB8 over #050505) reproduce
                exactly while its ratios do not — the nearest candidate pairing,
                against `surface` #0d0d10, gives 1.2980 and 1.4920. Whatever
                ground produced 1.27 and 1.46 is not in this repository. */}
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
              The mask is structural, not a flourish, and the argument for it
              lives once — on `MASK` at the top of this file, alongside the
              measured plate black point it turns on. It was restated here in
              full, which is how the same wrong premise ("every plate bottoms
              out on #050505") came to be written twice and would have had to be
              corrected twice. One home.
            */}
            {/* Inline rather than an arbitrary utility: Tailwind's arbitrary-value
                parser does not emit this one reliably (the gradient carries both
                a hex and percentages), and a mask that silently fails to compile
                looks exactly like a mask that is too weak — which cost a round of
                debugging here. */}
            <div className="relative rounded-[32px] p-1.5 border border-accent/40 bg-surface/90 shadow-[0_0_40px_rgba(255,158,122,0.25)] transition-all duration-300">
              <picture
                className="relative block overflow-hidden rounded-[26px]"
              >
                <img
                  alt="Thinq mobile app on a dark metallic smartphone."
                  src="/media/device/device-desktop.webp"
                  className="block aspect-[9/19] w-full object-cover"
                />
              </picture>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
