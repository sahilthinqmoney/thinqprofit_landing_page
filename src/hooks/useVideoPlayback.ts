import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * How long a revealed clip may sit on the same frame before it is treated as
 * frozen. Two seconds is long enough to survive a brief rebuffer and short
 * enough that nobody reads the result as a still photograph.
 */
const STALL_TIMEOUT_MS = 2_000

/** How often the watchdog looks. */
const STALL_POLL_MS = 500

export interface VideoPlayback {
  ref: React.RefObject<HTMLVideoElement | null>
  /** True only while frames are actually being presented. */
  playing: boolean
  /** Call when the clip is unmounted, so a remount does not start revealed. */
  reset: () => void
  /** Spread onto the `<video>`. */
  handlers: {
    onCanPlay: () => void
    onPlaying: () => void
    onPause: () => void
    onError: () => void
  }
}

/**
 * Reveals a clip only while it is genuinely playing.
 *
 * The rule this replaces was "reveal on `canplaythrough`, then call `play()`",
 * and it had two failure modes that both look identical to a reader — a still
 * picture where a moving one was promised:
 *
 *  1. **It revealed before it knew.** `play()` returns a promise, and on a
 *     phone it is refused often: iOS Low Power Mode blocks autoplay outright,
 *     Android battery savers do the same, and any engine may refuse under its
 *     autoplay policy. The old code showed the clip and faded the poster out
 *     *first*, then swallowed the rejection — leaving the reader looking at a
 *     frozen first frame with the real still already gone.
 *  2. **`canplaythrough` is not reliable on mobile.** iOS Safari treats
 *     `preload="auto"` as a suggestion and frequently never fires it at all, so
 *     the clip was never revealed however well it could have played.
 *
 * So playback is now attempted at `canplay` — which mobile does fire — and the
 * clip is revealed only at `playing`, which is the one event that means frames
 * are reaching the screen. Anything that stops them (`pause`, `error`, a
 * refused `play()`, or a watchdog catching a clip stuck on one frame) puts the
 * still back. Every one of those is recoverable: a later `playing` reveals the
 * clip again, so a clip that recovers is not punished for having stalled.
 *
 * This is a deliberate departure from the original "reveal on `canplaythrough`
 * only" rule. That rule existed to stop a half-buffered clip being shown, and
 * `playing` plus the watchdog enforces the same thing by observation rather
 * than by prediction — it is evidence that the clip is running, not a forecast
 * that it will.
 */
export function useVideoPlayback(onPlay?: () => void): VideoPlayback {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const onPlayRef = useRef(onPlay)
  onPlayRef.current = onPlay

  // Ask to play as soon as there are frames to show. Never reveal here: this
  // only starts the attempt, and the attempt is allowed to fail.
  const onCanPlay = useCallback(() => {
    const video = ref.current
    if (!video || !video.paused) return
    void video.play().catch(() => {
      // Refused. `playing` never fires, so the still simply stays up — which
      // is a complete picture, and the only honest thing to show.
      setPlaying(false)
    })
  }, [])

  const onPlaying = useCallback(() => {
    setPlaying(true)
    onPlayRef.current?.()
  }, [])

  const stop = useCallback(() => setPlaying(false), [])

  // A clip can be `playing` by the engine's account and still not advance —
  // a decode that quietly gives up, a tab throttled to nothing. That reads as
  // a still image, so it is treated as one.
  useEffect(() => {
    if (!playing) return
    const video = ref.current
    if (!video) return

    let last = video.currentTime
    let stalledFor = 0

    const timer = window.setInterval(() => {
      if (video.paused) return
      if (video.currentTime === last) {
        stalledFor += STALL_POLL_MS
        if (stalledFor >= STALL_TIMEOUT_MS) setPlaying(false)
        return
      }
      last = video.currentTime
      stalledFor = 0
    }, STALL_POLL_MS)

    return () => window.clearInterval(timer)
  }, [playing])

  // Memoised for the same reason as `useMediaGate`: callers depend on this
  // object in effects, and a new identity every render re-runs them.
  return useMemo(
    () => ({
      ref,
      playing,
      // Unmounting the clip must clear this, or a remount starts out claiming
      // to be playing and reveals an element with nothing decoded in it yet.
      reset: stop,
      handlers: { onCanPlay, onPlaying, onPause: stop, onError: stop },
    }),
    [playing, stop, onCanPlay, onPlaying],
  )
}
