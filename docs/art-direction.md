# ThinqProfit — Art direction for photographic and rendered assets

Generation briefs for every plate the page consumes. Written to be handed to a
photographer, a retoucher, or a generation model and run once, correctly, without a
conversation.

**The six plates now ship, and they are rendered rather than photographed.** There is still
no image-generation API in this repo and no shoot booked, but this document is specified to
the pixel — frame sizes, dead-zone rectangles, a luminance ceiling, a chroma floor, a black
point — which is enough to *render*. `tools/plates/` does that: WebGL scenes built from the
materials in §2.5, driven by the per-crop compositions in §3, encoded to §4's targets, and
gated against §5.3 and §5.4 by `tools/plates/qa.mjs`.

That choice buys one thing a commissioned asset cannot give: **the constraints in §2.2, §2.3
and §2.7 are satisfied in the shader instead of being checked afterwards and hoped for.**
Output is monochrome because shading resolves to one scalar written to all three channels,
so chroma is 0.000 by construction. Nothing reaches `chrome`'s luminance because the grade
rolls off asymptotically onto it. The dead zone attenuates radiance *before* the grade and
over a ≥12% feather, so it contains no edges rather than merely no highlights. A returned
photograph would have to be measured for all three and re-shot when it failed.

What it does not buy is composition, and the gates cannot see it. §5.1's read of the real
headline over the real plate, §5.2's banned-content scan and §5.5's system read are still
human steps, and `tools/plates/page-shot.mjs` exists to set up the first of them rather than
to answer it.

If a real shoot ever happens, nothing here changes: the briefs are the brief, the QA is the
QA, and the renders are what ships until something better arrives.

**What this document is authoritative for:** the visual world, the palette, the composition
and dead zone of each asset, and the alt text that ships with it.

**What it defers to:**

- [DESIGN.md](../DESIGN.md) — the page's colour, type and media mechanics.
- [docs/motion-brief.md §6](motion-brief.md) — encoding targets. Reproduced in §4 below;
  §6 is the source, this is the copy.
- [docs/motion-brief.md §7](motion-brief.md) — seven non-negotiable rules. Every brief here
  complies. They are restated in §2 because a generation operator will read this file and
  not that one.

**What it supersedes.** motion-brief §3 and §5 were written against an earlier design
system — ink-navy `#0F172A`, indigo→cyan light, "premium AI product film". That palette is
gone, and so is the gold-and-platinum system that replaced it. DESIGN.md §2 is now a
**chromatic** system: neutral ink `#050505` and a single near-white polished alloy,
`accent` `#e7e9ee`, which is the brightest surface on the page and the only one that moves.
The display face is Archivo, a signage grotesk. The *rules* in motion-brief §7 and the
*encoding* in §6 survive intact; the colour direction in §3 and §5 does not. Where they
disagree, this file wins.

The consequence for imagery is larger than a swapped hex, and §2.2 and §2.3 are where it
lands: **there is no longer any permitted colour in a plate at all**, and the scarce
resource the briefs have to ration is no longer hue but *luminance*, because the artwork's
metal and the brand's metal are now the same neutral alloy.

Shipped strings still carrying old direction — the `alt` values in §3 below are their
replacements:

| File | String | Status |
|---|---|---|
| `src/data/onboarding.ts` | `mediaAlt` | **Stale.** Correct in substance, wrong world — "ink-navy void", "indigo fading to cyan". Replace with A5's alt text |
| `src/data/hero.ts` | `mediaAlt` | **Replaced** with A1's alt text. It said the edge caught *warm* light — residue from the gold palette, against a §2.4 key now fixed at 5600K |
| `src/data/platform.ts` | `platformMediaAlt` | Current and neutral. **Replaced** with A4's alt text when the plate was wired in |
| `src/components/sections/Products.tsx` | `MEDIA_BRIEF` | Current — machined aluminium, no colour |
| `src/components/sections/FinalCta.tsx` | `closingClip` | Current — "cool near-white specular", neutral monochrome |

---

## 1. The world

Large abstract metallic forms in a dark, empty room. Machined aluminium — turned, brushed,
bead-blasted — sitting against matte black structures that absorb rather than reflect. The
light is soft and volumetric and comes from one place; everything else in frame is falling
away from it. Where there is glass it is thick and dark, and the interest is in what
refraction does to an edge, not in what is behind it. Objects float or rest with
architectural weight — a plate, a ring, a slab, a monolith — at a scale that reads as
built rather than modelled. Depth is constructed entirely with light: a form emerges
because one plane catches a grazing key and the plane beside it does not, never because it
is a different colour from its neighbour. Nothing in frame is decorative, and nothing is
explained.

The reference register is Apple product photography — long lens, flat perspective, a
single large source, deep falloff, obsessive edge control — not fintech stock imagery. If
a plate could plausibly appear in a camera-module close-up on an iPhone page, it is on
brand. If it could plausibly appear in a bank's quarterly report, it is not.

**The metal in the artwork and the metal in the interface are now the same material.** That
is new, and it cuts both ways. It is why this world is the right one — the page's primary
action is a polished near-white alloy, so a photograph of machined aluminium is the brand
photographed rather than a mood set beside it. It is also why the discipline in §2.3 is
stricter than the one it replaces: when the button and the specular are made of the same
value, a bright edge in the wrong place is not a colour clash, it is a second button.

**One-paragraph version, for pasting into a prompt:**

> Macro industrial photography of a large abstract machined-aluminium form in a matte
> black room. Single soft volumetric key light raking across the surface at a shallow
> angle; no fill; long falloff to true black within the frame. Brushed and bead-blasted
> metal, dark reflective glass, matte black structural planes. Neutral monochrome — steel
> greys on neutral near-black, no colour cast, no warm light. Shallow depth of field, long lens, flat
> perspective, no wide-angle distortion. Depth built from light and shadow only. Calm,
> precise, expensive, empty. Studio, not environment.

---

## 2. Global constraints

### 2.1 Banned in every brief, without exception

State this in the prompt. Do not soften it, do not make it a "prefer to avoid", and do not
approve an asset that violates it because the rest of the frame is good.

- **Stock photos of people at desks.** Traders, advisors, laptops, headsets, open-plan
  offices, handshakes.
- **Crypto coins.** Any coin, token, ingot, bullion or minted disc.
- **Candlestick or chart wallpaper.** Candles, OHLC bars, line charts, depth ladders,
  order books, heatmaps, sparklines — blurred, abstracted or decorative counts as present.
- **City skylines.** Also trading floors, glass towers, bull statues, ticker facades.
- **Glowing wireframe grids.** Also network-node meshes, particle constellations, HUD
  overlays, "data" filaments, radar sweeps.
- **Fabricated app UI.** Any rendered screen, panel, window, dashboard, toolbar or
  control. Device screens stay dark and empty; real UI is composited later from the real
  product (motion-brief §7 rule 5).
- **Any number, ticker, price, percentage, currency symbol or P&L.** Including partial,
  out of focus, or on a reflected surface. A rendered price is a fabricated market claim,
  not a texture (motion-brief §7 rule 1).
- **Colour of any kind.** The brand has no hue left in it: DESIGN.md §2 reserves hue
  entirely for meaning, so `gain`, `loss` and `warning` are the only chromatic values on
  the page and every one of them says something a photograph has no business saying. Green
  and red remain the hard rejects (motion-brief §7 rule 2), but this now holds for *all*
  hues, in the light, the reflections, the grade and the compression artefacts, not just the
  subject. Measurable form in §2.2.
- **Warm metal.** Gold, brass, bronze, copper, amber, champagne, rose. This is the
  system that was just removed, and a warm bounce on an aluminium face is the fastest way
  to bring it back. A tungsten key does it too, without ever naming a colour — see §2.4.
- **People celebrating with money.** Cash, champagne, cars, watches, fist pumps, keys,
  luxury interiors (motion-brief §7 rule 4).
- **Upward motion or upward-leading composition.** No ascending diagonal as the dominant
  line, no form that rises out of frame, no light travelling upward, no launch or ascent
  reading. On a broker page the eye reads upward as a claim about returns (motion-brief §7
  rule 3). Composition energy is lateral, orbital, radial or downward-settling.
- **Brains, neurons or circuit boards as AI shorthand.** Also synapses, glowing chips,
  robot hands, humanoid faces made of polygons.

Two further rules from motion-brief §7 apply and are easy to lose in a still image:

- **Rule 6 — people, if shown, are composed, never celebrating.** These briefs contain no
  people at all. Do not add one.
- **Rule 7 — every asset must survive text on top.** This is what §2.4 and the QA in §5
  exist to enforce.

Negative prompt to append to every generation call:

