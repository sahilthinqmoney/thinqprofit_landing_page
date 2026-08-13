import { useState, useEffect } from 'react'
import Container from '../ui/Container'
import Button from '../ui/Button'
import OtpModal from '../ui/OtpModal'
import { hero } from '../../data/hero'
import MediaBackdrop from '../ui/MediaBackdrop'
import { lqipFor } from '../../data/lqip'
import { MEDIA_DEADLINE_MS } from '../../hooks/useMediaGate'

/** Preloaded in index.html — the one piece of media that races the page. */
const HERO_POSTER = '/clips/hero-backdrop-poster.webp'


/**
 * §2 Hero — full-bleed clip with the copy and the phone field on top of it.
 *
 * The hero CONTAINS the conversion rather than linking to it. The ask is a phone
 * number and the cost of giving it is a fortnightly message, so a reader already
 * convinced by the offer should not have to scroll four sections to act on it.
 *
 * Two rules govern the opening motion:
 *
 *  - The headline settles out of a blur, a line at a time, while the field
 *    behind it resolves. This is the page's one authored motion moment.
 *  - Nothing rises. The motion damps DOWNWARD into place, because
 *    docs/motion-brief.md §7 reads upward motion on a broker page as a claim
 *    about returns.
 *
 * The settle is CSS (`.hero-settle-*` in index.css), driven by nothing but the
 * delay each line carries. It used to be a React state flip — mounted settled,
 * unsettled in an effect, settled again two frames later — and that stopped
 * working the moment the page began arriving prerendered: the headline was
 * already on screen and finished, so the effect took it back to opacity 0 and
 * played the intro a second time, seconds late. Worse, whether the reader saw
 * that depended on their engine. WebKit painted the collapse; Chromium batched
 * it away. In CSS the animation belongs to the element the HTML delivered, so
 * it runs exactly once, at first paint, before any script has loaded, and
 * hydration cannot restart it.
 *
 * The headline is split on `\n`, so it animates whatever lines the string
 * produces — the current copy carries no breaks and wraps on its own.
 *
 * The market-risk disclosure sits in an opaque rail at the foot of the section:
 * mandatory, visible in the first viewport, never collapsed, never behind a
 * blur.
 */

/** Line n starts at `SETTLE_LEAD + n * SETTLE_STAGGER`. */
const SETTLE_LEAD_MS = 90
const SETTLE_STAGGER_MS = 110

