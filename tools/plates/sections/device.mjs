import { NONE } from '../spec.mjs'

/**
 * A7 — the mobile app device, for `src/components/sections/MobileApp.tsx`.
 *
 * ## Why this plate has its own frame table
 *
 * Every other plate takes `BLEED` or `CARD` from `spec.mjs`, because every other
 * plate fills a section band or a `MediaCard`. This one fills neither. It fills
 * the box `MobileApp.tsx` reserves for the device, and that box is portrait by a
 * wide margin: `MediaPlaceholder kind="screen"` is `aspect-[9/19]` — **0.474** —
 * inside a `p-2` bezel, at `w-[16rem]` rising to `w-[20rem]` at `lg`.
 *
 * `CARD`'s crops run 0.60 → 1.08. Putting a 0.474 hole's content in a 1.07 frame
 * is not a tuning difference; the subject would have to shrink to a third of the
 * frame width for the aspect to survive the fit, and §5.3's "the extra frame must
 * be room, never stretched emptiness" would then be violated by construction.
 *
 * So: **9:19**, exactly. Not a number invented here — it is the aspect
 * art-direction.md §3's "Not briefed here" entry names for this asset ("Ship a
 * screenshot of the real product at 9:19, or ship the dark screen"), and it is
 * the aspect the page already reserves in markup, so the plate drops into the
 * hole that exists rather than asking for a new one. All four sizes are exact
 * multiples of 90×190.
 *
 * The ladder is short because the element is small: 256 CSS px at base, 272 at
 * `sm`, 288 at `md`, 320 at `lg`. Each crop is ~2.8–3.1× its element, which is
 * the DPR headroom the full-bleed plates get, not a scaled-down version of their
 * pixel counts.
 *
 * ## What the four crops actually vary, and why
 *
 * §5.3 exists to catch four exports of one photograph. The variable here is not
 * the dead zone — there isn't one, see below — it is **how much of the device
 * the section ever reveals**, which changes at every breakpoint and is written
 * down in `MobileApp.tsx`'s own class list:
 *
 * | Serves | `translate-y` | Device visible |
 * |---|---|---|
 * | base ≤639 | `30%` | top **70%** |
 * | `md` ≥768 | `43%` | top **57%** |
 * | `lg` ≥1024 | `48.5%` | top **51.5%** |
 *
 * The bottom of the image is clipped by the section, never seen, and the clip
 * gets deeper as the viewport grows. So as the crop widens the composition
 * climbs and tightens: the slab grows from 84% to 95.5% of frame width, its top
 * edge rises from y 0.895 to y 0.968, the lens goes from 26° to 19° (85mm →
 * ~135mm, §2.6's band end to end), and the lamp climbs with it so the hairline's
 * peak stays inside the slice that is actually on screen — frame y ≈ 0.62 on
 * mobile, ≈ 0.81 on wide. Four setups of one object, which is what the other six
 * plates are too.
 *
 * ## Dead zone: none, honestly
 *
 * `dead: NONE` on all four, and this is a measurement rather than a shortcut.
 * `MobileApp.tsx` centres its copy **above** the device and reserves the visible
 * slice for it (`md:pb-[25rem]` against a ~350px reveal, leaving ~50px of air),
 * and below `md` the device is a flow row whose `-mt-20` counterweight is
 * cancelled several times over by the `translate-y-[30%]` crop — the device's
 * visible top lands ~140px below the store CTAs. Nothing in this section is ever
 * set over this plate, at any width.
 *
 * §2.7's reserve is for copy that overlaps. Declaring a rectangle where none does
 * would not be conservatism: `uDead` attenuates radiance *before* the grade, and
 * the only band a reserve could plausibly cover here is the top of the frame,
 * which is exactly where the slab's top corner arc and the brightest run of its
 * chamfer live. A decorative dead zone on this plate would delete the plate.
 *
 * ## A note on the numbers below
 *
 * Lengths in `p[]` and in `keyPos` are **world** units, and one frame height is
 * 0.5 world units, not 1 — `a7-device.glsl` carries the derivation. This is the
 * single easiest thing to get wrong in this plate: build it to the frame space
 * README.md documents and the slab comes out at 1.85× the frame width, which
 * renders as a flat near-black rectangle with no edge in it anywhere.
 */

/**
 * 9:19 — see above. `resolveCrop` reads `[width, height]`, and every pair here
 * is `90 × 190` times 8, 9, 10 and 11.
 */
const DEVICE_9_19 = {
  mobile: [720, 1520],
  tablet: [810, 1710],
  desktop: [900, 1900],
  wide: [990, 2090],
}

