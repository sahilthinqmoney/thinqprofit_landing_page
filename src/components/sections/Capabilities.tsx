import SectionShell from '../ui/SectionShell'
import { capabilities, capabilitiesIntro } from '../../data/capabilities'

/**
 * §4 — "What else is in it".
 *
 * ── A ledger, not a grid ──────────────────────────────────────────────────
 *
 * Six rows: title in a fixed left column, sentence in the remaining width, a
 * hairline between each. No cards, no borders around anything, no icons, no
 * hover states, no per-item links.
 *
 * The shape is the honesty. This section is a summary that supports §3, and a
 * 3×2 grid of bordered cards is the shape of a page's MAIN feature statement —
 * it would claim equal weight with the section above it, which spends a full
 * screen and a plate on one capability. A reader scanning the page should be
 * able to tell those two apart before reading a word of either, and the row
 * ledger is what does that.
 *
 * It is also the layout that survives the copy. Cards force every sentence to
 * the height of the longest one, so a six-word capability and a
 * twenty-eight-word one sit in identical boxes with the short one floating in
 * dead space. Rows are content-sized by definition.
 *
 * `Security` below uses the same `ROW` geometry for its own tiers, so the two
 * sections share one left edge for their titles and one for their bodies —
 * which is what makes them read as two parts of one document rather than as two
 * components that happened to land next to each other.
 *
 * ── Motion ────────────────────────────────────────────────────────────────
 *
 * None beyond `SectionShell`'s own heading focus-pull. A stagger down six rows
 * would make the page's quietest section perform, and the point of it is that it
 * doesn't — the same argument `Safety`'s tier 3 made and the reason it animated
 * as one block.
 */

/**
 * Shared with `Security`'s tiers. A fixed 24rem title column at md and up, so
 * six titles of very different lengths still start and end on one axis; below md
 * the row stacks and the title sits directly above its sentence.
 */
const ROW = 'grid gap-x-12 gap-y-1.5 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-x-20'

export default function Capabilities() {
  return (
    <SectionShell
      id="capabilities"
      /*
       * `standard`, not `lead`. The three `lead` slots on this page go to the
       * sections a reader arrives for or decides on — §3's argument, §5's
       * custody claim, §6's offer. A summary of everything else is a supporting
       * section and takes the step below, which is the whole reason the ladder
       * exists.
       */
      scale="standard"
      heading={capabilitiesIntro.heading}
      subheading={capabilitiesIntro.subheading}
    >
      {/*
        `<dl>`, not `<ul>`. Each row is a term and its description, which is
        exactly what a description list is for — and it means a screen reader
        announces "Position Compass" as the name of the sentence that follows
        rather than as the first two words of a list item.
      */}
      <dl>
        {capabilities.map((capability, index) => (
          <div
            key={capability.title}
            /*
             * A hairline above every row except the first. The section's heading
             * block already ends in a large gap, and a rule directly under it
             * would fence the heading off from the content it introduces.
             */
            className={`${ROW} py-6 sm:py-7 ${index === 0 ? '' : 'border-t border-border-soft'}`}
          >
            {/*
              18px at weight 500, matching `Safety`'s tier-3 rows exactly. At
              `text-base` a title set beside its own body copy is separated only
              by weight, which at 16px is not a rank — it is a bold word.
            */}
            <dt className="text-lg font-medium leading-snug text-fg">{capability.title}</dt>
            {/*
              `max-w-[50.6em]`, which is the em conversion of the 76ch measure
              this page's ledger rows already use — see the note in `Security`.
              It binds on the two longest sentences here and on nothing else.
            */}
            <dd className="max-w-[50.6em] text-base leading-relaxed text-fg-muted">
              {capability.body}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  )
}
