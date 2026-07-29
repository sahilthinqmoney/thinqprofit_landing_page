import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AtSign,
  Briefcase,
  Camera,
  CircleAlert,
  Landmark,
  Mail,
  MonitorPlay,
  Scale,
  Send,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import CopyText from '../ui/CopyText'
import Reveal from '../ui/Reveal'
import {
  attentionInvestors,
  attentionInvestorsHeading,
  bottomBarLinks,
  brandBlurb,
  brandName,
  complaintDataLine,
  copyrightEntity,
  copyrightSuffix,
  footerColumns,
  grievanceHeading,
  grievanceLadder,
  newsletter,
  registrationLines,
  socials,
  statutoryDisclosures,
} from '../../data/footer'

/**
 * §17 Footer + §18.2 Newsletter. Copy verbatim from docs/landing-page-copy.md.
 *
 * This block is long by design. A real broker footer is long: every notice here
 * is either exchange-mandated (§17.5), SEBI-mandated (§17.4, §17.6) or a
 * registration disclosure (§17.3). Dropping any of them is a compliance gap,
 * not a tidy-up.
 *
 * Contrast: all disclosure copy renders at text-fg-muted (6.1:1) or
 * text-warning — never text-fg-subtle (3.9:1) — per landing.md §2 and §9.
 *
 * Every deck string that can carry an unfilled `[PLACEHOLDER]` — registrations,
 * statutory disclosures, the grievance ladder, the entity name — renders through
 * `CopyText`, so a value compliance has not supplied yet can never be mistaken
 * for finished legal copy. Instructions addressed to the build team live as
 * comments in src/data/footer.ts and are never rendered.
 */

/**
 * lucide-react v1.27 has no brand glyphs, so each social uses a neutral icon
 * with an explicit aria-label naming the network. No invented imports.
 */
