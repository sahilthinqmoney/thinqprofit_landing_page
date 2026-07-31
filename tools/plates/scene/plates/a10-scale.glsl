/*
 * A10 — Scale. docs/art-direction.md §1 (the world), §2 (the constraints).
 *
 * Backs the section headed "Order flow, labelled." — footprint, depth ladder,
 * tape and CVD, "each bar marked tape, inferred or approximated."
 *
 * "A WITNESS MARK, shot at 1:1 macro so a detail a few millimetres across FILLS
 * its side of the frame. On machined aluminium: one punched index mark — the
 * datum a machinist stamps to say *this is the one I measured from* — with the
 * burr of displaced metal raised around its rim catching the key. Behind it,
 * running out of focus, the shallow score it references."
 *
 * The reading the section needs is **this thing has been measured, and the
 * measurement is recorded ON the object rather than asserted about it.** That is
 * per-bar provenance with no chart anywhere near the frame: the label is struck
 * into the metal instead of drawn over it.
 *
 * ── WHY THIS FILE LOOKS NOTHING LIKE a8-terminal.glsl ────────────────────────
 *
 * It is not allowed to. A8 ships a WIDE shot: a flat face, one long lateral cut,
 * a tool lying in it. An earlier pass at A10 rendered the same photograph with a
 * smaller cut, and four plates that speak one form language are one photograph
 * printed four times (§5.5: "does any two-in-a-row pair share a composition?").
 * Three things here are structural rather than tuned, and each exists to make
 * this a different KIND of image:
 *
 *  1. **The subject is one small feature magnified until its machining is the
 *     subject.** The punch mouth is 14–18% of frame *height* on the landscape
 *     crops — a mark a few millimetres across shot at 1:1. A8's cut is a
 *     hairline crossing a whole surface; this is a crater you can see the tool
 *     work on.
 *
 *  2. **The energy is radial, not lateral.** §2.1 permits "lateral, orbital,
 *     radial or downward-settling"; A8 took lateral, so this takes radial. The
 *     dominant form is a ring of displaced metal round a conical pit, and the
 *     two bright marks in frame are both arcs of it. There is no long line
 *     carrying the composition.
 *
 *  3. **The surface is tilted away from the lens, and the frame has a focal
 *     plane.** §2.6 allows shallow depth of field "once per plate to separate a
 *     foreground edge", and this is the plate that spends it. The face is turned
 *     `uP[1]` degrees about world X, so depth ramps monotonically up the frame;
 *     the punch sits on the focal plane and the score sits off it. A8's slab is
 *     dead frontal and uniformly sharp.
 *
 * ── HOW DEFOCUS IS BUILT, AND WHAT IT HONESTLY IS ───────────────────────────
 *
 * core.glsl marches one ray per pixel, so there is no aperture to open: optical
 * defocus is not available and pretending otherwise would mean compositing
 * something. What an out-of-focus region actually *is*, measurably, is the loss
 * of high spatial frequencies and of local contrast — so that is what is
 * removed, at two levels:
 *
 *  - **In the material.** `blur` is a real optical quantity here: distance from
 *    the camera minus distance to the punch, over `uP[18]`. It scales the
 *    blast-finish mottle to nothing off the focal plane and widens the specular
 *    lobe, so the far field keeps its tone and loses its texture. That is the
 *    correct direction — a defocused surface does not get darker, it gets
 *    smoother.
 *
 *  - **In the geometry.** The score is cut with a roundover (`uP[17]`) that is
 *    most of its own half-height, so it has no hard lip anywhere: a broad soft
 *    trough rather than a machined edge. §A4 is explicit that out-of-focus
 *    regions "must stay genuinely smooth — no bokeh discs, no specular balls",
 *    and a feature with no high-frequency edge in the model cannot grow one in
 *    the render.
 *
 * ── THE REST OF THE LAW ─────────────────────────────────────────────────────
 *
 * **One punch and one score. Never a row.** §5.2 rejects "a grid of highlights
 * that resolves into a chart at thumbnail size" and "a repeating vertical rhythm
 * that reads as bars", and a machinist's surface is the single most tempting
 * place in this whole system to cut graduations. A ruler edge, a tick row, a
 * scale of any kind, is the reject arriving dressed as research. There is no
 * loop and no modulo in this file: the count is structural, not a parameter, and
 * `mapScene` subtracts exactly two named fields from one body.
 *
 * **The surface has no silhouette, and that is the composition.** It fills the
 * frame on every aspect, so there is no edge of it in shot and the only marks
 * are the two the brief names. This is A8's hardest-won lesson, inherited rather
 * than re-learned: two of its passes gave the slab finite width and both failed
 * on it — first as a hard vertical terminator at frame left, then, once that was
 * pushed off-frame, as its *right* edge walking back into shot on the 16:9 crop.
 * Neither is visible to any gate. The aspect ratio varies by more than 3× across
 * the four crops, so **every extent here is derived from the frame** and none
 * from a world constant.
 *
 * **Nothing ascends and nothing can be made to.** The score runs along the
 * surface's own lateral axis, which is world X, and the tilt is about that same
 * axis — so a rotation of the plate can foreshorten the score but can never lift
 * one end of it. There is no roll parameter in this file. §2.1: on a broker page
 * the eye reads upward as a claim about returns, and this section's claim is
 * about *labelling*, which is the opposite of a claim about returns.
 *
 * One key, positional. §2.4's "gradient across the surface rather than a hotspot
 * in the middle of it" is falloff, and falloff needs a lamp — a source at
 * infinity puts one flat even tone on one flat face (core.glsl's `uKeyRange`
 * note). **No rim** (§2.4 permits one; there is no silhouette here to separate
 * from a background) and **no second light event** (§2.3 rule 2 gives that to
 * Onboarding and Final CTA and to nobody else — `event` stays zero in the
 * section file). Both bright arcs in frame are one key caught by two pieces of
 * geometry, which is why neither is a free-floating blob.
 *
 * Parameters (`uP`):
 *   0 — the face plane's depth on the lens axis, world z. Negative is further.
 *   1 — tilt about world X, **degrees, signed**. + = the top of the frame
 *       recedes; − = the bottom recedes. Sign is a per-crop composition choice.
 *   2 — surface half-depth, world. Only the front face is ever in shot.
 *   3 — punch centre, frame x.
 *   4 — punch centre, frame y.
 *   5 — punch mouth radius, as a fraction of **frame height**. The magnification.
 *   6 — punch depth ÷ mouth radius. Sets the included angle.
 *   7 — roundover left on the punch rim ÷ mouth radius.
 *   8 — burr crest radius ÷ mouth radius.
 *   9 — burr section radius ÷ mouth radius.
 *  10 — how far the burr stands proud of the face ÷ mouth radius.
 *  11 — burr centre offset along the surface's lateral axis ÷ mouth radius.
 *  12 — radius the burr is faired into the face with ÷ mouth radius.
 *  13 — score axis, frame y.
 *  14 — score's near cap, frame x. Its far end leaves through the frame edge.
 *  15 — score half-height ÷ mouth radius.
 *  16 — score half-depth ÷ mouth radius.
 *  17 — roundover left on the score's lip ÷ mouth radius.
 *  18 — depth of field: world distance either side of the punch that stays
 *       sharp. Small, because 1:1 macro genuinely has almost none.
 *  19 — blast-finish mottle amplitude, on albedo.
 */

