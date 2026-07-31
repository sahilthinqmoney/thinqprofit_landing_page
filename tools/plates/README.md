# Plate renderer

Produces every image and video asset the landing page consumes, from the briefs
in [docs/art-direction.md](../../docs/art-direction.md) §3.

There is no image-generation API in this repository and no photographer on this
project. What there is, is a brief specified to the pixel — frame sizes, dead-zone
rectangles, a luminance ceiling, a chroma floor and a black point. That is enough
to **render** rather than to commission, and rendering buys one thing a
generation model cannot: the constraints in §2.2, §2.3 and §2.7 are satisfied
*in the shader*, by construction, instead of being checked afterwards and hoped
for.

The material vocabulary is deliberately the same one the page already speaks —
`LiquidMetalSurface` is a WebGL shader too, so the plates and the primary action
are made of the same thing rather than merely matched to each other.

## Pipeline

```bash
node tools/plates/render.mjs              # every plate, every crop → PNG masters
node tools/plates/render.mjs hero         # one plate
node tools/plates/render.mjs hero:wide    # one crop
node tools/plates/render.mjs --stills     # skip the loop frames
node tools/plates/encode.mjs              # PNG → public/media/**.webp / .webm / .mp4
node tools/plates/qa.mjs                  # §5.3 + §5.4 gates against the shipped WebP
```

Masters land in `tools/plates/out/` and are build intermediates — reproducible
from the shaders, not sources. `encode.mjs --clean` removes them.

Requires `cwebp`, `ffmpeg` (with `libvpx-vp9` and `libx264`), and a local Google
Chrome. Playwright drives Chrome rather than its own bundled build because the
bundled headless shell falls back to SwiftShader for WebGL, which renders these
scenes correctly and about forty times slower.

## Files

| File | Owns |
|---|---|
| `scene/core.glsl` | camera, key light, materials, marching, **the grade** |
| `scene/plates/aN-*.glsl` | one plate's geometry and materials |
| `sections/<id>.mjs` | one plate's frame sizes, dead zones and per-crop composition |
| `spec.mjs` | the vocabulary those section files are written in |
| `render.mjs` / `encode.mjs` / `qa.mjs` | drive, encode, gate |

One plate per file in both directories, on purpose: six plates get art-directed
independently and often concurrently, and a single table is a file six people
have to take turns editing.

## The contract a plate implements

```glsl
Hit      mapScene(vec3 p);                          // signed distance + surface id
Material materialFor(int id, vec3 p, vec3 n);       // reflectance for that id
```

That is all. Everything else — where the camera is, how the key falls, how the
frame is graded — belongs to `core.glsl`, and a plate that reaches around it is
almost certainly about to fail a gate.

### Frame space

The camera is solved so **the plane `z = 0` is half a world unit tall in frame**.
`atFrame(vec2(0.6, 0.35))` names the point 60% across and 35% up — but returns a
coordinate **2× larger than that point actually sits at**. Multiply by 0.5 for a
true frame coordinate. Depth is plain `z`; negative is further from camera.

> This paragraph used to claim one full unit. It was wrong, and two plate authors
> lost a render cycle each proving it: `ndc.y` spans ±0.5, `focal` is
> `1/tan(fov/2)`, and `solveCamera` puts the camera at `0.5/tan(fov/2)`, so the
> half-height at `z = 0` works out to 0.25. The full derivation is in the comment
> on `atFrame` in `scene/core.glsl`.
>
> The factor is **not** fixed in place, deliberately: all seven shipped plates
> were built against the behaviour rather than this sentence, and all seven pass
> the §2.7 and §5.3 gates. Changing it rescales every plate at once, and a plate
> whose subject moves 2× is a plate whose dead zone no longer holds. Fixing it
> means one factor plus a re-tune of all seven against the gates, in one pass,
> on purpose.

This exists so §3's compositions can be written down rather than solved for:
*"nothing structural crosses x=60%"*, *"intersection at roughly 60% width, 65%
height"*, *"blocks across the right 44%, baseline at y≈62%"* are all coordinates.

### What `core.glsl` guarantees, so you do not have to

- **Monochrome output.** Shading resolves to one scalar written to all three
  channels, so every pixel is at OKLCH chroma 0.000 and §2.2 cannot be failed by
  a stray bounce. The 1% slack in that rule is for WebP subsampling, downstream.
- **The luminance ceiling.** The grade rolls off asymptotically onto sRGB 168
  (below `chrome` at OKLCH L .750), so a highlight can be arbitrarily hot in the
  scene and still land under §2.3's ceiling. Nothing clips.
- **The black point.** The frame bottoms out at `#050505` — the page's own ink,
  so the plate's edge dissolves into the page instead of sitting on it.
