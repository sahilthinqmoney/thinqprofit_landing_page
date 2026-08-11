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
  /** Callback ref — attach it to the `<video>`. */
  ref: (node: HTMLVideoElement | null) => void
  /** True only while frames are actually being presented. */
  playing: boolean
  /** Call when the clip is unmounted, so a remount does not start revealed. */
  reset: () => void
  /** Spread onto the `<video>`. */
  handlers: {
    onLoadedMetadata: () => void
    onCanPlay: () => void
    onPlaying: () => void
    onPause: () => void
    onError: () => void
  }
}

/**
 * Starts a clip and reveals it only while it is genuinely playing.
 *
 * ── Why playback is asked for more than once ───────────────────────────────
 *
 * This used to start playback from `canplay` alone, and on a real iPhone that
 * deadlocks. **iOS ignores `preload`**: it will not buffer media without a
 * reason to, so `canplay` — which needs buffered data — never fires. We were
 * waiting for `canplay` before calling `play()`, and iOS was waiting for
 * `play()` before loading enough to fire `canplay`. Neither moved, and the
 * reader kept the poster for the whole visit.
 *
 * It is invisible in testing, because desktop WebKit (what Playwright drives,
 * even under an iPhone device profile) honours `preload="auto"`, buffers
 * happily and fires `canplay`. Only the real phone deadlocks.
 *
 * So playback is now requested the moment the element exists, again at
 * `loadedmetadata` — which iOS does fire — and again at `canplay`. Asking more
 * than once is free: `play()` on an already-playing element resolves without
 * doing anything.
 *
 * ── Why the reveal is separate from the request ────────────────────────────
 *
 * The clip is revealed only at `playing`, the one event that means frames are
 * reaching the screen. Before, `videoReady` was set and the poster faded out
 * *before* `play()` was known to have succeeded, and `play()` is refused often
 * on phones — iOS Low Power Mode blocks autoplay outright, as do Android
 * battery savers. That left the reader looking at a frozen first frame with the
 * real still already gone.
 *
 * Anything that stops the frames — `pause`, `error`, a refused `play()`, or the
 * watchdog catching a clip stuck on one frame — puts the still back. All of it
 * is recoverable: a later `playing` reveals the clip again.
 */
export function useVideoPlayback(onPlay?: () => void): VideoPlayback {
  const node = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const onPlayRef = useRef(onPlay)
  onPlayRef.current = onPlay

  /** Ask to play. Never reveals — the attempt is allowed to fail. */
  const request = useCallback(() => {
    const video = node.current
    if (!video || !video.paused) return
    void video.play().catch(() => {
      // Refused. `playing` never fires, so the still simply stays up — which is
      // a complete picture, and the only honest thing to show.
      setPlaying(false)
    })
  }, [])

  const ref = useCallback(
    (el: HTMLVideoElement | null) => {
      node.current = el
      if (!el) return
      /*
       * iOS decides whether an inline clip may autoplay by looking at the
       * ATTRIBUTES, and React sets `muted` as a DOM property only. A video that
       * is muted by property but not by attribute is treated as unmuted, and an
       * unmuted autoplay is refused outright.
       */
      el.setAttribute('muted', '')
      el.setAttribute('playsinline', '')
      el.muted = true
      // The first request, before any event has had to fire. This is what
      // breaks the iOS deadlock: it gives the phone the reason to load.
      request()
    },
    [request],
  )

  const onPlaying = useCallback(() => {
    setPlaying(true)
    onPlayRef.current?.()
  }, [])

  const stop = useCallback(() => setPlaying(false), [])

  // A clip can be `playing` by the engine's account and still not advance — a
  // decode that quietly gives up, a tab throttled to nothing. That reads as a
  // still image, so it is treated as one.
  useEffect(() => {
    if (!playing) return
    const video = node.current
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
      handlers: {
        onLoadedMetadata: request,
        onCanPlay: request,
        onPlaying,
        onPause: stop,
        onError: stop,
      },
    }),
    [ref, playing, stop, request, onPlaying],
  )
}
