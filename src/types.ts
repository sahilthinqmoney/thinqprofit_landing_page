/**
 * Shapes shared across more than one file. Section-local shapes — `GapContent`,
 * `CapabilityCard` — live in their own data file, because a shared contract file
 * is for things that cross a boundary.
 */

/** §2 — src/data/hero.ts */
export interface HeroContent {
  headline: string
  mediaAlt: string
  riskDisclosure: string
}

/** §8 — one row of the footer's registration block, src/data/footer.ts */
export interface RegistrationLine {
  label: string
  value: string
}
