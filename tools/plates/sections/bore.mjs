import { BLEED, zone } from '../spec.mjs'

/**
 * A11 — Bore. docs/art-direction.md §2.1–§2.7, §5.2, §5.3.
 *
 * Backs the section headed *"Options live on the chart."* — greeks, OI at the
 * strikes, max pain, GEX, IV skew and a payoff builder, all of it drawn *into* the
 * chart rather than parked in a panel beside it. So the plate is one part with one
 * feature machined into it, and the feature is three registered levels of depth in
 * a single surface. It is emphatically **not** a strike ladder, an option chain or
 * anything with rows: §2.1 bans charts, ladders and grids outright and §5.2 bans
 * the softer version — "a repeating rhythm that resolves into bars at 25% zoom".
 * A counterbore is the one machined feature that says *levels* without saying
 * *rows*, and it says them radially, which is the other half of its job: the three
 * plates it ships beside are all a lateral cut in a flat face, and four of those
 * is one photograph shown four times.
 *
 * Six things here are not per-crop taste and are stated once.
 *
 *  - **The key is on camera-left, and it is a lamp.** The copy parks right
 *    (`place="right"`, §2.7's Platform row: x 44–100%, y 14–86%), so the reserve is
 *    the right of every landscape frame and the light has to come from the side
 *    the subject is on. `key` is the direction *toward* the light, so its x is
 *    negative on all four. It is given `keyPos`/`keyRange` rather than left
 *    directional because the subject is one large near-flat face: a source at
 *    infinity puts a single even tone on a plane and there is then no gradient at
 *    all, only a silhouette — and this plate has no silhouette by construction.
 *    Inverse-square across the face is the whole depth cue (§2.4, and core.glsl's
 *    `uKeyRange` note).
 *
 *  - **The lamp sits outside the bore's own footprint on every crop.** That is a
 *    hard rule here and the previous pass broke it: with the lamp inside the
 *    mouth, the deepest floor was the closest surface to the source, the levels
 *    lit in the wrong order, and the render came back as a glowing dome — §2.4's
 *    "a hotspot in the middle of a surface" rather than "a gradient across it",
 *    which is also the single fastest way one of these plates reads as a cheap
 *    render. Light entering a counterbore from beyond its rim is what makes the
 *    face the brightest thing, each floor a stop under the one above it, and the
 *    bottom of the bore ink. Every `keyPos` below is checked against
 *    `|lamp − axis| > outerRadius`.
 *
 *  - **The reserve is held by the lamp, not by the mask.** Every lamp sits 0.13
 *    world units off the face, so its inverse-square falloff has already reached
 *    ink four or five frame-tenths away and `deadFloor` sits at 0.22–0.30 doing
 *    almost nothing. The failure this avoids is documented on a8-terminal: an
 *    early pass there ran `deadFloor` at 0.06, a 94% attenuation, and the
 *    rectangle printed its own shape into the frame — §2.7's "a hard terminator
 *    reads as a matte line", arriving from the enforcement side. A dead zone whose
 *    *shape* is visible is a lit box, and a lit box is worse than a bright plate.
 *
 *  - **No rim, and no second light event.** §2.4 permits one hard accent per
 *    plate, "used to draw a single chrome edge line where a form has to separate
 *    from the background". There is no background here — the part fills the frame
 *    — so there is nothing to separate. §2.3 rule 2's second light event belongs
 *    to Onboarding and Final CTA and is off here (`event` defaults to zero).
 *
 *  - **The bore's axis is off-frame on all four crops.** That is the anti-logo
 *    rule and it is worth more than any lighting decision in this file: concentric
 *    rings centred in a frame is a roundel, and no amount of grazing key rescues
 *    one. What is in shot is 60–90° of arc belonging to something much larger.
 *
 *  - **Nothing ascends (§2.1).** The axis is placed below or beside the visible
 *    arc on every crop, so the limb in shot runs downhill left-to-right and the
 *    crest — the one part of a rim that turns upward — is off-frame. The energy is
 *    radial and downward-settling, which is what §2.1 permits in place of the
 *    diagonal it forbids.
 *
 * And what is emphatically per-crop: **where the axis sits, how far the camera is
 * from the bench, which way the part leans, where the lamp is and what lens is
 * on.** All five move between breakpoints and they move in the direction §2.7's
 * table requires — the reserve is a right column on the two landscape crops, a top
 * band on mobile, and both at once on tablet (the 768px edge case). §5.3's
 * signature test only catches the blatant version of "four exports of one
 * photograph"; the honest version of passing it is that desktop and wide are
 * *different distances* as well as different framings — desktop is the close one,
 * with three rims running the full height of the left edge, and wide is the pulled-
 * back one, with the whole feature folded into the bottom-left corner.
 */