```
text, letters, numbers, digits, tickers, stock symbols, currency symbols,
candlestick charts, line graphs, bar charts, percentages, price quotes,
trading screens, dashboards, UI panels, HUD, holograms, wireframe grids,
network meshes, particle constellations, circuit boards, brains, neurons,
robots, arrows, upward arrows, rockets, coins, gold bars, cash, money,
jewellery, watches, cars, bulls, bears, skylines, city, buildings, office,
desk, laptop, people, hands, faces, crowd, celebration, green, red, emerald,
crimson, teal glow, cyan glow, magenta, rainbow, neon, lens flare, light
streaks, bokeh balls, watermark, logo, signature, caption, low resolution,
oversharpened, HDR halo, plastic render, chrome sphere, 3D blob,
gold, golden, brass, bronze, copper, amber, champagne, rose gold, warm light,
tungsten, candlelight, sunset light, colour grade, split tone, teal and orange,
blown highlights, white hot specular
```

The last three lines are the chromatic system's additions. The warm-metal terms are there
because gold was the previous brand and a generation model reaching for "premium metal"
reaches for it by default. `blown highlights` and `white hot specular` are there for §2.3:
a clipped highlight is the one thing in a plate that can out-brighten the button.

### 2.2 Palette

The page is `--color-bg: #050505` — neutral near-black, verified in `src/index.css`. Plates
are graded to bottom out at `#050505` so the frame edge dissolves into the page rather
than sitting on it as a rectangle.

The ground is three levels darker than the system this supersedes (`#08080a`) and it is no
longer warm. The warmth existed to keep gold from reading muddy against it; under a neutral
alloy it tints the metal yellow. Every threshold in this file that was computed against
`#08080a` has been recomputed — see §2.7.

OKLCH coordinates are given so a colour rule can be machine-checked rather than argued
about. All values are computed from the sRGB hex, not read off a picker.

| Role | Token | Value | OKLCH | Where it may appear in a plate |
|---|---|---|---|---|
| Ink | `bg` | `#050505` | L .115 / C .000 / h — | The room. Black point of every plate. |
| Surface | `surface` – `surface-raised` | `#0d0d10` – `#16161a` | L .160–.202 / C .006–.008 / h 286° | Matte black structure, shadow-side planes |
| Panel edge | `border` | `#2b2b31` | L .292 / C .011 / h 286° | The dead zone's 3% tail threshold — no more than 3% of it may be this bright (§2.7) |
| **Alloy** | `accent` | `#e7e9ee` | L .934 / C .007 / h 269° | **Never.** This is the button. See §2.3 |
| Alloy, quiet | `accent-soft` | `#c3c8d2` | L .832 / C .015 / h 264° | **Never.** Still inside the action's luminance band |
| Chrome | `chrome` | `#a9aeb8` | L .750 / C .015 / h 264° | Specular edges, the machined highlight. **This is the brightest value a plate may reach.** |
| Chrome dim | `chrome-dim` | `#757b85` | L .581 / C .017 / h 261° | Mid-tone metal, diffuse aluminium face |
| Gain / loss | `gain` / `loss` | `#4ade80` / `#f87171` | C .182 / h 152° · C .166 / h 22° | **Never.** |
| Warning | `warning` | `#f97316` | L .705 / C .187 / h 48° | **Never.** |

Two things changed shape here, not just value.

**The bright end moved down, and the plate's ceiling moved with it.** In the gold system
the brightest value in the palette was platinum at L .844 and the *button* was gold at
L .767 — the button was darker than the plate's specular and got away with it, because hue
told them apart. There is no hue now. `accent` is L .934, above everything, and a plate
that puts a near-white specular on an aluminium chamfer is painting with the button's own
value. So the specular is briefed to `chrome`, L .750, and the L .750 → .934 gap between a
machined edge and an action is a brand rule that lives in the imagery as much as in the CSS.

**The chroma tolerance is no longer a budget, it is a floor.** There is nothing coloured
left in the brand, so a plate needs no permitted chromatic note of any kind:

- **≥99% of pixels below OKLCH chroma `0.02`** — visually monochrome. The 1% is slack for
  WebP chroma-subsampling artefacts at a hard specular edge, nothing else. The old 5%
  allowance existed to hold the gold note and is withdrawn with it.
- **No pixel at or above chroma `0.04`, at any hue.** Hue no longer needs to be consulted
  to reject a pixel; chroma alone does it. This is simpler *and* stricter than the old
  banded rule, which had to leave 60°–120° open for gold.
- **Meaning-bearing hues get a tighter threshold: chroma ≥ `0.025` with hue in
  120°–190° (green) or 345°–60° (red through warning orange) is an outright reject**, not a
  tolerance discussion. On this page green means `gain` and red means `loss`.
- The red/orange band now runs to **60°** rather than 45°. `warning` sits at h 48° and the
  old band deliberately stopped short of it because 48° was too close to gold at 91° to
  separate cleanly. With gold gone there is no reason to leave the gap open, and closing it
  catches every warm-metal grade in one test.
- **No colour cast and no split-tone.** No teal shadows, no warm/cool split, no "cinematic"
  orange-and-blue grade. The greys are held neutral by the neutral black point, not by a
  counter-tint.

### 2.3 Luminance discipline

This section replaces the gold discipline, and it is the one the whole rewrite turns on.

The old rule rationed **hue**: gold appeared in two plates out of six, ≤3% of frame,
because every plate carried a gold button and a warm note in the plate would stop the
button being the only warm thing on screen.

The button is not warm any more. It is *bright* — the brightest surface on the page, and
the only one that moves (DESIGN.md §2). A monochrome world cannot ration hue, because it
has none. What it has to ration is exactly what now identifies the action:

**Rule 1 — nothing in a plate reaches the accent's luminance.**

- **No pixel above OKLCH L `.750`** (`chrome`, `#a9aeb8`). That is the plate's specular
  ceiling, and it holds a 0.18 L gap to `accent` at L .934.
- **No clipped highlight anywhere in frame.** A blown specular is L 1.0; it out-brightens
  the button by definition. Expose for the chamfer, not for the room.
- **≤3% of frame above OKLCH L `.600`** (`#808080`, 5.16:1 on the ground). The 3% is
  inherited deliberately from the old gold cap — same number, different axis. Hue was the
  scarce resource; brightness is now.
- This applies to all six plates, where the gold rule applied to two. The discipline got
  broader as well as stricter, because a specular is present in every plate and gold was
  not.

**Rule 2 — the bright note still lands exactly twice.**

The gold bounce was doing compositional work beyond colour: it gave a long scroll two
moments of punctuation. That structure survives, transposed from hue to light. In a
monochrome world a "note" can only be made of light, so:

- **Exactly two plates carry a second light event** — a secondary highlight beyond the
  single permitted rim (§2.4). They are the same two: **Onboarding** and **Final CTA**.
- Same envelope as the gold note had: **≤3% of frame area**, never within 25% of the frame
  width of where the primary button lands, never inside the dead zone.
- It is a **bounce, not a source** — a reflected falloff on a metal face, neutral, capped
  at OKLCH L `.600` rather than the specular's `.750`, so it reads as light that has
  travelled rather than as a second key.
- The other four plates get one key and at most one rim. No exceptions, no "just a hint".

**Rule 3 — nothing in a plate moves like the button.** Mostly moot for six stills, but it
binds if any plate ships as motion (§4.2): the primary action idles perpetually and speeds
up under the pointer. A travelling highlight in the plate behind it competes for the same
read. If a plate moves, its brightest travelling mark stays below L `.600` and settles
inside the loop — it never idles.

**Why this is not just "keep it dark".** The plate is allowed to be lit, dramatic and
expensive. What it is not allowed to do is produce the specific value that means *press
this*. `chrome` reads as machined and premium at L .750; the difference between that and
L .934 is the entire distance between an edge and an action in this system, and it is the
one distinction a photograph can casually destroy.

### 2.4 Lighting

One key. Everything else is subtraction.

- **Key:** a single large soft source — 4×6ft softbox or equivalent — placed at a grazing
  angle, 70°–85° off the lens axis, so an aluminium face reads as a *gradient across the
  surface* rather than a hotspot in the middle of it. Height slightly above the form,
  angled down. **5600K, no gel, and the white balance set to it.** This is now a colour
  rule and not a technical note: a 3200K key or a warm-balanced grade reintroduces the gold
  system through the lighting without anyone naming a colour, and it will pass a casual
  look because tungsten on aluminium is a photograph everyone has seen.
- **Fill:** none. Black flags on the shadow side. The falloff is the depth; a fill light
  flattens the plate into a grey card and the copy then has nowhere dark to sit.
- **Rim:** at most one hard accent — a 1° grid spot or a light through a narrow slot —
  used to draw a single chrome edge line where a form has to separate from the
  background, capped at OKLCH L `.750` (§2.3). One rim per plate; the two plates in §2.3
  rule 2 get a second, dimmer light event and no more. Two rims and the object starts to
  look lit *for* the camera, which is exactly the tell that separates product photography
  from a render.
