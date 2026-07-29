# ThinqProfit — Motion & Asset Brief

Generation prompts for the hero background clip and the wider asset library, derived from an analysis of the supplied reference (`hero_section_bg_clip.mp4`).

**Palette source:** [design-system/thinqprofit/pages/landing.md](../design-system/thinqprofit/pages/landing.md)
**Placement:** every asset here replaces a `MediaPlaceholder` in [src/components/sections/](../src/components/sections/)

---

## 1. Reference analysis

`hero_section_bg_clip.mp4` — 1924×1076, 24 fps, 10.0 s, H.264, no audio, 20.1 MB (≈16 Mbps).

### Subject
A young woman in a cream hoodie, hair in a low bun, seated at a wooden desk, working on a laptop. The desk is stacked with open and closed books. Two clusters of warm amber-yellow lilies sit left and right, closer to camera than she is. Everything else is void black.

### The one idea that makes it work
A **ribbon of light orbits the subject** — an iridescent particle trail on a figure-eight / elliptical path that passes behind her shoulders and in front of the desk. It is not an overlay: it is the scene's **practical light source**. Her face, hoodie and the book edges are lit by it, which is why the composite reads as filmed rather than post-processed.

### Motion — one continuous take, no cuts
| Time | What happens |
|------|--------------|
| 0.0–2.0 s | Ribbon is tight, roughly torso-scale, coiled close around her head and shoulders |
| 2.0–4.0 s | Camera begins a slow dolly-out; the orbit widens past the desk edge |
| 4.0–7.0 s | Orbit becomes a broad ellipse enclosing the whole desk; foreground flowers grow into frame from both edges |
| 7.0–10.0 s | Ribbon exceeds the frame — only its upper arc stays visible, sweeping the top third |

The camera pulls back a modest amount (subject shrinks maybe 15 %); most of the perceived scale change comes from **the orbit expanding faster than the camera moves**. That contrast is the effect. A plain zoom-out would be inert.

### Palette
| Element | Colour |
|---------|--------|
| Background | Near-pure black, `#050505`-ish, no gradient, no visible set |
| Subject | Cream / ivory, low saturation |
| Florals | Warm amber-gold, the only saturated colour in frame |
| Ribbon | Iridescent — cyan and teal core, white-hot highlights, scattered magenta, gold and green sparkle |
| Desk / books | Warm mid-brown, heavily fallen off into shadow |

### Lighting
Soft key from front-left at low intensity, plus the ribbon as a moving practical. Long falloff — the set dissolves to black about a metre behind her. Shallow depth of field: foreground flowers and background both soften, she stays sharp.

### Composition
Centred and near-symmetrical. Subject on the optical centre, floral clusters as a natural left/right vignette, desk as a horizontal base holding the lower third. The orbit supplies diagonal energy against that stable frame.

### Genre
Premium "AI magic" product film — the visual language of an AI study tool or a productivity app. Calm, not hyped.

---

## 2. What to keep, what to change

### Keep — this is why the reference is good
- **Void black + one luminous element.** The restraint is the premium signal.
- **Light as a practical, not an overlay.** The orbit must illuminate the subject or it looks like a filter.
- **One continuous take.** No cuts in a hero background — cuts pull attention off the headline.
- **The orbit expanding faster than the camera retreats.** The whole effect.
- **A single quietly focused human.** This matters more than it looks: it says *composure*, not *hype*. For a broker that is the correct emotional register, and it is the opposite of the lifestyle-flex imagery the copy deck bans in §19.

