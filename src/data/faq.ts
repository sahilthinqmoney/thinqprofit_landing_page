import type { FaqItem, SupportChannel } from '../types'

/**
 * §14 FAQ and §15 Support — docs/landing-page-copy.md, verbatim.
 *
 * Every [SQUARE BRACKET] is a deliberate placeholder awaiting a verified value
 * from compliance. Do not fill them in here, and do not delete them.
 *
 * Answers keep the deck's inline markers so nothing is dropped in transcription:
 *   **bold**          → emphasis
 *   [label](href)     → link
 *   [placeholder]     → unfilled value, rendered in warning styling
 * Components render them through `CopyText` (src/components/ui/CopyText.tsx),
 * so placeholders look identical wherever they appear.
 */

/* -------------------------------------------------------------------------- */
/* FAQ 7 — the unresolved research question                                   */
/* -------------------------------------------------------------------------- */

/**
 * Open question 3 in the copy deck: "Do you publish research?" It determines
 * FAQ 7, the Baskets disclosure, and whether the RA registration appears at all.
 *
 * `null` = the business has not decided. While it is null the page must not
 * publish either answer, because the two contradict each other and a regulator
 * would read the pair as a misstatement. Faq.tsx renders an explicit unresolved
 * state instead.
 *
 * Set to `false` → Option A (no research) is published.
 * Set to `true`  → Option B (research under RA registration) is published.
 */
export const publishesResearch: boolean | null = null

/**
 * FAQ 7 carries two mutually exclusive answers instead of one, so the decision
 * cannot be quietly lost by picking a side in the data file.
 *
 * Deck source, verbatim:
 *   `[Choose one and delete the other.]` **Option A:** No. We're an execution
 *   platform, not an advisor. **Option B:** Research is published only under our
 *   SEBI Research Analyst registration `[INH000XXXXXX]`, with disclosures
 *   attached to each report.
 */
export interface ResearchFaqItem {
  question: string
  /** Deck Option A — published when `publishesResearch` is false. */
  answerNoResearch: string
  /** Deck Option B — published when `publishesResearch` is true. */
  answerWithResearch: string
}

/** The deck's own instruction for FAQ 7, verbatim. Shown while unresolved. */
export const researchDecisionInstruction = '[Choose one and delete the other.]'

/** An FAQ row is either a settled answer or the one pending decision. */
export type FaqEntry = FaqItem | ResearchFaqItem

export function isResearchFaq(entry: FaqEntry): entry is ResearchFaqItem {
  return 'answerNoResearch' in entry
}

/* -------------------------------------------------------------------------- */
/* 14. FAQ — all twelve questions                                             */
/* -------------------------------------------------------------------------- */

export const faqs: FaqEntry[] = [
  {
    question: 'What do I need to open an account?',
    answer:
      'PAN, an Aadhaar number linked to your mobile, bank account details, and a signature and photo. If your KYC is already registered, most of it is pre-filled.',
  },
  {
    question: 'How long does account opening take?',
    answer:
      "Usually [X] working hours after you finish eSign. Cases that need manual verification take longer, and we'll tell you when yours does.",
  },
  {
    question: 'Is there a charge to open the account?',
    answer: 'Account opening is [₹0]. Annual demat maintenance is [₹X], billed [yearly].',
  },
  {
    question: 'Where are my shares held?',
    answer:
      'In a demat account in your own name with CDSL. We are the depository participant; the shares belong to you.',
  },
  {
    question: 'What happens to my shares if ThinqProfit shuts down?',
    answer:
      'They stay in your demat account with the depository, in your name. You can transfer them to another broker. Client funds are held in segregated client bank accounts as SEBI requires.',
  },
  {
    question: 'Can I trade F&O as a beginner?',
    answer:
      "You can, but consider whether you should. Derivatives are leveraged, losses can exceed the margin you post, and SEBI's own studies show most individual F&O traders lose money. Start with our derivatives course, then paper trade.",
  },
  {
    question: 'Do you give buy or sell recommendations?',
    answerNoResearch: "No. We're an execution platform, not an advisor.",
    answerWithResearch:
      'Research is published only under our SEBI Research Analyst registration [INH000XXXXXX], with disclosures attached to each report.',
  },
  {
    question: 'Are mutual funds on ThinqProfit direct or regular?',
    answer:
      'Direct plans only. We earn no distributor commission from your investment, which is why the expense ratio is lower.',
  },
  {
    question: 'What charges apply besides brokerage?',
    answer:
      'STT or CTT, exchange transaction charges, SEBI turnover fees, stamp duty, and GST — all levied at actuals and itemised on your contract note. See the [full rate card](#).',
  },
  {
    question: 'Can I use my own trading systems?',
    answer:
      'Yes. The API gives you REST and WebSocket access on the [Pro] plan, with published rate limits and documentation.',
  },
  {
    question: 'How do I get my tax statements?',
    answer:
      'Tax P&L, capital gains and ledger reports are downloadable from your account at any time, formatted for ITR filing.',
  },
  {
    question: 'How do I raise a complaint?',
    answer:
      "Start with support at [support@thinqprofit.com]. Unresolved issues escalate to our Compliance Officer at [compliance@thinqprofit.com], and from there to SEBI's SCORES portal or the Smart ODR portal. All three routes are listed in the footer.",
  },
]

/* -------------------------------------------------------------------------- */
/* 15. Support                                                                */
/* -------------------------------------------------------------------------- */

export const supportChannels: SupportChannel[] = [
  {
    channel: 'In-app chat',
    detail: '[Hours], trading days',
    icon: 'MessagesSquare',
  },
  {
    channel: 'Email',
    detail: '[support@thinqprofit.com] — replies within [X] hours',
    icon: 'Mail',
  },
  {
    channel: 'Phone',
    detail: '[+91 XXXXX XXXXX], [Hours]',
    icon: 'Phone',
  },
  {
    channel: 'Help centre',
    detail: 'Searchable articles for every screen in the app',
    icon: 'LifeBuoy',
  },
  {
    channel: 'Ticket status',
    detail: 'Track any open request from your account',
    icon: 'TicketCheck',
  },
]

/** §15 escalation line — the published grievance route. Verbatim. */
export const escalationLine: string =
  'Not resolved? Write to our Compliance Officer, [Name], at [compliance@thinqprofit.com] or [phone].'
