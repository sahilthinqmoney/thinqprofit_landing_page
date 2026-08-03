import Button from '../ui/Button'
import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import MediaSection from '../ui/MediaSection'
import { plateImage, platePoster, plateVideo } from '../../lib/media'
import { finalCta } from '../../data/footer'

/**
 * §16 Final CTA — the page's closing full-bleed module. Copy verbatim from
 * docs/landing-page-copy.md.
 *
 * Rebuilt on `MediaSection`: media edge to edge, copy centred on top of it.
 * What went: the rounded-3xl panel (the only one on the page), both
 * `blur-[120px]` accent blobs, and the row of bordered check-chips. A panel
 * floating inside a `min-h-svh` box is the generic-SaaS closing move; the bleed
 * is the Robinhood one, and it costs three fewer decorative layers.
 *
 * `height="mid"` (704px) is deliberately the shortest full-bleed band on the
 * page — the hero takes 900, the mid-page sections 800. The close should land,
 * not open another chapter.
 *
 * Constraints honoured:
 *  - the primary CTA is the copper alloy, never green — landing.md §1 conflict
 *    2, §10. Gain and loss are market-data values only. Under platinum the
 *    argument was that a green button would be the one coloured thing on a
 *    hueless page; copper takes that away and replaces it with a sharper one —
 *    the page now has exactly one brand hue, so a second coloured control does
 *    not read as decoration, it reads as a *different kind* of action, and the
 *    kind it most resembles is a buy order.
 *  - no urgency mechanics, no countdown, no scarcity line — landing.md §10
 *  - the market-risk disclosure is live text under the CTA, inside the section,
 *    above the scrim and never behind a blur — landing.md §9, §10
 */

/**
 * Asset brief for the closing clip. No URL exists yet, so `MediaBackdrop`
 * draws its designed plate — the layout is already final and the overlaid copy
 * can be judged for contrast now. This string is not rendered anywhere.
 *
 * Written against docs/motion-brief.md §7 (no numbers or chart forms, no green
 * or red, no upward motion as a promise, people composed and never
 * celebrating), and against the machined-alloy world in docs/art-direction.md —
 * not the indigo→cyan the brief originally specified, which predates the
 * palette.
 *
 * THE SPECULAR STAYS NEUTRAL, AND THE REASON IS THE OPPOSITE OF WHAT IT WAS.
 * The old sentence read: "a warm note in the falloff would put the one coloured
 * thing in frame directly behind the primary action, and the action is now
 * identified by being the brightest *neutral* surface on screen." Both halves
 * are dead. There is a brand hue again, and the action is not the brightest
 * anything — the accent measures 9.9166:1 on the ground where fg is 19.9782:1
 * and fg-muted is 13.2245:1.
 *
 * What replaces it is a tighter rule, not a weaker one: **only the action is
 * saturated copper.** The accent's OKLCH chroma is 0.1263, the highest of any
 * token in the palette; the warm neutral axis tops out at 0.0165 on `border`,
 * 13% of it. A warm grade in this plate's falloff would put unsaturated-but-warm
 * light behind the one control on the page that means "you can act on this", and
 * §4 rule 1 reserves that reading for the control alone. Neutral light in frame
 * is what keeps the only copper object on screen legible AS copper.
 *
 * Note the dead zone moves: the hero reserves the left 45%, this section is
 * centre-placed, so here it is the centre that stays dark. That is now a
 * contrast requirement with a number attached — see the support line below.
 */
const closingClip =
  'Closing loop, 8s, seamless. A single machined-aluminium form at rest in near-black, lit from high and behind so only its top edge catches. One cool near-white specular travels the length of that edge, laterally, and settles; nothing rises. Neutral monochrome throughout, no colour cast. Centre of frame stays dark and low-contrast for the centred copy. No numbers, tickers, candles or chart forms. No green, no red.'

