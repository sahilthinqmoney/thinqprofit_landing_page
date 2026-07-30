import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'

import {
  brokerage,
  brokerageColumns,
  finePrint,
  pricingHeading,
  pricingSubheading,
  statutoryLine,
} from '../../data/pricing'

interface PricingProps {
  /** Anchor target. Matches the nav's Pricing link. */
  id?: string
}

/**
 * §7 Pricing — one table.
 *
 * A broker's rate card is a *document*, so this section is set like one rather
 * than assembled out of panels. Nothing here is a bordered box at all: the
 * structure is carried by rules, measure and type size, which is what a
 * well-set price list has always used.
 *
 * Three decisions worth keeping:
 *
 *  1. **One table, not three.** The section said "one rate card" above an
 *     account-charges appendix and a three-tier plan ladder — two more tables
 *     for a reader who came to find out what a trade costs. Both are still in
 *     src/data/pricing.ts, unrendered, for the full pricing page the statutory
 *     line already links to. What is left is the brokerage card, set alone in
 *     the middle of the rail at the measure a rate card wants, which is the
 *     first time this section has been able to be read at a glance.
 *
 *  2. **No metallic edge here.** `.rule-chrome` is not spent in this section.
 *     The table opens on a plain `border` hairline, every rule below it is
 *     `border-soft`, and the amounts sit on one right-hand optical axis so the
 *     eye can run the column.
 *
 *  3. **Placeholders stay flagged.** Every `[BRACKETED]` rate is a compliance
 *     placeholder awaiting sign-off, so all of them render through `CopyText`
 *     and keep their warning-coloured, dotted-underlined treatment. The
 *     statutory pass-through line is never collapsed and never sits behind a
 *     blur.
 *
 * Width is not this file's business: `SectionShell` owns the one content rail
 * the whole page shares, so the rate card's left edge lines up with the heading
 * above it and with every other section by construction.
 */

/**
 * Table column headers. Tracked micro-caps live here and nowhere else on the
 * section — at 11px they only read as a label when they are labelling a column.
 * `fg-muted` (13.08:1), never `fg-subtle`, which is reserved for legal meta.
 */
const COL_HEAD = 'pb-3 pt-5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-fg-muted'

/** Data cell. Generous height is the point: a rate card should not feel dense. */
const CELL = 'py-5 align-baseline text-base lg:py-6'

export default function Pricing({ id = 'pricing' }: PricingProps) {
  return (
    <SectionShell
      id={id}
      heading={pricingHeading}
      subheading={pricingSubheading}
      tone="raised"
      scale="lead"
    >
      {/* The card holds a 64rem measure inside the section's 84rem rail. A
          two-column table stretched to the full rail sets the segment name and
          its rate a screen apart on a wide display, and the pair has to be
          readable as one line — that is the whole function of a rate card. The
          left edge is still the rail's left edge, so the page's one vertical
          axis survives. */}
      <Reveal variant="wipe" className="min-w-0 max-w-[64rem]">
        {/* Plain hairline — no metallic edge in this section. */}
        <div aria-hidden="true" className="h-px w-full bg-border" />

        {/* Scrolls inside itself on narrow screens — the page never does. */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[20rem] border-collapse text-left">
            <caption className="sr-only">
              Brokerage by market segment. All amounts are unverified placeholders.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={COL_HEAD}>
                  {brokerageColumns.segment}
                </th>
                <th scope="col" className={`text-right ${COL_HEAD}`}>
                  {brokerageColumns.rate}
                </th>
              </tr>
            </thead>
            <tbody>
              {brokerage.map((row) => (
                // Rules sit on the row, not on the cells, so they run the
                // full measure of the table and collapse into one hairline.
                <tr key={row.segment} className="border-t border-border-soft">
                  <th scope="row" className={`pr-8 font-normal text-fg sm:whitespace-nowrap ${CELL}`}>
                    {row.segment}
                  </th>
                  {/* Not nowrap: the longest placeholder rate is ~48
                      characters and forcing it onto one line drops the
                      table into its own scrollbar on a 1024 desktop. */}
                  <td className={`tabular text-right text-fg ${CELL}`}>
                    <CopyText source={row.rate} as="span" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Always-visible statutory pass-through line — do not collapse it.
            Set as a footnote hanging off the closing rule of the table it
            qualifies, with the rate-card link inline inside the sentence
            exactly as the deck writes it. Plain surface, no blur. */}
        <div className="border-t border-border pt-6">
          <CopyText
            source={statutoryLine}
            className="max-w-[72ch] text-xs leading-relaxed text-fg-muted"
          />
        </div>

        {/* Left-flush with the table above it, on the section's plain surface.
            Live text, selectable, 13.08:1 — never a glass plate. */}
        <Disclosure tone="note" className="mt-8 max-w-[68ch]">
          {finePrint}
        </Disclosure>
      </Reveal>
    </SectionShell>
  )
}
