import { useState } from 'react'
import Container from '../ui/Container'
import SectionShell from '../ui/SectionShell'
import SpotlightCard from '../ui/SpotlightCard'

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
            <div className="max-w-[36em] space-y-4">
              <h2 className="display text-[clamp(2.5rem,4.6vw,4rem)] leading-[1.08] text-fg">
                Every screen you run, in one browser.
              </h2>
              <p className="text-[1.0625rem] leading-[1.65] text-fg-muted">
                Pop a window onto the second monitor and it stays linked to the first. Orders leave from the screen you are watching, routed in milliseconds.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">on send</div>
              <div className="rounded-xl border border-white/15 bg-surface/80 p-4 text-xs sm:text-sm font-mono text-fg backdrop-blur-md space-y-2">
                <div className="flex items-center gap-2 text-fg-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" />
                  <span>sent 13:04:11.208</span>
                </div>
                <div className="flex items-center gap-2 text-fg">
                  <span className="h-1.5 w-1.5 rounded-full bg-fg" />
                  <span>acknowledged 13:04:11.240</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 04 · Agentic trading follows shortly                        */}
      {/* ------------------------------------------------------------------ */}
      <SectionShell
        id="section-04"
        centered
        scale="lead"
        heading="Agentic trading follows shortly."
        subheading="AI-native agentic trading features. Details when we open."
      >
        <div className="mx-auto max-w-[42em] text-left">
          <SpotlightCard className="rounded-3xl p-6 sm:p-10 border border-white/15 space-y-6 relative overflow-hidden bg-gradient-to-b from-white/10 via-surface/80 to-surface/90 backdrop-blur-xl shadow-2xl">
            {/* Top Badge & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-fg-muted">
                <span className="h-2 w-2 rounded-full bg-chrome animate-pulse" />
                <span>Agentic Trading Core</span>
              </div>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-fg-subtle">
                In Development
              </span>
            </div>

            {/* Simulated Agentic Command Prompt */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-xs sm:text-sm space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-fg-muted">
                <span className="text-chrome font-bold">›</span>
                <span>System prompt: <span className="text-fg font-medium">"Execute multi-leg hedge if Nifty breaks 24,750 support"</span></span>
              </div>
              <div className="flex items-center gap-2 text-fg pt-1 border-t border-white/5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span className="text-fg-muted">Agent status: <span className="text-fg font-semibold">Autonomous trigger armed · zero manual latency</span></span>
              </div>
            </div>

            {/* Bottom Statement */}
            <p className="text-xs sm:text-sm text-fg-subtle leading-relaxed text-center font-mono pt-1">
              Where Thinq acts on the plan rather than merely describing it.
            </p>
          </SpotlightCard>
        </div>
      </SectionShell>
    </>
  )
}
