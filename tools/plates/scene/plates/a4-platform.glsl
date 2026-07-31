/*
 * A4 — Platform. docs/art-direction.md §3.
 *
 * "Extreme macro across the edge of a slab of dark tinted glass laid on
 * anodised black. The glass edge runs laterally across the lower-left of the
 * frame, and the key refracts through its chamfer into a narrow band of
 * separated light — not a rainbow, a *luminance* separation, near-neutral, the
 * way a real dark glass edge behaves. Focus sits on about 15% of that edge; the
 * rest of the run falls off in both directions. The right half of the frame is
 * glass surface reflecting nothing but a soft dark gradient."
 *
 * Two primitives: one slab and the plane it rests on. That is not economy for
 * its own sake — §A4 is the only brief in the set whose subject is a *surface
 * and an edge* rather than an object, and every additional form in frame turns
 * it back into a still life. It is also the plate that renders at 2×
 * supersample up to 5120×2880, and a slab plus a plane keeps `mapScene` at two
 * evaluations.
 *
 * Parameters (`uP`):
 *   0 — wide crop only: a second, further glass edge entering at the far left.
 *   1 — refraction band width, 0.34 (mobile) → 0.26 (wide).
 *   2, 3 — where the band crosses the frame, as a frame fraction.
 *   4 — the arc: how hard the edge curves along its own run.
 *   5 — the face's tilt out of the lens plane, in radians.
 *
 * 2–5 are this plate's answer to §5.3, and they are why the contract is six
 * numbers rather than two. §A4 asks for four *compositions* — "across the
 * bottom 20% only", "in the bottom-left quadrant", "across lower-left, band at
 * ~28% width", "a second, further edge at the far left" — and a plate that
 * interpolates one composition across four aspect ratios is exactly the
 * "reframing the same file" §5.3 exists to catch. So each crop states its own
 * edge position, its own curvature and its own camera relationship to the
 * surface, and the four renders share a subject rather than a picture.
 *
 * ---------------------------------------------------------------------------
 * Two things about this plate are solved rather than dialled, and both need
 * saying before any of the numbers below make sense.
 *
 * **1. The slab's orientation is derived from the key, not authored.**
 *
 * §A4's key is grazing and almost entirely lateral — "a single hard source from
 * camera-left, low and almost in the plane of the glass, so it enters the
 * chamfer rather than reflecting off the face". That is what produces the
 * single band and it is also what makes the geometry unforgiving: at these
 * focal lengths the view vector is +Z across the whole frame, so the
 * half-vector `h = normalize(l + Z)` is effectively *constant*, and a specular
 * exists only where the surface normal reaches it. A chamfer is a cylindrical
 * fillet: its normals sweep the plane perpendicular to the edge it runs along,
 * so a lateral edge catches this key only if that plane contains `h` — which
 * pins the slab's yaw to `atan(h.x, h.z)` exactly. Author the yaw by eye
 * instead and the edge is either black or a full-length blaze, with almost
 * nothing in between, and it changes between crops because each crop tilts the
 * key slightly. `glassFrame()` therefore recomputes the frame from the light,
 * and every crop gets a band by construction.
 *
 * Two things fall out of solving it from a *camera-left* key rather than a
 * camera-right one, and both are why `platform.mjs` was corrected to the side
 * §A4 actually briefs. The glass body lands up and to the right, so "the right
 * half of the frame is glass surface" is true by construction rather than by
 * luck. And the edge runs *toward* the lens as it goes right, so it diverges
 * from the vanishing point instead of climbing toward it: the dominant line
 * descends left-to-right on its own, and §2.1 is satisfied by the solve rather
 * than corrected for afterwards. `TILT` only has to add a little.
 *
 * **2. The plate composes in frame space, not world space.**
 *
 * `platform.mjs` moves the camera by `pan` between crops — mobile sits at
 * y = −0.86 and desktop at y = −0.20. The z = 0 plane is half a world unit
 * tall in frame, so that is 1.3 *frame heights* of separation with no overlap
 * at all: no single world-space edge line can appear in all four crops, let
 * alone appear at the height §A4's crop table asks for in each. §A4 states its
 * compositions as frame percentages ("across the bottom 20%", "band at ~28%
 * width"), so `frameToWorld` places the edge at a frame fraction and lets pan
 * fall out of the arithmetic. `uP[1]` then carries the crop index — it is the
 * only per-crop scalar this plate is handed, and `platform.mjs` varies it
 * monotonically mobile → wide, which is the direction §A4's crop table moves
 * the edge in too.
 */

