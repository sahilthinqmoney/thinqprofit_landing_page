import path from 'node:path'
import {
  createServer,
  defineConfig,
  type Plugin,
  type ViteDevServer,
} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ROOT = import.meta.dirname
const ROOT_DIV = '<div id="root"></div>'

/**
 * Compile-time constants, shared by the browser bundle and the prerender.
 *
 * Both have to be given this: the prerender runs its own Vite instance with
 * `configFile: false`, so it inherits nothing from the config below. Anything
 * defined for one and not the other renders differently in the HTML than in the
 * browser, which is a hydration mismatch — and in React 19 a mismatch anywhere
 * discards the whole prerendered tree.
 */
const DEFINE = {
  __BUILD_YEAR__: new Date().getFullYear(),
}

/**
 * Renders the real app into `index.html`.
 *
 * This page is client-rendered, so `<div id="root">` used to be empty until the
 * JavaScript arrived and ran. On a slow connection that is a blank white screen
 * for the better part of ten seconds — measured at 7.9s to first contentful
 * paint on a 400kbps link — and no amount of media-loading care helps, because
 * there is no document to put the media in yet.
 *
 * ── Why this is a render and not a template ────────────────────────────────
 *
 * The first version of this plugin wrote the hero out by hand as an HTML
 * string. It looked like the hero and was not the hero, and measured against
 * the component in WebKit the moment React mounted:
 *
 *   gutter        32px  ->  48px   (it had Container's padding scale wrong)
 *   headline top   313  ->   333   (it was missing the line-box wrappers)
 *   headline       flat white  ->  gradient-clipped
 *   poster        opacity 1  ->  unmounted, back to the blurred placeholder
 *   headline      settled  ->  faded out and replayed its intro
 *
 * — and Chromium, from the same code, dropped the last of those and kept the
 * rest, because it batched the state flip into one frame where WebKit painted
 * it. One hand-written copy, two engines, two different broken pages, and a
 * third for anyone whose JavaScript landed at a different moment. That is why
 * "it renders differently for different people" was the symptom.
 *
 * So the shell is gone and this renders `src/entry-server.tsx`, which calls the
 * same components the browser calls. There is nothing left to keep in step:
 * if `Hero.tsx` changes, this output changes with it. `main.tsx` then hydrates
 * rather than re-creating the root, so React adopts these nodes instead of
 * discarding them — no jump, no re-fetch, no replayed animation.
 *
 * It runs in dev as well as in build, deliberately. A prerender that only
 * happens in production is a class of bug you cannot see until you ship it.
 */
function prerender(): Plugin {
  let devServer: ViteDevServer | undefined

  return {
    name: 'thinq-prerender',

    configureServer(server) {
      devServer = server
    },

    async transformIndexHtml(html) {
      if (!html.includes(ROOT_DIV)) return html
      const markup = await renderApp(devServer)
      return html.replace(ROOT_DIV, `<div id="root">${markup}</div>`)
    },
  }
}

/**
 * Loads the server entry and renders it.
 *
 * In dev the running server is reused, so the prerender follows the same module
 * graph the browser gets. In a build there is no dev server, so a throwaway one
 * is created purely to transform TSX for Node — `configFile: false` keeps it
 * from loading this file again and recursing into itself.
 */
async function renderApp(devServer?: ViteDevServer): Promise<string> {
  const server =
    devServer ??
    (await createServer({
      configFile: false,
      root: ROOT,
      logLevel: 'error',
      appType: 'custom',
      server: { middlewareMode: true },
      plugins: [react()],
      define: DEFINE,
      resolve: { alias: { '@': path.resolve(ROOT, './src') } },
    }))

  try {
    const entry = (await server.ssrLoadModule('/src/entry-server.tsx')) as {
      render: () => string
    }
    return entry.render()
  } finally {
    if (!devServer) await server.close()
  }
}

/**
 * Inlines the stylesheet into the document.
 *
 * The prerender above puts the page in the HTML, but a linked stylesheet still
 * blocks the first paint — so the browser had the words at 2s and refused to
 * draw them until the CSS came back on a second round trip at 4.8s. On a link
 * with 2s of latency the round trip costs far more than the bytes do: the whole
 * stylesheet is ~11 KB compressed, which is under a third of a second here.
 *
 * This is worth it because the site is one page. There is no second document to
 * amortise a cached stylesheet across, so the only thing separate delivery buys
 * is a round trip nobody wants to pay.
 */
function inlineStyles(): Plugin {
  return {
    name: 'thinq-inline-styles',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html
      return html.replace(
        /<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/g,
        (tag, fileName: string) => {
          const asset = ctx.bundle?.[fileName]
          if (!asset || asset.type !== 'asset') return tag
          return `<style>${String(asset.source)}</style>`
        },
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), prerender(), inlineStyles()],
  define: DEFINE,
  resolve: {
    // Mirror of the `paths` entry in tsconfig.app.json. TypeScript's copy only
    // type-checks; this one is what actually resolves the import at build time.
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
