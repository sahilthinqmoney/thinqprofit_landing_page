import { useState } from 'react'
import Container from '../ui/Container'
import SectionShell from '../ui/SectionShell'
import SpotlightCard from '../ui/SpotlightCard'
import AgenticHandsSection from './AgenticHandsSection'

export default function SectionTwo() {
  const [activeTab, setActiveTab] = useState<'levels' | 'whatChanged' | 'legs'>('levels')

  const tabs = [
    {
      id: 'levels' as const,
      label: 'Levels',
      description: 'Marked only where price has turned.',
      onClipText: 'on the chart — 24,780 · held three times since 09:15. Tested again 13:04.',
    },
    {
      id: 'whatChanged' as const,
      label: 'What changed',
      description: 'Stated in words, on the chart, as it prints.',
      onClipText: 'on the chart — 13:04 · price left the first-hour range.',
    },
    {
      id: 'legs' as const,
      label: 'Your legs on it',
      description: 'Every leg you hold, against the move on screen. On the book you have right now.',
      onClipText: 'on the chart — Short 2 legs at 24,800. 71% of today\'s MTM sits there.',
    },
  ]

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0]

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Section 02 · It says what just happened                            */}
      {/* ------------------------------------------------------------------ */}
      <SectionShell
        id="section-02"
        scale="lead"
        heading="It says what just happened."
        subheading="Our own charting engine. The levels are marked where price has held, and the words are on the chart."
      >
        <SpotlightCard className="rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-wrap gap-2.5 border-b border-white/10 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/15 text-fg shadow-sm border border-white/20'
                    : 'text-fg-muted hover:text-fg hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-base text-fg-muted leading-relaxed max-w-[36em]">
              {currentTab.description}
            </p>

            <div className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-surface/80 px-4 py-3 text-sm font-mono text-fg shadow-inner backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-fg-muted" />
              <span>{currentTab.onClipText}</span>
            </div>
          </div>
        </SpotlightCard>
      </SectionShell>

      {/* ------------------------------------------------------------------ */}
      {/* Section 03 · Every screen you run, in one browser                  */}
      {/* ------------------------------------------------------------------ */}
      <section id="section-03" className="scroll-mt-24 py-16 sm:py-20 lg:py-24 border-t border-border-soft">
        <Container>
          <div className="mx-auto w-full max-w-[84rem] grid gap-8 lg:grid-cols-2 lg:items-center xl:gap-16">
            {/* Embedded 3D Dual-Monitor Setup (Left) */}
            <div className="relative group flex items-center justify-center p-2 sm:p-4 order-2 lg:order-1">
              {/* Soft ambient backglow behind monitors */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[75%] w-[85%] rounded-full bg-accent/15 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
              
              {/* Dual Monitors Image */}
              <img
                src="/dual_monitors.png"
                alt="Every screen you run, in one browser - Dual Monitor Pop-Out Setup"
                className="relative z-10 w-full h-auto object-contain max-h-[560px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Text Block (Right) */}
            <div className="max-w-[36em] space-y-4 order-1 lg:order-2">
              <h2 className="display text-[clamp(2.5rem,4.6vw,4rem)] leading-[1.08] text-fg">
                Every screen you run, in one browser.
              </h2>
              <p className="text-[1.0625rem] leading-[1.65] text-fg-muted">
                Pop a window onto the second monitor and it stays linked to the first. Orders leave from the screen you are watching, routed in milliseconds.
              </p>
            </div>
          </div>
        </Container>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/* Section 04 · Agentic trading follows shortly                        */}
      {/* ------------------------------------------------------------------ */}
      <AgenticHandsSection />
    </>
  )
}
