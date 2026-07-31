/*
 * A11 — Bore. docs/art-direction.md §1, §2.1–§2.7, §5.2, §5.3.
 *
 * "One deep stepped bore sunk into machined aluminium: three concentric machined
 * steps descending, each catching a chamfer hairline on the side the key comes
 * from and going to ink on the other, so the eye reads the depth as a stack of
 * registered levels."
 *
 * The section it backs claims that options data lives *on* the chart rather than
 * beside it — strikes, greeks and levels fused into the instrument instead of
 * parked in a panel. So the reading has to be **depth, in registered layers, cut
 * into one surface**. One part, one operation, three steps: the levels are in the
 * material, not laid over it.
 *
 * This plate's form language is **radial**, and that is its whole job in the set.
 * The three plates beside it — a8-terminal, a9-gate, a10-scale — are lateral: a
 * cut across a face, a slot between two jaws, a stamped detail. A page that shows
 * four versions of "a line across metal" has shown one photograph four times. So
 * curvature is not decoration here, it is the reason the plate exists, and every
 * number below that trades legibility of the arcs against anything else resolves
 * in favour of the arcs.
 *
 * Six constraints shape the geometry, and five of them are failure modes rather
 * than preferences.
 *
 * **It must not read as a bullseye, and concentric circles dead-centre is a
 * logo.** Two independent things stop that, because either one alone is
 * recoverable by a tuning mistake:
 *
 *   1. *The axis is off-frame on every crop.* `uP[1]`/`uP[2]` put it outside the
 *      frame — past a corner, past an edge, or well below the bottom — so what is
 *      in shot is 60–90° of arc belonging to something much larger. §5.5's last
 *      question ("could this, cropped square, be mistaken for an annual report
 *      cover") is asking exactly whether the subject is centred and complete. A
 *      circle the eye can close is a mark.
 *   2. *The part is turned away from the lens.* `uP[11]` yaws the face about the
 *      frame's vertical axis and `uP[12]` swings that lean around the clock, so
 *      the rims project as ellipses whose centres do not coincide on screen and
 *      the near wall of each step occludes the far one. Note this tilts the
 *      *subject*, never the camera — `spec.mjs` cannot tilt the camera at all,
 *      which is how §2.6's "flat perspective, no tilt" survives an oblique
 *      subject.
 *
 * **Three steps is the maximum, and the count is structural.** There are three
 * cut cylinders in `boreField`, written out, with no loop and no count parameter.
 * §5.2 rejects "a repeating rhythm that resolves into bars at thumbnail size" and
 * a fourth step is where nested arcs stop reading as one machined feature and
 * start reading as a scale. The radii and the depths both step *unevenly* (see
 * `sections/bore.mjs`), because three equally spaced rings is a rhythm even when
 * there are only three of them.
 *
 * **Every rim is a machined roundover, including the two below the face.** This
 * is the fix for the failure the previous pass shipped: the three cuts were
 * unioned with plain `min()`, which leaves a mathematically sharp convex edge in
 * the material wherever two cut surfaces meet — at `(r2, −d1)` and `(r3, −d2)`,
 * which are precisely the two inner rims. A sharp edge is not a chamfer; the
 * marcher resolves it as a one-pixel line that moves with the sampling grid, so
 * the two inner steps came back as scribed circles on a flat surface while only
 * the outer lip read as a cut. `sminCut` unions the cuts with the lip's own
 * radius, so all three rims carry the same hairline and the plate reads as three
 * registered levels rather than as three drawn rings. §2.5 calls that hairline
 * "the single most useful mark in the whole vocabulary"; the point of this file is
 * that there are three of them and they are the same mark.
 *
 * **The lip fillet is the entire specular budget.** `uP[9]` is the only geometry
 * in the plate allowed near `chrome` L .750. Widen it and each rim stops
 * describing an edge and starts lighting a band, which is a §2.3 problem long
 * before it is an aesthetic one: a lit band at that value is *area* competing
 * with the button.
 *
 * **The surface has no silhouette.** It fills the frame on every crop — no edge
 * of the part is in shot anywhere, only the bore. This is a8-terminal.glsl's
 * hard-won lesson taken as given: a form sized in world units left a hard edge in
 * shot on one aspect and none on another, because the aspect ratio varies by more
 * than 3× across the four crops. Every extent here is derived from `frameScale`
 * and carries a 4.8× overscan, so no yaw, tilt or depth offset available to the
 * section file can walk an edge back into shot.
 *
 * **Nothing ascends (§2.1).** A circle has no direction to get wrong, which is
 * only half the answer; the other half is placement, and it lives in the section
 * file. On all four crops the axis sits below or beside the visible arc so the
 * limb in shot runs *downhill* left-to-right, and the crest — the one part of a
 * rim that turns upward — is always outside the frame.
 *
 * One key, positional (§2.4). **No rim light**: §2.4 permits one hard accent
 * "where a form has to separate from the background" and there is no background
 * here — the surface is the frame — so a rim would be an accent drawn for the
 * camera rather than for the form. **No second light event**: §2.3 rule 2 gives
 * that to Onboarding and Final CTA and to nothing else, and `uEvent` stays zero.
 *
 * Parameters (`uP`):
 *   0  — the face's depth at the bore axis, world z. Negative is further away.
 *   1  — bore axis, frame x.
 *   2  — bore axis, frame y.
 *   3  — outer step radius, **world** units. Shared by all four crops: it is the
 *        object, and an object that changes size between breakpoints is four
 *        parts photographed once each rather than one part photographed four
 *        times (§5.3).
 *   4  — second step radius, as a fraction of uP[3].
 *   5  — third step radius, as a fraction of uP[3].
 *   6  — first step depth, world.
 *   7  — second step depth, world.
 *   8  — third step depth — the bore floor — world.
 *   9  — lip fillet radius, world. The specular hairline (§2.5), and the radius
 *        the three cuts are unioned with, so every rim carries it.
 *   10 — cutter corner radius, world. The concave fillet where a wall meets the
 *        floor under it; a real endmill leaves one, and a sharp inside corner
 *        renders as a crack rather than as a machined transition.
 *   11 — yaw about the frame's vertical axis, degrees.
 *   12 — rotation in the picture plane, degrees. Swings the lean around the
 *        clock, which is what decides *which* side of the annulus shows its
 *        interior wall.
 *   13 — the part's thickness behind the face, world.
 */

