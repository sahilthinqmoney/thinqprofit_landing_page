import { useRef } from 'react'
import { gsap, initScrollTrigger, useGSAP } from '../../lib/scrollTrigger'

initScrollTrigger()

/**
 * §3's evidence: one trading session, drawn.
 *
 * ── What this is allowed to draw, and what it is not ──────────────────────
 *
 * §3's copy is four facts — forty instruments, two hundred strikes, six hours,
 * and a thirty-five minute gap between a move happening and the reader seeing
 * it. Every one of those is a COUNT. None of them is a price.
 *
 * That distinction is the whole licence for this component. docs/art-direction.md
 * §2.1 and DESIGN.md §8 refuse fabricated market data outright — no price,
 * percentage, currency symbol or P&L, "including partial, out of focus, or on a
 * reflected surface" — and a landing page that answers "charts that say
 * everything" with an invented candlestick has fabricated the exact thing the
 * sentence is about. src/data/missing.ts states the boundary in one line: *a
 * clock is not market data*.
 *
 * So this draws a CLOCK, not a chart. The horizontal axis is the session,
 * 09:15 to 15:30. The vertical axis is instruments — forty lanes, unlabelled,
 * because naming them would be naming symbols. A tick is "this instrument
 * printed something here". No tick carries a direction, a magnitude or a colour
 * that implies either: they are all one grey, they are all one size, and the
 * only thing that varies is WHEN.
 *
 * That constraint turned out to be the strongest version of the picture anyway.
 * A chart would have invited the reader to evaluate a trade. A field of activity
 * with one lit mark in it is the reader's actual problem — not "was this a good
 * move" but "there were four hundred marks on this screen and the one that
 * mattered was not the one you were looking at".
 *
 * ── Why it is scrubbed rather than played ─────────────────────────────────
 *
 * The section's argument is a duration. A timeline that plays on entry states
 * the gap; a timeline tied to the wheel makes the reader spend it — the
 * playhead moves because they are moving, it passes 11:40 while they are
 * reading the sentence about 11:40, and the thirty-five minutes between the two
 * markers cost them thirty-five minutes of scroll. That is the one place on this
 * page where scroll-linked motion carries meaning rather than decoration, which
 * is the test for using it at all.
 *
 * It is also the page's single authored motion moment below the fold. Everything
 * else in the scroll is `FocusPull` and `Reveal`; this is the one section that
 * gets a sequence, and it gets it because it is the one section making an
 * argument rather than listing facts.
 *
 * ── Determinism ──────────────────────────────────────────────────────────
 *
 * Tick positions come from a seeded LCG, never `Math.random`. Two reasons, and
 * the second is the one that bites: a re-render would otherwise reshuffle the
 * entire field under a scrubbed timeline, and the component would render
 * differently on every reload — so a visual regression could never be seen,
 * because nothing would ever look the same twice.
 */

/** Session bounds, in minutes from midnight. 09:15–15:30 is the NSE day. */
const OPEN = 9 * 60 + 15
const CLOSE = 15 * 60 + 30
const SPAN = CLOSE - OPEN

/** The two timestamps in `missing.heading`. Imported as numbers, not re-typed. */
const EVENT = 11 * 60 + 40
const SEEN = 12 * 60 + 15

/** Matches the copy: "Forty instruments." */
const LANES = 40
/** Marks per lane, averaged. Forty lanes × ~10 is the "two hundred strikes" order. */
const TICKS_PER_LANE = 10

/*
 * The viewBox is sized so the plot renders close to 1:1 at the width the aside
 * actually gets (~500px at 1280, ~640px at 1600). It was 1000 wide, which put
 * the whole thing at 0.5 scale — a 2.5-unit tick rendered as 1.25 device pixels
 * and the field read as dust rather than as activity. Marks this small are not a
 * contrast problem you can solve with opacity; they are a scale problem.
 */
const LANE_PITCH = 9
const CHART_H = LANES * LANE_PITCH
const CHART_W = 640
/** Room under the plot for the axis labels. */
const AXIS_H = 28
const TICK_W = 3
const TICK_H = 2.4

/** Position of a minute-of-day on the horizontal axis. */
const x = (minute: number) => ((minute - OPEN) / SPAN) * CHART_W

/**
 * Mulberry32. Deterministic, seeded, and small enough to read — a dependency
 * for thirty ticks of noise would be worse than the noise.
 */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Tick {
  cx: number
  cy: number
  /** Minute-of-day, so the playhead can decide whether this one has happened. */
  at: number
}

/**
 * The field, built once at module scope. It never changes between renders and
 * never depends on props, so rebuilding it per mount would be pure waste on a
 * component that already owns a ScrollTrigger.
 */
