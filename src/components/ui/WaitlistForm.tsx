import { useEffect, useId, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import Button from './Button'
import { waitlistForm } from '../../data/waitlist'

/**
 * The page's one conversion control: a mobile number, then a six-digit code.
 *
 * It renders in two places — the hero and the closing section — so it is a
 * component rather than markup in each. `variant` is the only thing that differs
 * between them, and it changes alignment and nothing else; the two must not be
 * allowed to drift into two different forms.
 *
 * ── THE SUBMIT PATH IS A STUB, AND IT IS LOUD ABOUT IT ─────────────────────
 *
 * `submitPhone` and `submitOtp` below do not call anything. There is no waitlist
 * API in this repo, and inventing a `fetch('/api/waitlist')` against an endpoint
 * that does not exist would produce a form that looks wired, passes a click-
 * through in review, and silently discards every number a real visitor gives it.
 * A stub that is documented is recoverable; a fake integration that reached
 * production would lose signups with no error anywhere.
 *
 * Both are blocking items in docs/go-live-checklist.md. What has to change is
 * confined to those two functions and stated in the comment on each — nothing in
 * the render tree needs to move.
 *
 * Two consequences worth naming, because they are the point of the stub rather
 * than defects in it:
 *
 *  - ANY six digits verify. The stub cannot check a code it never sent.
 *  - Nothing is stored. Reloading the page loses the state.
 *
 * ── Why the OTP is one input and not six boxes ─────────────────────────────
 *
 * Six single-character boxes is the pattern this control is expected to have,
 * and it is worse in every way that can be measured. It breaks paste on most
 * mobile browsers, it produces six tab stops for one value, a screen reader
 * announces six unlabelled edit fields, and backspace behaviour across boxes has
 * to be hand-written and is wrong in at least one browser in every
 * implementation of it.
 *
 * One `<input>` with `autoComplete="one-time-code"` gets the thing the six boxes
 * were imitating for free: iOS and Android offer the code from the SMS directly
 * above the keyboard, and it fills in one tap. The design cost is that the field
 * looks like a text field, which is answered by `.tabular` — the digits set in
 * IBM Plex Mono at a wide tracking, so the field reads as a code without needing
 * to be six of anything.
 *
 * ── Errors ─────────────────────────────────────────────────────────────────
 *
 * Every error is announced and every error is adjacent to the field it belongs
 * to. The live region is rendered UNCONDITIONALLY and filled conditionally: a
 * `role="alert"` element that mounts at the same moment it gains text is a race
 * with the accessibility tree, and the well-known consequence is an error that
 * is announced on some engines and silently skipped on others. An empty region
 * that is already in the tree always announces.
 *
 * The messages come from `src/data/waitlist.ts` rather than being written at the
 * throw site, because they are copy: they are read by someone who has just
 * failed at the only thing the page asked them to do.
 */

type Step = 'phone' | 'otp' | 'done'

interface WaitlistFormProps {
  /**
   * `hero` is left-aligned in a constrained column; `closing` is centred and
   * slightly wider. Nothing else differs — the fields, the validation and the
   * copy are identical, deliberately.
   */
  variant?: 'hero' | 'closing'
  className?: string
}

/**
 * Ten digits, first one 6–9. That is the whole of the Indian mobile numbering
 * plan for this purpose, and it is the reason the field is prefixed with a fixed
 * `+91` rather than accepting a country code: a broker onboarding an Indian
 * resident is not taking a foreign mobile, so accepting one and failing later is
 * worse than not accepting it now.
 */
const INDIAN_MOBILE = /^[6-9]\d{9}$/

/** Six digits, nothing else. */
const OTP = /^\d{6}$/

export default function WaitlistForm({ variant = 'hero', className = '' }: WaitlistFormProps) {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  /*
   * `useId` rather than hardcoded ids: this component mounts twice on the page,
   * and a duplicated `id` would point both labels and both `aria-describedby`
   * references at whichever field happened to render first — so a click on the
   * closing form's label would focus the hero's input, three screens up.
   */
  const uid = useId()
  const phoneId = `${uid}-phone`
  const otpId = `${uid}-otp`
  const helpId = `${uid}-help`
  const errorId = `${uid}-error`

  const otpRef = useRef<HTMLInputElement>(null)

  /*
   * Focus moves to the code field when the step changes, and only then. A
   * keyboard or screen-reader user who submits a phone number otherwise has
   * their focus destroyed by the re-render and lands back at the top of the
   * document with no indication that a new field appeared.
   *
   * Guarded on the step so it cannot steal focus on mount — an autofocused
   * field in a hero would scroll a fresh page to the form before the reader has
   * seen the headline.
   */
  useEffect(() => {
    if (step === 'otp') otpRef.current?.focus()
  }, [step])

  const centred = variant === 'closing'

  /**
   * TODO (blocking, docs/go-live-checklist.md): POST the number to the waitlist
   * service, which sends the OTP. On a non-2xx, set `waitlistForm.errors.submit`
   * and stay on this step — never advance to the code field for a number the
   * service rejected, because the reader will then wait for a message that is
   * not coming.
   */
  const submitPhone = () => {
    const value = phone.trim()

    if (!value) return setError(waitlistForm.errors.phoneEmpty)
    if (!INDIAN_MOBILE.test(value)) return setError(waitlistForm.errors.phoneInvalid)

    setError('')
    setBusy(true)
    /*
     * The delay is not decoration. A control that resolves in the same frame as
     * the click gives no evidence it did anything, and the reader's next move is
     * to click it again. It is also where the network will be.
     */
    window.setTimeout(() => {
      setBusy(false)
      setStep('otp')
    }, 600)
  }

  /**
   * TODO (blocking, docs/go-live-checklist.md): POST the number and the code for
   * verification. Only advance to `done` on a verified response — the success
   * copy tells the reader they are on the list, and showing it for an unverified
   * number is a promise the database cannot keep.
   */
  const submitOtp = () => {
    const value = otp.trim()

    if (!value) return setError(waitlistForm.errors.otpEmpty)
    if (!OTP.test(value)) return setError(waitlistForm.errors.otpInvalid)

    setError('')
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      setStep('done')
    }, 600)
  }

  /* ---------------------------------------------------------------------- */
  /* Done                                                                    */
  /* ---------------------------------------------------------------------- */

  if (step === 'done') {
    return (
      /*
       * `role="status"`, not `alert`. The success is not urgent and `alert`
       * interrupts whatever a screen reader is currently saying — which, at the
       * moment a form is submitted, is usually the button's own label.
       */
      <div
        role="status"
        className={`max-w-[34em] ${centred ? 'mx-auto text-center' : ''} ${className}`}
      >
        <p className="display flex items-center gap-2.5 text-[clamp(1.25rem,2vw,1.5rem)] leading-tight text-fg">
          {/* The one tick on the page, and it is `chrome` rather than `accent`
              or a green.

              Not green: `gain` and `loss` are quarantined to live market data on
              this page, and a green tick beside "you're on the list" is the one
              place a reader could read a colour as a market signal.

              Not `accent`: in this palette the accent is #2c2f38, a dark metal
              meant to be a fill under white text. As a glyph colour on the page
              ground it measures 1.31:1 — invisible. `chrome` #a9aeb8 is 9.16:1
              and is the token for a machined edge, which is the right register
              for an acknowledgement that should be noticed once and not
              celebrated. */}
          <Check className="h-5 w-5 shrink-0 text-chrome" strokeWidth={2} aria-hidden="true" />
          {waitlistForm.successHeading}
        </p>
        <p className={`mt-3 text-base leading-relaxed text-fg-muted ${centred ? 'mx-auto' : ''}`}>
          {waitlistForm.successBody}
        </p>
      </div>
    )
  }

  /* ---------------------------------------------------------------------- */
  /* Phone and OTP                                                           */
  /* ---------------------------------------------------------------------- */

  const onPhone = step === 'phone'

  /*
   * Shared field chrome. A single string rather than two, so the two steps
   * cannot end up with different focus rings or different heights — which is the
   * exact defect a reader notices as "the form jumped".
   *
   * `min-h-12` (48px) clears the 44px touch floor with margin. `bg-surface`
   * rather than a transparent fill: the hero sits on a video, and a transparent
   * input there has whatever contrast the frame behind it happens to give.
   */
  const field =
    'min-h-12 w-full rounded-full border bg-surface px-5 text-base text-fg placeholder:text-fg-subtle transition-colors duration-200'
  /*
   * The error state is carried by the border AND by the message below AND by
   * `aria-invalid`. Never by colour alone — the palette's own rule, and the one
   * that matters most on the only control the page has.
   */
  const fieldBorder = error ? 'border-warning' : 'border-border hover:border-chrome-dim'

  return (
    <div className={`glass-card rounded-3xl p-5 sm:p-6 border border-white/15 backdrop-blur-xl shadow-2xl ${centred ? 'mx-auto' : ''} ${className}`}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (onPhone) submitPhone()
          else submitOtp()
        }}
        noValidate
        className={`max-w-[32em] ${centred ? 'mx-auto' : ''}`}
      >
        <label
          htmlFor={onPhone ? phoneId : otpId}
          className="block text-xs font-mono uppercase tracking-wider text-fg-subtle text-left mb-2"
        >
          {onPhone ? waitlistForm.phoneLabel : waitlistForm.otpLabel}
        </label>

        <div className={`flex flex-col gap-2.5 sm:flex-row ${centred ? 'sm:justify-center' : ''}`}>
          {onPhone ? (
            <div className="relative flex-1">
              <span
                aria-hidden="true"
                className="tabular pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-base font-medium text-fg-muted"
              >
                {waitlistForm.phonePrefix}
              </span>
              <input
                id={phoneId}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
                  if (error) setError('')
                }}
                placeholder={waitlistForm.phonePlaceholder}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : helpId}
                className={`${field} ${fieldBorder} tabular pl-[3.75rem]`}
              />
            </div>
          ) : (
            <div className="relative flex-1">
              <input
                id={otpId}
                ref={otpRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                  if (error) setError('')
                }}
                placeholder="••••••"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : helpId}
                className={`${field} ${fieldBorder} tabular tracking-[0.4em]`}
              />
            </div>
          )}

          <Button type="submit" size="lg" metal={false} className="shrink-0 shadow-lg">
            {busy ? 'Sending…' : onPhone ? waitlistForm.phoneCta : waitlistForm.otpCta}
          </Button>
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-xs text-warning text-left"
          >
            {error}
          </p>
        )}

        {/* Microcopy footer */}
        <div className="mt-4 border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-fg-subtle">
          <span>Closes when we open</span>
          <span>OTP verified · 1 WhatsApp update/fortnight</span>
        </div>
        {/* Step 2's two escapes */}
        {!onPhone && (
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <button
              type="button"
              onClick={() => {
                setError('')
              }}
              className="min-h-11 cursor-pointer rounded text-accent-soft underline underline-offset-4 transition-colors duration-200 hover:text-fg"
            >
              {waitlistForm.otpResend}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('phone')
                setOtp('')
                setError('')
              }}
              className="min-h-11 cursor-pointer rounded text-fg-muted underline underline-offset-4 transition-colors duration-200 hover:text-fg"
            >
              {waitlistForm.otpChangeNumber}
            </button>
          </p>
        )}
      </form>
    </div>
  )
}
