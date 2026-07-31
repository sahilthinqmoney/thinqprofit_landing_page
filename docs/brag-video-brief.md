# ThinqProfit — launch video brief (`/brag`)

The direction for the page's launch film. It is written against the same three
documents the page itself is built from — `docs/landing-page-copy.md` (what may
be said), `docs/motion-brief.md` (what may move) and `docs/art-direction.md`
(what it may look like) — because a launch video that contradicts the product it
is launching is worse than no video.

Everything here is a constraint, not a mood board. Where a rule already exists in
one of those three files this brief quotes it rather than restating it loosely.

---

## 0. The invocation

```
/brag --tone polished --format landscape --duration 22 --title "ThinqProfit"
```

Then hand this file over as the creative direction. `polished` is the preset —
"for projects that are not jokes" — and this brief overrides it wherever the two
disagree. There is no joke to make here: the subject is a SEBI-registered broker,
and the entire argument of the page is that it is not playing.

---

## 1. What is actually being launched

A broker's landing page, Indian market, retail investor.

- **Product:** stocks, ETFs, F&O, commodities, direct mutual funds — one account.
- **Regulator posture:** SEBI-registered; NSE, BSE, MCX, CDSL. Registration codes
  are still `[SQUARE BRACKET]` placeholders in `src/data/hero.ts` and **must not
  appear in the film in any form**, filled or invented.
- **The page's argument, in scroll order:** breadth of instruments → registered
  and regulated → the two segments that carry the business → the platform is fast
  when it matters → the price is one rate card → the account opens today →
  your assets are held where you can see them → it is in your pocket → start.
- **The claim the whole thing rests on:** *you can act, and the tool will not be
  the reason you didn't.*

The film is that argument at 1/60th the length. It is not a feature tour.

---

## 2. Who it is for, and what it must make them feel

A first-time or switching retail investor in India who has been burned by an
interface — an order that hung, a charge that appeared on the contract note, an
account that took a week. They are not excited. They are wary.

So the film sells **composure**, not upside. Three feelings, in order:

1. **Steadiness** (0–6s) — something heavy, machined and still. Nothing is being
   sold yet.
2. **Competence** (6–16s) — the real product, moving at the speed a real product
   moves. The proof is that it is legible, not that it is impressive.
3. **Permission** (16–22s) — you can start now, with what you already have.

If a viewer's takeaway is "that looked expensive", the film worked. If it is
"that looked exciting", it failed — excitement is what the category already sells
and it is exactly what a wary switcher distrusts.

---

## 3. Hard prohibitions

These are not stylistic preferences. Each one is a rule the page already lives
under, and breaking it in the film would make the film unusable.

**From `motion-brief.md` §7 and `art-direction.md` §2.1 — content:**

- **No numbers, tickers, candlesticks, order books, P&L, or chart forms.** Not
  even blurred, not even "illustrative". A rendered candlestick is invented price
  history no matter how it is labelled.
- **No fabricated interface.** Every frame of product must be a real capture of
  the real page. Nothing may be mocked up for the camera.
- **Nothing green, nothing red.** Those two hues mean gain and loss in this
  system and appear on no button, badge or decoration. In this film they appear
  nowhere at all.
- **No upward motion as a claim.** No rising line, no ascending diagonal, no
  arrow, no counter climbing. On a broker's film the eye reads upward as a
  promise about returns. Motion is lateral, orbital, radial, or settles
  downward.
- **No people celebrating.** No faces, no fists, no phone-in-hand-on-a-balcony.
- **No urgency mechanics.** No countdown, no scarcity, no "limited".

**From `art-direction.md` §2.2–§2.5 — surface:**

- Monochrome throughout. The only chromatic value permitted anywhere in the film
  is the `warning` orange **if** a risk disclosure is set in it, matching the
  page.
- Nothing brighter than sRGB 168 except the primary button. The button is the
  brightest object in the film, once, at the end. If anything out-glows it, the
  film has an atmosphere instead of an action.
- Black point is `#050505`. Not `#000` — a true-black frame reads as a hole in
  the screen and every edge touching it looks torn.
- Key light is 5600K, single source, soft, one direction. No warm grade. A warm
  grade smuggles back the gold palette this brand deliberately removed.

---

## 4. The anti-AI-slop list

The brief for "premium" is mostly a list of things not to do, because the
generic-generated look is a *set of specific tells*, not a vague vibe. None of
the following may appear:

| Banned | Why it reads as generated |
|---|---|
| Purple/blue or teal/magenta gradients | The default palette of every template since 2021 |
| Glassmorphism, frosted panels, `backdrop-blur` cards | Decoration standing in for hierarchy — and the page forbids type behind glass outright |
| Floating 3D blobs, iridescent spheres, torus knots | Stock render vocabulary; unrelated to the product |
| Particle fields, sparkles, "data" dots, network graphs | Signifies "tech" and nothing else |
| Lens flares, light leaks, anamorphic streaks | Camera artefacts on a scene with no camera |
| Neon rim lighting on everything | The rim here is *one* accent per shot, maximum |
| Kinetic typography that bounces, springs or overshoots | The page's easing is exponential ease-out: fast departure, long settle, never a bounce |
| A whoosh on every cut | Sound design as filler |
| Riser → boom → drop trailer structure | 22 seconds does not have room for a three-act sound arc |
| Centred everything | The page is built on one left edge from nav to footer |
| Emoji, badge rows, star ratings, "✨ AI-powered" | Nothing on the page does this |
| Fake dashboards with invented figures | Prohibited outright above |
| Stock-photo humans | The page has none |
| Text that arrives one word at a time | Reads as an effect, not as a sentence |

