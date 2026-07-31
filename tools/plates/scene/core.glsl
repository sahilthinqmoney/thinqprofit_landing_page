#version 300 es
precision highp float;

/*
 * Shared render core for every plate in docs/art-direction.md §3.
 *
 * This file is the half of the renderer that is NOT art direction. It owns the
 * camera, the single key light, the material model, and — the part that matters
 * — the grade, which is written so that a plate cannot violate §2.2 (chroma),
 * §2.3 (luminance ceiling) or §2.7 (dead zone) even if the scene author asks it
 * to. Those rules are enforced here, in the last twelve lines of main(), rather
 * than checked afterwards in QA. QA still runs; it is a second opinion, not the
 * mechanism.
 *
 * Three constraints are structural rather than stylistic:
 *
 *  1. **Output is monochrome by construction.** Shading resolves to a single
 *     scalar and is written to all three channels. §2.2 wants ≥99% of pixels
 *     below OKLCH chroma 0.02; emitting r == g == b makes every pixel exactly
 *     0.000, so the gate cannot be failed by a stray bounce or a tone curve.
 *     The 1% slack in that rule is there for WebP subsampling, which happens
 *     after this file.
 *
 *  2. **The ceiling is asymptotic, not clipped.** `L_CEIL` maps the scene's
 *     unbounded radiance onto [0,1] with `1 - exp(-x)`, so a highlight can be
 *     arbitrarily hot in the scene and still land below `chrome`. Clamping
 *     instead would flatten every specular into a plateau at the ceiling —
 *     which is exactly the "blown highlight" §2.3 rejects, just held one level
 *     lower.
 *
 *  3. **The dead zone attenuates radiance, not pixels.** `deadZoneMask` is
 *     applied to the shaded value before the grade and feathered over ≥12% of
 *     frame width (§2.7's falloff rule). Darkening the final pixels instead
 *     would leave the *edges* inside the rectangle intact, and §2.7 is explicit
 *     that the dead zone must contain no edges, not merely no highlights.
 */

out vec4 fragColour;

uniform vec2 uResolution;
/** width / height. Plates need it to place a form at a frame percentage. */
uniform float uAspect;
/** 0..1 through one loop. Stills render at uT = 0. */
uniform float uT;
/** Camera. Long lens only — uFov is degrees, and nothing here goes above 40. */
uniform vec3 uCamPos;
uniform vec3 uCamTarget;
uniform float uFov;
uniform float uCamRoll;
/** Key light direction (toward the light) and its angular size, in radians. */
uniform vec3 uKeyDir;
uniform float uKeySoft;
uniform float uKeyGain;
/**
 * Positional key. `uKeyRange = 0` (the default) leaves the key directional —
 * a source at infinity, constant N·L across a flat face.
 *
 * Set a range and the key becomes a real lamp at `uKeyPos` with inverse-square
 * falloff normalised so intensity is 1 at exactly `uKeyRange`. This is what
 * makes §2.4's "single large soft source at a grazing angle, so an aluminium
 * face reads as a *gradient across the surface*" achievable at all: a
 * directional light cannot produce a gradient on a flat face, because every
 * point on it has the same normal and the same light vector. §A1 asks the hero
 * form to run "from `chrome` at the top of the curve to ink at the bottom", and
 * §A5 asks for "a graduated scrim across it so its intensity drops as it
 * travels left" — both are falloff, and falloff needs a position.
 */
uniform vec3 uKeyPos;
uniform float uKeyRange;
/**
 * The one permitted hard accent — §2.4's "1° grid spot or a light through a
 * narrow slot", used to draw a single chrome edge where a form has to separate
 * from the background. `uRimGain = 0` turns it off, which is the default.
 *
 * It contributes specular only. A rim that also lifts the diffuse is a fill by
 * another name, and §2.4 is explicit that there is no fill: "Black flags on the
 * shadow side. The falloff is the depth." One per plate — two and the object
 * starts to look lit *for* the camera, which is the tell that separates product
 * photography from a render.
 */
