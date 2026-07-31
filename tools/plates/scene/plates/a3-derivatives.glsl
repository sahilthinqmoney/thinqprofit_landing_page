/*
 * A3 — Products, featured card: Futures & Options. docs/art-direction.md §3.
 *
 * "Two machined aluminium rings on offset axes, one passing through the other,
 * held in dark space. Where they intersect, the near ring's chamfer catches a
 * hard highlight and the far ring's face goes to ink behind it. Both rings are
 * cropped by the frame — the composition is a detail of a larger mechanism. The
 * intersection sits at roughly 60% width, 65% height. Top 40% is empty.
 * Critically: the rings are static and level. No implied rotation, no motion
 * arc, no ascending axis."
 *
 * Two `sdRingSlab` calls and nothing else in frame. §A3's materials line is
 * explicit that the mounts are "not in frame", so there is no third form to add
 * and no anodised plane to hide a composition problem behind: if the two rings
 * do not read, the plate does not read.
 *
 *
 * THE THREE THINGS THAT DECIDE THIS PLATE
 * ---------------------------------------
 * All three were found by measuring renders, not by reasoning about them, and
 * each of them is a way the plate can be geometrically correct and still ship a
 * black rectangle.
 *
 * **1. Which sense each ring is tilted in.** A projected ellipse has two rings
 * behind it, tilted the same amount in opposite senses — identical in outline,
 * opposite in which way the ring *faces*. The wrong one costs the whole plate,
 * because these materials are metal: `matAluminiumBrushed` is `metal = 1.0`, so
 * `shade` gives them no diffuse term at all and a surface out of reach of the
 * specular lobe is not dim, it is ink. Both rolls below are past 180° for that
 * reason: they are the senses that turn each ring's camera-side face toward the
 * key, which sits at `axis·h` 0.98 (near) and 0.91 (far).
 *
 * **2. How far off face-on each ring is.** A ring tilted past ~60° presents
 * almost none of its annular face to the lens — its *rim* carries the projected
 * area instead, and a rim can only be lit by a half-vector lying in the ring's
 * plane, which is the opposite of what point 1 needs. So both rings here are
 * kept at moderate tilts (38° and 52°) where the face is what fills the outline.
 * They still read as two distinct axes: 52° against 38°, rolled 54° apart, is a
 * visibly different ellipse and a visibly different attitude.
 *
 * **3. Where the silhouettes fall relative to §2.7's reserve.** The dead zone is
 * measured for *edges*, not brightness — "a machined chamfer running through a
 * headline breaks legibility even when the average is near black" — and
 * `uDeadFloor` attenuates radiance without removing the step at a boundary. A
 * chamfer at scene radiance 5 still lands ~45 sRGB levels above ink after a 0.02
 * floor. So the reserve is kept clear geometrically: both rings' projected
 * outlines top out *below* each crop's dead rect, and below the CTA patch's
 * right edge at the bottom. The per-crop `pan` in derivatives.mjs is solved
 * against that constraint, not chosen.
 *
 *
 * THE COMPOSITION
 * ---------------
 * Two rings, centres off the bottom-right of frame, so each shows its crown and
 * its left flank and runs out of the frame below. They cross once in the live
 * band of every crop, at a 25°–51° angle so it reads as a crossing rather than as
 * two arcs kissing, with the near ring 0.3 world units in front — enough that its
 * chamfer is drawn over the far ring's face, which is §A3's sentence exactly.
 *
 * Both forms are therefore *domes*: they rise, turn over, and fall, entirely
 * inside the frame. That matters for §2.1. A large arc that only shows its rising
 * half is an ascending dominant line no matter what it is a section of, and it is
 * the failure this plate is most exposed to, because a ring is mostly diagonal.
 * Showing the crown is what makes the energy read as orbital and settling.
 *
 * The single crossing is framed differently by each crop rather than a different
 * crossing being used per crop: derivatives.mjs pans to put it at 60% / 65% on
 * desktop, 63% / 70% on tablet, 70% / 72% on mobile, 55% / 67% on wide. The
 * lateral drift is not drift — it is what keeps the rings' lower-left arcs out of
 * the CTA patch in the two narrow crops, where the same rings occupy far more of
 * the frame width.
 *
 *
 * FRAME SPACE
 * -----------
 * Ring centres are given in the plane z = 0 of `atFrame`'s space. Depth is then
 * applied *without changing the projection*: `depthScale` divides a ring's
 * position and radius by its own perspective magnification, so pushing the far
 * ring to z = -0.26 separates the two in space and in occlusion while leaving
 * both at the apparent size they were composed at. That is not a dodge around
 * perspective, it is §A3's camera note made literal — "Compression is deliberate:
 * the long lens flattens the two rings toward each other, which is the reading —
 * interlocked, not receding." A 135mm lens at this distance very nearly does it
 * on its own; doing it exactly means the crossing lands where the brief says on
 * every crop rather than only on the one the depth happened to be tuned against.
 *
 *
 * Parameters (`uP`):
 *   0 — ring scale, 1.0 (mobile) → 1.12 (wide). Applied to both radii and to
 *       both centres' offsets from `RIG_ANCHOR`, so the crossing scales with the
 *       rig instead of sliding out from under the camera.
 *   1 — wide crop only: blends the far ring onto a larger, differently rolled
 *       axis. See FAR_C_WIDE.
 *
 * No loop term. derivatives.mjs sets `motion: null` — this plate ships as four
 * stills — and a `loopSettle()` the renderer never samples is dead weight
 * pretending to be motion design.
 */