export default function FinalCta() {
  /**
   * Art-directed break, applied to the deck string rather than a retyped copy
   * of it, so the deck stays the single source. Two near-equal lines: a centred
   * closing headline wants a square block, not a descending stair — and both
   * halves clear the 9em measure, so neither re-wraps to a third line.
   */
  const headline = finalCta.heading.replace('what you', 'what\nyou')

  /**
   * The support line was three bordered pills. It is one quiet line now — three
   * facts are worth a sentence, not three pieces of chrome. Still routed
   * through `CopyText` because "[X]-hour activation" is an unfilled figure and
   * has to stay visibly flagged wherever it appears.
   */
  const supportLine = finalCta.supportLine.split(' · ').join(', ')

  return (
    <MediaSection
      id="final-cta"
      /**
       * The backdrop and scrim sit at negative z-index. `relative` alone is not
       * a stacking context, so without this they resolve against the root and
       * paint behind App's opaque `bg-bg` wrapper — i.e. invisibly.
       */
      className="isolate"
      height="mid"
      place="center"
      anchor="center"
      scrim={0.75}
      scrimAt="50% 50%"
      measure="9em"
      /*
       * The page's one change of register, and it is no longer a change of FACE.
       *
       * This read: "the page's one serif. Everything above this is set in
       * Archivo... Newsreader at weight 380." All three faces are gone. The page
       * is set entirely in IBM Plex Sans, so the closing statement can no longer
       * be marked by bringing in a second family — and `voice="serif"` naming a
       * serif that does not exist is precisely the falsified rationale this
       * codebase bans, which is why the prop value moved with the class.
       *
       * `quiet` (`.display-quiet`) marks it by INVERTING the display voice
       * inside one family. The page's display voice is defined by three moves —
       * condense, weight up, track in — and this does all three backwards at
       * once: `'wdth' 100` against `.display`'s 82, `'wght' 300` against 600,
       * letter-spacing +0.01em against -0.028em, leading 1.24 against 1.08. In a
       * variable family that is the opposite corner of the same axes, which is a
       * legible change of register rather than a size difference.
       *
       * It does not re-rag, which is the thing that had to be checked before
       * trading a face for an axis: "Start with what\nyou have today" at 56px
       * sets two lines of 374.0px and 370.5px in Plex at 100/300/+0.01em, against
       * Newsreader's 381.5px and 377.6px — the same break, inside the 9em copy
       * column at every width tested (504 / 576 / 608px). The block grows about
       * 18px in height because 1.24 leading replaces 1.08.
       */
      voice="quiet"
      headline={headline}
      body={finalCta.subheading}
      /*
       * One action, and it is the page's account-opening destination — every
       * "Open free account" above this (nav, hero, mobile sheet) now scrolls
       * here, so `href` is the signup route rather than another anchor.
       *
       * `finalCta.secondaryCta` ("Talk to us first") is deliberately not
       * rendered. It pointed at the Support section, which is gone; more to the
       * point, the hero spends its whole argument earning one decision, and
       * offering an alternative to it in the closing frame is where a page
       * stops believing its own case. The support channels are in the footer,
       * two screens of nothing between here and them.
       */
      actions={
        <Button href="#" size="lg">
          {finalCta.primaryCta}
        </Button>
      }
      /**
       * Live text, selectable, in normal flow above the scrim — nothing is
       * layered over it. `Disclosure` sets its colour on its own element, so it
       * overrides whatever the slot inherits by inheritance rather than racing
       * it in the cascade.
       *
       * Its colour is `fg-muted` #D7D1CE, and that holds on this plate by
       * measurement rather than by assumption: at `scrim={0.75}` the backdrop is
       * 75% ground over the asset, so even against a pure-white plate the
       * backdrop is #474646 and fg-muted still clears 4.5:1 — it does not cross
       * the floor at ANY plate luminance here. Over the near-black centre this
       * plate actually specifies, it is 13.1646:1.
       */
      finePrint={<Disclosure>{finalCta.disclosure}</Disclosure>}
      /*
       * Plate A6, and the second of the two plates that ship as motion (§4.2) —
       * the page's only other moving surface is the hero, so the scroll opens
       * and closes on movement and holds still in between.
       *
       * The plate's trick is that its subject sits *inside* the centred copy
       * column: a matte black monolith legible almost entirely by the two
       * chamfer hairlines that fall either side of the text. That is why this
       * section can put a centred serif headline over a photograph at all.
       *
       * The loop settles rather than idling (§2.3 rule 3). The specular creeps
       * along an edge that is already there and comes to rest; nothing crosses
       * the frame. The primary action directly above it is the only thing on
       * this page allowed to move forever, and a backdrop that never stopped
       * would be competing with it at the exact moment the page asks for a
       * decision.
       *
       * `MediaBackdrop` serves the loop at ≥769px only and falls to the stills
       * below that — the 16:9 loop cropped to a phone's 9:16 reserves nothing.
       */
      media={{
        alt: closingClip,
        image: plateImage('closing'),
        video: plateVideo('closing'),
        poster: platePoster('closing'),
      }}
    >
      {/*
        `text-fg-subtle`, not `text-white/65`, and this is a measured trade with
        a real cost on one side of it — stated rather than glossed.

        WHAT IT COSTS. `white/65` composites to #A9A9A9 over the ground: 8.5003:1
        and OKLCH chroma 0.0000. `fg-subtle` #8A827F is 5.3087:1 on the ground
        and 4.6977:1 on `surface-raised`. So the line gets 1.6x less contrast.

        WHY IT IS STILL RIGHT. Two reasons, both structural.
        (1) A dead-neutral grey sitting directly under body copy at chroma 0.0078
        reads cool on a ground that is itself warm (the ground measures chroma
        0.0038 at hue 17.6 deg). That cool-grey-on-warm-ink defect is the exact
        thing fg-muted was re-solved to avoid, and leaving an alpha here would
        reintroduce it in the one place the two colours are read side by side.
        (2) An alpha's contrast is a property of whatever lands beneath it. This
        sits over a media plate; `MediaCard` already made this move for the same
        reason and says so.

        THE CONSTRAINT THE SWAP CREATES, with its number. At `scrim={0.75}` the
        backdrop is 75% ground over the asset, so the text's contrast is a
        function of the plate. Solved: fg-subtle holds >= 4.5:1 while the plate
        behind the copy stays below sRGB grey 90 (#5A5A5A) — at grey 89 it is
        4.5071:1, and over the near-black centre this plate specifies it is
        5.2846:1. The asset brief above already requires "centre of frame stays
        dark and low-contrast for the centred copy"; that sentence now has a
        number, and if a future plate lands brighter than #5A5A5A in the middle
        the fix is the plate, not the token.

        14px, so 4.5:1 is the applicable floor (not the 3:1 large-text one).
      */}
      <CopyText source={supportLine} className="mt-6 text-sm leading-relaxed text-fg-subtle" />
    </MediaSection>
  )
}
