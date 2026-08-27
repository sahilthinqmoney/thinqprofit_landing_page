import { useEffect } from 'react'
import type { gsap as Gsap } from 'gsap'

/**
 * Runs a GSAP setup function, with GSAP itself fetched off the critical path.
 *
 * GSAP and ScrollTrigger together are ~40 KB gzipped and nothing in the first
 * viewport uses them: every tween on this page is scroll-scrubbed and belongs to
 * a section below the fold. Imported statically they still landed in the entry
 * chunk, where their parse and evaluation ran inside the same task as hydration
 * — the 390 ms long task that Lighthouse attributes the page's blocking time to.
 *
 * `import()` moves that work into a chunk that starts downloading after mount
 * instead of before first paint. It is deliberately started in an effect on
 * mount rather than on scroll: the cost we are avoiding is being *in the entry
 * chunk*, and waiting for a scroll event would risk the reader arriving at a
 * section before its animation exists.
 *
 * ── Why this is not `useGSAP` ──────────────────────────────────────────────
 *
 * `useGSAP` cannot be used with a dynamically imported GSAP, because a hook has
 * to be called unconditionally during render and the library is not there yet.
 * What it does, though, is `gsap.context(fn, scope)` plus `revert()` on
 * cleanup, and that is reproduced exactly here — including honouring a cleanup
 * function returned by the setup, which `context.revert()` invokes. The tweens
 * themselves are untouched; only the moment they are created moves.
 *
 * The setup runs once on mount, matching the dependency-less `useGSAP` calls it
 * replaced, so it closes over first-render props exactly as before.
 */
export function useScrollAnimation(
  setup: (gsap: typeof Gsap) => (() => void) | void,
  scope: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    let cancelled = false
    let context: { revert: () => void } | undefined

    void import('./scrollTrigger')
      .then((module) => {
        // Unmounted while the chunk was in flight: create nothing, so there is
        // nothing to tear down against a detached element.
        if (cancelled) return
        module.initScrollTrigger()
        context = module.gsap.context(() => setup(module.gsap), scope.current ?? undefined)
      })
      .catch(() => {
        // The chunk did not arrive. The section keeps its natural, un-animated
        // appearance rather than being stuck in a from-state, which is the
        // right failure for decoration.
      })

    return () => {
      cancelled = true
      context?.revert()
    }
    // Mount-only, as the useGSAP calls this replaces were.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
