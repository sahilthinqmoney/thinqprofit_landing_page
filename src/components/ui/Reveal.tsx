import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger offset in ms. Keep to 60ms multiples. */
  delay?: number
  className?: string
}

/**
 * Subtle scroll reveal: opacity + 12px rise, once, 60ms stagger.
 * Motion tier "subtle" — design-system/thinqprofit/pages/landing.md §6.
 * Animates transform/opacity only. Reduced-motion users get the final state
 * immediately, with no observer attached.
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      setVisible(true)
      return
    }

    // Honour Reduce Motion switched on after load, not just at mount.
    const onMotionChange = () => {
      if (motionQuery.matches) setVisible(true)
    }
    motionQuery.addEventListener('change', onMotionChange)

    const node = ref.current
    if (!node) {
      return () => motionQuery.removeEventListener('change', onMotionChange)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
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
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-200 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
