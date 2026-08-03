import { useEffect, useRef } from 'react'

/**
 * Platform background — "signal resolving out of noise along a path".
 *
 * A scattered field of small chrome marks drifts sideways in low disorder.
 * Periodically a route between five or six of them lights up — to the mark
 * metal's specular, the brightest value this canvas is permitted — a head
 * travels its length, each mark it reaches flares laterally and settles, and the
 * whole thing decays behind it. One decision being made and committed, then the
 * field going quiet again. The reference is a departure board's flap sequence or
 * a switching yard — mechanical, legible, unhurried — not a nervous system.
 *
 * Deliberately absent, because they are the clichés this has to avoid: brains,
 * neuron blobs, circuit traces, glowing grids, coins, candles, axes, tickers.
 * There is no drawn line anywhere except the active route itself, so nothing in
 * the resting state can resolve into a graph.
 *
 * Why a canvas rather than a clip — same argument as HeroCanvas: a few KB
 * instead of megabytes, sharp at any DPR, three of its four colours are named
 * tokens or named stops of the mark metal, and seamless by construction rather
 * than by crossfade.
 *
 * Constraints it respects (docs/motion-brief.md §7, design-system landing.md):
 *  - The specular is the active route and nothing else. The resting field runs
 *    `chrome-dim` → `chrome` and the ambient bloom is `chrome-dim`, so the
 *    brightest metal stays a small fraction of the lit pixels — roughly one
 *    route's comet tail against the whole field. No green, no red: those are
 *    market data. And no copper: the accent's role list is closed at the rim
 *    ring, the copper ramp under the shader and the solid primary fill, and a
 *    background route is not an action. So "active" is a statement about
 *    luminance, and the whole file is tuned to keep it legible (see `draw`).
 *  - Motion is lateral and settling. Node drift is horizontal; the only vertical
 *    component is a per-node shear along that drift, randomly signed across the
 *    field, so nothing reads as a rise. Routes are built to meander within one
 *    row of where they started — a route can never accumulate into an ascending
 *    line, which is the thing §7 rule 3 actually bans.
 *  - No numbers, no chart forms, no axes, nothing that could read as a price.
 *  - A dead zone keeps one side of the frame dark so overlaid copy stays legible
 *    (the `leftGuard` idea from HeroCanvas, generalised to either edge).
 */

export interface DeadZone {
  /** Which edge stays dark. */
  side: 'left' | 'right'
  /** Fraction of the width kept dark, measured in from `side`. 0–1. */
  extent: number
  /** Fraction of the width the field takes to recover past the zone. */
  feather?: number
}

interface SignalCanvasProps {
  className?: string
  /** Region kept dark and low-contrast for overlaid copy. Omit for none. */
  deadZone?: DeadZone
}

interface Node {
  /** Resolved ("home") position, normalised. Static — the noise is the offset. */
  hx: number
  hy: number
  /** Lateral drift amplitude, as a fraction of width. */
  amp: number
  /** Vertical shear applied to that drift. Signed, so the field has no bias. */
  rake: number
  /** Integer multiple of the loop frequency — keeps the period exact. */
  harmonic: number
  phase: number
  /** 0–1. Drives resting brightness and colour temperature. */
  weight: number
  /** Resting half-length of the mark, px. */
  len: number
}

interface Route {
  /** Node indices, in travel order. */
  nodes: number[]
  /** Normalised arc parameter per vertex. Static, so nothing has to be measured. */
  param: number[]
  /** Where in the master loop this route peaks. 0–1. */
  offset: number
}

/**
 * Loose lattice the field is scattered across. Never drawn — only sampled.
 *
 * Sized in columns rather than pixels so the geometry survives the dead zone:
 * the lattice is mapped into whatever horizontal band is actually lit, and a
 * route's hop is measured in columns, so its diagonals stay shallow whether the
 * band is the full frame or the 46% left of the copy.
 */
const GRID_DESKTOP = { cols: 16, rows: 12 } // 192 marks
const GRID_MOBILE = { cols: 11, rows: 9 } //   99 marks