/* One id: the score, the burr and the punch are all the same casting, not
   objects resting on it. A second material here would say "assembly" where the
   brief says "the measurement is recorded ON the object". */
const int ID_FACE = 1;

/**
 * One frame height is **half** a world unit, not one.
 *
 * core.glsl's `atFrame` documents the z = 0 plane as one world unit tall and it
 * is not — `solveCamera` puts the camera at `0.5 / tan(fov/2)` against a focal
 * of `1 / tan(fov/2)`, so a ray reaches z = 0 at s = 0.5 and the visible plane
 * spans ±0.25. The discrepancy is documented at length on `atFrame` and
 * deliberately left unfixed there, because correcting it rescales every shipped
 * plate at once. This plate names the factor rather than folding it into its
 * numbers, the way `a5-onboarding.glsl` and `a8-terminal.glsl` do — the
 * composition below is stated in frame percentages and it has to mean them.
 */
const float FRAME_H = 0.5;

/**
 * How far in FRONT of the face the cutting cone continues, as a fraction of its
 * depth. **This is not decoration and it cannot be zero.**
 *
 * `opSmoothSub`'s blend term adds up to `k/4` wherever the two surfaces it is
 * blending are close together and both positive. Leave the cone's base disc
 * coplanar with the face — the obvious modelling — and the two boundaries
 * coincide across the *entire* mouth, so the blended field bottoms out at a
 * positive floor instead of at zero. The marcher then stops on a phantom dome
 * stretched over the mouth, shades it with a normal barely distinguishable from
 * the face's, and renders a punched pit as a flat disc at exactly the
 * surrounding tone. An earlier pass of this plate shipped precisely that and it
 * cost two render cycles to see, because a disc that faint looks like a lighting
 * problem rather than a modelling one.
 *
 * Extending the cone past the face makes its *lateral wall* the surface that
 * crosses the plane — two boundaries meeting at an angle rather than lying on
 * top of one another — so the blend does what it is there for: leave a machined
 * roundover on the rim, and nothing anywhere else. It has to clear the burr's
 * crest too, which it does by a factor of six at every value in the section file.
 */
