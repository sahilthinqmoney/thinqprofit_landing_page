/// <reference types="vite/client" />

/**
 * The year the bundle was built, substituted by `define` in vite.config.ts.
 * Constant across the prerender and the browser, which is the point of it.
 */
declare const __BUILD_YEAR__: number

/**
 * hls.js publishes types for `hls.js` but not for its `./light` subpath, which
 * is the same API with the subtitle, alternate-audio and DRM controllers left
 * out. Re-exporting the main package's types keeps the call site fully typed
 * rather than pushing it through `any`.
 */
declare module 'hls.js/light' {
  export * from 'hls.js'
  export { default } from 'hls.js'
}
