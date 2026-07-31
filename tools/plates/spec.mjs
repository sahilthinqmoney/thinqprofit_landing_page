/**
 * Shared vocabulary for the plate registry — docs/art-direction.md §3 and §4.1, transcribed to
 * numbers a renderer can execute.
 *
 * Everything here is a quotation, not an invention. Frame sizes come from
 * §4.1's per-breakpoint table, dead-zone rectangles from §2.7's table, and the
 * per-crop composition notes ("form pushed hard right and down", "stack
 * compressed to 8 plates") are what the `p[]` parameters encode. Where a value
 * is not in that document it is derived from something that is, and the comment
 * says which.
 *
 * The four crops are four compositions, not four exports (§5.3). That is the
 * whole reason this file is a table of camera positions rather than a table of
 * aspect ratios: reframing one render into four ratios is the exact failure
 * §5.3 tells you to detect, and it is only avoidable if the crops are separate
 * renders from the start.
 */

/** Frame sizes, §4.1. Full-bleed sections and `MediaCard` differ. */
export const BLEED = {
  mobile: [900, 1600],
  tablet: [1200, 1600],
  desktop: [1920, 1280],
  wide: [2560, 1440],
}

export const CARD = {
  mobile: [800, 1340],
  tablet: [1100, 1300],
  desktop: [1500, 1400],
  wide: [1700, 1580],
}

export const CROPS = ['mobile', 'tablet', 'desktop', 'wide']

/**
 * §2.7 states dead zones with y measured from the top of the frame; GL uv has
 * its origin bottom-left. Converting in one place rather than at each call site
 * means the table below can be read straight against the document.
 */
export const zone = (x0, yTop, x1, yBottom) => [x0, 1 - yBottom, x1, 1 - yTop]

/** No second reserve. `rectInside` returns 0 for a degenerate rect. */
export const NONE = [0, 0, 0, 0]

/**
 * `MediaCard`'s CTA patch: "34% × 14% of the card, anchored to the bottom-left
 * corner" (§A2 dead zone). Identical on A2 and A3, so it is named once.
 */
export const CTA_PATCH = [0, 0, 0.34, 0.14]

/**
 * Defaults every crop inherits. Each is a rule from the document rather than a
 * taste call, so overriding one in a crop should be rare and commented:
 *
 *  - `fov` 22° ≈ a 100mm lens on full frame — inside §2.6's 85–135mm band.
 *  - `keySoft` 0.34 rad ≈ a 4×6ft softbox at working distance (§2.4).
 *  - `haze` is §2.4's "slight lift in the air near the key", not a beam.
 *  - `grain` 0.008 ≈ 2 sRGB levels peak-to-peak, the top of §4.1's 1–2%.
 *  - `event` is off. §2.3 rule 2 permits it on exactly two plates.
 */
export const DEFAULTS = {
  fov: 22,
  roll: 0,
  keySoft: 0.34,
  keyGain: 1.0,
  /* Directional by default. Give `keyPos` and a non-zero `keyRange` to turn the
     key into a real lamp with falloff — see core.glsl's uKeyRange note. */
  keyPos: [0, 0, 0],
  keyRange: 0,
  /* §2.4 permits at most one hard accent per plate, and most plates want none.
     Off by default so a rim has to be asked for. */
  rim: [0, 0, 1],
  rimSoft: 0.05,
  rimGain: 0,
  exposure: 1.0,
  haze: 0.5,
  grain: 0.008,
  deadFeather: 0.14,
  deadFloor: 0.03,
  deadFloor2: 0.03,
  dead2: NONE,
  event: [0, 0, 0, 0],
  p: [],
}

/**
 * Frame-space camera.
 *
 * The camera always sits on +Z looking straight down −Z, and its distance is
 * solved from the focal length so that **the plane z = 0 is exactly one unit
 * tall in frame**: world y runs −0.5 (bottom edge) to +0.5 (top edge), and
 * world x runs ±0.5 × aspect. `pan` slides that window.
 *
 * Two things fall out of this, and both are the reason it is worth doing:
 *
 *  1. **The compositions in §3 become directly writable.** "Nothing structural
 *     crosses x=60%" is `x < 0.1 × aspect` in world units instead of a camera
 *     solve. "Intersection at 60% width, 65% height" is a coordinate. Six
 *     plates get art-directed against a document that speaks in frame
 *     percentages, and this is what stops that becoming trial and error.
 *  2. **Perspective stays flat**, which §2.6 requires — a straight-on camera
 *     with a long lens has no converging verticals to correct, so depth has to
 *     come from light and z-offset, exactly as §1 asks. It is not possible to
 *     accidentally shoot one of these from a dramatic angle.
 *
 * The lens is still real: `fov` sets the distance, so 18° reads as a 135mm
 * compression and 26° as an 85mm, and a form pushed to z = −1 falls away at the
 * rate that lens would give it.
 */
function solveCamera(fov, pan) {
  const distance = 0.5 / Math.tan((fov * Math.PI) / 360)
  const [x, y] = pan
  return { pos: [x, y, distance], target: [x, y, 0] }
}

/** Merges `DEFAULTS` under a crop and resolves its frame size and camera. */
export function resolveCrop(plate, crop) {
  const spec = plate.crops[crop]
  if (!spec) throw new Error(`${plate.id}: no crop "${crop}"`)
  const [width, height] = plate.frames[crop]
  const p = new Float32Array(24)
  ;(spec.p ?? DEFAULTS.p).forEach((v, i) => {
    p[i] = v
  })
  const merged = { ...DEFAULTS, ...spec, width, height, p }
  const cam = solveCamera(merged.fov, merged.pan ?? [0, 0])
  return { ...merged, cam, aspect: width / height }
}
