import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Scroll-in entrance with a per-section variant.
 *
 * The page previously had exactly one entrance, applied everywhere, which is the
 * same failure as having none: if every section arrives identically the motion
 * carries no information and the reader stops seeing it. Each section now picks
 * the variant that says something about its own content — `wipe` for a rate card
 * being exposed, `shear` for a speed claim, `blur` for figures resolving,
 * `left`/`right` for two columns converging.
 *
 * What every variant has in common is the part that is not negotiable: nothing
 * rises (motion-brief §7 — upward motion on a broker page reads as a claim about
 * returns), nothing overshoots, nothing glows, and everything lands on its end
 * state and stops.
 *
 * Reduced motion attaches no observer at all and renders the final state, rather
 * than running the animation at 0.01ms. A considered still is not the same thing
 * as a stutter.
 */
export type RevealVariant =
  | 'settle'
  | 'blur'
  | 'left'
  | 'right'
  | 'scale'
  | 'wipe'
  | 'shear'

const VARIANT: Record<RevealVariant, { hidden: string; anim: string; duration: number }> = {
  settle: { hidden: 'translate-y-[-10px] opacity-0', anim: 'reveal-settle', duration: 700 },
  blur: { hidden: 'opacity-0 blur-[14px]', anim: 'reveal-blur', duration: 900 },
  left: { hidden: 'translate-x-[-28px] opacity-0', anim: 'reveal-left', duration: 750 },
  right: { hidden: 'translate-x-[28px] opacity-0', anim: 'reveal-right', duration: 750 },
  scale: { hidden: 'scale-[1.06] opacity-0', anim: 'reveal-scale', duration: 800 },
  // A wipe is fully opaque throughout — the element is clipped, not faded. That
  // matters for anything carrying text: at no point is it half-visible.
  wipe: { hidden: '[clip-path:inset(0_100%_0_0)]', anim: 'reveal-wipe', duration: 900 },
  shear: { hidden: 'opacity-0', anim: 'reveal-shear', duration: 800 },
}

interface RevealProps {
  children: ReactNode
  /** Stagger offset in ms. */
  delay?: number
  /** Which entrance. Pick one per section, not one per element. */
  variant?: RevealVariant
  className?: string
}

export default function Reveal({
  children,
  delay = 0,
  variant = 'settle',
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Default visible: if the observer never runs — unsupported, or an error before
  // the effect — the content is readable rather than permanently blank.
  const [hidden, setHidden] = useState(false)
  const [playing, setPlaying] = useState(false)

  const spec = VARIANT[variant]

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches || typeof IntersectionObserver === 'undefined') return

    const onMotionChange = () => {
      if (motionQuery.matches) {
        setHidden(false)
        setPlaying(false)
      }
    }
    motionQuery.addEventListener('change', onMotionChange)

    const node = ref.current
    if (!node) {
      return () => motionQuery.removeEventListener('change', onMotionChange)
    }

    // Never hide something the reader can already see — an element above the fold
    // would otherwise blink out and back in on load.
    const rect = node.getBoundingClientRect()
    if (rect.top >= window.innerHeight * 0.9) setHidden(true)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHidden(false)
            setPlaying(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  /*
   * Two elements, and the split fixes a real deadlock rather than being tidy.
   *
   * The observed element must never carry the hidden state. IntersectionObserver
   * computes its intersection rect *after* the element's own clipping, so a
   * `clip-path: inset(0 100% 0 0)` element reports zero intersection area and
   * `isIntersecting` never becomes true — it is hidden because it is not visible,
   * and it can never become visible because it is hidden. The `wipe` variant hit
   * exactly that and took Pricing's rate card and the FAQ rows off the page.
   *
   * So: the outer element is observed and carries the caller's layout classes
   * (grid spans, widths — those have to stay on the element the parent lays out).
   * The inner element carries the hidden state and the animation, and is never
   * observed. This is structural, so no future variant can reintroduce the bug.
   */
  return (
    <div ref={ref} className={className}>
      <div
        className={hidden ? spec.hidden : undefined}
        style={
          playing
            ? {
                // `both` so it holds the from-state through its delay rather than
                // flashing at full opacity before its turn.
                animation: `${spec.anim} ${spec.duration}ms var(--ease-out-expo) ${delay}ms both`,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  )
}
