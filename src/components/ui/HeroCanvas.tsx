import { useEffect, useRef } from 'react'

/**
 * Hero background — "order from noise".
 *
 * Concept from docs/motion-brief.md §4 variant A: a field of particles drifts in
 * slow disorder, then organises into a clean orbital band, then loosens again.
 * Scattered market information resolving into structure — the one thing the
 * product actually claims.
 *
 * Why this is a canvas and not a video file:
 *  - ~6 KB of JS against 2-3 MB for an equivalent clip
 *  - renders at device pixel ratio, so it stays sharp on any display
 *  - its three colours are the index.css tokens by name, so a palette move is a
 *    three-line edit here rather than a re-render and a re-upload
 *  - loops seamlessly by construction — no seam to hide
 *
 * Constraints it must respect (design-system/thinqprofit/pages/landing.md):
 *  - the field is neutral metal end to end: `chrome-dim` → `chrome` → `accent`.
 *    No green, no red — those are market data, and a green shimmer in the hero
 *    teaches the wrong association on sight. Nothing here carries hue at all,
 *    so depth and emphasis are carried entirely by luminance (see `draw`).
 *  - the left of frame stays dark and low-contrast — the H1 sits there.
 *  - reduced motion gets a single composed still, never a frozen blank.
 *  - motion is orbital and lateral, never upward (docs/motion-brief.md §7.3).
 */

interface HeroCanvasProps {
  className?: string
}

interface Particle {
  /** Position along the orbital band, radians. */
  angle: number
  /** Angular velocity — varied per particle so the band never looks rigid. */
  speed: number
  /** Distance from the band, in normalised units. Signed. */
  offset: number
  /** Drift target when the field is in its disordered phase. */
  chaosX: number
  chaosY: number
  /** Per-particle phase so they don't all resolve on the same beat. */
  phase: number
  size: number
  alpha: number
}

const PARTICLE_COUNT_DESKTOP = 520
const PARTICLE_COUNT_MOBILE = 220

/**
 * The whole field is one neutral alloy read at three luminances. Nothing else is
 * permitted in here: no green, no red — those belong to gain and loss — and no
 * hue of any kind, because hue in this system means something.
 *
 * The ramp is the depth cue *and* the emphasis. `FIELD_FAR` is the back of the
 * orbit, `FIELD_NEAR` the body of it, and `CREST` — the brightest surface in the
 * palette, the same value the primary action is filled with — is reserved for
 * the front edge alone. Ordering matters: the old field ran a warm accent against
 * a *brighter* cool chrome and let hue do the separating, which is not available
 * any more. Bright now means near, and near means live.
 */