const int ID_GLASS = 1;
const int ID_FAR = 2;
const int ID_BASE = 3;

/*
 * The face's tilt out of the plane perpendicular to the lens, in radians.
 *
 * This is the "how far across the edge are we looking" number and it does two
 * jobs at once. It sets how foreshortened the glass surface is: at 0.58 rad
 * (33°) the face meets the lens at 64° incidence, which is §2.6's "100mm macro
 * at 1:2, rack sitting mid-edge" — across the edge, not down onto the slab.
 *
 * And it decides *where on the fillet the band lands*. With the yaw solved, the
 * half-vector in slab space sits at 85° − FACE_TILT around the chamfer,
 * measured from the face: 0.58 rad puts it at 52°, i.e. squarely on the
 * chamfer's own arc rather than creeping onto the polished face (which would
 * light the surface §A4 wants smooth) or onto the cut end (which would read as
 * a lit strip of thickness rather than as an edge).
 */
const float FACE_TILT = 0.58;
/* The wide crop's second edge: how far it is lifted above the main slab, how
   hard it arcs, and how fast it descends. Together they decide how much of it
   is in frame — it sinks below the main surface once its arc has eaten the
   lift, which is what keeps it to the far left instead of running the width. */
const float FAR_LIFT = 0.05;
const float FAR_ARC = 1.3;
const float FAR_TILT = 0.5;
/* Slab thickness. §A4 says 12–20mm glass, and §2.6 puts the camera at 1:2 on a
   full frame — a 48mm tall subject field — so 16mm is a third of frame height
   before foreshortening. 0.055 against the frame's 0.5 is that, seen at 64°. */
const float GLASS_T = 0.140;
/*
 * How far the slab runs past the frame, and how deep the body is. §A4 wants a
 * macro *across* an edge — "a section of something much larger" — so no end of
 * the slab may be in frame on any crop.
 *
 * The two run figures are deliberately different, and that asymmetry is the
 * yaw solve showing through. Local +x travels toward the lens, so the slab
 * leaves the right of frame after about 0.6 of a unit and anything past that is
 * *in front of the camera plane*: extend it symmetrically and the near end
 * looms in from the side as a hard straight silhouette across the copy column,
 * which is exactly the edge §2.7 forbids inside a reserve. Local −x recedes, so
 * it is cheap and has to be long.
 */
const float RUN_NEAR = 1.2;
const float RUN_FAR = 6.0;
const float DEPTH = 2.6;
/*
 * The dome. A real 12–20mm slab is flat, and a flat face under a directional
 * key is one flat tone — which is the failure mode this plate is likeliest to
 * ship: a beautifully graded rectangle of nothing. The brief's two demands are
 * both curvature, so the slab carries a very slight optical bow:
 *
 *  - `BOW_X` runs along the edge and is what makes the band *local*. On a
 *    straight fillet the specular condition holds along the entire run and the
 *    highlight is a full-width hairline; bowing the run rotates the normal out
 *    of `h` on either side, so the band is bright over the middle and dies both
 *    ways. 0.18 turns the normal by 2·0.18·x radians, which passes the lobe
 *    width (α ≈ 0.018 under this crop's hard key) at x ≈ ±0.05 of a visible run
 *    near 0.9 — §A4's "focus sits on about 15% of that edge".
 *  - `BOW_Z` runs into the body and is what makes the upper frame a *lit*
 *    falloff rather than flat black. It is the plate's answer to "everything
 *    above is smooth dark gradient": N·L on the face drifts as the surface
 *    curves away, so the tone decays up-frame instead of stopping.
 *
 * Both are shallow enough to be invisible as curvature — 0.02 of drop over a
 * quarter of the frame — which is the point. The moment the bow reads as a bow
 * the slab becomes a lens, and a lens is an object.
 */
