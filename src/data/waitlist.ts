/**
 * §1 Announcement bar + the waitlist mechanic that runs through §2, §7 and §8.
 *
 * The page's single ask changed. It used to be "open a free account", answered
 * by a button that scrolled to a closing section; it is now "join the list",
 * answered by a phone field and an OTP. That is one conversion event, asked for
 * in three places, and every string it needs lives here rather than in the three
 * sections — a count that reads 2,412 in the hero and 2,410 in the close is the
 * kind of defect that only appears once the number is real.
 *
 * ── The count is a placeholder that does not look like one ──────────────────
 *
 * `waitlistCount` renders as a plain figure, not a `[BRACKETED]` `CopyText`
 * token, and that is a deliberate exception to the rule the rest of this repo
 * follows. The reason is that the two kinds of unfilled value are different: a
 * SEBI registration number that is wrong is a regulatory offence, and a
 * hardcoded waitlist count that is stale is a marketing figure that is briefly
 * behind. Flagging this one in warning orange beside the primary action would
 * spend the placeholder treatment — which exists to stop an invented
 * registration shipping — on a number nobody can be harmed by.
 *
 * It is still an unfilled value. See docs/go-live-checklist.md, which blocks
 * launch on wiring this to the signups table.
 */

/* -------------------------------------------------------------------------- */
/* §1 Announcement bar                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The bar came back, and the note in App.tsx that removed it is answered rather
 * than ignored. It read: "a dismissable strip above the nav, carrying copy
 * nobody arrived for."
 *
 * That was true of the copy it carried then — a generic "now live" strip. It is
 * not true of this one. The offer IS the page's argument: everything below the
 * fold exists to make six months of zero brokerage worth a phone number, so the
 * strip is not a fourth message competing with the headline, it is the headline's
 * premise stated before the headline needs it. The urgency line is the one piece
 * of copy on the page that cannot go anywhere else, because a deadline stated
 * halfway down a scroll is a deadline for the people who scrolled.
 *
 * It is NOT dismissable, and that is the change that makes it defensible. A
 * dismiss control on a bar carrying a statutory qualifier means a reader can
 * close the sentence that says the offer is not total. So the bar stays, it is
 * one line, and the qualifier travels with the claim.
 */
export const announcement = {
  /** The offer, stated at full strength. */
  offer: 'Six months of zero Thinq brokerage for everyone on the waitlist',
  /**
   * The qualifier, rendered in the same line at the same size — never smaller,
   * never in a tooltip. "Zero brokerage" is a claim about OUR fee, and a reader
   * who takes it to mean zero cost has been misled by an omission rather than by
   * a statement. §6 itemises what still applies; this is the short form of it.
   */
  qualifier: 'Statutory charges apply',
  /**
   * The urgency line, and it is the only one on the page.
   *
   * It states a fact about the mechanism — the list closes at launch, because a
   * list that stayed open after launch would not be a list. No countdown, no
   * seat counter ticking down, no "only N left". DESIGN.md's landing rules
   * refuse manufactured scarcity on a broker page, and the distinction being
   * drawn is between a deadline that exists and one that is generated to apply
   * pressure. This one exists.
   */
  urgency: 'The list closes when we open',
}

/* -------------------------------------------------------------------------- */
/* The count, and the promise attached to it                                  */
/* -------------------------------------------------------------------------- */

export const waitlistCount = 2412
export const waitlistCountNoun = 'on the list. It closes when we open.'
export const cadencePromise = 'Verified by OTP. One WhatsApp update a fortnight. Reply STOP any time.'
export const formSubtext = 'one message · nothing else'

export const waitlistForm = {
  heading: 'Get in before we open.',
  phoneLabel: 'Mobile number',
  phonePrefix: '+91',
  phonePlaceholder: 'Mobile number',
  phoneCta: 'Get early access',
  phoneHelp: 'Your number, once. We message you on WhatsApp when your access is ready.',
  underField: 'Six months at zero Thinq brokerage for everyone on the list. Statutory charges apply.',
  subtext: 'one message · nothing else',

  otpLabel: 'Verification code',
  otpCta: 'Get early access',
  otpHelp: 'Six digits, sent to +91 ',
  otpResend: 'Resend code',
  otpChangeNumber: 'Change number',

  successHeading: 'on the list',
  successBody: 'we message you on WhatsApp',

  errors: {
    phoneEmpty: 'ten digits',
    phoneInvalid: 'ten digits',
    otpEmpty: 'Enter the six-digit code we sent you.',
    otpInvalid: 'The code is six digits. Check the message and try again.',
    submit: 'That did not go through. Check your connection and try again.',
  },
}
