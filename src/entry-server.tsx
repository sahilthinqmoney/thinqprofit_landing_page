import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * Renders the page to HTML at build time.
 *
 * This exists so `index.html` ships the real page rather than an empty
 * `<div id="root">`. The whole app is rendered, not a hand-written excerpt of
 * it: the previous version of this feature was a copy of the hero written out
 * by hand in vite.config.ts, and it drifted from `Hero.tsx` in every way a copy
 * can — a different gutter, a different line box, a flat white headline where
 * the real one is gradient-clipped, and no form at all. The reader watched the
 * page jump when React replaced it.
 *
 * A copy cannot be kept in step by discipline. So there is no copy: this calls
 * the same components the browser does, and `main.tsx` HYDRATES the result
 * rather than throwing it away, which is what stops the swap being visible.
 *
 * The tree must therefore render without a DOM. Everything that reads
 * `window`, `navigator` or `document` already does so inside an effect or an
 * event handler, which never run here; `mediaTier.ts` additionally answers with
 * a fixed no-window tier so the server and the first client render agree.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