uniform vec3 uRimDir;
uniform float uRimSoft;
uniform float uRimGain;
/**
 * Dead zone rects in UV (x0, y0, x1, y1), origin bottom-left.
 *
 * Two of them, because §2.7's reserve is an L-shape on three of the six plates
 * and a rectangle cannot be one: `MediaCard` pins its title to a full-width top
 * band *and* its metal CTA to a bottom-left patch, and the tablet crops have to
 * clear the top band *and* their named side at the same time (the 768px edge
 * case). Set `uDead2` to a degenerate rect to use one.
 */
uniform vec4 uDead;
uniform vec4 uDead2;
uniform float uDeadFeather;
/** How far into the floor the dead zone pulls radiance. 0 = black, 1 = no-op. */
uniform float uDeadFloor;
uniform float uDeadFloor2;
/** Second light event (§2.3 rule 2): xy = uv centre, z = radius, w = gain. */
uniform vec4 uEvent;
uniform float uExposure;
/** Atmosphere in the falloff (§2.4). Never a visible beam. */
uniform float uHaze;
uniform float uGrain;
uniform float uSeed;
/** Plate-specific composition parameters, set per crop from config.mjs. */
uniform float uP[24];

#define PI 3.14159265359

/* ---------------------------------------------------------------- materials */

/*
 * Monochrome by construction (see header note 1), so reflectance is a scalar.
 * `aniso` and `tangent` exist because §2.5 asks for brushed aluminium
 * specifically, and brushed metal is defined by its anisotropy — an isotropic
 * GGX lobe on a "brushed" surface reads as bead-blasted no matter what the
 * prompt says.
 */
struct Material {
  float albedo;
  float rough;
  /** 0 = isotropic, 1 = fully stretched along `tangent`. */
  float aniso;
  vec3 tangent;
  float metal;
};

Material matAluminiumBrushed(vec3 tangent) {
  return Material(0.62, 0.30, 0.82, tangent, 1.0);
}

Material matAluminiumBlasted() {
  return Material(0.58, 0.44, 0.0, vec3(1.0, 0.0, 0.0), 1.0);
}

Material matAnodisedBlack() {
  return Material(0.045, 0.52, 0.0, vec3(1.0, 0.0, 0.0), 0.0);
}

Material matDarkGlass() {
  return Material(0.030, 0.075, 0.0, vec3(1.0, 0.0, 0.0), 0.0);
}

/* ------------------------------------------------------------------- fields */

struct Hit {
  float d;
  int id;
};

Hit closer(Hit a, Hit b) {
  /* Not a ternary: GLSL ES has no `?:` over struct types. */
  if (a.d < b.d) return a;
  return b;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
  return sdBox(p, b - r) - r;
}

float sdPlaneY(vec3 p, float y) {
  return p.y - y;
}

/**
 * A torus with a rounded-rectangular cross-section: the ring slab that A1's
 * curving form and A3's rings are both cut from. `chamfer` is the corner radius
 * of the section, and it is the single most load-bearing number in the whole
 * system — it is the width of the specular hairline that §2.5 calls "the most
 * useful mark". Too large and the highlight becomes a lit face.
 */
float sdRingSlab(vec3 p, float major, vec2 halfSection, float chamfer) {
  vec2 q = vec2(length(p.xz) - major, p.y);
  vec2 d = abs(q) - (halfSection - chamfer);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - chamfer;
}