- **Falloff:** the room must reach `#050505` inside the frame, not at its edge. If the
  background is still grey at the border the plate will read as a lit box against the
  page.
- **Volumetrics:** permitted and wanted, but as *atmosphere in the falloff*, not as a
  visible beam. A shaft of light with defined edges is a stage effect. What is wanted is
  the very slight lift in the air near the key that makes the black read as a room instead
  of as absence.
- **Direction of energy:** the dominant line runs lateral or settles downward. No
  ascending diagonal (§2.1).

### 2.5 Materials

Named, so the prompt has something to hold onto:

- **Machined aluminium** — 6061 with a visible tool path, turned face, or a linear brushed
  grain. The grain direction is a compositional decision; run it across the frame, not up
  it.
- **Bead-blasted aluminium** — matte, diffuse, holds a soft gradient beautifully. The
  default surface for large faces.
- **Anodised matte black** — structural planes, mounts, the objects that define the room.
  Reads as near-ink; carries a very faint edge highlight and nothing else.
- **Dark reflective glass** — thick, tinted near-black, used on edge so the refraction
  bends a highlight rather than showing a reflection of the studio.
- **Machined chamfer** — the 45° cut where two faces meet. This is where the specular
  lives, and it is the single most useful mark in the whole system: a bright hair line that
  describes a form's geometry without lighting its face. Held at `chrome` L `.750`, never
  brighter (§2.3).

Banned materials: **mirror-polished chrome** (it reflects the studio and reads cheap — note
that this is a finish, not the `chrome` token, which is a *value*: the brief wants brushed
and bead-blasted surfaces carrying that value, never a mirror), polished gold or any warm
metal, carbon fibre, marble, concrete, water, smoke machines, holographic film.

### 2.6 Camera and lens character

- **Long lens, flat perspective.** 85–135mm equivalent on full frame. Nothing wider than
  50mm. A wide lens on a large form produces converging verticals and drama; this system
  wants the parallel, product-catalogue read.
- **Aperture f/5.6–f/11**, focus-stacked where the form is deep. Shallow depth of field is
  used *once per plate* to separate a foreground edge — not as a general softness.
- **Macro where specified.** 1:2 to 1:1 magnification for the Platform plate; the rest are
  medium-close product distance.
- **No lens artefacts.** No flare, no streaks, no anamorphic squeeze, no vignette added in
  post. A vignette does the scrim's job badly and doubles up with it.
- **Grain:** fine, monochrome, ~1–2% — enough to keep the large flat blacks from banding
  in an 8-bit WebP. The page already lays `.grain` over the document at ~4%, so the plate
  grain is there for encoding, not for texture.
- **No motion blur.** All six are stills.

### 2.7 The negative-space rule

**Every plate must reserve a dark, low-contrast region where the copy sits.** This is not
a preference and it is not something the scrim fixes — the scrim is headroom, not the fix.
`MediaSection` renders a radial scrim at `-1` whose density falls to zero well before the
frame edge, and the section copy is live text in normal flow above it. A specular highlight
crossing the headline is a legibility failure the scrim cannot recover.

**The measurable spec, applied to the dead-zone rectangle before any scrim:**

- **No pixel above `#38383c`** (relative luminance `0.0400`). That holds the `#ffffff`
  headline at **11.7:1** and `fg-muted` `#cfcfcf` body copy at **7.5:1** against the worst
  pixel either can land on.
- **No more than 3% of dead-zone pixels above `#2b2b31`** — the `border` token — which is
  **14.1:1** against white and **9.0:1** against `fg-muted`.
- **No luminance step greater than 20 sRGB levels across any 8-pixel span** inside the dead
  zone. Mean darkness is not enough — a machined chamfer running through a headline breaks
  legibility even when the average is near black. **The dead zone must contain no edges,
  not merely no highlights.**
- **Falloff into the dead zone is gradual:** the boundary between the lit region and the
  dead zone spans at least 12% of frame width. A hard terminator at the dead-zone border
  reads as a matte line.

#### Where these thresholds come from — the arithmetic

Both thresholds were previously computed against ground `#08080a` and headline `#f7f6f3`.
The ground is now `#050505` and the headline is `#ffffff`, so both were recomputed. The
arithmetic, in full, because it will need doing again the next time the ground moves.

*Luminance is WCAG relative luminance: linearise each channel with `c ≤ 0.04045 ? c/12.92 :
((c+0.055)/1.055)^2.4`, then `Y = 0.2126R + 0.7152G + 0.0722B`. Contrast is
`(Y₁+0.05)/(Y₂+0.05)`. `L*` is CIE lightness, `903.3·Y` below `Y = 0.008856` and
`116·∛Y − 16` above it — used here because it is perceptually uniform and an sRGB level
step is not.*

**1. What the old ceiling actually encoded.** `#3a3a3e` → `Y = 0.042735`, `L* = 24.56`. The
old ground `#08080a` → `Y = 0.002472`, `L* = 2.23`. So the ceiling sat **ΔL\* = 22.32**
above the page ink. That step — not the hex, and not the 10.5:1 figure — is the real spec:
it is how much brighter than the page a dead zone may get before the plate stops dissolving
into the page and starts reading as a lit rectangle laid on it.

**2. Re-anchor that step to the new ground.** `#050505` → `Y = 0.001518`, `L* = 1.371`
(below the 0.008856 knee, so `L* = 903.3 × 0.001518`). Holding the same perceptual step:

```
target L*  = 1.371 + 22.32          = 23.69
target Y   = ((23.69 + 16) / 116)³  = 0.04006
grey level = 1.055 · Y^(1/2.4) − 0.055, ×255 = 56.3 → 56 = 0x38
```

Carrying forward the +4-level blue lift the old ceiling used — the same cool cast the
`border` tokens still carry, at +6 — gives **`#38383c`** → `Y = 0.039953`, `L* = 23.66`,
**ΔL\* = 22.29** against the new ground. Within 0.03 L\* of the old relationship. The lift is
cosmetic on a threshold, but it keeps a sampled dead zone hue-consistent with the panel
edges it sits next to, which matters when the check is "is this pixel above `border`".

**3. Check it against the text that actually sits there.**

```
#ffffff  Y = 1.000000   → (1.000000 + 0.05) / (0.039953 + 0.05) = 11.67 : 1
#cfcfcf  Y = 0.623960   → (0.623960 + 0.05) / (0.039953 + 0.05) =  7.49 : 1
```

The binding case is **not** the headline. White gained headroom when it went from `#f7f6f3`
(Y 0.921568) to `#ffffff`, and large display type only needs 3:1 anyway. The constraint is
the 16px `fg-muted` body and disclosure copy that shares every dead zone, and 7.5:1 clears
the 4.5:1 floor with 66% of margin. Onboarding's `finePrint` is `text-white/75`, which
composites in sRGB over the ceiling — `0.75 × 255 + 0.25 × 56 = 205` → `#cdcdce` — for
**7.35:1**, materially the same number, so the one place the page sets an alpha text colour
over a plate does not need a threshold of its own.

Note how much slack that leaves: 4.5:1 against `#cfcfcf` would permit a max pixel of
`Y = 0.0998`, sRGB grey **89** (`#595959`). The ceiling is grey 56 at `Y = 0.0400` — **40%
of the luminance the contrast floor would allow**. That is intentional — the dead-zone ceiling is set by *how a plate meets the
page*, not by the contrast floor, and it is why the ceiling got slightly darker even though
the headline got brighter.

**4. The 3% tail threshold is the `border` token, as before.** The old `#2a2a30` was
exactly the old `border`; the new one is `#2b2b31`, one level up. `Y = 0.024631`,
`L* = 17.75`:

```
#ffffff → (1.000000 + 0.05) / (0.024631 + 0.05) = 14.07 : 1   (was 13.2 : 1)
#cfcfcf → (0.623960 + 0.05) / (0.024631 + 0.05) =  9.03 : 1
```

Keeping this pinned to `border` rather than to a free-floating hex is the point: the rule
reads *"no more than 3% of the dead zone may be as bright as a panel edge"*, which stays
true through any future token change.

**5. The 8-pixel edge rule stays at 20 sRGB levels.** It was checked, not assumed. The dead
zone's usable range is ground → ceiling: **51 levels** now (5 → 56), against **50** before
(8 → 58), so a 20-level cap is the same fraction of the available range. In `L*` a 20-level
step measures 7.4 at the bottom of the range (5 → 25) and 9.3 at the top (36 → 56) — close
enough to uniform that one number covers the whole rectangle, which is what makes the rule
checkable with a plain edge detector.

