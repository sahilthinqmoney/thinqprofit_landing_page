import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

/**
 * Registers the GSAP plugins once, and refreshes ScrollTrigger after the page
 * has stopped changing height.
 *
 * The refreshes are the point. ScrollTrigger resolves `start: 'top 85%'` into
 * absolute pixel offsets when a trigger is created and never re-measures on its
 * own, but this page keeps growing after first paint:
 *
 *  1. Webfonts. Plus Jakarta Sans and JetBrains Mono load async from Google
 *     Fonts. Until they swap in, every heading is measured in fallback metrics —
 *     and display type runs past 90px, so the error is tens of pixels per
 *     heading and compounds down the page.
 *  2. `min-h-svh` sections, whose height depends on the visual viewport — which
 *     on mobile settles only once browser chrome does.
 *  3. Late-decoding images and video posters.
 *
 * Without the refresh, triggers computed against the pre-font layout never fire
 * and their tweens sit permanently at the from-state — a heading stuck at 45%
 * opacity behind a blur, which is what shipped before this module existed.
 */

let registered = false

export function initScrollTrigger() {
  if (registered) return
  registered = true

  gsap.registerPlugin(ScrollTrigger, useGSAP)

  if (typeof document === 'undefined') return

  // Fonts are the big one; `document.fonts.ready` is the only reliable signal.
  // Guarded because the API is absent in some older engines.
  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => ScrollTrigger.refresh())
  }

  // Covers the `svh` and late-layout cases that `fonts.ready` does not. Two
  // rAFs plus a short timeout lands as early as it safely can, and a refresh is
  // cheap next to being wrong for the rest of the session.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.setTimeout(() => ScrollTrigger.refresh(), 240)
    })
  })

  // ScrollTrigger's own resize handling does not see an image finishing decode.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })

  /*
   * Restored from the back/forward cache.
   *
   * Safari freezes the page rather than rebuilding it, so a reader who leaves,
   * rotates the device or resizes the window, and comes back gets every trigger
   * still holding pixel offsets measured against the old layout. Nothing else
   * here fires on a restore — not `load`, not the rAF pair, not `fonts.ready` —
   * so without this the whole page's scroll animation stays wrong until reload,
   * which is exactly the kind of fault that only some readers ever see.
   */
  window.addEventListener('pageshow', (event) => {
    if ((event as PageTransitionEvent).persisted) ScrollTrigger.refresh()
  })
}

export { gsap, ScrollTrigger, useGSAP }