const float BOW_X = 0.19;
const float BOW_Z = 0.34;
/*
 * How much total drop each bow is allowed, as the cap on its squared term.
 *
 * A parabola is unbounded and this slab runs six units past the frame, so an
 * unbounded bow is not a shallow curve — it is a dome, and a dome has a
 * *horizon*. Both artefacts this plate went through were that horizon: first
 * the far end folding through the ground and re-entering as a hard straight
 * silhouette, then, once the bow was continued linearly instead, the surface
 * curving away into a long ascending terminator across the copy column, which
 * is a §2.1 reject on top of a §2.7 one.
 *
 * Rolling the square off asymptotically fixes both at once and keeps the
 * surface C^∞ where a clamp would leave a shading crease: the face curves where
 * the frame can see it curving and is flat everywhere else, so it runs off the
 * top of frame as a plane and never shows an end.
 */
const float X_BOW_CAP = 0.55;
const float Z_BOW_CAP = 0.30;
/*
 * The descent. §2.1 bans an ascending dominant line. With the key on the side
 * §A4 briefs, the perspective already delivers one — the edge advances toward
 * the lens as it goes right and so falls away from the vanishing point — and
 * TILT only has to make sure the short stretch left of the band, where the bow
 * is still climbing to its apex, cannot read as a rise. 0.04 is enough: it puts
 * the frame's left edge marginally *below* the band rather than above it.
 *
 * It is a slope on the dome rather than a roll on the camera on purpose. A
 * rolled camera tilts the whole frame, and a dutch angle on an otherwise
 * motionless macro reads as a stylistic tic in a set of five level plates.
 */
const float TILT = 0.07;
/*
 * The chamfer radius, at `uP[1] = 0.28` (the desktop band width). The single
 * most load-bearing number here, the same way it is in A1: it is the width of
 * the band, and the band is the subject. Scaled by the crop's `uP[1]` so the
 * mobile crop — where the whole composition is 20% of a 900px-wide frame — gets
 * a band that survives the encode, and the wide crop gets the tightest one.
 */
const float CHAMFER = 0.045;
/* The dome displaces along Y, so the field is no longer unit-Lipschitz. 1.25
   covers the worst gradient the bow can produce inside the frame; marching an
   over-estimating field is how a fillet this thin acquires stair-steps. */
const float LIPSCHITZ = 1.25;

/* Per-crop composition, with this file's own constants as the fallback so the
   plate still renders if a crop omits them. */
float arc() { return uP[4] > 0.0 ? uP[4] : BOW_X; }
float faceTilt() { return uP[5] > 0.0 ? uP[5] : FACE_TILT; }

/**
 * The band's chamfer roughness, tied to the arc.
 *
 * The arc and the lobe width set the band's length between them — it runs until
 * the arc has turned the normal α out of the half-vector, so the length is
 * α/2·arc. Left alone, giving the portrait crops the much harder curvature
 * their short visible run needs would also shrink their band to nothing. Tying
 * the polish to √arc holds the band at roughly a sixth of the run on all four
 * crops while the *shape* of the edge changes completely between them, which is
 * the §5.3 difference that actually matters.
 */
float bandRough() {
  return clamp(0.130 * sqrt(arc() / 0.19), 0.06, 0.26);
}

/**
 * Frame fraction → world xy at depth `z`, with the pan and the real frame
 * scale in it.
 *
 * core.glsl's `atFrame` assumes the z = 0 plane is one world unit tall and that
 * the camera is unpanned. It is neither here: `solveCamera` puts the half-height
 * at 0.25, and `platform.mjs` pans every crop. Both matter on this plate more
 * than on A1 — the composition is one line placed at one frame height, and a 2×
 * scale error puts it off the bottom.
 */
vec2 frameToWorld(vec2 f, float z) {
  float d = uCamPos.z;
  return uCamPos.xy + vec2((f.x - 0.5) * uAspect, f.y - 0.5) * (0.5 * (d - z) / d);
}

/**
 * The key's direction at a point. §A4's key is a *lamp*, not a source at
 * infinity — "low and almost in the plane of the glass" is a position, and the
 * falloff off it is what makes the run die away from the band instead of
 * running the width of the frame. core.glsl shades with the same rule.
 */
vec3 keyDirAt(vec3 p) {
  if (uKeyRange > 0.0) return normalize(uKeyPos - p);
  return normalize(uKeyDir);
}

