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
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        {/* Card 1: Full Access for Six Months (Full Bleed Clean Golden Key BG) */}
        <SpotlightCard className="rounded-[28px] sm:rounded-[32px] bg-[#060606] border border-white/10 relative overflow-hidden min-h-[480px] sm:min-h-[520px] flex flex-col justify-between p-7 sm:p-9 group shadow-2xl transition-all duration-500 hover:border-white/20">
          {/* Full-Bleed Background Image & Gradient Overlays */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            <img
              src="/bg_golden_key.png"
              alt=""
              className="h-full w-full object-cover object-center opacity-65 transition-opacity duration-500 group-hover:opacity-80"
            />
            {/* Top & Bottom Gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060606] via-[#060606]/50 to-[#060606]" />
          </div>

          {/* Top Header (Short & Crisp) */}
          <div className="relative z-10 text-center flex flex-col items-center max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight drop-shadow-md">
              Full Access for Six Months
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-normal drop-shadow">
              Zero Thinq brokerage on equity, futures & options.
            </p>
          </div>

          {/* Spacer for background image visibility */}
          <div className="relative z-10 my-8 flex-1 pointer-events-none" />

          {/* Bottom Section (Short 1-Liner Terms) */}
          <div className="relative z-10 w-full pt-3 border-t border-white/10 text-center">
            <p className="text-xs text-neutral-300/90 leading-normal drop-shadow">
              Starts on your account activation date • No minimum turnover
            </p>
          </div>
        </SpotlightCard>

        {/* Card 2: What still applies (Full Bleed Clean Crystal Coins BG) */}
        <SpotlightCard className="rounded-[28px] sm:rounded-[32px] bg-[#060606] border border-white/10 relative overflow-hidden min-h-[480px] sm:min-h-[520px] flex flex-col justify-between p-7 sm:p-9 group shadow-2xl transition-all duration-500 hover:border-white/20">
          {/* Full-Bleed Background Image & Gradient Overlays */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            <img
              src="/bg_crystal_coins.png"
              alt=""
              className="h-full w-full object-cover object-center sm:object-right opacity-65 transition-opacity duration-500 group-hover:opacity-80"
            />
            {/* Top & Bottom Gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060606] via-[#060606]/50 to-[#060606]" />
          </div>

          {/* Top Header (Short & Crisp) */}
          <div className="relative z-10 text-center flex flex-col items-center max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight drop-shadow-md">
              What still applies
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-normal max-w-xs drop-shadow">
              Government taxes and exchange fees passed through at cost.
            </p>
          </div>

          {/* Spacer for background image visibility */}
          <div className="relative z-10 my-8 flex-1 pointer-events-none" />

          {/* Bottom Section (Short Full Transparency Sub-box) */}
          <div className="relative z-10 w-full pt-1">
            <div className="rounded-2xl border border-white/15 bg-black/40 p-3.5 backdrop-blur-md text-center shadow-lg">
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-0.5">
                FULL TRANSPARENCY
              </p>
              <p className="text-xs font-medium text-white">
                Itemised line-by-line on your daily contract note.
              </p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </SectionShell>
  )
}





