# ThinqProfit — visual system

Reference point: robinhood.com/us/en, studied for structure and mechanics, not for
appearance. What was taken is the *architecture* — full-bleed media with copy set on
top of it, art-directed line breaks, per-asset scrims, unequal section weight. What was
not taken is the look: Robinhood is acid lime on warm black with a Dutch old-style
serif. This is a near-white chromatic alloy on neutral ink, set in a signage grotesk, and
it is aimed at a different reader in a different market.

---

## 1. The concept: instrument

A broker's landing page has one job that no amount of styling substitutes for — making
a stranger believe you will not lose their money. Every decision below resolves to that.

**The alloy is the working light, not the decoration.** The brand surface is polished
metal — a neutral, near-white chromatic alloy. It appears where an action is, and nowhere
else. On a page this dark, a single bright surface is what makes the room read as lit
rather than as unlit; the difference from the system this replaces is that the light is no
longer the *warmest* thing on the page but the *brightest*. Spread across badges, borders,
icons and headings it would stop being light and become paint.

**The primary action wears the alloy as an edge, not as a fill.** This is the one place
the metal moves, and the geometry matters: the shader fills the control, a dark gradient
core sits on top of it, and the 2px gap between them is the ring you see. Two reasons it
is built that way rather than as a bright pill.

The first is optical. Dispersion — the iridescence that makes the alloy read as *chromatic*
rather than as grey — only exists at a highlight-to-shadow boundary. A large flat field of
near-white has almost none, and measured through a half-strength `screen` composite the
channel split reaching the screen was about 1.6/255. Invisible. On a 2px ring, every pixel
is an edge.

The second is legibility, and it is the stronger one. A label on a moving metal fill has to
survive every frame of that animation, and the shader's pattern goes near-black in its dark
stripe regardless of the colours fed to it — so no choice of `u_colorTint` fixes it, and
three attempts to fix it that way failed. On a rim the label sits on the dark core instead:
white on the core's lightest stop is 17.0:1. **Contrast cannot be a property of an
animation.** The community component this derives from puts `#666666` on that core, which
is 2.84:1 and fails AA outright.

**With no hue in the brand, the action is separated by luminance and motion.** A gold
button could afford to sit mid-luminance because its hue did the identifying. A neutral
one cannot: the only things that distinguish `#e7e9ee` from every other pale grey the page
could produce are that nothing else is that bright, and that nothing else moves. Both
halves are load-bearing, which is why the live shader is scoped to the primary action and
why every other metal mark on the page is held below the accent's luminance (§2).

**Chrome is the machined edge.** Hairlines mark where one surface meets another. They are
structural, not ornamental — a metallic edge on everything reads as noise, and stops
reading as precision. `chrome` sits a deliberate step below `accent` (9.16:1 against
16.78:1). In the old system an edge and an action were told apart by hue and could share a
luminance; here that luminance gap is the *only* thing keeping a machined edge from
competing with a button, so it is not negotiable.

**Ink is the room.** Neutral near-black, `#050505` — not blue-black, not pure black. Pure
black is a hole; near-black is a surface with a light on it, which is what polished metal
needs to sit on. It is neutral rather than warm, and that is a change with a reason: the
warmth in the previous ground existed to stop gold reading muddy against it. A warm ground
under a neutral alloy tints the metal yellow, which is precisely the look being removed.

**The grotesk is the argument; the serif appears exactly once.** The display face is
Archivo, a newspaper and signage grotesk, because low contrast, even colour and closed
apertures are the language of infrastructure — wayfinding, instrument panels, timetables —
and a broker is infrastructure, not fashion. The page's one editorial serif is spent on the
closing statement and nowhere else: a serif used once is a change of register, a serif used
everywhere is just a different default. The copy is the strongest asset this page has, so
the type gets out of its way and lets it sound like prose.

---

## 2. Colour

Every value was contrast-checked against the ink base, computed rather than estimated.
Ratios are on `--color-bg` `#050505`. `src/index.css` is the contract; this table is its
documentation and must be kept in step with it.

