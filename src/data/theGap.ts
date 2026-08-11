/**
 * §3 copy — the gap section.
 *
 * The headline is two timestamps and nothing else. No instrument is named, no
 * price quoted, no direction implied, which is what keeps it inside
 * docs/art-direction.md §2.1 and DESIGN.md §8: both refuse fabricated market
 * data, and a clock is not market data. The moment this sentence names a symbol
 * or a level it becomes an invented trade.
 *
 * `solution` states a structural limit rather than a personal failing — forty
 * instruments across a six-hour session is arithmetic, not inattention. A
 * product that tells its buyer they were slow has insulted them in the first
 * paragraph.
 *
 * `narrative`, `pain`, `clipText1` and `clipText2` were dropped here: the first
 * two had been empty strings for as long as the file has existed, and the clip
 * captions belonged to a timeline treatment the section no longer uses.
 */

export interface GapContent {
  heading: string
  lead: string
  closer: string
}

export const theGap: GapContent = {
  heading: 'It happened at 11:40.\nYou saw it at 12:15.',
  lead: 'The market throws off signals all day. Institutions have machines reading every one of them. You have two eyes.',
  closer: 'Thinq is that machine, running for you.',
}
