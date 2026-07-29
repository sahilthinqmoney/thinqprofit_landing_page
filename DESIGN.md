# ThinqProfit — visual system

Reference point: robinhood.com/us/en, studied for structure and mechanics, not for
appearance. What was taken is the *architecture* — full-bleed media with copy set on
top of it, art-directed line breaks, per-asset scrims, unequal section weight. What was
not taken is the look: Robinhood is acid lime on warm black with a Dutch old-style
serif. This is gold on ink with a high-contrast display serif, and it is aimed at a
different reader in a different market.

---

## 1. The concept: instrument

A broker's landing page has one job that no amount of styling substitutes for — making
a stranger believe you will not lose their money. Every decision below resolves to that.

**Gold is the working light, not the decoration.** It appears where an action is, and
nowhere else. On a page this dark, a single warm light source is what makes the surface
read as lit rather than as unlit. Spread across badges, borders, icons and headings it
would stop being light and become paint.

**Chrome is the machined edge.** Platinum hairlines mark where one surface meets
another. They are structural, not ornamental — a metallic edge on everything reads as
noise, and stops reading as precision.

**Ink is the room.** Warm near-black, `#0b0b0d`, not blue-black and not pure black.
Pure black is a hole; near-black is a surface. The warmth is what stops gold reading
muddy on it.

**The serif is the argument.** The product promise is *clarity* — "priced plainly, in
advance", "understand the trade before you place it". A high-contrast editorial serif
says considered and written; a geometric sans says software. The copy is the strongest
asset this page has, so the type gets out of its way and lets it sound like prose.

---

## 2. Colour

Every value was contrast-checked against the ink base. Ratios are on `--color-bg`.

| Token | Value | Ratio | Use |
|---|---|---|---|
| `bg` | `#0b0b0d` | — | the page |
| `surface` | `#141417` | — | raised bands |
| `surface-raised` | `#1c1c21` | — | panels, the mobile-app block |
| `fg` | `#f7f6f3` | 18.20 | headings, body on dark |
| `fg-muted` | `#a8a69f` | 8.07 | body copy, secondary, disclosures |
| `fg-subtle` | `#6e6c66` | 3.75 | **footer meta and legal fine print only** — never body |
| `border` | `#2a2a30` | — | panel edges |
| `border-soft` | `#1e1e23` | — | row rules, section hairlines |
| `accent` | `#d4af37` | 9.35 | the action. Gold. |
| `accent-hover` | `#e3c263` | — | hover |
| `accent-soft` | `#e8d9a8` | 13.97 | quiet accents, links |
| `on-accent` | `#0b0b0d` | 9.35 on gold | text on a gold fill |
| `chrome` | `#c8ccd4` | 12.21 | hairline highlights, metallic edges |
| `chrome-dim` | `#8a9099` | 6.11 | secondary marks |
| `gain` / `loss` | `#4ade80` / `#f87171` | — | **live market data only** |
| `warning` | `#f97316` | 7.02 | risk disclosures, pending-answer flags |

Three constraints shaped the set:

1. **A gold fill always carries ink text.** White on `#d4af37` is 2.10:1 and fails
   outright. `text-on-accent` exists so that mistake cannot be made by habit.
2. **Warning had to move off amber.** Brand gold sits at hue 46°, amber `#f59e0b` at
   38° — eight degrees apart, which the eye reads as one colour. A risk disclosure must
   never look like a call to action on a broker page. Warning is orange at hue 25°, a
   21° separation, and it always ships with an icon and a border so it is never
   signalled by hue alone.
3. **Gain and loss are quarantined.** They appear on no button, badge, link or
   illustration. A green CTA on a trading page is an implied promise.

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
  leaves the poster.
- Until real assets land, a full-bleed pending field renders in place — not a dashed
  box — so overlay contrast can be judged now.

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

Easing is `--ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)` and `--ease-out-soft`
`cubic-bezier(0.32, 0.72, 0, 1)`. Nothing uses `ease-in-out`, which reads mechanical
because it accelerates and decelerates in equal measure — real objects do not.

**Nothing rises as a promise.** Motion damps downward into place, never up. The eye
reads upward motion on a broker page as a claim about returns.

Buttons press: `active:scale-[0.98]`. A control that does not move under the finger is
a picture of a button.

Full `prefers-reduced-motion` fallback: the hero settle is skipped entirely, `Reveal`
attaches no observer, and the media backdrop plays nothing.

---

## 7. Surfaces

Shadows are tinted with the ink base, never neutral black — a pure-black shadow on a
warm ground reads as a grey smudge, where carrying the background hue makes an edge look
lit. Each has an offset and a soft blur; a zero-offset coloured halo is decoration, not
depth. `--shadow-lifted` and `--shadow-deep`, used sparingly.

`.grain` lays a fixed, `pointer-events-none` noise field over the document at ~4%. A
page this dark is mostly one flat ink value, and flat ink at scale reads as absence
rather than as a surface. Fixed, never in a scrolling layer — noise inside a scroll
container repaints every frame.

`.rule-chrome` is a brushed-metal hairline for the top edge of a section.
`.surface-chrome` is a brushed panel. Both are restraint-dependent.

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