| Token | Value | Ratio | Use |
|---|---|---|---|
| `bg` | `#050505` | — | the page |
| `surface` | `#0d0d10` | 1.05 | raised bands |
| `surface-raised` | `#16161a` | 1.13 | panels, the mobile-app block |
| `fg` | `#ffffff` | 20.38 | headings, body on dark |
| `fg-muted` | `#cfcfcf` | 13.08 | body copy, secondary, disclosures |
| `fg-subtle` | `#7e7e7e` | 5.02 | **footer meta and legal fine print only** — never body |
| `border` | `#2b2b31` | 1.45 | panel edges |
| `border-soft` | `#1c1c21` | 1.20 | row rules, section hairlines |
| `accent` | `#e7e9ee` | 16.78 | **the action.** The brightest value on the page; worn as a 2px ring, not a fill |
| `accent-hover` | `#f4f6fa` | 18.84 | hover |
| `accent-soft` | `#c3c8d2` | 12.14 | links, quiet accents |
| `on-accent` | `#050505` | 16.78 on the alloy | text on any accent fill |
| `chrome` | `#a9aeb8` | 9.16 | hairline highlights, machined edges |
| `chrome-dim` | `#757b85` | 4.78 | secondary marks |
| `gain` | `#4ade80` | 11.70 | **live market data only** |
| `loss` | `#f87171` | 7.37 | **live market data only** |
| `warning` | `#f97316` | 7.27 | risk disclosures, pending-answer flags |

Two measurement notes, because both are easy to get wrong from memory:

- **`warning` is 7.27:1, not 7.02:1.** 7.02 is the figure carried in `src/index.css`'s
  comment and it was measured against the previous ground `#0b0b0d`. The hex did not
  change; the ground did.
- **`fg-subtle` is specified against `bg` alone.** On `surface-raised` it measures 4.44:1
  and fails the floor. Fine print sits on the ground, not on a raised band.

Four constraints shaped the set:

1. **An accent fill always carries ink text.** White on `#e7e9ee` is **1.21:1** — not a
   marginal failure, an invisible label. `text-on-accent` exists so that mistake cannot be
   made by habit. This is the same rule the previous system had, for the same reason, at a
   different value and a far worse failure mode: white on gold was at least legible as a
   shape.
2. **Hue is now reserved entirely for meaning.** Nothing in the brand is coloured, so the
   only chromatic values left anywhere on the page are `gain`, `loss` and `warning`. This
   is a strict improvement rather than a subtraction: a green number can no longer be
   mistaken for a brand accent, because there is no coloured brand accent to mistake it
   for. The corollary is that introducing *any* hue outside those three roles does not
   merely look off-brand, it makes a claim — the page has taught the reader that colour
   means something.
3. **`warning` still ships with an icon and a border.** It is no longer defending against
   a collision with gold at hue 91°; it is defending against being read as `loss`. Orange
   sits at OKLCH hue 47.6° and `loss` at 22.2° — 25° apart, which is enough for a
   side-by-side and not enough for a glance across a scroll. Hue is never the sole signal
   on a disclosure.
4. **Gain and loss are quarantined.** They appear on no button, badge, link or
   illustration. A green CTA on a trading page is an implied promise.

### The primary action

The rule, stated once so it can be cited: **the primary action carries the brightest edge in
the viewport and is the only surface that moves.** Everything else is a consequence.

Note *edge*, not *surface*. An earlier draft of this document said the action was the
brightest surface, which described a bright metal pill. It is a dark core with a bright
chromatic ring — see §1 for why. The distinction matters when citing this rule: what is
reserved is the brightest **2px**, not the largest bright area.

- `accent` is not shared. A badge, a chip, an active nav state or an icon that reaches
  `#e7e9ee` is competing with the button at its own game, and unlike the gold system there
  is no hue left to tell them apart. Quiet accents take `accent-soft` (12.14:1); machined
  marks take `chrome` (9.16:1).
- `LiquidMetalSurface` takes a `blend` prop with two modes, and they exist for opposite
  reasons. `rim` runs the shader at full strength with no blending, because the ring is thin
  and halving it leaves a grey line. `screen` runs it at 50% over a flat `accent` fill, where
  screen's inability to darken makes that fill a guaranteed contrast floor — that mode is for
  any future surface where text sits *on* the metal. The button uses `rim`; its label sits on
  the dark core and never touches the shader.
- It degrades three ways and all three land on the ordinary flat button: `prefers-reduced-motion`
  sets shader speed to 0 (the surface still renders as metal, it just stops moving), a
  refused WebGL context is caught and logged, and `metal={false}` opts a primary action out
  by hand — for a form submit inside a panel, where a moving surface pulls focus off the
  field it belongs to.

