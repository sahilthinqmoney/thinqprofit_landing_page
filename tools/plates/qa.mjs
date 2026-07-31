/**
 * Asset QA — docs/art-direction.md §5.3 and §5.4, mechanised.
 *
 * "Run all five. Any single failure is a reject, not a note." Three of the five
 * are numeric and are implemented here in full. The other two are not, and this
 * file says so rather than pretending:
 *
 *   §5.1 dead-zone contrast **with the real headline over it** — the numeric
 *        half (the §2.7 thresholds against the dead-zone rectangle) runs here.
 *        Reading the actual headline at 390/768/1024/1920 with `scrim={0}` is a
 *        human step and stays one.
 *   §5.2 banned-content scan — a checklist against a rendered frame. These
 *        plates are built from named primitives rather than sampled from a
 *        corpus, so the categories §2.1 exists to catch (stock traders, coins,
 *        candlesticks, skylines, wireframe HUDs) are not reachable; the ones
 *        that *are* reachable are compositional (an ascending dominant line, a
 *        highlight bright enough to read as a button), and §5.5's system read
 *        catches those by eye.
 *
 * Runs the measurements in Chromium rather than in Node with an image library,
 * for one reason that matters: it decodes the **shipped WebP**, through the
 * same decoder the browser will use, after quantisation and chroma subsampling.
 * Measuring the PNG master would pass a set of files nobody ships.
 *
 *   node tools/plates/qa.mjs
 *   node tools/plates/qa.mjs hero
 */