float sdCylinderY(vec3 p, float r, float h) {
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

mat3 rotX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

mat3 rotY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

mat3 rotZ(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

/* -------------------------------------------------------------------- noise */

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float hash31(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

/* --------------------------------------------------------------- frame space */

/**
 * Frame fraction to world position on the z = 0 plane.
 *
 * The camera is solved so that plane is exactly one world unit tall, so
 * `atFrame(vec2(0.6, 0.35))` is the point 60% across and 35% up the frame —
 * which is how §3 states every composition it asks for ("intersection at
 * roughly 60% width, 65% height", "nothing structural crosses x=60%"). Depth is
 * plain z: negative is further away, and at these focal lengths a form at
 * z = −1 is meaningfully behind one at z = 0 without the frame position moving
 * much, which is the flat perspective §2.6 wants.
 */
/*
 * ⚠ KNOWN DISCREPANCY — read this before placing anything with `atFrame`.
 *
 * The comment above (and README's "Frame space") says the plane z = 0 is one
 * world unit tall in frame. **It is half a unit.** Two independent plate authors
 * lost a render cycle each to this, so it is written down here rather than
 * rediscovered a third time.
 *
 * The arithmetic:
 *
 *   ndc.y  spans ±0.5          — `(frag - 0.5 * uResolution) / uResolution.y`
 *   focal  = 1 / tan(fov/2)    — main(), below
 *   slope at the top edge      = 0.5 / focal = 0.5 · tan(fov/2)
 *   camera distance            = 0.5 / tan(fov/2)   — spec.mjs solveCamera
 *   half-height at z = 0       = slope · distance   = 0.25
 *
 * So z = 0 spans y ∈ [−0.25, +0.25], and this function — which maps into
 * [−0.5, +0.5] — overstates every frame coordinate by exactly 2×.
 *
 * **It is deliberately not fixed here.** All seven shipped plates were authored
 * against the behaviour rather than the comment, and every one of them currently
 * passes §2.7's dead-zone gates and §5.3's crop test. Correcting the factor in
 * this function (or in the ndc, or in `solveCamera`) silently rescales all seven
 * at once, and a plate whose subject moves 2× is a plate whose dead zone no
 * longer holds.
 *
 * If you are writing a new plate: `atFrame` is still the right way to express a
 * composition — it is monotonic, it carries the aspect correctly, and the §3
 * briefs are written in the frame percentages it takes. Just multiply its result
 * by 0.5 when you need a true frame coordinate, and say so in your shader the
 * way `a6-closing.glsl` and `a7-device.glsl` do.
 *
 * Fixing it properly means changing one factor and re-tuning all seven plates
 * against the gates in one pass. That is a real piece of work, not a one-line
 * change, and it should be done deliberately rather than as a side effect.
 */
vec2 atFrame(vec2 f) {
  return vec2((f.x - 0.5) * uAspect, f.y - 0.5);
}

/* --------------------------------------------------------------- loop shape */

/**
 * The only motion curve a plate may use.
 *
 * Returns 0 at `uT = 0` and at `uT = 1` — so the loop is seamless by
 * construction (§4.2) — and holds at 1 across the middle 44% of it. That hold
 * is the point, and it is §2.3 rule 3: the primary action idles perpetually and
 * is identified by doing so, therefore a plate behind it must *settle*. A
 * sinusoid would loop just as seamlessly and would never stop moving, which is
 * the one thing the plate is not allowed to do.
 */
float loopSettle() {
  return smoothstep(0.0, 0.28, uT) * (1.0 - smoothstep(0.72, 1.0, uT));
}

/* ------------------------------------------------------- scene (plate-owned) */

Hit mapScene(vec3 p);
Material materialFor(int id, vec3 p, vec3 n);

/* ---------------------------------------------------------------- marching  */

Hit march(vec3 ro, vec3 rd, float tMax) {
  float t = 0.06;
  Hit h = Hit(tMax, -1);
  for (int i = 0; i < 190; i++) {
    vec3 p = ro + rd * t;
    Hit s = mapScene(p);
    if (s.d < 0.0006 * t) {
      h = Hit(t, s.id);
      break;
    }
    t += s.d * 0.85;
    if (t > tMax) break;
  }
  return h;
}

vec3 normalAt(vec3 p) {
  /* Tetrahedral offsets — four samples rather than six, and no branch. */
  vec2 e = vec2(1.0, -1.0) * 0.0009;
  return normalize(
    e.xyy * mapScene(p + e.xyy).d + e.yyx * mapScene(p + e.yyx).d +
    e.yxy * mapScene(p + e.yxy).d + e.xxx * mapScene(p + e.xxx).d
  );
}

/**
 * Cone-traced shadow. `k` is tied to the key's angular size so the penumbra
 * matches the source that cast it — a hard shadow under a 4×6ft softbox is the
 * tell that separates a render from a photograph, and §1 asks for the
 * photograph.
 */
float softShadow(vec3 ro, vec3 rd, float k) {
  float res = 1.0;
  float t = 0.02;
  for (int i = 0; i < 48; i++) {
    float d = mapScene(ro + rd * t).d;
    if (d < 0.0007) return 0.0;
    res = min(res, k * d / t);
    t += clamp(d, 0.012, 0.34);
    if (t > 9.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

/** Cheap AO. Contact darkening is what gives the blacks their structure. */
float ambientOcclusion(vec3 p, vec3 n) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.012 + 0.11 * float(i);
    occ += (h - mapScene(p + n * h).d) * sca;
    sca *= 0.72;
  }
  return clamp(1.0 - 1.6 * occ, 0.0, 1.0);
}

/* ------------------------------------------------------------------ shading */

float distributionGGXAniso(vec3 n, vec3 h, vec3 t, vec3 b, float ax, float ay) {
  float nh = max(dot(n, h), 0.0);
  float th = dot(t, h);
  float bh = dot(b, h);
  float d = th * th / (ax * ax) + bh * bh / (ay * ay) + nh * nh;
  return 1.0 / (PI * ax * ay * d * d + 1e-7);
}

float geometrySmith(float nv, float nl, float rough) {
  float k = (rough + 1.0) * (rough + 1.0) / 8.0;
  float gv = nv / (nv * (1.0 - k) + k);
  float gl = nl / (nl * (1.0 - k) + k);
  return gv * gl;
}

float fresnelSchlick(float cosTheta, float f0) {
  return f0 + (1.0 - f0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

/**
 * The whole light rig: one key, no fill (§2.4). What stands in for the fill is
 * `uHaze` in main() — atmosphere in the falloff, not a second source.
 *
 * The brushing perturbation is applied here rather than in the material so that
 * every plate's grain runs on the same model, and so the direction rule from
 * §2.5 ("run it across the frame, not up it") is enforceable by passing a
 * tangent rather than by remembering to.
 */
/**
 * One light's specular contribution. Split out of `shade` so the key and the
 * rim run through identical maths — a rim built from a different, cheaper lobe
 * is the reason CG rim lights read as outlines rather than as light.
 */
float specularLobe(vec3 n, vec3 t, vec3 b, vec3 v, vec3 l, float rough, float aniso, float metal) {
  vec3 h = normalize(v + l);
  float nl = max(dot(n, l), 0.0);
  float nv = max(dot(n, v), 1e-4);
  float a = rough * rough;
  float ax = max(a * (1.0 + aniso * 2.4), 0.002);
  float ay = max(a / (1.0 + aniso * 2.4), 0.002);
  float d = distributionGGXAniso(n, h, t, b, ax, ay);
  float g = geometrySmith(nv, nl, rough);
  float f = fresnelSchlick(max(dot(h, v), 0.0), mix(0.04, 0.92, metal));
  return d * g * f / (4.0 * nv * nl + 1e-4) * nl;
}

float shade(vec3 p, vec3 n, vec3 rd, Material m) {
  vec3 v = -rd;

  vec3 l = normalize(uKeyDir);
  float falloff = 1.0;
  if (uKeyRange > 0.0) {
    vec3 toKey = uKeyPos - p;
    float dist = max(length(toKey), 1e-3);
    l = toKey / dist;
    falloff = (uKeyRange * uKeyRange) / (dist * dist);
  }
  vec3 h = normalize(v + l);

  /* Anisotropic brush grain: perturb the normal along the tangent only. */
  vec3 t = normalize(m.tangent - n * dot(n, m.tangent) + 1e-5);
  vec3 b = normalize(cross(n, t));
  if (m.aniso > 0.0) {
    float grain = valueNoise(vec3(dot(p, t) * 420.0, dot(p, b) * 5.0, 0.0)) - 0.5;
    n = normalize(n + b * grain * 0.020 * m.aniso);
    t = normalize(m.tangent - n * dot(n, m.tangent) + 1e-5);
    b = normalize(cross(n, t));
  }

  float nl = max(dot(n, l), 0.0);
  float nv = max(dot(n, v), 1e-4);

  float shadow = softShadow(p + n * 0.004, l, 6.5 / max(uKeySoft, 0.02));
  float ao = ambientOcclusion(p, n);

  /*
   * A soft source is an area, so its lobe is broader than a point light's. This
   * widens the roughness by the source's angular size rather than attenuating
   * the specular, which is the difference between a softbox and a dimmed
   * flashgun: the first spreads the highlight, the second only darkens it.
   */
  float rough = clamp(m.rough + uKeySoft * 0.30, 0.03, 1.0);
  float spec = specularLobe(n, t, b, v, l, rough, m.aniso, m.metal);

  /* Metal has no diffuse lobe; this is what makes the anodised black planes
     read as a different material rather than as darker aluminium. */
  float diffuse = m.albedo * (1.0 - m.metal) / PI;

  /*
   * KEY_INTENSITY is a working exposure, not a look. The grade in main() rolls
   * off asymptotically onto the ceiling, so a scene has to arrive at radiance
   * of order 1 for the highlights to land near `chrome` and the faces to sit in
   * the low tones. Per-crop `exposure` trims around this; changing it here
   * moves all six plates at once, which is only ever right if the whole set is
   * off.
   */
  const float KEY_INTENSITY = 3.2;

  /* `specularLobe` already carries its own N·L, so only the diffuse term takes
     one here. Applying it to both squares the falloff and quietly halves every
     lit face. */
  float lit = (diffuse * nl + spec) * shadow * ao * falloff * uKeyGain * KEY_INTENSITY;

  /*
   * The rim. Specular only, its own hard (small) source, and its own shadow
   * trace — a rim that ignores occlusion draws its line straight through the
   * form it is meant to be behind, which is the single most common way a
   * rendered edge stops reading as light.
   */
  if (uRimGain > 0.0) {
    vec3 rl = normalize(uRimDir);
    float rimRough = clamp(m.rough + uRimSoft * 0.30, 0.03, 1.0);
    float rimShadow = softShadow(p + n * 0.004, rl, 6.5 / max(uRimSoft, 0.02));
    lit += specularLobe(n, t, b, v, rl, rimRough, m.aniso, m.metal) * rimShadow * ao *
           uRimGain * KEY_INTENSITY;
  }

  return lit;
}

/* -------------------------------------------------------------------- grade */

/*
 * The ceiling. Neutral grey at OKLCH L .750 is `chrome` #a9aeb8 (§2.2), and a
 * neutral's Oklab lightness is the cube root of its linear luminance — so
 * L .750 is Y .4219. This sits at Y .3915 (sRGB 168), a deliberate two-level
 * margin below it, because the WebP encode and the 1–2% grain both happen after
 * this shader and either can push a pixel up by one.
 */
const float SRGB_CEIL = 168.0 / 255.0;
/* §2.2/§5.4: the black point is #050505, not #000000. A plate that bottoms out
 * below the page ink reads as a hole punched in the page. */
const float SRGB_FLOOR = 5.0 / 255.0;
/* §2.7's dead-zone ceiling is #38383c (54 after the neutral hex's blue lift is
 * dropped — the lift is cosmetic on a threshold and this render is neutral by
 * construction). Two levels of margin, for the same reason as SRGB_CEIL. */
const float SRGB_DEAD_CEIL = 54.0 / 255.0;

float linearToSrgb(float c) {
  c = clamp(c, 0.0, 1.0);
  return c <= 0.0031308 ? c * 12.92 : 1.055 * pow(c, 1.0 / 2.4) - 0.055;
}

/**
 * §2.7's dead zone, as a radiance multiplier.
 *
 * Returns 1 outside the rectangle and `uDeadFloor` inside it, with a feather of
 * at least 12% of frame width on every side. The feather is a smoothstep on the
 * *outside* of the rectangle, so the full attenuation is reached at the stated
 * boundary rather than somewhere inside it — a dead zone that only reaches its
 * floor at its own centre is not a dead zone.
 */
/** How far inside the rect this pixel is, 0 outside to 1 fully inside. */
float rectInside(vec2 uv, vec4 r) {
  if (r.z <= r.x || r.w <= r.y) return 0.0;

  float fx = max(uDeadFeather, 0.12);
  float fy = fx * uResolution.x / uResolution.y;

  float mx = min(
    smoothstep(r.x - fx, r.x, uv.x),
    1.0 - smoothstep(r.z, r.z + fx, uv.x)
  );
  float my = min(
    smoothstep(r.y - fy, r.y, uv.y),
    1.0 - smoothstep(r.w, r.w + fy, uv.y)
  );
  return mx * my;
}

/** x = radiance multiplier, y = how deep in a reserve we are (for the ceiling). */
vec2 deadZone(vec2 uv) {
  float i1 = rectInside(uv, uDead);
  float i2 = rectInside(uv, uDead2);
  /* Darkest wins. Two overlapping reserves must not brighten each other. */
  float attenuation = min(mix(1.0, uDeadFloor, i1), mix(1.0, uDeadFloor2, i2));
  return vec2(attenuation, max(i1, i2));
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uResolution;
  vec2 ndc = (frag - 0.5 * uResolution) / uResolution.y;

  /* Camera. Long lens by construction: uFov is clamped so no plate can reach
     for a wide angle and the converging verticals §2.6 rules out. */
  vec3 fwd = normalize(uCamTarget - uCamPos);
  vec3 worldUp = vec3(sin(uCamRoll), cos(uCamRoll), 0.0);
  vec3 right = normalize(cross(fwd, worldUp));
  vec3 up = cross(right, fwd);
  float focal = 1.0 / tan(radians(clamp(uFov, 6.0, 40.0)) * 0.5);
  vec3 rd = normalize(ndc.x * right + ndc.y * up + focal * fwd);

  Hit hit = march(uCamPos, rd, 46.0);

  float radiance = 0.0;
  if (hit.id >= 0) {
    vec3 p = uCamPos + rd * hit.d;
    vec3 n = normalAt(p);
    radiance = shade(p, n, rd, materialFor(hit.id, p, n));
  }

  /*
   * §2.4 volumetrics: "the very slight lift in the air near the key that makes
   * the black read as a room instead of as absence". Keyed off the angle
   * between the view ray and the key, never off a position — a position gives
   * it an edge, and an edge is a visible beam.
   */
  float towardKey = max(dot(rd, normalize(uKeyDir)), 0.0);
  radiance += uHaze * pow(towardKey, 5.0) * 0.06;

  /*
   * §2.3 rule 2's second light event. Two plates get one; every other plate
   * passes uEvent.w = 0 and this term vanishes. It is a bounce, so it is added
   * in screen space as a soft falloff rather than lit into the scene — a light
   * that travelled, not a source.
   */
  if (uEvent.w > 0.0) {
    vec2 d = (uv - uEvent.xy) * vec2(uResolution.x / uResolution.y, 1.0);
    radiance += uEvent.w * exp(-dot(d, d) / max(uEvent.z * uEvent.z, 1e-5));
  }

  radiance *= uExposure;

  vec2 dz = deadZone(uv);
  radiance *= dz.x;

  /* Asymptotic rolloff onto the ceiling — see header note 2. */
  float lin = 1.0 - exp(-max(radiance, 0.0));
  float s = linearToSrgb(lin);

  /* Map onto [floor, ceiling] rather than [0,1]: the black point is the page's
     ink and the white point is `chrome`, and both are rules, not preferences. */
  s = SRGB_FLOOR + s * (SRGB_CEIL - SRGB_FLOOR);

  /*
   * §4.1: 1–2% monochrome grain at export. It is here rather than in post
   * because it has to be inside the clamp — grain added after the ceiling can
   * push a pixel over it, which is a §5.4 reject for a cosmetic reason.
   */
  float grain = (hash21(frag + uSeed * 37.0) - 0.5) * uGrain;
  s += grain;

  /*
   * The dead zone gets its own ceiling, interpolated with the same feather that
   * attenuated the radiance — so it is a limit rather than a second terminator.
   * `uDeadFloor` alone would hold the rectangle dark on average; §2.7 is about
   * the *worst* pixel under a 16px disclosure, and a backstop is cheaper than
   * discovering the one specular that survived attenuation in QA.
   */
  float ceilHere = mix(SRGB_CEIL, SRGB_DEAD_CEIL, dz.y);
  s = clamp(s, SRGB_FLOOR, ceilHere);

  /* Monochrome, written to all three channels — header note 1. */
  fragColour = vec4(vec3(s), 1.0);
}
