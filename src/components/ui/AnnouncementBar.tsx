import Container from './Container'
import { RAIL } from './SectionShell'
import { announcement } from '../../data/waitlist'

/**
 * §1 — the announcement bar.
 *
 * ── Not sticky, and not dismissable ────────────────────────────────────────
 *
 * Both are decisions rather than omissions.
 *
 * NOT STICKY: the bar states the offer once and then gets out of the way. A
 * strip pinned to the top of a 5,000px scroll is a permanent 40px tax on the
 * viewport for a sentence the reader finished with in the first second, and it
 * would sit directly above a nav that is itself sticky — two stacked bars, one
 * of which is repeating itself. Only the nav pins.
 *
 * NOT DISMISSABLE: the bar carries a statutory qualifier. A close button on a
 * strip reading "zero brokerage · statutory charges apply" is a control that
 * lets a reader delete the half of the sentence that limits the claim, and then
 * scroll a page whose hero repeats the claim without it. The qualifier is not
 * separable from the offer, so neither is the bar.
 *
 * ── The offer is `fg`, and NOT `accent` ────────────────────────────────────
 *
 * It was written as `text-accent` on the reasoning that the offer is the thing
 * the eye should land on first. That reasoning is fine and the token was wrong,
 * for a reason specific to this palette and worth writing down because it will
 * catch the next person too.
 *
 * `--color-accent` in the platinum system is #2c2f38 — a DARK metal, a surface
 * to put white text ON, not a colour to set text IN. Measured on the page ground
 * #050505 it is 1.31:1, which is not dim, it is invisible. (The copper system
 * this page briefly ran had a light accent, #FF9E7A at 9.92:1, where the same
 * class would have worked — which is exactly how a class survives a palette
 * change and stops meaning what it says.)
 *
 * So emphasis is carried by luminance instead: `fg` #ffffff at 20.38:1 on the
 * offer, `fg-muted` #cfcfcf at 13.08:1 on the qualifier and the deadline. One
 * step of separation, no hue involved, and both clear 4.5:1 at this 12px size
 * with a large margin — which they need to, because 12px is the smallest type on
 * the page and the floor applies in full.
 *
 * ── The height is declared, not observed ───────────────────────────────────
 *
 * `h-[var(--announce-h)]` rather than padding. `--header-stack` in index.css
 * sums this bar and the nav so the hero can subtract them and keep its risk
 * disclosure in the first viewport; if the bar's real height came from its
 * content, that sum would silently drift the first time the copy grew by a word.
 * The height is the contract, and the copy is written to fit it: one line from
 * sm, two below it.
 */
export default function AnnouncementBar() {
  return (
    /*
     * `role="region"` with a name, not `role="banner"`. The nav below is the
     * page's banner landmark; two banners is a landmark structure a screen
     * reader user cannot navigate by. A named region is announced, skippable and
     * does not compete.
     */
    <div
      role="region"
      aria-label="Announcement"
      className="relative z-40 border-b border-border-soft bg-surface/60"
    >
      <Container>
        <div
          className={`flex h-[var(--announce-h)] items-center justify-center ${RAIL}`}
        >
          {/*
            One `<p>`, not three spans in a flex row, and the difference is what
            a screen reader reads out. As separate flex children with `gap`, the
            three clauses are announced as three fragments with no punctuation
            between them — "Six months of zero Thinq brokerage for everyone on
            the waitlist Statutory charges apply The list closes when we open".
            Inside one paragraph with real punctuation they are one sentence.

            The separators are `aria-hidden` for the same reason: a middot read
            aloud is noise, and the punctuation that replaces it is already in
            the text.
          */}
          <p className="flex flex-wrap items-center justify-center gap-x-2 text-center text-xs leading-tight sm:gap-x-3">
            <span className="font-medium text-fg">{announcement.offer}</span>

            <span aria-hidden="true" className="hidden text-fg-subtle sm:inline">
              ·
            </span>

            {/* The qualifier is `fg-muted`, one step down from the offer and two
                steps up from `fg-subtle`. It is deliberately NOT the quietest
                thing in the bar: a limitation set at the bottom of the legible
                range is a limitation the page is hiding. */}
            <span className="text-fg-muted">{announcement.qualifier}</span>

            {/* The urgency line is held to `sm` and up. On a phone the bar is
                already two lines, and a third would make an announcement strip
                taller than the nav under it — at which point it stops reading as
                a note above the page and starts reading as the top of the page.
                Nothing is lost: the same sentence is the closing section's
                headline, which is where the decision is actually asked for. */}
            <span aria-hidden="true" className="hidden text-fg-subtle sm:inline">
              ·
            </span>
            <span className="hidden text-fg-muted sm:inline">{announcement.urgency}</span>
          </p>
        </div>
      </Container>
    </div>
  )
}
