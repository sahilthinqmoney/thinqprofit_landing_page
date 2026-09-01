import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'

/*
 * Analytics starts here rather than inside the tree: this is the browser entry,
 * so it runs exactly once per page load and never during the prerender, which
 * loads entry-server.tsx and never this file. The page view itself is reported
 * from App.tsx, where the route is known.
 */
initAnalytics()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/**
 * Hydrate the prerendered page; only build a new one if there is nothing there.
 *
 * `createRoot().render()` empties its container first, so with the prerendered
 * markup in place it tore down a page the reader was already looking at and
 * built a second one from initial state — the poster dropped back to its
 * blurred placeholder, the hero replayed its opening, and everything shifted by
 * whatever the two versions disagreed about. `hydrateRoot` adopts the existing
 * nodes instead, so React attaches to the page rather than replacing it.
 *
 * The fallback is not dead code: it is what runs if the prerender is ever
 * turned off, and it keeps `index.html` valid on its own.
 */
if (rootElement.firstElementChild) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