### Change — the reference is off-brand as-is
1. **The amber florals must go.** Warm gold is the reference's only saturated colour and it fights ThinqProfit's ink-and-indigo palette head-on. Replace with cool-toned foreground framing.
2. **The ribbon's colour must be constrained.** The reference sparkles green, magenta and gold. On a trading platform **green and red are reserved for gain and loss** — a green sparkle in the hero starts teaching the wrong association before the visitor has scrolled once. The ribbon becomes indigo → cyan only.
3. **Background moves from `#050505` to `#0F172A`** so the video edge dissolves into the page rather than sitting on it as a black rectangle.
4. **A text-safe dead zone is required.** The reference fills the optical centre with its subject. The ThinqProfit H1 occupies the left half on desktop. The subject shifts right; the left 45 % stays dark and low-contrast.
5. **No numbers, tickers, candles or P&L anywhere in frame.** Rendered market data in a hero is fabricated market data. Keep the market abstract — flow, structure, light. This is a compliance boundary, not a taste preference.

---

## 3. Primary prompt — hero background

Written for Veo / Sora / Kling / Runway Gen-3. Paste as-is; trim from the bottom if your model has a tighter token limit.

```
A single continuous 10-second cinematic shot, no cuts. A young woman in a
charcoal-grey knit sweater sits at a dark walnut desk, centred slightly RIGHT
of frame, quietly focused on a laptop. Her posture is calm and still — she is
studying something, not reacting to it.

Orbiting her is a single continuous ribbon of light on an elliptical
figure-eight path, passing behind her shoulders and sweeping in front of the
desk. The ribbon is made of fine luminous particles and thin data-like
filaments, deep indigo at its edges fading to bright cyan at its core, with
white-hot highlights where it curves toward camera. It is the scene's only
practical light source: it rim-lights her cheekbone, the edge of her sweater
and the desk surface as it passes, and the illumination travels with it.

Motion: the ribbon starts tight and torso-scale, coiled close around her, then
expands steadily outward over the full ten seconds until its arc exceeds the
frame and only the upper sweep remains visible. The camera performs a slow,
smooth dolly-out at a much gentler rate than the ribbon expands, so the orbit
appears to bloom outward past the viewer. Motion is continuous and unhurried
throughout — no acceleration, no snap, no camera shake.

Foreground framing: soft out-of-focus geometric forms at the extreme left and
right edges, close to camera — matte dark-navy angular shapes, like frosted
glass panels catching a faint cool rim light. They are silhouettes, not
objects, and they grow gently into frame as the camera retreats.

Environment: deep ink-navy void, hex #0F172A, no visible set, no walls, no
horizon. Light falls off to near-black about a metre behind the subject.

Colour: strictly cool. Deep navy background, charcoal and slate on the subject,
indigo and cyan in the light ribbon. No green, no red, no amber, no gold, no
magenta anywhere in frame.

The LEFT 45% of frame stays dark, empty and low-contrast throughout — reserved
negative space. Do not place the subject, the ribbon's brightest point, or any
foreground element there.

Lighting: single soft key from front-left at low intensity, plus the moving
ribbon practical. Shallow depth of field, subject sharp, foreground and
background soft. Anamorphic-style subtle bloom on the brightest highlights.
Fine cinematic grain.

Mood: composed, precise, quietly intelligent. Premium financial technology.
Restrained, not dramatic.
```

### Negative prompt

```
text, letters, numbers, digits, tickers, stock symbols, currency symbols,
candlestick charts, line graphs, bar charts, percentages, price quotes,
trading screens, dashboards, UI panels, holograms with data, arrows,
upward arrows, rockets, coins, gold bars, cash, money, bulls, bears,
green light, red light, green glow, red glow, amber, gold, warm tones,
flowers, plants, foliage, cluttered desk, multiple monitors, crowd,
multiple people, direct eye contact with camera, smiling at camera,
celebration, fist pump, luxury goods, cars, watches, cuts, transitions,
scene changes, camera shake, fast motion, zoom punch, strobing, flicker,
lens flare streaks, watermark, logo, signature, low resolution, distorted
hands, extra fingers, warped face
```

### Short version — for models with tight prompt limits

