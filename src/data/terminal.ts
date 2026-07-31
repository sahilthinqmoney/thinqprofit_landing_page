import type { PlateId } from '../lib/media'

/**
 * §7 Terminal — four consecutive full-bleed sections, one claim each.
 *
 * The section exists because the two around it make different kinds of
 * statement and neither makes this one. Platform says *there is a terminal and
 * here is what it has* — four bare capability names on rules. Safety says *your
 * money is held safely*. Between them there was nothing saying what the terminal
 * actually does that a competitor's does not, and that is the only part of this
 * page a rival cannot answer by shipping the same feature list.
 *
 * **Two of the four claims are restraints, and they are not fine print.** This is
 * the whole argument. Robinhood's own Cortex disclosure concedes the assistant
 * "may contain errors, inaccuracies, omissions, or outdated information" — in a
 * linked PDF, not on the page a customer reads. Groww puts greeks on the option
 * chain and says nothing anywhere about where the numbers underneath them came
 * from. Nobody in this market advertises a limit. We state two at the same rank
 * as the two powers: an AI permitted to stop mid-sentence, and a bar that labels
 * itself `inferred` before anyone asks. Demote either into a disclosure and this
 * becomes the Cortex-PDF structure it is meant to beat.
 *
 * ---
 *
 * **Why one claim per section rather than four in one.**
 *
 * Robinhood's homepage runs nine sections below the hero and every one of them
 * contains exactly one item — there is no feature grid anywhere on the page. The
 * section is the unit; a card is never the unit. Groww does the opposite, and its
 * F&O block fires four different `Explore …` CTAs inside one screen, which
 * shatters a section into four exits and reads as a directory rather than as a
 * claim.
 *
 * So: four sections, one claim each, and **one CTA across all four**, on the
 * last. The page's actual conversion points are the hero and the closing
 * section; a button under every claim would compete with both and with itself.
 *
 * **Composition alternates and that is structural.** DESIGN.md §5.5 rejects two
 * neighbours sharing a composition — "if two neighbours put their subject in the
 * same place, the scroll flattens". Platform directly above parks its copy
 * right, so this run goes left, right, left, right, and each section's plate
 * reserves the side its copy lands on. Four different subjects, one shoot.
 *
 * ---
 *
 * **Why there are no statistics, badges or mockups.**
 *
 * An earlier pass shipped this as four spotlight blocks with stat pairs
 * (`102 Cases`, `194 Built-in`, `99.99% uptime`), `TIER 1 —` eyebrow badges, an
 * emerald accent, a six-card icon grid, and four rendered terminal panels
 * carrying live-looking prices. It read as generated, and every element in that
 * list is refused somewhere this repo already writes down:
 *
 *  - **The figures.** All true, none verified in a shipped artefact, so DESIGN.md
 *    §9 makes each a `[BRACKETED]` `CopyText` placeholder or nothing. A stat band
 *    is also the one competitor move worth refusing on merit: an uptime or
 *    latency number costs the vendor nothing to print and cannot be checked from
 *    a landing page. The claim that persuades is the one that costs us
 *    something — which is exactly why the fidelity labels below stay in.
 *  - **The mockups.** They rendered NIFTY at 24,500, open-interest figures,
 *    greeks and a rupee-per-day P&L. DESIGN.md §8 refuses fabricated market data
 *    outright, and docs/art-direction.md §2.1 bans any price, percentage,
 *    currency symbol or P&L "including partial, out of focus, or on a reflected
 *    surface". On a regulated broker's page an invented price is not a texture.
 *  - **The green.** DESIGN.md §2 quarantines `gain` and `loss` to live market
 *    data: they appear on no button, badge, link or illustration, because a green
 *    mark on a trading page is an implied promise.
 *  - **The headline.** It was "Engineered for Elite Traders", which is 915 by
 *    Groww's own line. All four competitor pages lead with an adjective about the
 *    trader — Elite, Pro, Command Center, Super-powered. These lead with verbs
 *    about the terminal.
 */

/**
 * The band that opens the run.
 *
 * It is a heading and a deck on flat ink — not an eyebrow, and not a label. The
 * distinction matters because DESIGN.md §3 removed the eyebrow prop outright:
 * "a category label sitting above a heading is decoration wearing the costume of
 * information". A category label would be the word *Terminal* set small above the
 * first claim. This is a section in its own right, and it makes the argument the
 * four claims then evidence — which is why it is a sentence with a verb in it
 * rather than a noun phrase.
 *
 * It does a second job. Platform above is full-bleed and so are all four claims,
 * which would put five consecutive full-bleed sections in the scroll — the
 * monotony docs/art-direction.md warns about and `MobileApp` exists to break.
 * A flat band here is the interruption, and it costs nothing because the run
 * needed an opening statement anyway.
 *
 * The copy states the wedge outright: two of the four claims are powers and two
 * are restraints, and no competitor states a restraint on the page a customer
 * reads. Saying so before the evidence is what stops the two admissions reading
 * as hedges when the reader reaches them.
 */
