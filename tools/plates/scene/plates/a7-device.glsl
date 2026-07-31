/*
 * A7 — Mobile app device. Not one of docs/art-direction.md §3's six, and that is
 * the point of it.
 *
 * §3's "Not briefed here" entry rules the app screen out because motion-brief §7
 * rule 5 forbids fabricated interfaces: *"Ship a screenshot of the real product
 * at 9:19, or ship the dark screen. Do not generate one."* This plate is the
 * second half of that sentence taken literally. It is not a screen; it is the
 * object the screen is switched off on — a machined portrait slab with a single
 * sheet of unlit dark glass in it, photographed on the same set, under the same
 * key, against the same black point as the other six.
 *
 * **There is no interface on it, and the geometry is what guarantees that.** The
 * front is one flat plane. Everything the eye reads across it is falloff from a
 * single lamp, not a form, because there is no second form in front of it to
 * read: no status bar, no rows, no chart, no glyph, no price mark, no icon. That
 * is not a promise made in a comment — a plate whose front face is a single
 * primitive cannot grow a UI without someone adding an SDF, which is a change
 * you can see in a diff.
 *
 * Composition. A portrait slab held straight-on (§2.6 — long lens, flat
 * perspective, no tilt, no yaw), its top edge and top corner radii in frame and
 * its body running out of the bottom, because `MobileApp.tsx` crops it at the
 * section's own bottom edge anyway and a form that continues past the frame
 * reads as an object rather than as an icon of one (§A1's "a section of
 * something much larger, cropped"). One key, well to camera-left and above, at
 * ~72° off the lens axis (§2.4's 70–85° band). It produces exactly two marks:
 *
 *  1. **The chamfer hairline.** The fillet where the front face turns into the
 *     side wall is also the silhouette — a straight-on camera sees no side wall
 *     at all, so this radius *is* the edge of the object. It catches a single
 *     specular hairline down the left long edge, peaking at the lamp's height
 *     and dying downward (§2.1: lateral or downward-settling, never ascending).
 *     `uP[5]` is its radius and it is the load-bearing number in the plate:
 *     §2.5 calls the machined chamfer "a bright hair line that describes a
 *     form's geometry without lighting its face", and widening it is exactly how
 *     that stops being true. Measured at 900×1900: the core runs ~3px with a
 *     ~16px ramp either side, peaking at sRGB 165 — the grade's ceiling — while
 *     only 0.22% of the frame sits above L .600.
 *
 *  2. **The graded sheen on the glass.** Dark — the face never takes a highlight
 *     sitting in the middle of it, because the lamp is 72° off axis and its
 *     mirror image is nowhere near the frame. What it takes is a grade,
 *     brightest at the top-left and falling to ink at the lower right (measured
 *     sRGB 23 → 15 against a room at 5), and that grade is inverse-square
 *     falloff from a lamp with a *position*: on a plane this flat a directional
 *     key gives one even tone and nothing else (see core.glsl's `uKeyRange`).
 *
 * Materials, and why the rail is a material rather than a groove. The glass is
 * flush with the aluminium, so the rail is a material boundary on one continuous
 * plane instead of a step with two walls. Physically that is what a phone face
 * is; compositionally it matters more than that. A recessed or proud glass edge
 * gives the key a second edge to catch, and two parallel bright lines a rail's
 * width apart is precisely how an honest bezel starts reading as a rendered
 * frame — which is the fabricated-interface failure arriving through geometry
 * instead of through pixels.
 *
 * No rim (§2.4 permits one; this plate does not need it). The slab separates
 * from the room because the glass sits ten to eighteen levels above `#050505`
 * across its whole face, not because an edge was drawn behind it, and a second
 * accent on the unlit side is what starts making an object look lit *for* the
 * camera.
 *
 * Parameters (`uP`):
 *   0 — body width, as a fraction of frame width.
 *   1 — top edge, frame y. §3 states compositions in frame percentages; so does
 *       this.
 *   2 — body half-height, world. Deliberately long — the slab is ~2.8:1, not a
 *       phone tracing, and it leaves the frame at the bottom.
 *   3 — plan corner radius, as a fraction of the body's half-width.
 *   4 — body half-depth, world.
 *   5 — fillet radius where the front face meets the side wall: the width of the
 *       specular hairline.
 *   6 — rail: how far the aluminium runs in from the profile before the face
 *       becomes glass, world.
 */

const int ID_DEVICE = 1;