const float PUNCH_OVERHANG = 0.55;

/**
 * World units per unit of frame height, at depth z. Plain similar triangles:
 * `uCamPos.z` is the camera's distance to the z = 0 plane, so a form at z sits
 * `1 − z/uCamPos.z` further away and covers that much more world per pixel.
 *
 * Every size in this plate is quoted as a frame fraction and converted through
 * here, which is what lets the working distance be chosen for shading fidelity
 * (see the section file's `STANDOFF` note) without any composition number moving
 * with it.
 */
float frameScale(float z) {
  return FRAME_H * (1.0 - z / uCamPos.z);
}

/* --------------------------------------------------------- the face's frame */

/*
 * The surface is a plane turned about world X — the same axis the score runs
 * along. That is the only rotation this plate has, and it is chosen rather than
 * a turn about Y for a reason §2.1 cares about: a plane rotated about X keeps
 * every world-X line exactly horizontal in frame (the axis is parallel to the
 * image plane's own horizontal), so the score is level by construction and
 * cannot be tipped into an ascending diagonal by any value in the section file.
 * A turn about Y would send lateral lines to a vanishing point and the score's
 * angle in frame would then depend on where it sat vertically — which is a
 * §2.1 reject that arrives from a camera parameter rather than from a decision.
 */

float faceTilt() {
  return radians(uP[1]);
}

/** Outward normal of the face. +tilt leans it so the top of the frame recedes. */
vec3 faceNormal() {
  float a = faceTilt();
  return vec3(0.0, sin(a), cos(a));
}

/** In-plane "up" — the surface's own vertical, foreshortened in frame by cos(tilt). */
vec3 faceUp() {
  float a = faceTilt();
  return vec3(0.0, cos(a), -sin(a));
}

/** The face passes through this point: on the lens axis, at `uP[0]`. */
vec3 facePivot() {
  return vec3(uCamPos.x, uCamPos.y, uP[0]);
}

/**
 * Frame fraction (origin bottom-left, as §2.7 states dead zones) to the world
 * point where that pixel's ray meets the face.
 *
 * A8 and A5 can get away with `atPlate(f, z)` because their subjects live on a
 * plane of constant depth. This one does not: the face recedes, so a frame
 * fraction names a different z at every height and the mark has to be placed
 * where the *ray* lands, not where a constant-z plane would put it. One
 * ray/plane solve, and then `uP[3]`, `uP[4]`, `uP[13]` and `uP[14]` mean exactly
 * the frame fractions the section file writes down — which is the whole reason
 * §3's compositions can be stated in percentages at all.
 */
vec3 onFace(vec2 f) {
  vec3 n = faceNormal();
  vec3 p0 = vec3(uCamPos.xy + atFrame(f) * FRAME_H, 0.0);
  vec3 dir = p0 - uCamPos;
  float t = dot(facePivot() - uCamPos, n) / dot(dir, n);
  return uCamPos + t * dir;
}

/**
 * World to the face's own coordinates: x lateral (world X), y up the surface,
 * z out of it. A rigid transform, so distances survive it and every SDF below
 * can be written in the frame a machinist would use — "0.1 mm deep, 2 mm across"
 * rather than in camera space.
 */
vec3 faceLocal(vec3 p) {
  vec3 d = p - facePivot();
  return vec3(d.x, dot(d, faceUp()), dot(d, faceNormal()));
}

/** Where the punch lands, in world. Its depth also sets the focal plane. */
vec3 punchWorld() {
  return onFace(vec2(uP[3], uP[4]));
}

/**
 * The mouth radius in world units. `uP[5]` is a fraction of frame height, so
 * this is the magnification made concrete — and it is read at the punch's own
 * depth rather than at the pivot's, because the face recedes and a mark high in
 * a tilted frame is genuinely further away and genuinely bigger in world for the
 * same frame size.
 */
