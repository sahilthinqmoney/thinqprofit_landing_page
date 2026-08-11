import { useCallback, useEffect, useRef, useState } from 'react'
import { lqipFor } from '../../data/lqip'
import { IN_VIEW_MARGIN } from '../../hooks/useInView'
import { MEDIA_DEADLINE_MS, useMediaGate } from '../../hooks/useMediaGate'

/** Matches the backdrop's fade, so every rung on the page resolves alike. */
const CROSS_FADE_MS = 300

interface ProgressiveImageProps {
  src: string
  alt: string
  /** The file's own pixels. Used to hold the box, not to size it on screen. */
  width: number
  height: number
  /**
   * `true` when an already-sized parent owns the box — the placeholder then
   * simply fills it. `false` when this element is what gives the box its
   * height, in which case the intrinsic ratio above is what reserves it.
   */
  fill?: boolean
  className?: string
  /** Applies to the picture itself: object-fit, blend mode, hover transforms. */
  imageClassName?: string
  /** Handed the wrapper, so callers can animate the whole stack as one. */
  elementRef?: React.Ref<HTMLDivElement>
}

/**
 * An image that is never absent and never half-drawn.
 *
 * The blurred placeholder is inline in the bundle, so it is in the box on the
 * first paint — before any request has been made, and whether or not one ever
 * succeeds. The real file is requested only once the element is near the
 * viewport, and is faded in only after `decode()` resolves, so it arrives whole
 * rather than painting in bands.
 *
 * If the deadline passes or the reader scrolls away mid-load, the request is
 * dropped and the placeholder is simply what this image is. That is a finished
 * state, not a failure — which is why nothing here retries.
 */
export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  imageClassName = '',
  elementRef,
}: ProgressiveImageProps) {
  const gate = useMediaGate(MEDIA_DEADLINE_MS.belowFold, false, IN_VIEW_MARGIN.image)
  const imageRef = useRef<HTMLImageElement>(null)
  const [ready, setReady] = useState(false)
  const placeholder = lqipFor(src)

  // The wrapper is both the gate's observation target and, for callers that
  // animate it, their handle — so both refs are set from one callback.
  const setWrapper = useCallback(
    (node: HTMLDivElement | null) => {
      gate.ref.current = node
      if (typeof elementRef === 'function') elementRef(node)
      else if (elementRef) (elementRef as React.RefObject<HTMLDivElement | null>).current = node
    },
    [gate.ref, elementRef],
  )

  // Once decoded it stays; otherwise it follows the gate, so a paused
  // attempt drops the request and a later one can pick it up again.
  const mounted = ready || gate.started

  useEffect(() => {
    if (!mounted) return
    const image = imageRef.current
    if (!image) return

    let cancelled = false
    const reveal = () => {
      if (cancelled) return
      setReady(true)
      gate.settle()
    }

    image.decode().then(reveal, () => {
      if (image.complete && image.naturalWidth > 0) reveal()
    })

    return () => {
      cancelled = true
    }
  }, [mounted, gate])

  return (
    <div
      ref={setWrapper}
      className={`${fill ? 'absolute inset-0' : 'relative w-full'} ${className}`}
      style={fill ? undefined : { aspectRatio: `${width} / ${height}` }}
    >
      {placeholder && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full bg-contain bg-center bg-no-repeat ${imageClassName}`}
          style={{
            backgroundImage: `url("${placeholder}")`,
            // Hides the upscale from ~20px without letting it read as broken.
            filter: 'blur(6px)',
            opacity: ready ? 0 : 1,
            transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        />
      )}

      {mounted && (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full ${imageClassName}`}
          style={{
            opacity: ready ? 1 : 0,
            transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        />
      )}
    </div>
  )
}
