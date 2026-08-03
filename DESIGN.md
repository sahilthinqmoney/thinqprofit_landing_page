# ThinqProfit — visual system

Reference point: robinhood.com/us/en, studied for structure and mechanics, not for
appearance. What was taken is the *architecture* — full-bleed media with copy set on
top of it, art-directed line breaks, per-asset scrims, unequal section weight. What was
not taken is the look: Robinhood is acid lime on warm black with a Dutch old-style
serif. This is **copper metal on warm ink, set in IBM Plex** — the same family, and the
same accent, as the trading terminal this page sells. It is aimed at a different reader
in a different market, and unlike Robinhood the brand colour here is *not* the up-colour,
which is a cost paid deliberately and accounted for in §2.

---

## Inherited from the system design — not re-litigated here

The product's system design (`design-suite`, branch `wt/integrate`) is authority above
this document. Where it decides something, this page implements it and does not re-argue
it. What it decides:

| Inherited | From | What it fixes |
|---|---|---|
| The ground `#0A0808` and the accent `#FF9E7A` | `tokens.css` `--bg`, `--coral` | verbatim hexes, not approximations |
| `accent-hover` `#FFC0A6`, `on-accent` `#2E0F06` | `--coral-lt`, `--ink-on-accent` | verbatim |
| `gain` `#4CD6B0`, `loss` `#F0487F`, `warning` `#E8A13C` | `--up`, `--down`, `--warn` | the data triad, verbatim |
| The copper ramp — six stops, in this order | `logos.tsx` `METAL.coral` | `#A84A30 #FFD9C6 #FF9E7A #B4553A #FFC8B0 #C4674A` |
| Copper is *correct* for this surface | §07 Brand mark: *"chrome is the primary; **coral for brand surfaces where the accent leads**"* | the footer wordmark is not a deviation |
| The mark metal is neutral steel | §4 *Mark*, §39 dark row (`METAL.white`), §23 | see §2 — this is why `chrome` has no hue |
| One focus ring, one value, declared once | §40 | `--color-accent-hover`, page-wide |
| Every rendered size resolves to a named role | §45 | no raw px in a component |
| A metal reads by **two** highlights, span ≥ 4:1 | §17, §39 | the wordmark ramp's construction |
| IBM Plex Sans + IBM Plex Mono, one family two roles | §5 | see §3 |
| `cubic-bezier(.16, 1, .3, 1)` | `--e-smooth` | byte-identical to this page's `--ease-out-expo`, arrived at independently — the one decision the two surfaces already shared |

What does **not** transfer, and the reason each time:

- **The terminal's size scale.** `--t-display` is 19px. This is a marketing page; it keeps
  its own clamps (§3). What transfers is §45's *discipline*, not §45's numbers.
- **The terminal's density.** 7px inline gaps and 32px rows are a trading screen's
  spacing. §4 stands as written.
- **The accent budget's terminal setting.** §4 caps a *data* surface at three coral uses
  and lets a *brand* surface be loud. This is a brand surface. See §2 constraint 2.
- **The mark itself.** No ring-and-trail glyph on this page — the wordmark is the only
  metal object, which is what satisfies §07's one-accent-carrier rule.

---

## 1. The concept: instrument

A broker's landing page has one job that no amount of styling substitutes for — making
a stranger believe you will not lose their money. Every decision below resolves to that.

**The metal is the working light, not the decoration.** The brand surface is polished
copper. It appears where an action is, and on the mark, and nowhere else. On a page this
dark, a single live surface is what makes the room read as lit rather than as unlit.
Spread across badges, borders, icons and headings it would stop being light and become
paint — and under copper that failure is worse than it was under platinum, because paint
this saturated does not merely dilute the action, it *renames* it. §4's measured failure
in the terminal is the same mistake at a different density: raising the accent in response
to "I can't see the brand" put coral on twenty elements in one panel, and *an accent
marking twenty things ranks none of them*.

**The primary action wears the metal as an edge, not as a fill.** The shader fills the
control, a dark warm gradient core sits on top of it, and the 2px gap between them is the
ring you see. This is also, independently, what the system's own spec ships: a coral ring
at `rgba(255,158,122,0.6)` inset, a warm bloom at `rgba(255,158,122,0.4) 0 0 18px -6px`,
and a **white** label — not a coral fill. The button therefore survives the re-theme as a
change of values rather than a rebuild. Two reasons it is built that way.

The first is optical. Dispersion — the per-channel split that makes the surface read as
*chromatic* rather than as a coloured gradient — only exists at a highlight-to-shadow
boundary. A large flat field has almost none; measured through a half-strength `screen`
composite the split reaching the screen was about 1.6/255. Invisible. On a 2px ring, every
pixel is an edge.

The second is legibility, and it is the stronger one. A label on a moving metal fill has
to survive every frame of that animation, and the shader's pattern goes to a 0.100 dark
stripe regardless of the colours fed to it — so no choice of `u_colorTint` fixes it, and
three attempts to fix it that way failed. On a rim the label sits on the dark core
instead: white on the core's lightest stop `#211A17` is **17.15:1**, on its darkest
`#0C0908` **19.84:1**. **Contrast cannot be a property of an animation.** The community
component this derives from puts `#666666` on that core, which is 2.84:1 and fails AA
outright.

**The action is identified by HUE and MOTION. Copper is spent on the action and on the
mark, and on nothing else.** This supersedes the platinum rule — *"with no hue in the
brand, the action is separated by luminance and motion"* — and it is worth stating the
cost rather than only the gain, because the cost changes what the discipline is.

Under platinum the accent was the brightest value in the viewport: `#e7e9ee` at 16.78:1,
above every other surface on the page. `#FF9E7A` on `#0A0808` is **9.9166:1**, which puts
it *fourth*: below `fg` at 19.9782, below `fg-muted` at 13.2245, below `accent-soft` at
13.2208. So the old rule — *nothing else is this bright* — is simply false now, and a
rule that is false is worse than no rule, because the next reader enforces it.

The replacement: **only the action is saturated copper.** What enforces it is the chroma
ladder, and it is enforced by construction rather than by vigilance:

- `accent` is OKLCH chroma **0.1263** — the highest of any brand token, by a distance.
- The entire warm neutral axis sits under 13% of it: `fg-muted` 0.0078, `border-soft`
  0.0138, `border` 0.0165. Warm enough to be visibly on the same hue line, nowhere near
  saturated enough to be read as an action.
