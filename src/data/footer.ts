import type { FooterColumn, RegistrationLine, SocialLink } from '../types'

/**
 * §16 Final CTA + §17 Footer + §18.2 Newsletter — docs/landing-page-copy.md
 *
 * Every string here is verbatim from the copy deck. Every [SQUARE BRACKET] is a
 * deliberate compliance placeholder: the copy deck's own instruction is
 * "Publishing a broker landing page with invented SEBI/exchange registration
 * numbers is a regulatory offence, not a typo." Do not fill these in from
 * imagination — compliance supplies the verified values.
 */

/* -------------------------------------------------------------------------- */
/* §16 Final CTA                                                              */
/* -------------------------------------------------------------------------- */

export interface FinalCtaContent {
  heading: string
  subheading: string
  primaryCta: string
  secondaryCta: string
  supportLine: string
  /** Required disclosure directly beneath the CTA. Never collapse or hide. */
  disclosure: string
}

export const finalCta: FinalCtaContent = {
  heading: 'Start with what you have today',
  subheading:
    "Free account opening, transparent pricing, and a platform that doesn't slow down when the market speeds up.",
  primaryCta: 'Open free account',
  secondaryCta: 'Talk to us first',
  supportLine: 'Free account opening · Aadhaar eKYC · [X]-hour activation',
  disclosure:
    'Investments in the securities market are subject to market risk. Read all the related documents carefully before investing.',
}

/* -------------------------------------------------------------------------- */
/* §17.1 Brand block                                                          */
/* -------------------------------------------------------------------------- */

export const brandName = 'ThinqProfit'

export const brandBlurb =
  'A SEBI-registered broker for Indian markets. Stocks, F&O, commodities, mutual funds and bonds in one account.'

/**
 * lucide-react v1.27 ships no brand glyphs (no Twitter/X, LinkedIn, Instagram,
 * YouTube or Telegram marks). Rather than invent an import that does not exist,
 * each social link uses a neutral lucide icon and carries an explicit,
 * correct aria-label naming the network.
 */
export const socials: SocialLink[] = [
  { label: 'X', href: '#', icon: 'AtSign' },
  { label: 'LinkedIn', href: '#', icon: 'Briefcase' },
  { label: 'YouTube', href: '#', icon: 'MonitorPlay' },
]

/* -------------------------------------------------------------------------- */
/* §17.2 Link columns                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Five columns of five, down from eight columns of up to eleven.
 *
 * Sixty-eight links across eight headings is a sitemap, and a sitemap at the
 * foot of a page is a directory nobody reads: at eight columns each one was a
 * ~120px strip of 13px grey type. Each column now carries the five destinations
 * it would actually be opened for, and the mandated material is not in this
 * grid at all — the registration block, statutory disclosures, Attention
 * Investors and the grievance ladder all render in full below it.
 *
 * Support keeps a column despite the Support *section* going: the channels are
 * what a customer comes to a footer for, and the escalation ladder further down
 * is the route when those channels have not worked.
 */
