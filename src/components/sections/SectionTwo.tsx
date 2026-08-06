import SectionShell from '../ui/SectionShell'
import AgenticHandsSection from './AgenticHandsSection'


const POINTS = [
  {
    num: '01',
    label: 'Levels',
    cap: 'Marked only where price has turned on the book.',
    bg: '/images/charting/levels.jpg',
  },
  {
    num: '02',
    label: 'What changed',
    cap: 'Stated in words, on the chart, as it prints live.',
    bg: '/images/charting/what_changed.png',
  },
  {
    num: '03',
    label: 'Your legs on it',
    cap: 'Every leg you hold, against the move on screen.',
    bg: '/images/charting/your_legs.jpg',
  },
]

export default function SectionTwo() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Section 02 · It says what just happened                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative isolate w-full overflow-hidden">
        {/* Ocean Cyan left-to-right fade gradient overlay at top portion of section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[280px] -z-10 mix-blend-screen opacity-70"
          style={{
            background:
              'linear-gradient(to right, #082d36 0%, rgba(8, 45, 54, 0.6) 35%, rgba(8, 45, 54, 0.15) 65%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
          }}
        />

        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 50%, rgba(0,220,230,0.05) 0%, transparent 75%)',
          }}
        />

        {/* Fine horizontal rule overlay — chart grid aesthetic */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden md:block opacity-50"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(180,200,200,0.03) 0px, rgba(180,200,200,0.03) 1px, transparent 1px, transparent 64px)',
          }}
        />

        <SectionShell
          id="section-02"
          scale="lead"
          heading="It says what just happened."
          subheading="Our own charting engine. The levels are marked where price has held, and the words are on the chart."
        >
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 max-w-[1400px] mx-auto">
            {POINTS.map((point) => (
              <div
                key={point.label}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/15 bg-[#000000] px-7 pt-10 pb-0 text-center min-h-[580px] sm:min-h-[640px] transition-all duration-300 hover:border-white/30 hover:scale-[1.015] shadow-2xl"
              >
                {/* Top Section — Centered Title & Subcaption */}
                <div className="flex flex-col items-center text-center z-10 bg-[#000000]">
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                    {point.label}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-fg-muted max-w-[22em] mx-auto">
                    {point.cap}
                  </p>
                </div>

                {/* Bottom Section — 3D Visual Graphic (100% Seamless Blend via 4-Way Gradients) */}
                <div className="relative mt-8 -mx-7 h-[400px] sm:h-[460px] w-[calc(100%+3.5rem)] overflow-hidden bg-[#000000]">
                  <img
                    src={point.bg}
                    alt={point.label}
                    className="w-full h-full object-cover object-bottom mix-blend-lighten opacity-95"
                    style={{
                      WebkitMaskImage:
                        'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, rgba(0,0,0,0.7) 80%, transparent 100%)',
                      maskImage:
                        'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, rgba(0,0,0,0.7) 80%, transparent 100%)',
                    }}
                  />
                  {/* Top-to-bottom vertical gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, #000000 0%, transparent 25%, transparent 75%, #000000 100%)',
                    }}
                  />
                  {/* Left-to-right horizontal side gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to right, #000000 0%, transparent 15%, transparent 85%, #000000 100%)',
                    }}
                  />
                </div>
              </div>
            ))}

          </div>
        </SectionShell>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Section 04 · Agentic trading follows shortly                        */}
      {/* ------------------------------------------------------------------ */}
      <AgenticHandsSection />
    </>
  )
}

