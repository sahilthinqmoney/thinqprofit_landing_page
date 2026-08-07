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
  App.tsx                    the composition: Navbar, four sections, Footer
  types.ts                   shared content contract
  index.css                  Tailwind v4 @theme tokens
  lib/copyTokens.ts          tokenises [PLACEHOLDER] / **bold** / [link](href)
  lib/scrollTrigger.ts       the single gsap + ScrollTrigger registration
  data/                      all copy — nav, hero, missing, capabilities, footer
  components/
    ui/                      Container, SectionShell, Button, Disclosure,
                             CopyText, MediaBackdrop, MediaSection, FocusPull,
                             ThinqMark, ChromaticWordmark, LiquidMetalSurface
    sections/                Navbar, Hero, Missing, SectionTwo,
                             AgenticHandsSection, Capabilities, Footer
    lightswind/              3d-image-slider, the desktop capabilities carousel
```

## Design decisions worth knowing

- **The page is a waitlist, not a storefront.** One action — the phone-number form in the hero — and four sections of argument leading back to it. There is nothing to navigate between, which is why `megaMenus` in `src/data/nav.ts` is an empty array; the reasoning is written at the top of that file.
- **`--color-gain` / `--color-loss` appear on no button, badge, link or illustration.** Market data only, and never signalled by colour alone.
- **`--color-fg-subtle` is footer meta and legal fine print only.** Never body copy, never a disclosure.
- **No fabricated market data.** No invented tickers, levels, P&L or order tickets — `docs/art-direction.md` §2.1 refuses them outright. The flip clock in §3 is deliberately not market data.
- **No urgency mechanics** — no countdowns, no scarcity counters, no screenshots showing large gains.

## Media

Every asset the page loads lives in `public/` and is referenced by an explicit path. There are ten of them: the hero clip, the flip-clock loop, two hand stills, four capability card images, the favicon and the share card. Nothing else is committed — an asset that no component names is not kept.

## Verified

`tsc -b`, `oxlint` and `vite build` are clean. Rendered headlessly and checked for horizontal overflow at 375 / 414 / 768 / 1024 / 1440 px — `scrollWidth === viewport` at every width.
