import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import CopyText from '../ui/CopyText'
import { announcements, dismissLabel, wordmarkAlt } from '../../data/nav'

interface AnnouncementBarProps {
  /** Which deck variant to show: 'promo' (A), 'regulatory' (B) or 'launch' (C). */
  variantId?: string
}

/**
 * Copy deck §1 — dismissible, one line, centre-aligned.
 * Sits in normal flow above the sticky nav, so dismissing it simply unmounts
 * the element and the nav rises with no leftover gap (nothing is fixed here).
 * Dismiss is a real <button>, so it works from the keyboard (§18.6).
 *
 * Defaults to variant B (regulatory). Variant A is the promo line, and its
 * `[DATE]` is still an unfilled placeholder — shipping it as the standing
 * message would put a hole in the first line of the page. B is complete copy
 * and compliant, so it is what renders when no variant is chosen.
 */
export default function AnnouncementBar({ variantId = 'regulatory' }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false)

  const announcement = announcements.find((item) => item.id === variantId) ?? announcements[0]
  if (dismissed || !announcement) return null

  const { message, linkLabel, href, trailing, linkArrow } = announcement

  /**
   * Dismissing unmounts the button that holds focus, which would drop a keyboard
   * user onto <body> at the top of the tab order. Move focus to the nav wordmark
   * first — the next landmark down the page — then unmount.
   */
  const dismiss = () => {
    const next =
      document.querySelector<HTMLElement>(`a[aria-label="${wordmarkAlt}"]`) ??
      document.querySelector<HTMLElement>('a[href="#main"]')
    next?.focus()
    setDismissed(true)
  }

  return (
    <div className="relative border-b border-border-soft bg-surface/70">
      <div className="mx-auto flex min-h-11 w-full max-w-6xl items-center justify-center px-12 py-2 sm:px-14">
        <p className="text-center text-[0.8125rem] leading-snug text-fg-muted">
          {/* Through CopyText so an unfilled [DATE] in variant A is flagged
              rather than reading as finished copy. */}
          <CopyText as="span" source={message} />{' '}
          {linkLabel && href && (
            <a
              href={href}
              className="inline-flex items-center gap-1 font-medium text-accent-soft underline decoration-accent-soft/40 underline-offset-4 transition-colors duration-200 hover:text-fg hover:decoration-fg/60"
            >
              {linkLabel}
              {linkArrow && (
                <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              )}
            </a>
          )}
          {trailing && <span> {trailing}</span>}
        </p>
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label={dismissLabel}
        className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors duration-200 hover:bg-surface-raised hover:text-fg sm:right-2"
      >
        <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  )
}
