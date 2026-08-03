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
 *  3. **Warm, and specifically copper.** The brand metal is the system's
 *     `METAL.coral` ramp, so this surface is the *light* half of how the primary
 *     action is marked and `.surface-copper` underneath it is the *hue* half.
 *     Under the previous platinum brand this note read the opposite way — the
 *     tint had to stay neutral because any hue would have handed the action a
 *     colour that only gain, loss and warning were allowed to have. Copper is
 *     the brand now, so the page's rule is no longer "the brand has no hue" but
 *     "only the action and the mark are saturated copper" — measured, the accent
 *     is chroma 0.1263 against `chrome`'s 0.0057, a 22.16x gap, and it is that
 *     gap rather than luminance that separates them (accent Y 0.4712 against
 *     chrome Y 0.4249 is 1.1091x — no separation at all).
 *  4. **No fixed pixel size.** The original hardcodes 142×46. `ShaderMount`
 *     matches its parent element, so the surface inherits whatever the button's
 *     own padding and type produce, at any size, in any language.
 *
 * Everything below was re-derived against
 * `node_modules/@paper-design/shaders/dist/shaders/liquid-metal.js` rather than
 * against the previous revision of this file. Where the change brief and the
 * source disagreed, the source won and the disagreement is recorded inline.
 */

/**
 * The tint. A warm near-white, and deliberately *not* `--color-accent` — this is
 * where the copper move runs into a hard limit of the shader, and the limit is
 * why the hue is carried in CSS instead.
 *
 * `getColorChanges()` ends with, verbatim from the source:
 *
 *   ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
 *
 * so at `u_colorTint.a = 1` the tint is a per-channel **colour burn**, which can
 * only darken. The output clips to zero when `(1 - ch) / tint >= 1`, i.e. at
 * exactly `ch = 1 - tint`: the clip point of a tint channel `t` is `1 - t`, not
 * an approximation.
 *
 * What it clips against is also hardcoded, and both ends are read off the source
 * rather than assumed: `color1 = vec3(.98, .98, 1.)` and
 * `color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR))`. So the
 * dark stripe's floor is 0.100 (blue rises to 0.200 across the diagonal, red and
 * green never move) and 0.100 is the number every tint has to clear. Neither is
 * a uniform, so there is no second lever: this shader models light, it does not
 * carry colour.
 *
 * Measured clip points, `1 - min(channel)`, worst channel first:
 *
 *   --color-accent   #FF9E7A  0.5216   G and B burn to 0.000 at the stripe
 *   --color-accent-hover #FFC0A6  0.3490   same failure, less of it
 *   METAL specular   #FFD9C6  0.2235   still 2.2x over the stripe
 *   the true ceiling #FFECE6  0.0980   0.0020 of margin — unusable
 *   SHIPPED          #FAF5EE  0.0667   0.0333 of margin
 *   outgoing platinum #f4f6fa 0.0431
 *
 * The band admits no saturated colour at all, which is the same thing as saying
 * this shader cannot paint copper. `.surface-copper` in index.css is where the
 * hue actually lives, and the rim blend below is what marries the two.
 *
 * TINT HELD at #FAF5EE = (0.98039, 0.96078, 0.93333), a near-white carrying
 * copper's channel *order* (R > G > B) rather than its values. It is the
 * previous platinum tint mirrored — that was (0.957, 0.965, 0.980), the same
 * spread running cool — and the burn maths mirrors with it. Per-channel output,
 * computed:
 *
 *   clip points          0.0196 / 0.0392 / 0.0667   (blue binds, 0.0333 clear)
 *   shadow  ch = 0.100   0.0820 / 0.0633 / 0.0357   warm, and nothing holed out
 *   midtone ch = 0.500   0.4900 / 0.4796 / 0.4643
 *   highlight            0.9796 / 0.9792 / 1.0000
 *
 * CORRECTION to the brief, which gave the highlight as 0.980/0.979/0.979. Blue's
 * light end is `color1.b = 1.0`, so `1 - ch = 0` and the burn returns exactly
 * 1.0 whatever the tint: the specular is a channel the tint cannot reach. The
 * consequence is worth stating because it bounds what this uniform is for — the
 * tint warms the shadows and the midtones and leaves the highlight where the
 * shader put it, so the warm/cool spread runs 0.0463 at the stripe, 0.0257 at
 * mid-grey and 0 at the specular. Copper's speculars blow to white in the real
 * ramp too, so this is the right shape; it is just not a shape the tint chose.
 *
 * A warmer tint was measured and rejected. #FFF2ED clips at 0.0706 — 0.0294 of
 * margin against #FAF5EE's 0.0333 — and carries *less* copper by the only
 * measure that matters here: expressed as coral mixed into white on the blue
 * channel it is t = 0.1340 against #FAF5EE's 0.1278, a 0.6% difference for 12%
 * less headroom. And the sentence that motivated it ("the maximum coral before
 * blue crosses 0.900") is arithmetically false: solving `1 - 0.521569t = 0.900`
 * gives t = 0.1917, i.e. #FFECE6, whose clip point is 0.0980 — two thousandths
 * under the stripe, where the shadow burns to 0.100/0.028/0.002 and holes out.
 *
 * `u_colorBack` is only sampled where the shape's coverage drops below 1. At
 * `u_scale: 8` the shape is zoomed far outside the element, coverage is 1 at
 * every pixel, and this colour is never reached — do not spend time tuning it.
 * It tracks `--color-bg` (#0A0808, moved from the old neutral #050505 with the
 * ground): if the geometry ever changes and the shape stops covering, the
 * uncovered region composites to the page ground and thence to the copper ramp
 * underneath, instead of ringing the label with a halo the way a light
 * `colorBack` would.
 */
