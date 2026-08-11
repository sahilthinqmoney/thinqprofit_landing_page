import { Bell, Compass, Languages, Layers, LayoutGrid } from 'lucide-react'
import type { ElementType } from 'react'

/**
 * §4 copy — "What else is in it".
 */

export interface CapabilityCard {
  id: string
  title: string
  description: string
  /** Lucide icon, shown small in the card's top-left. */
  icon: ElementType
  /** The category chip in the card's top-right. */
  badge: string
  image: string
}

/** The deck, rendered as a 3D loop on desktop and a stacked scroll on mobile. */
export const capabilityCards: CapabilityCard[] = [
  {
    id: 'position-compass',
    title: 'Position Compass',
    description:
      "Whether your open positions are going with the market or against it. Not the same as whether they're up.",
    icon: Compass,
    badge: 'Analysis',
    image: '/images/capabilities/compass.png',
  },
  {
    id: 'build-from-chain',
    title: 'Build from the Chain',
    description:
      'Tap bids and asks to assemble a multi-leg position. See the payoff before you send it.',
    icon: Layers,
    badge: 'Options',
    image: '/images/capabilities/option_chain.png',
  },
  {
    id: 'greeks-in-plain-english',
    title: 'Greeks, in Plain English',
    description:
      'What delta, theta and vega are actually doing to your P&L, in words.',
    icon: Languages,
    badge: 'Risk',
    image: '/images/capabilities/greeks_prism.png',
  },
  {
    id: 'your-workspace',
    title: 'Your Workspace',
    description:
      'Dock and snap widgets. Link them so one symbol change moves all of them. Save layouts and switch in a click.',
    icon: LayoutGrid,
    badge: 'Workspace',
    image: '/images/capabilities/workspace.png',
  },
  {
    id: 'alerts-that-hold',
    title: 'Alerts That Hold',
    description:
      'Set a condition once. It watches for you.',
    icon: Bell,
    badge: 'Alerts',
    image: '/images/capabilities/alerts.png',
  },
]

export const capabilitiesIntro = {
  heading: 'What else is in it',
  subheading: '',
}