const int ID_NEAR = 1;
const int ID_FAR = 2;

/* The point `uP[0]` scales the rig about. Sitting inside the pair rather than at
   the world origin makes the scale a pull-back: the rings grow around the
   crossing instead of sliding it out of frame. */
const vec2 RIG_ANCHOR = vec2(0.19, -0.62);

/*
 * Each ring is stated as the ellipse it projects to — centre, semi-major, and
 * cos(tilt), which is exactly the ratio of the projected axes — because that is
 * the form the composition was solved in. `ringLocal` turns it back into a
 * circle in 3D.
 */
const vec2 NEAR_C = vec2(0.400, -0.675);
const float NEAR_A = 0.360;
const float NEAR_COS = 0.788; /* 38° off face-on */
const float NEAR_ROLL = 4.3284; /* 248° */
const float NEAR_Z = 0.26;

const vec2 FAR_C = vec2(0.425, -0.825);
const float FAR_A = 0.440;
const float FAR_COS = 0.616; /* 52°, and rolled 54° round: the second axis */
const float FAR_ROLL = 5.2709; /* 302° */
const float FAR_Z = -0.26;

/*
 * The wide crop's far ring, blended to by `uP[1]`.
 *
 * §A3's wide note is the only per-crop instruction in this plate that changes
 * what is in frame rather than how much of it: "a third of the far ring's arc now
 * sweeps into the right edge, giving the wide frame a lateral line. Still no
 * ascending diagonal." The desktop far ring cannot deliver that by being scaled —
 * every uniform growth of it either takes the crossing off frame or brings its
 * *rising* half through the right edge, which is the §5.2 tell "any form whose
 * dominant axis leads out of the top-right corner". So the wide crop re-sets it:
 * a larger ring, rolled 38° further round and pushed right, which brings its
 * falling half across the live band and out through the right edge at 20% height
 * on a −0.41 slope. Lateral, and descending rather than rising.
 *
 * Re-setting a form for one crop is not a licence taken lightly, but it is what
 * §5.3 asks for in as many words — "the four crops are four photographs, not four
 * exports" — and the crossing survives it at 55% width, 67% height, at a 51°
 * angle, which is the widest crossing of the four.
 */
const vec2 FAR_C_WIDE = vec2(0.700, -0.800);
const float FAR_A_WIDE = 0.560;
const float FAR_ROLL_WIDE = 5.9341; /* 340° */

/*
 * Section and chamfer.
 *
 * 0.10 × 0.09 world — a fifth of the frame height — because §2.5's chamfer only
 * describes a form if there are two faces for it to describe the meeting of. A
 * thin ring is one line; a ring of visible stock is a rim that carries a
 * gradient, a face that carries the tool path, and a hairline between them, and
 * that is the difference between an object and a scratch.
 *
 * The chamfer is the number the whole plate turns on (§2.5, and core.glsl's note
 * on `sdRingSlab`). 0.013 is ~13% of the section: tight enough that the specular
 * stays a hairline describing an edge rather than widening into a lit band, which
 * would be both a worse photograph and a §2.3 problem — a lit band is area, and
 * area at that luminance starts competing with the button.
 */
const vec2 SECTION = vec2(0.050, 0.045);
const float CHAMFER = 0.013;

/** Perspective magnification of the plane at `z`, relative to z = 0. */
float depthScale(float z) {
  return (uCamPos.z - z) / uCamPos.z;
}

/** How far toward the wide crop's far ring we are. 0 on the other three. */
float farBlend() {
  return clamp(uP[1], 0.0, 1.0);
}

vec2 farCentre() {
  return mix(FAR_C, FAR_C_WIDE, farBlend());
}

float farRadius() {
  return mix(FAR_A, FAR_A_WIDE, farBlend());
}

float farRoll() {
  return mix(FAR_ROLL, FAR_ROLL_WIDE, farBlend());
}

/**
 * World → ring space.
 *
 * `sdRingSlab` lives in the XZ plane with its axis on +Y, so the transform is
 * rotZ(roll) · rotX(tilt + 90°) and this is its inverse. Composing the two rotX
 * terms rather than applying them separately keeps it to two matrices.
 */
vec3 ringLocal(vec3 p, vec2 centre, float roll, float cosTilt, float z) {
  float k = depthScale(z);
  vec2 scaled = RIG_ANCHOR + (centre - RIG_ANCHOR) * uP[0];
  vec2 world = uCamPos.xy + (scaled - uCamPos.xy) * k;
  return rotX(-acos(cosTilt) - 1.5707963) * rotZ(-roll) * (p - vec3(world, z));
}

