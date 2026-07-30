/**
 * §11 ThinqProfit Learn — docs/landing-page-copy.md
 *
 * Track titles are verbatim from the copy deck. The descriptions are cut down to
 * one noun phrase each: the deck set every one as a list plus a trailing "and
 * why/what it means" clause, which is the section explaining its own syllabus
 * before anyone has asked for it. The titles plus the phrase are enough to pick
 * a track, and picking a track is all this list has to do.
 *
 * `learnDisclaimer` is the advisory boundary statement and is VERBATIM — it must
 * render as live text on the page, never as an image and never behind a blur
 * (landing.md §9). Do not shorten it.
 *
 * The tracks are an ordered path — First Steps through Taxes — and the section
 * renders them as a staircase in that order. Order is content, so it lives here
 * rather than being re-sorted in the component.
 *
 * No level, duration or difficulty field: the copy deck specifies none for any
 * track, and a UI column that exists only to hold an invented value is a worse
 * outcome than not having the column.
 *
 * `icon` is carried because the shared `LearnTrack` type requires it. The
 * section no longer renders per-track glyphs — landing.md §8 assigns icon sets
 * to Products, Platform and Safety only, and Learn's were an invention.
 */
import type { LearnTrack } from '../types'

export const tracks: LearnTrack[] = [
  {
    title: 'First Steps',
    body: 'Demat accounts, settlement, ownership',
    icon: 'footprints',
  },
  {
    title: 'Reading the Market',
    body: 'Charts, volumes, order types',
    icon: 'chart-candlestick',
  },
  {
    title: 'Derivatives, Carefully',
    body: 'F&O, margin, and how positions go wrong',
    icon: 'shield-alert',
  },
  {
    title: 'Funds & SIPs',
    body: 'Direct versus regular, expense ratios',
    icon: 'piggy-bank',
  },
  {
    title: 'Taxes',
    body: 'STCG, LTCG, speculative income, your P&L statement',
    icon: 'receipt',
  },
]

/** The §11 "Formats" line, split on its middle dots. */
export const formats: string[] = [
  'Short articles',
  '3–5 minute videos',
  'Interactive calculators',
  'Plain-language glossary',
]

export const learnDisclaimer =
  'Educational content only. Nothing in ThinqProfit Learn is investment advice or a recommendation to buy or sell any security.'
