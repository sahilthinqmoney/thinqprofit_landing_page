/**
 * Plate renderer — turns docs/art-direction.md §3 into PNG masters.
 *
 * There is no image-generation API in this repository (art-direction.md's own
 * opening line), and there is no photographer either. What there is, is a brief
 * specified to the pixel: frame sizes, dead-zone rectangles, a luminance
 * ceiling, a chroma floor and a black point. That is enough to *render* rather
 * than to commission, and rendering has one property a generation model does
 * not — the constraints in §2.2, §2.3 and §2.7 can be satisfied by construction
 * in the shader instead of being checked afterwards and hoped for.
 *
 * Runs headless Chrome via Playwright because the scenes are WebGL2, and the
 * page already owns a WebGL surface (`LiquidMetalSurface`) so the material
 * vocabulary stays in one language.
 *
 *   node tools/plates/render.mjs            # every plate, every crop
 *   node tools/plates/render.mjs hero       # one plate
 *   node tools/plates/render.mjs hero:wide  # one crop
 *   node tools/plates/render.mjs --motion   # only the loop masters
 */

import { chromium } from 'playwright'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { plates, platesById, resolveCrop, CROPS } from './config.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, 'out')

/**
 * Supersample factor for stills. 2× is not vanity: the plates are almost
 * entirely soft falloff across a 51-level range (§2.7), and a 1× raymarch puts
 * visible stair-stepping on every chamfer — which then fails the "no luminance
 * step greater than 20 levels across 8 pixels" test as an aliasing artefact
 * rather than as a composition problem.
 */
const STILL_SS = 2
/** Loop frames are downscaled to 720p on encode, so 1.5× is already generous. */
const MOTION_SS = 1.5

async function buildSource(plate) {
  const core = await readFile(join(here, 'scene/core.glsl'), 'utf8')
  const scene = await readFile(join(here, 'scene/plates', plate.shader), 'utf8')
  /*
   * The plate file is appended, not prepended: core.glsl forward-declares
   * `mapScene` and `materialFor` and calls them from `march`/`shade`, so the
   * definitions have to arrive after those uses. GLSL ES 3.00 permits exactly
   * this and nothing looser.
   */
  return `${core}\n\n/* ---- plate: ${plate.shader} ---- */\n${scene}\n`
}

function uniformsFor(spec, t) {
  return {
    uT: t,
    uAspect: spec.aspect,
    uCamPos: spec.cam.pos,
    uCamTarget: spec.cam.target,
    uFov: spec.fov,
    uCamRoll: spec.roll,
    uKeyDir: spec.key,
    uKeySoft: spec.keySoft,
    uKeyGain: spec.keyGain,
    uKeyPos: spec.keyPos ?? [0, 0, 0],
    uKeyRange: spec.keyRange,
    uRimDir: spec.rim ?? [0, 0, 1],
    uRimSoft: spec.rimSoft,
    uRimGain: spec.rimGain,
    uDead: spec.dead,
    uDead2: spec.dead2,
    uDeadFeather: spec.deadFeather,
    uDeadFloor: spec.deadFloor,
    uDeadFloor2: spec.deadFloor2,
    uEvent: spec.event,
    uExposure: spec.exposure,
    uHaze: spec.haze,
    uGrain: spec.grain,
    uSeed: spec.seed ?? 17.0,
    uP: Array.from(spec.p),
  }
}

async function writeDataUrl(path, dataUrl) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, Buffer.from(dataUrl.split(',')[1], 'base64'))
}

async function main() {
  const args = process.argv.slice(2)
  const motionOnly = args.includes('--motion')
  const stillsOnly = args.includes('--stills')
  const selectors = args.filter((a) => !a.startsWith('--'))

  const browser = await chromium.launch({
    /*
     * `channel: 'chrome'` uses the installed Google Chrome rather than a
     * Playwright-managed build. Deliberate: the bundled build ships a headless
     * shell whose WebGL falls back to SwiftShader, which renders these scenes
     * correctly but roughly 40× slower — a 192-frame loop stops being something
     * you re-render while art-directing.
     */
    channel: 'chrome',
    args: ['--use-gl=angle', '--use-angle=metal', '--enable-unsafe-swiftshader'],
  })
  const page = await browser.newPage()
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('  [page]', msg.text())
  })
  await page.goto(`file://${join(here, 'scene/host.html')}`)

  const targets = selectors.length
    ? selectors.map((s) => {
        const [id, crop] = s.split(':')
        const plate = platesById[id]
        if (!plate) throw new Error(`unknown plate "${id}"`)
        return { plate, crops: crop ? [crop] : CROPS }
      })
    : plates.map((plate) => ({ plate, crops: CROPS }))

  for (const { plate, crops } of targets) {
    const source = await buildSource(plate)
    await page.evaluate((src) => window.__build(src), source)

    if (!motionOnly) {
      for (const crop of crops) {
        const spec = resolveCrop(plate, crop)
        const started = Date.now()
        const dataUrl = await page.evaluate(
          (payload) => window.__draw(payload),
          {
            width: spec.width,
            height: spec.height,
            scale: STILL_SS,
            values: uniformsFor(spec, 0),
          },
        )
        const path = join(OUT, plate.id, `${plate.id}-${crop}.png`)
        await writeDataUrl(path, dataUrl)
        console.log(
          `still  ${plate.id}-${crop}  ${spec.width}×${spec.height}  ${Date.now() - started}ms`,
        )
      }
    }

    if (plate.motion && !stillsOnly) {
      const spec = resolveCrop(plate, plate.motion.crop)
      const [w, h] = [1920, 1080]
      const total = plate.motion.seconds * plate.motion.fps
      const started = Date.now()
      for (let i = 0; i < total; i++) {
        const dataUrl = await page.evaluate((payload) => window.__draw(payload), {
          width: w,
          height: h,
          scale: MOTION_SS,
          values: uniformsFor({ ...spec, width: w, height: h, aspect: w / h }, i / total),
        })
        await writeDataUrl(
          join(OUT, plate.id, 'frames', `f${String(i).padStart(4, '0')}.png`),
          dataUrl,
        )
      }
      console.log(
        `motion ${plate.id}  ${total} frames @ ${w}×${h}  ${((Date.now() - started) / 1000).toFixed(1)}s`,
      )
    }
  }

  await browser.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
