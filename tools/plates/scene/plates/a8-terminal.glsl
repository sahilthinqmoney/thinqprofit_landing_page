/*
 * A8 — Terminal. docs/art-direction.md §3.
 *
 * "A bead-blasted aluminium slab entering from the right edge and cropped by it —
 * a section of something much larger, not an object in a room. One deep machined
 * channel is cut laterally across its face, running right-to-left and dying
 * before frame centre; the channel's chamfer carries the plate's single chrome
 * hairline. A matte black cylindrical tool rests IN the channel, at rest."
 *
 * The reading the section needs is *a tool acting on a surface* — which is what
 * "the copilot has its hands on the terminal" looks like with no interface in the
 * frame. Three constraints shape every number below.
 *
 * **The channel is one cut, never a field.** §5.2 rejects "a repeating vertical
 * rhythm that reads as bars" and a grooved face is exactly how a machined plate
 * turns into a bar chart at 25% zoom. One channel cannot do that, and there is no
 * parameter here that could add a second — the count is structural, not a value.
 *
 * **The channel dies into the reserve rather than at a hard cap.** Its left end is
 * a rounded cap at `uP[3]`, but what actually extinguishes it is the dead zone's
 * feather: core.glsl attenuates radiance *outside* the reserve rectangle over
 * `uDeadFeather`, so a channel whose cap sits just past the boundary fades over
 * ~16% of frame width instead of stopping. §2.7 wants "no edges" in the reserve
 * and a "gradual falloff spanning at least 12% of frame width" — here those are
 * the same mechanism rather than two, which is why the cap is placed relative to
 * the reserve edge in every crop.
 *
 * **The lip is a fillet, not a corner.** `opSmoothSub` subtracts the channel with
 * a radius, so where the face turns down into the cut there is a machined
 * roundover of exactly `uP[6]`. §2.5 calls that hairline "the single most useful
 * mark in the whole vocabulary" and widening it is precisely how it stops
 * describing an edge and starts lighting a face. A hard `max()` here would give an
 * aliased corner instead — bright, thin, and a §2.7 edge-step failure rather than
 * a specular.
 *
 * One key, positional (§2.4's gradient across a surface is falloff, and falloff
 * needs a lamp — a directional source puts one flat tone on a flat face). One rim
 * at low gain to lift the slab's left long edge off the room. **No second light
 * event**: §2.3 rule 2 permits one on exactly two plates, and this is not one of
 * them.
 *
 * Nothing ascends. The channel runs along world X and the tool's axis runs with
 * it, so the plate's dominant line is lateral by construction — there is no
 * parameter that can tilt either (§2.1).
 *
 * **The slab has no silhouette, and that is the composition.** It is not an object
 * placed in a room — it fills the frame on every crop, so there is no edge of it
 * anywhere in shot and the only marks are the cut and the tool. §1: "Depth is
 * constructed entirely with light: a form emerges because one plane catches a
 * grazing key and the plane beside it does not." Two earlier passes gave the slab
 * finite width and both failed on it — first as a hard vertical terminator
 * splitting the frame at its left edge, then, once that was pushed off-frame, as
 * its *right* edge walking back into shot on the widest aspect. Neither is
 * visible to any gate. A form whose extents are derived from the frame rather
 * than from a world constant cannot fail that way at a breakpoint nobody
 * screenshotted.
 *
 * Parameters (`uP`):
 *   0 — slab depth, world z. Negative is further from camera.
 *   1 — channel axis, frame y.
 *   2 — channel's left cap, frame x.
 *   3 — channel half-height, world.
 *   4 — channel half-depth, world: how deep the cut goes into the face.
 *   5 — machined radius on the lip — the hairline width.
 *   6 — tool's near cap, frame x. Its far end leaves the frame, like the cut's.
 *   7 — tool radius, world.
 *   8 — slab half-depth, world.
 *   9 — channel section corner radius, world.
 */

const int ID_SLAB = 1;
const int ID_TOOL = 2;

/**
 * One frame height is **half** a world unit, not one.
 *
 * core.glsl's `atFrame` documents the z = 0 plane as one world unit tall and it
 * is not — `solveCamera` puts the camera at `0.5 / tan(fov/2)` against a focal of
 * `1 / tan(fov/2)`, so a ray reaches z = 0 at s = 0.5 and the visible plane spans
 * ±0.25. The discrepancy is documented at length on `atFrame` and deliberately
 * left unfixed there, because correcting it rescales all seven shipped plates at
 * once. This plate names the factor rather than folding it into its numbers, the
 * way `a5-onboarding.glsl` and `a7-device.glsl` do — the composition below is
 * stated in frame percentages and it has to mean them.
 */
