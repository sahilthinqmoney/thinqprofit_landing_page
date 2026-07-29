import { LifeBuoy, Mail, MessagesSquare, Phone, ShieldAlert, TicketCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionShell from '../ui/SectionShell'
import Reveal from '../ui/Reveal'
import CopyText from '../ui/CopyText'
import { escalationLine, supportChannels } from '../../data/faq'

/**
 * §15 Support — "Real people, published hours".
 *
 * The copy deck ships this as a two-column table (Channel | Detail), so it is
 * rendered as one: a real <table> with column headers, not a card grid. The
 * escalation line sits beneath it in a panel of its own — it is the published
 * regulatory grievance route, so it gets weight, not fine print.
 */

const iconMap: Record<string, LucideIcon> = {
  MessagesSquare,
  Mail,
  Phone,
  LifeBuoy,
  TicketCheck,
}

export default function Support() {
  return (
    <SectionShell
      id="support"
      tone="raised"
      heading="Real people, published hours"
      subheading="No charge to talk to us, and no phone tree designed to make you give up."
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {/* table-fixed keeps the long placeholder emails inside the cell at 375px */}
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-bg/40">
                  <th
                    scope="col"
                    className="w-32 px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted sm:w-56 sm:px-6"
                  >
                    Channel
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted sm:px-6"
                  >
                    Detail
                  </th>
                </tr>
              </thead>

              <tbody>
                {supportChannels.map((channel) => {
                  const Icon = iconMap[channel.icon]

                  return (
                    <tr
                      key={channel.channel}
                      className="border-b border-border-soft last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-4 align-top text-base font-medium text-fg sm:px-6 sm:py-5"
                      >
                        <span className="flex items-start gap-3">
                          {Icon && (
                            <Icon
                              className="mt-px h-5 w-5 shrink-0 text-accent-soft"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          )}
                          <span className="leading-snug">{channel.channel}</span>
                        </span>
                      </th>

                      <td className="px-4 py-4 align-top sm:px-6 sm:py-5">
                        <CopyText
                          source={channel.detail}
                          className="text-base leading-relaxed text-fg-muted"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-warning/30 bg-warning/5 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-warning/30 bg-warning/10">
              <ShieldAlert className="h-5 w-5 text-warning" strokeWidth={1.5} aria-hidden="true" />
            </span>

            <CopyText
              source={escalationLine}
              className="text-base leading-relaxed text-fg sm:text-lg"
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
