import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap, initScrollTrigger, useGSAP } from '../../lib/scrollTrigger'

// Registers the plugins and schedules the post-font ScrollTrigger refresh. Idempotent.
initScrollTrigger()

/**
 * Staggered entrance for a section's content, once, on first scroll into view.
 *
 * The counterpart to `FocusPull`: that one handles the heading with a scrubbed
 * focus pull, this one handles what follows. Transform and opacity only — no
 * blur — because this wraps whole rows and grids, and `filter` on an area that
 * size repaints rather than composites.
 *
 * **It settles downward from above, by −10px.** Every stock scroll library rises
 * from below, and on a broker's page that is the one direction not available:
 * motion-brief §7 bans upward motion because the eye reads it as a claim about
 * returns. Coming down also agrees with the hero, whose headline damps down into
 * place rather than lifting into it.
 *
 * **It fires once and does not reverse.** Content that re-animates every time it
 * re-enters the viewport turns a scroll back up into a second performance, and
 * the reader is usually scrolling back to re-read something — which is exactly
 * the moment not to move it.
 */

const EASE = 'power3.out'

interface SceneRevealProps {
  children: ReactNode
  /**
   * Selector for the children to stagger. Defaults to the direct children.
   * Pass something narrower when the wrapper's own layout elements should not
   * animate independently.
   */
  stagger?: string
  /** Seconds between each child. 0.06 matches the CSS `Reveal` cadence. */
  step?: number
  className?: string
}

export default function SceneReveal({
  children,
  stagger,
  step = 0.06,
  className = '',
}: SceneRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const host = ref.current
      if (!host) return

      const targets = stagger
        ? host.querySelectorAll(stagger)
        : (Array.from(host.children) as HTMLElement[])
      if (!targets.length) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(targets, {
          y: -10,
          opacity: 0,
          duration: 0.7,
          ease: EASE,
          // Capped total: at 0.06s a twelve-item grid would otherwise take three
          // quarters of a second to finish, and the last item lands after the
          // reader has already looked at it.
          stagger: { each: step, amount: Math.min(targets.length * step, 0.36) },
          scrollTrigger: {
            trigger: host,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
