import { useEffect, useId, useRef, useState } from 'react'
import { Check, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { waitlistForm } from '../../data/waitlist'

type Step = 'phone' | 'otp' | 'done'

interface WaitlistFormProps {
  variant?: 'hero' | 'closing'
  className?: string
}

const INDIAN_MOBILE = /^[6-9]\d{9}$/
const OTP = /^\d{6}$/

export default function WaitlistForm({ variant = 'hero', className = '' }: WaitlistFormProps) {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const uid = useId()
  const phoneId = `${uid}-phone`
  const otpId = `${uid}-otp`
  const helpId = `${uid}-help`
  const errorId = `${uid}-error`

  const containerRef = useRef<HTMLDivElement>(null)
  const otpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === 'otp') otpRef.current?.focus()
  }, [step])

  const centred = variant === 'closing'

  const submitPhone = () => {
    const value = phone.trim()
    if (!value) return setError(waitlistForm.errors.phoneEmpty)
    if (!INDIAN_MOBILE.test(value)) return setError(waitlistForm.errors.phoneInvalid)

    setError('')
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      setStep('otp')
    }, 600)
  }

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
  /* Done Step                                                              */
  /* ---------------------------------------------------------------------- */

  if (step === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        role="status"
        className={`rounded-[28px] bg-[#0c0c0e]/90 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl max-w-[34em] ${centred ? 'mx-auto text-center' : ''} ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/20">
            <Check className="h-5 w-5 text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-white">
            {waitlistForm.successHeading}
          </h3>
        </div>
        <p className={`mt-3 text-sm leading-relaxed text-neutral-400 ${centred ? 'mx-auto' : ''}`}>
          {waitlistForm.successBody}
        </p>
      </motion.div>
    )
  }

  /* ---------------------------------------------------------------------- */
  /* Form Render                                                            */
  /* ---------------------------------------------------------------------- */

  const onPhone = step === 'phone'

  return (
    <div className="w-full flex justify-center">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full ${centred ? 'mx-auto max-w-[34em]' : 'max-w-[34em]'} ${className}`}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (onPhone) submitPhone()
            else submitOtp()
          }}
          noValidate
          className="relative z-10 w-full"

        >
          <AnimatePresence mode="wait">
            {onPhone ? (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                <label
                  htmlFor={phoneId}
                  className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 text-left mb-2.5"
                >
                  {waitlistForm.phoneLabel}
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1 group/input">
                    <span
                      aria-hidden="true"
                      className="tabular pointer-events-none absolute left-4.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-300 transition-colors"
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
                      className={`h-12 w-full rounded-full border bg-white/[0.05] pl-14 pr-5 text-sm font-mono tracking-wider text-white placeholder:text-neutral-500 placeholder:font-sans placeholder:tracking-normal transition-all duration-200 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        error ? 'border-amber-500/80' : 'border-white/15 hover:border-white/30'
                      }`}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03, translateZ: 10 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={busy}
                    className="h-12 px-6 rounded-full bg-white text-black font-semibold text-xs sm:text-sm transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:bg-neutral-100 hover:shadow-[0_0_28px_rgba(255,255,255,0.3)] disabled:opacity-60 cursor-pointer shrink-0 flex items-center justify-center gap-2"
                  >
                    {busy ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <span>{waitlistForm.phoneCta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                <label
                  htmlFor={otpId}
                  className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 text-left mb-2.5"
                >
                  {waitlistForm.otpLabel}
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                      className={`h-12 w-full rounded-full border bg-white/[0.05] px-5 text-center text-base font-mono tracking-[0.4em] text-white placeholder:text-neutral-500 transition-all duration-200 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        error ? 'border-amber-500/80' : 'border-white/15 hover:border-white/30'
                      }`}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03, translateZ: 10 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={busy}
                    className="h-12 px-6 rounded-full bg-white text-black font-semibold text-xs sm:text-sm transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:bg-neutral-100 hover:shadow-[0_0_28px_rgba(255,255,255,0.3)] disabled:opacity-60 cursor-pointer shrink-0 flex items-center justify-center gap-2"
                  >
                    {busy ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                        <span>Verifying…</span>
                      </>
                    ) : (
                      <span>{waitlistForm.otpCta}</span>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>



          {error && (
            <p id={errorId} role="alert" className="mt-2.5 text-xs text-amber-400 text-left font-medium">
              {error}
            </p>
          )}

          {/* Microcopy footer */}
          <div className="mt-5 border-t border-white/10 pt-3.5 flex items-center justify-center text-xs text-neutral-400 font-normal">
            <span>Closes when we open</span>
          </div>


          {/* OTP step escape options */}
          {!onPhone && (
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
              <button
                type="button"
                onClick={() => {
                  setError('')
                }}
                className="cursor-pointer text-white underline underline-offset-4 hover:text-neutral-200 transition-colors"
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
                className="cursor-pointer text-neutral-400 underline underline-offset-4 hover:text-white transition-colors"
              >
                {waitlistForm.otpChangeNumber}
              </button>
            </p>
          )}
        </form>
      </motion.div>
    </div>
  )
}


