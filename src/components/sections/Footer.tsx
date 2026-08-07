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

export default function Footer() {
  const year = new Date().getFullYear()

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
                  <dt className="text-xs font-medium text-fg-subtle">{line.label}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-fg-muted font-normal">
                    {line.value}
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
                  <p className="text-xs leading-relaxed text-fg-muted">{note.content}</p>
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
      {/* 4. Statutory Disclaimers                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className={`py-10 lg:py-14 ${RAIL} space-y-6 text-xs leading-relaxed`}>
            <h2 className="text-sm font-semibold text-fg tracking-tight">
              Statutory Disclaimers
            </h2>
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
              Money Logix Private Ltd | CIN: U64990MH2006PTC165522 | SEBI Reg: INZ000235531
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
