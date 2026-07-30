/**
 * §6 Platform & tools — copy from docs/landing-page-copy.md §6, verbatim.
 * Icon names from design-system/thinqprofit/pages/landing.md §8 (Platform row):
 * candlestick-chart, table-2, filter, bell, timer, git-branch, flask-conical,
 * code, file-text, activity — in that order.
 */
import type { Tool } from '../types'

export const platformEyebrow = 'The platform'
export const platformHeading = 'Built for the ten seconds that matter'
/*
 * The trailing "because the market doesn't wait for a page to load" is dropped:
 * the headline above it already says "the ten seconds that matter", so the
 * clause was explaining a claim the reader had just been given.
 */
export const platformSubheading = 'Order entry, charts and positions on one screen.'

export const platformCta = 'Take a product tour'

/*
 * Four, not ten. Ten reads as an inventory; four reads as a claim about what the
 * platform is for — and four is what fits on one line of the copy column without
 * the list becoming the section. Everything that went (screeners, GTT orders,
 * paper trading, reports, portfolio analytics, multi-leg baskets) is real, is
 * still in the nav and the footer, and belongs on the tour page the CTA points
 * at rather than in a checklist here.
 */
export const tools: Tool[] = [
  {
    title: 'Charts',
    icon: 'candlestick-chart',
  },
  {
    title: 'Option chain',
    icon: 'table-2',
  },
  {
    title: 'Alerts',
    icon: 'bell',
  },
  {
    title: 'API',
    icon: 'code',
  },
]


