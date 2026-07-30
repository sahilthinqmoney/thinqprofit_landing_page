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
import ChromaticWordmark from '../ui/ChromaticWordmark'
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
 * Contrast: all disclosure copy renders at text-fg-muted (13.08:1) or
 * text-warning (7.02:1). Under the previous palette fg-subtle was 3.9:1 and so
 * was banned outright here; it now measures 5.02:1 and clears the floor, but
 * disclosure copy stays on fg-muted anyway. Legal text should not sit at the
 * bottom of the legible range just because it is allowed to — fg-subtle is for
 * footer meta and fine print, and only the bottom bar's separator uses it.
 *
 * Colour: nothing in this footer is coloured except by meaning. `warning` marks
 * the risk disclosure and the Attention Investors panel; every other mark, icon
 * and numeral is `chrome`, and `accent-soft` is held to actual links. There is
 * no brand hue left to tint anything with.
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

      {/* The input stays text-base at every width, never smaller: below 16px
          iOS zooms the page on focus — landing.md §5 `.input`. */}
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
          className={`min-h-11 w-full rounded-full border bg-white/5 px-5 py-3 text-base text-fg placeholder:text-fg-muted transition-colors duration-200 focus-visible:border-accent ${
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

  /* Registration lines split into two stacks for the xl two-up layout. Column
     order, not row order: a reader scans one stack top to bottom, so related
     entries stay adjacent. Every line still renders — nothing is dropped. */
  const registrationSplit = Math.ceil(registrationLines.length / 2)
  const registrationGroups = [
    registrationLines.slice(0, registrationSplit),
    registrationLines.slice(registrationSplit),
  ].filter((group) => group.length > 0)

  return (
    <footer id="footer" className="border-t border-border-soft bg-bg">
      {/* ------------------------------------------------------------------ */}
      {/* 17.1 Brand block + 18.2 Newsletter                                  */}
      {/* ------------------------------------------------------------------ */}
      <Container>
        {/* Not a 50/50 split any more. Past ~1300px each half was 700px+, which
            left the brand text stranded at one edge and stretched the signup
            card into a banner. The card now holds a fixed 28rem column at the
            right edge and the brand block takes whatever remains. */}
        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-20 lg:py-16">
          <div>
            <a
              href="#hero"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-lg"
              aria-label={`${brandName} home`}
            >
              {/* Chrome tile, ink glyph — one mark, identical at every size on
                  the page. Accent belongs to the newsletter submit sitting in
                  the same row; the mark stays a luminance step below it. White
                  on either metal is invisible (1.2:1 / ~2.1:1). */}
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-chrome">
                <TrendingUp className="h-[1.125rem] w-[1.125rem] text-bg" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-fg">{brandName}</span>
            </a>

            {/* Body copy, so it sits at the 16px floor — landing.md §3. */}
            <p className="mt-4 max-w-md text-base leading-relaxed text-fg-muted">{brandBlurb}</p>

            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {socials.map((social) => {
                const Icon = socialIcons[social.icon] ?? AtSign
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={`${brandName} on ${social.label}`}
                      /* Edge goes to chrome on hover, not accent: five social
                         circles pulsing at the action value would read as five
                         primary buttons in the footer. */
                      className="grid h-11 w-11 place-items-center rounded-full border border-border text-fg-muted transition-colors duration-200 hover:border-chrome hover:bg-surface-raised hover:text-fg"
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
            {/* Eight columns, so past xl they all sit on one row rather than
                two rows of four very wide, half-empty columns. Below that the
                labels need the width, so it steps 4-up then 2-up. */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 xl:grid-cols-8 2xl:gap-x-8">
              {footerColumns.map((column) => (
                <div key={column.heading}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg">
                    {column.heading}
                  </h3>
                  {/* min-h-11 gives the 44px tap target; space-y-2 gives the 8px
                      separation between adjacent targets — landing.md §9. The
                      two are separate requirements and min-h alone met only one. */}
                  <ul className="mt-3 space-y-2">
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
            <Reveal variant="settle">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
                <div className="flex items-center gap-2 border-b border-border-soft px-5 py-3.5 sm:px-6">
                  {/* Chrome, not accent-soft. Under the gold system a softened
                      accent on a section icon read as a whisper of brand hue;
                      with no hue it just reads as a dimmed action. Chrome is the
                      token that actually means "machined mark". */}
                  <Landmark className="h-4 w-4 shrink-0 text-chrome" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg">
                    Registration &amp; entity details
                  </h3>
                </div>

                {/* Twelve rows read as one tall ladder of half-empty rows once
                    the container passes ~1300px. Split into two stacks at xl:
                    the block halves in height and each value sits a readable
                    distance from its own label instead of 1000px away. */}
                <div className="grid grid-cols-1 divide-y divide-border-soft xl:grid-cols-2 xl:divide-x xl:divide-y-0">
                  {registrationGroups.map((group) => (
                    <dl key={group[0].label} className="divide-y divide-border-soft">
                      {group.map((line) => (
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
                  ))}
                </div>
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg">
              Statutory disclosures
            </h3>

            {/* Four across at xl. Two across at 1600px would run each disclosure
                to ~130 characters a line; four holds it near a readable measure
                and reads as one row of statutory blocks. */}
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-warning">
                  {attentionInvestorsHeading}
                </h3>
              </div>

              {/* All seven notices, never fewer. Column count climbs with the
                  container so each notice keeps a readable line length instead
                  of running the full 1600px. */}
              <ol className="mt-5 grid gap-4 md:grid-cols-2 md:gap-x-8 xl:grid-cols-3 2xl:grid-cols-4">
                {attentionInvestors.map((notice, index) => (
                  <li key={notice} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="tabular mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full border border-warning/40 text-xs font-medium text-warning"
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
              <Scale className="h-4 w-4 shrink-0 text-chrome" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg">
                {grievanceHeading}
              </h3>
            </div>

            {/* Six steps. At 2xl they line up as a single left-to-right row,
                which is what an escalation ladder should look like; below that
                three-wide cells stay legible. */}
            <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border-soft sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              {grievanceLadder.map((step, index) => {
                const [label, ...rest] = step.split(' — ')
                const detail = rest.join(' — ')
                return (
                  <li key={step} className="flex gap-3 bg-surface p-5">
                    <span
                      aria-hidden="true"
                      /* Step numerals are marks, so chrome — 8.6:1 on `surface`,
                         well clear of the floor, and it keeps the ladder from
                         looking like six actions. */
                      className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-xs font-medium text-chrome"
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
      {/* 17.7 Brand lockup                                                   */}
      {/* ------------------------------------------------------------------ */}
      {/* Outside Container deliberately — the mark runs to the viewport edges.
          A wordmark this size that stops inside a 1760px rail reads as an
          oversized heading rather than as a stamp on the page. It sits above the
          bottom bar so the legal line stays the last thing in the document. */}
      <div className="border-t border-border-soft pt-14 sm:pt-16 lg:pt-20">
        <ChromaticWordmark />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 17.8 Bottom bar                                                     */}
      {/* ------------------------------------------------------------------ */}
      {/* No top border: the wordmark above is already the terminal gesture, and
          a rule between them would read as the mark being fenced off. */}
      <div>
        <Container>
          <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-fg-muted">
              © <span className="tabular">{year}</span>{' '}
              <CopyText as="span" source={copyrightEntity} />. {copyrightSuffix}
            </p>

            {/* gap-x-2 either side of the separator keeps ~12px between the
                padded hit areas of adjacent links, past the 8px floor. */}
            <ul className="flex flex-wrap items-center gap-x-2 text-xs">
              {bottomBarLinks.map((link, index) => (
                <li key={link} className="flex items-center gap-2">
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