**6. Black point.** Plates are graded to reach `#050505` inside the frame (was `#08080a`).
Reject threshold moves with the tokens: if the darkest pixel is above **`surface`
`#0d0d10`** (was `surface` `#141417`), the plate will read as a grey rectangle on the page.

**Which region, per section.** Derived from each section's `place` prop in
`src/components/sections/`, and from the fact that `MediaSection`'s `PLACE` and `ANCHOR`
maps are both `md:`-prefixed — so **below 768px the copy is full-width and top-anchored**,
not parked to a side and not vertically centred. This is the single most-missed fact in
the crop set.

| Section | `place` | `scrimAt` | Desktop / wide dead zone | Mobile dead zone |
|---|---|---|---|---|
| Hero | (Container `md:mr-[46%]`) | `30% 46%` | **Left.** x 0–56%, y 12–80% | Near-total; copy is centred *and* full width |
| Products — Stocks & ETFs | `MediaCard` | linear, top ⅔ | **Top band** + bottom-left CTA patch | Top 46% + bottom-left patch |
| Products — Futures & Options | `MediaCard` | linear, top ⅔ | **Top band** + bottom-left CTA patch | Top 46% + bottom-left patch |
| Platform | `right` | `68% 50%` | **Right.** x 44–100%, y 14–86% | Top 80% |
| Terminal | `left` | `26% 50%` | **Left.** x 0–56%, y 12–80% | Top 85% |
| Terminal · gate | `right` | `74% 50%` | **Right.** x 44–100%, y 14–86% | Top 85% |
| Terminal · scale | `left` | `26% 50%` | **Left.** x 0–56%, y 12–80% | Top 85% |
| Terminal · bore | `right` | `74% 50%` | **Right.** x 44–100%, y 14–86% | Top 85% |
| Onboarding | `left` | `26% 50%` | **Left.** x 0–56%, y 10–90% | Top 85% |
| Final CTA | `center` | `50% 50%` | **Centre.** x 26–74%, y 16–84% | Top 70% |

**The 768px edge case.** `MediaBackdrop` selects the tablet crop with
`media="(max-width: 768px)"` while Tailwind's `md:` engages at `min-width: 768px`. At
exactly 768px both are true: the tablet image is served *and* the copy is already parked to
its side. Every tablet crop must therefore satisfy **both** rules — top band clear *and*
its named side clear. In practice this makes the tablet crop the most conservative of the
four, which is correct: it is the one that has to work either way.

---

## 3. Per-section briefs

Six plates. Ordered by scroll position.

Filenames follow `public/media/<section>/<section>-<breakpoint>.webp`. The four crops slot
into `MediaBackdrop`'s `ImageSources` as:

```ts
image={{
  mobile:  '/media/hero/hero-mobile.webp',   // ≤425
  tablet:  '/media/hero/hero-tablet.webp',   // ≤768
  desktop: '/media/hero/hero-desktop.webp',  // 769–1279
  wide:    '/media/hero/hero-wide.webp',     // ≥1280
}}
```

**The four crops are four photographs, not four exports.** Reframing the same file to four
aspect ratios defeats the entire mechanism — the dead zone moves between breakpoints, and
a crop cannot move a highlight that is already inside it. Shoot or generate each one.

---

### A1 — Hero

`src/components/sections/Hero.tsx` · headline **"Your money. / Your market. / One app."**

The hero currently runs `HeroCanvas`, a ~6 KB procedural field. This plate is the swap-in
described in that file's header comment. Brief it now so the decision to swap is a
comparison, not a commission.

**Intent.** The page's first statement, and the only one that has to work before the
reader has been told anything. It says *precision instrument, quietly lit* — the visual
argument for DESIGN.md §1's claim that a broker is infrastructure. It must not say
excitement, opportunity or growth.

**Composition.** A single large bead-blasted aluminium form entering from the right edge
and curving out of the frame — read as a section of something much larger, cropped, not as
an object placed in the middle of a room. Its leading chamfer runs a `chrome` hairline from
upper-right down toward frame centre, then dies. The left of the frame is empty room. No
horizon, no floor line, no visible set. The form's mass sits in the right 40%; nothing
structural crosses x=60%.

**Dead zone.** **Left.** x 0–56%, y 12–80% on desktop and wide. This is the largest reserve
on the page: the H1 is `clamp(3rem, 7vw, 5.75rem)` at a 10em measure — up to ~900px of type
across three lines — with subheadline, two buttons and a support line beneath it.

**Lighting.** Key from camera-right at 80°, high, raking down the form's face so the
gradient runs from `chrome` (L .750, no higher — this is the hero, and it is the plate most
tempted to over-light) at the top of the curve to ink at the bottom. One 1°
grid spot picking the chamfer. Left half of the room in total falloff. Note that Hero.tsx
also lays a `to-bg` gradient over the bottom 160px — do not build a highlight there, it
will be muddied.

**Materials.** Bead-blasted aluminium face, anodised matte black on the shadow side, one
machined chamfer. No glass.

**Camera.** 105mm, f/8, focus-stacked from the near chamfer to the far curve. The form is
sharp throughout; the falloff is doing the depth work, not the aperture.

**Crops.**

| Breakpoint | Frame | What changes |
|---|---|---|
| `mobile` ≤425 | 900×1600 (9:16) | Copy is centred *and* full width here — there is no dead side. Reduce to almost nothing: an ink field with a single soft neutral gradient in the bottom-right corner, peaking below `#2b2b31`, and a barely-there lift at the very top edge. This crop is deliberately the quietest of the four. |
| `tablet` ≤768 | 1200×1600 (3:4) | Must clear both the top band and the left side. Form pushed hard right and down; only its upper-left curve is in frame, occupying the right 30% below y=55%. |
| `desktop` 769–1279 | 1920×1280 (3:2) | The reference composition above. Form in the right 40%, chamfer running down-left, empty left. |
| `wide` ≥1280 | 2560×1440 (16:9) | Same form, pulled back — more room, form now occupies the right 32%, and a second matte black plane enters from the bottom-right corner to give the wider frame something to hold. Do not simply letterbox the desktop crop; the extra width must be *composed* room, not stretched emptiness. |

**Alt text to ship** (replaces `hero.mediaAlt` and `heroMediaLabel` in `src/data/hero.ts`):

> `A large brushed aluminium form curving out of darkness, lit along one edge by a single soft light.`

---

### A2 — Products, featured card: Stocks & ETFs

`src/components/sections/Products.tsx` · `MediaCard` · title **"Stocks & ETFs"**

**Intent.** Breadth held in one hand. Many discrete things, identical in kind, ordered — a
catalogue, not a crowd. This is the visual for "every NSE and BSE listing, plus index ETFs,
held in your own demat account."

**Composition.** Twelve to sixteen thin machined aluminium plates, each 2–3mm, suspended
parallel in dark space at slightly varying depths and rotations — a card index seen at an
angle. Each plate catches the key on its chamfered edge only; the faces stay in shadow. The
stack recedes toward the lower right. The top 40% of the card is empty room above the
stack.

**Dead zone.** **Top band, full width** — `MediaCard` pins the title (display,
`clamp(2rem,2.8vw,2.75rem)`) and body to the top with `p-8 / sm:p-10 / lg:p-12`. Reserve
the top 34% on desktop, top 46% on mobile where the title wraps to two lines in a 335px
card. **Plus a bottom-left patch** for the metal `Explore stocks` button: 34% × 14% of the
card, anchored to the bottom-left corner. That button is a live shader at L .934 — the
brightest, and the only moving, thing in the card — so the patch is held to the §2.7
ceiling like any other dead zone, not merely kept free of the subject.

**Lighting.** Key from camera-left at 75°, narrow — a strip box, so each plate edge picks
up a discrete highlight and the intervals between them read as rhythm. No rim. The room
above the stack falls to ink within the top quarter of the frame.

**Materials.** Machined aluminium plates with a linear brush grain running left-to-right
across the frame (never up). Matte black void.

**Camera.** 85mm, f/5.6. Focus falls on the third and fourth plates; the nearest and
furthest go soft. This is the plate where shallow depth of field is the point — it is what
makes "many" read as depth rather than as pattern.

**Crops.** `MediaCard` is `h-[560px]` on mobile at 86vw, `h-[640px]` at `sm`, `h-[760px]`
at `xl` where it is roughly 820px wide. Aspect swings from 0.6:1 to 1.08:1.

| Breakpoint | Frame | What changes |
|---|---|---|
| `mobile` ≤425 | 800×1340 (3:5) | Portrait. Stack compressed to 8 plates, occupying only the bottom 45% and reading as a vertical recession. Top 46% empty. |
| `tablet` ≤768 | 1100×1300 | Near-square. 12 plates, stack centred low. Top 40% empty. |
| `desktop` 769–1279 | 1500×1400 | 14 plates spread laterally, stack anchored bottom-centre-right, bottom-left corner deliberately dark for the CTA. |
| `wide` ≥1280 | 1700×1580 (≈1.08:1) | 16 plates, wider spread, a second shallower stack entering from the right edge to fill the extra width. Bottom-left stays clear. |