import { chromium } from 'playwright'
import { access, readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { plates, platesById, resolveCrop, CROPS } from './config.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const MEDIA = join(here, '../../public/media')

/*
 * Thresholds. Every one is a quotation from §2.2/§2.3/§2.7 — the comment gives
 * the clause, because a bare number in a linter is unarguable-with in exactly
 * the wrong way.
 */
const GATE = {
  /** §2.3 rule 1: no pixel above OKLCH L .750 (`chrome`). */
  maxOklabL: 0.75,
  /** §2.3 rule 1: ≤3% of frame above OKLCH L .600 (`#808080`). */
  brightBand: 0.6,
  brightBandShare: 0.03,
  /** §5.4: any clipped channel is a reject. */
  clipped: 255,
  /** §5.4: the black point must reach #050505; above `surface` is a reject. */
  blackPointMax: 13,
  /** §2.2: >1% of pixels at chroma ≥ .02, or any pixel ≥ .04, is a reject. */
  chromaSoft: 0.02,
  chromaSoftShare: 0.01,
  chromaHard: 0.04,
  /** §2.2: the meaning-bearing hues get a tighter threshold. */
  chromaMeaning: 0.025,
  /** §2.7: dead-zone ceiling #38383c, and the 3% tail at `border` #2b2b31. */
  deadCeil: 56,
  deadTail: 43,
  deadTailShare: 0.03,
  /** §2.7: no luminance step greater than 20 sRGB levels across any 8px span. */
  deadEdgeStep: 20,
  /** §4.1: ≤180 KB per crop, ≤120 KB for `mobile`. */
  bytes: { mobile: 120 * 1024, tablet: 180 * 1024, desktop: 180 * 1024, wide: 180 * 1024 },
}

/**
 * Runs inside the page. Everything here is per-pixel maths on a decoded WebP;
 * it is a string only because it has to cross into the browser context.
 */
const MEASURE = ({ url, dead, dead2, gate }) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => reject(new Error(`decode failed: ${url}`))
    img.onload = () => {
      const w = img.naturalWidth
      const h = img.naturalHeight
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0)
      const { data } = ctx.getImageData(0, 0, w, h)

      const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

      /* sRGB → Oklab. Björn Ottosson's matrices, used unchanged. */
      const oklab = (r, g, b) => {
        const rl = srgbToLinear(r / 255)
        const gl = srgbToLinear(g / 255)
        const bl = srgbToLinear(b / 255)
        const l = Math.cbrt(0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl)
        const m = Math.cbrt(0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl)
        const s = Math.cbrt(0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl)
        return {
          L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
          a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
          b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
        }
      }

      const inRect = (x, y, r) => {
        if (!r || r[2] <= r[0] || r[3] <= r[1]) return false
        const u = x / w
        /* config states rects with a bottom-left origin; ImageData is top-down. */
        const v = 1 - y / h
        return u >= r[0] && u <= r[2] && v >= r[1] && v <= r[3]
      }

      let maxL = 0
      let bright = 0
      let clipped = 0
      let darkest = 255
      let chromaSoft = 0
      let chromaHard = 0
      let chromaMeaning = 0
      let maxChroma = 0
      let deadCount = 0
      let deadMax = 0
      let deadTail = 0
      /* Shadow/highlight hue split (§5.4 "no split-toning"). */
      let shadowA = 0
      let shadowB = 0
      let shadowN = 0
      let highA = 0
      let highB = 0
      let highN = 0

      /* Grey plane for the dead-zone edge test, kept as a typed array so the
         8px-span scan below is a straight index walk rather than a re-read. */
      const grey = new Uint8Array(w * h)

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const maxCh = Math.max(r, g, b)
          grey[y * w + x] = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)

          if (maxCh >= gate.clipped) clipped++
          if (maxCh < darkest) darkest = maxCh

          const { L, a, b: bb } = oklab(r, g, b)
          const c = Math.hypot(a, bb)
          if (L > maxL) maxL = L
          if (L > gate.brightBand) bright++
          if (c > maxChroma) maxChroma = c
          if (c >= gate.chromaSoft) chromaSoft++
          if (c >= gate.chromaHard) chromaHard++
          if (c >= gate.chromaMeaning) {
            let hue = (Math.atan2(bb, a) * 180) / Math.PI
            if (hue < 0) hue += 360
            const green = hue >= 120 && hue <= 190
            const red = hue >= 345 || hue <= 60
            if (green || red) chromaMeaning++
          }

          if (L < 0.3) {
            shadowA += a
            shadowB += bb
            shadowN++
          } else if (L > 0.55) {
            highA += a
            highB += bb
            highN++
          }

          if (inRect(x, y, dead) || inRect(x, y, dead2)) {
            deadCount++
            if (maxCh > deadMax) deadMax = maxCh
            if (maxCh > gate.deadTail) deadTail++
          }
        }
      }

      /*
       * §2.7's edge rule: "No luminance step greater than 20 sRGB levels across
       * any 8-pixel span inside the dead zone." Scanned on both axes — a
       * chamfer running through a headline is as illegible horizontally as
       * vertically, and only checking rows would miss the horizon case.
       */
      let deadEdge = 0
      const span = 8
      for (let y = 0; y < h; y++) {
        for (let x = 0; x + span < w; x++) {
          if (!inRect(x, y, dead) && !inRect(x, y, dead2)) continue
          if (!inRect(x + span, y, dead) && !inRect(x + span, y, dead2)) continue
          const step = Math.abs(grey[y * w + x + span] - grey[y * w + x])
          if (step > deadEdge) deadEdge = step
        }
      }
      for (let x = 0; x < w; x++) {
        for (let y = 0; y + span < h; y++) {
          if (!inRect(x, y, dead) && !inRect(x, y, dead2)) continue
          if (!inRect(x, y + span, dead) && !inRect(x, y + span, dead2)) continue
          const step = Math.abs(grey[(y + span) * w + x] - grey[y * w + x])
          if (step > deadEdge) deadEdge = step
        }
      }

      /* 32×32 thumbnail, for §5.3's "are these four scales of one photograph". */
      const thumb = document.createElement('canvas')
      thumb.width = 32
      thumb.height = 32
      const tctx = thumb.getContext('2d', { willReadFrequently: true })
      tctx.drawImage(img, 0, 0, 32, 32)
      const tdata = tctx.getImageData(0, 0, 32, 32).data
      const signature = []
      for (let i = 0; i < tdata.length; i += 4) signature.push(tdata[i])

      const hueOf = (a, b) => {
        let hue = (Math.atan2(b, a) * 180) / Math.PI
        if (hue < 0) hue += 360
        return hue
      }

      /*
       * Hue is undefined at zero chroma, and this renderer's output is exactly
       * that: core.glsl resolves shading to one scalar and writes it to all
       * three channels, so every pixel in a shipped plate has R = G = B and the
       * OKLab `a`/`b` of both the shadow and highlight means are floating-point
       * dust — order 1e-8, pointing wherever the last rounding error left them.
       *
       * `atan2` on dust returns a confident angle, so §5.4's split-tone test was
       * rejecting five perfectly monochrome plates for a "124° hue difference"
       * between two colours that do not exist. Verified against the shipped
       * WebP: `device-desktop.webp` has a maximum channel spread of 0 across all
       * 1,710,000 pixels.
       *
       * The gate itself is right — split-toning a monochrome system is exactly
       * the tell §5.4 is looking for — so it stays, guarded. If either mean sits
       * below the threshold there is no tone to split, and the honest answer is
       * 0° rather than a number derived from noise. The threshold is an order of
       * magnitude under §2.2's own `chromaSoft` (.02), so any plate carrying
       * real colour still reaches the comparison.
       */
      const HUE_FLOOR = 0.002
      const chromaOf = (a, b) => Math.hypot(a, b)
      const shadowChroma = shadowN ? chromaOf(shadowA / shadowN, shadowB / shadowN) : 0
      const highChroma = highN ? chromaOf(highA / highN, highB / highN) : 0
      const tonesAreColoured = shadowChroma >= HUE_FLOOR && highChroma >= HUE_FLOOR

      resolve({
        width: w,
        height: h,
        pixels: w * h,
        maxL,
        brightShare: bright / (w * h),
        clipped,
        darkest,
        maxChroma,
        chromaSoftShare: chromaSoft / (w * h),
        chromaHard,
        chromaMeaning,
        splitTone:
          shadowN && highN && tonesAreColoured
            ? Math.abs(
                ((hueOf(highA / highN, highB / highN) -
                  hueOf(shadowA / shadowN, shadowB / shadowN) +
                  540) %
                  360) -
                  180,
              )
            : 0,
        deadMax,
        deadTailShare: deadCount ? deadTail / deadCount : 0,
        deadEdge,
        signature,
      })
    }
    img.src = url
  })