const ROUTE_COUNT = 5
const LOOP_SECONDS = 21

/**
 * Half-width of a route's activation window, in radians of the master loop.
 * `1.5π / ROUTE_COUNT` puts the average concurrency at 1.5 routes: one carrying
 * the frame while another is fading in or out. Widen it and the lit metal stops
 * being an event; narrow it and the section spends most of its time inert.
 */
const GATE_HALF = (Math.PI * 1.5) / ROUTE_COUNT
const GATE_FLOOR = Math.cos(GATE_HALF)
const HEAD_SPAN = Math.sin(GATE_HALF)

/** Trail decay behind the head, in arc-parameter units. Short: a comet, not a line. */
const TRAIL = 0.2

/** Total segments a route is chopped into for the per-sample alpha ramp. */
const SAMPLES = 88

/**
 * One neutral metal read at four luminances, on a warm ground. Two are tokens —
 * `chrome-dim` and `chrome` — and two are stops of the ramp those tokens are cut
 * from: `METAL.white`'s alloy `#E9E9EB` and its highlight `#FFFFFF`, which is
 * also the `fg` token (design-suite `src/logos.tsx`, DESIGN.md §39).
 *
 * THE ROUTE DOES NOT FOLLOW THE ACCENT INTO COPPER, and a draft of this file had
 * it the other way, so the reasoning is written down rather than implied.
 *
 * The role decides it first. The accent is the rim ring, the copper ramp under
 * the shader and the solid primary fill — nothing else. Under platinum this file
 * could hold `accent` honestly, because `accent` was then a LUMINANCE role: a
 * neutral near-white alloy carrying no meaning a backdrop could steal. Copper
 * makes it a HUE role, and hue here means "you can act on this". A route lighting
 * up behind body copy is not an action, and 192 marks of ambient copper would
 * make "only the action is saturated copper" false the moment the section
 * scrolled into view.
 *
 * The measurement forbids it independently. Accent Y is 0.4712 against `chrome`'s
 * 0.4249 — 1.1091x — so a copper route over a chrome field has no luminance
 * separation at all, and the copper draft had to drop the field onto hand-picked
 * steel (#8C8C90 / #656569) to get any. At the alphas below, which are unchanged
 * and were solved against platinum, that cost the trail 72.7% of its rendered
 * luminance and the head 69.5%. The section paid for a hue it was not entitled
 * to by going nearly dark.
 *
 * What the neutral ramp buys instead, measured on `#0A0808`: 4.7394 / 9.0349 /
 * 16.4772 / 19.9782. `ROUTE_ACTIVE` sits 1.9207x the brightest resting mark and
 * 4.0986x the dimmest, and `ROUTE_HEAD` 1.2255x above the route. Every rung is
 * WIDER than the copper draft's (1.7885x / 3.5985x / 1.1723x). Against the
 * platinum ladder these values re-hang (1.9313x / 4.1464x / 1.1302x) the two
 * field rungs land within 1.2% and the head rung is 8.4% wider — see the
 * `#FFFFFF` note below, which is the same fact from the other side. Hue
 * separation on top: steel at hue 286.35 deg is 245.32 deg from the accent's
 * 41.03 deg, at chroma 0.0027 against 0.1263 — 46.8x — so no overlap and no
 * alpha in this file can produce something mistakable for the primary action.
 *
 * Because the values land on platinum's to within 1.4% at the field and 0.2% at
 * the route, not one alpha in this file moves. The single exception is stated
 * rather than hidden: `ROUTE_HEAD` gains 8.64% in luminance, because
 * `METAL.white`'s highlight is `#FFFFFF` where platinum's `accent-hover` stopped
 * at `#F4F6FA` (18.4650:1 on this ground). A specular that stops short of the
 * light source is not a specular, and 8.64% on a 24px glow is inside the
 * blow-out the head already relies on.
 *
 * The alphas downstream widen the rendered gap further: the resting field gives
 * up brightness (§ "The resting field") and the route and its head take it
 * (§ "The active routes"). Move either of those and the section stops saying
 * anything.
 */
