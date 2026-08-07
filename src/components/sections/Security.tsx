import SectionShell from '../ui/SectionShell'
import { honestNote, pillars, securityHeadline } from '../../data/security'

const allSecurityItems = [
  {
    title: pillars[0].title,
    body: pillars[0].body,
  },
  {
    title: pillars[1].title,
    body: pillars[1].body,
  },
  {
    title: pillars[2].title,
    body: pillars[2].body,
  },
  {
    title: pillars[3].title,
    body: pillars[3].body,
  },
  {
    title: pillars[4].title,
    body: pillars[4].body,
  },
  {
    title: pillars[5].title,
    body: pillars[5].body,
  },
  {
    title: 'Zero Conflict Policy',
    body: honestNote,
  },
]

export default function Security() {
  return (
    <SectionShell
      id="security"
      seamless
      scale="lead"
      heading={securityHeadline}
      subheading="SEBI-registered broker and member of NSE & BSE. Your funds settle to your bank, securities to your demat, and client funds are strictly segregated."
    >
      {/* Clean 3-Column Grid matching Capabilities Section UI */}
      <div className="mt-10 sm:mt-14 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
        {allSecurityItems.map((item) => (
          <div key={item.title} className="flex flex-col space-y-2.5">
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-fg">
              {item.title}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-fg-muted">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}




