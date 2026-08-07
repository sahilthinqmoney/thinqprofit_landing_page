import MediaSection from '../ui/MediaSection'
import { theGap } from '../../data/theGap'

/**
 * §3 — the gap between a move happening and the reader seeing it.
 *
 * The page's one deep section: two timestamps as the headline, the arithmetic
 * underneath, and a flip clock running beside them. No CTA — the hero already
 * carries the page's single ask, and a second one here would interrupt the only
 * section making an argument rather than requesting something.
 *
 * The copy names no instrument, price or direction, which is what keeps it
 * inside docs/art-direction.md §2.1: a clock is not market data, and the moment
 * this section names a symbol it becomes an invented trade.
 */
export default function TheGap() {
  return (
    <MediaSection
      id="the-gap"
      className="isolate"
      height="tall"
      place="left"
      anchor="center"
      scrim={0}
      measure="13em"
      headline={theGap.heading}
      body={theGap.solution}
      finePrint={theGap.finePrint}
      bgAmbient={<AmbientWash />}
      aside={<FlipClock />}
      media={{ alt: 'Feature Focus' }}
    />
  )
}

/** Full-bleed teal wash bleeding in from the left edge, behind everything. */
function AmbientWash() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden"
    >
      <div
        className="h-full w-[65vw] max-w-[950px] opacity-85 blur-[130px]"
        style={{
          background:
            'radial-gradient(ellipse at 0% 50%, rgba(8, 45, 54, 0.85) 0%, rgba(8, 45, 54, 0.4) 45%, rgba(8, 45, 54, 0.1) 75%, transparent 100%)',
        }}
      />
    </div>
  )
}

/**
 * The clock, masked to an ellipse so it dissolves into the ground rather than
 * sitting in a visible box. Decorative and silent, so it is not exposed to
 * assistive tech and carries no controls.
 */
function FlipClock() {
  return (
    <div className="relative group flex items-center justify-end w-full ml-auto">
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="w-full h-auto max-h-[360px] sm:max-h-[580px] md:max-h-[850px] lg:max-h-[960px] object-contain opacity-95 scale-100 sm:scale-120 md:translate-x-3 sm:translate-x-6 [mask-image:radial-gradient(ellipse_85%_85%_at_center,black_45%,transparent_100%)] drop-shadow-[0_24px_48px_rgba(0,0,0,0.95)] transition-all duration-700 group-hover:scale-125 group-hover:opacity-100 pointer-events-none"
      >
        <source src="/clips/flip-clock.webm" type="video/webm" />
      </video>
    </div>
  )
}
