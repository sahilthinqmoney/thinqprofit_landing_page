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
        {/* Card 1: What is included (Golden Key BG) */}
        <SpotlightCard className="rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between border border-white/10 relative overflow-hidden group">
          {/* Visible Background Image - Golden Key */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-3xl z-0">
            <img
              src="/offer_key_bg.png"
              alt=""
              className="h-full w-full object-cover object-center opacity-75 transition-opacity duration-500 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0808]/90 via-[#0A0808]/45 to-[#0A0808]/20" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div>
              <h3 className="display text-[clamp(1.375rem,2vw,1.75rem)] leading-snug text-fg drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Full Access for Six Months
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                It belongs to everyone on the waitlist, and the list closes when we open.
              </p>

              <ul className="mt-6 space-y-4">
                {offer.terms.map((term, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] h-px w-3 shrink-0 bg-chrome/80 shadow-sm"
                    />
                    <p className="text-sm leading-relaxed text-fg-muted drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{term}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2: Statutory Breakdown (Crystal Fee Tokens BG) */}
        <SpotlightCard className="rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between border border-white/10 relative overflow-hidden group">
          {/* Visible Background Image - Crystal Tokens */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-3xl z-0">
            <img
              src="/offer_tokens_bg.png"
              alt=""
              className="h-full w-full object-cover object-right opacity-75 transition-opacity duration-500 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0808]/90 via-[#0A0808]/45 to-[#0A0808]/20" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div>
              <h3 className="display text-[clamp(1.375rem,2vw,1.75rem)] leading-snug text-fg drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {offer.statutoryHeading}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {offer.statutory}
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-surface/80 p-4 sm:p-5 backdrop-blur-md shadow-lg">
              <p className="text-xs font-mono uppercase tracking-wider text-fg-subtle mb-1">Full Transparency</p>
              <p className="text-sm font-medium leading-relaxed text-fg">
                {offer.statutoryProof}
              </p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </SectionShell>
  )
}