const float FRAME_H = 0.5;

/**
 * World units per unit of frame height, at depth z. Plain similar triangles:
 * `uCamPos.z` is the camera's distance to the z = 0 plane, so a form at z sits
 * `1 − z/uCamPos.z` further away and covers that much more world per pixel.
 *
 * This is what lets the slab be pushed back for chamfer scale without every
 * composition number in the section file moving with it: §2.5 holds the machined
 * chamfer to a hairline, and a fixed world radius read at the z = 0 plane would
 * be a roundover you could see the shape of rather than a line.
 */
float frameScale(float z) {
  return FRAME_H * (1.0 - z / uCamPos.z);
}

/** Frame fraction (origin bottom-left, as §2.7 states dead zones) to world. */
vec3 atPlate(vec2 f, float z) {
  return vec3(uCamPos.xy + atFrame(f) * frameScale(z), z);
}

/**
 * Smooth subtraction — iq's, with `k` as the machined radius left on the lip.
 *
 * The whole point of using it rather than `max(a, -b)` is that a real cut has a
 * roundover where the cutter's corner ran, and that roundover *is* the specular
 * hairline §2.5 asks for. A hard boolean gives a mathematically sharp corner,
 * which the marcher resolves as a one-pixel-wide bright artefact that moves with
 * the sampling grid — thin and bright is not the same thing as a machined edge,
 * and it fails §2.7's 20-level-per-8px step test as aliasing rather than as
 * composition.
 */
float opSmoothSub(float cut, float body, float k) {
  float h = clamp(0.5 - 0.5 * (body + cut) / k, 0.0, 1.0);
  return mix(body, -cut, h) + k * h * (1.0 - h);
}

/**
 * Half the frame, in world units, at the slab's depth — with a healthy overscan.
 *
 * Every extent in this plate is measured off this rather than off a world
 * constant. `frameScale` already varies by ~5% across the four crops (it is a
 * function of `fov`, which differs on all four) and the aspect ratio varies by
 * more than 3×, so any fixed half-width that covers the 16:9 frame is three times
 * larger than the 9:16 one needs — and any that fits 9:16 leaves an edge in shot
 * on 16:9. The overscan is 3×: enough that no rotation or depth offset in any
 * future crop can bring an extent back into frame.
 */
vec2 frameHalf(float z) {
  float h = frameScale(z);
  return vec2(h * uAspect, h) * 1.5;
}

/** The channel's own field, needed twice: to cut the slab and to find the lip. */
float channelField(vec3 p) {
  float z = uP[0];
  vec3 capLeft = atPlate(vec2(uP[2], uP[1]), z);

  /*
   * The cut runs from its cap out through the right-hand frame edge, so only one
   * end of it is ever a form in frame. The far end is measured against the
   * **frame**, not against the slab: the slab's left edge is pushed off-frame by
   * a different amount on every crop (`uP[0]` is negative throughout), and
   * deriving the cut's length from `uP[0] + 2·halfWidth` made the far cap walk
   * back into shot on the widest aspect — a rounded end sitting at x=0.64 on the
   * wide crop, which no gate can see and which turns "a section of something
   * larger" into a floating bar.
   *
   * 1.18 rather than 1.0: the cut has to clear the edge by enough that its own
   * end radius is fully outside, or the silhouette carries a curve at the frame
   * boundary and reads as the cut having been aimed at the frame.
   */
  float rightEdge = atPlate(vec2(1.18, uP[1]), z).x;
  float halfLen = 0.5 * (rightEdge - capLeft.x);
  float centreX = capLeft.x + halfLen;

  /* Straddles the front face plane, so it cuts `uP[4]` into it. */
  vec3 centre = vec3(centreX, capLeft.y, z + uP[8]);
  return sdRoundBox(p - centre, vec3(halfLen, uP[3], uP[4]), uP[9]);
}

