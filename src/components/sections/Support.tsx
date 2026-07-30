import SectionShell from '../ui/SectionShell'
import Reveal from '../ui/Reveal'
import CopyText from '../ui/CopyText'
import { escalationLine, supportChannels } from '../../data/faq'

/**
 * §15 Support — "Real people, published hours".
 *
 * COMPOSITION — the page's one rule-free plate: a single elevated `.card`,
 * narrower than the rail, holding the five channels as a board with nothing but
 * space between the rows, and one line across it for the escalation route.
 *
 * That is a deliberate inversion of the section directly above it. FAQ is
 * twelve rows and twelve hairlines with no surface under any of them; this is
 * one surface with one hairline on it. Two consecutive sections both built out
 * of ruled rows would read as the same object twice, so the rules moved to one
 * of them and the elevation to the other. It is also why the row hover went:
 * these rows are not targets, and a background change under a cursor on
 * something you cannot click is an affordance that leads nowhere.
 *
 * The plate is `.card` — the page's single 28px radius, the inset top highlight
 * that puts a light source above it, the tinted shadow that gives it somewhere
 * to sit. It is not `.card-lift`. The lift is for a panel that is *one*
 * interactive target; this one contains five channels and a grievance route and
 * is a target for nothing, so it stays still. (Pricing's recommended tier makes
 * the same call for the same reason.)
 *
 * It caps at 64rem inside the 84rem rail. Every other section on this stretch
 * runs the rail edge to edge; capping the plate is what makes it read as an
 * object sitting in a section rather than as the section's background. The left
 * edge is still the rail's left edge, so the page's one left edge survives.
 *
 * ── The table has no header row ────────────────────────────────────────────
 *
 * The deck ships this as Channel | Detail and it is still a real <table> — five
 * channels, one attribute each — but the visible "CHANNEL / DETAIL" head is
 * gone. `scope="row"` on each channel name is what a screen reader actually
 * needs ("Phone: [+91 XXXXX XXXXX], [Hours]"), and the caption carries the
 * rest. What the visible head was adding was a row of 12px uppercase
 * letter-spaced micro-type — a treatment that had spread across enough of this
 * page to stop reading as a decision — sitting above five rows whose meaning
 * nobody was ever going to mistake. Column widths come from a <colgroup>
 * instead, which is what `table-fixed` reads first anyway.
 *
 * ── Which column is loud ──────────────────────────────────────────────────
 *
 * Inverted from the previous pass, and this is the point of the section. The
 * channel names are the labels: everyone has email, everyone has chat, and
 * "Phone" set in white 16px tells a reader nothing they did not assume. The
 * *hours* are the claim — a published, staffed window is the thing a broker can
 * be held to, and the reason the heading says "published hours" at all. So the
 * Detail column carries the emphasis (18px, full `text-fg`, tabular figures on
 * a 24px-tall row) and the Channel column steps back to muted body weight.
 * Read down the table now and the promises are what you see.
 *
 * Placeholders stay literal and orange throughout — `[Hours]` is precisely the
 * value that must not be quietly invented, and it is the loudest column so that
 * an unfilled one is impossible to ship past.
 *
 * ── Escalation ────────────────────────────────────────────────────────────
 *
 * Pinned to the foot of the same card rather than floated beside it in an
 * orange panel with a circular icon badge. The badge was chrome: a bordered
 * disc holding a glyph, sitting next to the only sentence in the block, adding
 * nothing to it. And the panel's orange wash was actively harmful — it was the
 * same colour the sentence's own `[Name]` and `[phone]` placeholders use, so
 * the flags disappeared into their own background.
 *
 * Its position now carries the meaning the tint used to fake: the escalation
 * route is the row *after* the five support channels, in the same card, on a
 * shaded ground, which is exactly what "if none of the above resolved it" means.
 * Same pattern as the statutory pass-through line under the brokerage table in
 * Pricing. It is also the plate's only internal rule, and it is spent on the
 * one boundary in this section that means something.
 *
 * The published hours, the five channels and the escalation path (support desk
 * → compliance officer → SEBI SCORES → Smart ODR, the last two named in
 * Safety's grievance pillar and the footer) are regulatory content. Layout
 * around them changes; they do not.
 */

/**
 * Cell padding, shared by the table and the escalation strip below it, so the
 * grievance route starts on the same left edge as the channel names above it.
 * Opened a step to match the plate's 28px radius — a tight gutter inside a
 * large corner radius is what makes a panel look like a screenshot of itself.
 */
const CELL_X = 'px-6 sm:px-8 lg:px-10'

export default function Support() {
  return (
    <SectionShell
      id="support"
      tone="raised"
      heading="Real people, published hours"
      subheading="No charge to talk to us, and no phone tree."
    >
      <Reveal variant="right">
        {/* `overflow-hidden` clips the escalation strip's tint to the card's own
            28px corners. It does not touch the inset highlight, which is drawn
            inside the element's own box. */}
        <div className="card max-w-[64rem] overflow-hidden">
          {/* The board's own top and bottom air. Kept on a wrapper rather than
              on the first and last rows so every row keeps identical padding
              and the five sit on one even rhythm. */}
          <div className="py-8 sm:py-10 lg:py-12">
            {/* table-fixed keeps the long placeholder email inside its cell at
                375px; the widths come from the colgroup, which is what
                `table-fixed` consults before it looks at any row. */}
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                Support channels. Each row names a channel and gives the hours it is staffed or
                the detail that applies to it. Bracketed values are unverified placeholders.
              </caption>

              <colgroup>
                <col className="w-32 sm:w-44 lg:w-56" />
                <col />
              </colgroup>

              <tbody>
                {supportChannels.map((channel) => (
                  // No rule, no stripe, no hover. Space separates these rows,
                  // because the section directly above this one is already
                  // built entirely out of ruled rows.
                  <tr key={channel.channel}>
                    <th
                      scope="row"
                      className={`py-4 align-baseline text-base font-normal leading-snug text-fg-muted sm:py-5 ${CELL_X}`}
                    >
                      {channel.channel}
                    </th>

                    <td className={`py-4 align-baseline sm:py-5 ${CELL_X}`}>
                      <CopyText
                        source={channel.detail}
                        className="tabular text-base leading-relaxed text-fg sm:text-lg"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* The published grievance route. Live, selectable text on a flat
              ground — never behind a blur, never shrunk to fine print. The one
              rule inside the plate sits here, because this is the one place in
              the section where the meaning changes: everything above it is a
              way to reach us, this is what to do when that did not work. */}
          <div className={`border-t border-border bg-surface-raised/40 py-6 sm:py-8 ${CELL_X}`}>
            <CopyText
              source={escalationLine}
              className="max-w-[68ch] text-base leading-relaxed text-fg"
            />
          </div>
        </div>
      </Reveal>
    </SectionShell>
  )
}
