import { Fragment } from 'react'

import Button from '../ui/Button'
import MediaSection from '../ui/MediaSection'
import SectionShell from '../ui/SectionShell'
import { plateImage } from '../../lib/media'

import { terminalIntro, terminalSections } from '../../data/terminal'

/**
 * §7 Terminal — four consecutive full-bleed sections, one claim each.
 *
 * Renders a fragment rather than a wrapper element on purpose. `MediaSection`
 * bleeds to the viewport edge and re-imposes the 1760px cap on its copy alone; a
 * containing `<div>` here would be a second layout box between `<main>` and the
 * sections, and the first thing anyone would do with it is give it padding.
 * `App.tsx` mounts one `<Terminal />` and gets four siblings in the page's
 * normal flow.
 *
 * ---
 *
 * **One claim per section, and why the four are not one.**
 *
 * Robinhood's homepage runs nine sections below the hero and every one holds
 * exactly one item — the section is the unit, and a card is never the unit. This
 * run follows that: four sections, one sentence each, one CTA across all four.
 *
 * Everything that varies between them is driven from `terminalSections` in the
 * data file, which is what keeps the alternation honest — `place` and `scrimAt`
 * are stated per section and the plate reserves the matching side, so a future
 * edit that breaks the left/right/left/right rhythm is visible in one table
 * rather than spread across four components.
 *
 * **`scale="mid"`, not the `tall` default.** `tall` and `SectionShell`'s `lead`
 * resolve to the identical clamp, so Platform above and Safety below both render
 * their H2 at 64px. Four more at 64px would give the scroll six consecutive
 * headings at one size and nothing would read as primary — the two-competing-
 * ladders failure `MediaSection`'s own SCALE comment documents. At `mid` (56px)
 * the four read as one set, a measurable step under both neighbours: Platform
 * names the terminal, these four say what is inside it, Safety says the money is
 * safe.
 *
 * **The known cost, stated rather than hidden.** This makes five consecutive
 * full-bleed sections counting Platform. docs/art-direction.md warns about
 * exactly that monotony — it is why `MobileApp` exists — and the defence here is
 * composition rather than an interruption: the copy side alternates on every
 * section, and the four plates carry four different subjects (a cut and a seated
 * tool, a gate, a witness mark, a stepped bore) shot on one set under one key.
 * If the §5.5 system read ever says the scroll has flattened, the fix is a flat
 * band between the second and third, not a re-render.
 *
 * **WebGL budget: this run adds zero contexts.** The single CTA is
 * `variant="secondary"`, a bordered control with no `LiquidMetalSurface`, so the
 * page stays at ~10–11 against a browser cap near 16 (DESIGN.md §2). Four metal
 * buttons here would have put it at the cap, where the failure is silent — the
 * browser drops the oldest context and the hero's button quietly stops moving.
 *
 * **The plates are placeholders in one specific sense.** They are rendered,
 * gated and shipped, and they are on-brand. But art-direction §3 permits one
 * thing they are not: a screenshot of the real product. When real captures of
 * the copilot actuating, the gate halting, the footprint fidelity badge and the
 * option chain exist, each `media.image` here is a one-line swap and no layout
 * changes.
 */
export default function Terminal() {
  return (
    <Fragment>
      {/*
        The opening band. Flat ink, so it is also the interruption that keeps
        Platform and the four claims from reading as five identical full-bleed
        slabs in a row.

        `fullHeight={false}` — this is punctuation before the run, not a screen of
        its own. TrustStrip takes the same exemption for the same reason: a full
        viewport around two lines of type is a screen of nothing.

        `scale="lead"` puts it at 64px, matching Platform above and Safety below,
        while the four claims underneath sit at `mid` (56px). That is the ranking
        stated in type: this band is a section heading of the same rank as its
        neighbours, and the four claims are its evidence, one step down.
      */}
      <SectionShell
        id="terminal-intro"
        heading={terminalIntro.heading}
        subheading={terminalIntro.subheading}
        scale="lead"
        fullHeight={false}
      />

      {terminalSections.map((section) => (
        <MediaSection
          key={section.id}
          id={section.id}
          height="tall"
          place={section.place}
          anchor="center"
          scale="mid"
          /* 0.86 across all four so the run reads as one shoot. The dense core
             moves with the copy instead — `scrimAt` is per section. */
          scrim={0.86}
          scrimAt={section.scrimAt}
          /* These headings are short — two words a line — so the measure is not
             what breaks them; the `\n` is. It is stated in `em` rather than px
             because the heading is a clamp, so a px measure would be correct at
             exactly one viewport width. */
          measure="9em"
          headline={section.heading}
          body={section.body}
          finePrint={section.finePrint}
          media={{
            alt: PLATE_ALT[section.plate] ?? '',
            image: plateImage(section.plate),
            tone: 'var(--color-bg)',
          }}
          actions={
            section.cta ? (
              <Button href="#final-cta" variant="secondary">
                {section.cta}
              </Button>
            ) : undefined
          }
        />
      ))}
    </Fragment>
  )
}

/**
 * Alt text per plate — docs/art-direction.md's "alt text to ship", verbatim.
 *
 * Keyed by plate rather than by section, and describing the subject rather than
 * naming a file, so it survives both a section being reordered and a plate being
 * re-rendered. It lives here rather than in the data file because it describes
 * the *asset*, not the claim: if a real product screenshot replaces a plate, the
 * alt text has to change with the image and not with the copy.
 */
const PLATE_ALT: Partial<Record<string, string>> = {
  terminal:
    'A machined aluminium slab cut by a single deep channel, one dark tool resting in it.',
  gate: 'Two machined jaws with a narrow slot between them, one blade held part way across it.',
  scale: 'A long shallow score across machined aluminium, with a single punched index mark beside it.',
  bore: 'A stepped bore sunk into machined aluminium, each step catching a thin line of light.',
}
