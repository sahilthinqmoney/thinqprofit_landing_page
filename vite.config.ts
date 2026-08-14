import path from 'node:path'
import {
  createServer,
  defineConfig,
  type Plugin,
  type ViteDevServer,
} from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
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
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true,
    /*
     * authService, served from this origin.
     *
     * It runs at http://13.201.234.55:8080, and calling it straight from the
     * browser cannot work — three separate reasons, each fatal on its own:
     *
     *   1. Its CORS allowlist holds https://thinq.co and https://www.thinq.co
     *      and nothing else. Measured: a localhost origin gets no
     *      Access-Control-Allow-Origin header back at all.
     *   2. The CSRF scheme cannot survive a cross-origin split. `tq_csrf` is
     *      set by 13.201.234.55, and `document.cookie` only ever reads cookies
     *      for the page's OWN origin — so the token the client has to echo in
     *      X-Tq-Csrf would be permanently invisible to it. Measured:
     *      `Set-Cookie: tq_csrf=…; Path=/; SameSite=Strict`, host-only, and a
     *      SameSite=Strict cookie is not sent on cross-site requests anyway.
     *   3. The deployed site is HTTPS and that origin is plain HTTP, so a
     *      browser blocks the request outright as mixed content.
     *
     * Proxying answers all three at once: the browser only ever talks to its
     * own origin, so there is no preflight to fail, no mixed content, and
     * Set-Cookie lands where script can read it.
     *
     * Production wants the same shape — a Cloudflare route sending /api/* to
     * authService — which is why the client's base URL is a relative path.
     */
    proxy: {
      '/api': {
        target: process.env.AUTH_ORIGIN ?? 'http://13.201.234.55:8080',
        changeOrigin: true,
        // The upstream sets a host-only cookie; rewriting the domain lets the
        // browser keep it against the dev origin rather than discarding it.
        cookieDomainRewrite: '',
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    /*
     * A second bundle for televisions.
     *
     * Lowering `build.target` was not enough on its own. The modern output is an
     * ES module — it uses `import.meta`, which cannot be downlevelled in that
     * format, and it is loaded with `<script type="module">`, which needs
     * Chromium 61 at minimum. A television running Tizen 4 (Chromium 56) or
     * webOS 4 (53) therefore never executed a line of it, React never mounted,
     * and since the `<video>` is created by React rather than sitting in the
     * prerendered HTML, the set showed the page and never the clip.
     *
     * This emits a `nomodule` SystemJS build alongside, with the polyfills those
     * engines are missing. Modern browsers ignore it entirely — they take the
     * module build and never request these files — so the cost falls only on the
     * devices that would otherwise get nothing.
     */
    legacy({
      targets: ['chrome >= 53', 'safari >= 10.1', 'firefox >= 55', 'edge >= 15'],
      // Not every gap is syntax. These engines are missing runtime APIs that
      // React and hls.js both reach for.
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      /*
       * Off deliberately. It adds ~18 KB gzip of polyfills to the MODERN
       * bundle — paid by every reader on a current browser, to fix engines that
       * support modules but lag on APIs. The televisions this is for do not
       * support modules at all, so they take the legacy build and its own
       * polyfills; taxing everyone else buys nothing here.
       */
      modernPolyfills: false,
    }),
    prerender(),
    inlineStyles(),
  ],
  define: DEFINE,
  build: {
    /*
     * No `target` here on purpose. `@vitejs/plugin-legacy` owns it — it sets the
     * modern target itself and warns if this is also specified, and having two
     * places decide it is how they end up disagreeing. The modern build targets
     * module-capable browsers; everything older is served the legacy bundle.
     */
  },
  resolve: {
    // Mirror of the `paths` entry in tsconfig.app.json. TypeScript's copy only
    // type-checks; this one is what actually resolves the import at build time.
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
