import { ChevronDown, TriangleAlert } from 'lucide-react'
import SectionShell from '../ui/SectionShell'
import Reveal from '../ui/Reveal'
import CopyText from '../ui/CopyText'
import { faqs, isResearchFaq, publishesResearch, researchDecisionInstruction } from '../../data/faq'
import type { FaqEntry } from '../../data/faq'

/**
 * §14 FAQ — "Questions worth asking".
 *
 * Native <details>/<summary>, so it is keyboard-operable and screen-reader
 * correct without any state of our own, and — deliberately — without a `name`
 * attribute, which would force items closed when another opens. Comparing two
 * answers side by side is the whole point of an FAQ.
 *
 * The 01–12 ordinals are gone. Numbering is a claim about order, and these
 * questions have none: "Where are my shares held?" is not the fourth step of
 * anything, and a reader never returns to "question 09". All the ordinals did
 * was give each row a second column to indent past. Without them the question
 * starts at the container's left edge, the answer starts directly beneath it,
 * and the section loses a whole column of chrome.
 *
 * What replaces the decoration is restraint applied to the parts that actually
 * respond to the reader: a 56px minimum row with ~64px of vertical padding, so
 * a closed list reads as a set of considered statements rather than a menu; a
 * bottom hairline that lifts from `border-soft` to `border` when its row opens,
 * which is how an open row is marked without a fill or a highlight; and a
 * chevron that turns on `--ease-out-expo`, the same curve everything else on
 * the page decelerates on.
 */

/**
 * FAQ 7 has two mutually exclusive answers and no decision yet (`publishesResearch`
 * is null). Publishing both would have the page claim simultaneously that we do
 * not advise and that we publish research — a misstatement to a regulator. Until
 * the flag is set the answer slot renders as an explicit unresolved state; once
 * it is true or false exactly one answer is published and this block disappears.
 */
function FaqAnswer({ entry }: { entry: FaqEntry }) {
  const bodyClass = 'text-base leading-relaxed text-fg-muted'

  if (!isResearchFaq(entry)) {
    return <CopyText source={entry.answer} className={bodyClass} />
  }

  if (publishesResearch !== null) {
    return (
      <CopyText
        source={publishesResearch ? entry.answerWithResearch : entry.answerNoResearch}
        className={bodyClass}
      />
    )
  }

  return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 sm:p-5">
      <p className="flex items-start gap-2 text-base font-semibold leading-relaxed text-warning">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        Not answered yet — pending a business decision
      </p>

      <p className={`mt-3 ${bodyClass}`}>
        This question is blocked on open question 3 in the copy deck: whether ThinqProfit
        publishes research. Exactly one of the two options below will be published. Neither is
        live copy today, and they cannot both be true.
      </p>

      <p className={`mt-2 ${bodyClass}`}>
        Copy deck says: <CopyText as="span" source={researchDecisionInstruction} />
      </p>

      <ul className="mt-4 space-y-4">
        <li className="border-l border-warning/30 pl-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-warning">
            Option A — if we do not publish research
          </p>
          <CopyText source={entry.answerNoResearch} className={`mt-1.5 ${bodyClass}`} />
        </li>
        <li className="border-l border-warning/30 pl-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-warning">
            Option B — if we do
          </p>
          <CopyText source={entry.answerWithResearch} className={`mt-1.5 ${bodyClass}`} />
        </li>
      </ul>
    </div>
  )
}

/**
 * One row. The hairline is on the <details> itself rather than on the summary,
 * so it sits under the answer while the row is open and the rule always marks
 * the end of the whole item.
 */
function FaqRow({ entry, delay }: { entry: FaqEntry; delay: number }) {
  const pending = isResearchFaq(entry) && publishesResearch === null

  return (
    <Reveal delay={delay}>
      <details className="group border-b border-border-soft transition-colors duration-300 open:border-border hover:border-chrome-dim/40">
        <summary className="flex min-h-14 cursor-pointer list-none items-start justify-between gap-6 py-7 sm:py-8 [&::-webkit-details-marker]:hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-lg font-medium leading-[1.4] text-fg sm:text-xl">
              {entry.question}
            </h3>
            {pending && (
              <span className="rounded-full border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.12em] text-warning">
                Answer pending
              </span>
            )}
          </div>

          {/* Rotates on the page's shared deceleration curve — a chevron that
              snaps on `linear` is the one piece of an accordion everybody
              notices when it is wrong. */}
          <ChevronDown
            className="mt-1 h-5 w-5 shrink-0 text-fg-muted transition-[transform,color] duration-500 group-hover:text-fg group-open:rotate-180 group-open:text-accent-soft"
            style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </summary>

        {/* Answers stay on a readable measure even when the row itself is wider,
            and keep clear of the chevron's column. */}
        <div className="max-w-[68ch] pb-8 pr-8">
          <FaqAnswer entry={entry} />
        </div>
      </details>
    </Reveal>
  )
}

/**
 * Twelve rows at this height read as a very long, very thin list once the page
 * container passes ~1300px, so from `xl` the list splits into two columns that
 * each keep their own top rule. Reading order runs down column one, then column
 * two — and with the ordinals gone nothing has to be renumbered to say so.
 */
const COLUMN_SIZE = Math.ceil(faqs.length / 2)

const faqColumns = [
  { id: 'faq-column-1', entries: faqs.slice(0, COLUMN_SIZE) },
  { id: 'faq-column-2', entries: faqs.slice(COLUMN_SIZE) },
]

export default function Faq() {
  return (
    <SectionShell id="faq" heading="Questions worth asking" centered={false}>
      {/* Capped at 1440 rather than left to run to the full 1760 — past that a
          question sits a very long way from its own chevron. */}
      <div className="max-w-4xl border-t border-border-soft xl:grid xl:max-w-[1440px] xl:grid-cols-2 xl:gap-x-16 xl:border-t-0">
        {faqColumns.map((column) => (
          <div key={column.id} className="xl:border-t xl:border-border-soft">
            {column.entries.map((faq, position) => (
              <FaqRow
                key={faq.question}
                entry={faq}
                delay={position < 5 ? position * 60 : 0}
              />
            ))}
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
