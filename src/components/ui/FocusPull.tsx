import { useRef } from 'react'
import type { ElementType, ReactNode } from 'react'
import { useScrollAnimation } from '../../lib/useScrollAnimation'


/**
 * The page's scroll language: a **focus pull**.
 *
 * Every animation on this page is optical rather than spatial — the hero
 * headline resolving out of a blur, light breaking across the button's metal
 * rim. Nothing flies in from off-screen. So a section does not *arrive*, it
 * comes **into focus**: it enters slightly over-scaled and soft, and resolves to
 * 1.0 and sharp as it reaches reading position.
 *
 * Two constraints shaped this:
 *
 *  - It scales DOWN and nothing rises. motion-brief §7 rules out upward motion
 *    on a broker page, because the eye reads it as a claim about returns. A
 *    settle inward is the one arrival direction carrying no promise.
 *  - Use it on headings, not on full-height blocks. `filter: blur()` cannot be
 *    GPU-composited the way transform and opacity can, so scrubbing it across a
 *    tall section repaints that whole area every frame.
 */

/** Exponential ease-out, matching `--ease-out-expo` in index.css. */
const EASE = 'power3.out'

interface FocusPullProps {
  children: ReactNode
  /** Defaults to `div`; pass a semantic element when this wraps a heading. */
  as?: ElementType
  /**
   * Scroll-linked rather than fire-once. Scrubbed motion is tied to the wheel,
   * so the reader is doing the focusing — which is the whole point of the
   * gesture. Off for anything a reader might scroll past quickly.
   */
  scrub?: boolean
  className?: string
}

export default function FocusPull({
  children,
  as: Tag = 'div',
  scrub = true,
  className = '',
}: FocusPullProps) {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(
    (gsap) => {
      const el = ref.current
      if (!el) return

      /*
       * `gsap.matchMedia` rather than a manual matchMedia listener: it reverts
       * every tween and kills every ScrollTrigger it created when the query
       * stops matching, so switching Reduce Motion on mid-session leaves no
       * half-applied transform behind. Doing this by hand is where scroll
       * animation usually leaks.
       */
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          {
            scale: 1.02,
            opacity: 0.85,
            transformOrigin: 'left center',
          },
          {
            scale: 1,
            opacity: 1,
            ease: scrub ? 'none' : EASE,
            willChange: 'transform, opacity',
            scrollTrigger: {
              trigger: el,
              // Resolves as it travels from just-entered to reading position,
              // so it is sharp well before the reader gets to the words.
              start: 'top 88%',
              end: 'top 52%',
              scrub: scrub ? 0.6 : false,
              toggleActions: scrub ? undefined : 'play none none none',
            },
          },
        )
      })

      return () => mm.revert()
    },
    ref,
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
