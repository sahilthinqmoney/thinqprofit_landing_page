/**
 * Shared content contract for the Thinq waitlist page.
 * Every file under src/data/ types its exports against these.
 *
 * ── What was deleted here, and why the file is short now ──────────────────
 *
 * `Product`, `Tool`, `BrokerageRow`, `AccountCharge`, `Plan`, `AppFeature`,
 * `FooterColumn` and `SocialLink` are gone with the sections they typed
 * (Products, Platform, Pricing, MobileApp, and the footer's link columns and
 * social row). None had a consumer left.
 *
 * They are deleted rather than kept "in case", because a type is a description
 * of the content the page carries: an exported `Plan` interface with no plan
 * anywhere in the tree tells the next reader this page has pricing tiers, and
 * that reader has to open five files to find out it does not. The git history
 * holds them if a rate card ever ships.
 *
 * The remaining interfaces are the ones the page actually renders. Section-local
 * shapes — `MissingContent`, `Capability`, `OfferContent`, `FinalCtaContent`,
 * `StatutoryDisclosure`, the waitlist strings — live in their own data files
 * rather than here, because they have exactly one consumer each and a shared
 * contract file is for shapes that cross a boundary.
 */

/** Lucide icon name. Components import the component itself from `lucide-react`. */
export type IconName = string

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export interface MenuItem {
  label: string
  href: string
  icon: IconName
}

export interface MenuColumn {
  heading: string
  items: MenuItem[]
}

export interface MegaMenu {
  label: string
  columns: MenuColumn[]
  /** Optional strip across the bottom of the open menu. */
  footer?: {
    text: string
    linkLabel: string
    href: string
  }
}

export interface NavItem {
  label: string
  href: string
}

/* -------------------------------------------------------------------------- */
/* §2 Hero                                                                    */
/* -------------------------------------------------------------------------- */

export interface HeroContent {
  /** The badge above the H1. Not an eyebrow — see the note in src/data/hero.ts. */
  eyebrow: string
  headline: string
  subheadline: string
  /** The offer line. Its qualifier is a separate export and travels with it. */
  primaryCta: string
  mediaAlt: string
  riskDisclosure: string
}

/* -------------------------------------------------------------------------- */
/* §5 Trust strip                                                             */
/* -------------------------------------------------------------------------- */

export interface Registration {
  authority: string
  /** Placeholder until compliance supplies the verified value. */
  value: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* §5 Security                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Named `SafetyPillar` rather than `SecurityPillar`, and the name is the only
 * thing left of the old section. Renaming it would touch two files for no
 * behavioural change; it is flagged here instead so the mismatch is deliberate
 * rather than discovered.
 */
export interface SafetyPillar {
  title: string
  body: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* §8 Footer                                                                  */
/* -------------------------------------------------------------------------- */

export interface RegistrationLine {
  label: string
  value: string
}
