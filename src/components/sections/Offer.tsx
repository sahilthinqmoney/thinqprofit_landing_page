import SpotlightCard from '../ui/SpotlightCard'
import SectionShell from '../ui/SectionShell'
import { offer } from '../../data/offer'


export default function Offer() {
  return (
    <SectionShell
      id="offer"
      seamless
      scale="lead"
      heading={offer.heading}
      subheading="Equity, futures and options, from the day your account is activated. No tiers, no minimum turnover."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Card 1: What is included */}
        <SpotlightCard className="rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between border border-white/10">
          <div>
            <h3 className="display text-[clamp(1.375rem,2vw,1.75rem)] leading-snug text-fg">
              Full Access for Six Months
            </h3>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              It belongs to everyone on the waitlist, and the list closes when we open.
            </p>

            <ul className="mt-6 space-y-4">
              {offer.terms.map((term, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-px w-3 shrink-0 bg-chrome/60"
                  />
                  <p className="text-sm leading-relaxed text-fg-muted">{term}</p>
                </li>
              ))}
            </ul>
          </div>
        </SpotlightCard>

        {/* Card 2: Statutory Breakdown */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between border border-white/10">
          <div>
            <h3 className="display text-[clamp(1.375rem,2vw,1.75rem)] leading-snug text-fg">
              {offer.statutoryHeading}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
              {offer.statutory}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface/60 p-4 sm:p-5 backdrop-blur-md">
            <p className="text-xs font-mono uppercase tracking-wider text-fg-subtle mb-1">Full Transparency</p>
            <p className="text-sm font-medium leading-relaxed text-fg">
              {offer.statutoryProof}
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
