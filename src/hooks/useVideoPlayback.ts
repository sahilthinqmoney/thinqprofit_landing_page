import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * How long a revealed clip may sit on the same frame before it is treated as
 * frozen. Two seconds is long enough to survive a brief rebuffer and short
 * enough that nobody reads the result as a still photograph.
 */
const STALL_TIMEOUT_MS = 2_000

/** How often the watchdog looks. */
const STALL_POLL_MS = 500

/** Safari, and only Safari, plays HLS without a library. */
const HLS_MIME = 'application/vnd.apple.mpegurl'

/**
 * How hls.js is tuned for a short decorative loop.
 *
 * `capLevelToPlayerSize` is the important one: it refuses any rendition larger
 * than the element is actually drawn at, so a phone never fetches the 1080p
 * variant however fast its connection is. Bandwidth and screen size both get a
 * say, which is what a fixed per-device file could never do.
 *
 * The buffers are deliberately short. This clip is 17.8s and loops; buffering
 * far ahead spends the reader's data on a backdrop and delays the first frame,
 * and there is no seeking to serve.
 */
const HLS_CONFIG = {
  capLevelToPlayerSize: true,
  startLevel: -1,
  // Until throughput has been measured, assume something modest rather than
  // opening on the largest variant and stalling.
  abrEwmaDefaultEstimate: 800_000,
  maxBufferLength: 12,
  backBufferLength: 8,
  enableWorker: true,
  lowLatencyMode: false,
}

export interface VideoPlaybackOptions {
  /** Called the first time frames reach the screen. */
  onPlay?: () => void
  /** An HLS master playlist. Preferred over the element's `<source>` children. */
  hls?: string
  /** Called when HLS cannot be used, so the caller can fall back to MP4. */
  onHlsUnavailable?: () => void
}

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
 * Starts a clip, adapts its quality to the connection, and reveals it only
 * while it is genuinely playing.
 *
 * ── Adaptive quality ───────────────────────────────────────────────────────
 *
 * Given an `hls` playlist, the clip is delivered as HLS and the player chooses
 * a rendition per two-second segment from measured throughput and buffer
 * health, switching mid-playback at segment boundaries. A switch costs no
 * restart and no visible seam because every segment starts on a keyframe and
 * the renditions share a timeline.
 *
 * Safari does this natively, so it never loads a byte of library. Everything
 * else imports hls.js **dynamically, and only once the gate has decided this
 * reader is getting video at all** — even the light build is ~100 KB
 * compressed, comparable to this page's entire bundle, and it must never sit in
 * the critical path for a reader who will only ever see the poster.
 *
 * If HLS cannot be set up, `onHlsUnavailable` lets the caller fall back to the
 * plain MP4 renditions, which remain a complete answer on their own.
 *
 * ── Why playback is asked for more than once ───────────────────────────────
 *
 * This used to start playback from `canplay` alone, and on a real iPhone that
 * deadlocks. **iOS ignores `preload`**: it will not buffer media without a
 * reason to, so `canplay` — which needs buffered data — never fires. We were
 * waiting for `canplay` before calling `play()`, and iOS was waiting for
 * `play()` before loading enough to fire `canplay`. Neither moved, and the
 * reader kept the poster for the whole visit. It is invisible in testing,
 * because desktop WebKit honours `preload="auto"` and fires `canplay` happily.
 *
 * ── Why the reveal is separate from the request ────────────────────────────
 *
 * The clip is revealed only at `playing`, the one event that means frames are
 * reaching the screen. Before, the poster faded out *before* `play()` was known
 * to have succeeded, and `play()` is refused often on phones — iOS Low Power
 * Mode blocks autoplay outright, as do Android battery savers. That left the
 * reader looking at a frozen first frame with the real still already gone.
 *
 * Anything that stops the frames — `pause`, `error`, a refused `play()`, or the
 * watchdog catching a clip stuck on one frame — puts the still back, and all of
 * it is recoverable: a later `playing` reveals the clip again.
 */