const socialIcons: Record<string, LucideIcon> = {
  AtSign,
  Briefcase,
  Camera,
  MonitorPlay,
  Send,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function NewsletterForm() {
  const inputId = useId()
  const messageId = `${inputId}-message`
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus('error')
      return
    }
    setStatus('success')
    setEmail('')
  }

  const hasError = status === 'error'

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-5">
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          placeholder={newsletter.placeholder}
          aria-invalid={hasError}
          aria-describedby={status === 'idle' ? undefined : messageId}
          onChange={(event) => {
            setEmail(event.target.value)
            if (status !== 'idle') setStatus('idle')
          }}
          className={`min-h-11 w-full rounded-full border bg-white/5 px-5 py-3 text-base text-fg placeholder:text-fg-muted transition-colors duration-200 focus-visible:border-accent sm:text-sm ${
            hasError ? 'border-warning' : 'border-border'
          }`}
        />
        <Button type="submit" className="shrink-0 sm:px-7">
          {newsletter.button}
        </Button>
      </div>

      {hasError && (
        <p
          id={messageId}
          role="alert"
          className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed text-warning"
        >
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <span>{newsletter.error}</span>
        </p>
      )}

      {status === 'success' && (
        <p
          id={messageId}
          role="status"
          className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed text-accent-soft"
        >
          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <span>{newsletter.success}</span>
        </p>
      )}
    </form>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="border-t border-border-soft bg-bg">
      {/* ------------------------------------------------------------------ */}
      {/* 17.1 Brand block + 18.2 Newsletter                                  */}
      {/* ------------------------------------------------------------------ */}
      <Container>
        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:py-16">
          <div>
            <a
              href="#hero"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-lg"
              aria-label={`${brandName} home`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent">
                <TrendingUp className="h-[1.125rem] w-[1.125rem] text-white" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-fg">{brandName}</span>
            </a>

            {/* Body copy, so it sits at the 16px floor — landing.md §3. */}
            <p className="mt-4 max-w-sm text-base leading-relaxed text-fg-muted">{brandBlurb}</p>

            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {socials.map((social) => {
                const Icon = socialIcons[social.icon] ?? AtSign
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={`${brandName} on ${social.label}`}
                      className="grid h-11 w-11 place-items-center rounded-full border border-border text-fg-muted transition-colors duration-200 hover:border-accent hover:bg-surface-raised hover:text-fg"
                    >
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-7">
            <h2 className="text-base font-semibold tracking-tight text-fg">{newsletter.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{newsletter.body}</p>
            <NewsletterForm />
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* 17.2 Link columns — all eight                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <nav aria-label="Footer" className="py-12">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {footerColumns.map((column) => (
                <div key={column.heading}>
                  <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg">
                    {column.heading}
                  </h3>
                  {/* min-h-11 supplies both the 44px tap target and the list
                      rhythm, so no space-y is needed — landing.md §9. */}
                  <ul className="mt-2">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="-mx-1 flex min-h-11 items-center rounded px-1 text-[0.8125rem] leading-relaxed text-fg-muted transition-colors duration-200 hover:text-fg"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 17.3 Registration block                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className="py-12">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
                <div className="flex items-center gap-2 border-b border-border-soft px-5 py-3.5 sm:px-6">
                  <Landmark className="h-4 w-4 shrink-0 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg">
                    Registration &amp; entity details
                  </h3>
                </div>

                <dl className="divide-y divide-border-soft">
                  {registrationLines.map((line) => (
                    <div
                      key={line.label}
                      className="grid gap-1 px-5 py-3 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-6 sm:px-6"
                    >
                      <dt className="text-xs leading-relaxed text-fg-muted">{line.label}</dt>
                      {/* Inter with tabular figures and the §3 numeral weight —
                          no second typeface. */}
                      <CopyText
                        as="dd"
                        source={line.value}
                        className="tabular text-xs font-medium leading-relaxed tracking-wide text-fg"
                      />
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 17.4 Statutory disclosures                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className="py-12">
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg">
              Statutory disclosures
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {statutoryDisclosures.map((item) => (
                <div key={item.id} className="rounded-xl border border-border-soft bg-surface/30 p-5">
                  <h4 className="text-sm font-semibold text-fg">{item.title}</h4>
                  {item.tone === 'risk' ? (
                    /* The Disclosure risk chrome, replicated so the body can run
                       through CopyText — an unverified SEBI figure inside a risk
                       disclosure must read as unfilled, not as published copy. */
                    <p className="mt-3 flex items-start gap-2 rounded-lg border border-warning/25 bg-warning/5 px-3 py-2.5 text-xs leading-relaxed text-warning">
                      <TriangleAlert
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <CopyText as="span" source={item.body} />
                    </p>
                  ) : (
                    <CopyText
                      as="p"
                      source={item.body}
                      className="mt-3 text-xs leading-relaxed text-fg-muted"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 17.5 Attention Investors                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className="py-12">
            <div className="rounded-2xl border border-warning/25 bg-warning/[0.04] p-5 sm:p-7">
              <div className="flex items-center gap-2">
                <CircleAlert className="h-4 w-4 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warning">
                  {attentionInvestorsHeading}
                </h3>
              </div>

              <ol className="mt-5 grid gap-4 md:grid-cols-2 md:gap-x-8">
                {attentionInvestors.map((notice, index) => (
                  <li key={notice} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="tabular mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full border border-warning/40 text-[0.6875rem] font-medium text-warning"
                    >
                      {index + 1}
                    </span>
                    <CopyText
                      as="span"
                      source={notice}
                      className="text-xs leading-relaxed text-fg-muted"
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 17.6 Grievance redressal ladder                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className="py-12">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 shrink-0 text-accent-soft" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-fg">
                {grievanceHeading}
              </h3>
            </div>

            <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border-soft sm:grid-cols-2 lg:grid-cols-3">
              {grievanceLadder.map((step, index) => {
                const [label, ...rest] = step.split(' — ')
                const detail = rest.join(' — ')
                return (
                  <li key={step} className="flex gap-3 bg-surface p-5">
                    <span
                      aria-hidden="true"
                      className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-[0.6875rem] font-medium text-accent-soft"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <CopyText as="span" source={label} className="block text-sm font-medium text-fg" />
                      <CopyText
                        as="span"
                        source={detail}
                        className="mt-1 block text-xs leading-relaxed text-fg-muted"
                      />
                    </span>
                  </li>
                )
              })}
            </ol>

            <p className="mt-5 text-xs leading-relaxed text-fg-muted">
              {complaintDataLine.before}
              <a
                href={complaintDataLine.href}
                className="rounded text-accent-soft underline underline-offset-2 transition-colors duration-200 hover:text-fg"
              >
                {complaintDataLine.linkLabel}
              </a>
              {complaintDataLine.after}
            </p>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 17.7 Bottom bar                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-border-soft">
        <Container>
          <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-fg-muted">
              © <span className="tabular">{year}</span>{' '}
              <CopyText as="span" source={copyrightEntity} />. {copyrightSuffix}
            </p>

            <ul className="flex flex-wrap items-center gap-x-1 text-xs">
              {bottomBarLinks.map((link, index) => (
                <li key={link} className="flex items-center gap-1">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-fg-subtle">
                      ·
                    </span>
                  )}
                  <a
                    href="#"
                    className="-mx-1 inline-flex min-h-11 items-center rounded px-1 text-fg-muted transition-colors duration-200 hover:text-fg"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  )
}
