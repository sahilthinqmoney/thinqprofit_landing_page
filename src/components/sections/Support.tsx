import SectionShell from '../ui/SectionShell'
import Reveal from '../ui/Reveal'
import CopyText from '../ui/CopyText'
import { escalationLine, supportChannels } from '../../data/faq'

/**
 * §15 Support — "Real people, published hours".
 *
 * The copy deck ships this as a two-column table (Channel | Detail), so it is
 * rendered as one: a real <table> with column headers and a caption, not a card
 * grid. This is tabular data — five channels, one attribute each — and the
 * semantics are what let a screen reader announce "Phone, Detail: …" instead of
 * reading five unlabelled fragments.
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
 * Pricing.
 */

/** Cell padding, shared by the table and the escalation strip below it. */
const CELL_X = 'px-5 sm:px-7 lg:px-8'

export default function Support() {
  return (
    <SectionShell
      id="support"
      tone="raised"
      heading="Real people, published hours"
      subheading="No charge to talk to us, and no phone tree designed to make you give up."
    >
      <Reveal className="mx-auto w-full max-w-3xl lg:max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {/* table-fixed keeps the long placeholder email inside its cell at 375px */}
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">
              Support channels and the hours each is staffed. Bracketed values are unverified
              placeholders.
            </caption>

            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className={`w-32 py-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted sm:w-48 lg:w-56 ${CELL_X}`}
                >
                  Channel
                </th>
                <th
                  scope="col"
                  className={`py-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted ${CELL_X}`}
                >
                  Detail
                </th>
              </tr>
            </thead>

            <tbody>
              {supportChannels.map((channel) => (
                <tr
                  key={channel.channel}
                  className="border-b border-border-soft transition-colors duration-200 last:border-b-0 hover:bg-surface-raised/50"
                >
                  <th
                    scope="row"
                    className={`py-5 align-top text-base font-normal leading-snug text-fg-muted sm:py-6 ${CELL_X}`}
                  >
                    {channel.channel}
                  </th>

                  <td className={`py-5 align-top sm:py-6 ${CELL_X}`}>
                    <CopyText
                      source={channel.detail}
                      className="tabular text-base leading-relaxed text-fg sm:text-lg"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* The published grievance route. Live, selectable text on a flat
              ground — never behind a blur, never shrunk to fine print. */}
          <div className={`border-t border-border bg-surface-raised/40 py-5 sm:py-6 ${CELL_X}`}>
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
