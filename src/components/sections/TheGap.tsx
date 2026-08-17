import { useEffect, useRef, useState } from 'react'
import MediaSection from '../ui/MediaSection'
import { theGap } from '../../data/theGap'
import { lqipFor } from '../../data/lqip'
import { MEDIA_DEADLINE_MS, useMediaGate } from '../../hooks/useMediaGate'
import { useImageReveal } from '../../hooks/useImageReveal'
import { useVideoPlayback } from '../../hooks/useVideoPlayback'

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

  // Once the still has been asked for it stays asked for. It used to unmount
  // again when the gate expired, and if the decode had not finished by then the
  // reader was left on the blurred placeholder with nothing coming.
  const [mountPoster, setMountPoster] = useState(false)
  useEffect(() => {
    if (gate.started) setMountPoster(true)
  }, [gate.started])

  const posterReady = useImageReveal(mountPoster, posterRef, () => {
    // If this device is never getting the clip, the still is the top rung.
    if (!gate.videoAllowed) gate.settle()
  })

  // A clip already playing survives a network dip — those bytes are spent — but
  // not a Reduce Motion request, which is about the motion rather than the data.
  const video = useVideoPlayback({ onPlay: gate.settle })
  const keepPlaying = video.playing && !gate.motionRefused
  const mountVideo = !gate.motionRefused && (keepPlaying || (gate.videoAllowed && gate.started))

  /** The clip is the visible rung only while it is genuinely running. */
  const videoActive = mountVideo && video.playing

  // If the clip is dropped, forget it was playing so the still comes back up
  // rather than both fading out and leaving the box empty.
  useEffect(() => {
    if (!mountVideo) video.reset()
  }, [mountVideo, video])

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
            ref={video.ref}
            loop
            muted
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            {...video.handlers}
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: videoActive ? 1 : 0,
              transition: `opacity ${CROSS_FADE_MS}ms ease-out`,
            }}
          >
            {/* WebM first: it is the encode that carries an alpha channel, and
                the engines that take it get the cleanest composite.
                The MP4 is for everything that cannot decode VP8 — which on a
                phone is not an edge case. Safari only gained WebM in 17.4, so
                every iPhone and iPad below that had no source it could play at
                all and sat on the still forever. H.264 carries no alpha, but
                nothing here depends on one: the elliptical mask and the screen
                blend on the box are what dissolve this clip into the page, and
                they were put there precisely because WebKit ignores both the
                alpha and the blend on a video. */}
            {/* MP4 first, deliberately. A browser takes the FIRST source it
                believes it can play, and Safari 17.4+ claims WebM — so on iOS
                it was choosing the 863 KB VP9 file over the smaller H.264 one
                and decoding VP9 in software, which costs both memory and
                battery on a device already close to its per-tab ceiling.
                Measured on an iOS profile: flip-clock.webm was fetched.
                Chrome and Firefox reach the WebM below and still get alpha;
                WebKit ignores the alpha and the blend on a video anyway, which
                is why the mask exists, so it loses nothing by taking H.264. */}
            <source src="/clips/flip-clock.mp4" type="video/mp4" />
            <source src="/clips/flip-clock.webm" type="video/webm" />
          </video>
        )}
      </div>
    </div>
  )
}
