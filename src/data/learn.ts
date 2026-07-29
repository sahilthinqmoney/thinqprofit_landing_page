/**
 * §11 ThinqProfit Learn — docs/landing-page-copy.md
 *
 * Track titles and descriptions are verbatim. `learnDisclaimer` is the advisory
 * boundary statement: it must render as live text on the page, never as an
 * image and never behind a blur (landing.md §9).
 */
import type { LearnTrack } from '../types'

/**
 * Local extension of `LearnTrack` — the shared type is owned elsewhere, and the
 * ledger layout needs one more column than it carries.
 *
 * `marker` is the level/duration cell in each row. The copy deck specifies no
 * level and no run-time for any track, so the value is an unfilled placeholder
 * in the deck's own square-bracket convention and renders through `CopyText` in
 * warning colour. Inventing "Beginner · 12 min" would be inventing copy.
 */
export interface LearnTrackRow extends LearnTrack {
  marker: string
}

export const tracks: LearnTrackRow[] = [
  {
    title: 'First Steps',
    body: "What a demat account is, how settlement works, what you're actually buying",
    icon: 'footprints',
    marker: '[LEVEL · DURATION]',
  },
  {
    title: 'Reading the Market',
    body: 'Charts, volumes, order types, and what moves a price',
    icon: 'chart-candlestick',
    marker: '[LEVEL · DURATION]',
  },
  {
    title: 'Derivatives, Carefully',
    body: 'How F&O works, what margin means, and how positions go wrong',
    icon: 'shield-alert',
    marker: '[LEVEL · DURATION]',
  },
  {
    title: 'Funds & SIPs',
    body: 'Direct versus regular, expense ratios, and why the difference compounds',
    icon: 'piggy-bank',
    marker: '[LEVEL · DURATION]',
  },
  {
    title: 'Taxes',
    body: 'STCG, LTCG, speculative income, and what your P&L statement means at filing time',
    icon: 'receipt',
    marker: '[LEVEL · DURATION]',
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
