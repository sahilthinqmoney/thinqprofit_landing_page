# ThinqProfit — Art direction for photographic and rendered assets

Generation briefs for every plate the page consumes. There is no image-generation API in
this repo, so these are written to be handed to a photographer, a retoucher, or a
generation model and run once, correctly, without a conversation.

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
gone. DESIGN.md §2 replaced it with warm ink, gold and platinum, and the display face moved
from a Didone to Archivo. The *rules* in §7 and the *encoding* in §6 survive intact; the
colour direction in §3 and §5 does not. Where they disagree, this file wins.

Three shipped strings still carry the old direction and will need updating when the assets
land — the `alt` values in §3 below are their replacements:

| File | String | Problem |
|---|---|---|
| `src/data/hero.ts` | `mediaAlt`, `heroMediaLabel` | Describes a candlestick chart and an order ticket — banned outright (§7 rule 1, rule 5) |
| `src/data/platform.ts` | `platformMediaAlt` | Describes a web terminal with an option chain and an order ticket — same. Currently unreferenced: `Platform.tsx` now renders `SignalCanvas` and passes no `media` |
| `src/data/onboarding.ts` | `mediaAlt` | Correct in substance, wrong palette ("ink-navy", "indigo fading to cyan") |
| `src/components/sections/Products.tsx` | `MEDIA_BRIEF` | Same — "translucent navy plates", "cyan filaments" |
| `src/components/sections/FinalCta.tsx` | `closingClip` | Same — "ink-navy void", "indigo-to-cyan band" |

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

**One-paragraph version, for pasting into a prompt:**

> Macro industrial photography of a large abstract machined-aluminium form in a matte
> black room. Single soft volumetric key light raking across the surface at a shallow
> angle; no fill; long falloff to true black within the frame. Brushed and bead-blasted
> metal, dark reflective glass, matte black structural planes. Neutral monochrome — steel
> greys on warm near-black, no colour cast. Shallow depth of field, long lens, flat
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
- **Anything green or red.** Reserved for `gain` / `loss` (DESIGN.md §2). This holds in
  the light, the reflections, the grade and the compression artefacts, not just the
  subject (motion-brief §7 rule 2).
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
oversharpened, HDR halo, plastic render, chrome sphere, 3D blob
```

### 2.2 Palette

The page is `--color-bg: #08080a` — warm near-black, verified in `src/index.css`. (The
table in DESIGN.md §2 still lists `#0b0b0d`, one step lighter; the CSS is current.) Plates
are graded to bottom out at `#08080a` so the frame edge dissolves into the page rather
than sitting on it as a rectangle.

| Role | Value | OKLCH | Where it may appear in a plate |
|---|---|---|---|
| Ink | `#08080a` | L .135 / C .005 / h 286° | The room. Black point of every plate. |
| Surface | `#141417` – `#1c1c21` | L .19–.29 / C .006–.011 | Matte black structure, shadow-side planes |
| Platinum | `#c8ccd4` | L .844 / C .012 / h 264° | Specular edges, the machined highlight. **This is the only bright value.** |
| Chrome dim | `#8a9099` | L .651 / C .015 / h 258° | Mid-tone metal, diffuse aluminium face |
| Gold | `#d4af37` | L .767 / C .139 / h 91° | See §2.3. Two plates only. |
| Gain / loss | `#4ade80` / `#f87171` | h 152° / h 22° | **Never.** |

**Everything else is neutral.** Working tolerance: 95% of pixels in a plate must sit below
OKLCH chroma `0.02` — visually monochrome. The permitted 5% is either the platinum
specular (which is near-neutral anyway) or the gold note described below. Nothing in the
frame carries a colour cast: no teal shadows, no warm/cool split-tone, no "cinematic"
orange-and-blue grade. The warmth in the image comes from the `#08080a` black point alone,
which is what stops the greys reading blue.

Hard reject bands, checkable per pixel: chroma ≥ `0.04` with hue in **120°–190°** (green)
or **345°–45°** (red/orange). The second band also catches `warning` orange (`#f97316`,
h 48°), which is close enough to gold to be worth keeping out of imagery entirely — on a
broker page a warm-orange glow in a plate under a gold button is a risk disclosure and a
call to action wearing the same colour.

### 2.3 Gold discipline

