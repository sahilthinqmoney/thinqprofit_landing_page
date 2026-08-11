import { useEffect, useRef, useState } from 'react'
import MediaSection from '../ui/MediaSection'
import { theGap } from '../../data/theGap'
import { lqipFor } from '../../data/lqip'
import { MEDIA_DEADLINE_MS, useMediaGate } from '../../hooks/useMediaGate'

/**
 * §3 — the gap between a move happening and the reader seeing it.
 *
 * The page's one deep section: two timestamps as the headline, the arithmetic
 * underneath, and a flip clock running beside them. No CTA — the hero already
 * carries the page's single ask, and a second one here would interrupt the only
 * section making an argument rather than requesting something.
 *
 * The copy names no instrument, price or direction, which is what keeps it
 * inside docs/art-direction.md §2.1: a clock is not market data, and the moment
 * this section names a symbol it becomes an invented trade.
 */
export default function TheGap() {
  return (
    <MediaSection
      id="the-gap"
      className="isolate"
      height="tall"
      place="left"
      anchor="center"
      scrim={0}
      measure="13em"
      headline={theGap.heading}
      body={theGap.lead}
      bgAmbient={<AmbientWash />}
      aside={<FlipClock />}
      media={{ alt: 'Feature Focus' }}
    >
      <p className="mt-8 text-lg sm:text-xl font-medium text-fg tracking-tight">
        {theGap.closer}
      </p>
    </MediaSection>
  )
}

/** Full-bleed teal wash bleeding in from the left edge, behind everything. */
function AmbientWash() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden"
    >
      <div
        className="h-full w-[65vw] max-w-[950px] opacity-85 blur-[130px]"
        style={{
          background:
            'radial-gradient(ellipse at 0% 50%, rgba(8, 45, 54, 0.85) 0%, rgba(8, 45, 54, 0.4) 45%, rgba(8, 45, 54, 0.1) 75%, transparent 100%)',
        }}
      />
    </div>
  )
}

/**
 * Feathers the clip to an ellipse. The stops are tuned so the fully-opaque core
 * covers only the clock itself — pull them wider and the clip's black ground
 * starts reading as a plate again on any engine that ignores the blend.
 */
const FLIP_CLOCK_MASK =
  'radial-gradient(ellipse 58% 66% at 50% 48%, #000 26%, rgba(0,0,0,0.42) 56%, transparent 82%)'

/**
 * Applied once, to the box — not to each rung.
 *
 * `mix-blend-screen` goes on the box for the same reason. A blend mode on every
 * layer composites each one against the *page*, so two layers that are both on
 * screen add together rather than covering one another, and the still and the
 * clip showed through each other as a double exposure. On the box, the rungs
 * composite normally amongst themselves and the finished stack is screened onto
 * the section once.
 */
const FLIP_CLOCK_BOX_STYLE: React.CSSProperties = {
  WebkitMaskImage: FLIP_CLOCK_MASK,
  maskImage: FLIP_CLOCK_MASK,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
}

const FLIP_CLOCK_POSTER = '/clips/flip-clock-poster.webp'

/** Matches every other cross-fade on the page. */
const CROSS_FADE_MS = 300

/**
 * The box the clock lives in. It carries the sizing and the hover transform that
 * used to sit on the `<video>`, because the box now outlives any one rung: the
 * placeholder, the still and the clip all fill it in turn and none of them may
 * change its height on arrival. The ratio is the clip's own 16:9.
 */
const CLOCK_BOX =
  'relative w-full aspect-[16/9] max-h-[520px] sm:max-h-[680px] md:max-h-[850px] lg:max-h-[960px] scale-125 sm:scale-130 md:scale-110 translate-x-0 md:translate-x-3 transition-all duration-700 group-hover:scale-135 pointer-events-none opacity-95 mix-blend-screen'

/**
 * The clock, masked to an ellipse so it dissolves into the ground rather than
 * sitting in a visible box. Decorative and silent, so it is not exposed to
 * assistive tech and carries no controls.
 */
function FlipClock() {
  const gate = useMediaGate(MEDIA_DEADLINE_MS.belowFold, true)
  const posterRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [posterReady, setPosterReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  const mountPoster = posterReady || gate.started

  // A clip already playing survives a network dip — those bytes are spent — but
  // not a Reduce Motion request, which is about the motion rather than the data.
  const keepPlaying = videoReady && !gate.motionRefused
  const mountVideo = !gate.motionRefused && (keepPlaying || (gate.videoAllowed && gate.started))

  /** The clip is only the visible rung while it is actually mounted. */
  const videoActive = mountVideo && videoReady

  // If the clip is dropped, forget it was ready so the still comes back up
  // rather than both fading out and leaving the box empty.
  useEffect(() => {
    if (!mountVideo && videoReady) setVideoReady(false)
  }, [mountVideo, videoReady])

  useEffect(() => {
    if (!mountPoster) return
    const poster = posterRef.current
    if (!poster) return

    let cancelled = false
    const reveal = () => {
      if (cancelled) return
      setPosterReady(true)
      if (!gate.videoAllowed) gate.settle()
    }
    poster.decode().then(reveal, () => {
      if (poster.complete && poster.naturalWidth > 0) reveal()
    })
    return () => {
      cancelled = true
    }
  }, [mountPoster, gate])

  const handleVideoReady = () => {
    setVideoReady(true)
    gate.settle()
    videoRef.current?.play().catch(() => {
      // Autoplay refused. The poster underneath is already the whole picture.
    })
  }

  return (
    <div
      ref={gate.ref}
      className="relative group flex items-center justify-center md:justify-end w-full mx-auto md:ml-auto"
    >
      {/* One box, three rungs stacked in it. The clip's own frame sets the
          height, so the placeholder carries the same 16:9 the encode does and
          nothing moves when a rung lands. */}
      <div className={CLOCK_BOX} style={FLIP_CLOCK_BOX_STYLE}>
        {/* Rung 1 — inline, painted before any request exists. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 h-full w-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${lqipFor(FLIP_CLOCK_POSTER) ?? ''}")`,
            filter: 'blur(6px)',
            opacity: posterReady || videoActive ? 0 : 1,
            transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
          }}
        />

        {/* Rung 2 — the still, on every tier. It hands off when the clip is
            ready: holding it lit underneath a moving clip left two different
            frames of the same clock on screen at once. */}
        {mountPoster && (
          <img
            ref={posterRef}
            src={FLIP_CLOCK_POSTER}
            alt=""
            width={1280}
            height={720}
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: posterReady && !videoActive ? 1 : 0,
              transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
            }}
          />
        )}

        {/* Rung 3 — the clip, only where the tier allows one. */}
        {mountVideo && (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onCanPlayThrough={handleVideoReady}
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: videoActive ? 1 : 0,
              transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
            }}
          >
            <source src="/clips/flip-clock.webm" type="video/webm" />
          </video>
        )}
      </div>
    </div>
  )
}
