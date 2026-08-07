import { useRef } from 'react'
import { gsap, initScrollTrigger, useGSAP } from '../../lib/scrollTrigger'
import { agenticHands } from '../../data/agenticHands'

initScrollTrigger()

/**
 * §3.5 — two hands closing in on the headline as the section scrolls through.
 *
 * A robot hand enters from the left and a human one from the right, both
 * settling as the copy scales up. The gesture is the argument: the section says
 * agentic trading is coming, and what the reader sees is a machine hand and a
 * person's hand arriving at the same sentence.
 *
 * `scrub: 1.2` ties the whole thing to scroll position rather than playing it
 * once, so it runs backwards on the way up. Everything sits inside a
 * `matchMedia` on `prefers-reduced-motion: no-preference` — under reduced motion
 * the timeline is never built, so the hands and copy render at their final
 * values instead of at a start state that never animates away.
 */
export default function AgenticHands() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const robotHandRef = useRef<HTMLImageElement>(null)
  const humanHandRef = useRef<HTMLImageElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
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
            start: 'top 85%',
            end: 'bottom 35%',
            scrub: 1.2,
          },
        })

        // All three start at position 0 — they arrive together, not in sequence.
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
          { scale: 0.92, opacity: 0.3, y: 20 },
          { scale: 1, opacity: 1, y: 0, ease: 'power2.out' },
          0
        )
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="agentic"
      className="relative scroll-mt-24 py-10 sm:py-36 lg:py-44 overflow-hidden bg-transparent select-none"
    >
      {/* Left, pointing at the "A" of "Agentic". */}
      <div className="absolute left-0 sm:left-2 lg:left-6 top-[44%] sm:top-[46%] lg:top-[48%] -translate-y-1/2 z-10 pointer-events-none w-[32%] max-w-[440px] min-w-[180px]">
        <img
          ref={robotHandRef}
          src="/images/hands/robot.png"
          alt={agenticHands.robotAlt}
          className="w-full h-auto object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.22)] origin-right-center"
        />
      </div>

      <div
        ref={copyRef}
        className="relative z-20 mx-auto max-w-[42em] px-4 text-center space-y-4"
      >
        <h2 className="display whitespace-normal text-fg md:whitespace-pre-line text-[clamp(2.35rem,4.8vw,4.25rem)] font-bold leading-[1.08] tracking-tight">
          {agenticHands.headline}
        </h2>
        <p className="text-[1.0625rem] sm:text-lg leading-[1.65] text-fg-muted max-w-[32em] mx-auto">
          {agenticHands.subheading}
        </p>
      </div>

      {/* Right, and lower — pointing at the "y." of "shortly." */}
      <div className="absolute right-0 sm:right-2 lg:right-6 top-[62%] sm:top-[65%] lg:top-[67%] -translate-y-1/2 z-10 pointer-events-none w-[32%] max-w-[440px] min-w-[180px]">
        <img
          ref={humanHandRef}
          src="/images/hands/human.png"
          alt={agenticHands.humanAlt}
          className="w-full h-auto object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.2)] origin-right-center"
        />
      </div>
    </section>
  )
}