**Alt text to ship** (replaces `MEDIA_BRIEF['stocks-etfs']`):

> `Thin machined aluminium plates suspended in darkness, each catching a narrow band of light along its edge.`

---

### A3 — Products, featured card: Futures & Options

`src/components/sections/Products.tsx` · `MediaCard` · title **"Futures & Options"**

**Intent.** Two systems interacting — the structural idea behind a two-leg position,
without a payoff diagram anywhere near it. Precision under load. This card carries a
legally required derivatives disclosure below it, so the image has to read as *serious*,
not as *dynamic*.

**Composition.** Two machined aluminium rings on offset axes, one passing through the
other, held in dark space. Where they intersect, the near ring's chamfer catches a hard
highlight and the far ring's face goes to ink behind it. Both rings are cropped by the
frame — the composition is a detail of a larger mechanism. The intersection sits at roughly
60% width, 65% height. Top 40% is empty.

Critically: the rings are **static and level**. No implied rotation, no motion arc, no
ascending axis. A ring tilted so its high point leads out of the top-right corner reads as
upward motion (§2.1).

**Dead zone.** Identical to A2 — top 34% desktop / 46% mobile, plus the bottom-left 34% ×
14% for the metal `Explore F&O` button.

**Lighting.** Key from camera-right at 85°, very grazing, so the rings are described almost
entirely by their chamfers and the faces stay dark. One hard rim from behind-left picking
the far ring's outer edge, which is what makes the pass-through legible. Falloff complete
above the rings.

**Materials.** Turned aluminium with a visible concentric tool path on the ring faces —
the one place in the system where a machined texture is allowed to be legible, because it
is what tells the eye these are made objects. Matte black mounts, not in frame.

**Camera.** 135mm, f/8, focus on the intersection. Compression is deliberate: the long lens
flattens the two rings toward each other, which is the reading — interlocked, not
receding.

**Crops.**

| Breakpoint | Frame | What changes |
|---|---|---|
| `mobile` ≤425 | 800×1340 (3:5) | Portrait. Crop tight to the intersection only — the rings exit all four edges. Reads as macro detail. Bottom 45% of frame. |
| `tablet` ≤768 | 1100×1300 | Both rings partly visible, intersection low-centre. |
| `desktop` 769–1279 | 1500×1400 | Reference composition. Both rings substantially in frame, intersection at 60/65. |
| `wide` ≥1280 | 1700×1580 | Pulled back; a third of the far ring's arc now sweeps into the right edge, giving the wide frame a lateral line. Still no ascending diagonal. |

**Alt text to ship** (replaces `MEDIA_BRIEF['futures-options']`):

> `Two machined rings on offset axes intersecting in darkness, a hard highlight tracing where they cross.`

---

### A4 — Platform

`src/components/sections/Platform.tsx` · `place="right"` · `scrim={0.86}` · `scrimAt="68% 50%"`
headline **"Built for the / ten seconds / that matter"**

Like the Hero, this section currently runs a procedural canvas — `SignalCanvas` with
`deadZone={{ side: 'right', extent: 0.54, feather: 0.18 }}` — rather than `MediaBackdrop`,
and its header comment transcribes the `MediaSection` props above rather than passing them.
This plate is the swap-in. Note that the canvas already reserves the right 54% with an 18%
feather; the photographic plate must reserve at least as much.

**Intent.** Instrumentation, without rendering an instrument. The section's copy is a
ten-item capability list — charts, option chain, screeners, alerts — and motion-brief §5.2
already ruled the literal answer out: *"Suggests instrumentation without rendering a single
UI element."* The image is about optical precision: what a dark, thick, well-made surface
does to light.

**Composition.** Extreme macro across the edge of a slab of dark tinted glass laid on
anodised black. The glass edge runs laterally across the lower-left of the frame, and the
key refracts through its chamfer into a narrow band of separated light — not a rainbow, a
*luminance* separation, near-neutral, the way a real dark glass edge behaves. Focus sits on
about 15% of that edge; the rest of the run falls off in both directions. The right half of
the frame is glass surface reflecting nothing but a soft dark gradient.

This is the one plate in the set that can produce genuine chroma by accident: dispersion
through a chamfer is spectral by nature. §2.2's chroma `0.04` reject applies to it exactly
as written, and a returned frame with a visible spectral fringe is rejected however
beautiful the edge is. The same constraint governs the button sitting on top of it — the
shader's own dispersion is held at 0.08 for the same reason, because a red fringe on a
primary action is `loss` on a buy button.

**Dead zone.** **Right.** x 44–100%, y 14–86%. The copy stack here is the heaviest on the
page after Onboarding — headline in three lines at the `tall` step, subheading, a metal
button, and a ten-item two-column list — and it runs from the rail's 46% mark to its 92%
mark. Keep the entire right half featureless: a smooth gradient, no edge, no reflection, no
refraction.

**Lighting.** A single hard source from camera-left, low and almost in the plane of the
glass, so it enters the chamfer rather than reflecting off the face. This is the one plate
where the key is hard rather than soft, because refraction needs a small source. Everything
right of the glass edge is lit by falloff only.

**Materials.** Dark tinted glass, 12–20mm, with a polished chamfer. Anodised matte black
beneath.

**Camera.** 100mm macro at 1:2, f/5.6, rack sitting mid-edge. Do **not** stack focus here —
the shallow plane is the subject. The out-of-focus regions must stay genuinely smooth: no
bokeh discs, no specular balls.

**Crops.**

| Breakpoint | Frame | What changes |
|---|---|---|
| `mobile` ≤425 | 900×1600 (9:16) | Copy is top-anchored and full width. Glass edge runs across the **bottom 20%** only; everything above is smooth dark gradient. |
| `tablet` ≤768 | 1200×1600 (3:4) | Must clear the top band *and* the right side. Edge sits in the bottom-left quadrant, refraction pointed down-left, right half and top two-thirds empty. |
| `desktop` 769–1279 | 1920×1280 (3:2) | Reference composition. Edge across lower-left, refraction band at ~28% width, right half smooth. |
| `wide` ≥1280 | 2560×1440 (16:9) | The extra width goes to the left: a second, further glass edge enters at the far left, out of focus, giving the wide frame layered depth. The right 56% stays as smooth as the desktop crop — do not use the extra room to add interest on the copy side. |

**Alt text to ship** (replaces `platformMediaAlt` in `src/data/platform.ts`):

> `A macro view across the edge of dark glass, one narrow band in sharp focus and the rest falling away.`

---

### A5 — Onboarding

`src/components/sections/Onboarding.tsx` · `place="left"` · `scrim={0.88}` · `scrimAt="26% 50%"`
headline **"Open an account / before your chai / gets cold"**

**Intent.** A sequence that completes. Three steps, each settling before the next begins —
deliberate, unhurried, finite. Not speed; *certainty*. This section carries an activation
SLA in its fine print, so the image must not imply instantaneity it cannot back.

**Composition.** Three matte black machined blocks resting in a row on a dark surface,
receding to the right, each lit slightly more than the one before. The lighting gradient
across the three *is* the sequence — first block barely emerging, third fully described by
its chamfers. They sit at a common baseline; the recession is lateral, into the right of
the frame, never upward. A soft ground shadow anchors each one. The left 56% is empty
room and empty floor.

This is one of the two plates permitted a **second light event** (§2.3 rule 2): a neutral
reflected falloff on the third block's shadow-side face, ≤3% of frame, capped at OKLCH
L `.600`, placed at roughly x=82% — well clear of the metal `Start account opening` button,
which lands at around x=12% on desktop. It replaces the gold bounce that used to sit here
and does the same compositional job: it is the reason the third block reads as *arrived*
rather than merely as the brightest of three. Neutral, dimmer than the chamfer specular, and
unmistakably a bounce rather than a source.

**Dead zone.** **Left.** x 0–56%, y 10–90%. The tallest copy stack on the page: three-line
headline at the `tall` step, subheading, a large button, a three-column numbered step row
with body text under each, a requirements line, and `finePrint` carrying the SLA. It very
nearly fills the section's vertical.

**Lighting.** Key from camera-right at 70°, soft, with a graduated scrim across it so its
intensity drops as it travels left — this is what produces the three-step lighting
gradient in-camera rather than in the grade. Single grid spot on the third block's leading
chamfer. Full falloff by x=45%.

**Materials.** Anodised matte black blocks with machined aluminium chamfers. The surface
they rest on is the same anodised black, so the objects and the ground are one material and
only the light separates them.

