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
 */
export default function Pricing({ id = 'pricing' }: PricingProps) {
  return (
    <SectionShell
      id={id}
      eyebrow={pricingEyebrow}
      heading={pricingHeading}
      subheading={pricingSubheading}
      tone="raised"
    >
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ---------------- Brokerage rate card ---------------- */}
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface/70">
            <div className="flex items-center gap-2.5 border-b border-border-soft px-5 py-4">
              <Receipt className="h-4 w-4 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-lg font-semibold leading-[1.4] text-fg">
                {brokerageColumns.rate}
              </h3>
            </div>

            {/* Scrolls inside itself on narrow screens — the page never does. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Brokerage by market segment. All amounts are unverified placeholders.
                </caption>
                <thead>
                  <tr className="border-b border-border-soft">
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted"
                    >
                      {brokerageColumns.segment}
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-right text-xs font-medium uppercase tracking-[0.14em] text-fg-muted"
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
                        className="whitespace-nowrap px-5 py-3.5 font-normal text-fg"
                      >
                        {row.segment}
                      </th>
                      <td className="tabular whitespace-nowrap px-5 py-3.5 text-right font-medium text-fg">
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
            <div className="border-t border-border bg-surface-raised/40 px-5 py-4">
              <CopyText
                source={statutoryLine}
                className="text-xs leading-relaxed text-fg-muted"
              />
            </div>
          </div>
        </Reveal>

        {/* ---------------- Account charges ---------------- */}
        <Reveal delay={60} className="min-w-0 lg:col-span-5">
          <div className="h-full rounded-2xl border border-border-soft bg-surface/40">
            <div className="flex items-center gap-2.5 border-b border-border-soft px-5 py-4">
              <Wallet className="h-4 w-4 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-lg font-semibold leading-[1.4] text-fg">
                {accountChargesHeading}
              </h3>
            </div>

            <div className="px-5 pb-5">
              <div className="flex items-baseline justify-between gap-4 border-b border-border-soft py-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted">
                <span>{accountChargeColumns.item}</span>
                <span>{accountChargeColumns.amount}</span>
              </div>

              <dl>
                {accountCharges.map((charge) => (
                  <div
                    key={charge.item}
                    className="flex items-baseline justify-between gap-4 border-b border-border-soft/60 py-3.5 last:border-b-0"
                  >
                    <dt className="text-sm leading-snug text-fg-muted">{charge.item}</dt>
                    <dd className="tabular shrink-0 text-sm font-medium text-fg">
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
      <div className="mt-14 sm:mt-16">
        <Reveal>
          <h3 className="text-center text-xs font-medium uppercase tracking-[0.2em] text-fg-muted">
            {plansHeading}
          </h3>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 60} className="h-full">
              {/* `highlighted` is a design emphasis only — no "most popular"
                  badge, which would be an unsubstantiated claim. */}
              <div
                className={`flex h-full flex-col rounded-2xl border p-6 transition-colors duration-200 ${
                  plan.highlighted
                    ? 'border-accent bg-surface'
                    : 'border-border-soft bg-surface/40 hover:border-border hover:bg-surface'
                }`}
              >
                <h4 className="text-base font-semibold text-fg">{plan.name}</h4>

                <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
                  <CopyText
                    source={plan.price}
                    as="span"
                    className="tabular text-2xl font-medium leading-none text-fg"
                  />
                  {plan.cadence && (
                    <span className="text-sm text-fg-muted">{plan.cadence}</span>
                  )}
                </p>

                <p className="mt-3 text-base leading-relaxed text-fg-muted">{plan.blurb}</p>

                <ul className="mt-5 flex-1 space-y-2.5 border-t border-border-soft pt-5">
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
      <div className="mt-10 border-t border-border-soft pt-6">
        <Disclosure tone="note" className="mx-auto max-w-2xl text-center">
          {finePrint}
        </Disclosure>
      </div>
    </SectionShell>
  )
}
