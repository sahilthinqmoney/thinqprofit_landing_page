/**
 * §5.1 — the dead-zone contrast test, on the real page.
 *
 * "This is the one that actually matters, and it is the one that gets skipped.
 * Do not judge it in an image viewer."
 *
 * Builds, serves, and screenshots each media section at the four widths §5.1
 * names — 390, 768, 1024 and 1920 — where 768 is the edge case at which the
 * tablet crop is served while the copy is already parked to its side.
 *
 * The screenshots are for a human to read the actual headline, body and
 * disclosure over the actual plate. `qa.mjs` measures the plate in isolation;
 * this is the only step that sees type and asset composited, at the sizes they
 * ship at, which is where a legibility failure actually shows up.
 *
 *   npm run build && node tools/plates/page-shot.mjs
 *   node tools/plates/page-shot.mjs --scrim0    # §5.1 step 3
 *
 * `--scrim0` neutralises every scrim before shooting. §5.1 requires it: "The
 * scrim is headroom, not the fix; a plate that only passes with scrim={0.88}
 * will fail the moment someone tunes it down, and it will already be failing at
 * the frame edges where the radial has fallen to zero."
 */

import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, 'out/page')
const PORT = 4319

/** §5.1 step 2. Each is inside a different crop's range, and 768 is the seam. */
const WIDTHS = [390, 768, 1024, 1920]

/** The sections that carry a plate, with the headline §5.1 says to read. */
/*
 * `onboarding` is deliberately absent. Its section was cut from `App.tsx` in the
 * seven-section pass, so shooting `#onboarding` returns nothing and the harness
 * silently reports one fewer plate than it appears to cover. The plate itself is
 * still briefed and still in the renderer's registry, which is why `qa.mjs`
 * reports four rejects for it on a clean tree — a real inconsistency, left
 * standing rather than papered over here.
 */
const SECTIONS = [
  ['hero', 'Your money. / Your market. / One app.'],
  ['products', 'Stocks & ETFs · Futures & Options'],
  ['platform', 'Built for the / ten seconds / that matter'],
  ['terminal', 'The terminal acts, / and labels it'],
  ['final-cta', 'Start with what / you have today'],
]

function serve() {
  const child = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: join(here, '../..'),
    stdio: 'ignore',
  })
  return child
}

async function waitForServer(page) {
  for (let i = 0; i < 60; i++) {
    try {
      await page.goto(`http://localhost:${PORT}/`, { timeout: 1000 })
      return
    } catch {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  throw new Error('preview server did not come up')
}

async function main() {
  const scrimOff = process.argv.includes('--scrim0')
  await mkdir(OUT, { recursive: true })

  const server = serve()
  const browser = await chromium.launch({ channel: 'chrome' })

  try {
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      await waitForServer(page)

      if (scrimOff) {
        /*
         * The scrims are inline `background-image` radials on aria-hidden
         * divs, so they cannot be turned off by a class. Blanking the property
         * on every element that has one is the only way to reproduce §5.1's
         * `scrim={0}` without editing five components for a test.
         */
        await page.addStyleTag({
          content: '[aria-hidden="true"][style*="radial-gradient"] { background-image: none !important; }',
        })
      }

      /* Let the reveal observers fire and the loop reach its resting frame. */
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1200)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(600)

      for (const [id, headline] of SECTIONS) {
        const el = page.locator(`#${id}`)
        if (!(await el.count())) continue
        await el.scrollIntoViewIfNeeded()
        await page.waitForTimeout(500)
        const suffix = scrimOff ? '-scrim0' : ''
        await el.screenshot({ path: join(OUT, `${id}-${width}${suffix}.png`) })
        console.log(`shot   ${id}-${width}${suffix}   read: ${headline}`)
      }

      await page.close()
    }
  } finally {
    await browser.close()
    server.kill()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