/** The ring axis in world space — rotZ(roll) · rotX(tilt + 90°) applied to +Y. */
vec3 ringAxis(float roll, float cosTilt) {
  float sinTilt = sqrt(max(1.0 - cosTilt * cosTilt, 0.0));
  return vec3(sin(roll) * sinTilt, -cos(roll) * sinTilt, cosTilt);
}

Hit mapScene(vec3 p) {
  float kN = depthScale(NEAR_Z) * uP[0];
  vec3 qn = ringLocal(p, NEAR_C, NEAR_ROLL, NEAR_COS, NEAR_Z);
  float near = sdRingSlab(qn, NEAR_A * kN, SECTION * kN, CHAMFER * kN);

  float kF = depthScale(FAR_Z) * uP[0];
  vec3 qf = ringLocal(p, farCentre(), farRoll(), FAR_COS, FAR_Z);
  float far = sdRingSlab(qf, farRadius() * kF, SECTION * kF, CHAMFER * kF);

  return closer(Hit(near, ID_NEAR), Hit(far, ID_FAR));
}

Material materialFor(int id, vec3 p, vec3 n) {
  /*
   * Brushed, tangent on world X. §2.5 makes the direction a rule rather than a
   * preference — grain running up the frame is an ascending line at texture
   * scale, and at thumbnail size the texture is the first thing that reads. It
   * stays on world X for the turned faces too: a tangential (genuinely turned)
   * anisotropy would sweep its highlight around the circumference, and §A3's
   * first constraint is that these rings carry "no implied rotation".
   */
  Material m = matAluminiumBrushed(vec3(1.0, 0.0, 0.0));

  bool isNear = id == ID_NEAR;
  vec3 axis = isNear ? ringAxis(NEAR_ROLL, NEAR_COS) : ringAxis(farRoll(), FAR_COS);
  vec3 q = isNear
    ? ringLocal(p, NEAR_C, NEAR_ROLL, NEAR_COS, NEAR_Z)
    : ringLocal(p, farCentre(), farRoll(), FAR_COS, FAR_Z);

  /*
   * Three surfaces, not two, split on how far the normal has turned off the ring
   * axis. A slab ring has an annular *face* at |n·axis| = 1, an outer and inner
   * *rim* at |n·axis| = 0, and the machined *chamfer* between them at ~0.7 — and
   * A1's two-way face/not-face split silently files the rim in with the chamfer.
   * On A1's form that is harmless, because its band is 0.88 deep and its rim is
   * the subject. Here it was fatal, and measurably so: with the rim carrying a
   * chamfer's 0.12 roughness and 0.86 anisotropy, the near ring rendered with
   * every pixel at or below sRGB 9.
   *
   * The reason is `specularLobe`. It stretches the highlight *along* the brush
   * tangent and narrows it hard across — `ay = a / (1 + aniso·2.4)`. The tangent
   * is world X (§2.5), the key is on world −X, so the offset between a surface
   * normal and the half-vector here is almost entirely across the grain, in the
   * narrow axis. At `aniso = 0.86` that is a hairline and nothing else.
   *
   * So: brushed and tight on the chamfer, where the grain is what makes the
   * hairline read as cut metal; broad on both large surfaces either side of it,
   * which is also what §2.5 asks for on a face this size — "bead-blasted —
   * matte, diffuse, holds a soft gradient beautifully. The default surface for
   * large faces."
   */
  float toAxis = abs(dot(n, axis));
  float onFace = smoothstep(0.58, 0.94, toAxis);
  float onRim = 1.0 - smoothstep(0.10, 0.44, toAxis);
  float onChamfer = clamp(1.0 - onFace - onRim, 0.0, 1.0);

  m.rough = 0.46 * onFace + 0.50 * onRim + 0.12 * onChamfer;
  m.aniso = 0.06 * onFace + 0.10 * onRim + 0.86 * onChamfer;
  m.albedo = 0.56 * onFace + 0.60 * onRim + 0.64 * onChamfer;

  /*
   * §A3: "Turned aluminium with a visible concentric tool path on the ring faces
   * — the one place in the system where a machined texture is allowed to be
   * legible, because it is what tells the eye these are made objects."
   *
   * Concentric because the radius in ring space is what it is cut against, and
   * held to a roughness ripple rather than a normal one so it never throws a
   * highlight of its own: it modulates how sharp the face's gradient is, which is
   * what a real tool path does, and cannot produce a bright ring that would read
   * as a second light or as rotation. Faces only — the chamfer is the cut *after*
   * the turning and carries none of it.
   */
  float radius = length(q.xz);
  float toolPath = sin(radius * 860.0);
  m.rough += toolPath * 0.05 * onFace;

  /*
   * The far ring sits back by 0.07 of roughness. Not a different material —
   * §A3 specifies one — but the far ring is further from the key and reads that
   * way: its highlight is broader and lower, so the near ring's chamfer is
   * unambiguously the hard mark at the crossing and the far ring's face is what
   * "goes to ink behind it". Doing this with roughness rather than with a second
   * light is what keeps the plate inside §2.4's one-key rule.
   */
  if (!isNear) {
    m.rough += 0.07;
    m.albedo -= 0.05;
  }

  m.rough = clamp(m.rough, 0.03, 1.0);
  return m;
}
