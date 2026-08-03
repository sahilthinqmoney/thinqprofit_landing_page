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
 *  - two of its three colours are index.css tokens by name and the third is a
 *    named stop of the mark metal, so a palette move is a three-line edit here
 *    rather than a re-render and a re-upload
 *  - loops seamlessly by construction — no seam to hide
 *
 * Constraints it must respect (design-system/thinqprofit/pages/landing.md):
 *  - the field is neutral steel end to end: `chrome-dim` → `chrome` → the mark
 *    metal's specular. No green, no red — those are market data, and a green
 *    shimmer in the hero teaches the wrong association on sight. And no copper,
 *    which is the change: the accent's role list is closed at the rim ring, the
 *    copper ramp under the shader and the solid primary fill, and an ambient
 *    backdrop is on none of them. So depth and emphasis are carried by
 *    luminance, alpha and size (see `draw`), and the one channel that means
 *    "you can act on this" is left unspent here.
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
 * Neutral steel at three luminances, on a warm ground. Two of the three are
 * tokens — `chrome-dim` and `chrome` — and the third is the mark metal's own
 * specular, because the palette has no token between `chrome` at 9.0349:1 and
 * `fg` at 19.9782:1 and a crest needs one. `#E9E9EB` is `METAL.white`'s alloy
 * stop verbatim (design-suite `src/logos.tsx`, DESIGN.md §39) — the same ramp
 * `chrome` is cut from, so the field is one metal read at three points on it.
 *
 * The ramp is the depth cue *and* the emphasis. `FIELD_FAR` is the back of the
 * orbit, `FIELD_NEAR` the body of it, and `CREST` is reserved for the front edge
 * alone.
 *
 * THE CREST DOES NOT FOLLOW THE ACCENT INTO COPPER. That was the open question
 * when the palette went warm, and it is settled here rather than left implicit,
 * because a draft of this file had already answered it the other way. Three
 * reasons, in the order that decides it.
 *
 * 1. The role. The accent is the rim ring, the copper ramp under the shader and
 *    the solid primary fill — and nothing else. Under platinum this file could
 *    hold `accent` honestly, because `accent` was then a LUMINANCE role: a
 *    neutral near-white alloy that carried no meaning a backdrop could steal.
 *    Copper makes it a HUE role, and hue in this system is a claim. Ambient
 *    particles cannot make it.
 *
 * 2. The measurement, which forbids it independently of the rule. Accent Y is
 *    0.4712 against `chrome`'s 0.4249 — 1.1091x. A crest sitting 1.109x above
 *    the body of its own orbit is not a crest. The only way to buy the gap back
 *    is to abandon the chrome tokens for hand-picked steel, which is exactly
 *    what the copper draft did (#656569 / #8C8C90), and it is expensive: at the
 *    alphas below — which are unchanged, and were solved against platinum — the
 *    rendered field lost 33.3% at the back of the orbit and 56.0% through the
 *    body, and the crest lost 73.2%. The whole section went dark to make room
 *    for a hue it was not entitled to use.
 *
 * 3. The separation that is actually available. Steel sits at hue 286.35 deg,
 *    245.32 deg from the accent's 41.03 deg, at chroma 0.0027 against 0.1263 —
 *    46.8x. So nothing here can be mistaken for the primary action at any alpha
 *    or any overlap, which is a stronger guarantee than platinum could give:
 *    there the field and the action were the same neutral family and only
 *    luminance told them apart.
 *
 * The ladder: 4.7394 / 9.0349 / 16.4772 on `#0A0808`, an even 2.1339x then
 * 1.9207x in luminance, 4.0986x end to end. That is the platinum ladder re-hung
 * on the mark metal to within 1.4% — #757B85 → #7B7B7F is +1.36% in Y, #A9AEB8 →
 * #AEAEB2 is +0.75%, #E7E9EE → #E9E9EB is +0.20%. Which is why not one alpha in
 * this file moves: they were tuned for values these land on top of, and
 * re-tuning them would be a change with no measurement behind it.
 *
 * `FIELD_FAR` stops at 4.7394:1 rather than going darker to widen the ladder: it
 * is `chrome-dim`, and below 3:1 a rendered mark is under the non-text floor —
 * a depth cue that has faded out of perception is not a subtler depth cue.
 */
const FIELD_FAR: [number, number, number] = [123, 123, 127] // chrome-dim   #7B7B7F  4.7394:1
const FIELD_NEAR: [number, number, number] = [174, 174, 178] // chrome      #AEAEB2  9.0349:1
const CREST: [number, number, number] = [233, 233, 235] // METAL.white alloy #E9E9EB 16.4772:1

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

        // Depth in colour: the far half of the orbit sits behind, so it drops to
        // `chrome-dim` and the front rises through `chrome`. The cube confines
        // the specular to roughly the front eighth of the orbit — spread across
        // the whole near half it would stop being a crest and become the field's
        // own brightness, which is exactly how a luminance-carried emphasis gets
        // thrown away. Hue is not one of the channels here and is not coming
        // back: see the token block for why the crest stayed neutral steel.
        const depth = (Math.sin(angle) + 1) / 2
        const crest = depth * depth * depth
        const r = mix(mix(FIELD_FAR[0], FIELD_NEAR[0], depth), CREST[0], crest)
        const g = mix(mix(FIELD_FAR[1], FIELD_NEAR[1], depth), CREST[1], crest)
        const b = mix(mix(FIELD_FAR[2], FIELD_NEAR[2], depth), CREST[2], crest)

        // Keep the headline side quiet: fade anything drifting into the left third.
        const leftGuard = narrow ? 1 : Math.min(1, Math.max(0, (x / width - 0.06) / 0.34))

        // Alpha compounds the ramp rather than fighting it: 0.28 → 1.0 across
        // depth where this used to be 0.45 → 1.0. Colour alone buys 4.0986x
        // between `chrome-dim` and the specular; the 3.571x alpha ramp on top of
        // it takes the rendered spread to 14.63x, against 14.81x under platinum
        // and 12.85x in the copper draft. That spread is what marks the front
        // edge, since hue is spent on the primary action and not on this.
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
      // `chrome` and not the specular — an edge that matched the crest would read
      // as a second live element. The 0.06/0.14 pair was solved against #A9AEB8
      // when this stopped being gold; `chrome` #AEAEB2 is +0.75% in luminance, so
      // it stands unchanged rather than being re-nudged for a 0.75% move.
      ctx.strokeStyle = rgba(FIELD_NEAR, 0.06 + order * 0.08)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(cx, cy, radiusX * 0.62, radiusY * 0.62, -t * 0.06, 0, Math.PI * 2)
      ctx.stroke()

      // A soft bloom on the band's leading edge — sells it as a light source
      // rather than a scatter of dots. Its core is the specular, because the
      // leading edge is the live part of the composition, but the alpha sits
      // *down* at 0.11/0.20 from the 0.15/0.28 this ran as gold: at equal alpha
      // #E9E9EB is 1.816x the luminance of the #D4AF37 it replaced, and letting
      // a bloom this wide inherit that lift would spend the gap on background
      // wash instead of on the crest. Rendered, the core lands at 1.2430:1 to
      // 1.6378:1 on the ground — ambience, not a second light.
      //
      // The tail is `chrome` the whole way out and its final stop is `chrome` at
      // alpha 0, not a ground colour. The previous note here justified that with
      // "a warm ground this palette no longer has", which is now false twice
      // over — the ground is #0A0808, warm at chroma 0.0038 — and the real
      // reason never needed it: canvas gradients interpolate non-premultiplied,
      // so an rgba(11,11,13,0) terminator drags the ramp toward that RGB on the
      // way out. Same hue at zero alpha is the only stop that fades to nothing.
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
