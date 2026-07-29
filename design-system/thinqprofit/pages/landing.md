# Landing Page — Overrides

> Overrides `../MASTER.md` for the ThinqProfit marketing landing page.
> Generated from `ui-ux-pro-max`, then reconciled by hand. Reconciliation notes are marked **Why**.

---

## 1. Conflicts resolved from MASTER.md

| # | Conflict in MASTER.md | Resolution |
|---|----------------------|------------|
| 1 | Style is `Dark Mode (OLED)` but the palette ships a light background (`#F8FAFC`) with dark foreground | Use the **Fintech/Crypto dark palette** (`colors.csv` → Fintech/Crypto): background `#0F172A`, foreground `#F8FAFC`. Dark is the brand mode. |
| 2 | Accent/CTA is `#059669` (green) | **Do not use green as the brand/CTA colour.** On a trading platform green and red are semantically reserved for gain and loss. A green "Open free account" button next to a green day-change figure teaches the eye the wrong thing. CTA moves to indigo. |
| 3 | Page pattern is `App Store Style Landing` | Spine is **Trust & Authority + Conversion** (`landing.csv` result 1). App-Store treatment is demoted to the Mobile App section only (§9 of the copy deck). **Why:** a SEBI-registered broker converts on credibility first; the app-store pattern assumes the user already trusts the brand. |
| 4 | Product row matched `Financial Dashboard` | Correct for the in-app product, wrong for the marketing page. Marketing page follows `Banking/Traditional Finance` → Trust & Authority + Feature-Rich. |
| 5 | Component specs use light cards (`background: #FFFFFF`) | Rewritten below for the dark surface set. |

---

## 2. Colour tokens (dark, authoritative)

| Role | Hex | Token | Notes |
|------|-----|-------|-------|
| Background | `#0F172A` | `--color-bg` | Page base |
| Surface | `#1A2234` | `--color-surface` | Cards, nav on scroll |
| Surface raised | `#222B3E` | `--color-surface-raised` | Hover, popovers |
| Foreground | `#F8FAFC` | `--color-fg` | Headings |
| Foreground muted | `#94A3B8` | `--color-fg-muted` | Body copy — 6.1:1 on `#0F172A` ✓ |
| Foreground subtle | `#64748B` | `--color-fg-subtle` | Legal/footer only, never body |
| Border | `#334155` | `--color-border` | 1px hairlines |
| **Accent / CTA** | `#4F46E5` | `--color-accent` | Indigo. Brand action colour. |
| Accent hover | `#6366F1` | `--color-accent-hover` | |
| Accent soft | `#A5B4FC` | `--color-accent-soft` | Eyebrows, links on dark |
| **Gain** | `#22C55E` | `--color-gain` | **Reserved for market data only** |
| **Loss** | `#EF4444` | `--color-loss` | **Reserved for market data only** |
| Warning | `#F59E0B` | `--color-warning` | Risk disclosures, margin alerts |

**Hard rules**
- `--color-gain` / `--color-loss` never appear on a button, badge, link, or illustration. Market data only.
- Never signal gain/loss by colour alone — pair with `+`/`−` and an arrow glyph (`ux-guidelines.csv` → Accessibility / Color Only, severity High).
- `--color-fg-subtle` (`#64748B`) is **3.9:1** on the page background. Legal fine print and footer meta only; never body text.

---

## 3. Typography

Inter throughout (`typography.csv` → Inter/Inter, "fintech/trading, precision, high-end utility"). Already loaded in `index.html`.

| Role | Size / Line height | Weight | Tracking |
|------|-------------------|--------|----------|
| Display (H1) | `clamp(2.25rem, 5vw, 3.75rem)` / 1.05 | 600 | −0.02em |
| H2 | `clamp(1.75rem, 3vw, 2.5rem)` / 1.15 | 600 | −0.015em |
| H3 | `1.125rem` / 1.4 | 600 | 0 |
| Body | `1rem` / 1.6 | 400 | 0 |
| Body large (hero sub) | `1.125rem` / 1.6 | 400 | 0 |
| Caption / meta | `0.8125rem` / 1.5 | 400 | 0 |
| Legal fine print | `0.75rem` / 1.55 | 400 | 0 |
| **Numerals (prices, %, ₹)** | inherit | 500 | — |

Numerals must use `font-variant-numeric: tabular-nums`. **Why:** proportional digits make a ticker column jitter on every price tick.

Minimum body size is 16px (`ux-guidelines.csv` → Typography). Legal text at 12px is the floor and must still clear 4.5:1.

---

## 4. Spacing & density

Marketing page = spacious. Overrides MASTER's dashboard-leaning scale.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Icon-to-label |
| `--space-sm` | 8px | Inline gaps |
| `--space-md` | 16px | Card padding inner |
| `--space-lg` | 24px | Card padding |
| `--space-xl` | 40px | Block gaps |
| `--space-2xl` | 64px | Sub-section |
| `--space-3xl` | 96px | Section vertical rhythm (desktop) |