- **The dead zone.** `uDead` / `uDead2` attenuate *radiance* — before the grade,
  feathered over ≥12% of frame width — and then cap the region at sRGB 54. §2.7
  requires the dead zone to contain no *edges*, not merely no highlights, which
  is why this is not a post-hoc darkening of pixels.
- **The loop.** `loopSettle()` returns 0 at both ends of `uT` and holds at 1
  across the middle. Seamless (§4.2) and *settling* (§2.3 rule 3) — the primary
  action is the only thing on the page allowed to idle perpetually, so a plate
  behind it must come to rest.

### What you still have to get right

The gates are necessary, not sufficient. They cannot see composition:

- **The subject moves between crops, and moves where §2.7 says.** Four exports
  of one render is the failure §5.3 exists to catch, and `qa.mjs` only catches
  the blatant version by luminance signature.
- **No ascending dominant line.** §2.1. On a broker page the eye reads upward as
  a claim about returns. Lateral, orbital, radial or downward-settling only.
- **Grain runs across the frame, not up it** (§2.5) — an ascending line at
  texture scale is still an ascending line.
- **The tablet crop clears its top band *and* its named side.** At exactly 768px
  the tablet image is served while the copy is already parked to one side, so it
  is the most conservative crop of the four (§2.7's 768px edge case).
- **The second light event appears on exactly two plates** — Onboarding and
  Final CTA — and nowhere else (§2.3 rule 2).
- **Look at the render.** `qa.mjs` will pass a beautifully lit rectangle of
  nothing. §5.5's system read is still a human step.

### The key: directional or positional

By default the key is directional — a source at infinity, set with `key: [x, y, z]`
(the direction *toward* the light). Constant N·L, so a flat face lit this way is
one even tone.

Give it a position and it becomes a real lamp with inverse-square falloff:

```js
key: [0.72, 0.66, 0.22],   // still the fallback direction
keyPos: [1.62, 1.0, 0.55], // world position of the lamp
keyRange: 1.3,             // intensity is 1 at exactly this distance; 0 = directional
```

This is what makes §2.4's "gradient *across the surface* rather than a hotspot
in the middle of it" achievable at all. A directional light cannot produce a
gradient on a flat face — every point on it has the same normal and the same
light vector. Anything the briefs describe as *graduated* is falloff, and
falloff needs a position: §A1's "from `chrome` at the top of the curve to ink at
the bottom", §A5's "graduated scrim across it so its intensity drops as it
travels left".

### The rim

§2.4 permits **at most one hard accent per plate** — "a 1° grid spot or a light
through a narrow slot, used to draw a single chrome edge line where a form has
to separate from the background". Set it in the section file:

```js
rim: [-0.8, 0.2, -0.5],   // direction toward the light
rimSoft: 0.03,            // small source: hard edge
rimGain: 0.5,             // 0 (the default) is off
```

It contributes **specular only** and traces its own shadow. Specular-only
because a rim that lifts the diffuse is a fill by another name, and §2.4 is
explicit that there is no fill — "black flags on the shadow side, the falloff is
the depth". Its own shadow because a rim that ignores occlusion draws its line
straight through the form it is meant to be behind, which is the commonest way a
rendered edge stops reading as light.

One per plate. "Two rims and the object starts to look lit *for* the camera,
which is exactly the tell that separates product photography from a render."

### Materials

`matAluminiumBrushed(tangent)`, `matAluminiumBlasted()`, `matAnodisedBlack()`,
`matDarkGlass()`. Mirror-polished chrome is banned (§2.5) — it reflects the
studio and reads cheap. Note that `chrome` in the palette is a *value*, not a
finish: the brief wants brushed and bead-blasted surfaces carrying that value.

### Primitives

`sdBox`, `sdRoundBox`, `sdPlaneY`, `sdCylinderY`, `sdRingSlab`, `rotX/Y/Z`,
`closer`, `valueNoise`.

`sdRingSlab(p, major, halfSection, chamfer)` is a torus with a rounded-
rectangular section. Its `chamfer` is the most load-bearing number in the
system: it is the width of the specular hairline that §2.5 calls the most useful
mark in the whole vocabulary. Widen it and the highlight stops describing an
edge and starts lighting a face.

## What is deliberately not rendered here

- **The mobile app device screen.** §3 "not briefed here": fabricated interfaces
  are out (motion-brief §7 rule 5). Ship a screenshot of the real product or
  ship the dark screen.
- **Learn, Safety, Stats, Testimonials, Pricing, FAQ, Support.** They are
  `SectionShell` bands on flat ink. Adding plates there would give the page six
  consecutive full-bleed images, which is the monotony `MobileApp` exists to
  break.
