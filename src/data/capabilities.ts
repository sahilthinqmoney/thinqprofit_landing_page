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
    /*
     * "With or against" is the whole feature and it is deliberately not
     * "profitable or losing". A position can be green and moving against the
     * market it sits in, which is the case the compass exists to surface — and a
     * P&L colour on a landing page is a claim about returns, which DESIGN.md §2
     * quarantines to live market data.
     */
    body: 'Shows whether each open position is moving with the market or against it, not just whether it is up.',
  },
  {
    title: 'Option Chain Builder',
    /*
     * The claim is the input method, not the strategy library. "Tapping bids and
     * asks" says a multi-leg structure is built by touching the prices you want,
     * which is what separates it from a dropdown of named strategies — and it
     * describes an interaction rather than promising an outcome.
     */
    body: 'Build a multi-leg structure by tapping the bids and asks you want, and see the whole thing before it is sent.',
  },
  {
    title: 'Greeks, in plain English',
    /*
     * "What is actually driving this position" is the sentence, and it stops
     * short of "so you know what to do". Explaining a number is education;
     * telling someone what the number means for their next order is advice, and
     * that boundary is the one this whole page is built to stay inside.
     */
    body: 'Delta, theta and vega translated into a sentence about what is actually driving the position today.',
  },
  {
    title: 'Low-latency execution',
    /*
     * Slippage is named because it is what the reader actually cares about;
     * "minimise" rather than "eliminate" because no broker eliminates it, and a
     * page that says otherwise has made its first unkeepable promise on the
     * subject a trader is least willing to be lied to about.
     */
    body: 'Orders are routed in milliseconds, because the gap between the price you saw and the price you got is the one nobody advertises.',
  },
  {
    title: 'Your workspace',
    /*
     * Five facts in one sentence, and "nothing to install" is last because it is
     * the one that changes the decision — a terminal that needs a desktop
     * install is a terminal you evaluate on a weekend rather than at 09:15.
     */
    body: 'A widget grid you arrange, symbol groups that move together, pop-outs for a second monitor, saved layouts you switch between, and nothing to install.',
  },
  {
    title: 'Alerts that hold',
    /*
     * "Set once" is the claim. The failure mode this names — an alert that has
     * to be re-armed after it fires, or that dies when the tab closes — is
     * specific enough that a reader who has hit it recognises it immediately,
     * which is the only kind of feature sentence worth writing.
     */
    body: 'Set a condition once and it keeps watching, whether or not the tab is open.',
  },
]