const TICKS: Tick[] = (() => {
  const next = rng(0x7a1c)
  const out: Tick[] = []

  for (let lane = 0; lane < LANES; lane++) {
    /*
     * Per-lane density varies so the field does not read as a grid. A uniform
     * count per row is the tell that this is generated rather than observed,
     * and the picture only works if it reads as a session someone sat through.
     */
    const count = Math.round(TICKS_PER_LANE * (0.45 + next() * 1.3))

    for (let i = 0; i < count; i++) {
      /*
       * Biased toward the open and the close. Real sessions are busiest in the
       * first and last hour, and a flat distribution puts the same amount of
       * activity at 13:00 as at 09:20 — which is the one thing about this
       * picture a trader would read as wrong immediately.
       */
      const u = next()
      const shaped = u < 0.5 ? Math.pow(u * 2, 1.6) / 2 : 1 - Math.pow((1 - u) * 2, 1.6) / 2

      out.push({
        at: OPEN + shaped * SPAN,
        cx: shaped * CHART_W,
        cy: lane * LANE_PITCH + LANE_PITCH / 2,
      })
    }
  }

  return out
})()

/** The lane the missed event fires in. Mid-field, so it is surrounded rather than edge-lit. */
const EVENT_LANE = 23
const EVENT_Y = EVENT_LANE * LANE_PITCH + LANE_PITCH / 2

const LABELS = [
  { at: OPEN, text: '09:15' },
  { at: 11 * 60, text: '11:00' },
  { at: 13 * 60, text: '13:00' },
  { at: 15 * 60, text: '15:00' },
]