export default function Hero() {
  const lines = hero.headline.split('\n')
  const [phone, setPhone] = useState('')
  const [isOtpOpen, setIsOtpOpen] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    /*
     * Ignore the flag while the terms page is what the reader asked for.
     *
     * App has to start at route 'home' so its first render matches the
     * prerendered HTML — computing the route from the URL up front would
     * mismatch on /terms, and in React 19 a mismatch discards the whole tree.
     * So Hero mounts for one commit even on /terms, and child effects run
     * before parent effects, which means this ran and cleared the flag before
     * App had switched away. The reader came back to no modal and no number.
     * Measured: the flag was gone ~50ms into the terms page load.
     */
    const path = window.location.pathname
    if (path === '/terms' || window.location.hash === '#terms') return

    const shouldReturnToOtp = sessionStorage.getItem('return_to_otp')
    if (shouldReturnToOtp === 'true') {
      sessionStorage.removeItem('return_to_otp')
      const savedPhone = sessionStorage.getItem('otp_phone')
      if (savedPhone) {
        setPhone(savedPhone)
      }
      // The number is the reason this round trip exists; drop it once it is
      // back in the field rather than leaving it in storage for the tab.
      sessionStorage.removeItem('otp_phone')
      setIsOtpOpen(true)
    }
  }, [])

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = phone.replace(/\D/g, '')
    if (!cleaned) {
      setFormError('Please enter your 10-digit mobile number')
      return
    }
    if (cleaned.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number')
      return
    }
    setFormError('')
    setIsOtpOpen(true)
  }

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-svh w-full flex-col justify-between overflow-hidden bg-bg pt-12 pb-8 sm:pt-16 sm:pb-12"
    >
      {/* OtpModal Verification Pop-up */}
      <OtpModal
        isOpen={isOtpOpen}
        phone={phone}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={() => setIsOtpOpen(false)}
        onEditPhone={() => {
          setIsOtpOpen(false)
          document.getElementById('hero-phone')?.focus()
        }}
      />
      {/* Full-bleed background media layer */}
      <MediaBackdrop
        alt={hero.mediaAlt}
        lqip={lqipFor(HERO_POSTER)}
        poster={HERO_POSTER}
        video={{
          /*
           * Three encodes off one 1920x1080 master, measured against it at the
           * size each device actually renders:
           *
           *   mp4     1920x1080 @2600k  5.2 MB  39.4 dB on a 2880x1800 desktop
           *   mobile  1280x720  @1300k  2.6 MB  36.5 dB in a 1264x2151 phone box
           *   light    960x540   @450k  0.9 MB  for 3g-class links only
           *
           * What shipped before was a 1280x720 @1220k desktop clip (37.5 dB)
           * and a 960x540 phone clip (32.2 dB) — both re-encodes of the master
           * made when start time was the problem being solved. The master was
           * always 1080p at 6.4 Mbps; the quality had been thrown away upstream.
           */
          /*
           * Adaptive first: three renditions in two-second segments, switched
           * per segment on measured throughput and buffer health. Safari plays
           * it natively; everything else lazy-loads hls.js only after the gate
           * has decided this reader gets video, because the library is ~106 KB
           * compressed and must never delay a reader who will see only the
           * poster. The fixed files below remain the fallback.
           */
          hls: '/hls/hero.m3u8',
          mp4: '/clips/hero-backdrop.mp4',
          mobile: '/clips/hero-backdrop-mobile.mp4',
          light: '/clips/hero-backdrop-light.mp4',
        }}
        deadlineMs={MEDIA_DEADLINE_MS.hero}
        focus="center"
        priority
      />

      {/* Top Ambient Keynote Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,255,255,0.12),rgba(255,255,255,0))]"
      />

      {/* Balanced dark overlay scrim to ensure background video visibility while keeping text readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-black/25 bg-[radial-gradient(ellipse_85%_85%_at_50%_45%,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.65)_100%)]"
      />

      <div className="flex flex-1 flex-col items-center justify-center my-auto py-6 sm:py-10">
        <Container>
          <div className="mx-auto max-w-[56em] text-center flex flex-col items-center">
            {/* Display H1 Headline with Metallic Depth */}
            <h1 className="hero-settle-axis headline-fit display-lead font-display tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] leading-[1.12]">
              {lines.map((line: string, index: number) => (
                <span key={line} className="block py-1">
                  <span
                    className="hero-settle-line headline-metal block py-2 leading-[1.15]"
                    style={
                      {
                        '--settle-delay': `${SETTLE_LEAD_MS + index * SETTLE_STAGGER_MS}ms`,
                      } as React.CSSProperties
                    }
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            {/* Subheadline & Value Proposition Container */}
            <div
              className="hero-settle-block mt-6 sm:mt-8 flex flex-col items-center w-full"
              style={
                {
                  '--settle-delay': `${SETTLE_LEAD_MS + lines.length * SETTLE_STAGGER_MS}ms`,
                } as React.CSSProperties
              }
            >
              {/* Subheadline Paragraph */}
              <p className="max-w-[36em] mx-auto text-base sm:text-lg lg:text-xl leading-relaxed text-white/85 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] text-balance font-normal">
                <span className="text-white font-semibold">
                  Thinq reads price action back to you
                </span>{' '}
                — what's in play, what's changed, what's noise.
              </p>

              {/* Offer Line */}
              <p className="mt-5 sm:mt-6 max-w-[46em] mx-auto text-sm sm:text-base leading-relaxed text-white/80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] text-balance">
                <span className="font-semibold text-white">{hero.offerBold}</span>{' '}
                <span className="text-white/70">{hero.offerNote}</span>
              </p>

              {/* Waitlist Mobile Input Form */}
              <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center max-w-md mx-auto w-full">
                <form
                  onSubmit={handleWaitlistSubmit}
                  className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <div className="relative flex-1 w-full flex items-center rounded-full border border-white/25 bg-black/60 backdrop-blur-2xl px-5 py-3.5 text-white transition-all duration-300 focus-within:border-white/60 focus-within:bg-black/80 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                    <span className="text-white/90 font-mono text-sm font-medium mr-3 border-r border-white/20 pr-3 shrink-0">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      id="hero-phone"
                      aria-label="Mobile number"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setFormError('')
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none font-normal"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    className="sm:w-auto shrink-0 shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:shadow-[0_0_32px_rgba(255,255,255,0.35)] transition-all duration-300"
                  >
                    Join the waitlist
                  </Button>
                </form>
                {formError && (
                  <p className="mt-2.5 text-xs font-medium text-rose-400">
                    {formError}
                  </p>
                )}
              </div>

              {/* Trust Badge & Disclosures */}
              <div className="mt-8 max-w-lg text-center">
                <p className="text-xs font-medium text-white/65 tracking-wide">
                  {hero.trust}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
