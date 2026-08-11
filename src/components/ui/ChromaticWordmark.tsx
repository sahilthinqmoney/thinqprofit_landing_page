import { wordmark } from '../../data/nav'

/**
 * The sign-off wordmark: one word, as wide as the page will let it be.
 *
 * The size is given in `vw` at three steps rather than one, because a single
 * value cannot be right at both ends. Measured, `12.5vw` put the word at 31% of
 * a phone's width against 35% on a laptop — so the mark was *proportionally
 * smaller* on the screen with least room to spare, and at 49px it read as a
 * caption rather than a sign-off. A narrow screen needs a larger share of its
 * width to carry the same weight, not the same share.
 *
 * The steps land the glyphs at roughly 80% / 50% / 35% of the viewport. 80% is
 * as far as this can go and keep an even margin: the word is `whitespace-nowrap`
 * and the page is `overflow-x-clip`, so anything wider would be silently cut
 * rather than wrapped. The `md` value is the laptop size unchanged.
 */
export default function ChromaticWordmark() {
  return (
    <div className="relative overflow-visible flex items-center justify-center pt-6 pb-12 sm:pt-10 sm:pb-16 min-h-[14vw]">
      <p
        aria-hidden="true"
        className="chromatic-text display m-0 select-none whitespace-nowrap pb-[0.45em] text-center text-[32vw] sm:text-[20vw] md:text-[14vw] leading-[0.9]"
      >
        {wordmark}
      </p>
    </div>
  )
}