const ROUTE_ACTIVE: [number, number, number] = [233, 233, 235] // METAL.white alloy     #E9E9EB 16.4772:1
const ROUTE_HEAD: [number, number, number] = [255, 255, 255] // fg / METAL.white spec.  #FFFFFF 19.9782:1
const FIELD_BRIGHT: [number, number, number] = [174, 174, 178] // chrome                #AEAEB2  9.0349:1
const FIELD_DIM: [number, number, number] = [123, 123, 127] // chrome-dim               #7B7B7F  4.7394:1

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** `rgba()` from a token triple, so no channel ever gets retyped by hand. */
function rgba(c: [number, number, number], a: number) {
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a.toFixed(4)})`
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

export default function SignalCanvas({ className = '', deadZone }: SignalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Destructured to primitives so an inline `deadZone={{…}}` at the call site
  // does not re-run the effect — and tear down a running loop — on every render.
  const zoneSide = deadZone?.side ?? null
  const zoneExtent = deadZone?.extent ?? 0.44
  const zoneFeather = deadZone?.feather ?? 0.16

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return
    const ctx = context

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let nodes: Node[] = []
    let routes: Route[] = []

    // Per-frame scratch, allocated once per seed rather than per frame.
    let px = new Float32Array(0)
    let py = new Float32Array(0)
    let resolve = new Float32Array(0)
    let commit = new Float32Array(0)

    /** Loop phase at which route 0 peaks — the frame reduced motion gets. */
    let stillPhase = 0

    const seed = (nextCols: number, nextRows: number, narrow: boolean) => {
      cols = nextCols
      rows = nextRows
      nodes = []

      // Compose for the band that is actually lit. Spreading the lattice across
      // the full frame and then fading half of it away wastes half the marks and
      // leaves routes stranded behind the copy where nothing can be seen.
      const edge = zoneSide === 'left' ? zoneExtent : 1 - zoneExtent
      const useZone = !narrow && zoneSide !== null
      const lo = useZone && zoneSide === 'left' ? edge : 0
      const hi = useZone && zoneSide === 'right' ? edge : 1
      const band = hi - lo

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          nodes.push({
            // Jitter is nearly a full cell, so adjacent rows interleave and the
            // lattice never surfaces as a grid — only as a scatter with a faint
            // horizontal grain, which is what makes a lateral route legible.
            hx: lo + band * ((c + 0.5) / cols + ((Math.random() - 0.5) * 0.9) / cols),
            hy: (r + 0.5) / rows + ((Math.random() - 0.5) * 1.05) / rows,
            amp: (0.004 + Math.random() * 0.01) * band,
            rake: (Math.random() - 0.5) * 0.34,
            harmonic: 1 + Math.floor(Math.random() * 3),
            phase: Math.random() * Math.PI * 2,
            weight: Math.random(),
            // Mark length. At 2.4–6.4px these read as dust on a 1440 plate
            // rather than as a board of flaps; a mark has to be long enough for
            // the eye to register it as a *mark* before the lateral flap on
            // commit means anything.
            len: 4.4 + Math.random() * 6,
          })
        }
      }

      const at = (c: number, r: number) => c * rows + r

      /** Cumulative lateral distance, normalised. Routes run laterally, so this
       *  is arc length to within a rounding error — and being static it keeps
       *  the head, the trail and the commit flashes on one shared parameter. */
      const params = (idx: number[]) => {
        const out = [0]
        let total = 0
        for (let i = 1; i < idx.length; i++) {
          total += Math.abs(nodes[idx[i]].hx - nodes[idx[i - 1]].hx)
          out.push(total)
        }
        if (total <= 0) return idx.map((_, i) => i / Math.max(1, idx.length - 1))
        return out.map((v) => v / total)
      }

      routes = []
      for (let i = 0; i < ROUTE_COUNT; i++) {
        const hops = 4 + Math.floor(Math.random() * 2)
        // Widest hop the lattice can carry end to end. A long hop against a
        // one-row switch is what keeps the diagonals shallow — a steep zigzag
        // would read as a plotted series rather than as a lateral route.
        const stride = Math.max(1, Math.min(3, Math.floor((cols - 1) / hops)))
        const startRow = 1 + Math.floor(Math.random() * Math.max(1, rows - 2))
        const startCol = Math.floor(Math.random() * Math.max(1, cols - stride * hops))

        let row = startRow
        const idx = [at(startCol, row)]

        for (let h = 1; h <= hops; h++) {
          const roll = Math.random()
          let step = roll < 0.28 ? -1 : roll > 0.72 ? 1 : 0
          // The one hard rule on route shape: it may wander a row either way but
          // never further, so it cannot accumulate into a rising (or falling)
          // line across the frame. It stays a lateral run with a switch in it.
          if (Math.abs(row + step - startRow) > 1) step = 0
          row = Math.min(rows - 1, Math.max(0, row + step))
          idx.push(at(Math.min(cols - 1, startCol + h * stride), row))
        }

        // Some traffic runs the other way. A yard is not one-directional, and a
        // frame where every route travels left-to-right reads as a march.
        if (Math.random() < 0.4) idx.reverse()

        routes.push({
          nodes: idx,
          param: params(idx),
          // Irregular rather than metronomic: evenly spaced activations read as
          // a mechanism keeping time instead of decisions arriving.
          offset: (i + 0.55 * Math.random()) / ROUTE_COUNT,
        })
      }

      stillPhase = routes[0].offset

      px = new Float32Array(nodes.length)
      py = new Float32Array(nodes.length)
      resolve = new Float32Array(nodes.length)
      commit = new Float32Array(nodes.length)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      // Cap DPR at 2 — beyond that the fill cost doubles for no visible gain.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const narrow = width < 768
      const grid = narrow ? GRID_MOBILE : GRID_DESKTOP
      if (grid.cols !== cols || grid.rows !== rows) seed(grid.cols, grid.rows, narrow)
    }

    /**
     * A route's activation, 0 → 1 → 0, from its own angle on the master loop.
     * A raised cosine clipped at `GATE_HALF`: continuous, exactly periodic, and
     * zero over most of the cycle so only one or two routes are ever lit.
     */
    const gateOf = (theta: number) => {
      const c = Math.cos(theta)
      return c <= GATE_FLOOR ? 0 : (c - GATE_FLOOR) / (1 - GATE_FLOOR)
    }

    /**
     * Where the head sits on the route, 0 → 1.
     *
     * Scaled so it reaches each end exactly as the gate closes. That is the
     * whole seam-free trick: the head runs 0 → 1 while the route is visible and
     * slides silently back to 0 while it is not, so there is no sawtooth, no
     * counter and no restart — just sin and cos of elapsed time.
     */
    const headOf = (theta: number) => clamp01(0.5 + (0.5 * Math.sin(theta)) / HEAD_SPAN)

    /** Position on a route at arc parameter `s`, using this frame's node drift. */
    const pointAt = (route: Route, s: number) => {
      const par = route.param
      let k = par.length - 2
      for (let i = 0; i < par.length - 1; i++) {
        if (s <= par[i + 1]) {
          k = i
          break
        }
      }
      const span = par[k + 1] - par[k]
      const f = span > 0 ? clamp01((s - par[k]) / span) : 0
      const a = route.nodes[k]
      const b = route.nodes[k + 1]
      return { x: px[a] + (px[b] - px[a]) * f, y: py[a] + (py[b] - py[a]) * f }
    }

    /**
     * Draw one frame. `t` is seconds since mount, never reset.
     *
     * Everything below is a function of `sin`/`cos` of `t` at integer multiples
     * of the master frequency, so the whole composition repeats exactly every
     * LOOP_SECONDS with no discontinuity anywhere in it.
     */
    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      if (width < 1 || height < 1 || nodes.length === 0) return

      const narrow = width < 768
      const w = (Math.PI * 2) / LOOP_SECONDS

      // Slow global breathing, phased to peak on the same beat as route 0 so the
      // reduced-motion still lands on the most-resolved moment in the loop.
      const order = 0.5 + 0.5 * Math.cos((t - stillPhase * LOOP_SECONDS) * w)

      const fieldAlpha = narrow ? 0.6 : 1

      // Below 768px there is no side to give away — the copy fills the width and
      // sits at the top — so the dead zone becomes a horizon instead of an edge,
      // and the whole field dims. Same trade HeroCanvas makes.
      const zoneEdge = zoneSide === 'left' ? zoneExtent : 1 - zoneExtent

      const guard = (x: number, y: number) => {
        const ny = y / height
        // Keep the field off the section's own top and bottom edges, so it reads
        // as lit space rather than as a texture that got cropped.
        let att = clamp01(ny / 0.1) * clamp01((1 - ny) / 0.1)
        if (narrow) return att * clamp01((ny - 0.44) / 0.2)
        if (zoneSide) {
          const nx = x / width
          const d = zoneSide === 'left' ? (nx - zoneEdge) / zoneFeather : (zoneEdge - nx) / zoneFeather
          att *= clamp01(d)
        }
        return att
      }

      // ---- Which marks are resolving, and which are being committed ---------
      resolve.fill(0)
      commit.fill(0)

      for (const route of routes) {
        const gate = gateOf(w * t - route.offset * Math.PI * 2)
        if (gate <= 0) continue
        const head = headOf(w * t - route.offset * Math.PI * 2)

        for (let i = 0; i < route.nodes.length; i++) {
          const n = route.nodes[i]
          const d = head - route.param[i]
          // Broad: the whole route tightens out of the noise while it is live.
          const res = gate * Math.exp(-Math.abs(d) / 0.3)
          if (res > resolve[n]) resolve[n] = res
          // Narrow: the flap, as the head actually arrives.
          const flash = gate * Math.exp(-(d * d) / 0.0022)
          if (flash > commit[n]) commit[n] = flash
        }
      }

      // ---- Node positions ---------------------------------------------------
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        // Resolving damps the noise: a committed mark is nearly still.
        const settle = 1 - 0.85 * resolve[i]
        const dx = n.amp * settle * Math.sin(w * n.harmonic * t + n.phase)
        px[i] = (n.hx + dx) * width
        // Vertical motion exists only as shear on the lateral drift, signed per
        // node. Half the field leans one way, half the other, so there is never
        // a direction to read — which is the point of §7 rule 3.
        py[i] = n.hy * height + dx * n.rake * width
      }

      ctx.globalCompositeOperation = 'lighter'

      // ---- Ambient bloom ----------------------------------------------------
      // `chrome-dim`, never the specular and certainly never the accent. It
      // covers a large area: a bright wash this wide raises the floor the route
      // has to beat, and a copper one would put the page's action colour across
      // most of a section that cannot be acted on. Rendered it lands at 1.0537:1
      // to 1.1062:1 on the ground — barely above black, which is the job.
      // The 0.07/0.026 alphas were solved against #757B85; `chrome-dim` #7B7B7F
      // is +1.36% in luminance, so they stand.
      const liveX = narrow || !zoneSide ? 0.5 : zoneSide === 'left' ? 0.5 + zoneExtent / 2 : (1 - zoneExtent) / 2
      const bloomX = width * liveX + Math.cos(w * t) * width * 0.04
      const bloomY = height * (narrow ? 0.72 : 0.5)
      const bloomR = Math.max(width, height) * 0.6
      const bloom = ctx.createRadialGradient(bloomX, bloomY, 0, bloomX, bloomY, bloomR)
      bloom.addColorStop(0, rgba(FIELD_DIM, (0.07 + order * 0.05) * fieldAlpha))
      bloom.addColorStop(0.5, rgba(FIELD_DIM, 0.026 * fieldAlpha))
      bloom.addColorStop(1, rgba(FIELD_DIM, 0))
      ctx.fillStyle = bloom
      ctx.fillRect(0, 0, width, height)

      // ---- The resting field ------------------------------------------------
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const x = px[i]
        const y = py[i]

        const att = guard(x, y)
        if (att <= 0.004) continue

        const res = resolve[i]
        const flash = commit[i]

        // The resting term came down from (0.26 + 0.5·weight) and the two active
        // terms went up. Both halves of that are the same decision: a resting
        // mark still has to be legible — a field reading as noise gives a
        // committed mark nothing to be a *change* against — but it cannot be as
        // bright as it was, because brightness is the only thing that says
        // "committed" once hue is reserved for the primary action. Rendered, the
        // resting band runs 1.2342:1 (`chrome-dim` at 0.21) to 4.2890:1 (`chrome`
        // at 0.65) on `#0A0808`. Clamped, since the terms can sum past 1; `att`
        // multiplies after the clamp so the dead zone still wins.
        const alpha =
          clamp01((0.21 + 0.44 * n.weight) * (0.55 + 0.45 * order) + res * 0.3 + flash * 0.95) *
          att *
          fieldAlpha
        if (alpha <= 0.004) continue

        // A resting mark runs `chrome-dim` → `chrome` on its own weight and on
        // the broad resolve. Only `flash` — the head actually arriving — pulls it
        // to the specular, and it pulls nearly all the way (0.85, up from a 0.45
        // whisper): a hue-tinted hint worked when the route was gold, but along a
        // neutral ramp 0.45 lands on #C9C9CC, only 1.3713x `chrome` in luminance,
        // which is a slightly lighter grey rather than an event. 0.85 lands on
        // #E0E0E2 — 15.1794:1 on the ground, 1.7601x `chrome` — and that reads as
        // a flap. A few marks at a time, a handful of pixels each.
        const tone = clamp01(n.weight * 0.5 + res * 0.5 + flash * 0.8)
        const r = mix(mix(FIELD_DIM[0], FIELD_BRIGHT[0], tone), ROUTE_ACTIVE[0], flash * 0.85)
        const g = mix(mix(FIELD_DIM[1], FIELD_BRIGHT[1], tone), ROUTE_ACTIVE[1], flash * 0.85)
        const b = mix(mix(FIELD_DIM[2], FIELD_BRIGHT[2], tone), ROUTE_ACTIVE[2], flash * 0.85)
        const rgb = `${r | 0}, ${g | 0}, ${b | 0}`

        // The flap: the mark extends laterally as the head reaches it, then
        // settles back as the gaussian decays. Sideways, never up.
        const half = n.len * (1 + 2.4 * flash)
        const thick = 1.15 + 1.1 * flash

        ctx.fillStyle = `rgba(${rgb}, ${(alpha * 0.2).toFixed(4)})`
        ctx.fillRect(x - half * 2.2, y - thick * 2.6, half * 4.4, thick * 5.2)

        ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(4)})`
        ctx.fillRect(x - half, y - thick, half * 2, thick * 2)
      }

      // ---- The active routes ------------------------------------------------
      for (const route of routes) {
        const theta = w * t - route.offset * Math.PI * 2
        const gate = gateOf(theta)
        if (gate <= 0.004) continue

        const head = headOf(theta)
        const idx = route.nodes
        const par = route.param

        for (let k = 0; k < idx.length - 1; k++) {
          const s0 = par[k]
          const s1 = par[k + 1]
          const steps = Math.max(2, Math.round((s1 - s0) * SAMPLES))
          const ax = px[idx[k]]
          const ay = py[idx[k]]
          const bx = px[idx[k + 1]]
          const by = py[idx[k + 1]]

          for (let j = 0; j < steps; j++) {
            const f0 = j / steps
            const f1 = (j + 1) / steps
            const d = head - (s0 + (s1 - s0) * ((f0 + f1) / 2))
            // Behind the head it decays; a sliver ahead of it glimmers, which is
            // what makes the route look like it is being found rather than drawn.
            const lum = d >= 0 ? Math.exp(-d / TRAIL) : Math.exp(d / 0.02) * 0.5
            const a = gate * lum
            if (a <= 0.01) continue

            const x0 = ax + (bx - ax) * f0
            const y0 = ay + (by - ay) * f0
            const x1 = ax + (bx - ax) * f1
            const y1 = ay + (by - ay) * f1

            const att = guard((x0 + x1) / 2, (y0 + y1) / 2)
            if (att <= 0.01) continue

            // 0.95, up from the 0.7 this ran as gold. The trail was allowed to
            // sit at partial alpha while hue carried it; against a field of the
            // same metal it has to be drawn at nearly full value or the route
            // reads as one more resting mark that happens to be in a line.
            // Rendered at the head it lands on 14.8369:1 (Y 0.7298) against a
            // resting band topping out at 4.2890:1 (Y 0.1754) — 4.16x in
            // luminance, which is the whole of the separation now.
            ctx.strokeStyle = rgba(ROUTE_ACTIVE, a * 0.95 * att * fieldAlpha)
            ctx.lineWidth = 0.9 + 1.5 * a
            ctx.beginPath()
            ctx.moveTo(x0, y0)
            ctx.lineTo(x1, y1)
            ctx.stroke()
          }
        }

        // The head itself — the single brightest thing in the frame. Its core is
        // `ROUTE_HEAD`, the top of the mark metal, at 0.42 rather than the 0.3
        // this ran as gold: additively over the trail it blows the head out to
        // white while staying a 24px radius, so the brightest pixels on the
        // section are a few hundred of them on one moving point. That is the
        // whole luminance hierarchy in one place — head, then trail, then flapped
        // mark, then field. Alone, the core composites to 4.0335:1 on the ground;
        // it only goes white by landing on the trail underneath it.
        //
        // The blow-out is what a lit metal edge does, and it costs nothing here
        // because the value being overexposed is already neutral: white is where
        // this ramp was always heading, not a hue being abandoned. That was the
        // argument the copper draft had to make for the accent, and it is the
        // reason the accent should not have been here — a colour that has to
        // leave its own hue to do its job in a canvas is being used for the
        // wrong thing.
        const hp = pointAt(route, head)
        const hAtt = guard(hp.x, hp.y)
        if (hAtt > 0.01) {
          const strength = gate * hAtt * fieldAlpha
          const glow = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 24)
          glow.addColorStop(0, rgba(ROUTE_HEAD, 0.42 * strength))
          glow.addColorStop(0.35, rgba(ROUTE_ACTIVE, 0.2 * strength))
          glow.addColorStop(1, rgba(ROUTE_ACTIVE, 0))
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(hp.x, hp.y, 24, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalCompositeOperation = 'source-over'
    }

    /*
     * Clock.
     *
     * `elapsed` banks the animation time already consumed; `runStart` marks when
     * the current run began. Pausing adds the run to the bank, resuming starts a
     * new one — so scrolling a route offscreen mid-travel and coming back finds
     * it exactly where it should be, rather than at phase zero.
     */
    let frame = 0
    let running = false
    let elapsed = 0
    let runStart = 0

    const loop = (now: number) => {
      if (!running) return
      draw(elapsed + (now - runStart) / 1000)
      frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (!running) return
      elapsed += (performance.now() - runStart) / 1000
      running = false
      cancelAnimationFrame(frame)
    }

    const play = () => {
      if (running || motionQuery.matches) return
      running = true
      runStart = performance.now()
      frame = requestAnimationFrame(loop)
    }

    /**
     * Reduced motion: one composed still at the most-resolved moment — route 0
     * at full gate with its head mid-path and the field tightened around it.
     * Never a blank canvas.
     */
    const renderStill = () => {
      stop()
      resize()
      draw(stillPhase * LOOP_SECONDS)
    }

    resize()

    if (motionQuery.matches) renderStill()
    else play()

    const onMotionChange = () => {
      if (motionQuery.matches) renderStill()
      else play()
    }

    const onResize = () => {
      resize()
      if (motionQuery.matches) draw(stillPhase * LOOP_SECONDS)
    }

    // Don't burn frames on a backgrounded tab or a section three screens away.
    let visible = true
    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible && !motionQuery.matches) play()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        visible = entry.isIntersecting
        if (visible) {
          if (!motionQuery.matches && !document.hidden) play()
        } else {
          stop()
        }
      },
      { threshold: 0 },
    )
    observer.observe(canvas)

    motionQuery.addEventListener('change', onMotionChange)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      observer.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [zoneSide, zoneExtent, zoneFeather])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
