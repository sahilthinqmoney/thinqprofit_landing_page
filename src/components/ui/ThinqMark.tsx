import { useId } from 'react'

/**
 * The Thinq brand mark — a ring with a diminishing trail, drawn to the terminal
 * specification's geometry (`src/logos.tsx` in the design suite, DESIGN.md §7).
 *
 * This replaces a lucide `TrendingUp` glyph in a rounded tile, and the reason is
 * stronger than "the spec has a mark". The spec's own constraints forbid the
 * glyph outright: *"Forbidden: bulls, rockets, arrows, ascending candles, coins.
 * They imply assured returns."* A rising arrow is the single most common broker
 * mark and the single most regulated claim on the page — SEBI requires the risk
 * disclosure two elements away from it. The page was making a returns claim in
 * its logo and disclaiming it in the same viewport.
 *
 * What the mark is, structurally: one abstract organic form. Not a letter, not
 * an object from finance, no chart, no arrow. It earns meaning by association
 * with the name rather than by depicting the product — the same register as
 * Robinhood's feather, which this page already studies for architecture.
 *
 * **The geometry is fixed and is not to be adjusted.** Ring top-left, trail
 * running down-right, on a 24-unit grid. The spec records that the dot spacing
 * is set by *edge gap* rather than centre distance: an earlier geometry left
 * 1.7 units between dot edges, which at 21px renders as ~1.5px — under the
 * threshold where the eye separates them, so the trail fused into a line. Two
 * dots rather than three is what let the survivors spread to 2.8 and 3.7 units
 * of clear edge gap, so the trail reads as discrete marks at favicon size. One
 * geometry at every size; `small` only thickens the ring's stroke.
 */
const VB = 24

/**
 * Gradient stop offsets, and the per-shape gradient vectors.
 *
 * These are `userSpaceOnUse` rather than the default `objectBoundingBox`, and
 * the spec is emphatic about why. A single bounding-box ramp across the 24-unit
 * box makes the ring sample only its own bbox — (3,3)→(14.6,14.6), about 60% of
 * the box — so it never reaches the second highlight at 88%. Two highlights are
 * the entire difference between struck metal and a plain gradient, so the mark
 * lost its metal exactly where it is used most: at bar size. It looked rich at
 * 64px and flat at 22px.
 *
 * One vector per shape, sized to that shape, so the full six-stop ramp plays
 * across the ring *and* across the trail at every size. Same light angle on both
 * (dy = 0.85·dx) so they still read as one source. Size-independent by
 * construction.
 */
const OFFS = ['0%', '26%', '46%', '66%', '88%', '100%'] as const
const RING_VEC = { x1: 3, y1: 3, x2: 14.6, y2: 12.86 }
const TRAIL_VEC = { x1: 14.35, y1: 14.35, x2: 22.25, y2: 21.07 }

/**
 * The two metal ramps, verbatim from the spec's `METAL` table.
 *
 * `copper` is the brand ramp — the same six stops the primary action's rim and
 * the footer wordmark run on, so every metal surface on the page is lit by one
 * light.
 *
 * `steel` is the spec's `white` tone: no hue at any stop, r≈g≈b throughout. It
 * exists for the case where the mark must not read as an accent. The spec is
 * explicit that a mark's tone is a function of the GROUND rather than of the
 * accent — and records having shipped the bug twice, because binding the tone to
 * the accent means "an accent says you can act on this, and a logotype is not
 * actionable".
 *
 * That rule is stated for the terminal's chrome bar, where the mark sits among
 * live controls. `copper` is the default here because this page is the case the
 * same section carves out — spec §07: *"chrome is the primary; coral for brand
 * surfaces where the accent leads."* A landing page is a brand surface. `steel`
 * stays available for any placement where the mark would compete with an action.
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