Hit mapScene(vec3 p) {
  float z = uP[0];

  /*
   * The slab, sized off the frame and centred on it, so no edge of it is ever in
   * shot on any aspect — §A1's "a section of something much larger, cropped",
   * taken literally. There is no silhouette to compose around and nothing here
   * that can turn into one at a breakpoint.
   *
   * No `loopSettle()` term. This plate is a still (`motion: null`), and §2.3
   * rule 3 reserves perpetual motion for the primary action.
   */
  vec2 extent = frameHalf(z);
  vec3 centre = atPlate(vec2(0.5, 0.5), z);
  float slab = sdBox(p - centre, vec3(extent, uP[8]));
  float d = opSmoothSub(channelField(p), slab, uP[5]);
  Hit hit = Hit(d, ID_SLAB);

  /*
   * The tool, resting on the floor of the channel. Its axis runs along world X —
   * `rotZ(90°)` maps the cylinder's own +Y onto it — so the form is lateral and
   * cannot be tilted into an ascending line by any value in the section file
   * (§2.1). It sits at rest rather than mid-stroke: a tool caught in motion is a
   * claim about speed, and this section's claim is about control.
   */
  /*
   * The tool is anchored by its **near cap** and run out through the right frame
   * edge, exactly as the cut is — not by a centre plus a world half-length. That
   * earlier form put its left end at frame x 0.43 on the 3:4 crop while the
   * channel's cap sat at 0.60, so the rod lay outside its own slot: a world
   * length is a fixed number of frame widths only if the aspect never changes,
   * and here it changes by more than 3×. Anchoring both forms to the frame is
   * what makes "the tool is in the channel" true on every crop rather than on the
   * one that was looked at.
   */
  vec3 nearCap = atPlate(vec2(uP[6], uP[1]), z);
  float toolRight = atPlate(vec2(1.18, uP[1]), z).x;
  float toolHalf = 0.5 * (toolRight - nearCap.x);
  vec3 axis = vec3(nearCap.x + toolHalf, nearCap.y, z);
  /* Seated on the floor of the cut: the channel box straddles the face plane, so
     its floor is one half-depth in, and the tool's centre is one radius above
     that. Sized in the section file so the tool's crown lands flush with the
     face rather than proud of it — a proud cylinder takes a highlight of its
     own, and the tool is meant to be a silhouette. */
  vec3 seat = vec3(axis.x, axis.y, z + uP[8] - uP[4] + uP[7]);
  float tool = sdCylinderY(rotZ(PI * 0.5) * (p - seat), uP[7], toolHalf);

  return closer(hit, Hit(tool, ID_TOOL));
}

Material materialFor(int id, vec3 p, vec3 n) {
  if (id == ID_TOOL) {
    /*
     * §2.5's structural material. The tool is the one form in frame that is *not*
     * aluminium, and that is what makes it read as a separate object resting in
     * the channel rather than as a raised part of the same casting. It is legible
     * by its silhouette against the lit channel floor and by nothing else — it
     * takes almost no highlight of its own.
     */
    return matAnodisedBlack();
  }

  /*
   * "The default surface for large faces": bead-blasted, matte, holds a soft
   * gradient. Isotropic on purpose. §2.5 permits a brushed grain and requires it
   * to run across the frame rather than up it — but the grain direction would
   * then be a second lateral line running parallel to the channel, and two
   * parallel lines is the rhythm §5.2 rejects arriving through texture instead of
   * through geometry.
   */
  Material m = matAluminiumBlasted();

  /*
   * The lip is not blasted. Its normals sweep through the mirror direction within
   * the width of the fillet, so a tighter lobe there is what keeps the catch a
   * hairline rather than letting it spread onto the face either side of the cut.
   * Same split a1-hero and a7-device make on their chamfers, for the same reason.
   *
   * "On the face" is a normal test rather than a position test, so it covers both
   * walls of the channel and its end cap with one scalar — with the slab sized
   * off the frame, every surface in this plate that is not facing camera belongs
   * to the cut.
   */
  float onFace = smoothstep(0.86, 0.995, abs(n.z));
  m.rough = mix(0.21, 0.46, onFace);

  /*
   * The channel floor is darker than the face around it. Not a light trick — a
   * cut into a blasted surface exposes a fresh, finer finish, and the floor is
   * also the one plane in the plate the key cannot reach at this rake angle. It
   * is what gives the tool something to be a silhouette against.
   */
  float inCut = 1.0 - smoothstep(-uP[3] * 0.5, uP[3] * 0.25, channelField(p));
  m.albedo = mix(m.albedo, m.albedo * 0.62, inCut * onFace);

  return m;
}
