import { useEffect, useRef, useState } from 'react'

/**
 * Reports when an `<img>` has pixels ready to paint.
 *
 * `decode()` rather than the `load` event, so a cross-fade never starts against
 * a bitmap the compositor has not got yet — a still that fades in half-drawn is
 * worse than one that is honestly still a blur.
 *
 * The important part is that the decode is started ONCE per mounted element and
 * is never cancelled. It used to live in each component's own effect with the
 * media gate in the dependency array, and the gate changes identity every time
 * its status does — waiting, loading, paused, loading again as attempts cycle.
 * Each of those re-ran the effect, whose cleanup cancelled the decode that was
 * still in flight, so on an unlucky run the decode never once got to finish.
 * The reader was left on the 20px blurred placeholder for the whole visit with
 * the real image sitting decoded in the cache — a permanently blurry picture
 * with nothing wrong with the picture.
 *
 * Losing a race should cost a frame, not the image.
 */
export function useImageReveal(
  mounted: boolean,
  ref: React.RefObject<HTMLImageElement | null>,
  onReady?: () => void,
): boolean {
  const [ready, setReady] = useState(false)
  const startedRef = useRef(false)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    if (!mounted || startedRef.current) return
    const image = ref.current
    if (!image) return
    startedRef.current = true

    const reveal = () => {
      setReady(true)
      onReadyRef.current?.()
    }

    let listening = false
    void image.decode().then(reveal, () => {
      // Decode can reject on an image that is cached but not yet attached, and
      // on one that simply has not arrived. Neither is a failure worth giving
      // up on, so fall back to the load event rather than to the blur.
      if (image.complete && image.naturalWidth > 0) return reveal()
      listening = true
      image.addEventListener('load', reveal, { once: true })
    })

    return () => {
      if (listening) image.removeEventListener('load', reveal)
    }
  }, [mounted, ref])

  return ready
}
