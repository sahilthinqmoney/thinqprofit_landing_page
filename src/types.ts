/**
 * Shared content contract for the ThinqProfit landing page.
 * Every file under src/data/ types its exports against these.
 *
 * Copy source: docs/landing-page-copy.md
 * Design source: design-system/thinqprofit/pages/landing.md
 *
 * The deck's §1 (announcement bar), §8 (onboarding), §11 (Learn), §12
 * (testimonials), §13 (stats), §14 (FAQ) and §15 (support) shapes are gone with
 * their sections — see the note at the top of src/App.tsx. The numbering below
 * still follows the deck, so the gaps are where those sections were.
 */

/** Lucide icon name. Components import the component itself from `lucide-react`. */
export type IconName = string

/* -------------------------------------------------------------------------- */
/* 2. Navigation                                                              */
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
/* 3. Hero                                                                    */
/* -------------------------------------------------------------------------- */

export interface HeroContent {
  eyebrow: string
  headline: string
  subheadline: string
  primaryCta: string
  mediaAlt: string
  riskDisclosure: string
}

/* -------------------------------------------------------------------------- */
/* 4. Trust strip                                                             */
/* -------------------------------------------------------------------------- */

export interface Registration {
  authority: string
  /** Placeholder until compliance supplies the verified value. */
  value: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* 5. Products                                                                */
/* -------------------------------------------------------------------------- */

export interface Product {
  id: string
  title: string
  body: string
  cta: string
  href: string
  icon: IconName
  /** Card-level regulatory disclosure. Rendered in warning styling. */
  disclosure?: string
}

/* -------------------------------------------------------------------------- */
/* 6. Platform & tools                                                        */
/* -------------------------------------------------------------------------- */

export interface Tool {
  title: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* 7. Pricing                                                                 */
/* -------------------------------------------------------------------------- */

export interface BrokerageRow {
  segment: string
  rate: string
}

export interface AccountCharge {
  item: string
  amount: string
}

export interface Plan {
  name: string
  price: string
  cadence: string
  blurb: string
  features: string[]
  cta: string
  highlighted: boolean
}

/* -------------------------------------------------------------------------- */
/* 9. Mobile app                                                              */
/* -------------------------------------------------------------------------- */

export interface AppFeature {
  label: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* 10. Safety                                                                 */
/* -------------------------------------------------------------------------- */

export interface SafetyPillar {
  title: string
  body: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* 17. Footer                                                                 */
/* -------------------------------------------------------------------------- */

export interface FooterColumn {
  heading: string
  links: string[]
}

export interface SocialLink {
  label: string
  href: string
  icon: IconName
}

export interface RegistrationLine {
  label: string
  value: string
}