/**
 * One frame height is **half** a world unit here, not one.
 *
 * core.glsl's `atFrame` documents the z = 0 plane as exactly one world unit
 * tall. It is not, and the arithmetic is short enough to check: `solveCamera`
 * places the camera at `0.5 / tan(fov/2)` while core builds its rays against a
 * focal of `1 / tan(fov/2)`, so the camera sits at exactly half the focal
 * length and a ray reaches z = 0 at s = 0.5. `ndc.y` spans ±0.5, so world y
 * spans ±0.25 and the visible plane is 0.5 units tall.
 *
 * Verified against the renderer rather than inferred: a slab built to
 * `atFrame`'s promise came back at 1.85× the frame width, filling it corner to
 * corner with one flat tone and no visible edge anywhere.
 *
 * Every plate in the set is tuned against the real mapping rather than the
 * documented one. This one names the factor instead of quietly folding it into
 * its numbers, because the composition below is stated in frame percentages and
 * it has to mean them. Lengths in `uP` stay in world units, as they do in the
 * other plates and in `keyPos`; only the two genuinely frame-space parameters —
 * width fraction and top edge — go through this.
 */
const float FRAME_H = 0.5;

/** The slab's plan profile — a rounded rectangle, seen face-on. */
float sdRoundRect2D(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - (b - r);
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

/**
 * World → slab space. Split out because `materialFor` has to ask `mapScene`'s
 * question again — *how far inside the profile is this point* — and a transform
 * written twice is a transform that drifts.
 */
vec3 deviceLocal(vec3 p) {
  float topY = (uP[1] - 0.5) * FRAME_H;
  return p - vec3(0.0, topY - uP[2], 0.0);
}

float devicePlan(vec2 xy) {
  float halfWidth = 0.5 * uP[0] * uAspect * FRAME_H;
  return sdRoundRect2D(xy, vec2(halfWidth, uP[2]), uP[3] * halfWidth);
}

Hit mapScene(vec3 p) {
  vec3 q = deviceLocal(p);

  /*
   * The profile extruded on z, with a machined fillet of radius `c` all round
   * the perimeter: shrink both the plan and the depth by `c`, take the distance
   * to that, then offset back out by `c`. One primitive, one surface — the
   * front face and the edge are the same object, which is what keeps the
   * chamfer a chamfer instead of a separate lit band lying on top of a plate.
   *
   * No `loopSettle()` term. This plate is a still (`motion: null`), and a device
   * that drifts is a device that reads as a mock-up floating in space rather
   * than as an object standing in the section.
   */
  float c = uP[5];
  vec2 w = vec2(devicePlan(q.xy) + c, abs(q.z) - (uP[4] - c));
  float d = min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - c;

  return Hit(d, ID_DEVICE);
}

Material materialFor(int id, vec3 p, vec3 n) {
  /*
   * "On the face" is a normal test, not a depth test: the fillet is body however
   * far inside the profile the ray happened to land, and the same scalar does
   * two jobs — it decides where the glass may be, and it splits the roughness.
   */
  float onFace = smoothstep(0.86, 0.995, abs(n.z));

  /*
   * §2.5's "default surface for large faces": bead-blasted, matte, holds a soft
   * gradient. Isotropic on purpose — a brushed grain on a portrait form would
   * have to run either up the frame, which §2.5 forbids outright because an
   * ascending line at texture scale is still an ascending line, or across it,
   * where it reads as machining marks nobody puts on a phone.
   */
  Material m = matAluminiumBlasted();

  /*
   * The fillet is not blasted. Its normals sweep through the mirror direction
   * within the width of the radius, so a tighter lobe there is what keeps the
   * catch a hairline rather than letting it spread into the rail. Same split
   * a1-hero makes on its chamfer, for the same reason.
   */
  m.rough = mix(0.22, 0.46, onFace);

  /*
   * Flush glass. The rail becomes glass at a fixed inset from the profile with
   * no geometry at the boundary, blended over ~2px so the transition is a
   * material change rather than an aliased line. Everything the glass does from
   * here is one albedo and one lobe under one lamp; there is nothing else on it
   * and nothing else can be put on it without adding a primitive.
   */
  Material glass = matDarkGlass();
  float plan = devicePlan(deviceLocal(p).xy);
  float blend = 0.0009;
  float isGlass = onFace * (1.0 - smoothstep(-uP[6] - blend, -uP[6] + blend, plan));

  m.albedo = mix(m.albedo, glass.albedo, isGlass);
  m.rough = mix(m.rough, glass.rough, isGlass);
  m.metal = mix(m.metal, glass.metal, isGlass);
  return m;
}