- The mark metal has *no* hue at all: `chrome` is 0.0057, **4.5%** of the accent's chroma
  and 114.76° away in hue — a **22.16×** chroma gap. (Both figures recomputed in the
  scratchpad from the contract's hexes. The settled contract quotes the hue gap as
  245.23°, which is the long way round the circle; the short arc is the one an eye takes,
  and it is the conservative number, so it is the one stated here.)
- The only three values on the page more saturated than the accent are `warning` 0.1404,
  `gain` 0.1312 and `loss` 0.2067. All three are quarantined to data and disclosure, and
  all three sit ≥ 30.76° away in hue. See §2.

So the discipline moved from a luminance ceiling to a chroma ceiling, and that is a
*better* rule to hold, because chroma is the channel a designer reaches for when a page
feels under-branded. §4 answers that reflex directly and this page adopts it verbatim:
**when the page feels under-branded, warm the neutrals — never raise the accent.** The
neutrals here are already warm by design (`surface` at chroma 0.0110, `border` at 0.0165,
`fg-muted` at 0.0078 on hue 48.64°); that is brand presence at zero cost to the signal.

**Chrome is the machined edge, and it is neutral steel.** Hairlines mark where one surface
meets another. They are structural, not ornamental — a metallic edge on everything reads
as noise and stops reading as precision. Under platinum, `chrome` and `accent` were the
same metal at two brightnesses and a deliberate luminance step kept them apart (9.16:1
against 16.78:1). **That gap is gone**: measured, `accent` Y 0.4712 against `chrome` Y
0.4249 is **1.1091×** — nothing. Luminance can no longer separate an edge from an action
whatever value chrome takes.

The obvious repair — make chrome a *brushed*, desaturated copper — was built and rejected,
because it puts the mark metal 1.57° from the accent's hue and then asks chroma alone to
carry a distinction that four rank-1 citations say must not rest on chroma alone. §4:
*"the silver/platinum metal ramp… cool mark against warm interface. The cool/warm split is
what keeps the mark legible against coral chrome instead of dissolving into it."* §39's
dark row is `METAL.white`, *"neutral steel, r=g=b at every stop, chromaticSpread 0."* §23:
*"a warm mark beside live data sits in the same family as the accent it must not be
mistaken for."* Neutral steel restores **two** channels at once — 114.76° of hue and a
22.16× chroma gap — where brushed copper offered 1.57° and 4.22×.

The `+4` on blue (`#AEAEB2`, not a pure `#AEAEAE`) is the spec's own `METAL.white`
treatment literally — `#6E6E72`, `#8C8C90`, `#B6B6BA` all run B−R = 4 — because absolute
neutral beside a large copper field picks up a cool cast by simultaneous contrast, and the
ramp compensates rather than pretending it does not.

**Ink is the room.** `#0A0808` — warm near-black, taken from the system verbatim. Pure
black is a hole; near-black is a surface with a light on it, which is what polished metal
needs to sit on. It is warm rather than neutral, and the previous document argued the
exact opposite — *"a warm ground under a neutral alloy tints the metal yellow, which is
precisely the look being removed."* That sentence was true of a neutral alloy and is dead
with it. The metal is copper now; a warm ground is what it is lit against, and measured,
the ground is already warm on its own terms: chroma 0.0038 at hue 17.62°. That number is
why a chroma-0 grey reads *cool* on this page, and it is the reason every neutral in §2 is
warm-composited rather than carried across.

**One type family, three voices.** The display face is IBM Plex Sans, because low
contrast, even colour and closed apertures are the language of infrastructure — wayfinding,
instrument panels, timetables, technical documentation — and a broker is infrastructure,
not fashion. That argument is unchanged; only the face carrying it moved, and it moved
*into* the tradition rather than out of it. The page's one editorial serif is gone with
Newsreader; what marks the closing statement now is an inversion of the display voice
inside the same family, argued in §3. The copy is the strongest asset this page has, so
the type gets out of its way and lets it sound like prose.

---

## 2. Colour

Every value was contrast-checked against the ink base, computed rather than estimated.
Ratios are on `--color-bg` `#0A0808`, and **only** on it — the previous table's numbers
were measured against `#050505` and every one of them is now wrong by 1–2%, which is
exactly the size of error that survives a review. `src/index.css` is the contract; this
table is its documentation and must be kept in step with it.

| Token | Value | on `bg` | on `surface` | on `surface-raised` | Chroma | Hue | Use |
|---|---|---|---|---|---|---|---|
| `bg` | `#0A0808` | — | 1.0522 | 1.1301 | 0.0038 | 17.62° | the page |
| `surface` | `#150F0D` | 1.0522 | — | 1.0740 | 0.0110 | 39.26° | raised bands, nav panels, `.card` fill |
| `surface-raised` | `#1E1714` | 1.1301 | 1.0740 | — | 0.0128 | 44.47° | hover fills: nav rows, social circles, secondary button |
| `fg` | `#FFFFFF` | **19.9782** | 18.9869 | 17.6788 | 0 | — | headings, primary body, the rim button's label |
| `fg-muted` | `#D7D1CE` | **13.2245** | 12.5683 | 11.7024 | 0.0078 | 48.64° | all body copy and every disclosure |
| `fg-subtle` | `#8A827F` | **5.3087** | 5.0452 | 4.6977 | 0.0107 | 41.83° | footer meta, legal fine print, media fine print |
| `border` | `#352B27` | 1.4520 | 1.3799 | 1.2848 | 0.0165 | 42.98° | panel edges, structural rules |
| `border-soft` | `#251D1A` | 1.2076 | 1.1476 | 1.0686 | 0.0138 | 41.61° | section hairlines, row rules |
| `accent` | `#FF9E7A` | **9.9166** | 9.4245 | 8.7752 | **0.1263** | 41.03° | **the action** — the rim ring, the copper ramp, the solid fill |
| `accent-hover` | `#FFC0A6` | 12.6933 | 12.0634 | 11.2323 | 0.0811 | 43.44° | primary fill hover **and the page's one focus ring** |
| `accent-soft` | `#FDC6B2` | **13.2208** | 12.5648 | 11.6992 | 0.0689 | 40.91° | inline links in running text |
| `on-accent` | `#2E0F06` | 1.1294 | 1.0733 | 1.0006 | 0.0541 | 37.69° | ink on a genuinely **solid** accent fill |
| `chrome` | `#AEAEB2` | 9.0349 | 8.5866 | 7.9950 | 0.0057 | 286.26° | mark tiles, machined edges, `.rule-chrome`, canvases |
| `chrome-dim` | `#7B7B7F` | 4.7394 | 4.5043 | 4.1939 | 0.0060 | 286.21° | the secondary button's hover border. **Never text.** |
| `gain` | `#4CD6B0` | 10.9907 | 10.4454 | 9.7257 | 0.1312 | 171.15° | **live market data only** |
| `loss` | `#F0487F` | 5.6495 | 5.3692 | 4.9993 | 0.2067 | 5.17° | **live market data only** |
| `warning` | `#E8A13C` | 9.1275 | 8.6746 | 8.0770 | 0.1404 | 71.79° | risk disclosures, `[BRACKETED]` placeholders |