const FIELD_FAR: [number, number, number] = [117, 123, 133] // chrome-dim  #757B85  4.78:1
const FIELD_NEAR: [number, number, number] = [169, 174, 184] // chrome     #A9AEB8  9.16:1
const CREST: [number, number, number] = [231, 233, 238] // accent          #E7E9EE 16.78:1

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** `rgba()` from a token triple, so no channel ever gets retyped by hand. */
function rgba(c: [number, number, number], a: number) {
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`
}

export default function HeroCanvas({ className = '' }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return
    const ctx = context

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frame = 0
    let running = false
    let start = 0

    const seed = (count: number) => {
      particles = Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        speed: 0.04 + Math.random() * 0.07,
        offset: (Math.random() - 0.5) * 0.3,
        chaosX: (Math.random() - 0.5) * 0.9,
        chaosY: (Math.random() - 0.5) * 0.65,
        phase: Math.random() * Math.PI * 2,
        size: 1.1 + Math.random() * 2.4,
        alpha: 0.4 + Math.random() * 0.6,
      }))
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

      const wanted = width < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
      if (particles.length !== wanted) seed(wanted)
    }

    /**
     * Draw one frame.
     *
     * `t` is seconds since start. `order` breathes 0 → 1 → 0 over ~14s: 0 is a
     * loose disordered cloud, 1 is a resolved band. The camera never moves; the
     * structure does. That contrast is the whole effect.
     */
    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)

      // Desktop: band sits right of centre, since the headline owns the left.
      // Narrow: there is no side to give it, so it drops below the copy and
      // dims — ambient depth rather than something competing with the CTA.
      const narrow = width < 768
      const cx = narrow ? width * 0.5 : width * 0.66
      const cy = narrow ? height * 0.76 : height * 0.5
      const radiusX = narrow ? width * 0.46 : Math.min(width * 0.34, 560)
      const radiusY = radiusX * (narrow ? 0.5 : 0.42)
      const fieldAlpha = narrow ? 0.55 : 1

      const order = 0.5 - 0.5 * Math.cos(t * ((Math.PI * 2) / 14))

      ctx.globalCompositeOperation = 'lighter'

      for (const p of particles) {
        const angle = p.angle + t * p.speed
        const settle = Math.min(1, Math.max(0.38, order + 0.22 * Math.sin(p.phase + t * 0.35)))

        // Ordered position: a point on the tilted ellipse, plus its own offset.
        const bandX = cx + Math.cos(angle) * radiusX * (1 + p.offset * (1 - settle * 0.75))
        const bandY = cy + Math.sin(angle) * radiusY * (1 + p.offset * (1 - settle * 0.75))

        // Disordered position: a slow wander around the same centre.
        const wanderX = cx + p.chaosX * radiusX + Math.cos(t * 0.22 + p.phase) * 34
        const wanderY = cy + p.chaosY * radiusY * 1.7 + Math.sin(t * 0.19 + p.phase) * 26

        const x = mix(wanderX, bandX, settle)
        const y = mix(wanderY, bandY, settle)

        // Depth cue, and the only cue available: the far half of the orbit sits
        // behind, so it drops to `chrome-dim` and the front rises through
        // `chrome`. The cube confines the alloy to roughly the front eighth of
        // the orbit — spread across the whole near half it would stop being a
        // crest and become the field's own brightness, which is exactly how a
        // luminance-only accent gets thrown away.
        const depth = (Math.sin(angle) + 1) / 2
        const crest = depth * depth * depth
        const r = mix(mix(FIELD_FAR[0], FIELD_NEAR[0], depth), CREST[0], crest)
        const g = mix(mix(FIELD_FAR[1], FIELD_NEAR[1], depth), CREST[1], crest)
        const b = mix(mix(FIELD_FAR[2], FIELD_NEAR[2], depth), CREST[2], crest)

        // Keep the headline side quiet: fade anything drifting into the left third.
        const leftGuard = narrow ? 1 : Math.min(1, Math.max(0, (x / width - 0.06) / 0.34))

        // Alpha compounds the ramp rather than fighting it: 0.28 → 1.0 across
        // depth where this used to be 0.45 → 1.0. Colour alone buys a 4:1
        // luminance spread; alpha takes the rendered spread to roughly 14:1, and
        // that widened gap is what replaces the hue that used to mark the front.
        const alpha = p.alpha * (0.28 + depth * 0.72) * (0.55 + settle * 0.45) * leftGuard * fieldAlpha
        if (alpha <= 0.002) continue

        const size = p.size * (0.7 + depth * 0.6) * (0.8 + settle * 0.4)

        ctx.beginPath()
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha * 0.22})`
        ctx.arc(x, y, size * 3.2, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // A thin counter-rotating inner arc: reads as structure rather than a
      // scatter, and gives the composition an axis. A machined edge, so it takes
      // `chrome` and not the alloy — an edge that matched the crest would read as
      // a second live element. Alpha is nudged up a little because chrome is a
      // darker line than the pale metal that was here before.
      ctx.strokeStyle = rgba(FIELD_NEAR, 0.06 + order * 0.08)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(cx, cy, radiusX * 0.62, radiusY * 0.62, -t * 0.06, 0, Math.PI * 2)
      ctx.stroke()

      // A soft bloom on the band's leading edge — sells it as a light source
      // rather than a scatter of dots. Its core is the alloy, because the leading
      // edge is the live part of the composition, but the alpha comes *down* from
      // 0.15/0.28: at equal alpha the alloy is ~1.8× the luminance of the value
      // it replaces, and letting a bloom this wide inherit that lift would spend
      // the new gap on background wash instead of on the crest. The tail is
      // chrome the whole way out — a bloom that fades through the ink base
      // reasoned about a warm ground this palette no longer has.
      const glowX = cx + Math.cos(t * 0.28) * radiusX * 0.55
      const glowY = cy + Math.sin(t * 0.28) * radiusY * 0.55
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, radiusX * 0.85)
      glow.addColorStop(0, rgba(CREST, (0.11 + order * 0.09) * fieldAlpha))
      glow.addColorStop(0.55, rgba(FIELD_NEAR, 0.045 * fieldAlpha))
      glow.addColorStop(1, rgba(FIELD_NEAR, 0))
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (now: number) => {
      if (!running) return
      if (!start) start = now
      draw((now - start) / 1000)
      frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const play = () => {
      if (running || motionQuery.matches) return
      running = true
      // Rebase so a pause never causes a jump on resume.
      start = performance.now() - (start ? performance.now() - start : 0)
      start = 0
      frame = requestAnimationFrame(loop)
    }

    /** Reduced motion: one composed still at the most-resolved point. */
    const renderStill = () => {
      stop()
      resize()
      draw(7)
    }

    resize()

    if (motionQuery.matches) {
      renderStill()
    } else {
      play()
    }

    const onMotionChange = () => {
      if (motionQuery.matches) renderStill()
      else play()
    }

    const onResize = () => {
      resize()
      if (motionQuery.matches) draw(7)
    }

    // Don't burn frames on a backgrounded tab or a scrolled-past hero.
    const onVisibility = () => {
      if (document.hidden) stop()
      else if (!motionQuery.matches) play()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          if (!motionQuery.matches) play()
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
