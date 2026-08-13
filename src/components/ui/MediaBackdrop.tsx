import { useCallback, useEffect, useRef, useState } from 'react'
import { MEDIA_DEADLINE_MS, useMediaGate } from '../../hooks/useMediaGate'
import { useImageReveal } from '../../hooks/useImageReveal'
import { useVideoPlayback } from '../../hooks/useVideoPlayback'

export interface ImageSources {
  mobile?: string
  tablet?: string
  desktop: string
  wide?: string
}

export interface VideoSources {
  /**
   * For phones. Smaller than `mp4`, but not by so much that it looks it.
   *
   * A phone shows this clip in a PORTRAIT box against a 16:9 source, so
   * `object-cover` scales it up about twice over — resolution matters more here
   * than the viewport size suggests, not less. An earlier 960x540 encode
   * measured 32.2 dB at the size a phone actually renders, against 36.5 dB for
   * 1280x720; that 4.3 dB is the difference between "soft" and "fine".
   */
  mobile?: string
  /**
   * For links that cannot afford either of the above.
   *
   * Kept as a third rung rather than folded into `mobile`, because those two
   * answer different questions. `mobile` is about screen size, this is about
   * bandwidth, and collapsing them means either phones get a soft clip or weak
   * links get one that never finishes arriving — the two complaints that
   * produced this ladder in the first place.
   */
  light?: string
  /**
   * An HLS master playlist — the adaptive path, and the preferred one.
   *
   * The fixed encodes below stay as the fallback. They are not dead weight:
   * they are what plays if the playlist or the player cannot be loaded, and
   * they are what a browser with no MSE and no native HLS gets.
   */
  hls?: string
  webm?: string
  mp4: string
}

export type Focus = 'left' | 'right' | 'center'

interface MediaBackdropProps {
  alt: string
  image?: ImageSources | string
  video?: VideoSources | string
  poster?: string
  /** Inline blurred thumbnail, base64. Painted immediately; never fetched. */
  lqip?: string
  tone?: string
  focus?: Focus
  blur?: boolean
  className?: string
  /** How long this backdrop may spend climbing before it holds where it is. */
  deadlineMs?: number
  /**
   * This backdrop is in the first viewport and is the page's largest paint.
   *
   * It skips the viewport gate for its still — the gate exists to avoid
   * fetching what may never be seen, and this is seen by definition — so the
   * `<img>` is present in the prerendered HTML and starts downloading from the
   * markup rather than waiting for React, an IntersectionObserver and a state
   * update. The still is also shown as soon as it decodes rather than being
   * faded in, because a cross-fade here would need JavaScript to start it and
   * would hold the reader on the placeholder until it did.
   */
  priority?: boolean
}

/** Every rung fades in over this. A hard swap reads as a glitch, not a load. */
const CROSS_FADE_MS = 300

/**
 * Above this, a viewport is a laptop and gets the full encode.
 *
 * Phones are the case the light encode exists for: the hero box is portrait
 * there, so a 16:9 clip is already scaled up about three times under a scrim,
 * and the resolution it was authored at buys nothing while the bytes cost real
 * seconds on a phone connection.
 */
const COMPACT_VIEWPORT = '(max-width: 768px)'

/** Tracks a media query without reading `window` during render. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * The page's full-bleed backdrop, loaded as a three-rung ladder:
 *
 *   1. LQIP    — a ~20px blurred thumbnail, inlined in the bundle. It is in the
 *                box on first paint, so the section is never an empty hole.
 *   2. poster  — the real still. Loads on every device tier.
 *   3. video   — the clip. Only on a tier that allows it.
 *
 * A rung is only ever revealed once it is completely ready: `decode()` for the
 * still, `canplaythrough` for the clip. Neither `load` nor `loadeddata` is
 * enough — both fire while there is still visibly nothing, or not enough, to
 * show, and a backdrop that appears half-drawn is worse than one that is
 * honestly still a blur.
 *
 * If the deadline passes, the ladder stops on whatever rung it reached and
 * stays there. There is no retry and no second look at the connection.
 */