Five measurement notes, because each is a place where a plausible number is the wrong one:

- **Nothing was carried across.** `#cfcfcf` on the new ground measures **12.8234:1** and
  fails the ≥13:1 floor the muted role is declared at; `#7e7e7e` measures **4.9210:1** and
  fails 5:1. Both had to be re-solved, not re-labelled. `fg-muted` is solved to 13.2245
  rather than a bare 13.0 so it does not sit on a rounding boundary.
- **`fg-subtle` is solved against `surface-raised`, not against `bg`.** It is *declared*
  for legal fine print, so the declaration has to stay true wherever the fine print lands.
  At 5.3087:1 on `bg` it is still **4.6977:1** on `surface-raised` — over 4.5. The old
  value cleared the floor on `bg` and failed it on a raised band, which meant the token's
  own role statement was conditional on where it was used.
- **Two raw white alphas were text, and now are not.** `text-white/55` composites to
  `#919090` (6.2750:1, chroma 0.0012) and `text-white/65` to `#A9A9A9` (8.5003:1, chroma
  0.0000) — dead-neutral greys in the two slots most likely to be read directly beside
  `fg-muted` at chroma 0.0078. That is the cool-grey-on-warm-ink defect the palette moved
  to avoid. Both route to `fg-subtle`: a real drop, 6.28 → 5.31 and 8.50 → 5.31, stated
  rather than glossed, and both still clear 4.5:1 at 13px and 14px. The second reason is
  the one the deck already uses: an alpha's contrast depends on whatever scrim it lands
  on, and both of these sit over media plates.
- **`accent-soft` is derived, not picked.** The rule is *the accent's hue at the body
  copy's luminance*: 13.2208:1 against `fg-muted`'s 13.2245:1 is parity to 0.004, hue
  40.91° is 0.12° off the accent, chroma 0.0689 is 54.6% of it. So an inline link is
  separated from the sentence around it by **hue alone** — which is precisely what copper
  bought and platinum could not do. A dim was measured and rejected: at `#C9927E` a link
  is 7.5121:1 inside body copy at 13.2245:1, a 1.87× luminance drop, so every link would
  recede from its own prose. **`accent-soft` is a lift, not a dim.**
- **`chrome-dim` carries no text anywhere.** Audited rather than assumed: its only live
  call site is the secondary button's hover *border*. As a boundary the pairing that
  actually renders is against the `surface-raised` fill set in the same declaration —
  **4.1939:1** — and against the `border` it replaces on hover, **3.2642:1**. Both clear
  WCAG 1.4.11's 3:1. It is held at 4.7394:1 on `bg` anyway, because a previous pass lifted
  it off `#6f757f` to clear the text floor and that intent is worth honouring even where
  the floor does not formally apply.

Four constraints shaped the set:

**1. A genuinely SOLID accent fill always carries ink; a rim carries white.** These are
not in tension, and reading them as one rule is the mistake to avoid. White on `#FF9E7A`
is **2.0146:1** — not a marginal failure, an unreadable label — so `text-on-accent` exists
so that mistake cannot be made by habit: `#2E0F06` measures **8.7807:1** on the accent and
**11.2393:1** on `accent-hover`. That covers `::selection`, the skip link and the
`primary` button variant's flat fallback fill. The system's §4 rule 4 says the opposite —
*"button labels are white, not accent — the ring already marks the control"* — and it is
also right, because the control it describes is a 14%-alpha tint with a ring, where the
label sits on a dark backdrop. This page's rim button **is** that construction, and its
label is white on the dark core. One rule, stated once: *the label's colour is a property
of what is behind the label*, and the accent is behind it only in the flat no-shader
fallback. `::selection`'s guarantee halves in the move, 16.78:1 → 8.78:1, and the number
in the stylesheet says so.

**2. The accent budget, from §4 — and this page is a brand surface.** The previous
constraint here read *"hue is now reserved entirely for meaning; nothing in the brand is
coloured."* That is now the single most dangerous sentence this document could carry: the
brand is the most saturated thing on the page. It is replaced by the system's own rule,
which is a budget rather than a prohibition:

> | Surface | Coral |
> |---|---|
> | website · splash · login · app icon · onboarding · decks | **loud — recognition is the job** |
> | empty workspace | present — nothing to compete with |
> | chain · positions · chart · any dense surface | **three uses only** |
>
> — system `DESIGN.md` §4, *Accent budget*

A website is on the top row. The spec's §07 Brand mark row says the same thing about the
metal specifically: *"chrome is the primary; **coral for brand surfaces where the accent
leads**"*, and it ships a `coral · brand surfaces` mark row at 64/32/22/16 plus the lockup,
with coral as the first tile in the `animated · display only` row. **Copper on this page
is the system's prescription for it, not a deviation from it.**

"Loud" is not "everywhere", and the boundary is §4's rule 1, which outranks preference:
*the accent means "you can act on this" — never body copy, never headings, never metadata,
never data.* So the budget resolves to exactly two carriers on this page — **the primary
action and the footer wordmark** — and they cannot collide, because there is no mark glyph
in the nav to compete with the wordmark. That is §07's one-accent-carrier rule satisfied
by construction rather than by discipline.

**3. `warning` still ships with an icon and a border, and that is load-bearing.** It is no
longer defending against a collision with gold; it is defending against the accent, which
is now its nearest chromatic neighbour at **30.76°**, and against `loss` at 66.62°. Three
numbers that were in this file and in the stylesheet were wrong and are corrected here:
the accent is at 41.03° (not ~16°), the outgoing `#f97316` was at 47.60° (not ~25°, and
therefore **6.57° off the accent** rather than sitting between it and red), and this token
is at 71.79° (not ~35°). `warning` also carries read text — the `[BRACKETED]` placeholders
— so hue is never the sole signal on a disclosure.

**4. Gain and loss are quarantined.** They appear on no button, badge, link or
illustration — §4 rule 2, and grep confirms zero `text-`/`bg-`/`border-gain` and `-loss`
call sites in `src`, so the rule is currently kept by construction rather than by review.
A green CTA on a trading page is an implied promise.