Section padding: `96px` desktop / `64px` tablet / `48px` mobile.
Container: `max-width: 1152px`, gutter `24px`.

---

## 5. Component specs (dark)

```css
/* Primary CTA — indigo, never green */
.btn-primary {
  background: var(--color-accent);
  color: #fff;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 200ms ease;
  min-height: 44px;            /* touch target floor */
}
.btn-primary:hover { background: var(--color-accent-hover); }
.btn-primary:focus-visible {
  outline: 2px solid var(--color-accent-soft);
  outline-offset: 2px;
}

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--color-fg);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  padding: 12px 24px;
  min-height: 44px;
  cursor: pointer;
  transition: border-color 200ms ease, color 200ms ease;
}

/* Card — no lift transform */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--space-lg);
  transition: border-color 200ms ease, background-color 200ms ease;
}
.card:hover {
  border-color: color-mix(in oklab, var(--color-accent) 40%, transparent);
  background: var(--color-surface-raised);
}

/* Input */
.input {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  padding: 12px 20px;
  font-size: 16px;             /* below 16px iOS zooms on focus */
  color: var(--color-fg);
  min-height: 44px;
}
.input:focus-visible {
  border-color: var(--color-accent);
  outline: 2px solid var(--color-accent-soft);
  outline-offset: 1px;
}
```

**Why no `transform: translateY(-2px)` on cards** — MASTER.md prescribes a hover lift. On a grid of eight product cards that reads as jitter, and it triggers layout-adjacent repaint. Border and surface shift carry the same affordance at lower cost. This is a deliberate departure from MASTER.

---

## 6. Motion

Tier: **subtle**. Financial products lose credibility when they bounce.

- Duration 150–300ms, `ease-out` on entry, faster on exit
- Scroll reveal: opacity `0 → 1` plus `translateY(12px → 0)`, 60ms stagger, **once**
- Animate `transform` and `opacity` only — never `width`, `height`, or `top`
- No parallax on price/chart imagery — it implies motion in the data
- No countdown timers, no urgency animation anywhere on a financial product

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Section order (final)

Trust & Authority spine, mapped to `docs/landing-page-copy.md`:

| Order | Section | Copy deck § |
|-------|---------|-------------|
| 1 | Announcement bar | §1 |
| 2 | Nav (mega-menu) | §2 |
| 3 | Hero + market-risk line | §3 |
| 4 | **Trust strip — registrations** | §4 |
| 5 | Products grid (8) | §5 |
| 6 | Platform & tools | §6 |
| 7 | Pricing | §7 |
| 8 | Onboarding (3 steps) | §8 |
| 9 | Safety & protection | §10 |
| 10 | Mobile app (App-Store treatment) | §9 |
| 11 | Learn | §11 |
| 12 | Stats band | §13 |
| 13 | Testimonials | §12 |
| 14 | FAQ | §14 |
| 15 | Support | §15 |
| 16 | Final CTA | §16 |
| 17 | Footer + legal block | §17 |

**Why proof sits at position 4** — `landing.csv` → Trust & Authority puts credibility immediately after the hero. For a broker the registration strip is the proof; a visitor deciding where to keep their money asks "are you real" before "what do you cost".

**Why Safety precedes Mobile app** — the objection ("is my money safe") outranks the convenience pitch.

---

## 8. Icons

Lucide, 1.5px stroke, 20px in cards / 16px inline. One set only. **No emoji as icons.**

| Section | Icons |
|---------|-------|
| Products | trending-up, layers, pie-chart, rocket, gem, banknote, landmark, boxes |
| Platform | candlestick-chart, table-2, filter, bell, timer, git-branch, flask-conical, code, file-text, activity |
| Safety | vault, split, key-round, shield-check, lock, message-square-warning |

---

## 9. Landing-specific accessibility gates

Beyond MASTER's checklist:

- [ ] Every risk disclosure meets 4.5:1 — legal copy is the first thing dark themes under-contrast
- [ ] Disclosures are real text, never baked into an image
- [ ] Gain/loss values carry a sign or arrow, not colour alone
- [ ] Announcement bar dismissible by keyboard
- [ ] Mega-menu operable by keyboard; `Esc` closes; focus returns to trigger
- [ ] Skip-to-content link as the first focusable element
- [ ] Tap targets ≥ 44×44px with ≥ 8px separation
- [ ] Tested at 375 / 768 / 1024 / 1440px, no horizontal scroll
- [ ] Hero visual carries a visible "Illustrative" stamp — never a real-looking P&L

---

## 10. Anti-patterns for this page specifically

- ❌ Green CTA buttons (collides with gain semantics)
- ❌ Urgency mechanics — countdowns, "N seats left"
- ❌ Screenshots showing large gains, even as illustration
- ❌ Glassmorphism on legal text — `products.csv` suggests it for Fintech/Crypto; blur behind disclosure copy fails contrast
- ❌ Auto-playing ticker animation in the hero — reads as live data when it isn't
- ❌ Stock photography of people celebrating money
