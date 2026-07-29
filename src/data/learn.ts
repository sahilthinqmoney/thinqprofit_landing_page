/**
 * §11 ThinqProfit Learn — docs/landing-page-copy.md
 *
 * Track titles and descriptions are verbatim. `learnDisclaimer` is the advisory
 * boundary statement: it must render as live text on the page, never as an
 * image and never behind a blur (landing.md §9).
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
    body: "What a demat account is, how settlement works, what you're actually buying",
    icon: 'footprints',
  },
  {
    title: 'Reading the Market',
    body: 'Charts, volumes, order types, and what moves a price',
    icon: 'chart-candlestick',
  },
  {
    title: 'Derivatives, Carefully',
    body: 'How F&O works, what margin means, and how positions go wrong',
    icon: 'shield-alert',
  },
  {
    title: 'Funds & SIPs',
    body: 'Direct versus regular, expense ratios, and why the difference compounds',
    icon: 'piggy-bank',
  },
  {
    title: 'Taxes',
    body: 'STCG, LTCG, speculative income, and what your P&L statement means at filing time',
    icon: 'receipt',
  },
]

/** The §11 "Formats" line, split on its middle dots. */
export const formats: string[] = [
  'Short articles',
  '3–5 minute videos',
  'Interactive calculators',
  "A glossary that doesn't define a term using the same term",
]

export const learnDisclaimer =
  'Educational content only. Nothing in ThinqProfit Learn is investment advice or a recommendation to buy or sell any security.'
