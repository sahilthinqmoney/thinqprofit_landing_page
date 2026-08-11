/// <reference types="vite/client" />

/**
 * The year the bundle was built, substituted by `define` in vite.config.ts.
 * Constant across the prerender and the browser, which is the point of it.
 */
declare const __BUILD_YEAR__: number
