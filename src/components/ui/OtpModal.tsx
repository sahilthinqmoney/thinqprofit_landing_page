import React, { useState, useRef, useEffect } from 'react'
import { Check, ShieldCheck, X, RefreshCw } from 'lucide-react'
import Button from './Button'
import ThinqMark from './ThinqMark'

interface OtpModalProps {
  isOpen: boolean
  phone: string
  onClose: () => void
  onSuccess: () => void
  onEditPhone?: () => void
}

export default function OtpModal({
  isOpen,
  phone,
  onClose,
  onSuccess,
  onEditPhone,
}: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isOpen && timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOpen, timer, canResend])

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', ''])
      setIsVerifying(false)
      setIsVerified(false)
      setTimer(30)
      setCanResend(false)
      setError('')
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])

  if (!isOpen) return null

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

  const handleResend = () => {
    if (!canResend) return
    setTimer(30)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    setError('')
    inputRefs.current[0]?.focus()
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const enteredOtp = otp.join('')
    if (enteredOtp.length < 6) {
      setError('Please enter complete 6-digit OTP')
      return
    }

    setIsVerifying(true)
    setError('')

    // Simulate OTP verification delay
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
      setTimeout(() => {
        onSuccess()
      }, 1800)
    }, 1200)
  }

  const formattedPhone = phone.length === 10 
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : `+91 ${phone}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 isolate">
      {/* Backdrop Dimmer Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-[#0a0a0c]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] transition-all animate-in zoom-in-95 duration-200">
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
          <div className="relative z-10 flex flex-col items-center justify-center py-4 text-center animate-in zoom-in-95 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Check className="h-8 w-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              You're on the waitlist!
            </h3>
            <p className="mt-2 text-sm text-white/70 max-w-xs leading-relaxed">
              Mobile <span className="font-mono font-medium text-white">{formattedPhone}</span> verified. We'll invite you as seats open.
            </p>
            <div className="mt-6 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 border border-white/15">
              Priority Pass #1,429 Reserved
            </div>
          </div>
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
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-white/20 bg-white/5 text-center font-mono text-lg font-bold text-white outline-none transition-all focus:border-white/60 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                  />
                ))}
              </div>

              {error && (
                <p className="mt-3 text-center text-xs font-medium text-rose-400">
                  {error}
                </p>
              )}

              {/* Timer / Resend Row */}
              <div className="mt-5 flex items-center justify-end text-xs text-white/60">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="flex items-center gap-1 font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" /> Resend OTP
                  </button>
                ) : (
                  <span className="font-mono text-white/40">
                    Resend in {timer}s
                  </span>
                )}
              </div>

              {/* Submit CTA Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isVerifying}
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
    </div>
  )
}
