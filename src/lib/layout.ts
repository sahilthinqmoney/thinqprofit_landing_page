/**
 * The four layout constants the page shares: the heading ladder, the content
 * rail, the vertical rhythm and the gutter. Every section reads them from here
 * so none of them can drift.
 */

/**
 * Heading steps, assigned by a section's weight in the page rather than by taste
 * at the call site. `hero` is the H1 and only the H1.
 *
 * Two rules hold this ladder together:
 *
 *  - The FLOOR of each clamp is the number that matters, not the ceiling. Clamps
 *    bottom out on phones and most were still bottomed out at 1024px, so every
 *    floor is set to clear a 2.0 title-to-deck ratio at 375px.
 *  - `lead` must stay identical to `MediaSection`'s `tall` step, so a flat lead
 *    section and a full-bleed one carry the same rank. Editing one alone breaks
 *    the ladder.
 *
 * `hero`'s 0.94 is not its rendered leading and must not be "corrected" to match
 * the others: Hero adds a `pb-[0.14em]` clip allowance inside the clip box, so
 * the rendered baseline-to-baseline distance is 0.94 + 0.14 = 1.08em, matching
 * every other step. The arithmetic is written out at that call site.
 */
export const SCALE = {
  hero: 'text-[clamp(2.75rem,5.9vw,5.75rem)] leading-[0.94]',
  lead: 'text-[clamp(2.5rem,4.6vw,4rem)] leading-[1.08]',
  standard: 'text-[clamp(2.125rem,3.9vw,3.25rem)] leading-[1.14]',
  minor: 'text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.2]',
} as const

/**
 * The single content rail — one left edge from the nav to the footer.
 *
 * `Container` caps the page at 1760px, which suits full-bleed media but is far
 * too wide to read across. `mx-auto` is load-bearing: without it a capped block
 * is left-flush in its parent, which above ~1440px dumps all the slack on one
 * side (48px against 368px at 1920px).
 */
export const RAIL = 'mx-auto w-full max-w-[84rem]'

/** The one vertical rhythm. Every section uses this string and nothing else. */
export const SECTION_Y = 'py-16 sm:py-20 lg:py-24'

/** The one page gutter. Mirrors `Container`, for sections that bleed past it. */
export const GUTTER_X = 'px-5 sm:px-6 lg:px-8 xl:px-12'
