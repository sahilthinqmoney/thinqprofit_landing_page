import { useEffect, useRef, useState } from 'react'

/**
 * Reports whether the element is within `rootMargin` of the viewport.
 *
 * `once` decides whether that answer can change. One-shot is right for anything
 * that only ever needs to start; the gate keeps watching instead, because it
 * has to know both when to abort a load the reader has scrolled away from and
 * when an element is back on screen and worth a second attempt.
 */
export function useInView<T extends Element>(
  rootMargin: string,
  once: boolean = true,
): {
  ref: React.RefObject<T | null>
  inView: boolean
} {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // No IntersectionObserver (very old browser): show the media rather than
    // withhold it forever. A missing API should not cost the reader the page.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting)
        if (visible) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, once])

  return { ref, inView }
}

/** Distances at which each kind of asset starts loading. */
export const IN_VIEW_MARGIN = {
  /** Stills are small and decode fast, so they can start further out. */
  image: '300px',
  /** Clips are the expensive rung; start them closer to the fold. */
  video: '200px',
} as const