export default function SessionGap({ className = '' }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const playhead = el.querySelector<SVGGElement>('[data-playhead]')
        const swept = el.querySelector<SVGRectElement>('[data-swept]')
        const eventMark = el.querySelector<SVGGElement>('[data-event]')
        const seenMark = el.querySelector<SVGGElement>('[data-seen]')
        const gapSpan = el.querySelector<SVGGElement>('[data-gap]')
        if (!playhead || !swept || !eventMark || !seenMark || !gapSpan) return

        /*
         * One timeline, scrubbed across the section's own travel. `scrub: 0.8`
         * rather than `true` so the playhead lags the wheel slightly and reads
         * as something with mass being dragged, not as a value being assigned.
         */
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            end: 'bottom 60%',
            scrub: 0.8,
          },
        })

        /*
         * The sweep and the playhead share one 0→1 progress, so the lit region
         * always ends exactly under the playhead. Two tweens with the same
         * duration would drift the moment either eased differently.
         */
        tl.fromTo(
          swept,
          { attr: { width: 0 } },
          { attr: { width: CHART_W }, duration: 1 },
          0,
        ).fromTo(playhead, { x: 0 }, { x: CHART_W, duration: 1 }, 0)

        /*
         * The two markers land when the playhead reaches their own timestamp,
         * so their position in the timeline IS their position in the session —
         * 11:40 lands at 38.7% of the scrub because 11:40 is 38.7% of the day.
         */
        const tEvent = (EVENT - OPEN) / SPAN
        const tSeen = (SEEN - OPEN) / SPAN

        tl.fromTo(
          eventMark,
          { opacity: 0, scale: 0.4, transformOrigin: 'center' },
          { opacity: 1, scale: 1, duration: 0.04, ease: 'power2.out' },
          tEvent,
        )
          .fromTo(
            gapSpan,
            { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
            { opacity: 1, scaleX: 1, duration: tSeen - tEvent, ease: 'none' },
            tEvent,
          )
          .fromTo(
            seenMark,
            { opacity: 0, scale: 0.4, transformOrigin: 'center' },
            { opacity: 1, scale: 1, duration: 0.04, ease: 'power2.out' },
            tSeen,
          )
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${CHART_W} ${CHART_H + AXIS_H}`}
      /* `overflow-visible` so the ground wash above can overscan the viewBox and
         fade out past the plot's own bounds. Clipped to the viewBox it would end
         in a straight edge exactly where the marks end, which is the panel look
         it exists to avoid. */
      className={`w-full overflow-visible ${className}`}
      role="img"
      aria-label="A single trading session, nine fifteen to three thirty, drawn as forty instrument lanes. One mark at eleven forty is the move; a second at twelve fifteen is when it was seen. The distance between them is the gap this section is about."
    >
      <defs>
        {/*
          The lit region is masked rather than clipped so its edge can be soft.
          A hard edge sweeping across the field reads as a wipe transition; a
          soft one reads as attention, which is what the playhead represents.
        */}
        <linearGradient id="sg-sweep" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="82%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="sg-mask">
          <rect data-swept x="0" y="0" width={CHART_W} height={CHART_H} fill="url(#sg-sweep)" />
        </mask>
        {/* Fades the field out at both ends so the plot has no hard left or
            right border — the session continues past the frame, which is true. */}
        <linearGradient id="sg-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="7%" stopColor="white" stopOpacity="1" />
          <stop offset="93%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="sg-edge">
          <rect x="0" y="0" width={CHART_W} height={CHART_H + AXIS_H} fill="url(#sg-fade)" />
        </mask>

        {/*
          The diagram's own ground.

          `place="left"` puts the section's scrim core at 26% — under the copy,
          which is where it has to be for the headline to hold contrast. That
          leaves the right of the frame at full plate brightness, and the plate's
          machined edge crosses exactly the band this diagram occupies. A field
          of 1px grey marks laid over a lit aluminium edge is not a contrast
          problem opacity can fix: the background is brighter than the marks in
          places and darker in others, so the same tick reads as ink at one x and
          as a hole at another.

          So the diagram carries its own ink rather than asking the section's
          scrim to reach further. Soft-edged, because a hard-edged panel here
          would read as a card dropped on the plate — and a card is the one
          container this page's design system refuses.
        */}
        <radialGradient id="sg-ground" cx="50%" cy="50%" r="62%">
          <stop offset="0%" stopColor="var(--color-bg)" stopOpacity="0.92" />
          <stop offset="55%" stopColor="var(--color-bg)" stopOpacity="0.78" />
          <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        x={-CHART_W * 0.12}
        y={-CHART_H * 0.16}
        width={CHART_W * 1.24}
        height={(CHART_H + AXIS_H) * 1.32}
        fill="url(#sg-ground)"
      />

      <g mask="url(#sg-edge)">
        {/*
          The unlit field. Present from the start at low contrast rather than
          animating in: the section is about activity the reader did not see,
          and activity that only exists once you scroll to it would be the
          opposite claim.
        */}
        <g fill="var(--color-chrome)" opacity="0.28">
          {TICKS.map((t, i) => (
            <rect
              key={i}
              x={t.cx}
              y={t.cy - TICK_H / 2}
              width={TICK_W}
              height={TICK_H}
              rx={TICK_H / 2}
            />
          ))}
        </g>

        {/* The same field again, lit, revealed by the sweep mask. */}
        <g fill="var(--color-chrome)" opacity="0.92" mask="url(#sg-mask)">
          {TICKS.map((t, i) => (
            <rect
              key={i}
              x={t.cx}
              y={t.cy - TICK_H / 2}
              width={TICK_W}
              height={TICK_H}
              rx={TICK_H / 2}
            />
          ))}
        </g>

        {/* The gap. A rule between the two timestamps, drawn as the playhead
            crosses it — the thirty-five minutes, at the scale of the session. */}
        <g data-gap opacity="0">
          <rect
            x={x(EVENT)}
            y={EVENT_Y - 0.75}
            width={x(SEEN) - x(EVENT)}
            height="1.5"
            fill="var(--color-fg)"
            opacity="0.7"
          />
          {/*
            The measurement, printed on the gap. The section's headline states
            the two timestamps and leaves the reader to do the subtraction; this
            is the subtraction, and it is the only number in the diagram because
            it is the only number the section is actually about.
          */}
          <text
            x={(x(EVENT) + x(SEEN)) / 2}
            y={EVENT_Y - 10}
            textAnchor="middle"
            fill="var(--color-fg)"
            fontSize="13"
            fontFamily="var(--font-mono, ui-monospace, monospace)"
          >
            35 min
          </text>
        </g>

        {/* 11:40 — the move. The one bright object in the frame, and the only
            element on the page's argument that is set in `fg` rather than a
            chrome tone. */}
        <g data-event opacity="0">
          <circle cx={x(EVENT)} cy={EVENT_Y} r="10" fill="var(--color-fg)" opacity="0.12" />
          <circle cx={x(EVENT)} cy={EVENT_Y} r="4" fill="var(--color-fg)" />
        </g>

        {/* 12:15 — when it was seen. Deliberately quieter than the event: the
            reader arriving is not the event, it is the cost of having missed it. */}
        <g data-seen opacity="0">
          <circle
            cx={x(SEEN)}
            cy={EVENT_Y}
            r="5"
            fill="none"
            stroke="var(--color-fg)"
            strokeWidth="1.4"
            opacity="0.8"
          />
        </g>

        {/* The playhead. A full-height hairline, so it reads as the session
            advancing rather than as a cursor on one lane. */}
        <g data-playhead>
          <rect
            x="-0.75"
            y="0"
            width="1.5"
            height={CHART_H}
            fill="var(--color-chrome)"
            opacity="0.55"
          />
        </g>

        {/* The axis. Four labels in the mono face, which is this page's rule for
            every numeral — this is a scale, not a caption. */}
        <g
          fill="var(--color-fg-subtle)"
          fontSize="13"
          fontFamily="var(--font-mono, ui-monospace, monospace)"
        >
          {LABELS.map((l) => (
            <g key={l.text}>
              <rect
                x={x(l.at)}
                y={CHART_H + 4}
                width="1"
                height="4"
                fill="var(--color-border)"
              />
              <text x={x(l.at)} y={CHART_H + AXIS_H - 4} textAnchor="middle">
                {l.text}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}