**Camera.** 85mm, f/11, focus-stacked — all three blocks sharp. This is deliberately the
opposite choice from A2: there, depth of field made "many" read as depth; here, everything
in focus makes the sequence read as complete.

**Crops.**

| Breakpoint | Frame | What changes |
|---|---|---|
| `mobile` ≤425 | 900×1600 (9:16) | Copy is top-anchored and this section's mobile stack is long enough to grow past the viewport. Blocks sit in the **bottom 15%**, cropped by the bottom edge, reading as a row continuing off-frame. Everything above is ink. |
| `tablet` ≤768 | 1200×1600 (3:4) | Clears top band and left side. Blocks in the bottom-right quadrant, only two fully in frame. |
| `desktop` 769–1279 | 1920×1280 (3:2) | Reference composition. Three blocks across the right 44%, baseline at y≈62%. |
| `wide` ≥1280 | 2560×1440 (16:9) | Three blocks held at the same size, spread with more air between them, and the receding floor plane given more room to fall off toward the right edge. The left 56% gains room, not content. |

**Alt text to ship** (replaces `onboardingCopy.mediaAlt` in `src/data/onboarding.ts`):

> `Three matte black blocks resting in a row on a dark surface, each lit a little more than the one before.`

---

### A6 — Final CTA

`src/components/sections/FinalCta.tsx` · `place="center"` · `scrim={0.75}` · `scrimAt="50% 50%"`
headline **"Start with what / you have today"**

**Intent.** The close. One object, at rest, complete. The page's last image should feel
like arriving rather than departing — which is why nothing in it moves, rises or points.

**Composition.** A single matte black monolith standing in an empty dark room, centred but
not symmetrical: it stands at roughly x=50% and the light comes from one side, so its two
visible faces are lit unequally. Its top is cropped by the frame. Two machined aluminium
chamfers run down its leading vertical edge, catching `chrome`. The floor is implied by a
shadow, not drawn by a line. The centre of the frame — the object's own body — is the
darkest region in the image.

That inversion is the whole trick of this plate: the subject occupies the dead zone, and it
is legible only by its edges. The copy sits **on** the monolith's unlit face.

**Dead zone.** **Centre.** x 26–74%, y 16–84% — a centred column ~600px wide holding a
two-line headline, subheading, support line, two buttons and the market-risk disclosure.
The monolith's face inside that rectangle must hold below `#2b2b31` throughout, and its two
chamfer highlights must fall **outside** x 26–74%. If a chamfer crosses the copy column,
the plate is rejected — this is the plate where §2.7's no-edges rule does the most work.

It is also the plate carrying the page's last primary action, and two centred buttons sit
inside that column. A chamfer at L .750 landing anywhere near a button at L .934 reads as a
pair of bright marks rather than as one action, which is the failure §2.3 rule 1 exists to
prevent — here it is a composition requirement, not just a pixel threshold.

**Lighting.** Key from camera-left at 85°, soft and large. It describes the monolith's left
chamfer and the wall falloff behind it, and leaves the face facing camera almost entirely
unlit. One weak rim from camera-right catching the right chamfer at lower intensity than
the left — asymmetry is what stops it reading as a symmetrical logo lockup.

The second permitted **light event** (§2.3 rule 2) goes here: a neutral bounce in the
lower-right falloff, where the light dies into the floor, at ≤3% of frame and capped at
OKLCH L `.600`. It sits at roughly x=85%, y=88% — far from both the centred copy column and
the two centred buttons. Its job is to keep the room from ending at the frame edge; on the
page's final image, a floor that simply stops reads as the plate running out rather than as
the scroll arriving.

**Materials.** Anodised matte black monolith, aluminium chamfers, anodised floor.

**Camera.** 135mm, f/11, focus-stacked. Perfectly level — no tilt, no low angle. A low
angle on a monolith is heroic, and heroic is a returns claim in a different costume.

**Crops.**

| Breakpoint | Frame | What changes |
|---|---|---|
| `mobile` ≤425 | 900×1600 (9:16) | Copy is top-anchored, ~70% of the frame. Monolith reduced to its base and the floor shadow, in the **bottom 25%**; the chamfer highlights are the only bright marks and they sit at the very bottom edge. |
| `tablet` ≤768 | 1200×1600 (3:4) | Clears top band and centre. Monolith pushed to the lower third, chamfers at x≈20% and x≈80%. |
| `desktop` 769–1279 | 1920×1280 (3:2) | Reference composition. Monolith centred, chamfers at x≈34% and x≈66% — outside the 26–74% column at its narrowest, so verify with the real headline (see §5). |
| `wide` ≥1280 | 2560×1440 (16:9) | Monolith held at the same height but the room opens laterally: the falloff on both sides is given real distance, and the chamfers move to x≈30% / x≈70%. The wide frame is where this composition is strongest — do not crowd it. |

**Alt text to ship** (replaces `closingClip` in `src/components/sections/FinalCta.tsx`):

> `A single matte black monolith standing in an empty dark room, its edges caught by a low light.`

---

### A8 — Terminal

`src/components/sections/Terminal.tsx` · `place="left"` · `scrim={0.86}` · `scrimAt="26% 50%"`
headline **"The terminal acts, / and labels it"**

Numbered A8 rather than A7: `a7-device.glsl` already exists.

**Intent.** A tool acting on a surface. The section's claim is that the copilot has
its hands on the terminal rather than talking beside it, and that every number it
shows says where it came from — so the image has to say *control* and *made
thing*, with no interface anywhere near it. It must not say speed: two of the four
capabilities are restraints, and a plate that reads as motion argues against them.

**Composition.** A bead-blasted aluminium surface filling the entire frame — no
silhouette, no edge of it in shot, no room around it. One machined channel is cut
laterally across it, capped at its left end and running out through the right-hand
frame edge; a matte black cylindrical tool is seated in the cut, its crown flush
with the face, its near cap in frame and its far end leaving with the channel. The
left of the frame is the same surface, unlit.

**The slab having no silhouette is the composition, not a shortcut.** Two earlier
passes gave it finite width and both failed on it: first as a hard vertical
terminator splitting the frame at its left edge, then — once that was pushed
off-frame — as its *right* edge walking back into shot on the 16:9 crop. Neither
is visible to any gate in §5.3 or §5.4. §1 asks for depth built entirely from
light, and a form with no edge in frame is the only version of this subject that
cannot produce one by accident at a breakpoint nobody screenshotted.

**One cut, never a field.** §5.2 rejects a repeating rhythm that resolves into
bars at thumbnail size, and a grooved face is exactly how a machined plate becomes
a bar chart. The count is structural — there is no parameter in `a8-terminal.glsl`
that could add a second channel.

**The cut is a hairline, not a track.** At `channelHalfHeight` 0.018 the slot
rendered ~48px tall on a 1440px viewport and read as a slider — fabricated UI
arriving through geometry rather than through pixels. It is now 0.0095, which
reads as a machined score. Anything that makes the cut tall enough to look
*filled* has reintroduced the failure.

**Dead zone.** **Left.** x 0–56%, y 12–80% on desktop and wide. The copy stack is
the heaviest on the page after the hero: a two-line headline at the `mid` step, a
two-line deck, four two-line claims, a button and a disclosure.

The reserve is held by the **light**, not by the mask. An early pass ran
`deadFloor` at 0.06 — a 94% attenuation — and the rectangle printed its own shape
into the frame, which is §2.7's "hard terminator reads as a matte line" arriving
from the enforcement side. The lamp is now placed so its inverse-square falloff
has already reached ink by the reserve boundary, and the floor sits at 0.32–0.34
doing almost nothing. The channel's left cap is placed just outside the boundary
so the feather extinguishes the cut rather than the geometry ending it.

**Lighting.** One key, positional — a lamp with `keyPos`/`keyRange`, not a
direction. The subject is a single flat face and a source at infinity puts one
even tone on it, so the gradient §2.4 asks for is falloff and falloff needs a
position. **No rim** (§2.4 permits one; this plate does not need it — there is no
silhouette to separate) and **no second light event**: §2.3 rule 2 gives that to
Onboarding and Final CTA and to nothing else.

**Materials.** Bead-blasted aluminium face, one machined fillet on the channel
lip, anodised matte black tool. No glass. The grain is left isotropic rather than
brushed: a brushed grain would have to run across the frame (§2.5 forbids up), and
a lateral texture running parallel to a lateral cut is the two-line rhythm §5.2
rejects, arriving through texture instead of geometry.

**Camera.** 20–26° depending on crop — 85mm to 135mm equivalent, inside §2.6's
band. Straight-on, flat perspective, no tilt.

**Crops.**

