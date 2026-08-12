// Generates public/og-image.png — the card shown when the URL is shared.
//
// ── Why this is generated and not drawn ────────────────────────────────────
//
// The card it replaces was the old ThinqProfit artwork: a purple plate on
// #863BFF / #7E14FF / #47BFFF, hues in no token this site owns, under a brand
// name the page no longer uses. It read "Your money. Your market. One app." and
// "Stocks, ETFs, F&O, commodities and direct mutual funds" — advertising a
// product that is not open — and asserted "SEBI-REGISTERED BROKER · NSE · BSE ·
// MCX · CDSL", which claims **MCX**, a registration the page itself does not
// claim anywhere. A share card is quoted far more widely than the page and is
// cached by every messenger that sees it, so it is the worst place to overstate.
//
// Every word here is therefore read from src/data/hero.ts, the same source the
// page renders from. There is no second copy to drift, and the card cannot
// claim something the page does not.
//
// ── Why there is no photograph on it ──────────────────────────────────────
//
// The obvious background is the hero's own poster, and it cannot be used.
// art-direction.md §2.1 bans "any number, ticker, price, percentage, currency
// symbol or P&L — including partial, out of focus, or on a reflected surface",
// and says in as many words not to approve an asset that violates it because
// the rest of the frame is good. That poster carries RELIANCE, BANK NIFTY,
// GEX 0.80, -0.398 and -1.57%. Putting it on the share card would repeat the
// exact charge against the card it replaces, on the surface quoted most widely.
// (The poster is on the live hero today; that is a separate question and is
// flagged, not silently fixed here.)
//
// §2.1 also bans hue outright — "the brand has no hue left in it" — so the
// light below is luminance only. What remains is what the brand actually is:
// near-black, one soft key, and the type.
//
// Requires Playwright (not a project dependency — this runs by hand, rarely):
//   npx playwright install chromium
//   node scripts/gen-og.mjs
import { chromium } from 'playwright'
import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')

/** Facebook, WhatsApp, X and LinkedIn all key on 1200x630. */
const W = 1200
const H = 630

/** Pull the copy out of the data module without needing a TS toolchain. */
async function heroCopy() {
  const src = await readFile(path.join(ROOT, 'src/data/hero.ts'), 'utf8')
  const grab = (key) => {
    const m = src.match(new RegExp(`${key}:\\s*(['"\`])([\\s\\S]*?)\\1\\s*,`))
    if (!m) throw new Error(`could not read hero.${key} from src/data/hero.ts`)
    return m[2].replace(/\\'/g, "'").replace(/\\"/g, '"')
  }
  return {
    headline: grab('headline'),
    offerBold: grab('offerBold'),
    offerNote: grab('offerNote'),
    trust: grab('trust'),
  }
}

const copy = await heroCopy()
const mark = (await readFile(path.join(ROOT, 'scripts/assets/thinq-mark.svg'), 'utf8'))
  .replace(/width="\d+"\s+height="\d+"/, 'width="52" height="52"')

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:#050505;overflow:hidden;
       font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .card{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#050505}
  /* One soft key from upper right, neutral: luminance carries the depth,
     because §2.1 leaves the brand no hue to spend on decoration. */
  .key{position:absolute;right:-14%;top:-38%;width:78%;height:150%;
     background:radial-gradient(ellipse at 60% 50%,rgba(255,255,255,.115) 0%,
                rgba(255,255,255,.05) 38%,transparent 72%);filter:blur(34px)}
  .floor{position:absolute;inset:0;background:
     radial-gradient(ellipse 120% 90% at 18% 108%,rgba(255,255,255,.05) 0%,transparent 62%)}
  .vignette{position:absolute;inset:0;background:
     radial-gradient(ellipse 92% 92% at 42% 46%,transparent 34%,rgba(0,0,0,.55) 100%)}
  .rule{position:absolute;left:80px;right:80px;bottom:104px;height:1px;
     background:linear-gradient(90deg,rgba(255,255,255,.16),rgba(255,255,255,.02))}
  .inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;
     padding:72px 80px}
  .brand{display:flex;align-items:center;gap:16px;margin-bottom:34px}
  .brand span{font-size:34px;font-weight:600;letter-spacing:-.02em;color:#fff}
  h1{font-size:76px;line-height:1.06;font-weight:600;letter-spacing:-.035em;
     background:linear-gradient(180deg,#fff 0%,rgba(255,255,255,.95) 50%,rgba(255,255,255,.78) 100%);
     -webkit-background-clip:text;background-clip:text;color:transparent;max-width:15em}
  .offer{margin-top:28px;font-size:27px;line-height:1.45;color:rgba(255,255,255,.82);max-width:26em}
  .offer b{color:#fff;font-weight:600}
  .trust{position:absolute;left:80px;bottom:56px;font-size:17px;letter-spacing:.01em;
     color:rgba(255,255,255,.58)}
</style></head>
<body><div class="card">
  <div class="key"></div><div class="floor"></div><div class="vignette"></div>
  <div class="rule"></div>
  <div class="inner">
    <div class="brand">${mark}<span>Thinq</span></div>
    <h1>${copy.headline}</h1>
    <p class="offer"><b>${copy.offerBold}</b> ${copy.offerNote}</p>
  </div>
  <div class="trust">${copy.trust}</div>
</div></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(400)
const shot = await page.screenshot({ type: 'png' })
await browser.close()

/*
 * Rendered at 2x and resampled down to 1200x630 rather than shot at 1x. The
 * type stays crisp, the file lands at a fraction of the size, and the pixels
 * match the og:image:width/height the document declares — which they did not
 * when this wrote the 2x buffer straight out.
 *
 * Size is not cosmetic here: WhatsApp drops to a small thumbnail instead of the
 * rich card once the image is around 300 KB, and the 2x buffer was 276 KB.
 */
const card = await sharp(shot)
  .resize(W, H, { fit: 'fill', kernel: 'lanczos3' })
  .png({ compressionLevel: 9, palette: false })
  .toBuffer()

await writeFile(path.join(PUBLIC, 'og-image.png'), card)
console.log(`og: wrote public/og-image.png  ${W}x${H}  ${(card.length / 1024).toFixed(0)} KB`)
console.log(`og: headline "${copy.headline}"`)
console.log(`og: trust    "${copy.trust}"`)