### The WebGL context ceiling is a hard budget

Each `LiquidMetalSurface` mounts its own WebGL context. Browsers cap live contexts —
Chrome at roughly 16 — and when the cap is passed they **silently drop the oldest**. No
exception, no console error, just buttons at the top of the scroll quietly reverting to
flat fills while the ones at the bottom animate.

The page currently has 15 `<Button>` call sites. Seven take the default `primary`, Navbar
declares two more (desktop rail and mobile drawer), and Products renders one per featured
product — two today. That is **about ten simultaneous contexts on a desktop pass and
eleven with the drawer open**, against a ceiling of sixteen.

So the count is a budget, not an aesthetic preference:

- **Adding a metal button anywhere new has to be paid for**, either by `metal={false}` on
  an existing one or by demoting it to `secondary`.
- **A second featured product** in `featuredProductIds` costs one context per instance.
- **Anything that mounts a shader inside a list or a map is out of the question.** The
  failure is invisible in development, where the page is scrolled once from the top.
- The design argument points the same way. A live metal surface is the loudest thing this
  page can do; putting it on every control — including ghost links reading "See pricing" —
  spends that emphasis on nothing and leaves the actual primary action indistinguishable
  from its neighbour.

---

## 3. Type

Archivo for display, Instrument Sans for everything else. Both variable.

**The display face is a grotesk, not a serif, and that is an argument about what money
looks like.** High-contrast serifs — hairline strokes against thick stems — are the
visual language of fashion, beauty and luxury goods. Low contrast, even colour and
closed apertures are the language of infrastructure: wayfinding, instrument panels,
timetables, newspapers. A broker is infrastructure. An earlier pass used Instrument
Serif, a Didone; at 76px it was selling perfume rather than custody of your shares.

Archivo comes out of the newspaper and signage tradition. Its skeleton is square and
quiet, which is exactly what keeps it premium at display size — faces with personality
in the letterforms turn cartoonish the moment they get large, because the quirk scales
with the type.

**`.display`** sets `wdth: 90`, `wght: 600`, `letter-spacing: -0.035em`, `text-wrap:
balance`. The narrowing does two jobs: it buys back the line length that trading copy
eats — *"Understand the trade before you place it"* — so the size never has to drop, and
size is what carries authority; and it holds the display face visibly apart from
Instrument Sans at full width beneath it, so two grotesks on one page read as a decision
rather than a mix-up. Weight 600 rather than 800 because heavy grotesks read as
advertising.

**Everything else — Instrument Sans.** Body, UI, buttons, tables, figures. True tabular
numerals via the `.tabular` class, which the rate card and the stat band both need so
digits do not jitter as values change.

**The one serif moment** is `.display-serif` — Newsreader at `opsz 72`, `wght 380` — set
on the closing statement and used nowhere else on the page. Newsreader rather than a
Didone: moderate stroke contrast and an old-style skeleton, so it reads as a considered
sentence rather than as a fashion masthead. It is set lighter than the surrounding
grotesk because an old-style serif at 380 already carries more presence per pixel than
Archivo at 600.

**Both faces are variable, and that is structural rather than a nicety** — it is what
lets the hero headline respond at all. Instrument Serif shipped a single static weight
with no axes, so nothing could move. Axis ranges are requested explicitly in the font
URL; omit them and Google serves a static instance at the default coordinate, and every
`font-variation-settings` rule on the page silently does nothing.

Steps, set on `MediaSection`:

| Step | Size | Leading |
|---|---|---|
| `epic` | `clamp(3rem, 7vw, 5.75rem)` | 1.00 |
| `tall` | `clamp(2.75rem, 5.4vw, 4.5rem)` | 1.04 |
| `mid` | `clamp(2.5rem, 4.6vw, 3.75rem)` | 1.06 |
| `short` | `clamp(2.25rem, 3.8vw, 3.25rem)` | 1.08 |

Leading opens as the size drops: a grotesk this tight needs air at 2.25rem that it does
not need at 5.75rem, where the line length itself does the separating. `SectionShell`
carries its own three steps — `lead`, `standard`, `minor` — so a lead section and a minor
one stop rendering at the identical clamp.

**One body size on the whole page: 16px.** Hierarchy comes from the display scale, not
from five sizes of running text.

