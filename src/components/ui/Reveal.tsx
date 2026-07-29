import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger offset in ms. */
  delay?: number
  className?: string
}

/**
 * The page's quiet entrance: a short rise that resolves out of a slight blur.
 *
 * Deliberately understated. The one authored motion moment on this page is the
 * hero, where the headline settles as the field behind it resolves; if every
 * section performed its own entrance, none of them would land. Everything below
 * the fold uses this and only this.
 *
 * The blur is what separates it from the stock fade-up — focus pulling in reads
 * as something arriving, where opacity alone reads as a stylesheet loading. It
 * is 5px and transient, so it never sits on the compositor as a standing cost.
 *
 * Easing is exponential ease-out: most of the distance is covered immediately,
 * then a long settle. Reduced-motion users get the final state with no observer
 * attached, and the state is honoured if it is switched on after load.
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Default visible: if the observer never runs — unsupported, or an error
  // before the effect — the content is readable rather than permanently blank.
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches || typeof IntersectionObserver === 'undefined') return

    const onMotionChange = () => {
      if (motionQuery.matches) setHidden(false)
    }
    motionQuery.addEventListener('change', onMotionChange)

    const node = ref.current
    if (!node) {
      return () => motionQuery.removeEventListener('change', onMotionChange)
    }

    // Hide only once we know we can animate it back, and only if it has not
    // already scrolled into view — an element above the fold should never blink.
    const rect = node.getBoundingClientRect()
    const alreadySeen = rect.top < window.innerHeight * 0.9
    if (!alreadySeen) setHidden(true)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHidden(false)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
      className={`transition-[opacity,transform,filter] duration-700 ${
        hidden ? 'translate-y-4 opacity-0 blur-[5px]' : 'translate-y-0 opacity-100 blur-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