DESIGN.md §1: *"Gold is the working light, not the decoration. It appears where an action
is, and nowhere else."* Every plate on this page has a gold `Button` sitting on top of it.
If the plate also contains gold, the button stops being the only warm thing on the screen
and stops reading as the action.

So:

- Gold appears in **exactly two** of the six plates — **Onboarding** and **Final CTA** —
  so the page's warm note lands twice across a long scroll rather than six times.
- Where it appears it is a **bounce, not a source**: a reflected warm falloff on a metal
  face, ≤3% of frame area, chroma capped at `0.09` (about two-thirds of the button's), hue
  held in **80°–100°**.
- It never sits within 25% of the frame width of where the primary button lands, and never
  inside the dead zone.
- The other four plates are neutral steel on ink. No exceptions, no "just a hint".

### 2.4 Lighting

One key. Everything else is subtraction.

- **Key:** a single large soft source — 4×6ft softbox or equivalent — placed at a grazing
  angle, 70°–85° off the lens axis, so an aluminium face reads as a *gradient across the
  surface* rather than a hotspot in the middle of it. Height slightly above the form,
  angled down. 5600K, no gel.
- **Fill:** none. Black flags on the shadow side. The falloff is the depth; a fill light
  flattens the plate into a grey card and the copy then has nowhere dark to sit.
- **Rim:** at most one hard accent — a 1° grid spot or a light through a narrow slot —
  used to draw a single platinum edge line where a form has to separate from the
  background. One rim per plate. Two rims and the object starts to look lit *for* the
  camera, which is exactly the tell that separates product photography from a render.
- **Falloff:** the room must reach `#08080a` inside the frame, not at its edge. If the
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
- **Machined chamfer** — the 45° cut where two faces meet. This is where the platinum
  specular lives, and it is the single most useful mark in the whole system: a bright hair
  line that describes a form's geometry without lighting its face.

Banned materials: chrome (mirror finish reflects the studio and reads cheap), polished
gold, carbon fibre, brushed rose gold, marble, concrete, water, smoke machines,
holographic film.

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

- No pixel above `#3a3a3e` (relative luminance `0.043`). That holds `#f7f6f3` headline text
  at **10.5:1** against the worst pixel it can land on.
- No more than 3% of dead-zone pixels above `#2a2a30` (13.2:1).
- No luminance step greater than 20 sRGB levels across any 8-pixel span inside the dead
  zone. Mean darkness is not enough — a machined chamfer running through a headline breaks
  legibility even when the average is near black. **The dead zone must contain no edges,
  not merely no highlights.**
- Falloff into the dead zone is gradual: the boundary between the lit region and the dead
  zone spans at least 12% of frame width. A hard terminator at the dead-zone border reads
  as a matte line.

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
an object placed in the middle of a room. Its leading chamfer runs a platinum hairline from
upper-right down toward frame centre, then dies. The left of the frame is empty room. No
horizon, no floor line, no visible set. The form's mass sits in the right 40%; nothing
structural crosses x=60%.

**Dead zone.** **Left.** x 0–56%, y 12–80% on desktop and wide. This is the largest reserve
on the page: the H1 is `clamp(3rem, 7vw, 5.75rem)` at a 10em measure — up to ~900px of type
across three lines — with subheadline, two buttons and a support line beneath it.

**Lighting.** Key from camera-right at 80°, high, raking down the form's face so the
gradient runs from a soft near-white at the top of the curve to ink at the bottom. One 1°
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
| `mobile` ≤425 | 900×1600 (9:16) | Copy is centred *and* full width here — there is no dead side. Reduce to almost nothing: an ink field with a single soft platinum gradient in the bottom-right corner, peaking below `#2a2a30`, and a barely-there lift at the very top edge. This crop is deliberately the quietest of the four. |
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
card. **Plus a bottom-left patch** for the gold `Explore stocks` button: 34% × 14% of the
card, anchored to the bottom-left corner.

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
14% for the gold `Explore F&O` button.

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

**Dead zone.** **Right.** x 44–100%, y 14–86%. The copy stack here is the heaviest on the
page after Onboarding — headline in three lines at the `tall` step, subheading, a gold
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

This is one of the two plates permitted a gold note (§2.3): a warm reflected falloff on the
third block's shadow-side face, ≤3% of frame, hue 80°–100°, chroma ≤0.09, placed at
roughly x=82% — well clear of the gold `Start account opening` button, which lands at
around x=12% on desktop.

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
chamfers run down its leading vertical edge, catching platinum. The floor is implied by a
shadow, not drawn by a line. The centre of the frame — the object's own body — is the
darkest region in the image.

That inversion is the whole trick of this plate: the subject occupies the dead zone, and it
is legible only by its edges. The copy sits **on** the monolith's unlit face.

**Dead zone.** **Centre.** x 26–74%, y 16–84% — a centred column ~600px wide holding a
two-line headline, subheading, support line, two buttons and the market-risk disclosure.
The monolith's face inside that rectangle must hold below `#2a2a30` throughout, and its two
chamfer highlights must fall **outside** x 26–74%. If a chamfer crosses the copy column,
the plate is rejected — this is the plate where §2.7's no-edges rule does the most work.

**Lighting.** Key from camera-left at 85°, soft and large. It describes the monolith's left
chamfer and the wall falloff behind it, and leaves the face facing camera almost entirely
unlit. One weak rim from camera-right catching the right chamfer at lower intensity than
the left — asymmetry is what stops it reading as a symmetrical logo lockup.

The second permitted gold note (§2.3) goes here: a warm bounce in the lower-right falloff,
where the light dies into the floor, at ≤3% of frame. It sits at roughly x=85%, y=88% — far
from both the centred copy column and the two centred buttons.

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
| Master | 16-bit, graded, then exported | Do the black-point grade to `#08080a` in 16-bit. Crushing to ink in 8-bit bands visibly across a large flat field. |
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
- **`tone` should be `#08080a`.** `MediaBackdrop` defaults to `#0b1220` and
  `Products.tsx` passes `#0B0B0D`; both are leftovers from the superseded navy palette and
  will show as a blue-black flash in the letterbox gap before decode.

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
   - **Max pixel > `#3a3a3e`** → reject.
   - **>3% of pixels > `#2a2a30`** → reject.
   - **Any 8px span with a >20-level luminance step** → reject. Run an edge detector over
     the rectangle; it should return nothing.
5. Read the actual headline at each width and check no stroke sits on a gradient boundary:
   - Hero — *"Your money. / Your market. / One app."*
   - Products — *"Stocks & ETFs"*, *"Futures & Options"*
   - Platform — *"Built for the / ten seconds / that matter"*
   - Onboarding — *"Open an account / before your chai / gets cold"*
   - Final CTA — *"Start with what / you have today"*
6. Check the **gold button** specifically. `--color-accent` `#d4af37` at L 0.767 needs the
   plate behind it dark and neutral; a warm mid-grey behind a gold pill kills the edge of
   the button.

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

### 5.4 Colour outside the palette

Convert to OKLCH and measure. Do not eyeball it — a 3% green cast in a dark falloff is
invisible on a laptop and obvious on a calibrated display, and on this page green means
`gain`.

- **>5% of pixels at chroma ≥ 0.02** → reject. The plates are effectively monochrome.
- **Any pixel at chroma ≥ 0.04 with hue 120°–190°** (green) → reject outright.
- **Any pixel at chroma ≥ 0.04 with hue 345°–45°** (red, and `warning` orange at 48° sits
  just outside it — treat anything under 60° as suspect) → reject outright.
- **Gold** is permitted only in the Onboarding and Final CTA plates, only at hue 80°–100°,
  chroma ≤ 0.09, ≤3% of frame area, and outside the dead zone. Anywhere else, or in any
  other plate → reject.
- **Black point** must reach `#08080a` inside the frame. If the darkest pixel is above
  `#141417`, the plate will read as a grey rectangle on the page.
- **No split-toning.** Sample the shadows and the highlights separately; their hues should
  not differ by more than 20°.

### 5.5 The system read

Lay all six desktop crops in scroll order and look at them as one page.

- Do they read as one shoot? Same room, same key, same material vocabulary, same black
  point.
- Is exactly one of them the loudest? (It should be the Hero.)
- Does the warm gold note appear exactly twice — Onboarding and Final CTA — and nowhere
  else?
- Does any two-in-a-row pair share a composition? Hero pushes right, Platform reserves
  right, Onboarding reserves left, Final CTA centres. If two neighbours put their subject
  in the same place, the scroll flattens.
- Could any of them, cropped square and stripped of context, be mistaken for a bank's
  annual report cover? If yes, it is too literal. Push it back toward the macro.