**Measure is expressed in `em`, never `px` or `ch`,** so a headline breaks in the same
place at every breakpoint instead of re-ragging as the clamp resizes it.

**Headlines carry their own line breaks.** A `\n` in a heading string is an art
direction, honoured at ≥768px and ignored below it. Balanced line lengths are chosen,
not inherited from whatever width the viewport happens to be.

### There is no eyebrow

A category label above a heading — "Pricing" over "Priced plainly, in advance" — is
decoration in the costume of information. The heading already says what the section is;
the label survives only because it is easy to add. The prop was removed from both
`SectionShell` and `MediaSection` so it cannot come back by reflex. The hero's former
kicker repeated the trust strip directly beneath it word for word, and went with them.

---

## 4. Space and rhythm

Container caps at 1760px with gutters `px-5 / sm:6 / lg:8 / xl:12`. Full-bleed sections
sit **outside** Container and re-impose that cap on their copy alone.

Sections are full-screen — `min-h-svh`, content vertically centred. `svh` rather than
`vh` so mobile browser chrome does not push a section past the fold, and `min-` rather
than a fixed height so content-heavy sections grow instead of clipping. TrustStrip and
Stats opt out: they are punctuation between sections, and a full screen around five
registration codes is a screen of nothing.

The hero subtracts `--header-stack` from its height. At a plain `100svh` the
announcement bar and nav push the mandatory risk disclosure off the first screen, and
copy deck §3 requires it *in* the first viewport, not merely on the page.

More space above a heading than below it. Tight groups, generous separation.

---

## 5. Media

`MediaSection` and `MediaCard` set copy **on** the asset. The mechanics:

- Backdrop pinned at `z-index: -999`, scrim at `-1`, both inside the section's own
  stacking context. Copy stays in normal flow and needs no z-index, which is what keeps
  live disclosure text selectable and contrast-safe. `isolate` is load-bearing:
  `relative` alone opens no stacking context, and the media would paint behind the
  page's opaque wrapper.
- **Art-directed crops per breakpoint** — mobile, tablet, desktop, 4K are separate
  files with the negative space in different places, never one image scaled.
- **Copy parked by percentage margin**, not a grid column, alternating side between
  sections, so the asset can be shot with its empty region exactly where the words land.
- **Scrim is radial and tuned per asset** — strength and focus point set per section,
  overscanning `-20%/-25%` so its soft edge never lands inside the frame. `scrim={0}`
  when a plate is already dark. A blanket `bg-black/50` on every section is the tell
  being removed, not a default.
- **Video is `loop muted playsinline preload="auto"` with no `autoplay`.**
  IntersectionObserver drives playback; a backgrounded tab stops it; reduced motion
  leaves the poster. A section may ship a loop *and* the four stills: the loop plays at
  ≥769px and the crops take over below it, which is
  [docs/art-direction.md](docs/art-direction.md) §4.2's rule and a legibility one rather
  than a bandwidth one — on a phone the copy is full-width and top-anchored, so a 16:9
  frame cropped to 9:16 reserves nothing.
- **The plates are rendered, not photographed.** `tools/plates/` builds all six from the
  briefs in art-direction §3 — WebGL scenes in the materials of §2.5, encoded to §4's
  targets, gated against §5.3 and §5.4 by `tools/plates/qa.mjs`. The reason to render
  rather than commission is that §2.2's chroma floor, §2.3's luminance ceiling and §2.7's
  dead zone can then be satisfied *in the shader* instead of measured afterwards: output
  is monochrome because shading resolves to one scalar, nothing reaches `chrome` because
  the grade rolls off asymptotically onto it, and the dead zone attenuates radiance before
  the grade so it contains no edges rather than merely no highlights.
- A full-bleed pending field still renders for any section with no asset — not a dashed
  box — so overlay contrast can be judged before the plate exists.

Every plate is briefed in [docs/art-direction.md](docs/art-direction.md), which owns the
dead-zone geometry, the luminance thresholds a plate must hold under the copy, and the
rule that no pixel in an asset may reach the accent's luminance.

---

## 6. Motion

**One authored moment: the hero.** The headline arrives a line at a time, each settling
out of a 10px blur while the field behind it is still resolving. Everything below the
fold uses `Reveal` and nothing else. If every section performed, none of them would land.

