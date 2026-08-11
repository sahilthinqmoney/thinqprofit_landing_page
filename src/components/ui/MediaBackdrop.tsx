import { useEffect, useRef, useState } from 'react'
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
  const clip = useVideoPlayback(gate.settle)

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
            transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
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
            transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        />
      )}

      {/* Rung 3 — the clip. Mounted only on a tier that allows it, which is why
          it can carry `preload="auto"`: the gate, not the attribute, is what
          decides whether these bytes are ever requested. */}
      {mountVideo && (
        <video
          ref={clip.ref}
          loop
          muted
          playsInline
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
