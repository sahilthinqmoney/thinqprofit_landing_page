import Disclosure from '../ui/Disclosure'
import MediaSection from '../ui/MediaSection'
import WaitlistForm from '../ui/WaitlistForm'
import { finalCta } from '../../data/footer'

/**
 * §7 — the close. The page's second and last ask.
 *
 * ── It carries the form, not a button ────────────────────────────────────
 *
 * The previous build put a single `Open free account` button here, pointing at a
 * signup route. That was right when the ask was a multi-step onboarding journey
 * this page could only start. It is wrong now: the ask is a phone number, and a
 * button that scrolls a reader back to the hero's field — or worse, to a route
 * that does not exist — spends the one moment on the page where a reader has
 * finished the argument and is ready to act.
 *
 * So `WaitlistForm` mounts here too, in its `closing` variant. Same component,
 * same validation, same copy; centred rather than left-aligned, which is the
 * only difference and is a property of this section's composition rather than of
 * the form.
 *
 * ── `height="mid"` is deliberately the shortest full-bleed band ──────────
 *
 * The close should land, not open another chapter. It is the last section before
 * the footer's legal blocks, and a full-height closing frame with a form in the
 * middle of it puts the page's final action in the centre of a lot of nothing.
 *
 * ── Constraints honoured ─────────────────────────────────────────────────
 *
 *  - No countdown, no seat counter, no "only N places left". The urgency on
 *    this page is one sentence in the announcement bar and one in this headline,
 *    both of which state a fact about the mechanism: the list closes at launch.
 *    landing.md §10 rules out manufactured scarcity outright.
 *  - The primary action is the copper metal, never green. Gain and loss are
 *    market-data values only — a green submit button on a broker page reads as a
 *    buy order.
 *  - The market-risk disclosure is live text under the form, inside the section,
 *    above the scrim, never behind a blur.
 */

/**
 * Asset brief for the closing clip, written against docs/motion-brief.md §7 and
 * the machined-alloy world in docs/art-direction.md. Not rendered — it is the
 * spec the plate was made to, kept beside the section that uses it.
 *
 * Note where the dead zone sits: §3's plate reserves its right, §6's reserves
 * its left, and this one is centre-placed — so here it is the CENTRE that stays
 * dark. That is a contrast requirement with a number attached: at `scrim={0.75}`
 * the backdrop is 75% ground over the asset, so the copy's contrast is a
 * than that in the middle, the fix is the plate, not the token.
 */
export default function FinalCta() {
  return (
    <MediaSection
      id="final-cta"
      /**
       * The backdrop and scrim sit at negative z-index. `relative` alone is not a
       * stacking context, so without this they resolve against the root and paint
       * behind App's opaque `bg-bg` wrapper — i.e. invisibly.
       */
      className="isolate"
      height="mid"
      place="center"
      anchor="center"
      scrim={0.75}
      scrimAt="50% 50%"
      measure="9em"
      /*
       * The page's one change of register, and it is not a change of face — the
       * page is set entirely in IBM Plex Sans.
       *
       * `.display-quiet` marks this headline by INVERTING the display voice
       * inside one family: `'wdth' 100` against `.display`'s 82, `'wght' 300`
       * against 600, letter-spacing +0.01em against −0.028em, leading 1.24
       * against 1.08. In a variable family that is the opposite corner of the
       * same axes, which is a legible change of register rather than a size
       * difference.
       *
       * Spent exactly once. `Security`'s terminal statement was the other
       * candidate and deliberately stays in `.display` — used twice, the quiet
       * voice stops being a register and becomes a second display style.
       */
      voice="quiet"
      headline={finalCta.heading}
      body={finalCta.subheading}
      /**
       * Live text, selectable, in normal flow above the scrim — nothing is
       * layered over it. `Disclosure` sets its colour on its own element, so it
       * overrides whatever the slot inherits by inheritance rather than racing it
       * in the cascade.
       *
       * Its colour is `fg-muted`, and that holds on this plate by measurement
       * rather than by assumption: at `scrim={0.75}` the backdrop is 75% ground
       * over the asset, so even against a pure-white plate the backdrop is
       * #474646 and fg-muted still clears 4.5:1 — it does not cross the floor at
       * ANY plate luminance here.
       */
      finePrint={<Disclosure>{finalCta.disclosure}</Disclosure>}
      /*
       * Plate A6, and the second of the two plates that ship as motion (§4.2) —
       * the page's only other moving surface is the hero, so the scroll opens and
       * closes on movement and holds still in between.
       *
       * The plate's trick is that its subject sits INSIDE the centred copy
       * column: a matte black monolith legible almost entirely by the two chamfer
       * hairlines that fall either side of the text. That is why this section can
       * put centred copy over a photograph at all.
       *
       * The loop settles rather than idling (§2.3 rule 3). The specular creeps
       * along an edge that is already there and comes to rest; nothing crosses the
       * frame. `MediaBackdrop` serves the loop at ≥769px only and falls to the
       * stills below that — a 16:9 loop cropped to a phone's 9:16 reserves nothing.
       */
      media={{
        alt: 'Final CTA',
      }}
    >
      <WaitlistForm variant="closing" className="mt-10" />

      {/*
        The re-iteration and the count, on one line under the form.

        This is the second and last place the page states the offer, and it is
        stated with its qualifier attached — as it is in the announcement bar and
        in the hero. Three statements of the claim, three qualifiers. A page that
        repeats an offer and drops the limit on the third repetition has
        misrepresented it by attrition.

        `mx-auto` and `text-center` are declared here rather than inherited:
        `MediaSection`'s `place="center"` only centres from md up, and this line
        should be centred at every width because the form above it is.
      */}
      {/* The count is gone here too — see the note at its other call site in
          `Hero`. What this line exists for is the offer's third and final
          statement WITH its qualifier attached, and that is untouched: a page
          that repeats an offer and drops the limit on the last repetition has
          misrepresented it by attrition. */}
      <p className="mx-auto mt-8 text-center text-sm text-fg-muted">{finalCta.reiteration}</p>
    </MediaSection>
  )
}