const int ID_PART = 1;

/**
 * One frame height is **half** a world unit, not one.
 *
 * core.glsl's `atFrame` documents the z = 0 plane as one world unit tall and it is
 * not: `solveCamera` puts the camera at `0.5 / tan(fov/2)` against a focal of
 * `1 / tan(fov/2)`, so the visible plane spans ±0.25 and `atFrame` overstates every
 * frame coordinate by exactly 2×. The discrepancy is documented at length on
 * `atFrame` and deliberately left unfixed there because correcting it rescales
 * every shipped plate at once. Named here rather than folded into the numbers, the
 * way a5-onboarding.glsl and a8-terminal.glsl do — the composition in the section
 * file is stated in frame percentages and it has to mean them.
 */
const float FRAME_H = 0.5;

/**
 * World units per unit of frame height, at depth z. Plain similar triangles:
 * `uCamPos.z` is the camera's distance to the z = 0 plane, so a form at z sits
 * `1 − z/uCamPos.z` further away and covers that much more world per pixel.
 *
 * This is what lets the part be moved in depth — which the section file does per
 * crop, because the distance from the bench to the camera is a *camera* decision
 * and not a property of the part — without every composition number moving with
 * it. It is also what holds the hairline: §2.5 wants a hair line, and `uP[9]` read
 * at the z = 0 plane would be a roundover whose shape you can see.
 */
float frameScale(float z) {
  return FRAME_H * (1.0 - z / uCamPos.z);
}

/** Frame fraction (origin bottom-left, as §2.7 states dead zones) to world. */
vec3 atPlate(vec2 f, float z) {
  return vec3(uCamPos.xy + atFrame(f) * frameScale(z), z);
}

/**
 * World → the part's own frame, with the bore axis on local +z and the face at
 * local z = 0. The composed orientation is `rotZ(tilt) · rotY(yaw)`; this is its
 * inverse.
 *
 * The order matters, and it is this way round for a lighting reason rather than a
 * geometric one. `rotY` leans the face off the lens axis by `yaw`; `rotZ` then
 * swings that lean around the clock without changing how far off-axis it is. So
 * the section file can aim the lean at the quadrant of the bore that is actually
 * in shot — which is what makes the interior wall of each step visible rather
 * than hidden behind its own rim — while the angle between the face and the lens
 * stays fixed across all four crops. Reversing the order would apply the yaw in
 * the already-rotated frame and the two controls would fight.
 *
 * The screen-space direction the mouth is displaced in works out at
 * `sin(yaw) · (−cos(tilt), sin(tilt))`, which is the identity the section file's
 * per-crop tilts are solved from.
 */
