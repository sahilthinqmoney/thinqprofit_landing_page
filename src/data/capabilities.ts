/**
 * §4 — "What else is in it". The summary section, and it knows it is one.
 *
 * §3 spends a full screen on one feature. This is the rest of the terminal at
 * one sentence each, and the asymmetry is the design: a reader who was convinced
 * by §3 needs to know the product is not a single trick, and a reader who was
 * not is unlikely to be convinced by a longer list.
 *
 * ── No icons, and no cards ─────────────────────────────────────────────────
 *
 * Six capability cards with six glyphs is the shape every competitor ships, and
 * once six icons line up they become the thing you see instead of the six
 * sentences. `Safety` dropped its icons for the same reason and states it: "a
 * glyph beside a heading is the part of a card that carries no information."
 *
 * The rendering is a ledger of rows — title left, sentence right — so the shape
 * itself says "list" before a word is read. That is honest about what this
 * section is, where a grid of bordered cards would be pretending it is the main
 * event.
 *
 * ── No numbers anywhere in here ────────────────────────────────────────────
 *
 * Latency in particular. "Orders routed in milliseconds" is the claim; a
 * specific figure is not, and the difference is that a millisecond count printed
 * on a landing page costs the vendor nothing and cannot be checked by the reader.
 * DESIGN.md §9 makes any unverified figure a `[BRACKETED]` placeholder or
 * nothing, and a latency number is the single easiest thing on a broker page to
 * print and the hardest to audit. It stays qualitative until it is measured in a
 * shipped artefact.
 */

export interface Capability {
  /** Short, capitalised as a proper feature name where it is one. */
  title: string
  /** One sentence. If it needs two, it belongs in §3 instead of here. */
  body: string
}

/**
 * The scope note, rendered as the section's deck.
 *
 * It names what is NOT here, which is the move a pre-launch page has to make and
 * almost never does. "Agentic trading is next" is a roadmap statement, and the
 * rule it stays inside is that it carries no date: a date on an unshipped
 * capability is a promise the page cannot keep, and the copy decisions in
 * docs/go-live-checklist.md rule out roadmap dates outright.
 */
export const capabilitiesIntro = {
  heading: 'What else is in it',
  subheading:
    'The rest of the terminal, one line each. Agentic trading — where Thinq acts on the plan rather than describing it — is what we are building next.',
}

export const capabilities: Capability[] = [
  {
    title: 'Position Compass',
    body: 'Track whether open positions are moving with or against the market in real time.',
  },
  {
    title: 'Option Chain Builder',
    body: 'Tap bids and asks to build and preview multi-leg structures before execution.',
  },
  {
    title: 'Greeks, in plain English',
    body: 'Delta, theta, and vega translated into real-time plain English risk drivers.',
  },
  {
    title: 'Low-latency execution',
    body: 'Orders routed in milliseconds to minimize slippage between signal and fill.',
  },
  {
    title: 'Your workspace',
    body: 'Customizable widget grids, symbol linking, multi-monitor pop-outs, and zero install.',
  },
  {
    title: 'Alerts that hold',
    body: 'Persistent trigger conditions that stay active even when your browser tab is closed.',
  },
]