float punchRadius() {
  return uP[5] * frameScale(punchWorld().z);
}

/* ----------------------------------------------------------------- operators */

/**
 * Smooth subtraction — iq's, with `k` as the machined radius left on the lip.
 *
 * The whole point of using it rather than `max(a, -b)` is that a real cut has a
 * roundover where the tool's corner ran, and that roundover *is* the specular
 * hairline §2.5 calls "the single most useful mark in the whole vocabulary". A
 * hard boolean gives a mathematically sharp corner, which the marcher resolves
 * as a one-pixel bright artefact that moves with the sampling grid — thin and
 * bright is not the same thing as a machined edge, and it fails §2.7's
 * 20-level-per-8px step test as aliasing rather than as composition.
 */
float opSmoothSub(float cut, float body, float k) {
  float h = clamp(0.5 - 0.5 * (body + cut) / k, 0.0, 1.0);
  return mix(body, -cut, h) + k * h * (1.0 - h);
}

/**
 * Smooth union, for the burr.
 *
 * A punch *displaces* metal; it does not deposit a washer on the surface. The
 * union radius `uP[12]` is what makes the swell grow out of the face with no
 * seam where it meets it — a hard union would leave a crease circling the mark,
 * and a crease is a second closed line that reads as a machined boss rather than
 * as metal that moved.
 */
