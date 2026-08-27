import { useRef } from 'react'
import { Bot, Code2, History, ShieldAlert } from 'lucide-react'
import { useScrollAnimation } from '../../lib/useScrollAnimation'
import { agenticHands } from '../../data/agenticHands'
import ProgressiveImage from '../ui/ProgressiveImage'


const SPEC_ICONS = [Bot, Code2, History, ShieldAlert]

/**
 * §3.5 — Agentic trading section with hands animation and rectangular glass feature cards.
 */
export default function AgenticHands() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const robotHandRef = useRef<HTMLDivElement>(null)
  const humanHandRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useScrollAnimation(
    (gsap) => {
      const section = sectionRef.current
      const robotHand = robotHandRef.current
      const humanHand = humanHandRef.current
      const copy = copyRef.current
      if (!section || !robotHand || !humanHand || !copy) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: 1.2,
          },
        })

        tl.fromTo(
          robotHand,
          { xPercent: -100, opacity: 0.15, rotate: -24 },
          { xPercent: 0, opacity: 1, rotate: -10, ease: 'power2.out' },
          0
        )
        tl.fromTo(
          humanHand,
          { xPercent: 100, opacity: 0.15, rotate: 8 },
          { xPercent: 0, opacity: 1, rotate: -2, ease: 'power2.out' },
          0
        )
        tl.fromTo(
          copy,
          { scale: 0.94, opacity: 0.3, y: 20 },
          { scale: 1, opacity: 1, y: 0, ease: 'power2.out' },
          0
        )
      })

      return () => mm.revert()
    },
    sectionRef
  )

  return (
    <section
      ref={sectionRef}
      id="agentic"
      className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 overflow-hidden bg-transparent select-none"
    >
      {/* Robot Hand — Left side, pointing towards headline */}
      <div className="absolute left-0 sm:left-2 lg:left-6 top-[16%] sm:top-[18%] lg:top-[20%] -translate-y-1/2 z-10 pointer-events-none w-[24%] max-w-[340px] min-w-[140px]">
        <ProgressiveImage
          elementRef={robotHandRef}
          src="/images/hands/robot.png"
          alt={agenticHands.robotAlt}
          width={405}
          height={236}
          className="origin-right-center"
          imageClassName="object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.22)]"
        />
      </div>

      {/* Main Copy & Feature Cards Container - Aligned to 84rem Rail */}
      <div className="relative z-20 mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-8">
        {/* Animated Header Block */}
        <div ref={copyRef} className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="display whitespace-normal text-fg text-[clamp(2.2rem,4.5vw,3.75rem)] font-bold leading-[1.1] tracking-tight">
            {agenticHands.headline}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-fg-muted max-w-xl mx-auto">
            {agenticHands.subheading}
          </p>
        </div>

        {/* 4 Thin Cards Grid - Full Rail Width with Generous Gap & Slim Height */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {agenticHands.specs.map((item, index) => {
            const Icon = SPEC_ICONS[index % SPEC_ICONS.length]
            return (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-xl bg-white/[0.035] p-4 sm:p-4.5 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.06] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
              >
                <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center text-fg-muted transition-colors duration-300 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[11px] font-medium text-white/30">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-fg tracking-tight group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-fg-muted font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Fine Print Disclosure */}
        <p className="mt-10 sm:mt-12 text-xs leading-relaxed text-fg-subtle text-center max-w-none whitespace-normal sm:whitespace-nowrap mx-auto">
          {agenticHands.finePrint}
        </p>
      </div>

      {/* Human Hand — Right side, pointing towards headline */}
      <div className="absolute right-0 sm:right-2 lg:right-6 top-[22%] sm:top-[24%] lg:top-[26%] -translate-y-1/2 z-10 pointer-events-none w-[24%] max-w-[340px] min-w-[140px]">
        <ProgressiveImage
          elementRef={humanHandRef}
          src="/images/hands/human.png"
          alt={agenticHands.humanAlt}
          width={399}
          height={230}
          className="origin-right-center"
          imageClassName="object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]"
        />
      </div>
    </section>
  )
}