**The positive version of the same rule:** the film is made of *real captures of
a real page*, plus the page's own rendered plates, cut on the page's own easing,
in the page's own two typefaces. Nothing is invented for the camera. That single
discipline is what separates it from generated work, and it costs nothing except
the temptation to add something.

---

## 5. Look

Read the tokens from `src/index.css` rather than eyeballing them.

| Role | Value |
|---|---|
| Ground | `#050505` |
| Panel | `#0D0D10` / `#16161A` |
| Copy | `#FFFFFF`, muted `#CFCFCF`, subtle `#7E7E7E` |
| Chrome / edges | `#A9AEB8` |
| The action | `#E7E9EE` fill, `#050505` text on it — never white on the alloy |
| Warning (disclosure only) | `#F97316` |
| Display face | Archivo, weight 600, tracking tight, optical size on |
| Body face | Instrument Sans |
| Editorial face | Newsreader — **once**, on the closing line, nowhere else |
| Corner radius | 28px, one radius for every surface |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` — fast out, long settle |
| Grain | ~4% opacity, fixed, across the whole frame |

Grain across the whole film, at the same strength as the page. It is the single
cheapest thing that stops a dark frame reading as an empty PNG.

---

## 6. Structure — 22s at 25fps

Timings are targets. Readability wins over the grid: a short label holds ~0.8s
settled, a sentence ~0.3s per word. Fast in, then hold. Never fast in, then gone.

**Beat 1 — Cold open · 0.0–3.4s**
Black. Grain. The hero plate's own loop: a large brushed-aluminium form curving
out of darkness, one soft light running an edge. No logo, no words, no music yet
— room tone only. The frame is allowed to be almost empty. This beat exists so
the first word lands in silence rather than over a build.

**Beat 2 — The claim · 3.4–7.0s**
`Your money. Your market. One app.` Archivo, three lines, parked on the left
edge, arriving a line at a time out of a slight blur and damping *downward* into
position. This is the page's own hero animation, matched. Music enters under the
second line, low.

**Beat 3 — Breadth · 7.0–10.6s**
Real capture of the Products section: the two media cards, lateral push across
them, no zoom. Overlay, small, left: `Stocks · ETFs · F&O · Commodities · Direct
mutual funds`. One line, one hold. Do not animate the list item by item.

**Beat 4 — The platform · 10.6–14.2s**
Real capture of the Platform section. Headline from the page verbatim: `Built for
the ten seconds that matter`. The capture scrolls at reading speed, not at demo
speed. If the section's live canvas is moving in the capture, keep it — that
motion is the product's, and it is the one place the film gets to show something
alive without inventing anything.

**Beat 5 — The account · 14.2–17.4s**
Real capture of the Onboarding section. `Open an account before your chai gets
cold` — set as it is set on the page. This line is the film's single most
valuable asset: it is specific, it is Indian, it is warm without being cute, and
no generated script would produce it. Give it the longest single hold of any line
in the film.

**Beat 6 — The close · 17.4–20.4s**
Cut to the closing plate: the monolith, edges only. `Start with what you have
today` in Newsreader — the film's only serif, exactly as the page uses it once.
Wordmark resolves beneath it. Then, and only then, the primary button appears in
the alloy: the brightest object in the entire film, arriving last, settling, not
pulsing.

**Beat 7 — Disclosure · 20.4–23.0s**
`Investments in the securities market are subject to market risk. Read all the
related documents carefully before investing.` Held static, legible, on ink. Not
shrunk into a corner, not scrolled past, not set at 40% opacity. A broker that
treats its risk line as a design problem has answered the question the film was
asking.

Total ≈ 23s. Inside `/brag`'s 15–25s law.

---

## 7. Sound

- **Music:** one restrained bed, entering at beat 2 and out by beat 7. Low, slow,
  no melody carrying a hook. It is a floor for the cuts, not a track the film is
  edited to. Beat-syncing every cut is the tell that a template made this.
- **SFX:** at most three. One low, short sub on beat 2's first line. One soft
  mechanical contact — a machined click, not a whoosh — on the cut into beat 6.
  One almost-inaudible settle as the button lands. Nothing else.
- **Silence is a material.** Beats 1 and 7 carry room tone and nothing else.
- No voiceover. Not on the first cut. A voice makes it an ad; the page's tone is
  a document.

---

## 8. Sourcing the captures

Product frames come from the live page, captured, not rebuilt:

```bash
npm run dev                              # note the port it prints
npx hyperframes capture http://localhost:<port>/ --out brag-output/captures
```

Capture at 1920×1080, `prefers-reduced-motion: no-preference`, and let each
section's entrance actually play before the frame is taken — the entrances are
half the reason the page looks built rather than assembled.

If a capture lands on a `[X]` or `[Member code]` placeholder, **reframe the shot
so it is out of frame.** Do not fill it in, do not blur it out. Those brackets
are unresolved compliance values, and a filled-in one in a launch film is a
published claim.

---

## 9. Done means

- Every product frame traces to a real capture of the real page.
- No number, ticker or chart form appears anywhere.
- The primary button is the brightest thing in the film, and it appears once.
- The serif is used exactly once.
- Nothing rises.
- The risk disclosure is readable at 100% scale, held long enough to read.
- Played on mute with no context, it reads as a broker — not as a fintech, a
  crypto app, or a template.
