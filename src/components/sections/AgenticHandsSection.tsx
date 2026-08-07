import { useRef } from 'react'
import { gsap, initScrollTrigger, useGSAP } from '../../lib/scrollTrigger'

initScrollTrigger()

export default function AgenticHandsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftHandRef = useRef<HTMLImageElement>(null)
  const rightHandRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      const leftHand = leftHandRef.current
      const rightHand = rightHandRef.current
      const textBlock = textRef.current

      if (!container || !leftHand || !rightHand || !textBlock) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            end: 'bottom 35%',
            scrub: 1.2,
          },
        })

        // Left Robotic Hand comes in smoothly, pointing directly at the center of capital letter "A"
        tl.fromTo(
          leftHand,
          { xPercent: -100, opacity: 0.15, rotate: -24 },
          { xPercent: 0, opacity: 1, rotate: -10, ease: 'power2.out' },
          0
        )

        // Right Human Hand comes in smoothly, pointing directly at character "y."
        tl.fromTo(
          rightHand,
          { xPercent: 100, opacity: 0.15, rotate: 8 },
          { xPercent: 0, opacity: 1, rotate: -2, ease: 'power2.out' },
          0
        )

        // Center Title & Subtitle reveal in tandem
        tl.fromTo(
          textBlock,
          { scale: 0.92, opacity: 0.3, y: 20 },
          { scale: 1, opacity: 1, y: 0, ease: 'power2.out' },
          0
        )
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="section-04"
      className="relative scroll-mt-24 py-28 sm:py-36 lg:py-44 overflow-hidden bg-transparent select-none"
    >





      {/* Left Hand: Robotic AI Hand (Positioned to point directly at capital letter "A") */}
      <div className="absolute left-0 sm:left-2 lg:left-6 top-[44%] sm:top-[46%] lg:top-[48%] -translate-y-1/2 z-10 pointer-events-none w-[32%] max-w-[440px] min-w-[180px]">
        <img
          ref={leftHandRef}
          src="/robot_hand.png"
          alt="Robotic AI Hand"
          className="w-full h-auto object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.22)] origin-right-center"
        />
      </div>

      {/* Center Text Block */}
      <div
        ref={textRef}
        className="relative z-20 mx-auto max-w-[42em] px-4 text-center space-y-4"
      >
        <h2 className="display whitespace-normal text-fg md:whitespace-pre-line text-[clamp(2.35rem,4.8vw,4.25rem)] font-bold leading-[1.08] tracking-tight">
          Agentic trading
          follows shortly.
        </h2>
        <p className="text-[1.0625rem] sm:text-lg leading-[1.65] text-fg-muted max-w-[32em] mx-auto">
          AI-native agentic trading features. Details when we open.
        </p>
      </div>

      {/* Right Hand: Human Trader Hand (Positioned to point directly at character "y.") */}
      <div className="absolute right-0 sm:right-2 lg:right-6 top-[62%] sm:top-[65%] lg:top-[67%] -translate-y-1/2 z-10 pointer-events-none w-[32%] max-w-[440px] min-w-[180px]">
        <img
          ref={rightHandRef}
          src="/human_hand.png"
          alt="Human Trader Hand"
          className="w-full h-auto object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.2)] origin-right-center"
        />
      </div>
    </section>
  )
}
