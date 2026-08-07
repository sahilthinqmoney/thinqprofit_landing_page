import ChromaticWordmark from '../ui/ChromaticWordmark'
import Container from '../ui/Container'
import { RAIL } from '../ui/SectionShell'
import CopyText from '../ui/CopyText'
import Disclosure from '../ui/Disclosure'
import {
  copyrightEntity,
  copyrightSuffix,
  registrationLines,
  scoresLink,
  statutoryDisclosures,
} from '../../data/footer'

/**
 * §8 — Footer and legal.
 *
 * ── The statutory blocks are back, and this is the reversal of a mistake ──
 *
 * A previous pass removed the registration block, the statutory disclosures and
 * the grievance route from this footer, leaving a comment flagging that "a live
 * Indian broker site has to carry all four somewhere". That flag is now answered
 * rather than restated: all of it renders, in full, below.
 *
 * The reason it was removed — ~2,100px of legal text at the foot of a page — was
 * a real problem with a wrong solution. The problem was that the material was
 * competing with five columns of navigation links, a newsletter card and a
 * social row. Those are gone (see src/data/footer.ts), so the legal blocks are
 * no longer buried under marketing chrome; they are the only thing down here,
 * which is what a broker's footer is actually for.
 *
 * ── What the reader gets, in order ───────────────────────────────────────
 *
 *   1. The tagline. The page's last argument before its legal obligations.
 *   2. The registration block — entity, CIN, office, SEBI and exchange codes,
 *      compliance officer, grievance contact. Every value is an unfilled
 *      placeholder and renders visibly flagged through `CopyText`.
 *   3. The SCORES route, as a working link rather than a mention.
 *   4. Five mandatory disclosures, ordered by which claim on the page each one
 *      answers — see the note in src/data/footer.ts.
 *   5. The giant wordmark, then the copyright line.
 *
 * ── Colour ───────────────────────────────────────────────────────────────
 *
 * Nothing here is coloured except by meaning. Disclosure copy is `fg-muted`,
 * never `fg-subtle`: legal text should not sit at the bottom of the legible
 * range just because it is allowed to. The one `risk`-toned block (derivatives)
 * takes the warning treatment, which is a box and an icon as well as a hue —
 * because the amber is the accent's nearest chromatic neighbour and meaning
 * never rests on hue alone.
 *
 * The one warm object below the fold is the giant wordmark, which is the page's
 * §07 "brand surface where the accent leads" case. The small mark in the brand
 * row above it is neutral steel, because it shares a row with body copy.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="border-t border-border-soft bg-transparent">



      {/* ------------------------------------------------------------------ */}
      {/* 8.2 Compliance and registration                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className={`py-12 lg:py-16 ${RAIL}`}>
            <h2 className="text-sm font-semibold text-fg">Registration and entity details</h2>

            {/*
              A `<dl>` of label/value pairs, two columns from md.

              Every value is a `[PLACEHOLDER]` and renders in warning amber with
              a dotted underline through `CopyText` — which is the entire point:
              an unfilled SEBI registration number must be impossible to mistake
              for a real one at a glance. Publishing an invented registration
              code is a regulatory offence, not a typo, and this treatment is the
              mechanism that stops it happening by inattention.
            */}
            <dl className="mt-6 grid gap-x-12 gap-y-5 md:grid-cols-2 lg:gap-x-20">
              {registrationLines.map((line) => (
                <div key={line.label}>
                  <dt className="text-[0.8125rem] leading-snug text-fg-subtle">{line.label}</dt>
                  <CopyText
                    as="dd"
                    source={line.value}
                    className="mt-1 text-sm leading-relaxed text-fg-muted"
                  />
                </div>
              ))}
            </dl>

            {/*
              SCORES, as a real anchor. `rel="noreferrer"` with `target="_blank"`:
              a link that opens a new tab and passes `window.opener` gives the
              destination a handle on this page.

              It is the one non-placeholder link in this footer, because it is the
              one destination that exists and is not ours.
            */}
            <p className="mt-8 max-w-[46em] text-sm leading-relaxed text-fg-muted">
              {scoresLink.before}
              <a
                href={scoresLink.href}
                target="_blank"
                rel="noreferrer"
                className="rounded text-accent-soft underline underline-offset-4 transition-colors duration-200 hover:text-fg"
              >
                {scoresLink.linkLabel}
              </a>
              {scoresLink.after}
            </p>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 8.3 Mandatory disclaimers                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className={`py-12 lg:py-16 ${RAIL}`}>
            <h2 className="text-sm font-semibold text-fg">Disclosures</h2>

            <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-x-20">
              {statutoryDisclosures.map((item) => (
                <section key={item.id} aria-labelledby={`disclosure-${item.id}`}>
                  <h3
                    id={`disclosure-${item.id}`}
                    className="text-[0.8125rem] font-medium leading-snug text-fg"
                  >
                    {item.title}
                  </h3>
                  {/*
                    `risk` blocks route through `Disclosure`, which gives them the
                    ruled box and the TriangleAlert glyph. `note` blocks render as
                    plain paragraphs through `CopyText`, which is what keeps their
                    `[BRACKETED]` compliance placeholders flagged.

                    Only one block is `risk` — the derivatives disclosure. If
                    every block were boxed, the box would stop meaning anything,
                    which is the failure mode of a footer where all legal text
                    looks equally alarming and none of it gets read.
                  */}
                  {item.tone === 'risk' ? (
                    <Disclosure tone="risk" className="mt-2">
                      {item.body}
                    </Disclosure>
                  ) : (
                    <CopyText
                      source={item.body}
                      className="mt-2 text-[0.8125rem] leading-relaxed text-fg-muted"
                    />
                  )}
                </section>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 8.4 Brand lockup                                                    */}
      {/* ------------------------------------------------------------------ */}
      {/* Outside Container deliberately — the mark runs to the viewport edges.
          A wordmark this size that stops inside a 1760px rail reads as an
          oversized heading rather than as a stamp on the page. It sits above the
          bottom bar so the legal line stays the last thing in the document. */}
      <div className="border-t border-border-soft pt-14 sm:pt-16 lg:pt-20">
        <ChromaticWordmark />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 8.5 Bottom bar                                                      */}
      {/* ------------------------------------------------------------------ */}
      {/* No top border: the wordmark above is already the terminal gesture, and
          a rule between them would read as the mark being fenced off. */}
      <div>
        <Container>
          {/* Terms · Privacy · Risk disclosure stood on the right of this bar,
              and all three pointed at `#`. The note above the deleted link
              columns argued that a footer full of dead anchors is worse than a
              short footer, then left three of them in the last line of the
              document. They come back as links when the documents exist. */}
          <div className={`py-7 ${RAIL}`}>
            <p className="text-xs leading-relaxed text-fg-muted">
              © <span className="tabular">{year}</span>{' '}
              <CopyText as="span" source={copyrightEntity} />. {copyrightSuffix}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