export function useVideoPlayback(options: VideoPlaybackOptions = {}): VideoPlayback {
  const node = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const optionsRef = useRef(options)
  optionsRef.current = options

  /** The live hls.js instance, so it can be torn down with the element. */
  const engine = useRef<{ destroy: () => void } | null>(null)
  /** True while the element is playing an HLS playlist set as a plain `src`. */
  const nativeHls = useRef(false)
  /** Set once frames have reached the screen, so a late error is not a start failure. */
  const everPlayed = useRef(false)

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

  /**
   * The library path. Also the escalation target when the platform claimed it
   * could play a playlist and then could not.
   */
  const attachLibrary = useCallback(
    async (video: HTMLVideoElement, src: string) => {
      try {
        // The light build: no subtitles, no alternate audio, no DRM. A muted
        // decorative backdrop needs none of them, and it is a third smaller.
        const { default: Hls } = await import('hls.js/light')
        if (!Hls.isSupported() || node.current !== video) {
          optionsRef.current.onHlsUnavailable?.()
          return
        }
        const hls = new Hls(HLS_CONFIG)
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal) return
          hls.destroy()
          if (engine.current === hls) engine.current = null
          // A fatal streaming error is not a dead end: the MP4 renditions are
          // still there and still complete.
          optionsRef.current.onHlsUnavailable?.()
        })
        hls.on(Hls.Events.MANIFEST_PARSED, () => request())
        hls.loadSource(src)
        hls.attachMedia(video)
        engine.current = hls
      } catch {
        optionsRef.current.onHlsUnavailable?.()
      }
    },
    [request],
  )

  const attachHls = useCallback(
    (video: HTMLVideoElement, src: string) => {
      /*
       * Native first where the platform says it can — Safari genuinely can, and
       * it is the whole reason an iPhone never downloads the library.
       *
       * But `canPlayType` is only ever a hint, and for this MIME type it is a
       * famously weak one: measured, Chromium answers "maybe" for
       * application/vnd.apple.mpegurl. So the answer is treated as a claim to be
       * tested rather than a fact — `escalate` below moves to the library if the
       * element errors before it has shown a single frame.
       */
      if (video.canPlayType(HLS_MIME)) {
        nativeHls.current = true
        video.src = src
        request()
        return
      }
      void attachLibrary(video, src)
    },
    [attachLibrary, request],
  )

  const ref = useCallback(
    (el: HTMLVideoElement | null) => {
      if (!el) {
        engine.current?.destroy()
        engine.current = null
        node.current = null
        return
      }
      node.current = el
      nativeHls.current = false
      everPlayed.current = false
      /*
       * iOS decides whether an inline clip may autoplay by looking at the
       * ATTRIBUTES, and React sets `muted` as a DOM property only. A video that
       * is muted by property but not by attribute is treated as unmuted, and an
       * unmuted autoplay is refused outright.
       */
      el.setAttribute('muted', '')
      el.setAttribute('playsinline', '')
      el.muted = true

      const { hls } = optionsRef.current
      if (hls) void attachHls(el, hls)
      // The first request, before any event has had to fire. This is what
      // breaks the iOS deadlock: it gives the phone the reason to load.
      request()
    },
    [attachHls, request],
  )

  const onPlaying = useCallback(() => {
    everPlayed.current = true
    setPlaying(true)
    optionsRef.current.onPlay?.()
  }, [])

  const stop = useCallback(() => setPlaying(false), [])

  /**
   * The element failed. If that happened on a natively-claimed playlist before
   * anything had played, the claim was wrong — try the library instead of
   * leaving the reader on the poster with a working clip one step away.
   */
  const onError = useCallback(() => {
    setPlaying(false)
    const video = node.current
    const { hls } = optionsRef.current
    if (!video || !hls || !nativeHls.current || everPlayed.current) return
    nativeHls.current = false
    video.removeAttribute('src')
    video.load()
    void attachLibrary(video, hls)
  }, [attachLibrary])

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

  // Tear the engine down with the component, not only with the element: a
  // detached hls.js keeps its worker and its timers.
  useEffect(
    () => () => {
      engine.current?.destroy()
      engine.current = null
    },
    [],
  )

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
        onError,
      },
    }),
    [ref, playing, stop, request, onPlaying, onError],
  )
}
