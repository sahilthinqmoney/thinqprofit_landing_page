import { ArrowRight } from 'lucide-react'

import Button from '../ui/Button'
import MediaSection from '../ui/MediaSection'
import Reveal from '../ui/Reveal'

import {
  platformCta,
  platformEyebrow,
  platformHeading,
  platformMediaAlt,
  platformSubheading,
  tools,
} from '../../data/platform'

/**
 * Art-directed rag. MediaSection honours `\n` at ≥768px only, so this is a
 * desktop-only instruction — below that the headline re-rags to the viewport.
 *
 * The break isolates "ten seconds" on its own line, because that phrase is the
 * entire claim. Derived from the copy string rather than retyped, so a deck edit
 * can never leave a stale headline on the page: if the phrase moves, `replace`
 * no-ops and the raw string renders unbroken.
 *
 * The longest resulting line, "ten seconds", sets ~5.2em in Inter Medium at the
 * display tracking — comfortably inside the 9em measure, so none of the three
 * lines can re-rag by accident as the clamp resizes the type.
 */
const headline = platformHeading.replace(' ten seconds ', '\nten seconds\n')

interface PlatformProps {
  /** Anchor target. Matches the nav's Platform link. */
  id?: string
}

/**
 * §6 Platform & tools — full-bleed, copy overlaid on the media.
 *
 * Replaces the boxed layout this section used to run: a sticky faux-macOS
 * terminal panel beside a numbered spec list. The window chrome, the 01–10
 * ordinals and the per-row icon tiles are all gone. Three separate decorations
 * competing over a ten-item list is what made the section read as a template,
 * and none of them survive being set on top of a moving plate. What is left is
 * the thing that does: bare text on hairlines.
 *
 * The ten `tool.body` descriptions do not come along. At `height="tall"` with
 * copy in the right 46%, the headline/body/CTA stack already spends ~400px of
 * the 800px frame; ten two-to-four-line descriptions need ~500px more and would
 * be clipped by the section's `overflow-hidden`. The capability names carry the
 * breadth claim on their own — the descriptions belong on the tour page the CTA
 * points at, not compressed to four-line slivers here.
 *
 * Media is briefed but unshot, so MediaBackdrop renders its pending field. That
 * is intentional: it carries the same darkness as the eventual clip
 * (motion-brief §5.2 — a macro rack-focus across dark glass, no rendered UI),
 * so contrast can be judged now rather than after the asset lands
 * (motion-brief §7 rule 7).
 *
 * Constraints honoured:
 *  - no green or red anywhere; the palette here is white on ink (landing.md §10)
 *  - indigo `accent` is the only CTA colour. The tour button goes solid rather
 *    than keeping its old `secondary` outline — `border-border` (#334155) is
 *    invisible against the plate, so an outline button would read as bare text.
 *  - nothing sits behind blur or glass. The scrim is a flat radial pinned at
 *    z-index -1 behind live text; row copy at `text-white/80` clears ~9:1.
 */
export default function Platform({ id = 'platform' }: PlatformProps) {
  return (
    <MediaSection
      id={id}
      height="tall"
      place="right"
      anchor="center"
      scrim={0.86}
      scrimAt="68% 50%"
      label={platformEyebrow}
      headline={headline}
      measure="9em"
      body={platformSubheading}
      actions={
        <Button href="#" aria-label={platformCta}>
          {platformCta}
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      }
      media={{ alt: platformMediaAlt }}
    >
      {/* One reveal for the whole block, not ten staggered rows. A per-item
          stagger across a ten-item list reads as an entrance animation playing
          at the reader; the list should simply arrive with the copy it belongs
          to, one beat behind it. */}
      <Reveal delay={120} className="mt-10 w-full">
        {/* Row-major fill, so the visual order matches the DOM order a screen
            reader announces. Capped at the same 34em as the body copy above it
            so the two blocks share a right edge instead of the list sprawling
            to the full 46% column on a wide display.

            `text-base`, not a 15px step: `em` resolves against each element's
            own font size, so 34em on a 15px list is 510px against the body's
            544px — the shared right edge this cap exists for only lines up if
            both blocks are set at 16px. It is also the page's body-copy floor.
            At 16px the longest name ("Baskets & multi-leg") still clears the
            157px column the 46% rail leaves at 768px, so nothing wraps and the
            block stays well inside the section's fixed height. */}
        <ul
          aria-label="Platform capabilities"
          className="grid max-w-[34em] grid-cols-1 gap-x-8 sm:grid-cols-2 sm:gap-x-10"
        >
          {tools.map((tool) => (
            <li
              key={tool.title}
              className="border-t border-white/15 py-3 text-base leading-snug text-white/80"
            >
              {tool.title}
            </li>
          ))}
        </ul>
      </Reveal>
    </MediaSection>
  )
}