/**
 * World → slab space, solved from the key. See header note 1.
 *
 * Solved at the *anchor* — the point on the edge where the band is wanted —
 * because with a lamp this close the light direction swings across the frame,
 * and the yaw only has to be exact where the band is.
 *
 * Yaw is `atan(h.x, h.z)`, built from `h.xz` directly rather than through
 * `atan`/`cos`/`sin`, because this runs inside every `mapScene` call.
 */
mat3 glassFrame(vec3 anchor) {
  vec3 h = normalize(keyDirAt(anchor) + vec3(0.0, 0.0, 1.0));
  float hxz = max(length(h.xz), 1e-4);
  float cy = h.z / hxz;
  float sy = h.x / hxz;
  float cx = cos(faceTilt());
  float sx = sin(faceTilt());
  /* Both are core.glsl's own rotation convention: world → local. */
  mat3 yaw = mat3(cy, 0.0, sy, 0.0, 1.0, 0.0, -sy, 0.0, cy);
  mat3 pitch = mat3(1.0, 0.0, 0.0, 0.0, cx, -sx, 0.0, sx, cx);
  return pitch * yaw;
}

/**
 * How far the dome pushes the surface down at this point in slab space.
 *
 * The parabola's apex is offset by `tilt / 2·bowX` so that the *zero-slope*
 * point — which is where the band lands — sits at the slab's origin rather than
 * wherever the descent happens to flatten it. Without that, adding descent
 * slides the band along the run, and the two numbers stop being independent.
 */
/** x², rolling off asymptotically onto `cap`. C^∞, and — the point — bounded. */
float softSquare(float x, float cap) {
  float s = x * x;
  return s / (1.0 + s / cap);
}

float dome(vec3 q, float bowX, float tilt, float bowZ) {
  float apex = tilt / (2.0 * bowX);
  return bowX * (softSquare(q.x - apex, X_BOW_CAP) - apex * apex) +
         tilt * clamp(q.x, -1.5, 1.5) +
         bowZ * softSquare(min(q.z, 0.0), Z_BOW_CAP);
}

/**
 * Where the edge crosses the frame, per crop, straight off §A4's table: mobile
 * "across the bottom 20% only", and near mid-width because the copy is
 * full-width there and there is no dead side to steer around; desktop "edge
 * across lower-left, refraction band at ~28% width"; wide the same band moved
 * further left so the extra width reads as room rather than as a wider subject
 * (§5.3).
 *
 * `platform.mjs` derives each crop's `keyPos` from this point. If these two
 * numbers move, those four move with them.
 */
vec3 anchorPoint() {
  vec2 f = uP[2] > 0.0 ? vec2(uP[2], uP[3]) : vec2(0.31, 0.27);
  return vec3(frameToWorld(f, 0.0), 0.0);
}

/** The slab, in its own space, with the dome already applied. */
float slab(vec3 q, float chamfer) {
  return sdRoundBox(
    q - vec3(0.5 * (RUN_NEAR - RUN_FAR), -0.5 * GLASS_T, -DEPTH),
    vec3(0.5 * (RUN_NEAR + RUN_FAR), 0.5 * GLASS_T, DEPTH),
    chamfer
  ) / LIPSCHITZ;
}

