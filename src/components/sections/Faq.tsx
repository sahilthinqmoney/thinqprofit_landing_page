import { AlertTriangle, ChevronDown } from 'lucide-react'
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
 * Treated as a hairline ledger rather than another card grid: numbered rows,
 * one rule between each, answers indented under the question they belong to.
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
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
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

export default function Faq() {
  return (
    <SectionShell id="faq" heading="Questions worth asking" centered={false}>
      <div className="max-w-4xl border-t border-border-soft">
        {faqs.map((faq, index) => {
          const pending = isResearchFaq(faq) && publishesResearch === null

          return (
            <Reveal key={faq.question} delay={index < 5 ? index * 60 : 0}>
              <details className="group border-b border-border-soft">
                <summary className="flex min-h-11 cursor-pointer list-none items-start gap-4 rounded-lg py-5 pr-1 [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="tabular mt-1 w-6 shrink-0 text-xs font-medium text-fg-muted transition-colors duration-200 group-open:text-accent-soft"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="text-lg font-semibold leading-[1.4] text-fg">{faq.question}</h3>
                    {pending && (
                      <span className="rounded-full border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.12em] text-warning">
                        Answer pending
                      </span>
                    )}
                  </div>

                  <ChevronDown
                    className="mt-0.5 h-5 w-5 shrink-0 text-fg-muted transition-transform duration-200 group-open:rotate-180"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </summary>

                <div className="max-w-2xl pb-6 pl-10 pr-1">
                  <FaqAnswer entry={faq} />
                </div>
              </details>
            </Reveal>
          )
        })}
      </div>
    </SectionShell>
  )
}
