import { useEffect, useState } from 'react'
import ChromaticWordmark from '../ui/ChromaticWordmark'
import Container from '../ui/Container'
import { RAIL } from '../../lib/layout'
import {
  registrationDetails,
  brandOwnershipStatement,
  communicationDisclaimer,
  investorAwarenessNotes,
  complaintsProcedures,
  vernacularDownloads,
  advisoryGuidelines,
  importantLinks,
  disclaimers,
  copyrightEntity,
  copyrightSuffix,
} from '../../data/footer'

/**
 * Prints text, drawing any `[ ... ]` span in warning amber.
 *
 * The bracket is the convention this footer uses for a value compliance has
 * not supplied yet, and go-live-checklist.md asks for exactly this treatment:
 * an unfilled registration or contact must be impossible to miss, so it cannot
 * ship because nobody looked. Previously only the registration block honoured
 * it, so a blank anywhere else — a fraud-reporting contact, say — would have
 * read as ordinary body copy.
 */
function WithBlanks({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]*\])/g).map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <span key={i} className="text-warning font-mono not-italic">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export default function Footer() {
  const year = useCopyrightYear()


  return (
    <footer id="footer" className="border-t border-border-soft bg-transparent text-fg-muted">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Registration & Entity Details                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className={`py-10 lg:py-14 ${RAIL} space-y-6`}>
            <h2 className="text-sm font-semibold text-fg tracking-tight">
              Registration and Entity Details
            </h2>

            <dl className="grid gap-x-12 gap-y-5 md:grid-cols-2 lg:gap-x-16">
              {registrationDetails.map((line) => (
                <div key={line.label}>
                  <dt className="text-xs font-semibold text-fg">{line.label}</dt>
                  <dd
                    className={`mt-1 text-xs leading-relaxed font-normal ${
                      line.isPlaceholder ? 'text-white/40 italic font-mono' : 'text-fg-muted'
                    }`}
                  >
                    {line.value.split('\n').map((str, idx) => (
                      <span key={idx} className="block my-0.5">
                        <WithBlanks text={str} />
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="pt-2 space-y-2 text-xs leading-relaxed text-fg-subtle border-t border-border-soft/50">
              <p>{brandOwnershipStatement}</p>
              <p className="italic">{communicationDisclaimer}</p>
            </div>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Attention Investors & Safeguards                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className={`py-10 lg:py-14 ${RAIL} space-y-6`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-fg tracking-tight">
                Attention Investors & Investor Safeguards
              </h2>
              <span className="text-xs text-fg-subtle">Issued in the interest of investors</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-x-12">
              {investorAwarenessNotes.map((note) => (
                <div key={note.title} className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-fg">{note.title}</h3>
                  <p className="text-xs leading-relaxed text-fg-muted">
                    <WithBlanks text={note.content} />
                  </p>
                  {note.bullets ? (
                    <ol className="mt-1.5 space-y-1 text-xs leading-relaxed text-fg-muted list-decimal pl-4 marker:text-fg-subtle">
                      {note.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Grievance Redressal, SCORES & Important Links                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className={`py-10 lg:py-14 ${RAIL} space-y-8`}>
            <h2 className="text-sm font-semibold text-fg tracking-tight">
              Grievance Redressal & Portal Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-x-12 text-xs leading-relaxed">
              {/* SMART ODR */}
              <div className="space-y-1.5">
                <h3 className="font-semibold text-fg">SMART ODR Portal</h3>
                <p className="text-fg-muted">{complaintsProcedures.smartODR}</p>
              </div>

              {/* SEBI SCORES */}
              <div className="space-y-1.5">
                <h3 className="font-semibold text-fg">SEBI SCORES Portal</h3>
                <p className="text-fg-muted">{complaintsProcedures.sebiScores}</p>
                <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
                  <a
                    href={complaintsProcedures.scoresUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg underline underline-offset-4 hover:text-white"
                  >
                    SCORES Portal
                  </a>
                  <span className="text-fg-subtle">•</span>
                  <a
                    href={complaintsProcedures.scoresAndroidUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg underline underline-offset-4 hover:text-white"
                  >
                    Android App
                  </a>
                  <span className="text-fg-subtle">•</span>
                  <a
                    href={complaintsProcedures.scoresIosUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg underline underline-offset-4 hover:text-white"
                  >
                    iOS App
                  </a>
                </div>
              </div>
            </div>

            {/* Vernacular Downloads & Advisory Guidelines */}
            <div className="grid gap-6 md:grid-cols-2 text-xs leading-relaxed pt-2 border-t border-border-soft/50">
              <div className="space-y-1.5">
                <p className="font-medium text-fg">{vernacularDownloads.label}</p>
                <div className="flex items-center gap-3">
                  {vernacularDownloads.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-fg underline underline-offset-4 hover:text-white"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="font-medium text-fg">{advisoryGuidelines.label}</p>
                <div className="flex items-center gap-3">
                  {advisoryGuidelines.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-fg underline underline-offset-4 hover:text-white"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Regulatory Links */}
            <div className="pt-2 border-t border-border-soft/50 space-y-3">
              <h3 className="text-xs font-semibold text-fg">Important Regulatory Links</h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                {importantLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-fg-muted underline underline-offset-4 hover:text-fg transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Statutory Disclaimers & SEBI Risk Disclosure                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className={`py-10 lg:py-14 ${RAIL} space-y-6 text-xs leading-relaxed`}>
            <h2 className="text-sm font-semibold text-fg tracking-tight">
              Statutory Disclaimers & Risk Disclosures
            </h2>

            {/* SEBI Annexure-I Risk Disclosures on Derivatives Box */}
            <div className="rounded-2xl border border-white/20 bg-white/[0.03] p-5 space-y-3">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <span className="font-mono font-bold text-white tracking-wider text-xs uppercase bg-white/10 px-2.5 py-1 rounded">
                  SEBI Annexure-I
                </span>
                <span className="font-bold text-white text-xs sm:text-sm">
                  RISK DISCLOSURES ON DERIVATIVES
                </span>
              </div>

              <ul className="space-y-2 text-xs text-white/80 list-disc pl-4 leading-relaxed">
                <li>9 out of 10 individual traders in equity Futures and Options Segment, incurred net losses.</li>
                <li>On an average, loss makers registered net trading loss close to ₹ 50,000.</li>
                <li>Over and above the net trading losses incurred, loss makers expended an additional 28% of net trading losses as transaction costs.</li>
                <li>Those making net trading profits, incurred between 15% to 50% of such profits as transaction cost.</li>
              </ul>

              <div className="pt-2 text-[11px] text-white/60 border-t border-white/10">
                <span className="font-semibold text-white/80">Source:</span> 1. SEBI study dated January 25, 2023 on "Analysis of Profit and Loss of Individual Traders dealing in equity Futures and Options (F&O) Segment", wherein Aggregate Level findings are based on annual Profit/Loss incurred by individual traders in equity F&O during FY 2021-22.
              </div>
            </div>

            {disclaimers.map((d) => (
              <div key={d.title} className="space-y-1">
                <h3 className="font-semibold text-fg">{d.title}</h3>
                <p className="text-fg-muted">{d.content}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 5. Brand Lockup & Copyright                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft pt-14 sm:pt-16 lg:pt-20">
        <ChromaticWordmark />
      </div>

      <div>
        <Container>
          <div className={`py-7 ${RAIL} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-fg-muted`}>
            <p>
              © <span className="tabular">{year}</span> {copyrightEntity}. {copyrightSuffix}
            </p>
            <p className="text-fg-subtle text-[11px]">
              Money Logix Securities Pvt Ltd | CIN: U64990MH2006PTC165522 | SEBI Reg: INZ000235531
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}

/**
 * The copyright year, without making it a hydration mismatch.
 *
 * The page is prerendered, so anything computed during render happens twice:
 * once at build time and once in the reader's browser. `new Date()` is the
 * classic way to get two different answers — a build in December read in
 * January — and in React 19 a single mismatched text node is not a local
 * repair. It fails hydration for the whole root and re-renders the entire page
 * client-side, which is precisely the rebuild the prerender exists to avoid.
 * A stale footer year would have cost the page its opening animation.
 *
 * So the first render is the build year on both sides, exactly, and the live
 * year is applied afterwards — a no-op update on every day but one.
 */
function useCopyrightYear(): number {
  const [year, setYear] = useState(__BUILD_YEAR__)

  useEffect(() => {
    const now = new Date().getFullYear()
    setYear((current) => (current === now ? current : now))
  }, [])

  return year
}