| Breakpoint | Frame | What changes |
|---|---|---|
| `mobile` ≤425 | 900×1600 (9:16) | Copy is top-anchored and full width; the reserve is the top 85%. The only lit thing is a shallow band along the bottom with the cut running out of it. The lamp is the closest in the set and the only one below the frame's midline. Quietest of the four. |
| `tablet` ≤768 | 1200×1600 (3:4) | The most conservative crop: at exactly 768px the tablet image is served while the copy is already parked left, so it clears the top band **and** the left column. Both reserves are declared and the subject sits in the bottom-right quadrant, dark in both before either is applied. |
| `desktop` 769–1279 | 1920×1280 (3:2) | Reference composition. Cut at y≈29%, capped at x≈66%, tool seated from x≈75%. Light rakes from upper right. |
| `wide` ≥1280 | 2560×1440 (16:9) | Not the desktop crop with more room: the cut moves to the **upper** third and the lamp drops **below** the midline, so the frame's energy inverts. The extra width is room, not content. An earlier version kept desktop's arrangement and §5.3 caught it — signatures correlated at 0.949, "a scale, not a crop". |

**Alt text to ship** (in `src/data/terminal.ts` as `terminalPlateAlt`):

> `A machined aluminium slab cut by a single deep channel, one dark tool resting in it.`

---

### A9, A10, A11 — the other three Terminal claims

`src/components/sections/Terminal.tsx` renders four full-bleed sections, one claim each.
A8 backs the first; these three back the rest.

**The governing rule for the set is that each carries a different form language.** A
first pass gave all four the same one — "a lateral cut in a flat surface, lit from one
side" — and the page would have shown one photograph four times. §5.5's system read
catches that by eye and §5.3's signature test does not, because four *different*
subjects shot the same way still correlate. So the languages are assigned, and they are
not interchangeable:

| Plate | Section | Form language |
|---|---|---|
| A8 `terminal` | The copilot has hands | **Wide.** A whole surface, one long lateral cut, a tool resting in it |
| A9 `gate` | Every sentence is gated | **Tight mechanism.** Light comes *through* a gap between forms |
| A10 `scale` | Order flow, labelled | **Extreme macro.** One small stamped detail, large in frame, shallow focus |
| A11 `bore` | Options live on the chart | **Radial.** Concentric stepped depth, cropped hard |

Everything in §1, §2 and §4 applies to all three unchanged: one key placed as a lamp,
no rim unless the form needs separating, **no second light event** (§2.3 rule 2 belongs
to Onboarding and Final CTA), monochrome by construction, `chrome` ceiling, `#050505`
black point, and the reserve held by the lamp's falloff rather than by `deadFloor`.

---

**A9 — gate.** Two heavy machined jaws face each other across a narrow slot, with a
blade crossing it part way, at rest. The key sits *behind* the slot: the only bright
marks are the line of light escaping where the blade has not closed, and what that
light rakes across the jaw faces. Reserve right, subject left.

The failure to watch for is a soft round highlight floating on an open plane — §2.4
asks for "a gradient across the surface rather than a hotspot in the middle of it", and
the first attempt at this plate came back as a lit wall corner with a glowing blob.
**Every bright mark must be described by geometry**: if the jaws could be deleted and
the frame still looked the same, the plate is wrong. *This is the weakest of the four as
shipped — it passes every gate, but its highlights are softer than the brief asks and it
is the first one to re-render if the set is revisited.*

> alt: `Two machined jaws with a narrow slot between them, one blade held part way across it.`

---

**A10 — scale.** A punched index mark in aluminium at 1:1 — the datum a machinist
stamps to say *this is the one I measured from* — with the burr of displaced metal
raised around its rim catching the key, and the shallow score it references running out
of focus behind it. Reserve left, subject right.

This is the one plate in the set where shallow depth of field is the subject rather
than a softness (§2.6 permits it once per plate). **Scale is what separates it from A8:**
A8 is a wide shot of a surface, this is one small feature magnified until its machining
*is* the image. A wide version of this plate is A8 with a smaller cut, which is exactly
what the first attempt produced.

No graduations, no ticks, no ruler edge — one mark and one score. An evenly spaced
repeated form resolves into bars at 25% zoom (§5.2), and on a page about order flow that
reading is the one thing this plate must not offer.

Note the mobile crop: the score originally sat at frame y 0.152, on the top-85%
reserve's own boundary, which is where a 54-level step across 8px came from. A feature
placed *on* a reserve edge is an edge inside the reserve — §2.7's rule is about the
worst pixel, and the boundary is where it will be.

> alt: `A long shallow score across machined aluminium, with a single punched index mark beside it.`

---

**A11 — bore.** A counterbore sunk into machined aluminium: three concentric machined
steps descending, each catching a chamfer hairline on the key side and going to ink on
the other, so the eye reads depth as a stack of registered levels. Reserve right,
subject left.

The radial geometry is the whole reason this plate exists in a set that is otherwise
lateral, so the curvature has to be legible — the bore is large in frame. Two rules stop
it becoming a logo: **it is never centred, and it is cropped hard by the frame edge**, so
the eye sees a corner of a much larger bore with most of it out of shot. Concentric rings
sitting dead-centre and fully visible is a roundel, and that is the failure mode here.

Three steps maximum. Four becomes a repeating rhythm.

> alt: `A stepped bore sunk into machined aluminium, each step catching a thin line of light.`

---

### Not briefed here, deliberately

- **Mobile app device screen** (`src/components/sections/MobileApp.tsx`,
  `MediaPlaceholder kind="screen"`). Not a generated asset. motion-brief §7 rule 5 forbids
  fabricated interfaces, and the placeholder's own label already says so: *"Screen stays
  dark — the real UI is composited in later."* Ship a screenshot of the real product at
  9:19, or ship the dark screen. Do not generate one.
- **Learn, Safety, Stats, Testimonials, Pricing, FAQ, Support.** These are `SectionShell`
  bands on flat ink and take no backdrop. motion-brief §5.3 and §5.5 brief clips for Safety
  and Learn against an older layout in which they were media sections; they are not any
  more. Adding plates there would give the page six consecutive full-bleed images, which is
  the monotony `MobileApp.tsx` explicitly exists to break.

---

## 4. Delivery spec

Encoding targets are motion-brief §6's, not invented here.

### 4.1 Stills — the six plates above

| Property | Target | Note |
|---|---|---|
| Format | **WebP only**, quality 80 | Matches §6's poster spec. **Do not ship AVIF siblings**: `MediaBackdrop`'s `<source>` elements carry `srcSet` with no `type` attribute, so a browser that cannot decode the file will not fall through — it will fail. One format per breakpoint. |
| Colour | sRGB, 8-bit, profile embedded | No Display P3. The palette is neutral; a wide-gamut profile buys nothing and risks a cast on non-managed browsers. |
| Master | 16-bit, graded, then exported | Do the black-point grade to `#050505` in 16-bit. Crushing to ink in 8-bit bands visibly across a large flat field, and the new ground is three levels darker than the old one — there is that much less room between the black point and the first visible step. |
| Dither / grain | 1–2% monochrome grain at export | The only reliable defence against banding in the large dark falloffs. |
| Budget | ≤180 KB per crop, ≤120 KB for `mobile` | Six sections × four crops, but only one crop per section is ever fetched. |
| Filenames | `public/media/<section>/<section>-<breakpoint>.webp` | |

Per-breakpoint pixel targets, derived from the `<picture>` ranges in `MediaBackdrop.tsx`
(`wide` ≥1280 wins first, then `mobile` ≤425, then `tablet` ≤768, then the `desktop`
fallback for 769–1279):

| Crop | Serves | Full-bleed sections | `MediaCard` |
|---|---|---|---|
| `mobile` | ≤425 CSS px, up to 3× DPR | 900 × 1600 | 800 × 1340 |
| `tablet` | 426–768 | 1200 × 1600 | 1100 × 1300 |
| `desktop` | 769–1279 | 1920 × 1280 | 1500 × 1400 |
| `wide` | ≥1280, incl. 4K panels | 2560 × 1440 | 1700 × 1580 |

Export:

```bash
# Still, per crop. -q 80 matches motion-brief §6's poster target.
cwebp -q 80 -m 6 -sharp_yuv -metadata icc hero-desktop.png -o hero-desktop.webp

# Or via ffmpeg if that is already in the pipeline
ffmpeg -i hero-desktop.png -vf scale=1920:-2 -q:v 80 hero-desktop.webp
```

### 4.2 If any plate ships as motion instead

Verbatim from motion-brief §6:

