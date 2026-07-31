/**
 * Encode — docs/art-direction.md §4.1 (stills) and §4.2 (motion), verbatim.
 *
 * Takes the PNG masters `render.mjs` writes to `tools/plates/out/` and produces
 * the files the page actually fetches, under `public/media/<plate>/`.
 *
 * Two decisions inherited from §4.1 rather than chosen here:
 *
 *  - **WebP only, no AVIF siblings.** `MediaBackdrop`'s `<source>` elements
 *    carry `srcSet` with no `type`, so a browser that cannot decode the file
 *    does not fall through — it fails. One format per breakpoint.
 *  - **`-sharp_yuv`.** These plates are large soft falloffs with one hard
 *    chamfer in them, and default chroma subsampling puts colour speckle on
 *    that edge. On a set graded to be visually monochrome, subsampling
 *    artefacts are the single most likely way to fail §2.2's chroma gate, and
 *    they are the reason its 1% slack exists at all.
 *
 * No ICC profile is embedded: the masters come out of a canvas with no profile
 * attached, and a WebP with no profile is interpreted as sRGB, which is what
 * §4.1 asks for. Attaching a profile the pixels were never converted through
 * would be worse than attaching none.
 *
 *   node tools/plates/encode.mjs
 *   node tools/plates/encode.mjs hero
 */

import { execFile } from 'node:child_process'
import { mkdir, readdir, rm, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { plates, platesById, CROPS } from './config.mjs'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, 'out')
const MEDIA = join(here, '../../public/media')

/** §4.1: "quality 80". `-m 6` is the slowest, smallest search. */
const WEBP_Q = 80

async function encodeStill(plate, crop) {
  const src = join(OUT, plate.id, `${plate.id}-${crop}.png`)
  const dst = join(MEDIA, plate.id, `${plate.id}-${crop}.webp`)
  await mkdir(dirname(dst), { recursive: true })
  await run('cwebp', [
    '-q',
    String(WEBP_Q),
    '-m',
    '6',
    '-sharp_yuv',
    '-metadata',
    'none',
    '-quiet',
    src,
    '-o',
    dst,
  ])
  const { size } = await stat(dst)
  console.log(`webp   ${plate.id}-${crop}  ${(size / 1024) | 0} KB`)
}

/**
 * §4.2's encode ladder, unchanged: VP9 primary, H.264 fallback, first-frame
 * WebP poster, no audio track at all, 1280×720 out of a 1920×1080 master.
 *
 * `video.mobile` is deliberately never produced — §4.2's wiring note: mobile
 * serves the poster and skips the video, and `MediaBackdrop`'s mobile `<source>`
 * is hardcoded `type="video/mp4"`, so shipping one commits us to an encode for
 * the breakpoint the brief says gets nothing.
 */
async function encodeMotion(plate) {
  const frames = join(OUT, plate.id, 'frames', 'f%04d.png')
  const dir = join(MEDIA, plate.id)
  await mkdir(dir, { recursive: true })

  const base = ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(plate.motion.fps)]
  /*
   * `format=yuv420p` is not optional on either encoder. The masters come out of
   * a canvas as RGBA, which ffmpeg reads as `gbrap`; VP9 refuses it outright and
   * H.264 would encode a 4:4:4 stream that Safari will not play. It also drops
   * the alpha channel, which is meaningless here — every plate is opaque to its
   * own black point by construction (§4.1's grade to #050505).
   */
  const scale = `scale=${plate.motion.out[0]}:-2,format=yuv420p`

  await run('ffmpeg', [
    ...base,
    '-i',
    frames,
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '2M',
    '-crf',
    '33',
    '-vf',
    scale,
    '-an',
    '-row-mt',
    '1',
    join(dir, `${plate.id}.webm`),
  ])

  await run('ffmpeg', [
    ...base,
    '-i',
    frames,
    '-c:v',
    'libx264',
    '-b:v',
    '2.5M',
    '-preset',
    'slow',
    '-pix_fmt',
    'yuv420p',
    '-vf',
    scale,
    '-an',
    '-movflags',
    '+faststart',
    join(dir, `${plate.id}.mp4`),
  ])

  /*
   * Poster is the FIRST frame, not a representative one. The loop settles to
   * its start state at both ends (`loopSettle` in core.glsl), so frame 0 is the
   * resting composition — which is what reduced-motion users and every mobile
   * visitor will see as a still, and therefore the frame the dead zone was
   * judged against.
   */
  const poster = join(dir, `${plate.id}-poster.webp`)
  await run('cwebp', [
    '-q',
    String(WEBP_Q),
    '-m',
    '6',
    '-sharp_yuv',
    '-metadata',
    'none',
    '-resize',
    String(plate.motion.out[0]),
    '0',
    '-quiet',
    join(OUT, plate.id, 'frames', 'f0000.png'),
    '-o',
    poster,
  ])

  for (const name of [`${plate.id}.webm`, `${plate.id}.mp4`, `${plate.id}-poster.webp`]) {
    const { size } = await stat(join(dir, name))
    console.log(`motion ${name}  ${(size / 1024 / 1024).toFixed(2)} MB`)
  }
}

async function main() {
  const selectors = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const targets = selectors.length ? selectors.map((id) => platesById[id]) : plates

  for (const plate of targets) {
    const available = await readdir(join(OUT, plate.id)).catch(() => [])
    for (const crop of CROPS) {
      if (!available.includes(`${plate.id}-${crop}.png`)) {
        console.log(`skip   ${plate.id}-${crop}  (no master)`)
        continue
      }
      await encodeStill(plate, crop)
    }
    if (plate.motion && available.includes('frames')) await encodeMotion(plate)
  }

  /* The PNG masters are large and reproducible from the shaders; they are build
     intermediates, not sources. */
  if (process.argv.includes('--clean')) await rm(OUT, { recursive: true, force: true })
}

main().catch((error) => {
  console.error(error.stderr?.toString?.() ?? error)
  process.exit(1)
})
