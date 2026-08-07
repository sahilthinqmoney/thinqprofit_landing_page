import { useEffect, useRef } from 'react'
import { ShaderMount, liquidMetalFragmentShader } from '@paper-design/shaders'

/**
 * A live liquid-metal surface, sized by its parent. Used only as the rim of the
 * primary `Button`.
 *
 * Adapted from the community `liquid-metal-button` component with four fixes:
 *
 *  1. `dispose()`, not `destroy()` — the latter does not exist on `ShaderMount`,
 *     so every unmount leaked a WebGL context and its animation frame.
 *  2. All required uniforms are supplied. The original omits `u_colorBack`,
 *     `u_colorTint`, `u_isImage` and the nine `ShaderSizingUniforms`, relying on
 *     undefined uniforms defaulting to zero.
 *  3. No fixed pixel size. The original hardcodes 142×46; `ShaderMount` matches
 *     its parent, so the rim fits whatever the button's padding and type produce
 *     at any size, in any language.
 *  4. Speed is driven by a `state` prop rather than by internal pointer
 *     handlers, so the parent owns the interaction.
 */

/**
 * The tint cannot carry the brand colour, and this is the shader's hard limit
 * rather than a choice.
 *
 * `getColorChanges()` ends with a per-channel COLOUR BURN:
 *
 *   ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
 *
 * which can only darken, and clips to zero at `ch = 1 - tint`. The stripe it
 * clips against is hardcoded in the source (`color2` floors at 0.100), so any
 * tint whose weakest channel drops below ~0.90 holes the shadows out. Measured
 * clip points: `--color-accent` #FF9E7A is 0.5216 — five times over — and even
 * the metal ramp's own specular #FFD9C6 is 0.2235.
 *
 * So this shader models LIGHT, not colour. The copper lives in
 * `.surface-copper` underneath, and `blend="rim"` overlays the two.
 *
 * `u_colorBack` is only sampled where the shape's coverage drops below 1. At
 * `u_scale: 8` the shape is zoomed far outside the element and coverage is 1
 * everywhere, so this colour never reaches the screen — do not spend time
 * tuning it.
 *
 * NOTE: both constants below are the pre-retheme PLATINUM values — the tint is
 * cool (#F4F6FA, B > G > R) where copper wants R > G > B, and BACK is the old
 * #050505 ground rather than #0A0808. Neither is visible today (the tint is
 * near-white and the rim is overlaid onto the copper ramp, and BACK is never
 * sampled), which is why it went unnoticed. See "Known discrepancy" in the
 * README.
 */
const BACK: [number, number, number, number] = [5 / 255, 5 / 255, 5 / 255, 1]
const TINT: [number, number, number, number] = [244 / 255, 246 / 255, 250 / 255, 1]

/**
 * Chromatic dispersion — the iridescent fringe at each highlight-to-shadow edge.
 *
 * These phase-shift the red and blue stripe lookups against green, which is the
 * unshifted reference. Documented range is -1 to 1; at these values the offsets
 * are a few percent of a stripe's width, which is a split at the boundary rather
 * than a doubled stripe. Blue would have to reach ~0.77 before its lookup
 * cleared the strip entirely, so there is roughly 6x of headroom.
 *
 * Red stays the smaller of the two for two reasons that hold under copper:
 *
 *  - The shader already multiplies blue by 1.3 internally, so equal uniforms
 *    bias the fringe cool anyway.
 *  - A warm fringe on warm metal is invisible by construction. Overlaid onto
 *    `.surface-copper`, a red shift lands inside the ramp's own hue span and
 *    disappears; a blue shift is the only one with anywhere to go.
 */
const SHIFT_RED = 0.09
const SHIFT_BLUE = 0.12

const RESTING_SPEED = 0.55
const HOVER_SPEED = 1
const PRESS_SPEED = 2.2