```
Continuous 10s shot, no cuts. Woman in charcoal sweater at a dark desk,
positioned right of centre, calmly working on a laptop. A single ribbon of
indigo-to-cyan luminous particles orbits her on an elliptical path, passing
behind her shoulders and in front of the desk, acting as the only light source
and rim-lighting her face and the desk as it passes. The ribbon starts tight
around her torso and expands steadily outward until it exceeds the frame.
Camera dollies out slowly, much more gently than the ribbon expands. Deep
ink-navy void background #0F172A, no set. Soft dark-navy geometric shapes
out of focus at the left and right edges. Strictly cool palette — indigo and
cyan only, no green, red, amber or gold. Left 45% of frame stays dark and
empty. Shallow depth of field, soft bloom, fine grain. Composed, premium,
restrained fintech mood.
```

---

## 4. Hero variants

Same grammar, different metaphor. Generate all three and pick on the page, not in the viewer — a hero background reads completely differently once type sits on it.

### Variant A — "Order from noise" (recommended)
Replace the ribbon with **thousands of fine particles drifting chaotically**, which over the ten seconds resolve into a single smooth orbital band around the subject. Chaos → structure, in one continuous move. This is the closest visual metaphor to what the product actually claims: scattered market information, organised.

> Substitute in the primary prompt: *"Thousands of fine luminous particles drift in slow disordered motion around her, filling the space with soft indigo noise. Over the ten seconds they gradually organise themselves, settling into a single clean elliptical band of light orbiting her shoulders. Disorder resolving into structure. Same cool indigo-to-cyan palette, same dolly-out, same left-side negative space."*

### Variant B — "Signal through depth"
No orbit. Instead, **layered translucent planes** slide slowly through the frame at different depths, each catching a cool rim light, passing in front of and behind the subject — depth and layered information without a single chart.

### Variant C — "Still point"
Subject perfectly still and sharp; **everything around her in slow radial motion** — particles, planes, light — blurring at the edges. Motion parallax carries all the energy. Sells composure amid volatility, which is the honest emotional promise for a broker.

---

## 5. Asset library — the rest of the page

Same visual grammar throughout, so the library reads as one system rather than a stock-footage pile. **Constant across every asset:** ink-navy `#0F172A` void, indigo→cyan light only, no green/red, no text, no numbers, no chart forms.

### 5.1 Products — 8 loops, 3–4 s each, silent, seamless
Abstract object studies, one motif per product, shot as if lit in the same void.

| Product | Prompt core |
|---------|-------------|
| Stocks & ETFs | Slow rotation of a cluster of thin translucent navy plates suspended in space, each catching an indigo rim light as it turns |
| F&O | Two interlocking luminous rings on offset axes, rotating in opposite directions, cyan filaments tracing where they intersect |
| Mutual Funds | Many fine particles converging smoothly into a single dense luminous sphere, then holding |
| IPO | A single point of light rising slowly through layered translucent planes, each plane brightening as it passes |
| Commodities | A rough-surfaced dark monolith rotating slowly, its edges catching hard cyan specular highlights |
| Currency | Two smooth luminous streams flowing past each other in opposite directions, briefly interleaving at the centre |
| Bonds & G-Secs | A slow steady pulse travelling along a single taut horizontal filament of light, left to right, evenly spaced |
| Baskets | Twelve small drifting lights gathering into one clean geometric lattice, holding, then loosening slightly |

### 5.2 Platform — 1 clip, 6 s
Extreme close-up macro across a dark glass surface with faint cool light refracting through it, shallow focus racking slowly from one edge to the other. Suggests instrumentation without rendering a single UI element.

### 5.3 Safety — 1 clip, 5 s
A translucent geometric shell forming panel by panel around a small steady point of cyan light at the centre. Deliberate, unhurried, no snap. **No padlocks, no shields, no vault doors** — the literal icons are already in the section; the video should carry the feeling instead.

### 5.4 Mobile app — 1 clip, 5 s
A dark rectangular slab rotating slowly on a vertical axis in the void, its surface catching a soft indigo sweep. **Screen stays dark and empty** — the real UI gets composited in later, and a generated screen would invent numbers.

