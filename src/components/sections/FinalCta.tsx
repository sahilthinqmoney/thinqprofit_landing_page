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
 *  - the primary CTA is the chromatic alloy, never green — landing.md §1
 *    conflict 2, §10. Green and red are market-data values only, and with no hue
 *    left anywhere in the brand a green button would now be the single most
 *    misreadable object on the page: the one coloured thing on a broker page
 *    that is not a number.
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
 * palette. The specular is neutral: a warm note in the falloff would put the one
 * coloured thing in frame directly behind the primary action, and the action is
 * now identified by being the brightest *neutral* surface on screen. Note the
 * dead zone moves: the hero reserves the left 45%, this section is centre-placed,
 * so here it is the centre that stays dark.
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
       * The page's one serif. Everything above this is set in Archivo; the
       * closing statement changes register, which is the only way a second face
       * earns its place. Newsreader at weight 380 — an old-style serif with
       * moderate contrast, deliberately not the Didone that made an earlier
       * pass read as a fashion masthead rather than a broker.
       */
      voice="serif"
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
       * overrides the slot's inherited white/55 by inheritance rather than
       * racing it in the cascade, and holds above 4.5:1 on the scrimmed plate.
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
      <CopyText source={supportLine} className="mt-6 text-sm leading-relaxed text-white/65" />
    </MediaSection>
  )
}
