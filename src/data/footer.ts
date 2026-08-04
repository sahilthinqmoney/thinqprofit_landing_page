import type { RegistrationLine } from '../types'

/**
 * §7 Close + §8 Footer and legal.
 *
 * Every [SQUARE BRACKET] below is an unfilled compliance placeholder and renders
 * visibly flagged through `CopyText`. The instruction that governs them has not
 * changed and is worth restating in full, because it is the one rule in this
 * repo with a legal consequence attached:
 *
 *   Publishing a broker landing page with invented SEBI or exchange
 *   registration numbers is a regulatory offence, not a typo.
 *
 * Do not fill these from imagination, from a competitor's footer, or from an
 * older draft. Compliance supplies the verified values. Every one of them is a
 * blocking item in docs/go-live-checklist.md.
 */

/* -------------------------------------------------------------------------- */
/* §7 Close                                                                   */
/* -------------------------------------------------------------------------- */

export interface FinalCtaContent {
  heading: string
  subheading: string
  /** Sits under the form, with the count. */
  reiteration: string
  /** Required disclosure directly beneath the form. Never collapse or hide. */
  disclosure: string
}

export const finalCta: FinalCtaContent = {
  /*
   * "Get in before we open." Five words, and the tension is entirely in the
   * preposition — you are being invited to act on a door that is currently shut,
   * which is the actual state of the product and not a manufactured urgency.
   *
   * The announcement bar states the same mechanism as a fact ("the list closes
   * when we open"); this states it as an instruction. That pairing is the page's
   * whole urgency argument, and there is no countdown, no seat counter and no
   * "only N places left" anywhere between them.
   */
  heading: 'Get in before we open.',

  /*
   * The action prompt names the channel, because the channel is the ask. A
   * reader is not giving up a phone number in the abstract — they are agreeing
   * to receive WhatsApp messages, and a page that collects the number without
   * saying so has obtained it by omission.
   */
  subheading:
    'Leave your mobile number. We message you on WhatsApp the day access opens, and not before.',

  /*
   * The re-iteration. It restates the offer beside the count, because this is
   * the second and last place the page asks for the number and a reader who
   * scrolled past the hero has not been told what they are joining for.
   *
   * The brokerage qualifier travels with it, as it does everywhere the offer
   * appears. Three statements of the claim on one page, three qualifiers.
   */
  reiteration: 'Six months of zero Thinq brokerage. Statutory charges apply.',

  disclosure:
    'Investments in the securities market are subject to market risk. Read all the related documents carefully before investing.',
}

/* -------------------------------------------------------------------------- */
/* §8.1 Brand block                                                           */
/* -------------------------------------------------------------------------- */

export const brandName = 'Thinq'

/**
 * The tagline, and it is the page's last word before the legal blocks.
 *
 * "It's your money. Don't give it away." is an unusual thing for a broker to
 * print, and the reason it belongs here rather than in the hero is that it only
 * works as a closing statement. In the hero it is a slogan; at the foot of a
 * page that has just spent five sections on custody, segregation, statutory
 * charges and what "zero" excludes, it is a summary of everything above it.
 *
 * Read against §6 in particular it is doing something sharper than it looks: a
 * page selling free brokerage is telling the reader to watch what things cost.
 * That is the sentence to fight for if anyone proposes replacing it with a
 * product description.
 */
export const tagline = 'It’s your money. Don’t give it away.'

/**
 * The one-line description under the mark. Present tense about what the company
 * is, future tense about nothing.
 */
export const brandBlurb =
  'A SEBI-registered broker building an AI-native trading terminal for Indian markets.'

/*
 * The five link columns are gone, and the socials with them.
 *
 * Twenty-five footer links is a sitemap, and this page has no site to map: there
 * is no help centre, no blog, no careers page and no status page, because the
 * product has not opened. Every one of those links pointed at `#`. A footer full
 * of links that go nowhere is worse than a short footer — it is the first place
 * a careful reader checks whether a pre-launch company is real, and twenty-five
 * dead anchors answer that question the wrong way.
 *
 * What replaces them is the material that is actually required and actually
 * true: the registration block, the mandatory disclosures, and the grievance
 * route. Those render in full below.
 */

/* -------------------------------------------------------------------------- */
/* §8.2 Compliance and registration                                           */
/* -------------------------------------------------------------------------- */

/**
 * BUILD NOTE — not page copy, and never rendered. A customer must not read the
 * team's own to-do list.
 *
 * Every value here is unfilled. MCX and the mutual-fund ARN are absent because
 * the page claims neither segment; add the row when the segment is live, not
 * before. The Research Analyst registration is likewise absent — this page
 * publishes no research, and §8.3's advisory boundary says so.
 */
export const registrationLines: RegistrationLine[] = [
  { label: 'Entity', value: '[Legal entity name Private Limited]' },
  { label: 'CIN', value: '[U00000XX0000PTC000000]' },
  { label: 'Registered office', value: '[Full address, City, State, PIN]' },
  { label: 'SEBI Registration (Stock Broker)', value: '[INZ000XXXXXX]' },
  { label: 'NSE Member Code', value: '[XXXXX]' },
  { label: 'BSE Member Code', value: '[XXXX]' },
  { label: 'CDSL Depository Participant ID', value: '[IN-DP-XXX-XXXX]' },
  { label: 'Compliance Officer', value: '[Name] · [email] · [+91 XXXXX XXXXX]' },
  { label: 'Investor Grievances', value: '[grievances@thinq.example] · [+91 XXXXX XXXXX]' },
]