float opSmoothUnion(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

/** Torus lying in the local xy-plane, axis along the surface normal. */
float sdTorusZ(vec3 p, float major, float minor) {
  return length(vec2(length(p.xy) - major, p.z)) - minor;
}

/**
 * iq's exact cone: apex at the origin, opening along −Y to a base circle of
 * radius `r` at `y = −h`.
 *
 * A cone rather than a sphere because a centre punch is a ground point, not a
 * ball: a hemispherical dimple reads as a bearing seat or a casting defect,
 * while a cone gives the two things that make the mark legible as *struck* — a
 * dark core at the apex where no light reaches, and one steep wall facing the
 * key that returns a compact crescent. The included angle falls out of the
 * `uP[6]` ratio, which the section file holds near the 70–90° a real punch is
 * ground to.
 */
float sdConeSolid(vec3 p, float r, float h) {
  vec2 q = vec2(r, -h);
  vec2 w = vec2(length(p.xz), p.y);
  vec2 a = w - q * clamp(dot(w, q) / dot(q, q), 0.0, 1.0);
  vec2 b = w - q * vec2(clamp(w.x / q.x, 0.0, 1.0), 1.0);
  float k = sign(q.y);
  float d = min(dot(a, a), dot(b, b));
  float s = max(k * (w.x * q.y - w.y * q.x), k * (w.y - q.y));
  return sqrt(d) * sign(s);
}

/* -------------------------------------------------------------------- fields */

/**
 * The score — the shallow reference line the datum was measured to.
 *
 * It runs from its near cap out through the far frame edge, so only one end of
 * it is ever a form in shot. The far end is measured against the **frame**, not
 * against the surface: the surface is sized off the frame and overscanned, and
 * deriving the score's length from that would put a rounded end at a different
 * frame fraction on every aspect — a floating bar with two visible caps, which
 * is the §5.2 read this plate is most exposed to.
 *
 * 1.22 rather than 1.0 because the cut has to clear the edge by more than its
 * own end radius, or the silhouette carries a curve at the frame boundary and
 * reads as the score having been aimed at the frame rather than continuing past
 * it.
 */
float scoreField(vec3 q, float r) {
  vec2 cap = faceLocal(onFace(vec2(uP[14], uP[13]))).xy;
  float far = faceLocal(onFace(vec2(1.22, uP[13]))).x;
  float halfLen = 0.5 * (far - cap.x);

  vec2 section = vec2(uP[15], uP[16]) * r;
  /* Centred *on* the face plane, so the box straddles it and removes exactly
     `uP[16]` from the surface — a scratch, not a through-slot. The section's own
     corner radius is most of its half-depth, so the trough is very nearly
     half-round: the shape a scriber's point leaves, and not the flat-bottomed
     pocket a cutter walks (which is A8's channel, and is not this). */
  return sdRoundBox(
    q - vec3(cap.x + halfLen, cap.y, 0.0),
    vec3(halfLen, section),
    min(section.x, section.y) * 0.85
  );
}

/** The punched datum. One cone, apex `uP[6]` × radius behind the face. */
float punchField(vec3 q, vec2 centre, float r) {
  float depth = uP[6] * r;
  float height = depth * (1.0 + PUNCH_OVERHANG);
  /* Solved so the cone's radius at the face plane is exactly `r` — the mouth the
     section file asked for — with the extra `PUNCH_OVERHANG` standing proud. */
  float base = r * (1.0 + PUNCH_OVERHANG);

  vec3 rel = vec3(q.xy - centre, q.z + depth);
  /* Into the cone's own space: radial from the two in-plane axes, and its −Y
     mapped onto the surface normal so the pit opens toward camera. Written as a
     swizzle rather than as a rotation because the axis is the one thing in this
     plate that must never become a parameter — a tilted punch is a directional
     mark, and a directional mark on a broker page is an arrow (§2.1). */
  return sdConeSolid(vec3(rel.x, -rel.z, rel.y), base, height);
}

Hit mapScene(vec3 p) {
  vec3 q = faceLocal(p);
  vec3 pw = punchWorld();
  vec2 centre = faceLocal(pw).xy;
  float r = uP[5] * frameScale(pw.z);

  /*
   * The surface, sized off the frame and centred on the lens axis, so no edge of
   * it is ever in shot on any aspect — §A1's "a section of something much
   * larger, cropped", taken literally.
   *
   * The overscan is 3.4× rather than A8's 1.5× and the difference is the tilt:
   * a plane turned 26° puts its far edge much further away than the pivot, where
   * a unit of frame buys ~40% more world, so an extent that covers the frame at
   * the pivot's depth does not cover it at the top of the image. 3.4× is enough
   * that no tilt, depth or fov in any future crop can walk an edge back into
   * shot — the failure that cost A8 two passes and that no gate can see.
   *
   * No `loopSettle()` term. This plate is a still (`motion: null`), and §2.3
   * rule 3 reserves perpetual motion for the primary action.
   */
  float h = frameScale(uP[0]) * 3.4;
  float body = sdBox(vec3(q.x, q.y, q.z + uP[2]), vec3(h * uAspect, h, uP[2]));

  /*
   * The burr: the ring of metal the punch shoved out of its own hole, faired
   * into the face so there is no seam. Its centre is offset from the pit's by
   * `uP[11]`, which is what stops it being a machined boss — a struck mark
   * throws more metal on one side than the other, and an exactly concentric
   * annulus is a lathe operation. The offset is an exact translation of the
   * torus rather than an angular modulation of its radius, so the field stays a
   * true distance and the marcher does not have to be slowed down to survive it.
   */
  vec3 burrAt = vec3(centre + vec2(uP[11] * r, 0.0), -(uP[9] - uP[10]) * r);
  float burr = sdTorusZ(q - burrAt, uP[8] * r, uP[9] * r);
  body = opSmoothUnion(body, burr, uP[12] * r);

  /*
   * Two cuts, subtracted in the order the machinist made them: the reference
   * scribed first, the datum struck beside it. Each gets its own roundover —
   * `uP[17]` for the score's lip and `uP[7]` for the punch's rim — because they
   * are different operations, and one shared radius would make the punch read as
   * having been milled rather than hit. The score's is deliberately the wider of
   * the two: it is the out-of-focus form (see the header), and a soft geometry is
   * the only kind of softness a one-sample-per-pixel marcher can actually
   * produce.
   */
  float d = opSmoothSub(scoreField(q, r), body, uP[17] * r);
  d = opSmoothSub(punchField(q, centre, r), d, uP[7] * r);

  return Hit(d, ID_FACE);
}

Material materialFor(int id, vec3 p, vec3 n) {
  vec3 q = faceLocal(p);
  float r = punchRadius();

  /*
   * §2.6's one permitted use of shallow depth of field, as a scalar.
   *
   * Signed distance from the focal plane, which is the punch's own distance from
   * the lens — everything about this plate says the mark is what was focused on.
   * `uP[18]` is small in world units because 1:1 macro genuinely has almost no
   * depth of field, and the tilt is what turns that into a *composition*: depth
   * ramps monotonically up (or down) the frame, so `blur` is a smooth vertical
   * gradient with no edge in it anywhere.
   */
  float e = (length(p - uCamPos) - length(punchWorld() - uCamPos)) / max(uP[18], 1e-4);
  float blur = 1.0 - exp(-e * e);
  float sharp = 1.0 - blur;

  /*
   * "Bead-blasted aluminium — matte, diffuse, holds a soft gradient beautifully.
   * The default surface for large faces" (§2.5). Isotropic on purpose: §2.5 also
   * permits a brushed grain and requires it to run across the frame rather than
   * up it, but a lateral grain running parallel to a lateral score is a second
   * line at texture scale, and two parallel lines is the rhythm §5.2 rejects,
   * arriving through texture instead of through geometry.
   */
  Material m = matAluminiumBlasted();

  /*
   * The lips are not blasted. Their normals sweep through the mirror direction
   * within the width of the roundover, so a tighter lobe there is what keeps the
   * catch a hairline rather than letting it spread onto the face either side of
   * the cut. "On the face" is a normal test against the *surface's* normal
   * rather than against camera z, because the face is tilted — with the surface
   * sized off the frame, every plane in this plate that is not parallel to it
   * belongs to one of the three features.
   */
  float onFaceN = smoothstep(0.86, 0.995, abs(dot(n, faceNormal())));
  m.rough = mix(0.20, 0.45, onFaceN);

  /*
   * Bead blast is a stochastic finish, and a mathematically flat plane lit by a
   * lamp is the one thing in this system that reads instantly as a render: an
   * unbroken 160-level ramp with no incident anywhere in it. This is ±`uP[19]`
   * on albedo at a feature size of roughly a fifth of the punch's radius — low
   * frequency, isotropic, and far too coarse and too shallow to trip §2.7's
   * 20-level-per-8px edge test, which it clears by an order of magnitude inside
   * the reserve where radiance is already attenuated.
   *
   * The frequency is quoted **against the punch radius** rather than as a world
   * constant, because the working distance is not free (see the section file)
   * and a texture frequency written in world units silently becomes finer the
   * moment the subject is moved back. Relative to the mark, the blast stays the
   * same size on the metal however far away the metal is — which is what a
   * finish actually does.
   *
   * `uSeed` rather than a constant so the mottle is not identical between crops;
   * a surface texture that lines up across four breakpoints is one more way a
   * set says it came from a single render (§5.3).
   *
   * It is scaled by `sharp`: this is the defocus, and it is the honest half of
   * it. A defocused surface loses its texture and keeps its tone.
   */
  float mottle = valueNoise(p * (0.95 / max(r, 1e-4)) + uSeed) - 0.5;
  m.albedo *= 1.0 + mottle * uP[19] * sharp;
  m.rough *= 1.0 + mottle * 0.12 * sharp;

  /*
   * The burr's crown, and the only place in the plate with a *fine* texture on
   * it. Metal that has been displaced by a point is torn rather than cut, so its
   * crest is broken at a much smaller scale than the blast — which is what stops
   * the one bright arc in the frame from rendering as a clean glassy line.
   * §5.2's "highlight bright enough to look like a button" is a smooth,
   * unbroken, evenly-lit shape; a broken one cannot be mistaken for a control.
   */
  float onBurr = smoothstep(0.0, 0.06 * r, q.z);
  float tear = valueNoise(p * (6.5 / max(r, 1e-4)) + uSeed * 3.1) - 0.5;
  m.rough *= 1.0 + tear * 0.34 * onBurr * sharp;
  m.albedo *= 1.0 + tear * 0.12 * onBurr * sharp;

  /*
   * The other half of the defocus: off the focal plane the lobe widens. An
   * out-of-focus specular is a broad, low, smooth return, and widening the
   * roughness is exactly the difference between a softbox and a dimmed flashgun
   * that core.glsl's `uKeySoft` already relies on — spread, not attenuation.
   */
  m.rough = clamp(m.rough + blur * 0.22, 0.03, 1.0);

  /*
   * Depth below the face, as a fraction of the punch's own depth: 0 on the flat
   * surface, a fifth or so on the floor of the score, 1 at the apex of the pit.
   *
   * This is a material fact rather than a light trick — a struck surface exposes
   * a finer, less diffusing finish, and the inside of an 80° pit sees almost
   * none of the room. AO and the cone-traced shadow already do most of the work;
   * this is what stops the pit's one lit wall returning enough to compete with
   * the burr's crest, which would give the plate two equal marks instead of one
   * subject with a shadow in it (§2.3 — the plate may be lit, it may not be
   * bright).
   *
   * A position test rather than a field test, on purpose: `opSmoothSub` moves
   * the real surface away from where either field is zero, so `punchField(p) < 0`
   * is not true anywhere on the geometry it cut. Depth is unambiguous.
   */
  float depthIn = clamp(-q.z / max(uP[6] * r, 1e-4), 0.0, 1.0);
  m.albedo *= mix(1.0, 0.42, depthIn);

  return m;
}
