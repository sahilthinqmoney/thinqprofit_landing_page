import { useRef } from 'react'
import type { ElementType, ReactNode } from 'react'
import { gsap, initScrollTrigger, useGSAP } from '../../lib/scrollTrigger'

// Registers the plugins and schedules the post-font ScrollTrigger refresh. Idempotent.
initScrollTrigger()

/**
 * The page's scroll language: a **focus pull**.
 *
 * Every existing animation here is optical rather than spatial. The hero
 * headline resolves out of a 10px blur while the field behind it settles; the
 * button's ring is light breaking across metal; the footer wordmark is a
 * specular travelling along an edge. Nothing on this page flies in from
 * off-screen, and adding that now would read as a different site bolted on.
 *
 * So a section does not *arrive* — it comes **into focus**. It enters slightly
 * over-scaled and soft, and resolves to 1.0 and sharp as it reaches reading
 * position. That is the "zoom out, then the section reveals" gesture, built from
 * the vocabulary the page already speaks.
 *
 * Two constraints shaped the implementation:
 *
 * **It scales down, never up, and nothing rises.** motion-brief §7 rules out
 * upward motion on a broker page because the eye reads it as a claim about
 * returns. A settle inward is the one arrival direction that carries no promise.
 *
 * **Blur is scoped to headings.** `filter: blur()` cannot be composited on the
 * GPU the way transform and opacity can, so scrubbing it across a full-height
 * section repaints that whole area every frame. Headings are small, so they get
 * the focus pull; section bodies get `SceneReveal`, which is transform and
 * opacity only.
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

  useGSAP(
    () => {
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
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