Underneath that, the headline **widens**: `wdth` runs 74 → 90 and `wght` 340 → 600 over
1100ms, so the type is drawn into place rather than revealed. This is the interactive
half of the opening and the reason the display face has to be variable. Transitioning
`font-variation-settings` re-lays-out text every frame, so it is scoped hard — three
short lines, `≥768px`, and `prefers-reduced-motion: no-preference` only.

`Reveal` is a 700ms rise out of a 5px blur on exponential ease-out. The blur is what
separates it from the stock fade-up: focus pulling in reads as something arriving,
where opacity alone reads as a stylesheet loading. It defaults to *visible*, so content
is readable if the observer never runs.

**The one perpetual motion on the page is the primary action's surface**, and it is
perpetual on purpose — see §2. With no hue marking the action, motion is half of what
identifies it, so the shader idles rather than waiting for a hover: 0.55 at rest, 1 on
hover or focus, 2.2 on press. Keyboard focus drives it identically to a pointer, or the
identification simply does not exist for anyone navigating by Tab.

Easing is `--ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)` and `--ease-out-soft`
`cubic-bezier(0.32, 0.72, 0, 1)`. Nothing uses `ease-in-out`, which reads mechanical
because it accelerates and decelerates in equal measure — real objects do not.

**Nothing rises as a promise.** Motion damps downward into place, never up. The eye
reads upward motion on a broker page as a claim about returns.

Buttons press: `active:scale-[0.98]`. A control that does not move under the finger is
a picture of a button.

Full `prefers-reduced-motion` fallback: the hero settle is skipped entirely, `Reveal`
attaches no observer, the media backdrop plays nothing, and the metal surface holds at
speed 0 — which stops its animation frame outright, so a static button costs nothing per
frame.

---

## 7. Surfaces

Shadows are tinted with the ink base, never neutral black. The reason is not warmth — the
ground is neutral now — it is that `#050505` *is* the page's black point. A pure `#000`
shadow sits below it, so instead of reading as an object casting into a room it reads as a
clipped hole punched through the surface it is meant to be resting on. `rgba(6, 6, 8, …)`
lands just above the ground and reads as falloff. Each shadow has an offset and a soft
blur; a zero-offset halo is decoration, not depth. `--shadow-lifted` and `--shadow-deep`,
used sparingly.

`.grain` lays a fixed, `pointer-events-none` noise field over the document at ~4%. A
page this dark is mostly one flat ink value, and flat ink at scale reads as absence
rather than as a surface. Fixed, never in a scrolling layer — noise inside a scroll
container repaints every frame.

`.rule-chrome` is a brushed-metal hairline for the top edge of a section.
`.surface-chrome` is a brushed panel. Both are restraint-dependent, and both are built
from `chrome` rather than `accent` for the reason in §2: an edge that reaches the accent's
luminance is no longer an edge, it is a second button.

---

## 8. Refused

Not style preferences — each of these was on the page and was removed for a reason.

- **Eyebrows and kickers.** See §3.
- **Gradient text.** Emphasis comes from size and the serif. A gradient on running text
  also destroys its measured contrast.
- **Nested cards.** A bordered box inside a bordered box. Cards are the lazy container;
  same-size cards of icon + heading + text as the page *structure* is the tell.
- **Icon-in-a-bordered-box tiles.** `grid place-items-center rounded-lg border` plus a
  1.5px lucide glyph appeared in six sections. It is a default, not a decision.
- **Symmetric three-column grids** as the answer to every list — pricing tiers,
  testimonials, safety pillars, onboarding steps all reached for it.
- **Zero-padded ordinals** (01 / 02 / 03) unless the sequence carries information the
  reader needs. Onboarding's steps and Learn's tracks earn them; FAQ questions do not.
- **Glass and blur behind legal text.** The contrast it yields depends on whatever is
  scrolling past. Disclosures sit on opaque rails.
- **Fabricated market data.** No prices, P&L, candlesticks or chart forms in any asset
  or mock. A rendered candlestick is invented market data.
- **Urgency mechanics**, countdowns, returns promises, wealth signalling, and imagery of
  people celebrating with money.

---

## 9. Placeholders are load-bearing

Every `[BRACKETED]` value on this page is an unverified compliance placeholder rendered
through `CopyText`, which flags it visibly. Registration codes, turnover figures,
ratings, activation SLAs, testimonial attributions. They are not lorem ipsum and they
must not be replaced with invented values — an unregistered segment displayed as
registered is a regulatory problem, not a copy problem.
