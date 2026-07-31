/**
 * §7 Terminal — what is inside the platform Platform names.
 *
 * The section exists because the two sections around it make different kinds of
 * statement and neither makes this one. Platform says *there is a terminal and
 * here is what it has* — four bare capability names on rules. Safety says *your
 * money is held safely*. Between them there was nothing saying what the terminal
 * actually does that a competitor's does not, and that is the only part of this
 * page a rival cannot answer by shipping the same feature list.
 *
 * **Two of the four claims are restraints, and they are not fine print.** This is
 * the section's whole argument. Robinhood's own Cortex disclosure concedes the
 * assistant "may contain errors, inaccuracies, omissions, or outdated
 * information" — in a linked PDF, not on the page a customer reads. Groww puts
 * greeks on the option chain and says nothing anywhere about where the numbers
 * underneath them came from. Nobody in this market advertises a limit. We state
 * two at the same rank as the two powers: an AI that is permitted to stop
 * mid-sentence, and a bar that labels itself `inferred` before anyone asks.
 * Demote either into the disclosure and this becomes the Cortex-PDF structure it
 * is meant to beat.
 *
 * Copy constraints that are load-bearing rather than stylistic:
 *
 *  - **No numbers.** The real figures behind these claims — the size of the
 *    compliance suite, the tool count, the indicator count — are all true and
 *    none is verified in a shipped artefact, so DESIGN.md §9 makes each one a
 *    `[BRACKETED]` `CopyText` placeholder or nothing. In a section this short,
 *    nothing.
 *  - **Item 2 is a process claim and its wording carries that.** "Clears
 *    compliance before it renders" describes what is *published*. It says
 *    nothing about whether a view is correct, and it must never be edited into
 *    something that does.
 *  - **The fidelity words stay ugly.** `tape`, `inferred`, `approximated` are the
 *    differentiator precisely because they cost us something to print. Softening
 *    them deletes the reason the claim is believable.
 *
 * Every string is set as running prose rather than as a list. See
 * `Terminal.tsx` for why the page's hairline vocabulary is not available here.
 */

/**
 * One capability: a run-in lead that is a claim in its own right, and the
 * sentence that qualifies it.
 *
 * Local to this file rather than added to `src/types.ts`. `Tool` there is a
 * `{ title, icon }` pair for Platform's bare-name list and this is not that
 * shape — it has no icon, and it never will (DESIGN.md §8 refuses the icon
 * tile). A shared type would have to grow an optional field to cover both,
 * which is how one type becomes two shapes wearing one name.
 */
export interface Capability {
  /**
   * Weight 600, `fg`, terminated by a full stop, set inline. It must be a
   * predicated clause of two to five words — "The copilot has hands.", never
   * "Actuation." A bare noun in front of a sentence is an eyebrow that has been
   * moved inline, and DESIGN.md §3 removed the eyebrow prop so it could not come
   * back by reflex. This is the door it would come back through.
   */
  lead: string
  /** Weight 400, `fg-muted`, continuing the same sentence flow. */
  body: string
}

/**
 * Art-directed rag, honoured at ≥768px only (DESIGN.md §3).
 *
 * Line one is 18 characters and sets at ~96% of the 9em measure at the `mid`
 * cap; line two at ~72% of line one. That ratio is doing real work — the
 * headline, the deck and the recital all terminate within 6px of each other, so
 * the block has a right edge nobody drew, and the effect only exists if line one
 * actually reaches its measure.
 *
 * The break also splits the section's two halves: the terminal *acts*, and it
 * *labels* what it did. Two powers and two restraints, stated in five words.
 */
export const terminalHeading = 'The terminal acts,\nand labels it'

/**
 * Two lines at the deck step. "Plain words" rather than "natural language"
 * because the second is a vendor's phrase for a thing the reader experiences as
 * the first.
 */
export const terminalSubheading =
  'Ask in plain words and the chart changes. Everything it tells you says where it came from.'

export const terminalCta = 'See the terminal'

/**
 * Four, ordered as an argument rather than as an inventory: a power, its
 * restraint, a restraint, its power. Reading down, the section alternates
 * between what the terminal can do and what it admits — which is the shape of
 * the claim, not a rhythm applied to it.
 *
 * Each is exactly two rendered lines at the 510px measure (104–124 characters
 * including the lead). That is a hard constraint, not a target: the section's
 * vertical budget at 1440×900 is 708px and the stack fills it exactly, so a
 * third line on any item pushes the section past the full-screen rhythm.
 */
export const capabilities: Capability[] = [
  {
    lead: 'The copilot has hands.',
    body: 'Ask for a 20-EMA on the 5-minute and it draws it, sets the timeframe and runs the scan.',
  },
  {
    lead: 'Every sentence is gated.',
    body: 'Each answer, and each line inside it, clears compliance before it renders; a failing line halts.',
  },
  {
    lead: 'Order flow, labelled.',
    body: 'Footprint, depth, tape and CVD on NSE and MCX. Every bar is marked tape, inferred or approximated.',
  },
  {
    lead: 'Options live on the chart.',
    body: 'Greeks, OI drawn at the strikes, max pain, GEX, IV skew and a multi-leg payoff builder.',
  },
]

/**
 * One line, ≤90 characters at the 13px `finePrint` step.
 *
 * It qualifies the two claims directly above it and sits in the same block as
 * them, which is deliberate: Robinhood's homepage pins each qualifier under the
 * section it qualifies, while its Legend page and every Groww page batch them
 * into a footer thousands of pixels away. A process claim and a fidelity label
 * are meaningless if their qualifier is somewhere else.
 */
export const terminalFinePrint =
  'AI output is market commentary, not investment advice. Data fidelity is labelled per bar.'

/**
 * §A8's "alt text to ship", verbatim. It describes the subject rather than
 * naming a file, so it survives the plate being re-rendered.
 */
export const terminalPlateAlt =
  'A machined aluminium slab cut by a single deep channel, one dark tool resting in it.'