export default {
  id: 'device',
  shader: 'a7-device.glsl',
  frames: DEVICE_9_19,
  /**
   * Written to describe the object, not the product. The string it replaces —
   * `MediaPlaceholder`'s "The ThinqProfit app running on a phone" — would be a
   * false description of a dark screen, and alt text is the one place a
   * fabricated interface can ship without anyone rendering one.
   */
  alt: 'A machined aluminium slab standing in darkness, its dark glass face unlit and one long edge caught by a single soft light.',
  /**
   * Still. §2.3 rule 3 would permit a settling loop, but this device stands in
   * a band whose whole job is to be the page's material break (`MobileApp.tsx`'s
   * header comment) — a moving object there re-joins the two media sections it
   * exists to separate.
   */
  motion: null,
  crops: {
    /*
     * ≤425. The element is `w-[16rem]` and 70% of it is on screen, the most of
     * any breakpoint — so this is the crop that shows most of the slab and it is
     * therefore the one that has to be smallest in frame. Widest lens of the
     * four at 26° (~85mm), which also gives the corner radii the most fall.
     */
    mobile: {
      dead: NONE,
      exposure: 0.6,
      /* No haze. §2.4's volumetric lift is keyed off `dot(rd, uKeyDir)`, and at
         71° off the lens axis that dot is negative across the whole frame — the
         term cannot fire. A number here would be decoration pretending to be
         atmosphere. */
      haze: 0,
      pan: [0, 0],
      key: [-0.938, 0.134, 0.321],
      /*
       * A lamp, not a direction. §2.4 wants "a gradient across the surface
       * rather than a hotspot in the middle of it", and on a face this flat only
       * distance falloff can produce one — a directional key gives every point
       * on the glass the same normal, the same light vector and therefore the
       * same tone (core.glsl, `uKeyRange`).
       *
       * Its height is the crop's real variable: the chamfer's specular peaks
       * where the half-vector meets the edge's normal, at roughly
       * `y = lampY / (1 + lampDistance / cameraDistance)`. 0.075 here lands it
       * at frame y ≈ 0.62 — the middle of the 70% this breakpoint shows.
       */
      keyPos: [-0.525, 0.075, 0.18],
      keyRange: 0.56,
      fov: 26,
      p: [
        0.84 /* width, frame fraction */, 0.895 /* top edge, frame y */,
        0.31 /* half-height, world */, 0.3 /* corner radius / half-width */,
        0.013 /* half-depth */, 0.00275 /* fillet — the hairline */,
        0.0056 /* rail */,
      ],
    },
    /*
     * 426–768. Straddles `sm` (`w-[17rem]`, 70% shown) and the `md` step at
     * exactly 768 (`w-[18rem]`, 57% shown), so like every tablet crop in this
     * set it is composed for the more conservative of the two: the slab is
     * pushed up and the lamp with it, so nothing load-bearing sits below frame
     * y 0.43.
     */
    tablet: {
      dead: NONE,
      exposure: 0.65,
      haze: 0,
      pan: [0, 0],
      key: [-0.924, 0.21, 0.319],
      keyPos: [-0.55, 0.125, 0.19],
      keyRange: 0.6,
      fov: 24,
      p: [0.885, 0.925, 0.31, 0.3, 0.013, 0.0026, 0.0054],
    },
    /*
     * 769–1279. `md`/`lg`: 57% falling to 51.5% shown. The reference
     * composition, and the one this plate was art-directed against — slab at
     * 92.5% of frame width, top edge at y 0.95, hairline peaking at frame
     * y ≈ 0.77 at sRGB 165 with the glass running 23 → 15 beneath it and the
     * room at 5.
     */
    desktop: {
      dead: NONE,
      exposure: 0.7,
      haze: 0,
      pan: [0, 0],
      key: [-0.91, 0.264, 0.317],
      keyPos: [-0.575, 0.167, 0.2],
      keyRange: 0.64,
      fov: 22,
      p: [0.925, 0.95, 0.31, 0.3, 0.013, 0.0025, 0.0052],
    },
    /*
     * ≥1280. `lg` throughout: only the top 51.5% is ever on screen, so this is
     * the tightest crop of the four — the slab nearly fills the frame width, its
     * top edge sits at y 0.968, and the lens is at 19° (~135mm), the longest in
     * §2.6's band. Flattest perspective, least fall on the corner radii, and the
     * fillet narrows with it so the hairline stays a hairline at 990px wide.
     */
    wide: {
      dead: NONE,
      exposure: 0.72,
      haze: 0,
      pan: [0, 0],
      key: [-0.907, 0.283, 0.312],
      keyPos: [-0.61, 0.19, 0.21],
      keyRange: 0.68,
      fov: 19,
      p: [0.955, 0.968, 0.31, 0.3, 0.013, 0.0024, 0.005],
    },
  },
}
