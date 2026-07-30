import type { LucideIcon } from 'lucide-react'
import { AtSign, Briefcase, MonitorPlay, TrendingUp } from 'lucide-react'
import ChromaticWordmark from '../ui/ChromaticWordmark'
import Container from '../ui/Container'
import { RAIL } from '../ui/SectionShell'
import CopyText from '../ui/CopyText'
import {
  bottomBarLinks,
  brandBlurb,
  brandName,
  copyrightEntity,
  copyrightSuffix,
  footerColumns,
  socials,
} from '../../data/footer'

/**
 * §17 Footer + §18.2 Newsletter. Copy verbatim from docs/landing-page-copy.md.
 *
 * ── The statutory blocks were removed on request ─────────────────────────────
 *
 * §17.3 (registration & entity details), §17.4 (statutory disclosures), §17.5
 * (Attention Investors) and §17.6 (the grievance escalation ladder) are gone.
 * Together they were ~2,100px of the footer's 2,971px.
 *
 * They are not dead code: `registrationLines`, `statutoryDisclosures`,
 * `attentionInvestors`, `grievanceLadder`, `grievanceHeading` and
 * `complaintDataLine` all stay in src/data/footer.ts, unreferenced, with their
 * copy intact. Restoring the blocks is a matter of re-rendering them, not of
 * rewriting the notices.
 *
 * FLAG FOR COMPLIANCE, recorded here because a comment outlives a conversation:
 * the Attention Investors panel is exchange-mandated, the grievance ladder and
 * the statutory disclosures are SEBI-mandated, and the registration codes are a
 * disclosure requirement. A live Indian broker site has to carry all four
 * somewhere. The mandatory market-risk line itself still appears twice on the
 * page — the Hero rail and the FinalCta — so that specific requirement is not
 * lost with this removal, but the other three are.
 *
 * Contrast: all disclosure copy renders at text-fg-muted (13.08:1) or
 * text-warning (7.02:1). Under the previous palette fg-subtle was 3.9:1 and so
 * was banned outright here; it now measures 5.02:1 and clears the floor, but
 * disclosure copy stays on fg-muted anyway. Legal text should not sit at the
 * bottom of the legible range just because it is allowed to — fg-subtle is for
 * footer meta and fine print, and only the bottom bar's separator uses it.
 *
 * Colour: nothing in this footer is coloured except by meaning. With the warning
 * panels gone, every mark, icon and numeral left is `chrome` and `accent-soft` is
 * held to actual links. There is no brand hue to tint anything with.
 *
 * The entity name in the copyright line still renders through `CopyText`, so the
 * unfilled `[PLACEHOLDER]` in it can never be mistaken for finished legal copy.
 */

/**
 * lucide-react v1.27 has no brand glyphs, so each social uses a neutral icon
 * with an explicit aria-label naming the network. No invented imports.
 */
const socialIcons: Record<string, LucideIcon> = {
  AtSign,
  Briefcase,
  MonitorPlay,
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="border-t border-border-soft bg-bg">
      {/* ------------------------------------------------------------------ */}
      {/* 17.1 Brand block                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Container>
        {/* One column, not two. The right half held a bordered newsletter card;
            with the email capture gone the brand block keeps the rail and the
            row reads as a signature rather than as a split banner. */}
        <div className={`py-12 lg:py-16 ${RAIL}`}>
          <div>
            <a
              href="#hero"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-lg"
              aria-label={`${brandName} home`}
            >
              {/* Chrome tile, ink glyph — one mark, identical at every size on
                  the page. Accent belongs to the newsletter submit sitting in
                  the same row; the mark stays a luminance step below it. White
                  on either metal is invisible (1.2:1 / ~2.1:1). */}
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-chrome">
                <TrendingUp className="h-[1.125rem] w-[1.125rem] text-bg" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-fg">{brandName}</span>
            </a>

            {/* Body copy, so it sits at the 16px floor — landing.md §3. */}
            <p className="mt-4 max-w-md text-base leading-relaxed text-fg-muted">{brandBlurb}</p>

            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {socials.map((social) => {
                const Icon = socialIcons[social.icon] ?? AtSign
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={`${brandName} on ${social.label}`}
                      /* Edge goes to chrome on hover, not accent: five social
                         circles pulsing at the action value would read as five
                         primary buttons in the footer. */
                      className="grid h-11 w-11 place-items-center rounded-full border border-border text-fg-muted transition-colors duration-200 hover:border-chrome hover:bg-surface-raised hover:text-fg"
                    >
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* 17.2 Link columns                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <nav aria-label="Footer" className={`py-12 ${RAIL}`}>
            {/* Five columns of five. At eight they were 120px strips of grey
                type; five hold a readable width on one row from lg up, and step
                to 2-up on a phone where the labels need the measure. */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {footerColumns.map((column) => (
                <div key={column.heading}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg">
                    {column.heading}
                  </h3>
                  {/* min-h-11 gives the 44px tap target; space-y-2 gives the 8px
                      separation between adjacent targets — landing.md §9. The
                      two are separate requirements and min-h alone met only one. */}
                  <ul className="mt-3 space-y-2">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="-mx-1 flex min-h-11 items-center rounded px-1 text-[0.8125rem] leading-relaxed text-fg-muted transition-colors duration-200 hover:text-fg"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 17.7 Brand lockup                                                   */}
      {/* ------------------------------------------------------------------ */}
      {/* Outside Container deliberately — the mark runs to the viewport edges.
          A wordmark this size that stops inside a 1760px rail reads as an
          oversized heading rather than as a stamp on the page. It sits above the
          bottom bar so the legal line stays the last thing in the document. */}
      <div className="border-t border-border-soft pt-14 sm:pt-16 lg:pt-20">
        <ChromaticWordmark />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 17.8 Bottom bar                                                     */}
      {/* ------------------------------------------------------------------ */}
      {/* No top border: the wordmark above is already the terminal gesture, and
          a rule between them would read as the mark being fenced off. */}
      <div>
        <Container>
          <div className={`flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between ${RAIL}`}>
            <p className="text-xs leading-relaxed text-fg-muted">
              © <span className="tabular">{year}</span>{' '}
              <CopyText as="span" source={copyrightEntity} />. {copyrightSuffix}
            </p>

            {/* gap-x-2 either side of the separator keeps ~12px between the
                padded hit areas of adjacent links, past the 8px floor. */}
            <ul className="flex flex-wrap items-center gap-x-2 text-xs">
              {bottomBarLinks.map((link, index) => (
                <li key={link} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-fg-subtle">
                      ·
                    </span>
                  )}
                  <a
                    href="#"
                    className="-mx-1 inline-flex min-h-11 items-center rounded px-1 text-fg-muted transition-colors duration-200 hover:text-fg"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  )
}