### 5.5 Learn — 5 stills
Layered translucent forms at increasing complexity, one per track, shot as a consistent series so they read as a progression rather than five unrelated images.

### 5.6 Onboarding — 3 stills or one 4 s loop
Three luminous nodes connecting in sequence along a single path, each link settling before the next begins.

### 5.7 Stat band — optional 8 s ambient loop
Very low contrast, very slow drifting particle field. Must sit *far* behind text — target 8–12 % effective contrast against the background.

---

## 6. Technical delivery

The reference clip is **20 MB for 10 seconds — roughly 16 Mbps.** That is a production master, not a web asset. Shipping it as-is would dominate the page's load and blow past any sane LCP budget.

| Property | Target | Note |
|----------|--------|------|
| Container | `.webm` (VP9) + `.mp4` (H.264) fallback | Two `<source>` elements |
| Resolution | 1920×1080 master → serve 1280×720 | Behind text; nobody inspects hero pixels |
| Duration | 8–10 s | |
| Bitrate | 1.5–2.5 Mbps | ≈**2–3 MB total**, roughly 7× smaller than the reference |
| Frame rate | 24 fps | Matches the reference and suits slow motion |
| Loop | Seamless — last frame must match the first | Generate a few seconds long and cross-fade, or design the orbit to return to its start |
| Audio | None | Strip the track entirely |
| Poster | First-frame WebP | Shows before the video decodes; prevents a black flash |
| Mobile | Serve the poster still, skip the video | Saves the payload where it costs most |
| Reduced motion | `prefers-reduced-motion: reduce` → poster only | Already enforced globally in [src/index.css](../src/index.css) |

Encode:

```bash
# WebM / VP9 — primary
ffmpeg -i master.mp4 -c:v libvpx-vp9 -b:v 2M -crf 33 -vf scale=1280:-2 -an -row-mt 1 hero.webm

# MP4 / H.264 — fallback
ffmpeg -i master.mp4 -c:v libx264 -b:v 2.5M -preset slow -vf scale=1280:-2 -an -movflags +faststart hero.mp4

# Poster
ffmpeg -i master.mp4 -vframes 1 -vf scale=1280:-2 -q:v 80 hero-poster.webp
```

---

## 7. Rules for every generated asset

Non-negotiable, and the reason several obvious ideas are absent above.

1. **No numbers, prices, percentages, tickers or chart forms.** A rendered candlestick is fabricated market data. Even blurred, even abstract, even "obviously decorative" — if it reads as a price, it is a claim.
2. **No green, no red.** Reserved for gain and loss. This holds in the light, the particles, the reflections and the grade.
3. **No upward motion as a promise.** Rising arrows, ascending lines, launch imagery — all imply returns. Motion should be lateral, orbital or radial. Never triumphantly up.
4. **No wealth signalling.** No cars, watches, cash, gold, skylines, champagne. The copy deck bans it in §19 and the imagery must not smuggle it back in.
5. **No fabricated interfaces.** Any device screen stays dark; real UI is composited from the real product.
6. **People, if shown, are composed — never celebrating.** One person, calm, mid-thought. Not a fist pump.
7. **Every asset must survive text on top.** Check contrast with the actual headline overlaid before approving anything.

---

## 8. Open questions

1. **Live-action, generated, or hybrid?** The reference is either a real plate with a CG orbit, or a very good generation. A real plate plus a CG element holds up better at 1440 px than a fully generated human — worth deciding before committing budget.
2. **Does a person appear at all?** Variants B and C work with no human, which sidesteps model-release, uncanny-hand and representation questions entirely.
3. **Is there an existing brand shoot** the person's wardrobe and grade should match?
4. **Who signs off on imagery for compliance?** Section 7 above should be their checklist, and it should be applied before the asset is cut, not after.