/**
 * The part. Shared by every crop, in world units, because it is one object: a
 * plate whose subject changes size between breakpoints is four parts photographed
 * once each rather than one part photographed four times (§5.3). What varies per
 * crop is where the *camera* is (`z`, `fov`), which is a photographer's decision
 * and not a property of the part.
 *
 * There is no width or height here, deliberately — the shader sizes the face off
 * the frame so it has no silhouette on any aspect. A world constant that covers
 * 16:9 is three times what 9:16 needs, and one that fits 9:16 leaves an edge in
 * shot on 16:9, which is a composition failure no gate can see (a8-terminal hit
 * exactly that, twice).
 */
const PART = {
  /*
   * 0.38 world. Read at the four crops' subject distances this is 0.44–0.75 frame
   * *heights* of radius — so the bore is between one and one-and-a-half frame
   * heights across and cannot fit inside any of the four frames. That is the
   * number that stops this being a roundel, and the earlier pass arrived at it the
   * expensive way: a first attempt at a radius that fitted comfortably inside the
   * desktop frame read as a bullseye at 25% zoom no matter where it sat or how it
   * was lit. A circle the eye can close is a logo.
   */
  outerRadius: 0.38,
  /*
   * The two inner steps, as fractions of the outer. Uneven on purpose. Equal
   * ratios give three rings of identical radial width, and three equal intervals
   * is a rhythm — §5.2's "repeating rhythm that resolves into bars at thumbnail
   * size" does not need many repeats to fire, it needs regular ones. 1 : 0.80 :
   * 0.47 makes the outer terrace 0.076 world wide and the middle one 0.125, better
   * than 1 : 1.6 apart, and the innermost floor a disc wider than either.
   */
  step2Radius: 0.8,
  step3Radius: 0.47,
  /*
   * The depths widen as the radii narrow: 0.035, then +0.050, then +0.065. The
   * bore accelerates downward, which is the settling read §2.1 asks for arriving
   * through the object rather than through the composition.
   *
   * The absolute figures are set by what each step has to *cast*. The lamp is
   * roughly 65–75° off the face normal, so a step of depth d lays a shadow of
   * about 2·d across the floor under it: 0.035 world at desktop's subject distance
   * is a crescent some 90 px wide on the master, and that crescent — not the wall
   * — is what the eye reads as depth. Below about half these figures the shadow
   * collapses into the hairline and three rims with no shadow under them is a set
   * of scribed circles, which is precisely what the previous pass shipped.
   *
   * Total 0.150 against a 0.38 radius is a depth-to-width ratio of 0.39: deep
   * enough to read as sunk, shallow enough that the near wall never swallows the
   * floor below it at this yaw.
   */
  step1Depth: 0.035,
  step2Depth: 0.085,
  step3Depth: 0.15,
  /*
   * §2.5's hairline, and the plate's entire specular budget. 0.005 world lands at
   * 10–13 px on the four masters — inside the band a5-onboarding cites for a
   * machined chamfer. Widen it and each rim stops describing an edge and starts
   * lighting a band, and a lit band at `chrome` is area competing with the button
   * (§2.3).
   *
   * It is also the radius the three cuts are unioned with, so the two rims below
   * the face carry the same roundover as the lip at it — see `sminCut` in the
   * shader for why that is load-bearing rather than tidy.
   */
  lipFillet: 0.005,
  /* The inside corner an endmill cannot leave sharp. Smaller than the lip: a
     concave fillet that catches light is a second highlight per step, and §2.3
     rations exactly that. */
  cutterRadius: 0.0035,
  /*
   * How far the part is turned away from the lens. Shared: it is one setup on one
   * bench, and the four crops are four exposures of it.
   *
   * 22° is chosen against the light, not against the drawing. It is enough that
   * the rims project as ellipses whose centres do not coincide on screen and that
   * each step shows its interior wall on one side — the two cues that separate a
   * counterbore from a set of drawn circles — while keeping the face far enough
   * from the lamp's mirror direction that it stays a broad diffuse gradient
   * instead of a sheet of specular. Square-on (0°) is the roundel this plate must
   * not be; much past 30° and the near wall of each step swallows the floor below
   * it and the three levels stop being legible at all.
   */
  yaw: 22,
  /* Comfortably deeper than the bore's 0.150 floor, so the cut never reaches
     through the part and opens a hole to the room behind it. Also the height the
     three cutters start at, so no cut's *upper* rim is ever in shot. */
  thickness: 0.3,
}

