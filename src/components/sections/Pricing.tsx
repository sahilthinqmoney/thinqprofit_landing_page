import { ArrowUpRight } from 'lucide-react'

import Button from '../ui/Button'
import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import Reveal from '../ui/Reveal'
import SectionShell from '../ui/SectionShell'

import {
  accountChargeColumns,
  accountCharges,
  accountChargesHeading,
  brokerage,
  brokerageColumns,
  finePrint,
  plans,
  plansHeading,
  pricingHeading,
  pricingSubheading,
  statutoryLine,
} from '../../data/pricing'

interface PricingProps {
  /** Anchor target. Matches the nav's Pricing link. */
  id?: string
}

/**
 * §7 Pricing.
 *
 * A broker's rate card is a *document*, so this section is set like one rather
 * than assembled out of panels. Nothing here is a bordered box except the single
 * recommended tier — the structure is carried by rules, measure and type size,
 * which is what a well-set price list has always used.
 *
 * Three decisions worth keeping:
 *
 *  1. **No metallic edge here.** `.rule-chrome` is spent exactly once on the
 *     whole page, at the Stats seam. Both tables in this section open on the
 *     same plain `border` hairline, every rule below them is `border-soft`, and
 *     the amounts sit on one right-hand optical axis so the eye can run the
 *     column. Structure comes from rules, measure and type size — nothing here
 *     is a bordered box except the single recommended tier.
 *
 *  2. **No three-tower plan grid.** Three equal cards is the most generic
 *     pricing layout in existence, and it can only express a recommendation by
 *     making one card taller. Instead the recommended tier is set large and
 *     left-aligned in the section's one elevated panel, and the other two run
 *     underneath it as compact ledger rows — the same treatment Products gives
 *     its quiet half. Emphasis comes from scale and elevation, not from a badge:
 *     there is deliberately no "Most popular" label, because a popularity claim
 *     is a statistic and §13 only allows numbers we can substantiate.
 *
 *  3. **Placeholders stay flagged.** Every `[BRACKETED]` value in
 *     src/data/pricing.ts is a compliance placeholder awaiting sign-off, so all
 *     of them — rates, charges, plan prices, the GTT allowance — render through
 *     `CopyText` and keep their warning-coloured, dotted-underlined treatment.
 *     The statutory pass-through line is never collapsed and never sits behind
 *     a blur.
 *
 * Width is not this file's business: `SectionShell` owns the one content rail
 * the whole page shares, so the rate card's left edge lines up with the heading
 * above it and with every other section by construction.
 */

/**
 * Table column headers. Tracked micro-caps live here and nowhere else on the
 * section — at 11px they only read as a label when they are labelling a column.
 * `fg-muted` (8.07:1), never `fg-subtle`, which is reserved for legal meta.
 */
const COL_HEAD = 'pb-3 pt-5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-fg-muted'

/** Data cell. Generous height is the point: a rate card should not feel dense. */
const CELL = 'py-5 align-baseline text-base lg:py-6'

/** Serif sub-head. One step under the section H2 so it reads as a chapter, not a peer. */
const SUB_HEAD = 'display text-2xl leading-tight text-fg sm:text-[1.75rem]'