export const terminalIntro = {
  /* `\n` honoured at ≥768px only. The break isolates "and what it admits",
     which is the half of the sentence no rival page contains. */
  heading: 'What the terminal does,\nand what it admits',
  subheading:
    'Two things it can do that the platform you use today cannot, and two things it tells you about itself before you ask.',
}

export interface TerminalSectionSpec {
  /** Anchor id. Also the §5.1 page-shot key. */
  id: string
  /** Which rendered plate backs it. Swap for a real product capture when one exists. */
  plate: PlateId
  /**
   * Which side the copy parks on. The plate reserves the same side, and the
   * sequence alternates so no two neighbours share a composition (§5.5).
   */
  place: 'left' | 'right'
  /** Scrim's dense core — under the copy, never in the middle of the frame. */
  scrimAt: string
  /** `\n` is an art direction, honoured at ≥768px only (DESIGN.md §3). */
  heading: string
  /** One sentence. Robinhood's nine homepage sections never exceed one. */
  body: string
  /**
   * Pinned to the claim it qualifies, not batched into the footer. Robinhood's
   * homepage does this; its Legend page and every Groww page batch instead. A
   * process claim and a fidelity label are meaningless if the qualifier is four
   * thousand pixels away.
   */
  finePrint?: string
  /** Present on the last section only — see the header note on Groww's four exits. */
  cta?: string
}

/**
 * Ordered as an argument rather than as an inventory: a power, its restraint, a
 * restraint, its power. Reading down, the run alternates between what the
 * terminal can do and what it admits — the shape of the claim, not a rhythm
 * applied to it.
 *
 * ThinqScript and the Pine transpiler are deliberately absent. They are a real
 * differentiator and they need a paragraph to land — "a superset of Pine, so the
 * community's scripts import wholesale" is a claim a reader has to be walked
 * through, and a one-sentence section gives it one clause. It belongs on the tour
 * page the CTA points at, beside the dual-broker failover feed, for the same
 * reason Platform's ten capability descriptions went there.
 */
export const terminalSections: TerminalSectionSpec[] = [
  {
    id: 'terminal',
    plate: 'terminal',
    place: 'left',
    scrimAt: '26% 50%',
    /* "has hands" isolated on its own line: the phrase is the entire claim, and
       it is the one a reader who has used a chat-in-a-sidebar product feels
       immediately. */
    heading: 'The copilot\nhas hands',
    body: 'Ask for a 20-EMA on the 5-minute and it draws it, sets the timeframe and runs the scan.',
  },
  {
    id: 'terminal-gate',
    plate: 'gate',
    place: 'right',
    scrimAt: '74% 50%',
    heading: 'Every sentence\nis gated',
    body: 'Each answer, and each line inside it, clears compliance before it renders; a failing line halts.',
    /* A process claim needs its qualifier in the same frame. "Clears compliance
       before it renders" describes what is *published* — it says nothing about
       whether a view is correct, and must never be edited into something that
       does. SEBI Reg 16C is why the gate exists; naming the regulation here would
       read as a claim of approval by it, so it stays out. */
    finePrint: 'AI output is market commentary, not investment advice.',
  },
  {
    id: 'terminal-flow',
    plate: 'scale',
    place: 'left',
    scrimAt: '26% 50%',
    heading: 'Order flow,\nlabelled',
    body: 'Footprint, depth ladder, tape and CVD on NSE and MCX; each bar marked tape, inferred or approximated.',
    /* The ceiling, stated rather than hidden. NSE publishes best-5 depth to
       retail; a vendor claiming full-depth order flow on Indian data is either
       reconstructing it or misleading. Saying so is the differentiator — the
       words `inferred` and `approximated` cost us something to print, which is
       what makes the claim believable to a trader who has been burned by a
       footprint chart that was quietly modelled. */
    finePrint: 'Depth is exchange best-5 where the exchange publishes best-5.',
  },
  {
    id: 'terminal-options',
    plate: 'bore',
    place: 'right',
    scrimAt: '74% 50%',
    heading: 'Options live\non the chart',
    body: 'Greeks, OI drawn at the strikes, max pain, GEX, IV skew and a multi-leg payoff builder.',
    /* The run's only CTA. It points at the closing section rather than a tour
       page that does not exist yet; when one does, this is the single string to
       change. */
    cta: 'See the terminal',
  },
]