export const footerColumns: FooterColumn[] = [
  {
    heading: 'Products',
    links: ['Stocks & ETFs', 'Futures & Options', 'Mutual Funds', 'IPO', 'Commodities'],
  },
  {
    heading: 'Platform',
    links: ['Mobile app', 'Web terminal', 'Charts', 'Option chain', 'API docs'],
  },
  {
    heading: 'Company',
    links: ['About us', 'Careers', 'Pricing', 'Blog', 'Contact'],
  },
  {
    heading: 'Support',
    links: [
      'Help centre',
      'Raise a ticket',
      'Account opening status',
      'Downloads & forms',
      'Status page',
    ],
  },
  {
    heading: 'Legal & regulatory',
    links: [
      'Terms & conditions',
      'Privacy policy',
      'Risk disclosure',
      'Investor Charter',
      'Monthly complaint data',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* §17.3 Registration block                                                    */
/* -------------------------------------------------------------------------- */

/**
 * BUILD NOTE — not page copy. The copy deck heads §17.3 with an instruction to
 * the build team, verbatim:
 *
 *   "TODO — fill every value with a verified number.
 *    Do not ship placeholder registrations."
 *
 * It is kept here as a comment rather than rendered: a customer must never read
 * the team's own to-do list. Every value below is an unfilled compliance
 * placeholder and renders visibly flagged through `CopyText`.
 */
export const registrationLines: RegistrationLine[] = [
  { label: 'Entity', value: '[ThinqProfit Securities Private Limited]' },
  { label: 'CIN', value: '[U00000XX0000PTC000000]' },
  { label: 'Registered office', value: '[Full address, City, State, PIN]' },
  { label: 'SEBI Registration (Stock Broker)', value: '[INZ000XXXXXX]' },
  { label: 'NSE Member Code', value: '[XXXXX]' },
  { label: 'BSE Member Code', value: '[XXXX]' },
  { label: 'MCX Member Code', value: '[XXXXX]' },
  { label: 'CDSL Depository Participant ID', value: '[IN-DP-XXX-XXXX]' },
  {
    label: 'AMFI Registration Number (Mutual Fund Distributor)',
    value: '[ARN-XXXXXX]',
  },
  { label: 'SEBI Research Analyst Registration', value: '[INH000XXXXXX]' },
  { label: 'Compliance Officer', value: '[Name] · [email] · [+91 XXXXX XXXXX]' },
  { label: 'Investor Grievances', value: '[grievances@thinqprofit.com] · [+91 XXXXX XXXXX]' },
]

/* -------------------------------------------------------------------------- */
/* §17.4 Statutory disclosures                                                 */
/* -------------------------------------------------------------------------- */

export interface StatutoryDisclosure {
  id: string
  title: string
  body: string
  /** `risk` gets the warning treatment via the Disclosure primitive. */
  tone: 'risk' | 'note'
}

export const statutoryDisclosures: StatutoryDisclosure[] = [
  {
    id: 'market-risk',
    title: 'Standard market risk line',
    body: 'Investments in the securities market are subject to market risks. Read all the related documents carefully before investing.',
    tone: 'note',
  },
  {
    id: 'derivatives-risk',
    title: 'Derivatives risk disclosure',
    body: "Trading in derivatives carries a high level of risk and is not suitable for every investor. Losses can exceed the margin deposited. SEBI's published studies on individual traders in the equity F&O segment report that a large majority incur net losses. [Insert the exact current figure, study name and date — verify against SEBI's latest publication before publishing.]",
    tone: 'risk',
  },
  {
    id: 'no-guaranteed-returns',
    title: 'No guaranteed returns',
    body: 'ThinqProfit does not offer, promise or guarantee any return on investment. Past performance is not indicative of future results. Any illustration on this site is hypothetical and provided for explanation only.',
    tone: 'note',
  },
  {
    id: 'advisory-boundary',
    title: 'Advisory boundary',
    body: 'Content on this website is for information and education. It does not constitute investment advice, a recommendation, or an offer to buy or sell any security. [If research is published, add: Research reports are issued under SEBI Research Analyst registration INH000XXXXXX and carry their own disclosures.]',
    tone: 'note',
  },
]

/* -------------------------------------------------------------------------- */
/* §17.5 Attention Investors                                                   */
/* -------------------------------------------------------------------------- */

export const attentionInvestorsHeading = 'Attention Investors'

/**
 * BUILD NOTE — not page copy. The copy deck's own preamble to §17.5, verbatim:
 *
 *   "Exchange-mandated notices. Verify the current text with your exchange
 *    circulars — the wording is prescribed and changes periodically."
 *
 * Kept as a comment, not rendered: it addresses the team, not the reader.
 */
export const attentionInvestors: string[] = [
  'Stock brokers can accept securities as margin from clients only by way of pledge in the depository system with effect from 1 September 2020.',
  'Update your mobile number and email ID with your stock broker and depository participant. Receive information about your transactions directly from the exchange and depository on the same day.',
  'Check your securities, mutual fund and other holdings in the consolidated account statement issued by NSDL and CDSL every month.',
  'KYC is a one-time exercise while dealing in securities markets. Once KYC is done through a SEBI-registered intermediary, you need not repeat the process with another.',
  'No need to issue cheques when subscribing to an IPO. Write your bank account number on the application form and authorise your bank to make the payment. Your funds stay in your own account until allotment.',
  'Prevent unauthorised transactions in your account. Never share your login credentials, OTP or TPIN with anyone, including anyone claiming to be from ThinqProfit.',
  'Beware of anyone promising assured or guaranteed returns in the securities market. We do not, and neither does anyone legitimate.',
]

/* -------------------------------------------------------------------------- */
/* §17.6 Grievance redressal ladder                                            */
/* -------------------------------------------------------------------------- */

export const grievanceHeading = 'How to escalate a complaint'

export const grievanceLadder: string[] = [
  'Support — [support@thinqprofit.com] or in-app chat',
  'Head of Customer Service — [name@thinqprofit.com]',
  'Compliance Officer — [Name], [compliance@thinqprofit.com], [phone]',
  'Exchange investor grievance cells — NSE, BSE, MCX (links)',
  'SEBI SCORES — scores.sebi.gov.in',
  'Smart ODR portal — smartodr.in',
]

/** Rendered immediately under the ladder; "here" is the link. */
export const complaintDataLine = {
  before: 'Monthly complaint data is published ',
  linkLabel: 'here',
  after: ', as required by SEBI.',
  href: '#',
}

/* -------------------------------------------------------------------------- */
/* §17.7 Bottom bar                                                            */
/* -------------------------------------------------------------------------- */

/** Year is computed at render; the entity name stays a placeholder. */
export const copyrightEntity = '[ThinqProfit Securities Private Limited]'
export const copyrightSuffix = 'All rights reserved.'

export const bottomBarLinks: string[] = ['Terms', 'Privacy', 'Disclosures', 'Sitemap']

/*
 * §18.2 Newsletter is gone from the page along with the signup card that sat in
 * the footer's brand row. An email capture is a second thing to ask a stranger
 * for on a page whose one request is "open an account", and it put a bordered
 * form directly above the statutory disclosures. The copy lives in the deck if
 * a digest landing page is ever built.
 */
