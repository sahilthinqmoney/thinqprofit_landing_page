/**
 * §4 — "What else is in it". The summary section, and it knows it is one.
 *
 * §3 spends a full screen on one feature. This is the rest of the terminal at
 * one sentence each, and the asymmetry is the design: a reader who was convinced
 * by §3 needs to know the product is not a single trick, and a reader who was
 * not is unlikely to be convinced by a longer list.
 *
 * ── Only the deck lives here ───────────────────────────────────────────────
 *
 * A `capabilities: Capability[]` array of six rows used to sit below, and its
 * `Capability` interface with it. Neither had a reader. The section renders from
 * `DEFAULT_CARDS` in components/lightswind/3d-image-slider.tsx — the card deck
 * needs an image and an eyebrow per row, which this shape never carried — so the
 * two lists drifted: the live one has four cards, this had six, and "Your
 * workspace" and "Alerts that hold" were only ever on the page in this file.
 *
 * They are deleted rather than reconciled, because reconciling them would mean
 * picking which of two decks is the page, and the page has already answered
 * that. If the card content should live in src/data/ — and it probably should —
 * the move is to lift `DEFAULT_CARDS` here with its image paths intact, not to
 * revive a parallel list that renders nowhere.
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
