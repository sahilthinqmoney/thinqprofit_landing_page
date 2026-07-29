/**
 * §6 Platform & tools — copy from docs/landing-page-copy.md §6, verbatim.
 * Icon names from design-system/thinqprofit/pages/landing.md §8 (Platform row):
 * candlestick-chart, table-2, filter, bell, timer, git-branch, flask-conical,
 * code, file-text, activity — in that order.
 */
import type { Tool } from '../types'

export const platformEyebrow = 'The platform'
export const platformHeading = 'Built for the ten seconds that matter'
export const platformSubheading =
  "Order entry, charts and positions on one screen — because the market doesn't wait for a page to load."

export const platformCta = 'Take a product tour'

export const tools: Tool[] = [
  {
    title: 'Charts',
    body: '100+ indicators, 20 drawing tools, and layouts that save exactly where you left them. Trade directly from the chart.',
    icon: 'candlestick-chart',
  },
  {
    title: 'Option chain',
    body: 'Live Greeks, OI change, IV and PCR in one grid. Filter by strike range, tap to build a leg.',
    icon: 'table-2',
  },
  {
    title: 'Screeners',
    body: 'Filter the entire listed universe on 60+ fundamental and technical parameters. Save a screen, get alerted when a stock enters it.',
    icon: 'filter',
  },
  {
    title: 'Alerts',
    body: 'Price, percentage, indicator and open-interest triggers, delivered to your phone.',
    icon: 'bell',
  },
  {
    title: 'GTT orders',
    body: 'Set a target and stop-loss that stay live for up to a year. No re-placing every morning.',
    icon: 'timer',
  },
  {
    title: 'Baskets & multi-leg',
    body: 'Build a four-leg strategy, check the payoff, place it as one order.',
    icon: 'git-branch',
  },
  {
    title: 'Paper trading',
    body: 'Live market data, simulated money. Learn the mechanics before you risk anything.',
    icon: 'flask-conical',
  },
  {
    title: 'API',
    body: 'REST and WebSocket endpoints, documented, with rate limits published openly.',
    icon: 'code',
  },
  {
    title: 'Reports',
    body: 'Tax P&L, capital gains statements, contract notes and ledgers — downloadable, ITR-ready.',
    icon: 'file-text',
  },
  {
    title: 'Portfolio analytics',
    body: "Sector concentration, XIRR, realised versus unrealised, and what's actually driving your returns.",
    icon: 'activity',
  },
]

/**
 * Description for the eventual terminal screenshot. Per landing.md §10 the asset
 * must not show a large gain, so the brief asks for a neutral, illustrative frame.
 */
export const platformMediaLabel =
  'Web trading terminal — Nifty 50 candlestick chart with indicator pane, option chain beside it, and an order ticket open. Illustrative figures only.'

export const platformMediaAlt =
  'ThinqProfit web terminal showing a chart, option chain and an open order ticket'
