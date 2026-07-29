# ThinqProfit — Landing Page

Marketing landing page for **ThinqProfit**, an India-market (SEBI/NSE/BSE/MCX/CDSL) stock broker. React 19 + TypeScript + Vite + Tailwind CSS v4, dark theme.

> ### ⚠️ Not production-ready — read this first
>
> Every value in `[SQUARE BRACKETS]` is an **unfilled placeholder**, rendered in warning colour on the page so it cannot be mistaken for finished copy. That includes all SEBI/NSE/BSE/MCX/CDSL registration and member codes, the entire brokerage rate card, compliance officer details, every statistic, and every testimonial attribution.
>
> **Publishing a broker page with invented registration numbers is a regulatory offence, not a typo.** The footer's statutory disclosures, the "Attention Investors" notices and the grievance ladder must be reviewed by your compliance officer and legal counsel against current SEBI and exchange circulars before this goes anywhere near production. The SEBI F&O loss statistic is deliberately left blank — pull it from the current published study rather than from memory.
>
> Open items are tracked at the end of [docs/landing-page-copy.md](docs/landing-page-copy.md).

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Dev server with HMR                |
| `npm run build`     | Typecheck, then build into `dist/` |
| `npm run typecheck` | `tsc -b` without emitting          |
| `npm run preview`   | Serve the production build         |
| `npm run lint`      | oxlint                             |

## Source of truth

Two documents govern this page. Code follows them, not the other way round.

| File | Governs |
| ---- | ------- |
| [docs/landing-page-copy.md](docs/landing-page-copy.md) | Every string on the page — 21 sections, SEO meta through footer legal block, plus microcopy and voice rules |
| [design-system/thinqprofit/pages/landing.md](design-system/thinqprofit/pages/landing.md) | Colour, type, spacing, motion, section order, a11y gates. **Overrides** `MASTER.md` |
| [design-system/thinqprofit/MASTER.md](design-system/thinqprofit/MASTER.md) | Raw `ui-ux-pro-max` output. Superseded by the page override above where they disagree |

Copy changes belong in `src/data/`, not in components.

## Structure

```
src/
  App.tsx                    17-section composition, Trust & Authority order
  types.ts                   shared content contract
  index.css                  Tailwind v4 @theme tokens
  lib/copyTokens.ts          tokenises [PLACEHOLDER] / **bold** / [link](href)
  data/                      all copy — nav, hero, products, platform, pricing,
                             onboarding, safety, app, learn, social, faq, footer
  components/
    ui/                      Container, SectionShell, Button, Reveal,
                             MediaPlaceholder, Disclosure, CopyText
    sections/                AnnouncementBar, Navbar, Hero, TrustStrip,
                             Products, Platform, Pricing, Onboarding, Safety,
                             MobileApp, Learn, Stats, Testimonials, Faq,
                             Support, FinalCta, Footer
```

## Design decisions worth knowing

- **CTAs are indigo, never green.** Green and red are reserved for market data. A green "Open free account" button beside a green day-change figure teaches the eye the wrong association.
- **`--color-gain` / `--color-loss` appear on no button, badge, link or illustration.** Market data only, and never signalled by colour alone.
- **`--color-fg-subtle` (#64748B) is 3.9:1** on the page background — footer meta and legal fine print only. Never body copy, never a disclosure.
- **Section order is Trust & Authority**, not app-store: the registration strip sits at position 4, directly after the hero, and Safety precedes the mobile-app pitch. Someone deciding where to keep their money asks "are you real" before "what do you cost".
- **No urgency mechanics** — no countdowns, no scarcity counters, no screenshots showing large gains.

## Media placeholders

All imagery is the `MediaPlaceholder` component: a dashed hatched box that reserves its aspect ratio so nothing shifts when real assets drop in. No `<img>` tags, no external requests. Replace them with real assets; the intended content is described in each `label`.

## Verified

`tsc -b`, `oxlint` and `vite build` are clean. Rendered headlessly and checked for horizontal overflow at 375 / 414 / 768 / 1024 / 1440 px — `scrollWidth === viewport` at every width.
