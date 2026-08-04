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

/**
 * TODO (blocking, see docs/go-live-checklist.md): read from the signups table.
 * Hardcoded here so the layout is final and the type can be judged at the width
 * a real five-figure count would occupy.
 */
export const waitlistCount = 2412

/** Rendered beside the count. The noun is "traders", not "users" or "people". */
export const waitlistCountNoun = 'traders on the list'

/**
 * The frequency promise, and it is load-bearing rather than reassuring.
 *
 * A stranger handing over a mobile number to an unlaunched broker is buying an
 * unknown volume of messages, and the honest read of an unqualified "we'll be in
 * touch" is daily. Naming the interval is what makes the number cheap to give.
 * It is a commitment: one message per fortnight is a promise the send schedule
 * has to keep, not a description of current intent.
 */
export const cadencePromise = 'One WhatsApp update per fortnight. Nothing else.'

/* -------------------------------------------------------------------------- */
/* §2 / §7 The form itself                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Every string the two-step form renders, including its errors.
 *
 * Errors are content, not strings invented at the throw site. They are read by a
 * person who has just failed at the one thing the page asked for, and the
 * difference between "Invalid input" and "That is not a 10-digit Indian mobile
 * number" is the difference between a dead end and a fix. The UX rule this
 * follows: an error names what is wrong AND what to do about it, sits beside the
 * field it belongs to, and is announced — see `WaitlistForm`, which puts them in
 * a `role="alert"` region.
 */
export const waitlistForm = {
  /** Step 1. A visible label, never a placeholder standing in for one. */
  phoneLabel: 'Mobile number',
  phonePrefix: '+91',
  phonePlaceholder: '98765 43210',
  phoneCta: 'Join the waitlist',
  /**
   * Sits under the field before anything has gone wrong. Says why the number is
   * being asked for, which is the question a reader has at the moment they are
   * asked for it.
   */
  phoneHelp: 'We send the access link here. No calls.',

  /** Step 2. */
  otpLabel: 'Verification code',
  otpCta: 'Verify and join',
  otpHelp: 'Six digits, sent to +91 ',
  otpResend: 'Resend code',
  otpChangeNumber: 'Change number',

  /** Step 3. */
  successHeading: "You're on the list.",
  successBody:
    'We will message you on WhatsApp when access opens. Your six months of zero Thinq brokerage start the day your account activates.',

  errors: {
    phoneEmpty: 'Enter your mobile number.',
    phoneInvalid: 'That is not a 10-digit Indian mobile number. Enter it without +91 or spaces.',
    otpEmpty: 'Enter the six-digit code we sent you.',
    otpInvalid: 'The code is six digits. Check the message and try again.',
    /**
     * The generic failure. It exists because a network error must not render as
     * a validation error — telling someone their correct number is wrong is
     * worse than telling them nothing, and it makes them edit a field that was
     * never the problem.
     */
    submit: 'That did not go through. Check your connection and try again.',
  },
}
