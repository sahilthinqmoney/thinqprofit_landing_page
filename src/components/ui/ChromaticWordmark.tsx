import { wordmark } from '../../data/nav'

/**
 * The brand lockup at the foot of the page: the wordmark set very large, with
 * copper metal travelling through the letterforms.
 *
 * It closes the document the way the hero opens it — the hero's headline resolves
 * out of a blur as the field behind it settles, and this is the same material
 * arriving at rest. Nothing below it but the copyright line.
 *
 * ── THE METAL IS COPPER, AND THAT IS A DECISION, NOT A THEME SWAP ──────────
 *
 * The system's lockup rule is **"the mark carries the accent, the wordmark stays
 * white"** — one accent carrier per lockup, never two. In the spec's own §07
 * lockup rows (chrome · primary and coral · brand surfaces) the ring glyph is the
 * metal and the word "Thinq" beside it is flat white.
 *
 * This page satisfies that rule by having no mark glyph here at all. The footer
 * lockup is the wordmark alone, so there is nothing for it to compete with and it
 * becomes the single carrier. §07 permits exactly this: *"chrome is the primary;
 * coral for brand surfaces where the accent leads"*, and §23 sends coral metal to
 * "the footer lockup" by name, reserving chrome for a mark that sits beside live
 * data. The nav's 28px tile is that second case and stays neutral steel
 * (`--color-chrome` #AEAEB2, 9.0349:1 on the ground); this is the first.
 *
 * The consequence, stated so nobody re-litigates it: if a mark glyph is ever
 * added next to this wordmark, one of the two has to go neutral, and it is the
 * wordmark that goes — the mark is the accent carrier in every lockup the system
 * ships.
 *
 * ── Three decisions worth stating ─────────────────────────────────────────
 *
 * **It is decoration, and it is marked as such.** `aria-hidden` plus
 * `select-none`. The argument survives the palette change intact and is worth
 * restating rather than assuming: a screen reader announcing "ThinqProfit" a
 * third time at the end of the document adds nothing — the footer's brand block
 * already carries the accessible name and the nav carries it as a home link — and
 * gradient text destroys measured contrast, which is why it is refused everywhere
 * else on this page. Copper does not soften that. The ramp runs from #A84A30
 * (3.5078:1 on the ground) to #FFD9C6 (15.2144:1), so any given glyph's contrast
 * is a function of where the sweep happens to be at that frame — a number that
 * changes 11 seconds at a time is not a contrast guarantee. The rule only holds
 * because this element is never asked to be read.
 *
 * **It is clipped, not filled.** The glyphs are transparent and the gradient
 * shows through them, so the mark reads as metal rather than as text coloured
 * copper. See `.chromatic-text` in index.css for why this is CSS and not the
 * WebGL shader the primary action uses, and for the two-highlight construction
 * (§17: a metal reads by TWO highlights; a wide monotonic ramp is a grey
 * gradient wearing a colour).
 *
 * **It bleeds.** The type is sized in `vw` so it spans the viewport at every
 * width and is allowed to sit tight against the edges. A wordmark this large that
 * stops politely inside a container reads as an oversized heading; one that runs
 * to the edges reads as a mark stamped on the page. Measured, "ThinqProfit" at
 * 15.5vw of a 1440px viewport (223.2px) sets 1017.7px in IBM Plex Sans at
 * `'wdth' 82, 'wght' 600` and -0.028em — 71% of the frame, so the bleed is
 * generous rather than tight even on the wider face.
 */
export default function ChromaticWordmark() {
  return (
    <div className="relative overflow-hidden">
      {/*
        `leading-[0.78]` crops the vertical space the face reserves for ascenders
        and descenders, which at this size is over a hundred pixels of nothing.
        `pb-[0.20em]` gives the descender on 'q' and 'P' its room back.

        The old value was `pb-[0.06em]`, attributed to "the generous vertical
        space Archivo reserves". That attribution was already false before the
        face changed, and the arithmetic is worth writing down because it is in
        `em` and therefore holds at every viewport width:

          baseline    = (0.78 − fontbox)/2 + ascent
          ink bottom  = baseline + ink descent      (clip box is 0.78 + pb)

        Archivo: box 1.088em, ascent 0.878, ink descent 0.172 → tail at 0.896em
        against a 0.840em clip box, so the 'q' was ALREADY being shaved by
        0.056em — 12.5px at the 1440px rendering.

        IBM Plex Sans: box 1.300em (hhea asc+desc), ascent 1.025, ink descent
        0.199 → tail at 0.964em, an overshoot of 0.124em (27.7px). 0.184em is the
        arithmetic minimum that clears it; 0.20em leaves 0.016em (3.6px) of
        clearance. So this change fixes an existing clip rather than paying for a
        new one.

        `tracking-[-0.045em]` was also removed from the class list, and it is a
        no-op: `.display` is a hand-written rule in the same cascade layer at the
        same (0,1,0) specificity, and it lands later in the built stylesheet
        (byte 44480 against Tailwind's 25591), so `.display`'s own tracking has
        always won here. The utility was dead code that read as live, and
        `.display` now tracks -0.028em on Plex.
      */}
      <p
        aria-hidden="true"
        className="chromatic-text display m-0 select-none whitespace-nowrap pb-[0.20em] text-center text-[15.5vw] leading-[0.78]"
      >
        {wordmark}
      </p>
    </div>
  )
}