/**
 * The SEBI complaint portal, rendered as a real link rather than as a mention.
 *
 * SCORES is the escalation route a customer uses when the firm's own channels
 * have failed, so a page that names it without linking it has described the
 * route rather than provided it. The URL is public, stable and not ours, which
 * is why it is the one link in this footer that is not a placeholder.
 */
export const scoresLink = {
  before: 'Unresolved complaints can be escalated to SEBI through ',
  linkLabel: 'SCORES',
  href: 'https://scores.sebi.gov.in',
  after: ', the regulator’s online complaint redressal system.',
}

/* -------------------------------------------------------------------------- */
/* §8.3 Mandatory disclaimers                                                 */
/* -------------------------------------------------------------------------- */

export interface StatutoryDisclosure {
  id: string
  title: string
  body: string
  /** `risk` gets the warning treatment via the Disclosure primitive. */
  tone: 'risk' | 'note'
}

/**
 * Five blocks, and the ordering is by what the page above them actually claimed.
 *
 * The indicative-data notice comes first because §3 and §4 are the reason it is
 * needed: a page that says an AI reads the market to you has to say what the
 * numbers under that reading are. The advisory boundary follows for the same
 * reason. The algo notice is third because §4 names agentic trading. Only then
 * the derivatives and market-risk lines, which every broker carries.
 *
 * A disclosure block that is not traceable to a claim on the page is boilerplate;
 * each of these is traceable, and if a claim above is deleted the matching block
 * should be reconsidered rather than left standing.
 */
export const statutoryDisclosures: StatutoryDisclosure[] = [
  {
    id: 'indicative-data',
    title: 'Indicative data and derived values',
    /*
     * The one this page most needs and the one most competitors omit. Greeks,
     * option analytics and anything computed off a depth feed are DERIVED — they
     * depend on a model, a snapshot and an interpolation, and they will not match
     * another vendor's to the decimal. Saying so is what makes the §4 capability
     * list honest.
     */
    body: 'Prices, greeks, option analytics and any value computed from them are indicative and are derived from exchange feeds using our own models and snapshots. They may differ from figures shown elsewhere and from the values at which an order actually executes. They are provided for information, not as a basis for a transaction.',
    tone: 'note',
  },
  {
    id: 'advisory-boundary',
    title: 'Not investment advice',
    /*
     * The sentence the whole AI claim stands or falls on. Commentary describes
     * what happened; advice recommends what to do. §3's fine print states the
     * same boundary at the point of claim, and this is the full form of it.
     */
    body: 'Nothing on this website, and nothing Thinq writes on a chart or in the terminal, is investment advice, a recommendation, or an offer to buy or sell any security. Market commentary generated by Thinq describes market activity; it does not tell you what to do about it. Decisions, and their consequences, are yours.',
    tone: 'note',
  },
  {
    id: 'algo-framework',
    title: 'Algorithmic trading',
    /*
     * SEBI's framework for retail algorithmic trading requires broker-facilitated
     * algos to be registered and exchange-approved, and it governs what may be
     * offered to retail clients. §4 names agentic trading as what is next, so the
     * notice belongs on the page now rather than at the point the feature ships.
     *
     * The bracketed clause is a compliance placeholder on purpose: the exact
     * wording and the approval references are prescribed and change, and they
     * must be transcribed from the current circular rather than paraphrased here.
     */
    body: 'Any algorithmic or automated order-placement feature offered to retail clients operates within SEBI’s framework for retail algorithmic trading and requires exchange approval and registration of the algorithm before use. [Insert the exact current wording and approval references from the applicable SEBI circular and exchange notice before publishing.]',
    tone: 'note',
  },
  {
    id: 'derivatives-risk',
    title: 'Derivatives risk disclosure',
    /*
     * Exchange-approved wording, and the figure is bracketed for the same reason
     * it always was: SEBI's study on individual F&O traders is periodically
     * republished with updated numbers, and quoting a stale figure on a broker
     * page is a misstatement rather than an old fact.
     */
    body: 'Trading in derivatives carries a high level of risk and is not suitable for every investor. Losses can exceed the margin deposited. SEBI’s published studies on individual traders in the equity derivatives segment report that a large majority incur net losses. [Insert the exact current figure, study name and date, and use the exchange-approved risk disclosure wording verbatim, before publishing.]',
    tone: 'risk',
  },
  {
    id: 'market-risk',
    title: 'Market risk',
    body: 'Investments in the securities market are subject to market risks. Read all the related documents carefully before investing. Thinq does not offer, promise or guarantee any return on investment, and past performance is not indicative of future results.',
    tone: 'note',
  },
]

/* -------------------------------------------------------------------------- */
/* §8.4 Bottom bar                                                            */
/* -------------------------------------------------------------------------- */

/** Year is computed at render; the entity name stays a placeholder. */
export const copyrightEntity = '[Legal entity name Private Limited]'
export const copyrightSuffix = 'All rights reserved.'

/**
 * Three links, and all three are documents a waitlist member is entitled to read
 * before joining. There is no "Sitemap" — see the note on the deleted columns.
 */
export const bottomBarLinks: string[] = ['Terms', 'Privacy', 'Risk disclosure']