/** Pearson correlation of two 32×32 luminance signatures (§5.3). */
function correlate(a, b) {
  const n = a.length
  const mean = (xs) => xs.reduce((s, x) => s + x, 0) / n
  const ma = mean(a)
  const mb = mean(b)
  let num = 0
  let da = 0
  let db = 0
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb)
    da += (a[i] - ma) ** 2
    db += (b[i] - mb) ** 2
  }
  /*
   * A signature with no variance carries no composition to match against, so
   * there is nothing for the "four exports of one photograph" test to find.
   * Returning 1 here (perfectly correlated) fails §A1's mobile crop, which is
   * *briefed* to be a near-flat ink field — "deliberately the quietest of the
   * four". 0 is the honest answer: no shared structure.
   */
  if (da < 1e-6 || db < 1e-6) return 0
  return num / Math.sqrt(da * db)
}

function report(label, checks) {
  const failed = checks.filter((c) => !c.pass)
  const mark = failed.length ? '✗' : '✓'
  console.log(`${mark} ${label}`)
  for (const c of checks) {
    if (!c.pass) console.log(`    REJECT  ${c.name}  ${c.detail}`)
  }
  return failed.length
}

async function main() {
  const selectors = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const targets = selectors.length ? selectors.map((id) => platesById[id]) : plates

  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage()
  await page.goto('about:blank')

  let rejects = 0

  for (const plate of targets) {
    const signatures = {}
    for (const crop of CROPS) {
      const spec = resolveCrop(plate, crop)
      const file = join(MEDIA, plate.id, `${plate.id}-${crop}.webp`)
      try {
        await access(file)
      } catch {
        console.log(`✗ ${plate.id}-${crop}\n    REJECT  missing  ${file}`)
        rejects++
        continue
      }

      const { size } = await stat(file)
      /*
       * Handed in as a data URL rather than a `file://` src: an `about:blank`
       * page is an opaque origin, and Chrome refuses to read back pixels it
       * loaded from the filesystem into it — `getImageData` on a tainted canvas
       * throws, and every measurement below depends on that call.
       */
      const m = await page.evaluate(MEASURE, {
        url: `data:image/webp;base64,${(await readFile(file)).toString('base64')}`,
        dead: spec.dead,
        dead2: spec.dead2,
        gate: GATE,
      })
      signatures[crop] = m.signature

      rejects += report(`${plate.id}-${crop}  ${m.width}×${m.height}  ${(size / 1024) | 0} KB`, [
        {
          name: '§2.3 luminance ceiling',
          pass: m.maxL <= GATE.maxOklabL,
          detail: `max OKLCH L ${m.maxL.toFixed(3)} > ${GATE.maxOklabL}`,
        },
        {
          name: '§2.3 bright-band share',
          pass: m.brightShare <= GATE.brightBandShare,
          detail: `${(m.brightShare * 100).toFixed(2)}% above L .600 > 3%`,
        },
        {
          name: '§5.4 clipped pixels',
          pass: m.clipped === 0,
          detail: `${m.clipped} clipped`,
        },
        {
          name: '§5.4 black point',
          pass: m.darkest <= GATE.blackPointMax,
          detail: `darkest pixel ${m.darkest} > ${GATE.blackPointMax}`,
        },
        {
          name: '§2.2 chroma (hard)',
          pass: m.chromaHard === 0,
          detail: `${m.chromaHard} px at chroma ≥ ${GATE.chromaHard} (max ${m.maxChroma.toFixed(4)})`,
        },
        {
          name: '§2.2 chroma (meaning-bearing hue)',
          pass: m.chromaMeaning === 0,
          detail: `${m.chromaMeaning} px in the green or red band`,
        },
        {
          name: '§2.2 chroma (soft share)',
          pass: m.chromaSoftShare <= GATE.chromaSoftShare,
          detail: `${(m.chromaSoftShare * 100).toFixed(2)}% at chroma ≥ .02 > 1%`,
        },
        {
          name: '§5.4 split-tone',
          pass: m.splitTone <= 20,
          detail: `shadow/highlight hue differ by ${m.splitTone.toFixed(1)}°`,
        },
        {
          name: '§2.7 dead-zone ceiling',
          pass: m.deadMax <= GATE.deadCeil,
          detail: `max ${m.deadMax} > ${GATE.deadCeil}`,
        },
        {
          name: '§2.7 dead-zone tail',
          pass: m.deadTailShare <= GATE.deadTailShare,
          detail: `${(m.deadTailShare * 100).toFixed(2)}% above ${GATE.deadTail} > 3%`,
        },
        {
          name: '§2.7 dead-zone edges',
          pass: m.deadEdge <= GATE.deadEdgeStep,
          detail: `${m.deadEdge}-level step across 8px > ${GATE.deadEdgeStep}`,
        },
        {
          name: '§4.1 file budget',
          pass: size <= GATE.bytes[crop],
          detail: `${(size / 1024) | 0} KB > ${GATE.bytes[crop] / 1024} KB`,
        },
      ])
    }

    /*
     * §5.3: "Take the desktop file, crop it to the mobile aspect ratio, and
     * compare. If the compositions match, they are scales — reject the set."
     * A 32×32 luminance signature is a blunt instrument and that is the point:
     * it is looking for four exports of one photograph, which correlate near 1,
     * not for family resemblance, which is wanted.
     */
    const pairs = [
      ['mobile', 'desktop'],
      ['tablet', 'desktop'],
      ['wide', 'desktop'],
    ]
    for (const [a, b] of pairs) {
      if (!signatures[a] || !signatures[b]) continue
      const r = correlate(signatures[a], signatures[b])
      rejects += report(`${plate.id}  ${a} vs ${b}`, [
        {
          name: '§5.3 art-directed crop',
          pass: r < 0.9,
          detail: `signatures correlate at ${r.toFixed(3)} — this is a scale, not a crop`,
        },
      ])
    }
  }

  await browser.close()
  console.log(rejects ? `\n${rejects} reject(s)` : '\nall gates pass')
  process.exit(rejects ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
