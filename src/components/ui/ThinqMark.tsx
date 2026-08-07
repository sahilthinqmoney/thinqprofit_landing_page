import { useId } from 'react'

/**
 * The Thinq brand mark — a ring with a diminishing trail, on a 24-unit grid.
 *
 * The mark is one abstract form: no letter, no chart, no arrow. That last one is
 * a constraint rather than a preference — bulls, rockets, arrows and ascending
 * candles are forbidden outright because they imply assured returns, and a
 * rising arrow two elements from a SEBI risk disclosure is a returns claim the
 * page disclaims in the same viewport.
 *
 * THE GEOMETRY IS FIXED. Dot spacing is set by EDGE GAP, not centre distance: an
 * earlier version left 1.7 units between dot edges, which renders under 1.5px at
 * bar size, below the threshold where the eye separates them — so the trail
 * fused into a line. Dropping from three dots to two is what let the survivors
 * spread far enough to stay discrete at favicon size. One geometry at every
 * size; `small` only thickens the ring's stroke.
 */
const VB = 24

/**
 * Gradient stops, and one vector per shape.
 *
 * `userSpaceOnUse`, not the default `objectBoundingBox`: a single bounding-box
 * ramp makes the ring sample only its own bbox — about 60% of the grid — so it
 * never reaches the second highlight at 88%. Two highlights are the whole
 * difference between struck metal and a plain gradient, so the mark looked rich
 * at 64px and flat at 22px, which is the size it is actually used at.
 *
 * A vector per shape means the full six-stop ramp plays across the ring AND the
 * trail at any size. Both share a light angle (dy = 0.85·dx) so they read as one
 * source.
 */
const OFFS = ['0%', '26%', '46%', '66%', '88%', '100%'] as const
const RING_VEC = { x1: 3, y1: 3, x2: 14.6, y2: 12.86 }
const TRAIL_VEC = { x1: 14.35, y1: 14.35, x2: 22.25, y2: 21.07 }

/**
 * The metal ramp: six stops, matching `.surface-copper` in index.css so every
 * metal surface on the page is lit by one light.
 *
 * `copper` and `steel` are BYTE-IDENTICAL today and both hold the neutral
 * platinum stops. The two names exist because the design intent is that a mark
 * beside a live control reads as neutral steel while a mark on a pure brand
 * surface may take the accent — but the accent ramp was never applied, here or
 * in index.css. Both keys are kept so the distinction survives if the copper is
 * ever landed; see "Known discrepancy" in the README.
 */
const RAMPS = {
  copper: ['#6e6e72', '#ffffff', '#e9e9eb', '#8c8c90', '#fdfdfe', '#b6b6ba'],
  steel: ['#6e6e72', '#ffffff', '#e9e9eb', '#8c8c90', '#fdfdfe', '#b6b6ba'],
} as const

interface ThinqMarkProps {
  /** Rendered px. The geometry is size-independent; only `small` changes it. */
  size?: number
  /**
   * `copper` and `steel` are the six-stop metal ramps. `flat` draws in
   * `currentColor`, for anywhere the mark must inherit the text it sits in —
   * a favicon, a print context, or a surface where a gradient cannot resolve.
   */
  tone?: 'copper' | 'steel' | 'flat'
  /**
   * Thickens the ring from 2 to 2.3 units. For 22px and below, where a 2-unit
   * stroke renders under 2px and the ring starts reading as a hairline circle
   * rather than as a drawn form.
   */
  small?: boolean
  className?: string
}

export default function ThinqMark({
  size = 24,
  tone = 'steel',
  small = false,
  className = '',
}: ThinqMarkProps) {
  /*
   * `useId` rather than a caller-supplied string. Gradient ids are global to the
   * document, so two marks sharing one id means the second silently inherits the
   * first's ramp — and this page renders the mark in the nav and the footer at
   * different tones, which is exactly the case that breaks. The spec passes an
   * `id` prop by hand for the same reason; `useId` removes the chance of a call
   * site forgetting.
   */
  const uid = useId().replace(/:/g, '')
  const stroke = small ? 2.3 : 2

  if (tone === 'flat') {
    return (
      <svg
        className={`thinq-mark ${className}`}
        viewBox={`0 0 ${VB} ${VB}`}
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
      >
        <circle className="ring" cx="8.8" cy="8.8" r="5.8" fill="none" stroke="currentColor" strokeWidth={stroke} />
        <circle className="d1" cx="16.2" cy="16.2" r="1.85" fill="currentColor" />
        <circle className="d2" cx="21" cy="21" r="1.25" fill="currentColor" />
      </svg>
    )
  }

  const stops = RAMPS[tone]
  const ramp = (suffix: string, v: typeof RING_VEC) => (
    <linearGradient
      id={`${uid}-${suffix}`}
      gradientUnits="userSpaceOnUse"
      x1={v.x1}
      y1={v.y1}
      x2={v.x2}
      y2={v.y2}
    >
      {stops.map((c, i) => (
        <stop key={c + i} offset={OFFS[i]} stopColor={c} />
      ))}
    </linearGradient>
  )

  return (
    <svg
      className={`thinq-mark ${className}`}
      viewBox={`0 0 ${VB} ${VB}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      data-tone={tone}
    >
      <defs>
        {ramp('r', RING_VEC)}
        {ramp('t', TRAIL_VEC)}
      </defs>
      <circle
        className="ring"
        cx="8.8"
        cy="8.8"
        r="5.8"
        fill="none"
        stroke={`url(#${uid}-r)`}
        strokeWidth={stroke}
      />
      <circle className="d1" cx="16.2" cy="16.2" r="1.85" fill={`url(#${uid}-t)`} />
      <circle className="d2" cx="21" cy="21" r="1.25" fill={`url(#${uid}-t)`} />
    </svg>
  )
}