### The rose is a condition of choosing coral, not a preference

`loss` moves from `#f87171` to `#F0487F`, and it would move even if no `loss` call site
existed on this page today — which is the case. The system states it as a condition on
the accent itself (§4 condition 1), and the hue angles are why:

| | hue | Δ from `accent` 41.03° |
|---|---|---|
| outgoing `loss` `#f87171` | 22.22° | **18.81°** |
| new `loss` `#F0487F` | 5.17° | **35.86°** |

18.81° is inside the range where a falling price and an actionable control are the same
colour to a glancing eye — the system measured 12° between a coral position badge and a
bid chip on a live option chain and called it unusable. 35.86° clears it, and matches
§22's 36° row. The rose is expensive: it is a *semantic* colour spent to protect a *brand*
colour, and the system says so plainly. It also cannot be bought more cheaply by pushing
the red further, because coral lives in the red-orange region and pushing further turns
the red pink — so past this point the separation is carried by lightness and chroma
(0.2067 against the accent's 0.1263) and it survives only at full strength, **never as a
tint**. `#F0487F` measures 5.6495:1 on the ground, so it clears 4.5:1 as text.

The two green/red rules survive intact and are restated because they are the reason the
rose is affordable at all: direction never rests on hue alone (▲▼ plus sign, everywhere),
and red and green belong to data only.

### The primary action

The rule, stated once so it can be cited: **the primary action carries the only saturated
copper in the viewport and is the only surface that moves.** Everything else is a
consequence.

Note *edge*, not *surface*. An earlier draft said the action was the brightest surface,
which described a bright metal pill; it is now doubly wrong, because the action is neither
the brightest nor a fill. It is a dark warm core with a saturated chromatic ring — see §1.
What is reserved is the saturated **2px**, not the largest coloured area.

- `accent` is not shared. A badge, a chip, an active nav state or an icon that reaches
  `#FF9E7A` is competing with the button at its own game. Quiet accents take `accent-soft`
  (13.2208:1, and it is a link colour, not a decoration); machined marks take `chrome`
  (9.0349:1), which has no hue at all.
- `LiquidMetalSurface` takes a `blend` prop with two modes, and they exist for opposite
  reasons. `rim` runs the shader at full strength composited `overlay` onto the
  `.surface-copper` ramp beneath it — the ring is thin, and the ramp underneath is where
  the hue actually comes from, so the shader supplies modelling and the CSS supplies
  colour. `screen` runs it at 50% over a flat `accent` fill, where screen's inability to
  darken makes that fill a guaranteed contrast floor — that mode is for any future surface
  where text sits *on* the metal, and its ink figure is 8.7807:1. The button uses `rim`;
  its label sits on the dark core and never touches the shader.
- **A flat coral wash at `mix-blend-mode: color` was evaluated and rejected**, and the
  reason is the mirror image of one this codebase already holds. `LiquidMetalSurface`
  refuses `mix-blend-luminosity` because it would discard the shader's per-channel split,
  which is the chromatic half of a chromatic theme; `color` = `SetLum(Cs, Lum(Cb))`
  discards exactly the same split from the other side — hue and chroma come from a flat
  wash and only luma survives from the shader. Three measured losses: the rim's hue stops
  travelling (under `overlay` it runs the ramp's own **36.35°** at the dim stop to
  **48.15°** at the specular, which is what a coloured metal does from shadow to
  highlight — a flat wash has one hue); §17's two highlights come from the ramp beneath
  and a flat wash has none; and a refused WebGL context would paint the button as solid
  opaque coral instead of degrading to a static polished ring.
- It degrades three ways and all three stay legible: `prefers-reduced-motion` sets shader
  speed to 0 (the surface still renders as metal, it just stops moving), a refused WebGL
  context falls back to the static `.surface-copper` ring, and `metal={false}` opts a
  primary action out by hand. The fallback ring's boundary against the dark core is the
  ramp itself — worst case the dim `#A84A30` against the light core stop at **3.0104:1**,
  best the specular `#FFD9C6` against the dark stop at **15.1128:1** — so it clears WCAG
  1.4.11's 3:1 at every stop, where an unpainted wrapper gave ~1.02:1.

### The rim core is warm, and that is not cosmetic

The core is `linear-gradient(180deg, #211A17 0%, #0C0908 100%)`. It was blue-black
(`#1c1c22` → `#08080c`, B−R of +6 and +4), and a cool patch is most visible exactly where
it is ringed by the accent and sitting on a warm ground. White on the warmed stops measures
**17.15:1** and **19.84:1** (the file previously carried 17.0 and 19.9, measured on the
cool pair). This is the same correction applied to `surface`, `border` and the white
alphas, and it is the one place where getting it wrong is framed by copper on all four
sides.

### The WebGL context ceiling is a hard budget

Each `LiquidMetalSurface` mounts its own WebGL context. Browsers cap live contexts —
Chrome at roughly 16 — and when the cap is passed they **silently drop the oldest**. No
exception, no console error, just buttons at the top of the scroll quietly reverting to
flat fills while the ones at the bottom animate.

Counted on the mounted tree: `Hero`, `Platform`, `FinalCta` and `Navbar`'s desktop rail
each take the default `primary`, `Products` renders one per featured product (two today,
from `featuredProductIds`), and `Navbar`'s drawer declares one more. That is **six
simultaneous contexts on a desktop pass and seven with the drawer open**, against a
ceiling of sixteen. `Terminal` and the drawer's first action are `secondary`, and
`Navbar`'s rail carries one `ghost` — those cost nothing.

So the count is a budget, not an aesthetic preference:

- **Adding a metal button anywhere new has to be paid for**, either by `metal={false}` on
  an existing one or by demoting it to `secondary`.
- **A third featured product** in `featuredProductIds` costs one context per instance.
- **Anything that mounts a shader inside a list or a map is out of the question.** The
  failure is invisible in development, where the page is scrolled once from the top.
- The design argument points the same way, and §4's budget is the sharper form of it: a
  live metal surface is the loudest thing this page can do, and an accent marking
  everything ranks nothing.

---

## 3. Type

**IBM Plex Sans for everything, IBM Plex Mono for every numeral.** One family, and the
same family the terminal is set in. Both self-hosted from `@fontsource-variable/ibm-plex-sans`
and `@fontsource/ibm-plex-mono` — no Google Fonts link, no preconnects, no network
dependency in the critical path.

### What carries over from the Archivo argument, and what does not

**The argument survives; the provenance does not.** High-contrast serifs — hairline
strokes against thick stems — are the visual language of fashion, beauty and luxury goods.
Low contrast, even colour and closed apertures are the language of infrastructure. A
broker is infrastructure. An early pass used Instrument Serif, a Didone; at 76px it was
selling perfume rather than custody of your shares. **All of that is unchanged.**

What does not carry: Archivo comes out of the *newspaper and signage* tradition, and that
specific sentence has to go with it. IBM Plex was drawn as a corporate typeface for an
engineering company, for interfaces, documentation and machine output — a neighbouring
room in the same building, not the same room. If anything the register is closer to what
this page is: signage is read at a glance from ten metres, and this page is read at
arm's length by somebody deciding where to keep their money. Plex's skeleton is quiet in
the same way Archivo's was, which is what keeps it premium at display size — faces with
personality in the letterforms turn cartoonish the moment they get large, because the
quirk scales with the type.

The system adds a reason that outranks taste and that this page inherits rather than
re-argues (§5): **Plex has a Devanagari companion drawn in-family**, so India-first
regional expansion is a font subset rather than a re-typesetting project. Nothing about
Archivo or Instrument Sans offered that.

### What holds display apart from body, now that there is one family

The previous system held two grotesks apart by width — Archivo at `wdth 90` above
Instrument Sans at 100 — and that job is gone. It cannot be replaced by width alone
either, and that is a measurement rather than an opinion: Plex at `82/600` and Plex at
`100/400` set the same string within **3.8%** of each other, because weight buys back what
condensation removes. Three things do the work instead, in order of how much they do:

1. **Weight — 600 against 400**, a third of Plex's 100–700 axis, and the primary separator
   now.
2. **Proportion — at `wdth 82 / wght 600` the `n` advances 547.6/em against the body's
   568.0** while carrying 50% more weight. Narrower *and* heavier appears nowhere in the
   body scale, so the combination is unambiguous even where the sizes are close.
3. **Tracking — `-0.028em` against 0**, which removes 1.12em of space from a 40-glyph
   line.

And the page gains a register it did not have. With Plex Mono on every figure it is one
family in **three voices** — condensed-heavy display, normal-regular prose, monospaced
data. That is §5's *"one family, two roles"* plus a display cut, which is more discipline
than the two-grotesk arrangement had, not less.

### The width axis survives, and the way it is loaded is a trap

The brief this change was written against stated that IBM Plex Sans Variable has no width
axis and that the hero's settle would have to be rebuilt or dropped. **That is wrong, and
the reason it is a plausible mistake is the reason to write it down.**
`@fontsource-variable/ibm-plex-sans`'s default entry (`index.css`) is the **weight-only**
build: `font-weight: 100 700`, no `font-stretch`. Import the bare package name and you get
a face with no width axis, and every `'wdth'` setting on the page silently does nothing.
The axis exists only in `wdth.css` — `font-stretch: 75% 100%` alongside `font-weight: 100
700` — verified in the package's own `metadata.json` and in the built stylesheets. So the
import is `@fontsource-variable/ibm-plex-sans/wdth.css`, deliberately, and it is the kind
of thing that fails silently and looks like a design decision.

`font-synthesis: none` stays. There is no italic build and grep confirms zero italic call
sites.

### `.display` — `wdth 82`, `wght 600`, `-0.028em`, `text-wrap: balance`

Archivo's `90 / -0.035em` was carried over first and measured, then rejected. *"Your
market."* at 120px sets **638.3px** in Plex `90/600/-0.035` against Archivo's **585.3px**
— +9.0%, and at 120px that track closes Plex's horizontally-cut apertures. At
`82/600/-0.028` the same line is **626.8px**, +7.1%. Plex is simply wider: even at its 75
floor with `-0.032em` it sets 602.2px, still +2.9%. **Archivo's line length is not
reproducible at any setting on this face**, so 7.1% is the accepted price, and the tracking
is loosened rather than tightened because the apertures are what the size is buying.

The metrics that explain it, measured headless against the real `woff2` at 1000px, per
mille:

| | IBM Plex Sans | Instrument Sans |
|---|---|---|
| x-height | 516 | 510 |
| cap height | 698 | 720 |
| x / cap | **0.739** | 0.708 |
| lowercase advance | 504.3 | 522.7 |

So the common claim that "Plex has a bigger x-height" is technically right and practically
irrelevant — 1.2% is nothing. What actually changes is x-height *relative to caps*, and
that caps are **3.1% shorter**, so an all-caps micro-label reads slightly smaller at the
same px. Font box (hhea ascent + descent) is **1.300em** against Archivo's 1.088em, which
matters exactly once, in the footer wordmark below.

One heading re-rags on the face change and it was found by measuring, not by looking:
`Terminal`'s H2 sets 584.4px on line 1 in Archivo and **621.7px** in Plex, against
`FocusPull`'s `max-w-[38em]` = 608px — three lines instead of two. Plex only fits 608px at
`wdth ≤ 77`, which would spend the entire settle. So the **measure** moves rather than the
axis: `SectionShell`'s `FocusPull` goes to `max-w-[40em]` (640px) and the deck below takes
its own `max-w-[38em]`, so only the heading gains 32px. Verified inert elsewhere — at both
608px and 640px, Products and Safety hold the same two-line rags they had in Archivo.

### The hero settle, and its honest cost

`.display-settling` starts at `wdth 75, wght 250` and settles to `82/600` over the existing
1100ms `ease-out-expo`. 75 is not a compromise value; it is Plex's real condensed master,
and `wdth` is a percentage of normal width by specification, so Archivo 74 and Plex 75 are
the same instruction rather than a coincidence of numbers.

The cost, measured: *"Your market."* travels **565.1px → 626.8px (+10.9%)** where Archivo
travelled **465.6px → 585.3px (+25.7%)**. The settle is **43% of the gesture it was.** That
is the honest price of a 25-unit width axis against a 63-unit one, and the weight axis
compensates as far as it can — 250 → 600 is 58% of Plex's range, where Archivo's 340 → 600
was 32.5% of its. **Do not make up the difference with `transform: scaleX()`**: it distorts
the stems and is worse than not animating.

### The serif moment is gone, and `.display-quiet` replaced it

Newsreader is deleted along with `--font-serif`. `.display-serif` is renamed
**`.display-quiet`** and `MediaSection`'s `voice="serif"` becomes `voice="quiet"` — a class
named `display-serif` that sets no serif is exactly the falsified rationale this codebase
bans.

`font-variation-settings: 'wdth' 100, 'wght' 300; letter-spacing: 0.01em; line-height: 1.24`.

The argument, and it is the one the brief asked to have made rather than assumed: the
page's display voice is **defined by three moves** — condense, weight up, track in. The
closing statement inverts all three at once, in the same family, at the opposite corner of
it. Wide where the page is narrow, light where it is heavy, open where it is tight. A
serif used once was a change of register; this is a change of register too, and it is one
the reader can attribute to a decision rather than to a second font loading.

Measured, it does not re-rag: *"Start with what / you have today"* at 56px sets two lines of
**374.0 / 370.5px** against Newsreader's 381.5 / 377.6px — the same break, inside the copy
column at every width tested (504 / 576 / 608px). The block grows 18px because 1.24 leading
replaces 1.08, and that is the whole layout consequence.

### Every numeral is IBM Plex Mono

`.tabular` is redefined as `font-family: var(--font-mono); font-variant-numeric:
tabular-nums lining-nums; font-feature-settings: 'tnum'`. That is the system's §5 rule —
*"every numeral is `tabular-nums lining-nums`; digits must never reflow"* — and the system's
reason for the mono existing at all: **it is the only face doing something Sans cannot**,
which is holding a column of figures on a grid.

It covers every live figure site with no component edit: `CopyText`'s `[BRACKETED]`
placeholders, `TrustStrip`'s registration codes, and the footer's © year.

What makes the swap free rather than a layout change: **Plex Sans's `0` advances 600/em at
`wdth 100` and is constant across weights 300/400/600, and Plex Mono's advance is also
exactly 600/em.** A figure moving from Sans to Mono at full width moves by zero.

Three caveats, written down rather than discovered later:

- Mono costs **+19% on letters** (600/em against Plex Sans's 504.3/em lowercase). `.tabular`
  belongs on figures and codes, never on prose containing a figure — which is also why no
  `[BRACKETED]` copy needs rewrapping.
- At `wdth < 100` Plex Sans's `0` shrinks to 576/em at 90 and 540/em at 75, so a figure
  inside `.display` *would* move if it were switched. None exists today.
- The mono is imported at `latin-400` only, so with `font-synthesis: none` a `.tabular`
  under a non-400 ancestor would silently render 400. All live sites inherit 400. That is a
  constraint on future use, not a defect today.

### Measure is `em`, never `ch`

`ch` is the `0` advance and it is therefore a property of the face, which makes it a
booby-trap on a font change. Measured in-browser, **60ch is 639.36px in Instrument Sans
(0.666em) and 576px in Plex (0.6em) — a 9.9% collapse**, while the sentences themselves
only shrink 3.5%. Rendered: Safety's custody line sets 637.6px in Instrument and 626.7px in
Plex; it fits one line in a 639.4px box and breaks to two in a 576px box, orphaning *"your
name."* So every `ch` cap converts to `em` at today's rendered px — `60ch → 40em`,
`56ch → 37.3em`, `76ch → 50.6em`. The measure expressed in lowercase characters grows 3.5%,
which is the entire intended effect of the change.

The same rule already applied to headlines and applies for the same reason: a headline
breaks in the same place at every breakpoint instead of re-ragging as the clamp resizes it.

### Leading does not change, and that is a measurement

To hold the same x-height-to-leading ratio, the deck's 1.6 would need 1.619; the ink-span
argument gives 1.626. Both are below the smallest step this page expresses, so nothing
moves. The deck does not re-rag either: at 17px in the 608px measure the opening deck
sentence breaks in exactly the same place, 594.7 / 274.9px in Instrument against 585.1 /
274.5px in Plex.

### The scale, and §45

Steps, set on `MediaSection` and exported from `SectionShell`:

| Step | Size | Leading |
|---|---|---|
| `hero` | `clamp(3.25rem, 8vw, 7.5rem)` | 0.98 |
| `epic` | `clamp(3rem, 7vw, 5.75rem)` | 1.00 |
| `tall` | `clamp(2.75rem, 5.4vw, 4.5rem)` | 1.04 |
| `mid` | `clamp(2.5rem, 4.6vw, 3.75rem)` | 1.06 |
| `short` | `clamp(2.25rem, 3.8vw, 3.25rem)` | 1.08 |

Leading opens as the size drops: a grotesk this tight needs air at 2.25rem that it does not
need at 5.75rem, where the line length itself does the separating. `SectionShell` carries
its own three steps — `lead`, `standard`, `minor` — so a lead section and a minor one stop
rendering at the identical clamp.

`hero` is new and its values are not. The largest type on the page resolved to no named
role: `Hero` set its clamp inline, and `Platform` hand-wrote a second one while its own
comment claimed it matched `SCALE.lead`. §45 says every rendered size must name a role, so
the clamp got a name and both call sites reference it. Nothing renders differently; that is
the point of doing it as part of a type change rather than as a redesign.

**One body size on the whole page: 16px.** Hierarchy comes from the display scale, not from
five sizes of running text.

**Headlines carry their own line breaks.** A `\n` in a heading string is an art direction,
honoured at ≥768px and ignored below it. Balanced line lengths are chosen, not inherited
from whatever width the viewport happens to be.

### There is no eyebrow

A category label above a heading — "Pricing" over "Priced plainly, in advance" — is
decoration in the costume of information. The heading already says what the section is; the
label survives only because it is easy to add. The prop was removed from both
`SectionShell` and `MediaSection` so it cannot come back by reflex. The hero's former
kicker repeated the trust strip directly beneath it word for word, and went with them.

---

## 4. Space and rhythm

Container caps at 1760px with gutters `px-5 / sm:6 / lg:8 / xl:12`. Full-bleed sections
sit **outside** Container and re-impose that cap on their copy alone.

Sections are full-screen — `min-h-svh`, content vertically centred. `svh` rather than
`vh` so mobile browser chrome does not push a section past the fold, and `min-` rather
than a fixed height so content-heavy sections grow instead of clipping. TrustStrip opts
out: it is punctuation between sections, and a full screen around five registration codes
is a screen of nothing.

The hero subtracts `--header-stack` from its height. At a plain `100svh` the announcement
bar and nav push the mandatory risk disclosure off the first screen, and copy deck §3
requires it *in* the first viewport, not merely on the page.

More space above a heading than below it. Tight groups, generous separation.

The system's spacing scale is deliberately **not** imported. 7px inline gaps and 32px rows
are terminal density; on a marketing page they would read as a settings dialog. What is
taken from it is the radius ladder (4 / 8 / 12 / 999), the motion curves and durations, and
the accent bloom — see §6.

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
- **The plates are rendered, not photographed.** `tools/plates/` builds them from the
  briefs in art-direction §3 — WebGL scenes, encoded to §4's targets, gated against §5.3
  and §5.4 by `tools/plates/qa.mjs`. The reason to render rather than commission is that
  the chroma, luminance and dead-zone constraints can then be satisfied *in the shader*
  instead of measured afterwards.
- A full-bleed pending field still renders for any section with no asset — not a dashed
  box — so overlay contrast can be judged before the plate exists.

**The plate rule moved with the accent, and it moved in both channels.** It used to read
*no pixel in an asset may reach the accent's luminance*, and it was a workable rule while
the accent was `#e7e9ee` at OKLCH L 0.9339 — nothing short of a blown highlight got near
it. `#FF9E7A` is at L 0.7904 / Y 0.4712, mid-field, so as a pure luminance ceiling that
rule now bans ordinary highlights on an ordinary plate. The replacement is the same shape
as §1's: **the ceiling that matters is chroma.** A plate may not reach the accent's chroma
of 0.1263, and it is safe by construction rather than by inspection, because the plates
are **monochrome** — shading resolves to one scalar, so the chroma channel is empty before
the grade is applied. The luminance constraint stays as a *composition* constraint (a plate
must not put a highlight under the copy) rather than as a brand-collision one.

`docs/art-direction.md` still carries the old form of this rule and the old accent
figures; it is outside this change's file ownership and is flagged rather than edited.

---

## 6. Motion

**One authored moment: the hero.** The headline arrives a line at a time, each settling
out of a 10px blur while the field behind it is still resolving. Everything below the
fold uses `Reveal` and nothing else. If every section performed, none of them would land.

Underneath that, the headline **widens**: `wdth` runs 75 → 82 and `wght` 250 → 600 over
1100ms, so the type is drawn into place rather than revealed. This is the interactive half
of the opening and the reason the display face has to be variable — and, per §3, the reason
the `wdth.css` entry point is imported rather than the package default. Transitioning
`font-variation-settings` re-lays-out text every frame, so it is scoped hard — three short
lines, `≥768px`, and `prefers-reduced-motion: no-preference` only.

`Reveal` is a 700ms rise out of a 5px blur on exponential ease-out. The blur is what
separates it from the stock fade-up: focus pulling in reads as something arriving,
where opacity alone reads as a stylesheet loading. It defaults to *visible*, so content
is readable if the observer never runs.

**The one perpetual motion on the page is the primary action's surface**, and it is
perpetual on purpose — see §2. Hue and motion together identify the action, and motion is
the half that survives being glanced at in peripheral vision, so the shader idles rather
than waiting for a hover: 0.55 at rest, 1 on hover or focus, 2.2 on press. Keyboard focus
drives it identically to a pointer, or the identification simply does not exist for anyone
navigating by Tab.

Easing is `--ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)` and `--ease-out-soft`
`cubic-bezier(0.32, 0.72, 0, 1)`. Nothing uses `ease-in-out`, which reads mechanical
because it accelerates and decelerates in equal measure — real objects do not. The first of
those is byte-identical to the system's `--e-smooth`; the two surfaces reached it
independently, which is the one thing in this document that needed no reconciliation.

**Nothing rises as a promise.** Motion damps downward into place, never up. The eye
reads upward motion on a broker page as a claim about returns.

Buttons press: `active:scale-[0.98]`. A control that does not move under the finger is
a picture of a button.

Full `prefers-reduced-motion` fallback: the hero settle is skipped entirely, `Reveal`
attaches no observer, the media backdrop plays nothing, and the metal surface holds at
speed 0 — which stops its animation frame outright, so a static button costs nothing per
frame. The wordmark's sweep holds too, at a background position chosen so both highlights
and the valley stay in frame (§7).

---

## 7. Surfaces

### Shadows are neutral black, and the reason is not the one that used to be written here

**A shadow is an absence of light, not an inversion of the palette.** It is black on a dark
ground and black on a light one; the system states this as a rule that does not invert
across themes, and this page adopts it.

The previous argument here was that shadows should be *tinted with the ink base* because
`#050505` was the page's black point and a pure `#000` shadow would sit below it and read
as a punched hole. The ground has moved up: `#0A0808` has relative luminance 0.002557
against `#050505`'s 0.001518, and measures 1.0511:1 against pure black where the old ground
measured 1.0304:1. There is room under it now. A later pass wrote the opposite argument —
that shadows are black *because the ground has no hue* — and that reason is dead on arrival
here, since the ground's chroma is 0.0038 at hue 17.62°. The conclusion is the same and
both stated reasons were wrong, so the surviving one is the structural one: tinting a
shadow with the ground's own copper would make the accent's hue *structural*, which §4's
budget forbids, and it would put brand colour in the one place on the page that is supposed
to represent nothing at all.

Each shadow has an offset and a soft blur; a zero-offset halo is decoration, not depth.
`--shadow-lifted` and `--shadow-deep`, used sparingly. The accent bloom
(`0 0 18px -6px rgba(255,158,122,.4)`) is the one exception and it is not a shadow — it is
the action's light, inherited from the system's `--shadow-accent`.

### Structure is carried by neutral white lifts

The card's `inset 0 1px 0 rgba(255,255,255,.06)` stays **white and neutral**, and it is a
lift rather than a line: over the card's `surface` fill it composites to `#231D1C`,
**1.1428:1** against that fill (computed in the scratchpad; the settled contract quotes the
same alpha over `bg`, `#191717` at 1.1190:1 — either way it is under 1.15 and reads as a
highlight, not an edge). This is the system's rule verbatim: structure is neutral, the
accent is action.

Two white-alpha *borders* went the other way, because on a warm ground a neutral border is
a visible cool seam rather than a neutral one. `border-white/20` composited to `#3B3939`
(1.7412:1, chroma 0.0028) and `border-white/15` to `#2F2D2D` (1.4595:1, chroma 0.0029);
both route to `border-soft`. The distinction is deliberate and worth being able to cite: a
1px **lift** is a highlight and stays white; a 1px **boundary** is structure and takes the
warm token, because it is being read alongside `border` and `border-soft` and a cool one
among them looks like a mistake.

### `.grain`

`.grain` lays a fixed, `pointer-events-none` noise field over the document at ~4%. A page
this dark is mostly one flat ink value, and flat ink at scale reads as absence rather than
as a surface. Fixed, never in a scrolling layer — noise inside a scroll container repaints
every frame.

### `.rule-chrome` — neutral steel, and every figure in it moved

A brushed-metal hairline for the top edge of a section, built from `chrome` rather than
`accent`. Under platinum the safety argument was *the edge is five times darker than the
action*; that argument is gone with the luminance gap (§1), and what replaces it is that a
`chrome` edge has **no hue**, so it cannot be misread as an action whatever its brightness.

Recomputed, because all three figures in the stylesheet were derived from platinum on
`#050505`:

| | composite | on `bg` |
|---|---|---|
| centre, `chrome` at 52% | `#5F5E60` | **3.0981:1** |
| taper, `chrome` at 30% | `#3B3A3B` | **1.7641:1** |
| centre against taper | | **1.7562:1** |

`.card-lift`'s hover edge — `chrome` at 26% over `surface` — lands on `#3D3838`, **1.6466:1
against the fill it sits on**, which is the pairing that renders.

### `.surface-copper` and the wordmark — one ramp, two presentations

The page has exactly **one** copper ramp, and it appears twice.

`.surface-copper` is `METAL.coral`'s six stops single-pass at 104°, exactly as the system
ships them, and it is what the rim button's wrapper is painted with — the hue under the
shader, and the whole ring when WebGL is refused.

`.chromatic-text` is the same six stops **in the same order**, tiled twice across
`background-size: 200%`, at 100° so the highlight rakes across the letterforms, sweeping
`background-position` 0% → 100% over 11s linear.

Three things about that construction are measured rather than chosen:

- **The source order is kept, and the valley is why.** Ranking the six stops by luminance
  — which both an earlier draft and the shipped platinum ramp did — leaves **one** highlight
  per cycle, and §17 says a metal reads by **two**. Measured Y: dim `#A84A30` 0.1344,
  highlight-1 `#FFD9C6` 0.7496, alloy `#FF9E7A` 0.4712, **valley `#B4553A` 0.1651**,
  highlight-2 `#FFC8B0` 0.6570, dim-return `#C4674A` 0.2193. Highlight-1 → valley is
  −0.5846 Y and valley → highlight-2 is +0.4920 Y: that trough *is* the struck-metal
  structure. Delete `#B4553A` as "structurally already there" and the two highlights merge
  into a shoulder of only −0.0926 Y (1.131:1) — flatter than the step it was deleted for.
  §39 names the highlight positions at 26% and 88% and the valley at 66%; keeping the
  source order keeps all three. Internal span is **4.3374:1** (`#FFD9C6` over `#A84A30`),
  clear of §39's ≥ 4:1 floor.
- **Two cycles, not four, and that is a density measurement.** At `background-size: 200%`
  the visible window is exactly half the background, so N cycles put N highlights in frame.
  The platinum incumbent (five stops, one highlight each, four cycles) put 2 in frame. Six
  stops at four cycles puts 4 — on a wordmark measuring 1017.7px at a 1440px viewport that
  is a specular every ~254px, roughly one per 2.7 glyphs, which reads as ripple. Two cycles
  holds the incumbent's ~509px pitch and shows exactly the two highlights and the valley.
- **It is seamless by arithmetic, not by eye.** The colour at 0%, 50% and 100% is the same
  stop, and travelling `background-position` 0% → 100% over a 200% background moves exactly
  one box width, which is exactly one cycle. The reduced-motion state holds between 22% and
  12%: at position *p* the window covers background `[p/200, p/200 + 0.5]`, so 12% gives
  `[6%, 56%]`, which contains both highlights and the valley.

The ramp is also measurably kinder to the ground than the platinum it replaces: its darkest
stop is **3.5078:1** on `#0A0808`, where platinum's dim was 2.9855:1 on `#050505`.

One geometry note that is not about colour: `.chromatic-text` clips inside an
`overflow-hidden` box, and Plex's font box is 1.300em against Archivo's 1.088em. Working in
`em` so it holds at every viewport — baseline = (0.78 − box)/2 + ascent, ink bottom of `q` =
baseline + ink descent — Archivo put the tail at 0.896em against a 0.840em clip box, so the
`q` was **already** being shaved by 0.056em and the comment attributing the crop to
"Archivo's generous vertical space" was already false. Plex puts it at 0.964em, an
overshoot of 0.124em. `pb-[0.20em]` clears it; 0.184em is the arithmetic minimum.

---

## 8. Refused

Not style preferences — each of these was on the page, or was proposed for it, and was
removed for a reason.

**Added by the move to copper and one family:**

- **Copper on a heading.** §4 rule 1, without qualification: the accent means "you can act
  on this" — never body copy, never headings, never metadata, never data. A copper headline
  is a heading pretending to be a button, and the reader learns that copper means nothing.
- **Copper on a badge, a chip, an active nav state or an icon.** Same rule, and this is the
  specific failure the system measured and recorded: twenty coral elements in one panel,
  corrected to six, *"do not repeat this."* Quiet emphasis in running text is
  `accent-soft`, which is a link colour; a mark is `chrome`, which has no hue.
- **A second metal.** There are two and only two: copper for the brand (the wordmark and
  the action's ring) and neutral steel for marks and machined edges. A third — brushed
  copper, warmed steel, anything in between — is the exact construction §4 and §39 refuse,
  because it would sit inside the accent's hue at a lower chroma and force the eye to judge
  saturation to tell a mark from an action.
- **Gradient text anywhere except the footer wordmark.** The wordmark is the page's one
  chromatic object and it earns the treatment by being the only one. A gradient on running
  text also destroys its measured contrast — there is no single ratio to state, which means
  there is no claim that can be checked.
- **A second type family.** The page is IBM Plex Sans and IBM Plex Mono. A third face
  arriving "just for the closing statement" is how the serif got here the first time, and
  the closing statement is now handled inside the family by `.display-quiet` (§3). Emphasis
  comes from size, weight, width and measure — four axes, all of them free.
- **Raising the accent when the page feels under-branded.** §4: warm the neutrals instead.
  The neutrals here are warm already, and the answer to "I can't see the brand" is more
  warmth in `surface` and `border`, never more coral.
- **Tinting a shadow with the ground.** See §7.

**Carried forward:**

- **Eyebrows and kickers.** See §3.
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
through `CopyText`, which flags it visibly in `warning` and sets it in `.tabular` — so it
renders in IBM Plex Mono, which is a second, non-colour signal that the value is machine
data awaiting verification rather than prose. Registration codes, turnover figures,
ratings, activation SLAs, testimonial attributions. They are not lorem ipsum and they
must not be replaced with invented values — an unregistered segment displayed as
registered is a regulatory problem, not a copy problem.