mat3 worldToPart() {
  return rotY(radians(-uP[11])) * rotZ(radians(-uP[12]));
}

/** The bore axis in world space, placed by frame fraction. */
vec3 boreAxis() {
  return atPlate(vec2(uP[1], uP[2]), uP[0]);
}

/** A point in the part's frame. Needed by both `mapScene` and `materialFor`. */
vec3 partLocal(vec3 p) {
  return worldToPart() * (p - boreAxis());
}

/**
 * Smooth subtraction — iq's, with `k` as the machined radius left on the lip.
 *
 * A real cut has a roundover where the cutter's corner ran, and that roundover
 * *is* the specular hairline §2.5 asks for. Same function and the same reasoning
 * as a8-terminal.glsl; duplicated rather than promoted to core.glsl because core
 * owns the camera, the light and the grade, and a plate that puts its own geometry
 * helpers there is reaching around the contract.
 */
float opSmoothSub(float cut, float body, float k) {
  float h = clamp(0.5 - 0.5 * (body + cut) / k, 0.0, 1.0);
  return mix(body, -cut, h) + k * h * (1.0 - h);
}

/**
 * Smooth union of two cuts — the same polynomial, the other way up.
 *
 * This is the function the previous pass did not have, and its absence is why
 * that render came back as three scribed circles rather than as a counterbore.
 * The material is `body ∖ (c1 ∪ c2 ∪ c3)`, so a rim of the material is a place
 * where two *cut* boundaries meet. Union them with `min` and that meeting is a
 * crease: the material gets a mathematically sharp convex edge at `(r2, −d1)` and
 * `(r3, −d2)`, which the marcher can only resolve as a one-pixel bright line. Thin
 * and bright is not the same thing as a machined edge — it is aliasing, and §2.7's
 * 20-levels-per-8px test would read it as one if it ever fell inside a reserve.
 *
 * Unioned with the lip's own `k`, the two inner rims carry exactly the roundover
 * the outer lip carries, and the three steps become one family of marks.
 */