Hit mapScene(vec3 p) {
  vec3 anchor = anchorPoint();
  mat3 toSlab = glassFrame(anchor);

  vec3 s = toSlab * (p - anchor);
  vec3 q = s;
  q.y += dome(q, arc(), TILT, BOW_Z);

  float chamfer = CHAMFER * (uP[1] / 0.28);

  /*
   * The slab, positioned so its top-front edge — the polished chamfer — passes
   * through the anchor. The body runs back into the frame (−z) and the cut end
   * faces the lens, which is what "a macro view *across* the edge" is.
   */
  Hit hit = Hit(slab(q, chamfer), ID_GLASS);

  /*
   * §A4 materials: "Anodised matte black beneath." It carries the same dome, so
   * the glass rests on it along the whole run instead of sinking through it
   * where the bow is deepest. It is the only thing below the edge, and it is
   * there to be the dark the edge is legible against — not to be seen.
   */
  hit = closer(hit, Hit(sdPlaneY(q, -GLASS_T), ID_BASE));

  if (uP[0] > 0.5) {
    /*
     * Wide crop only: "a second, further glass edge enters at the far left, out
     * of focus, giving the wide frame layered depth."
     *
     * There is no depth of field in this renderer and §2.6 forbids faking one
     * with bokeh, so "out of focus" is built the way an out-of-focus specular
     * actually behaves rather than by blurring: the same edge, further back,
     * with a fillet three times as wide and a rougher polish, so its band is a
     * broad low smear instead of a hairline. It reads as *behind* because it is
     * softer and dimmer, which is the only cue this camera has.
     *
     * Two details keep it a second *edge* rather than a second object. It is
     * lifted barely above the main slab and arcs hard, so it sinks back under
     * that surface within a fifth of a unit — the frame sees a segment, not a
     * slab. And its apex is parked just off the left edge, so only the
     * descending flank is in frame: centred instead, the arc closes into a
     * floating lozenge, which is a form, and §A4 gives this plate no forms.
     */
    vec3 farAnchor = vec3(frameToWorld(vec2(-0.02, 0.50), -0.40), -0.40);
    vec3 f = s - toSlab * (farAnchor - anchor);
    f.y -= FAR_LIFT;
    f.y += dome(f, FAR_ARC, FAR_TILT, BOW_Z);
    hit = closer(hit, Hit(slab(f, chamfer * 3.0), ID_FAR));
  }

  return hit;
}

Material materialFor(int id, vec3 p, vec3 n) {
  if (id == ID_BASE) {
    /*
     * §2.4: "Fill: none. Black flags on the shadow side." This plane sits below
     * the plane of a key that is almost in the surface, so it is lit at true
     * grazing and reads as the floor of the falloff. `matAnodisedBlack`'s 0.045
     * albedo is briefed for a structural plane facing the light; here it would
     * come up *brighter* than the tinted glass above it and invert the read, so
     * it is taken down to a shadow-side value.
     */
    Material m = matAnodisedBlack();
    m.albedo = 0.010;
    m.rough = 0.62;
    return m;
  }

  Material m = matDarkGlass();

  /*
   * Face against chamfer, separated by how far the normal has turned off the
   * slab's own up axis — the same trick A1 uses, and for the same reason: it
   * splits two finishes on one SDF without a second primitive.
   *
   * The face keeps glass's own polish. The chamfer is opened up slightly,
   * because a 0.075 lobe on a 0.02 fillet is roughly one supersampled pixel
   * wide and would alias into a dotted line at the encode — and because §A4
   * asks for a *band* of separated light, which has width. This is the number
   * to move if the band reads as a wire.
   */
  vec3 ns = glassFrame(anchorPoint()) * n;
  float onFace = smoothstep(0.55, 0.95, ns.y);
  m.rough = mix(bandRough(), 0.055, onFace);
  /*
   * The face's reflectance is the whole of the upper frame's tone, and getting
   * it wrong in the dark direction is how this plate ships as an empty
   * rectangle. The specular there sits ~50° off the half-vector and contributes
   * nothing, so the only term left is the body value — and `matDarkGlass`'s
   * 0.030, held flat, renders the entire glass surface at the black point.
   *
   * What is actually missing is the room. A dark glass surface viewed at 64°
   * is not black; it is a weak *Fresnel* mirror of everything around it, and
   * that reflection is most of what a real macro of glass shows. There is no
   * environment in this renderer and §2.5 bans the mirror finish that would
   * need one, so the room is carried as a grazing-weighted lift on the body
   * value instead — Schlick's own falloff shape, applied to reflectance rather
   * than to a lobe. It rises where the surface turns away from the lens, which
   * is up-frame, which is where §A4 wants the gradient.
   *
   * The chamfer keeps the unlifted value: it has the specular, and lifting it
   * too would put a lit *band of surface* under the hairline, which is the one
   * thing §2.5 says a chamfer highlight must not become.
   */
  float grazing = 1.0 - abs(dot(n, normalize(uCamPos - p)));
  m.albedo = mix(0.030, 0.055, onFace) + 0.18 * onFace * grazing * grazing * grazing;

  if (id == ID_FAR) {
    /* The further edge, softened — see the note in `mapScene`. */
    m.rough = mix(0.26, 0.10, onFace);
    m.albedo *= 0.8;
  }

  return m;
}
