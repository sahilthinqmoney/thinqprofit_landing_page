import { useEffect, useRef } from 'react'
import { ShaderMount, liquidMetalFragmentShader } from '@paper-design/shaders'

/**
 * A live liquid-metal surface, sized by its parent.
 *
 * Adapted from the community `liquid-metal-button` component, with four
 * substantive changes. They are all corrections, not preferences:
 *
 *  1. **`dispose()`, not `destroy()`.** The original calls `destroy()`, which
 *     does not exist on `ShaderMount` — so every unmount leaked a WebGL context
 *     and its animation frame. Under React 19's development double-invoke that
 *     leak happens on first mount.
 *  2. **All required uniforms are supplied.** `LiquidMetalUniforms` requires
 *     `u_colorBack`, `u_colorTint`, `u_isImage` and the nine
 *     `ShaderSizingUniforms`; the original omits every one of them and relies on
 *     undefined uniforms defaulting to zero.
 *  3. **Neutral, and specifically not a hue.** The brand has no colour left in
 *     it, so this surface is the *motion* half of how the primary action is
 *     marked and the flat `bg-accent` under it is the *luminance* half. Tinting
 *     the shader toward any hue would hand the action a colour back, and colour
 *     on this page means gain, loss or warning — nothing else.
 *  4. **No fixed pixel size.** The original hardcodes 142×46. `ShaderMount`
 *     matches its parent element, so the surface inherits whatever the button's
 *     own padding and type produce, at any size, in any language.
 */

/**
 * The alloy. Both values are neutral tokens; neither carries a hue.
 *
 * `u_colorTint` is composited with **colour burn** — `1 - (1 - ch) / tint` —
 * which can only darken, and the shader's own dark stripe is 0.1. Solving for
 * the clip point: `(1 - 0.1) / tint >= 1` for any `tint <= 0.9`, so a channel
 * below 0.9 crushes that stripe to pure black and the surface stops reading as
 * metal. `(0.9, 1.0]` is therefore the entire usable band.
 *
 * Which is why the tint is `accent-hover` (0.957, 0.965, 0.980) rather than
 * `accent` itself: accent's red channel is 0.906, six thousandths above the clip
 * point, so it burns red to 0.007 — black in all but name — and burns it harder
 * than the other two, which drags every midtone cyan. accent-hover keeps the
 * same cool channel order as the alloy token (R < G < B) with margin: shadows
 * land at 0.059/0.067/0.082 instead of holing out, highlights stay at 0.979.
 * Bright at every point in the cycle, with a faint cool cast in the shadows.
 *
 * `u_colorBack` is only sampled where the shape's coverage drops below 1. At
 * `u_scale: 8` the circle is zoomed far outside the element, coverage is 1 at
 * every pixel, and this colour is never reached — do not spend time tuning it.
 * It is the ink ground because ink is the identity element for `screen`: if the
 * geometry ever changes and the shape stops covering, the uncovered region
 * composites to exactly the flat `bg-accent` underneath instead of ringing the
 * label with a halo, which is what a light `colorBack` would do (it screens to
 * ~0.95 against a 0.91 fill).
 */
const BACK: [number, number, number, number] = [5 / 255, 5 / 255, 5 / 255, 1]
const TINT: [number, number, number, number] = [244 / 255, 246 / 255, 250 / 255, 1]

/**
 * Chromatic dispersion — the reason the theme is called chromatic.
 *
 * These phase-shift the red and blue stripe lookups against green, throwing an
 * iridescent fringe at every highlight-to-shadow edge. Documented range is
 * -1 to 1. They were held at 0.08 to *suppress* the fringe, because red
 * fringing on a gold button read as a warning. With gold gone that reasoning is
 * dead and the fringe is the point, so the value has to come up — but how far is
 * arithmetic, not taste, because this layer composites at `opacity-50
 * mix-blend-screen`:
 *
 *   final = base + 0.5 * (1 - base) * src
 *
 * Against `bg-accent` that coefficient is 0.047, so the composite divides any
 * channel split the shader produces by roughly 21x. At 0.08 the widest split
 * reaching the screen was 1.6/255: the iridescence was not subtle, it was
 * absent. At 0.16/0.20 it is 3.7/255 — visible as a shimmer on a large
 * near-white field, which is exactly where a small chroma difference shows most,
 * and an order of magnitude short of anything that could be mistaken for
 * `--color-gain` or `--color-loss`. 0.30 lands at 6.1/255, where the fringe
 * starts reading as a tint rather than as light.
 *
 * Red gets the smaller of the two deliberately. The shader already multiplies
 * blue dispersion by 1.3 internally, so equal uniforms bias the fringe cool
 * already; pushing it further is both what real dispersion does — blue refracts
 * further — and the safer direction here, since a red fringe is the one hue on
 * this page that could be misread as a loss.
 */
const SHIFT_RED = 0.16
const SHIFT_BLUE = 0.2

const RESTING_SPEED = 0.55
const HOVER_SPEED = 1
const PRESS_SPEED = 2.2

interface LiquidMetalSurfaceProps {
  /** Drives shader speed. The parent owns the pointer events, not this layer. */
  state?: 'rest' | 'hover' | 'press'
  /**
   * How the surface composites.
   *
   * `screen` — half-strength over a flat alloy fill, where the fill is a
   * guaranteed contrast floor because screen can only lighten. Use when text
   * sits *on* the metal.
   *
   * `rim` — full strength, no blending. Use when the metal is only visible as a
   * ring around a dark core, so nothing reads on top of it and there is no
   * contrast floor to protect. Half strength here would wash the ring out to
   * nothing, which is the opposite of the problem `screen` solves.
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
          // Chromatic dispersion — bounded by the composite maths, see above.
          u_shiftRed: SHIFT_RED,
          u_shiftBlue: SHIFT_BLUE,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_shape: 1,
          // Sizing uniforms are required; omitting them leaves the shader
          // sampling an undefined world box.
          u_fit: 2,
          u_scale: 8,
          u_rotation: 0,
          u_originX: 0.5,
          u_originY: 0.5,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
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
      // caller renders the flat alloy fill underneath, so failure degrades to
      // the ordinary button rather than to a hole in the layout.
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
       * `screen` at 50% is a legibility mechanism rather than a look. Screen can
       * only lighten, so whatever the shader paints, a flat `bg-accent` beneath
       * it is the floor — ink text then holds 16.78:1 against the darkest
       * reachable pixel. Two earlier attempts tried to solve that by choosing
       * better shader colours; both failed, because the pattern's dark stripes
       * go near-black regardless of the colours fed in. Contrast cannot be a
       * property of the animation.
       *
       * `rim` skips all of it. There the metal is a ring around a dark core,
       * nothing reads on top of it, and the dispersion — the whole point of a
       * chromatic theme — only survives at full strength. Halving a 4px ring
       * leaves a grey line.
       */
      className={`pointer-events-none absolute inset-0 overflow-hidden [&>canvas]:absolute [&>canvas]:inset-0 [&>canvas]:h-full [&>canvas]:w-full ${
        blend === 'screen' ? 'opacity-50 mix-blend-screen' : ''
      } ${className}`}
    />
  )
}