export default function MediaBackdrop({
  alt,
  image,
  video,
  poster,
  lqip,
  blur = false,
  className = '',
  deadlineMs = MEDIA_DEADLINE_MS.belowFold,
  priority = false,
}: MediaBackdropProps) {
  const gate = useMediaGate(deadlineMs, Boolean(video))
  const posterRef = useRef<HTMLImageElement>(null)
  const compact = useMediaQuery(COMPACT_VIEWPORT)

  /*
   * HLS is tried first and the fixed encodes are the fallback, so this starts
   * true and only ever goes false. Rendering no `<source>` children while HLS
   * is in play is deliberate — a child source would be fetched before the
   * playlist could take over, and the reader would pay for the clip twice.
   */
  const [hlsFailed, setHlsFailed] = useState(false)
  const onHlsUnavailable = useCallback(() => setHlsFailed(true), [])

  /*
   * One encode, chosen before the element mounts — the gate has not started on
   * the first render — so no `<source>` is ever swapped under a live video,
   * which would not reload it anyway.
   *
   * Bandwidth is asked first and screen size second: a 3g-class link on a
   * laptop still cannot afford the full clip, and a phone on good WiFi should
   * not be punished with the smallest one.
   */
  const sources = typeof video === 'string' ? null : video

  /*
   * Adaptive when we can be. The tier still decides whether a clip is loaded at
   * all — a reader on Save-Data or a 2g link is asking for no video, and no
   * amount of adapting answers that — but once video is allowed, HLS picks the
   * rendition per segment from measured throughput instead of us guessing from
   * `effectiveType`, and revises it as the connection changes.
   */
  /*
   * Slow links stay off the adaptive path entirely and take the fixed light
   * encode. The adaptive ladder's floor is 720p — the 540p rung was removed
   * because a loop resets the ladder to its lowest rung every 17.8s, so the
   * floor is what a reader mostly sees — and 720p at ~1.2 Mbps is more than a
   * 3g link can hold. A guaranteed 0.9 MB file beats a stream that stalls.
   */
  const hlsSrc = !hlsFailed && !gate.lightMedia ? sources?.hls : undefined

  /** The fallback ladder, used when HLS is unavailable or refused. */
  const chosenMp4 =
    (gate.lightMedia && sources?.light) || (compact && sources?.mobile) || sources?.mp4

  const clip = useVideoPlayback({
    onPlay: gate.settle,
    hls: hlsSrc,
    onHlsUnavailable,
  })

  /** The still to show: an explicit poster, else the plain image prop. */
  const still = poster ?? (typeof image === 'string' ? image : image?.desktop)

  // A rung that has already been asked for stays mounted, because taking a
  // picture back off the screen is the one thing worse than never showing it —
  // and an element unmounted mid-decode can never finish decoding, which left
  // readers on the blurred placeholder for good.
  //
  // A priority still is mounted from the start: it is in the first viewport, so
  // there is nothing for the gate to decide and nothing gained by making the
  // request wait for JavaScript to run.
  const [asked, setAsked] = useState(false)
  useEffect(() => {
    if (gate.started) setAsked(true)
  }, [gate.started])

  const mountStill = Boolean(still) && (priority || asked)

  // Reveal the still only once the pixels are decoded and ready to paint.
  const posterReady = useImageReveal(mountStill, posterRef, () => {
    // If this device is never getting the clip, the still is the top rung.
    if (!gate.videoAllowed) gate.settle()
  })

  // A clip already playing survives a network dip — those bytes are spent and
  // stopping it would help nobody — but not a Reduce Motion request, which is
  // about the motion rather than the bandwidth.
  const keepPlaying = clip.playing && !gate.motionRefused
  const mountVideo =
    Boolean(video) && !gate.motionRefused && (keepPlaying || (gate.videoAllowed && gate.started))

  /** The clip is the visible rung only while it is genuinely running. */
  const videoActive = mountVideo && clip.playing

  // If the clip is dropped, forget it was playing so the still comes back up
  // rather than both fading out and leaving the box empty.
  useEffect(() => {
    if (!mountVideo) clip.reset()
  }, [mountVideo, clip])

  return (
    <div
      ref={gate.ref}
      aria-hidden="true"
      aria-label={alt}
      className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
      style={{ backgroundColor: '#070709', zIndex: -999 }}
    >
      {/* Rung 1 — always present, never fetched. It fades once a real rung is
          up: left at full opacity it is a second full-bleed layer, blurred,
          composited on every frame for the life of the page. */}
      {lqip && (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center origin-top"
          style={{
            backgroundImage: `url("${lqip}")`,
            // The thumbnail is ~20px wide; the blur hides the upscale rather
            // than letting it read as a broken image.
            filter: 'blur(24px)',
            transform: 'scale(1.12)',
            opacity: posterReady || videoActive ? 0 : 1,
            // Held, then cut — the same asymmetry as the still above, for the
            // same reason. A non-priority still fades 0->1 while this fades
            // 1->0, and those two do not add up to a covered frame; the ground
            // shows through the middle of the crossfade. Nothing is lost by
            // leaving the placeholder lit underneath an opaque layer for one
            // more fade, and it costs a composite for 300ms rather than for
            // the life of the page.
            transition:
              posterReady || videoActive
                ? `opacity 0ms linear ${CROSS_FADE_MS}ms`
                : `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        />
      )}

      {/* Rung 2 — the real still. */}
      {mountStill && (
        <img
          ref={posterRef}
          src={still}
          alt=""
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          className="absolute inset-0 h-full w-full object-cover scale-[1.08] origin-top"
          style={{
            // Hands off once the clip is running, and comes back if the clip is
            // ever dropped. The clip is opaque here so nothing shows through,
            // but leaving a second full-bleed layer lit underneath it is a
            // composite the compositor pays for every frame.
            //
            // A priority still is simply opaque. Starting it at 0 and waiting
            // for `decode()` to raise it would mean the largest paint on the
            // page could not appear until React had mounted — which is the one
            // thing this backdrop must not depend on. The browser does not
            // paint a half-decoded image anyway, so nothing is lost by letting
            // it arrive on its own; the placeholder beneath still fades out.
            opacity: videoActive ? 0 : priority || posterReady ? 1 : 0,
            // Asymmetric on purpose, and this is the fix for a dark flash on
            // load that was worst on iPhone.
            //
            // Fading this out over the same window the clip fades in does NOT
            // hold the frame covered. Stacked alpha does not sum to 1:
            // `cover = 1 - (1-still)(1-clip)`, which at the midpoint is
            // 1 - 0.5*0.5 = 0.75 — a quarter of the #070709 ground behind both
            // layers showing through for the length of the crossfade. Measured
            // in WebKit at iPhone width: coverage fell to 0.751 between 492ms
            // and 681ms, which reads as the backdrop blinking dark mid-load.
            //
            // So the still does not cross-fade at all. It holds at full opacity
            // beneath the clip for the whole fade-in and is cut afterwards, by
            // which point the clip is opaque and covering it — a 0ms change
            // behind an opaque layer is invisible. Coming back (the clip was
            // dropped) still fades normally, because there the still IS the
            // thing being revealed.
            transition: videoActive
              ? `opacity 0ms linear ${CROSS_FADE_MS}ms`
              : `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        />
      )}

      {/* Rung 3 — the clip. Mounted only on a tier that allows it, which is why
          it can carry `preload="auto"` and `autoPlay`: the gate, not the
          attributes, is what decides whether these bytes are ever requested.
          `autoPlay` is not decoration — iOS ignores `preload`, so without a
          declared intent to play it never buffers, never fires `canplay`, and
          the clip that was waiting on `canplay` to start never starts. */}
      {mountVideo && (
        <video
          ref={clip.ref}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          {...clip.handlers}
          className="absolute inset-0 h-full w-full object-cover scale-[1.08] origin-top"
          style={{
            opacity: videoActive ? 1 : 0,
            transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        >
          {typeof video === 'string' ? (
            <source src={video} type="video/mp4" />
          ) : (
            <>
              {sources?.webm && <source src={sources.webm} type="video/webm" />}
              {!hlsSrc && chosenMp4 && <source src={chosenMp4} type="video/mp4" />}
            </>
          )}
        </video>
      )}

      {/* Optional Backdrop blur layer - rendered when blur is explicitly set */}
      {blur && (
        <div className="absolute inset-0 backdrop-blur-md backdrop-saturate-150 bg-black/35 pointer-events-none" />
      )}

      {/* Smooth Left & Right Edge Dark Falloff Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right, #070709 0%, rgba(7,7,9,0.4) 15%, transparent 35%, transparent 65%, rgba(7,7,9,0.4) 85%, #070709 100%)`,
        }}
      />

      {/* Subtle Ambient Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,5,0.15) 100%)`,
        }}
      />
    </div>
  )
}
