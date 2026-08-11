import { useEffect, useRef, useState } from 'react'
import { MEDIA_DEADLINE_MS, useMediaGate } from '../../hooks/useMediaGate'

export interface ImageSources {
  mobile?: string
  tablet?: string
  desktop: string
  wide?: string
}

export interface VideoSources {
  mobile?: string
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
}

/** Every rung fades in over this. A hard swap reads as a glitch, not a load. */
const CROSS_FADE_MS = 300

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
}: MediaBackdropProps) {
  const gate = useMediaGate(deadlineMs, Boolean(video))
  const posterRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [posterReady, setPosterReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  /** The still to show: an explicit poster, else the plain image prop. */
  const still = poster ?? (typeof image === 'string' ? image : image?.desktop)

  // A rung that has already been revealed stays mounted, because taking a
  // picture back off the screen is the one thing worse than never showing it.
  const mountStill = Boolean(still) && (posterReady || gate.started)

  // A clip already playing survives a network dip — those bytes are spent and
  // stopping it would help nobody — but not a Reduce Motion request, which is
  // about the motion rather than the bandwidth.
  const keepPlaying = videoReady && !gate.motionRefused
  const mountVideo =
    Boolean(video) && !gate.motionRefused && (keepPlaying || (gate.videoAllowed && gate.started))

  /** The clip is only the visible rung while it is actually mounted. */
  const videoActive = mountVideo && videoReady

  // If the clip is dropped, forget that it was ready so the still comes back up
  // rather than both fading out and leaving the box empty.
  useEffect(() => {
    if (!mountVideo && videoReady) setVideoReady(false)
  }, [mountVideo, videoReady])

  // Reveal the still only once the pixels are decoded and ready to paint.
  useEffect(() => {
    if (!mountStill) return
    const img = posterRef.current
    if (!img) return

    let cancelled = false
    const reveal = () => {
      if (cancelled) return
      setPosterReady(true)
      // If this device is never getting the clip, the still is the top rung.
      if (!gate.videoAllowed) gate.settle()
    }

    // `decode()` resolves after the bitmap is ready, so the cross-fade cannot
    // start against a frame the compositor has not got yet.
    img.decode().then(reveal, () => {
      // Decode can reject on a cached-but-not-yet-attached image; fall back to
      // the load event rather than leaving the reader on the blur forever.
      if (img.complete && img.naturalWidth > 0) reveal()
    })

    return () => {
      cancelled = true
    }
  }, [mountStill, gate])

  const handleVideoReady = () => {
    setVideoReady(true)
    gate.settle()
    videoRef.current?.play().catch(() => {
      // Autoplay refused. The still underneath is already a complete picture.
    })
  }

  return (
    <div
      ref={gate.ref}
      aria-hidden="true"
      aria-label={alt}
      className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
      style={{ backgroundColor: '#070709', zIndex: -999 }}
    >
      {/* Rung 1 — always present, never fetched. */}
      {lqip && (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center scale-[1.08] origin-top"
          style={{
            backgroundImage: `url("${lqip}")`,
            // The thumbnail is ~20px wide; the blur hides the upscale rather
            // than letting it read as a broken image.
            filter: 'blur(24px)',
            transform: 'scale(1.12)',
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
          className="absolute inset-0 h-full w-full object-cover scale-[1.08] origin-top"
          style={{
            // Hands off once the clip is running, and comes back if the clip is
            // ever dropped. The clip is opaque here so nothing shows through,
            // but leaving a second full-bleed layer lit underneath it is a
            // composite the compositor pays for every frame.
            opacity: posterReady && !videoActive ? 1 : 0,
            transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        />
      )}

      {/* Rung 3 — the clip. Mounted only on a tier that allows it, which is why
          it can carry `preload="auto"`: the gate, not the attribute, is what
          decides whether these bytes are ever requested. */}
      {mountVideo && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={handleVideoReady}
          className="absolute inset-0 h-full w-full object-cover scale-[1.08] origin-top"
          style={{
            opacity: videoReady ? 1 : 0,
            transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        >
          {typeof video === 'string' ? (
            <source src={video} type="video/mp4" />
          ) : (
            <>
              {video?.webm && <source src={video.webm} type="video/webm" />}
              {video?.mp4 && <source src={video.mp4} type="video/mp4" />}
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
