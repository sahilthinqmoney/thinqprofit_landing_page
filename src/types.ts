/**
 * Shared content contract for the Thinq waitlist page.
 * Every file under src/data/ types its exports against these.
 *
 * ── What was deleted here, and why the file is short now ──────────────────
 *
 * `Product`, `Tool`, `BrokerageRow`, `AccountCharge`, `Plan`, `AppFeature`,
 * `FooterColumn` and `SocialLink` went with the sections they typed (Products,
 * Platform, Pricing, MobileApp, and the footer's link columns and social row).
 * `MenuItem`, `MenuColumn`, `MegaMenu`, `NavItem` and `IconName` went with the
 * mega-menus — see the note in src/data/nav.ts. `Registration` and
 * `SafetyPillar` went with the trust strip and the security section. None had a
 * consumer left.
 *
 * They are deleted rather than kept "in case", because a type is a description
 * of the content the page carries: an exported `Plan` interface with no plan
 * anywhere in the tree tells the next reader this page has pricing tiers, and
 * that reader has to open five files to find out it does not. The git history
 * holds them if a rate card ever ships.
 *
 * The two interfaces below are the ones the page actually renders. Section-local
 * shapes — `MissingContent`, `Capability`, `StatutoryDisclosure` — live in their
 * own data files rather than here, because they have exactly one consumer each
 * and a shared contract file is for shapes that cross a boundary.
 */

/* -------------------------------------------------------------------------- */
/* §2 Hero                                                                    */
/* -------------------------------------------------------------------------- */

export interface HeroContent {
  headline: string
  mediaAlt: string
  riskDisclosure: string
}

/* -------------------------------------------------------------------------- */
/* §8 Footer                                                                  */
/* -------------------------------------------------------------------------- */

export interface RegistrationLine {
  label: string
  value: string
}