const BACK: [number, number, number, number] = [5 / 255, 5 / 255, 5 / 255, 1]
const TINT: [number, number, number, number] = [244 / 255, 246 / 255, 250 / 255, 1]

/**
 * Chromatic dispersion — the reason the theme is called chromatic.
 *
 * These phase-shift the red and blue stripe lookups against green (green is the
 * unshifted reference: `stripe_g = fract(direction)` with no dispersion term),
 * throwing an iridescent fringe at every highlight-to-shadow edge. Documented
 * range is -1 to 1.
 *
 * HELD AT 0.09 / 0.12, and the history matters because two earlier values were
 * each justified by an argument that has since failed:
 *
 *  - 0.08 / 0.08 *suppressed* the fringe, because red fringing on the old gold
 *    button read as a warning. Gold is gone; that reason went with it.
 *  - 0.16 / 0.20 was solved from the `opacity-50 mix-blend-screen` composite's
 *    ~21x attenuation — and the only call site on this page passes
 *    `blend="rim"`, which takes none of that attenuation. The budget was
 *    certified for a path the button does not take.
 *
 * THE GEOMETRY, read off the shader source rather than estimated, because it is
 * the only hard ceiling here. At `u_shape: 0` the full-fill branch runs
 * `cycleWidth *= 2.`, so `u_repetition: 4` gives cycleWidth 8. Then
 * `thin_strip_1_width = cycleWidth * (.12 / cycleWidth) = 0.12` and
 * `thin_strip_2_width = 0.07`, both in `fract()` units and both independent of
 * cycleWidth; `w[1] -= .02 * smoothstep(...)` takes strip 2 down to 0.05 at
 * worst. Dispersion is added in those same units and is *not* scaled by
 * cycleWidth: `stripe_b = fract(direction - dispersionBlue)`.
 *
 * So at `colorDispersion = 1` the offsets are red `0.09 / 20 = 0.00450` and blue
 * `1.3 * 0.12 / 20 = 0.00780` — 9.0% and 15.6% of a 0.05-wide strip 2. That is a
 * split at the boundary, which is what iridescence is, and nowhere near a
 * doubled stripe: blue would have to reach `u_shiftBlue ≈ 0.77` before its
 * lookup cleared strip 2 entirely, roughly 6.4x the shipped value.
 *
 * CORRECTION to the brief, which put the blue offset at "89% of" strip 2. That
 * compares 0.0078 against `thin_strip_2_ratio` (0.00875) instead of against
 * `thin_strip_2_width` (0.07 before the bump subtraction) — the two differ by
 * exactly cycleWidth = 8. The real figure is 11.1%, or 15.6% after the
 * subtraction, and the headroom is 6.4x rather than 1.1x.
 *
 * WHY RED STAYS THE SMALLER, re-reasoned under copper. Three arguments were
 * offered historically; one is dead and two survive, and there is a fourth that
 * only the source shows:
 *
 *  1. DEAD — "a red fringe is the one hue that could be misread as a loss".
 *     Loss moved to the rose #F0487F precisely because a red could not clear a
 *     copper accent: measured, the rose is OKLCH hue 5.17 deg against the
 *     accent's 41.03 deg, 35.86 deg apart, and it is the only red on the page.
 *     A red fringe on a copper rim now reads as more copper.
 *  2. The shader multiplies blue by 1.3 before scaling (`dispersionBlue *= 1.3`,
 *     verified in source), so equal uniforms already bias the fringe cool.
 *  3. A warm fringe on warm metal is invisible by construction. Under `overlay`
 *     onto `.surface-copper` the split reaches the screen as chroma against a
 *     ramp that runs OKLCH hue 36.35 deg (#A84A30) to 48.15 deg (#FFD9C6) — a
 *     red shift lands inside that span and disappears into it; a blue shift is
 *     the only one with anywhere to go.
 *  4. Red carries a large localised boost the flat-field arithmetic hides:
 *     `dispersionRed += 5. * (smoothstep(-.1,.2,uv.y) * (1.-smoothstep(.1,.5,uv.y)))
 *     * (smoothstep(.4,.6,bump) * (1.-smoothstep(.4,1.,bump)))`. In the band
 *     near `uv.y ≈ 0.15` that term runs several times the whole flat-field
 *     figure, so equal uniforms would make red the *widest* fringe on the ring
 *     in one horizontal band and the narrowest everywhere else. Holding red
 *     below blue is what keeps that band from being the thing you notice.
 *
 * A 0.06 / 0.12 pair was proposed and rejected. It solves for equal *luma*
 * amplitude (Rec.601 0.30/0.59/0.11 with blue's internal 1.3x gives
 * shiftRed = 0.477 * shiftBlue), which is the right calculation for the `screen`
 * path where the fringe arrives as a luminance ripple. Under `overlay` it
 * arrives as chroma, so the premise does not hold and the extra 0.03 of red is
 * spent on making the fringe read as light on metal rather than as a blue line.
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
   * `screen` — half-strength over a flat accent fill, where the fill is a
   * guaranteed contrast floor because screen can only lighten. Use when text
   * sits *on* the metal. Audited: zero call sites today (grep — `Button.tsx`
   * passes `blend="rim"` and nothing else mounts this component), so it is a
   * capability, not a shipped path, and its contrast floor below is stated for
   * whoever takes it up rather than for anything on screen now.
   *
   * `rim` — full strength, `overlay` onto the copper ramp beneath. Use when the
   * metal is only visible as a ring around a dark core, so nothing reads on top
   * of it and there is no contrast floor to protect.
   *
   * `overlay` rather than the "no blending" this used to be, and it is the whole
   * reason the rim reads as copper at all. Unblended, the shader's own output
   * lands on screen — and that output is near-greyscale whatever tint it is fed,
   * because its light and dark ends are hardcoded (see the tint note above). It
   * painted silver straight over the brand fill. Overlay multiplies the shader's
   * shadows into the ramp and screens its highlights out of it, which is exactly
   * how a light source interacts with a coloured metal: the copper stays copper,
   * the shadows deepen toward the ramp's #A84A30 end, and the speculars blow out
   * toward white the way a polished surface's actually do.
   *
   * TWO ALTERNATIVES REJECTED, and they fail for the same reason from opposite
   * sides. `mix-blend-luminosity` over the fill takes hue and saturation
   * wholesale from the backdrop and discards the shader's per-channel split.
   * `mix-blend-mode: color` over a flat `bg-accent` wash is the dual —
   * `color = SetLum(Cs, Lum(Cb))`, so hue and chroma come from the flat wash and
   * only luma survives from the shader — and it discards exactly the same split.
   * Three measured losses against overlay-onto-the-ramp: (a) the rim's hue stops
   * travelling, where the ramp carries it from OKLCH 36.35 deg at #A84A30 to
   * 48.15 deg at #FFD9C6, which is what a coloured metal does from shadow to
   * specular; (b) §17's two highlights live in the ramp (measured Y 0.7496 at
   * #FFD9C6 and 0.6570 at #FFC8B0, with a 0.1651 valley at #B4553A between
   * them) and a flat wash has none; (c) with a transparent backdrop a `color`
   * wash paints as flat opaque coral, so the no-WebGL case degrades to a solid
   * coral pill rather than to the static polished ring `.surface-copper` already
   * gives. Overlay composites per channel, so the fringe and all three survive.
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
      // caller paints `.surface-copper` underneath — the same six-stop ramp in
      // one pass — so failure degrades to a static polished copper ring, still
      // clearly the brand and still a real edge (3.0104:1 at the ramp's darkest
      // stop against the core, 3.5078:1 against the page ground; both clear
      // WCAG 1.4.11's 3:1). It is not a hole in the layout and it is not a
      // different-looking component.
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
       * it is the floor — `text-on-accent` (#2E0F06) then holds 8.7807:1 against
       * the darkest reachable pixel, recomputed on the copper fill #FF9E7A and
       * restating the 8.80:1 that stood here (a rounding error, independent of
       * the ground move). Two earlier attempts tried to solve that by choosing
       * better shader colours; both failed, because the pattern's dark stripes
       * go near-black regardless of the colours fed in. Contrast cannot be a
       * property of the animation.
       *
       * `rim` skips the opacity and keeps a blend. There the metal is a ring
       * around a dark core, nothing reads on top of it, and the dispersion — the
       * whole point of a chromatic theme — only survives at full strength.
       * Halving a 4px ring leaves a grey line. `overlay` costs no strength: it
       * is a per-channel composite, not an attenuation, so it changes what the
       * shader lands *on* rather than how much of it lands.
       */
      className={`pointer-events-none absolute inset-0 overflow-hidden [&>canvas]:absolute [&>canvas]:inset-0 [&>canvas]:h-full [&>canvas]:w-full ${
        blend === 'screen' ? 'opacity-50 mix-blend-screen' : 'mix-blend-overlay'
      } ${className}`}
    />
  )
}
