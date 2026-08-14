import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Check, ShieldCheck, X, RefreshCw } from 'lucide-react'
import Button from './Button'
import ThinqMark from './ThinqMark'
import CandlestickLoader from './CandlestickLoader'
import {
  AuthError,
  loadCatalogue,
  renderMessage,
  sendOtp,
  verifyOtp,
  type SendOtpResult,
} from '../../lib/authService'

/** How often the two deadlines are re-read. */
const TICK_MS = 500

interface OtpModalProps {
  isOpen: boolean
  phone: string
  /** The journey this modal belongs to, from the send that opened it. */
  attempt: SendOtpResult | null
  /** A resend replaces the attempt, so the parent holds it. */
  onAttempt: (attempt: SendOtpResult) => void
  onClose: () => void
  onSuccess: (outcome: 'SIGNED_IN' | 'REGISTERED') => void
  onEditPhone?: () => void
}

/** Seconds from now until an absolute instant, floored at zero. */
function secondsUntil(instant: string | undefined, now: number): number {
  if (!instant) return 0
  return Math.max(0, Math.ceil((new Date(instant).getTime() - now) / 1000))
}

export default function OtpModal({
  isOpen,
  phone,
  attempt,
  onAttempt,
  onClose,
  onSuccess,
  onEditPhone,
}: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [outcome, setOutcome] = useState<'SIGNED_IN' | 'REGISTERED' | null>(null)
  const [error, setError] = useState('')
  /** Set by ACCOUNT_LOCKED, and by the resend limits. Absolute instants. */
  const [lockedUntil, setLockedUntil] = useState<string | undefined>()
  const [resendBlockedUntil, setResendBlockedUntil] = useState<string | undefined>()
  const [now, setNow] = useState(() => Date.now())

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  /*
   * One clock for every deadline.
   *
   * The countdowns are derived from the absolute instants the server sent, not
   * decremented from a starting number — a slow request would otherwise push
   * the deadline out by however long it spent in flight, and a backgrounded tab
   * would drift by however long it was throttled.
   */
  useEffect(() => {
    if (!isOpen) return
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [isOpen])

  // The copy for every server message id comes from here.
  const [catalogue, setCatalogue] = useState<Awaited<ReturnType<typeof loadCatalogue>>>(null)
  useEffect(() => {
    if (!isOpen) return
    let live = true
    void loadCatalogue().then((c) => {
      if (live) setCatalogue(c)
    })
    return () => {
      live = false
    }
  }, [isOpen])

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return
    const originalStyle = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isOpen])

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', ''])
      setIsVerifying(false)
      setIsResending(false)
      setIsVerified(false)
      setOutcome(null)
      setError('')
      setLockedUntil(undefined)
      setResendBlockedUntil(undefined)
      setNow(Date.now())
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])

  const codeExpiresIn = secondsUntil(attempt?.expiresAt, now)
  const cooldownEndsIn = secondsUntil(
    resendBlockedUntil ?? attempt?.resendAvailableAt,
    now,
  )
  const lockedFor = secondsUntil(lockedUntil, now)
  const isLocked = lockedFor > 0

  /*
   * Resend opens either when the cooldown lapses OR once the code has expired.
   *
   * The second half matters: past `expiresAt` the server accepts a resend even
   * inside the 30s window, so watching only the cooldown would grey out a
   * button the server would have honoured — leaving a reader with a dead code
   * and no way to ask for another.
   */
  const canResend = !isLocked && !isResending && (cooldownEndsIn === 0 || codeExpiresIn === 0)

  /** Turns a failure into copy, and into whatever state it implies. */
  const applyError = (err: unknown, fallback: string) => {
    if (!(err instanceof AuthError)) {
      setError(fallback)
      return
    }
    switch (err.code) {
      case 'ACCOUNT_LOCKED':
        setLockedUntil(err.retryExpiresAt)
        break
      case 'RESEND_COOLDOWN':
      case 'RESEND_LIMIT':
      case 'DISPATCH_CAP':
        setResendBlockedUntil(err.retryExpiresAt)
        break
      default:
        break
    }
    setError(
      renderMessage(
        catalogue,
        { id: err.messageId, params: err.params },
        // INTERNAL and UPSTREAM_UNAVAILABLE carry no message id at all, so
        // these are the words for "the catalogue has nothing to say".
        err.code === 'NETWORK'
          ? "Couldn't reach the server. Check your connection and try again."
          : fallback,
      ),
    )
  }

   if (!isOpen || typeof document === 'undefined') return null

  const handleInputChange = (index: number, value: string) => {
    // Only numeric input
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    // Handle paste of 6 digits
    if (value.length > 1) {
      const pastedDigits = value.slice(0, 6).split('')
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedDigits[i] || ''
      }
      setOtp(newOtp)
      const nextFocus = Math.min(pastedDigits.length, 5)
      inputRefs.current[nextFocus]?.focus()
      return
    }

    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = async () => {
    if (!canResend || !attempt) return
    setIsResending(true)
    setError('')
    try {
      // Same endpoint, carrying the attempt — that makes it a resend against
      // this journey rather than the start of a new one.
      const next = await sendOtp({ value: phone, attemptId: attempt.attemptId })
      onAttempt(next)
      setResendBlockedUntil(undefined)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      applyError(err, "Couldn't send a new code. Try again in a moment.")
    } finally {
      setIsResending(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return
    const enteredOtp = otp.join('')
    if (enteredOtp.length < 6) {
      setError('Please enter complete 6-digit OTP')
      return
    }
    if (!attempt) {
      setError('That request expired. Start again from your number.')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const result = await verifyOtp({ attemptId: attempt.attemptId, code: enteredOtp })
      // Allow 1.5s for the candlestick chart loader to play out smoothly
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setOutcome(result.outcome)
      setIsVerified(true)
    } catch (err) {
      /*
       * Wrong, expired and already-used all arrive as OTP_INVALID, and the
       * client genuinely cannot tell them apart — telling them apart would
       * leak whether a given code ever existed. So the copy comes from the
       * catalogue and never guesses which of the three happened.
       */
      applyError(err, 'That code was not accepted. Check it and try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  /*
   * Prefer the server's mask over anything derived from what was typed. It is
   * the number the code actually went to, after normalisation, so it is the
   * only version that can confirm the message went where the reader meant.
   *
   * `attempt?.maskedTo` comes from the server and is already masked, e.g.
   * "+91-XXXXXX0121", and it must not be run through a digit filter: stripping
   * non-digits removes the X's along with the punctuation and leaves "+91-0121",
   * which reads as a broken number rather than a masked one.
   *
   * Only the local fallback — what the reader typed, used for the instant
   * between opening and the first response — needs formatting.
   */
  const formattedPhone =
    attempt?.maskedTo ?? `+91-${phone.replace(/^\+?91/, '').replace(/\D/g, '')}`

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 isolate">
      {/* Backdrop Dimmer Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in z-0"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-[#0a0a0c]/98 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] transition-all animate-in zoom-in-95 duration-200">
        {/* Subtle Light Radial & Linear Gradient Ambient Background Overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl z-0"
          style={{
            background: 'radial-gradient(120% 120% at 50% 0%, rgba(255, 255, 255, 0.08) 0%, rgba(40, 40, 50, 0.2) 45%, rgba(10, 10, 12, 0.98) 100%)',
          }}
        />

        {/* Bottom Gradient Fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 rounded-b-3xl bg-gradient-to-t from-black/60 via-black/20 to-transparent z-0" />

        {/* Top Edge Specular Highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

        {/* Bottom Edge Specular Highlight */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Centered Thinq Logo & Text Brand Lockup */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center justify-center gap-2.5">
            <ThinqMark size={32} tone="steel" />
            <span className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
              Thinq
            </span>
          </div>
        </div>

        {isVerified ? (
          /* Success State */
          <div className="relative z-10 flex flex-col items-center justify-center py-4 text-center animate-in zoom-in-95 duration-400">
            {/* Premium Glowing Checkmark without background or border ring */}
            <div className="relative flex items-center justify-center mb-5 animate-in zoom-in-50 duration-500">
              <div className="absolute inset-0 rounded-full blur-xl bg-emerald-500/35 animate-pulse" />
              <Check className="relative h-14 w-14 text-emerald-400 stroke-[2.5] drop-shadow-[0_0_24px_rgba(16,185,129,0.95)]" />
            </div>

            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-emerald-400/90 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
              Verification Complete
            </span>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              {outcome === 'SIGNED_IN' ? "You're signed in" : "You're on the waitlist!"}
            </h3>
            
            <p className="mt-2 text-sm text-white/70 max-w-xs leading-relaxed font-sans">
              Mobile <span className="font-mono font-medium text-white tracking-wide">{formattedPhone}</span>{' '}
              {outcome === 'SIGNED_IN'
                ? 'verified. Welcome back.'
                : "verified. We'll invite you as seats open."}
            </p>

            {/* Manual Close / Done Control Button */}
            <Button
              type="button"
              onClick={() => {
                if (outcome) onSuccess(outcome)
                onClose()
              }}
              size="lg"
              fullWidth
              className="mt-6 shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_32px_rgba(16,185,129,0.4)]"
            >
              Done
            </Button>
          </div>
        ) : isVerifying ? (
          /* Premium Fintech Candlestick Verification Loading Screen */
          <CandlestickLoader />
        ) : (
          /* OTP Entry State */
          <div className="relative z-10">
            {/* Header Subtitle with Target Phone */}
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-white/80 shrink-0" strokeWidth={1.75} />
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Enter 6-digit OTP sent to{' '}
                <span className="font-mono font-semibold text-white tracking-wide">
                  {formattedPhone}
                </span>
                {onEditPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onEditPhone()
                    }}
                    className="ml-2 font-medium text-white/90 hover:text-white underline transition-colors"
                  >
                    Edit
                  </button>
                )}
              </p>
            </div>

            {/* OTP Input Boxes Form */}
            <form onSubmit={handleVerify} className="mt-6">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    // Five wrong codes locks the account; the contract asks for
                    // the input to be dead until the lock lifts.
                    disabled={isLocked}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-white/20 bg-white/5 text-center font-mono text-lg font-bold text-white outline-none transition-all focus:border-white/60 focus:bg-white/10 focus:ring-2 focus:ring-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                ))}
              </div>

              {error && (
                <p className="mt-3 text-center text-xs font-medium text-rose-400">
                  {error}
                </p>
              )}

              {/* Timer / Resend Row. Every number here is derived from an
                  absolute instant the server sent, so it cannot drift. */}
              <div className="mt-5 flex items-center justify-between text-xs text-white/60">
                {isLocked ? (
                  <span className="font-mono text-rose-400/80">
                    Locked · try again in {lockedFor}s
                  </span>
                ) : codeExpiresIn > 0 ? (
                  <span className="font-mono text-white/40">
                    Code expires in {codeExpiresIn}s
                  </span>
                ) : (
                  <span className="font-mono text-white/40">Code expired</span>
                )}

                {canResend ? (
                  <button
                    type="button"
                    onClick={() => void handleResend()}
                    className="flex items-center gap-1 font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" /> Resend OTP
                  </button>
                ) : (
                  <span className="font-mono text-white/40">
                    {isResending ? 'Sending…' : `Resend in ${cooldownEndsIn}s`}
                  </span>
                )}
              </div>

              {/* Submit CTA Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isVerifying || isLocked}
                className="mt-6 shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:shadow-[0_0_32px_rgba(255,255,255,0.35)]"
              >
                {isVerifying ? 'Verifying OTP...' : 'Verify & Join Waitlist'}
              </Button>

              {/* By proceeding consent line */}
              <p className="mt-4 text-center text-xs text-white/60 font-normal">
                By proceeding, you agree to all{' '}
                <a
                  href="/terms"
                  onClick={() => {
                    sessionStorage.setItem('return_to_otp', 'true')
                    if (phone) {
                      sessionStorage.setItem('otp_phone', phone)
                    }
                    /*
                     * The journey has to survive the trip too. Without it the
                     * modal reopens with no attemptId, and the first verify
                     * fails on a code that was perfectly good. sessionStorage
                     * is per-tab, so this keeps two tabs as two journeys — a
                     * cookie would not.
                     */
                    if (attempt) {
                      sessionStorage.setItem('otp_attempt', JSON.stringify(attempt))
                    }
                  }}
                  className="font-semibold text-white underline hover:text-white/80 transition-colors inline-block"
                >
                  T&C
                </a>
                .
              </p>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
