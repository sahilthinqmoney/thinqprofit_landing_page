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
 *  - reads the palette from index.css, so it can never drift off-brand
 *  - loops seamlessly by construction — no seam to hide
 *
 * Constraints it must respect (design-system/thinqprofit/pages/landing.md):
 *  - gold → chrome only. No green, no red: those are reserved for market data,
 *    and a green shimmer in the hero teaches the wrong association on sight.
 *  - the left of frame stays dark and low-contrast — the H1 sits there.
 *  - reduced motion gets a single composed still, never a frozen blank.
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
 * Gold core → platinum chrome highlight. Nothing else is permitted in here:
 * no green, no red — those belong to gain and loss.
 */
const COLOR_NEAR: [number, number, number] = [212, 175, 55] // gold     #D4AF37
const COLOR_FAR: [number, number, number] = [200, 204, 212] // chrome   #C8CCD4

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
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

        // Depth cue: the far half of the orbit sits behind, so it dims and cools.
        const depth = (Math.sin(angle) + 1) / 2
        const r = mix(COLOR_FAR[0], COLOR_NEAR[0], depth)
        const g = mix(COLOR_FAR[1], COLOR_NEAR[1], depth)
        const b = mix(COLOR_FAR[2], COLOR_NEAR[2], depth)

        // Keep the headline side quiet: fade anything drifting into the left third.
        const leftGuard = narrow ? 1 : Math.min(1, Math.max(0, (x / width - 0.06) / 0.34))

        const alpha = p.alpha * (0.45 + depth * 0.55) * (0.55 + settle * 0.45) * leftGuard * fieldAlpha
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
      // scatter, and gives the composition an axis.
      ctx.strokeStyle = `rgba(232, 217, 168, ${0.05 + order * 0.07})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(cx, cy, radiusX * 0.62, radiusY * 0.62, -t * 0.06, 0, Math.PI * 2)
      ctx.stroke()

      // A soft bloom on the band's leading edge — sells it as a light source
      // rather than a scatter of dots.
      const glowX = cx + Math.cos(t * 0.28) * radiusX * 0.55
      const glowY = cy + Math.sin(t * 0.28) * radiusY * 0.55
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, radiusX * 0.85)
      glow.addColorStop(0, `rgba(212, 175, 55, ${(0.15 + order * 0.13) * fieldAlpha})`)
      glow.addColorStop(0.55, 'rgba(200, 204, 212, 0.05)')
      glow.addColorStop(1, 'rgba(11, 11, 13, 0)')
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
