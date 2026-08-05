import { useState } from 'react'
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
      {/* Section 04 · Agentic trading follows shortly                        */}
      {/* ------------------------------------------------------------------ */}
      <AgenticHandsSection />
    </>
  )
}