| Property | Target |
|---|---|
| Container | `.webm` (VP9) + `.mp4` (H.264) fallback, two `<source>` elements |
| Resolution | 1920×1080 master → serve 1280×720 |
| Duration | 8–10 s |
| Bitrate | 1.5–2.5 Mbps ≈ **2–3 MB total** |
| Frame rate | 24 fps |
| Loop | Seamless — last frame must match the first |
| Audio | None. Strip the track entirely |
| Poster | First-frame WebP |
| Mobile | Serve the poster still, skip the video |
| Reduced motion | `prefers-reduced-motion: reduce` → poster only (already enforced in `src/index.css` and in `MediaBackdrop`'s observer) |

```bash
# WebM / VP9 — primary
ffmpeg -i master.mp4 -c:v libvpx-vp9 -b:v 2M -crf 33 -vf scale=1280:-2 -an -row-mt 1 out.webm

# MP4 / H.264 — fallback
ffmpeg -i master.mp4 -c:v libx264 -b:v 2.5M -preset slow -vf scale=1280:-2 -an -movflags +faststart out.mp4

# Poster
ffmpeg -i master.mp4 -vframes 1 -vf scale=1280:-2 -q:v 80 out-poster.webp
```

Two wiring notes for whoever swaps a video in:

- **Leave `video.mobile` unset.** §6 says mobile serves the poster and skips the video.
  `MediaBackdrop`'s mobile `<source>` is hardcoded `type="video/mp4"`, so populating it
  commits you to shipping an MP4 encode specifically for the breakpoint where §6 says ship
  nothing.
- **`tone` should be `#050505`.** It is the colour behind the asset before decode, so
  anything else shows as a flash in the letterbox gap. `MediaBackdrop` currently defaults to
  `#08080a` and `Products.tsx` passes `#0B0B0D` — leftovers from the two superseded palettes,
  three and six levels above the current ground respectively. Neither is dramatic on its own;
  both are visible against a `#050505` page as a lighter rectangle that resolves a beat
  later.

---

## 5. QA — how to tell a returned asset is unusable

Run all five. Any single failure is a reject, not a note. Assets are cheap to regenerate
and expensive to unship.

### 5.1 The dead-zone contrast test — with the real headline over it

This is the one that actually matters, and it is the one that gets skipped. Do not judge
it in an image viewer.

1. Drop the four crops into the section's `image={{...}}` prop and run the page.
2. Screenshot at **390, 768, 1024 and 1920** CSS px. Those are the four crops' ranges, and
   768 is the edge case where the tablet crop meets desktop copy parking.
3. **Disable the scrim** — set `scrim={0}` on the `MediaSection` for the test. The scrim is
   headroom, not the fix; a plate that only passes with `scrim={0.88}` will fail the moment
   someone tunes it down, and it will already be failing at the frame edges where the
   radial has fallen to zero.
4. Sample the dead-zone rectangle (§2.7 table) in the screenshot:
   - **Max pixel > `#38383c`** (`Y > 0.0400`) → reject.
   - **>3% of pixels > `#2b2b31`** (`Y > 0.0246`) → reject.
   - **Any 8px span with a >20-level luminance step** → reject. Run an edge detector over
     the rectangle; it should return nothing.
5. Read the actual headline at each width and check no stroke sits on a gradient boundary:
   - Hero — *"Your money. / Your market. / One app."*
   - Products — *"Stocks & ETFs"*, *"Futures & Options"*
   - Platform — *"Built for the / ten seconds / that matter"*
   - Onboarding — *"Open an account / before your chai / gets cold"*
   - Final CTA — *"Start with what / you have today"*
   Then read the **body copy and the disclosure** at each width, not only the headline. At
   the ceiling the headline has 11.7:1 and 16px `fg-muted` has 7.5:1 — the small text is the
   binding case (§2.7), and it is the text a legibility failure actually hurts.
6. Check the **primary button** specifically, and check it twice.
   - `--color-accent` `#e7e9ee` sits at OKLCH L .934 and its whole job is being the
     brightest thing in the viewport. Sample the plate inside and immediately around the
     button's footprint: **nothing there may exceed L .750**, and the button's edge must be
     legible against it without relying on the shadow. A pale mid-grey behind a near-white
     pill deletes the button's silhouette, which is the chromatic system's version of the
     old warm-grey-behind-gold failure and is easier to hit, because the plate and the
     button are now the same colour family.
   - Then **watch it move**, at rest and on hover. The surface is live
     (`LiquidMetalSurface`, `mix-blend-screen` at 50% over the flat fill), so its darkest
     phase is what a still screenshot will not show you. The flat `bg-accent` underneath is
     the contrast floor by construction, but a plate with its own moving-looking gradient
     behind a moving button reads as two things happening.

### 5.2 Banned content scan

Walk §2.1 as a literal checklist against the returned frame, at 100% and again at 25% where
pattern-level tells appear. Specific things that pass a casual look and should not pass
this one:

- A grid of highlights that resolves into a chart at thumbnail size.
- A repeating vertical rhythm in a stack of plates that reads as bars.
- Any glass reflection containing a rectangle that could be read as a screen.
- Any form whose dominant axis leads out of the top-right corner.
- A ring or arc whose highlight sweeps upward.
- Generation-model signatures, watermarks or corner artefacts.
- A specular that reads as warm at thumbnail size. Aluminium lit at 5600K is neutral;
  "premium metal" is a generation model's cue for gold, and the tint often survives in the
  highlight after the subject looks right.
- A highlight bright enough to look like a button. View the frame at 25% with the real
  section rendered next to it: if the eye lands on the plate before it lands on the CTA, the
  plate has taken the action's job (§2.3).

Compliance sign-off (motion-brief §8 question 4) applies §2.1 **before** the asset is cut
and exported, not after.

### 5.3 Wrong crop

The failure mode is four exports of one photograph. To detect it:

- Take the `desktop` file, crop it to the `mobile` aspect ratio, and compare against the
  `mobile` file. If the compositions match, they are scales — reject the set.
- Confirm the subject **moves between breakpoints**, and moves in the direction the table
  in §2.7 requires. On mobile the copy is top-anchored and full-width; if the subject is
  still parked to one side on the mobile crop, the crop was never art-directed.
- Confirm the `tablet` crop clears **both** the top band and its named side (§2.7, the
  768px edge case).
- Confirm the `wide` crop is *composed* for the extra width, not letterboxed. Extra frame
  must be room or a second form, never stretched emptiness or a scaled-up subject.

### 5.4 Colour and luminance outside the palette

Convert to OKLCH and measure. Do not eyeball it — a 3% green cast in a dark falloff is
invisible on a laptop and obvious on a calibrated display, and on this page green means
`gain`. The luminance half of this gate is new, and it is the half that will actually catch
things: chroma failures announce themselves once you look, while a specular four levels too
bright looks like a good photograph.

Chroma (§2.2):

- **>1% of pixels at chroma ≥ 0.02** → reject. The plates are monochrome, not
  nearly-monochrome; the old 5% tolerance held a gold note that no longer exists.
- **Any pixel at chroma ≥ 0.04, at any hue** → reject outright. Hue does not need to be
  consulted to fail a pixel any more.
- **Any pixel at chroma ≥ 0.025 with hue 120°–190°** (green) or **345°–60°** (red through
  `warning` orange at 48°) → reject outright. The meaning-bearing hues get the tighter
  threshold, and the band now closes over 45°–60° because there is no gold left to keep clear
  of.
- **No split-toning.** Sample the shadows and the highlights separately; their hues should
  not differ by more than 20°.

Luminance (§2.3):

- **Any pixel above OKLCH L .750** (`chrome`, `#a9aeb8`) → reject. This is the plate's
  ceiling and the accent's floor.
- **Any clipped pixel** (255 in any channel) → reject. A blown highlight out-brightens the
  primary action by definition.
- **>3% of frame above OKLCH L .600** (`#808080`) → reject. The plate may be lit; it may not
  be bright.
- **The second light event** is permitted only in the Onboarding and Final CTA plates, only
  ≤3% of frame, capped at L .600, clear of the dead zone and ≥25% of frame width from where
  the primary button lands. Anywhere else, or in any other plate → reject.
- **Black point** must reach `#050505` inside the frame. If the darkest pixel is above
  `#0d0d10`, the plate will read as a grey rectangle on the page.

### 5.5 The system read

Lay all six desktop crops in scroll order and look at them as one page.

- Do they read as one shoot? Same room, same key, same material vocabulary, same black
  point.
- Is exactly one of them the loudest? (It should be the Hero.)
- Does the second light event appear exactly twice — Onboarding and Final CTA — and nowhere
  else?
- Now put the six crops next to a screenshot of a primary button. **Is the button still the
  brightest thing in the set?** In a monochrome system this is the question the old "does the
  gold appear twice" question was standing in for, and it is the one that decides whether the
  page has an action or six photographs and a suggestion.
- Does any two-in-a-row pair share a composition? Hero pushes right, Platform reserves
  right, Onboarding reserves left, Final CTA centres. If two neighbours put their subject
  in the same place, the scroll flattens.
- Could any of them, cropped square and stripped of context, be mistaken for a bank's
  annual report cover? If yes, it is too literal. Push it back toward the macro.
