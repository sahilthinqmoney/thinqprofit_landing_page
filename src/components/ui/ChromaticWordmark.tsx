import { wordmark } from '../../data/nav'

/**
 * The brand lockup at the foot of the page: the wordmark set very large, with
 * chromatic metal travelling through the letterforms.
 *
 * It closes the document the way the hero opens it — the hero's headline resolves
 * out of a blur as the field behind it settles, and this is the same material
 * arriving at rest. Nothing below it but the copyright line.
 *
 * Three decisions worth stating:
 *
 * **It is decoration, and it is marked as such.** `aria-hidden` plus
 * `select-none`, because a screen reader announcing "ThinqProfit" a third time at
 * the end of the document adds nothing — the footer's brand block already carries
 * the accessible name, and the nav carries it as a home link. Gradient text is
 * refused everywhere else on this page precisely because it destroys measured
 * contrast; that rule only holds if this element is never asked to be read.
 *
 * **It is clipped, not filled.** The glyphs are transparent and the gradient
 * shows through them, so the mark reads as metal rather than as text coloured
 * silver. See `.chromatic-text` in index.css for why this is CSS and not the
 * WebGL shader the primary action uses.
 *
 * **It bleeds.** The type is sized in `vw` so it spans the viewport at every
 * width and is allowed to sit tight against the edges. A wordmark this large that
 * stops politely inside a container reads as an oversized heading; one that runs
 * to the edges reads as a mark stamped on the page.
 */
export default function ChromaticWordmark() {
  return (
    <div className="relative overflow-hidden">
      {/*
        `leading-[0.78]` crops the generous vertical space Archivo reserves for
        ascenders and descenders, which at this size is over a hundred pixels of
        nothing. `pb-[0.06em]` gives the descender on 'q' and 'P' its room back so
        the clip does not shave it.
      */}
      <p
        aria-hidden="true"
        className="chromatic-text display m-0 select-none whitespace-nowrap pb-[0.06em] text-center text-[15.5vw] leading-[0.78] tracking-[-0.045em]"
      >
        {wordmark}
      </p>
    </div>
  )
}
