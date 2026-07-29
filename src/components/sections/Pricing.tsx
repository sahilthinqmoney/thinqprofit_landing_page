import { Check, Receipt, Wallet } from 'lucide-react'

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
  pricingEyebrow,
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
 * A rate card should look like a rate card: real tables, tabular numerals, the
 * statutory pass-through line pinned under the brokerage figures where it can't
 * be missed. Every [placeholder] is left literal — see src/data/pricing.ts.
 *
 * Width behaviour — the page container now runs to 1664px, which is more than a
 * two-column rate card can spend. `RATE_CARD_MEASURE` (1344px, the exact content
 * width of a 1440 laptop) is the widest these blocks get: past that a Segment /
 * Brokerage row is mostly the gap between the two values, and a plan card is
 * mostly padding. The extra room goes into cell padding instead — px-5 → px-7
 * and taller rows — so the tables breathe rather than stretch. Every block on
 * the section shares the measure so their left and right edges line up.
 */
const RATE_CARD_MEASURE = 'mx-auto w-full max-w-[84rem]'

/** Row padding shared by both data tables so they read as one rate card. */
const CELL_X = 'px-5 sm:px-6 lg:px-7'

export default function Pricing({ id = 'pricing' }: PricingProps) {
  return (
    <SectionShell
      id={id}
      eyebrow={pricingEyebrow}
      heading={pricingHeading}
      subheading={pricingSubheading}
      tone="raised"
    >
      <div className={`grid gap-6 lg:grid-cols-12 lg:gap-8 ${RATE_CARD_MEASURE}`}>
        {/* ---------------- Brokerage rate card ---------------- */}
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface/70">
            <div className={`flex items-center gap-2.5 border-b border-border-soft py-4 ${CELL_X}`}>
              <Receipt className="h-4 w-4 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-lg font-semibold leading-[1.4] text-fg">
                {brokerageColumns.rate}
              </h3>
            </div>

            {/* Scrolls inside itself on narrow screens — the page never does. */}
            <div className="overflow-x-auto">
              {/* text-base, matching the Support table — both are data tables and
                  the page must not show two of them at two sizes. */}
              <table className="w-full min-w-[26rem] border-collapse text-left text-base">
                <caption className="sr-only">
                  Brokerage by market segment. All amounts are unverified placeholders.
                </caption>
                <thead>
                  <tr className="border-b border-border-soft">
                    <th
                      scope="col"
                      className={`py-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted ${CELL_X}`}
                    >
                      {brokerageColumns.segment}
                    </th>
                    <th
                      scope="col"
                      className={`py-3 text-right text-xs font-medium uppercase tracking-[0.14em] text-fg-muted ${CELL_X}`}
                    >
                      {brokerageColumns.rate}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {brokerage.map((row) => (
                    <tr
                      key={row.segment}
                      className="border-b border-border-soft/60 transition-colors duration-200 last:border-b-0 hover:bg-surface-raised/50"
                    >
                      <th
                        scope="row"
                        className={`whitespace-nowrap py-4 align-top font-normal text-fg lg:py-5 ${CELL_X}`}
                      >
                        {row.segment}
                      </th>
                      {/* Not nowrap: at text-base the longest placeholder rate is
                          ~48 characters, and forcing it onto one line pushed the
                          table into its own scrollbar on a 1024 desktop. */}
                      <td
                        className={`tabular py-4 text-right align-top font-medium text-fg lg:py-5 ${CELL_X}`}
                      >
                        <CopyText source={row.rate} as="span" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Always-visible statutory pass-through line. Do not collapse this.
                The rate-card link is inline inside the sentence, exactly as the
                deck writes it — matches Disclosure's `note` treatment. */}
            <div className={`border-t border-border bg-surface-raised/40 py-4 ${CELL_X}`}>
              <CopyText
                source={statutoryLine}
                className="max-w-[68ch] text-xs leading-relaxed text-fg-muted"
              />
            </div>
          </div>
        </Reveal>

        {/* ---------------- Account charges ---------------- */}
        <Reveal delay={60} className="min-w-0 lg:col-span-5">
          <div className="h-full rounded-2xl border border-border-soft bg-surface/40">
            <div className={`flex items-center gap-2.5 border-b border-border-soft py-4 ${CELL_X}`}>
              <Wallet className="h-4 w-4 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-lg font-semibold leading-[1.4] text-fg">
                {accountChargesHeading}
              </h3>
            </div>

            <div className={`pb-5 ${CELL_X}`}>
              <div className="flex items-baseline justify-between gap-4 border-b border-border-soft py-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
                <span>{accountChargeColumns.item}</span>
                <span>{accountChargeColumns.amount}</span>
              </div>

              {/* text-base rows, same size and rhythm as the brokerage table. */}
              <dl>
                {accountCharges.map((charge) => (
                  <div
                    key={charge.item}
                    className="flex items-baseline justify-between gap-4 border-b border-border-soft/60 py-4 last:border-b-0 lg:py-5"
                  >
                    <dt className="text-base leading-snug text-fg">{charge.item}</dt>
                    <dd className="tabular shrink-0 text-base font-medium text-fg">
                      <CopyText source={charge.amount} as="span" />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---------------- Plan tiers ---------------- */}
      <div className={`mt-14 sm:mt-16 ${RATE_CARD_MEASURE}`}>
        <Reveal>
          {/* Matches SectionShell's eyebrow treatment (plain 16px fg-muted), not
              the tracked micro-caps this used to wear. Those are now reserved
              for table column headers, which is the only place on the section
              where a 12px label still reads as a label rather than as shrunken
              body copy. */}
          <h3 className="text-center text-base text-fg-muted">{plansHeading}</h3>
        </Reveal>

        {/* Held to the same measure as the tables: three cards across 1664px are
            ~540px each and read as mostly padding. At 1344 they land near 430px,
            which a four-line feature list actually fills. */}
        <div className="mt-8 grid gap-5 md:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 60} className="h-full">
              {/* `highlighted` is a design emphasis only — no "most popular"
                  badge, which would be an unsubstantiated claim. */}
              <div
                className={`flex h-full flex-col rounded-2xl border p-6 transition-colors duration-200 lg:p-7 ${
                  plan.highlighted
                    ? 'border-accent bg-surface'
                    : 'border-border-soft bg-surface/40 hover:border-border hover:bg-surface'
                }`}
              >
                <h4 className="text-lg font-semibold leading-[1.4] text-fg">{plan.name}</h4>

                <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
                  <CopyText
                    source={plan.price}
                    as="span"
                    className="tabular text-2xl font-medium leading-none text-fg lg:text-3xl"
                  />
                  {plan.cadence && (
                    <span className="text-sm text-fg-muted">{plan.cadence}</span>
                  )}
                </p>

                <p className="mt-3 text-base leading-relaxed text-fg-muted">{plan.blurb}</p>

                <ul className="mt-5 flex-1 space-y-3 border-t border-border-soft pt-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-base text-fg-muted">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-accent-soft"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <CopyText source={feature} as="span" className="leading-relaxed" />
                    </li>
                  ))}
                </ul>

                <Button
                  href="#"
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  fullWidth
                  className="mt-6"
                  aria-label={`${plan.cta} — ${plan.name} plan`}
                >
                  {plan.cta}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---------------- Fine print ---------------- */}
      <div className={`mt-10 border-t border-border-soft pt-6 ${RATE_CARD_MEASURE}`}>
        <Disclosure tone="note" className="mx-auto max-w-[68ch] text-center">
          {finePrint}
        </Disclosure>
      </div>
    </SectionShell>
  )
}
