import { Compass, Languages, Layers, Zap } from 'lucide-react'
import type { ElementType } from 'react'

/**
 * §4 copy — "What else is in it".
 *
 * §3 spends a full screen on one feature; this is the rest of the terminal at
 * one card each. The asymmetry is the design: a reader convinced by §3 needs to
 * know the product is not a single trick, and a reader who was not is unlikely
 * to be convinced by a longer list.
 *
 * No figures anywhere in here, latency in particular. "Orders routed in
 * milliseconds" is a claim the reader can weigh; a specific number costs the
 * vendor nothing and cannot be checked. DESIGN.md §9 makes any unverified figure
 * a `[BRACKETED]` placeholder or nothing, and a latency number is the easiest
 * thing on a broker page to print and the hardest to audit.
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
      'Tracks whether open positions are moving with or against the market, not just whether they are up.',
    icon: Compass,
    badge: 'AI Analytics',
    image: '/images/capabilities/compass.png',
  },
  {
    id: 'option-chain-builder',
    title: 'Option Chain Builder',
    description:
      'Build multi-leg structures by tapping bids & asks, previewing complete payoff curves before execution.',
    icon: Layers,
    badge: 'Options F&O',
    image: '/images/capabilities/option_chain.png',
  },
  {
    id: 'greeks-in-plain-english',
    title: 'Greeks, in Plain English',
    description:
      'Delta, theta and vega translated into real-time plain English sentences about P&L drivers.',
    icon: Languages,
    badge: 'Risk Engine',
    image: '/images/capabilities/greeks_prism.png',
  },
  {
    id: 'low-latency-execution',
    title: 'Low-Latency Execution',
    description:
      'Orders routed in milliseconds to minimize slippage between what you see and what you get.',
    icon: Zap,
    badge: 'Ultra Fast',
    image: '/images/capabilities/low_latency.png',
  },
]

/**
 * The section's deck. It names what is NOT here, which is the move a pre-launch
 * page has to make and almost never does — and it carries no date, because a
 * date on an unshipped capability is a promise the page cannot keep.
 */
export const capabilitiesIntro = {
  heading: 'What else is in it',
  subheading:
    'The rest of the terminal, one line each. Agentic trading — where Thinq acts on the plan rather than describing it — is what we are building next.',
}