interface LiquidMetalSurfaceProps {
  /** Drives shader speed. The parent owns the pointer events, not this layer. */
  state?: 'rest' | 'hover' | 'press'
  /**
   * How the surface composites.
   *
   * `rim` — full strength, `overlay` onto the copper ramp beneath. This is the
   * only path anything uses. Overlay is what makes the rim read as copper at
   * all: the shader's own output is near-greyscale whatever tint it is fed, so
   * unblended it painted silver over the brand fill. Overlay multiplies its
   * shadows into the ramp and screens its highlights out of it, which is how
   * light actually interacts with a coloured metal — the copper stays copper and
   * the speculars blow toward white.
   *
   * `screen` — half-strength over a flat accent fill, where the fill is a
   * guaranteed contrast floor because screen can only lighten. For metal with
   * text sitting ON it. No call site today.
   */
  blend?: 'screen' | 'rim'
  className?: string
}

export default function LiquidMetalSurface({
  state = 'rest',
  blend = 'screen',
  className = '',
}: LiquidMetalSurfaceProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<ShaderMount | null>(null)
  const reducedRef = useRef(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = motion.matches

    let mount: ShaderMount | null = null
    try {
      mount = new ShaderMount(
        host,
        liquidMetalFragmentShader,
        {
          u_colorBack: BACK,
          u_colorTint: TINT,
          u_image: undefined,
          u_isImage: false,
          u_repetition: 4,
          u_softness: 0.5,
          // Chromatic dispersion — bounded by the stripe geometry, not by the
          // composite: 0.00780 fract units of blue offset against a strip 2
          // that is 0.05 wide at worst. See above.
          u_shiftRed: SHIFT_RED,
          u_shiftBlue: SHIFT_BLUE,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_shape: 0,
          // Sizing uniforms are required; omitting them leaves the shader
          // sampling an undefined world box.
          u_fit: 2,
          u_scale: 8,
          u_rotation: 0,
          u_originX: 0.5,
          u_originY: 0.5,
          u_offsetX: 0,
          u_offsetY: 0,
          u_worldWidth: 0,
          u_worldHeight: 0,
        },
        undefined,
        // Speed 0 under reduced motion. ShaderMount stops its animation frame
        // entirely at 0, so a static surface costs nothing per frame — the
        // button still renders as metal, it just does not move.
        reducedRef.current ? 0 : RESTING_SPEED,
      )
      mountRef.current = mount
    } catch (error) {
      // A refused WebGL context must not take the button down with it. The
      // caller paints `.surface-copper` underneath, so failure degrades to a
      // static polished copper ring — still the brand, and still a real edge
      // clearing WCAG 1.4.11's 3:1 on both sides. Not a hole in the layout.
      console.error('LiquidMetalSurface: shader unavailable', error)
      return
    }

    const onMotionChange = () => {
      reducedRef.current = motion.matches
      mountRef.current?.setSpeed(motion.matches ? 0 : RESTING_SPEED)
    }
    motion.addEventListener('change', onMotionChange)

    return () => {
      motion.removeEventListener('change', onMotionChange)
      // `dispose`, not `destroy` — releases the GL context and cancels the RAF.
      mountRef.current?.dispose()
      mountRef.current = null
    }
  }, [])

  useEffect(() => {
    if (reducedRef.current) return
    const speed =
      state === 'press' ? PRESS_SPEED : state === 'hover' ? HOVER_SPEED : RESTING_SPEED
    mountRef.current?.setSpeed(speed)
  }, [state])

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      /*
       * `screen` at 50% is a legibility mechanism, not a look: screen can only
       * lighten, so the flat fill beneath is a guaranteed contrast floor no
       * matter what the shader paints. Contrast cannot be a property of an
       * animation, and the pattern's dark stripes go near-black whatever colours
       * it is fed.
       *
       * `rim` keeps full strength because the dispersion only survives there —
       * halving a 4px ring leaves a grey line. `overlay` costs nothing: it is a
       * per-channel composite rather than an attenuation, so it changes what the
       * shader lands ON, not how much of it lands.
       */
      className={`pointer-events-none absolute inset-0 overflow-hidden [&>canvas]:absolute [&>canvas]:inset-0 [&>canvas]:h-full [&>canvas]:w-full ${
        blend === 'screen' ? 'opacity-50 mix-blend-screen' : 'mix-blend-overlay'
      } ${className}`}
    />
  )
}