export default function Pricing({ id = 'pricing' }: PricingProps) {
  // `highlighted` is the deck's own recommendation flag. Falling back to the
  // first tier means a data edit that clears every flag degrades to "the
  // cheapest tier is the featured one" rather than to an empty panel.
  const primary = plans.find((plan) => plan.highlighted) ?? plans[0]
  const secondary = plans.filter((plan) => plan !== primary)

  return (
    <SectionShell
      id={id}
      heading={pricingHeading}
      subheading={pricingSubheading}
      tone="raised"
      scale="lead"
    >
      <>
        {/* ---------------------------------------------------------------- */}
        {/* The rate card                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid gap-y-16 lg:grid-cols-12 lg:gap-x-16">
          {/* -------- Brokerage — the primary document -------- */}
          <Reveal className="min-w-0 lg:col-span-7">
            <h3 className={SUB_HEAD}>{brokerageColumns.rate}</h3>

            {/* Plain hairline — the chrome rule belongs to the Stats seam and
                to nothing else on the page. See note 1 above. */}
            <div aria-hidden="true" className="mt-5 h-px w-full bg-border" />

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
                      <th
                        scope="row"
                        className={`pr-8 font-normal text-fg sm:whitespace-nowrap ${CELL}`}
                      >
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
          </Reveal>

          {/* -------- Account charges — the same setting, one step quieter -------- */}
          <Reveal delay={80} className="min-w-0 lg:col-span-5">
            <h3 className={SUB_HEAD}>{accountChargesHeading}</h3>

            {/* Same rule as the brokerage table above — the appendix differs by
                position and column count, not by decoration. */}
            <div aria-hidden="true" className="mt-5 h-px w-full bg-border" />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[18rem] border-collapse text-left">
                <caption className="sr-only">
                  Account charges. All amounts are unverified placeholders.
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className={COL_HEAD}>
                      {accountChargeColumns.item}
                    </th>
                    <th scope="col" className={`text-right ${COL_HEAD}`}>
                      {accountChargeColumns.amount}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accountCharges.map((charge) => (
                    // `border-border-soft` colours every edge, so the closing
                    // rule under the last row only needs its width set. The
                    // brokerage table gets its closing rule from the statutory
                    // footnote instead, so both tables end on a hairline.
                    <tr key={charge.item} className="border-t border-border-soft last:border-b">
                      <th scope="row" className={`pr-8 font-normal text-fg ${CELL}`}>
                        {charge.item}
                      </th>
                      <td className={`tabular whitespace-nowrap text-right text-fg ${CELL}`}>
                        <CopyText source={charge.amount} as="span" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Plan tiers — one recommended tier, two ledger rows                 */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-20 sm:mt-24">
          <Reveal>
            {/* Chapter break: serif label with the rule running off it to the
                measure's right edge. Cheaper than a panel and it actually
                divides something. */}
            <div className="flex items-center gap-6">
              <h3 className={`shrink-0 ${SUB_HEAD}`}>{plansHeading}</h3>
              <span aria-hidden="true" className="h-px flex-1 bg-border-soft" />
            </div>
          </Reveal>

          <Reveal delay={60}>
            {/* The section's single elevated element — `.card`, so it carries
                the page's one radius, the inset top highlight that puts a light
                source above it, and the tinted shadow that gives it somewhere to
                sit. `.surface-chrome` washes the plate on top of that; a
                brushed panel with no lit edge is still a filled rectangle.
                Elevation is the whole recommendation mechanism here, so it is
                spent once and nowhere else — the tables and the ledger rows
                below sit flat on the section.

                No `.card-lift`: this panel is not one target, it *contains* the
                target. The lift belongs to a card you can click, not to a
                container holding a button.

                The edge used to be `border-accent/30`. Gold marks actions, and
                a panel edge is not an action — the accent now appears in this
                block only on the CTA, which is the one thing here you can do. */}
            <div className="card surface-chrome mt-10">
              <div className="grid gap-y-10 p-8 sm:p-10 lg:grid-cols-12 lg:gap-x-14 lg:p-14">
                <div className="min-w-0 lg:col-span-5">
                  {/* Set two full steps above the tiers below it. No badge — the
                      size and the panel are the claim, and they are a design
                      claim rather than a statistical one. */}
                  <h4 className="display text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.06] text-fg">
                    {primary.name}
                  </h4>

                  <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                    <CopyText
                      source={primary.price}
                      as="span"
                      className="tabular text-2xl leading-none text-fg"
                    />
                    {primary.cadence && (
                      <span className="text-sm text-fg-muted">{primary.cadence}</span>
                    )}
                  </p>

                  <p className="mt-5 max-w-[32ch] text-base leading-relaxed text-fg-muted">
                    {primary.blurb}
                  </p>

                  {/* The one trailing-well button in the section: this is the
                      single primary action, and an arrow on all three would
                      stop it meaning "this is the one". */}
                  <Button
                    href="#onboarding"
                    className="mt-8"
                    trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />}
                    aria-label={`${primary.cta} — ${primary.name} plan`}
                  >
                    {primary.cta}
                  </Button>
                </div>

                {/* Features as hairline-separated rows, not a checklist. A tick
                    glyph on every line is four icons saying the same word. */}
                <ul className="min-w-0 border-t border-border-soft pt-2 lg:col-span-7 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
                  {primary.features.map((feature, index) => (
                    <li
                      key={feature}
                      className={`py-4 text-base leading-relaxed text-fg-muted ${
                        index > 0 ? 'border-t border-border-soft' : ''
                      }`}
                    >
                      <CopyText source={feature} as="span" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* The other tiers. One reveal for the whole ledger rather than a
              staggered cascade — a row that performs is competing with the
              tier above it, and the point of these two is that they don't. */}
          <Reveal delay={120}>
            <ul className="mt-8 divide-y divide-border-soft border-y border-border-soft">
              {secondary.map((plan) => (
                <li key={plan.name}>
                  {/* Baseline alignment across the strip: the tier name, the
                      figure and the first line of the feature run all sit on
                      one line, which is what makes four unequal columns read
                      as a row rather than as four stacked things. */}
                  <div className="grid items-baseline gap-x-10 gap-y-4 py-7 sm:py-8 md:grid-cols-[minmax(0,13rem)_minmax(0,8rem)_minmax(0,1fr)_auto]">
                    <div className="min-w-0">
                      <h4 className="display text-xl leading-tight text-fg sm:text-2xl">
                        {plan.name}
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{plan.blurb}</p>
                    </div>

                    <CopyText source={plan.price} as="p" className="tabular text-base text-fg" />

                    {/* Features flow as one line of prose here. As a bulleted
                        column they would rebuild the tower this layout exists
                        to avoid. Inline `li`s, with the separator glued to the
                        label it follows by a non-breaking space so a line can
                        only ever break *after* it. */}
                    <ul className="min-w-0 text-sm leading-relaxed text-fg-muted">
                      {plan.features.map((feature, index) => (
                        <li key={feature} className="inline">
                          <CopyText source={feature} as="span" />
                          {index < plan.features.length - 1 && (
                            <span aria-hidden="true" className="text-fg-subtle">
                              {'\u00A0\u00B7 '}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#onboarding"
                      className="group inline-flex min-h-11 items-center gap-1.5 self-center text-sm font-medium text-accent-soft transition-colors duration-200 hover:text-fg md:justify-self-end"
                      aria-label={`${plan.cta} — ${plan.name} plan`}
                    >
                      {plan.cta}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5"
                      >
                        &rarr;
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Fine print                                                        */}
        {/* ---------------------------------------------------------------- */}
        {/* Left-flush with everything above it, on the section's plain surface.
            Live text, selectable, 8.07:1 — never a glass plate. */}
        <Disclosure tone="note" className="mt-10 max-w-[68ch] sm:mt-12">
          {finePrint}
        </Disclosure>
      </>
    </SectionShell>
  )
}