/**
 * Assembles `uP` from the shared part and the four per-crop composition numbers.
 * A function rather than four hand-typed fourteen-slot arrays because a positional
 * array of that length is exactly the shape that drifts: the crops differ in four
 * values and nothing else, and that should be visible at a glance.
 *
 * `tilt` is solved rather than chosen. The shader's `worldToPart` displaces the
 * bore's mouth in screen direction `(−cos tilt, sin tilt)`, and the interior wall
 * of each step is visible on the side of the annulus that displacement points at.
 * So each crop's tilt is the angle whose `(−cos, sin)` aims from the axis into the
 * quadrant that is actually in shot. Get it wrong by 180° and every rim occludes
 * its own wall: the arcs survive, the depth does not.
 */
const params = ({ z, axisX, axisY, tilt }) => [
  z,
  axisX,
  axisY,
  PART.outerRadius,
  PART.step2Radius,
  PART.step3Radius,
  PART.step1Depth,
  PART.step2Depth,
  PART.step3Depth,
  PART.lipFillet,
  PART.cutterRadius,
  PART.yaw,
  tilt,
  PART.thickness,
]

export default {
  id: 'bore',
  shader: 'a11-bore.glsl',
  frames: BLEED,
  alt: 'A stepped bore sunk into machined aluminium, three concentric levels descending into shadow.',
  motion: null,
  crops: {
    /*
     * Copy is top-anchored and full width below 768px (§2.7), so there is no dead
     * side and the reserve is the top 85%. The quietest of the four by some
     * distance, and the only one that pulls the camera right back: at z = −1.6 the
     * bore is 0.44 frame heights in radius, so the whole feature folds into the
     * shallow lit band along the bottom edge.
     *
     * What is in shot is the crest of the outer rim entering at the left edge at
     * y≈7%, cresting at x=34%, and running out through the bottom edge at x≈87% —
     * with the second rim showing as a much flatter arc just above the bottom
     * edge, present as a hint rather than as a second line, and the third off-frame
     * entirely. The crest sits left of centre precisely so the *long* limb
     * descends left-to-right; a symmetrical dome centred in the band reads as a
     * rising form (§2.1) and is the one arrangement of this subject that starts to
     * look like a mark again.
     *
     * Lamp check: |lamp − axis| = 0.47 frame heights against a 0.44 radius — just
     * outside the mouth, which is what keeps the terraces reading darker than the
     * face rather than lit from within.
     */
    mobile: {
      dead: zone(0, 0, 1, 0.85),
      deadFloor: 0.14,
      deadFeather: 0.2,
      exposure: 2.7,
      fov: 26,
      key: [-0.72, -0.28, 0.63],
      /* The closest lamp in the set and the only one below the frame's midline.
         The lit region is a shallow band along the bottom, so the light has to die
         inside it rather than travel up into the reserve — which on this crop is
         everything above y=15%. */
      keyPos: [-0.32, -0.376, -1.45],
      keyRange: 0.17,
      p: params({ z: -1.6, axisX: 0.34, axisY: -0.32, tilt: 96 }),
    },
    /*
     * The most conservative crop of the four (§2.7's 768px edge case): at exactly
     * 768px the tablet image is served while the copy is already parked to its
     * side, so it has to clear the top band *and* the right column. Both reserves
     * are declared and the subject sits in the bottom-left quadrant, dark in both
     * before either is applied — a floor caps brightness but cannot soften a
     * transition, so the geometry has to be somewhere the light was never going.
     *
     * The axis is pushed off the bottom-left corner far enough that only two rims
     * reach the frame: the outer runs from the left edge at y≈33% down through the
     * bottom edge at x≈50%, the second from y≈20% to x≈32%, and the third is
     * outside the frame altogether. That is the point of the most conservative
     * crop — it shows less of the feature than any other, and what it shows clears
     * both reserves by a margin rather than by a threshold.
     */
    tablet: {
      dead: zone(0, 0, 1, 0.36),
      dead2: [0.58, 0, 1, 1],
      deadFloor: 0.22,
      deadFloor2: 0.22,
      deadFeather: 0.24,
      exposure: 2.5,
      fov: 24,
      key: [-0.66, 0.35, 0.66],
      keyPos: [-0.265, -0.047, -0.42],
      keyRange: 0.16,
      p: params({ z: -0.55, axisX: -0.24, axisY: -0.26, tilt: 130 }),
    },
    /*
     * The close one. At z = −0.05 the part is almost on the frame plane, so the
     * bore is 0.75 frame heights in radius — half as big again as it is on wide —
     * and its three rims run the full height of the left edge: the outer entering
     * at y≈80%, turning at x≈32%, and curling out through the bottom at x≈31%; the
     * second from y≈63%; the third a short arc from y≈32% down to the bottom-left
     * corner, with the deepest floor a sliver against the left edge. Nothing
     * structural crosses x=40%, which leaves the reserve (x 44–100%, §2.7's
     * Platform row) as unbroken falloff with the feather in between.
     *
     * The lamp is high and off the left edge, just beyond the outer rim, so the
     * light crosses the lip almost tangentially: the hairline is strongest on the
     * upper-left limb of each arc and dies as the arcs swing round to the right —
     * "catching a chamfer hairline on the side the key comes from and going to ink
     * on the other", taken literally.
     */
    desktop: {
      dead: zone(0.44, 0.14, 1, 0.86),
      deadFloor: 0.28,
      deadFeather: 0.18,
      exposure: 3.3,
      fov: 22,
      key: [-0.72, 0.45, 0.53],
      keyPos: [-0.48, 0.194, 0.08],
      keyRange: 0.19,
      p: params({ z: -0.05, axisX: -0.18, axisY: 0.1, tilt: 162 }),
    },
    /*
     * Not the desktop crop with more room. §5.3 wants the subject *and* the light
     * to move, so this is a different exposure at a different distance: the camera
     * pulls back to z = −0.55 on a longer lens (20° ≈ 135mm, §2.6), the bore drops
     * from a full-height column on the left edge to a quadrant tucked into the
     * bottom-left corner, and the lamp comes down with it — from frame y≈90% on
     * desktop to y≈62% here. Desktop reads as *close to the wall of the bore*;
     * wide reads as *standing back from all three levels of it*. Same part, same
     * bench, other end of the session.
     *
     * All three rims are in shot, entering the left edge at y≈54% / 41% / 20% and
     * running out through the bottom edge at x≈33% / 26% / 14%. Every one of them
     * descends left-to-right and every crest is off-frame (§2.1). The extra width
     * is room: the reserve keeps the same 44–100% column it has on desktop and
     * gains nothing but falloff.
     */
    wide: {
      dead: zone(0.44, 0.14, 1, 0.86),
      deadFloor: 0.26,
      deadFeather: 0.18,
      exposure: 3.0,
      fov: 20,
      key: [-0.78, 0.28, 0.56],
      /* The longest range in the set: the widest frame has the most face to cover,
         so the falloff has to travel further before it dies. */
      keyPos: [-0.612, 0.069, -0.42],
      keyRange: 0.18,
      p: params({ z: -0.55, axisX: -0.02, axisY: -0.1, tilt: 127 }),
    },
  },
}