float sminCut(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

/**
 * A capped cylinder on the part's z axis, from `zBot` up to `zTop`, with `cr` of
 * radius left on both rims.
 *
 * `cr` is not cosmetic. It is the fillet where a step's wall meets the floor under
 * it — the inside corner an endmill physically cannot leave sharp. A sharp inside
 * corner renders as a black hairline (the normal flips across one pixel and AO
 * plunges with it), and a black hairline inside a lit step reads as a crack rather
 * than as a machined transition.
 */
float sdCutZ(vec3 l, float r, float zTop, float zBot, float cr) {
  float halfH = 0.5 * (zTop - zBot);
  float mid = 0.5 * (zTop + zBot);
  vec2 d = abs(vec2(length(l.xy), l.z - mid)) - vec2(r - cr, halfH - cr);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - cr;
}

/**
 * The union of the three cuts, as its own field — needed twice: to remove the
 * material, and to tell how deep into the bore a shaded point sits.
 *
 * Written out rather than looped. §5.2's "repeating rhythm that resolves into
 * bars" is the failure this plate is one parameter away from at all times, and the
 * cheapest defence is that there is no parameter: adding a fourth step means
 * editing this function, which means reading this comment.
 *
 * All three cuts start proud of the face (`top = uP[13]`, the part's own
 * thickness) so their *upper* rims are never in shot. The only rims that exist as
 * edges are the three that matter: the lip at the face, and the two where a
 * narrower cut breaks through the floor of the wider one above it.
 */
float boreField(vec3 l) {
  float top = uP[13];
  float cr = uP[10];
  float k = uP[9];
  float c1 = sdCutZ(l, uP[3], top, -uP[6], cr);
  float c2 = sdCutZ(l, uP[3] * uP[4], top, -uP[7], cr);
  float c3 = sdCutZ(l, uP[3] * uP[5], top, -uP[8], cr);
  return sminCut(c1, sminCut(c2, c3, k), k);
}

Hit mapScene(vec3 p) {
  vec3 l = partLocal(p);

  /*
   * The part, sized off the frame so no edge of it is ever in shot on any aspect.
   *
   * 4.8× the frame's half-dimension, measured on whichever of width or height is
   * larger and applied to *both* of the part's lateral axes — because the `rotZ`
   * swing means the part's own x axis is not the frame's x axis, so an extent
   * budgeted per-axis against the frame comes up short on one of them the moment
   * the tilt changes. That asymmetry is exactly the class of failure a8-terminal
   * hit twice and no gate can see.
   *
   * No `loopSettle()` term. This plate is a still (`motion: null`), and §2.3
   * rule 3 reserves perpetual motion for the primary action.
   */
  float fs = frameScale(uP[0]);
  float ext = 4.8 * 0.5 * fs * max(uAspect, 1.0);
  float hd = uP[13];
  float body = sdBox(l - vec3(0.0, 0.0, -hd), vec3(ext, ext, hd));

  return Hit(opSmoothSub(boreField(l), body, uP[9]), ID_PART);
}

Material materialFor(int id, vec3 p, vec3 n) {
  vec3 l = partLocal(p);
  vec3 ln = worldToPart() * n;

  /*
   * "Bead-blasted aluminium — matte, diffuse, holds a soft gradient beautifully.
   * The default surface for large faces" (§2.5). Isotropic on purpose: §2.5
   * permits a brushed grain and requires it to run across the frame rather than up
   * it, but a linear grain crossing a set of concentric arcs is a second family of
   * lines in a plate whose whole risk is reading as a pattern — and a *turned*
   * concentric grain, which §A3 permits on its ring faces, is the bullseye this
   * plate exists not to be.
   */
  Material m = matAluminiumBlasted();

  /*
   * Three surface classes, read off the normal rather than off a position, so one
   * test covers the face, all three step floors, all three step walls and the
   * three fillets between them. With the part filling the frame, every surface
   * here that is not facing camera belongs to the bore.
   *
   *  - **flat** — the face and the step floors. `|ln.z| → 1`.
   *  - **wall** — the cylindrical side of a step. `|ln.z| → 0`.
   *  - **fillet** — the roundover between them, which is everything in between,
   *    and which is the only surface whose normal sweeps through the mirror
   *    direction. A tighter lobe there is what keeps the catch a hairline instead
   *    of letting it spread onto the floor either side of the rim. The same split
   *    a5-onboarding and a8-terminal make on their chamfers, for the same reason.
   *
   * The walls are given their own value rather than being lumped with the fillet.
   * At 0.23 (the fillet's roughness) a step wall returns a broad sheen down its
   * whole height and each step reads as two bright lines rather than as one edge
   * and one surface — three steps × two lines is the rhythm §5.2 rejects, arriving
   * through shading instead of through geometry.
   *
   * (`flat` is an interpolation qualifier in GLSL ES 3.00 and cannot be a
   * variable name, hence the `on-` prefixes.)
   */
  float onFlat = smoothstep(0.90, 0.995, abs(ln.z));
  float onWall = 1.0 - smoothstep(0.10, 0.34, abs(ln.z));
  float onFillet = clamp(1.0 - onFlat - onWall, 0.0, 1.0);
  m.rough = 0.46 * onFlat + 0.42 * onWall + 0.21 * onFillet;

  /*
   * Each level is darker than the one above it, and that ordering is the subject.
   *
   * Most of it is already physical — the lamp is close, so inverse-square alone
   * costs a floor 0.15 world deeper a real stop, and each rim lays a soft shadow
   * across the floor under it on the side away from the key. But AO and falloff
   * together still leave the three floors within a few levels of each other at the
   * bottom of the range, and "depth in registered layers" only reads if the layers
   * are *registered*: an ordered sequence rather than one dark hole.
   *
   * So the albedo ramps with the point's own depth into the cut. It is not a
   * cheat: a cut into a blasted surface exposes a finer finish that returns less
   * to a broad source, which is the same physical reason a8-terminal.glsl darkens
   * its channel floor by the same 0.6-ish factor. Ramped on depth rather than
   * stepped per level so it stays continuous down the walls — a per-step constant
   * would put a tone boundary at every rim, doubling the hairline.
   */
  float depth = clamp(-l.z / max(uP[8], 1e-4), 0.0, 1.0);
  m.albedo *= mix(1.0, 0.45, depth);

  return m;
}
