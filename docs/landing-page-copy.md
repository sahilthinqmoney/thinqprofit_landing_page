# ThinqProfit — Landing Page Copy Deck

**Market:** India · **Regulator framing:** SEBI / NSE / BSE / MCX / CDSL
**Structural reference:** robinhood.com/us/en (section inventory only — all copy below is original)
**Status:** Draft v1 for review. Not legally cleared.

> **Read before publishing.** Every `[SQUARE BRACKET]` is a placeholder that must be filled with a real, verified value — registration numbers, member codes, officer names, fee amounts, and statistics. Publishing a broker landing page with invented SEBI/exchange registration numbers is a regulatory offence, not a typo. Section 17 (Legal & Compliance) must be reviewed by your compliance officer and legal counsel before this page goes live. Statistics quoted from SEBI studies must be re-verified against the current published study — the numbers change.

---

## Table of contents

| # | Section | Purpose |
|---|---------|---------|
| 0 | [Page meta & SEO](#0-page-meta--seo) | Title, description, OG, schema |
| 1 | [Announcement bar](#1-announcement-bar) | Rotating promo / regulatory notice |
| 2 | [Navigation bar](#2-navigation-bar) | Desktop mega-menu + mobile |
| 3 | [Hero](#3-hero) | Primary headline + CTA |
| 4 | [Trust strip](#4-trust-strip) | Regulator + scale proof |
| 5 | [Products](#5-products) | 8 tradable product cards |
| 6 | [Platform & tools](#6-platform--tools) | Charting, option chain, screeners |
| 7 | [Pricing](#7-pricing) | Brokerage + plans |
| 8 | [Onboarding](#8-onboarding-how-it-works) | 3-step account opening |
| 9 | [Mobile app](#9-mobile-app) | Store CTAs |
| 10 | [Safety & protection](#10-safety--protection) | Custody, 2FA, ASBA |
| 11 | [ThinqProfit Learn](#11-thinqprofit-learn) | Education hub |
| 12 | [Testimonials](#12-testimonials) | Social proof |
| 13 | [Stats band](#13-stats-band) | Numbers |
| 14 | [FAQ](#14-faq) | 12 questions |
| 15 | [Support](#15-support) | Contact channels |
| 16 | [Final CTA](#16-final-cta) | Conversion close |
| 17 | [Footer](#17-footer) | Links + full legal block |
| 18 | [Microcopy library](#18-microcopy-library) | Forms, errors, empty states |
| 19 | [Voice & tone rules](#19-voice--tone-rules) | Writing guardrails |
| 20 | [Design direction](#20-design-direction) | Style, colour, type, section order |

---

## 0. Page meta & SEO

**Title tag (58 chars)**
> ThinqProfit — Trade Stocks, F&O and Mutual Funds in India

**Meta description (152 chars)**
> Open a free demat account with ThinqProfit. Trade stocks, ETFs, F&O, commodities and mutual funds with flat-fee pricing and a platform built for speed.

**H1 (one per page — the hero headline)**
> Your money. Your market. One app.

**Open Graph**
- `og:title` — ThinqProfit — Trade Stocks, F&O and Mutual Funds in India
- `og:description` — Flat-fee trading, direct mutual funds, and a platform that keeps up with the market. Open your demat account in minutes.
- `og:image` — 1200×630, app screenshot on a dark field, wordmark bottom-left
- `og:image:alt` — ThinqProfit app showing a Nifty 50 chart and an open order ticket

**Twitter card:** `summary_large_image`

**Schema.org:** `Organization` + `FinancialService`. Include `legalName`, `address`, `telephone`, `email`, `sameAs` (social profiles).

**Canonical:** `https://[thinqprofit.com]/`

**Primary keywords:** demat account, online trading app India, F&O trading, direct mutual funds, stock market app
**Do not target:** "guaranteed returns", "best stock tips", "sure shot profit" — these invite both SEBI scrutiny and the wrong user.

---

## 1. Announcement bar

Dismissible. One line, centre-aligned. Rotate a maximum of two messages.

**Variant A — promo**
> Account opening is free until [DATE]. Get started in under 10 minutes → 

**Variant B — regulatory notice (use during mandated disclosure windows)**
> Investor Charter and monthly complaint data are published in our [Investor Relations](#) section.

**Variant C — product launch**
> New: GTT orders are now live on stocks and F&O. [See what changed](#)

**Dismiss label:** Close announcement

---

## 2. Navigation bar

### 2.1 Wordmark
`ThinqProfit` — text lockup, mark to the left.
Alt text for the logo image: `ThinqProfit home`

### 2.2 Desktop nav — top level

| Label | Type |
|-------|------|
| Products | Mega-menu |
| Platform | Mega-menu |
| Pricing | Direct link |
| Learn | Mega-menu |
| Support | Direct link |
| Log in | Text button |
| Open free account | Solid button |

### 2.3 Mega-menu: **Products**

**Column 1 — Invest**
- **Stocks & ETFs** — Buy and hold from NSE and BSE
- **Mutual Funds** — Direct plans, zero commission
- **IPO** — Apply with UPI in a few taps
- **Bonds & G-Secs** — Fixed income for the boring part of your portfolio

**Column 2 — Trade**
- **Futures & Options** — Index and stock derivatives with a full option chain
- **Intraday** — Same-day equity positions with MIS margins
- **Commodities** — Gold, silver, crude and more on MCX
- **Currency** — USDINR and major pairs on the NSE currency segment

**Column 3 — Grow**
- **MTF** — Margin Trading Facility for delivery positions
- **Baskets** — Thematic portfolios you can buy in one order
- **SIP** — Automate weekly or monthly investing
- **Referrals** — Bring a friend, both of you benefit

**Menu footer strip**
> New to markets? Start with [ThinqProfit Learn](#) — free, no account needed.

### 2.4 Mega-menu: **Platform**

**Column 1 — Apps**
- **ThinqProfit Mobile** — iOS and Android
- **ThinqProfit Web** — Full trading terminal in the browser
- **ThinqProfit Pro** — Multi-chart desktop layout for active traders

**Column 2 — Tools**
- **Charts** — 100+ indicators, drawing tools, saved layouts
- **Option Chain** — Live Greeks, OI, IV and payoff builder
- **Screeners** — Filter the whole market on 60+ parameters
- **Alerts** — Price, indicator and OI triggers on your phone

**Column 3 — Build**
- **API** — REST and WebSocket access for your own systems
- **Strategy Builder** — Construct and test multi-leg option strategies
- **Paper Trading** — Practise with live data and no money at risk
- **Reports** — Tax P&L, capital gains, and ledger exports

### 2.5 Mega-menu: **Learn**

- **Learn Hub** — Guided courses from first trade to F&O
- **Market Digest** — A five-minute read before the open
- **Glossary** — Plain-language definitions, no jargon loops
- **Videos** — Short walkthroughs of every screen in the app
- **Calculators** — Brokerage, margin, SIP and options payoff

### 2.6 Mobile nav

Hamburger opens a full-screen sheet. Accordions in this order:
`Products` → `Platform` → `Pricing` → `Learn` → `Support`

Pinned at the bottom of the sheet:
- Secondary button: **Log in**
- Primary button: **Open free account**

**ARIA labels**
- Hamburger: `Open menu` / `Close menu`
- Each accordion: `Expand Products` / `Collapse Products`

---

## 3. Hero

**Eyebrow**
> SEBI-registered broker · NSE · BSE · MCX · CDSL

**Headline**
> Your money. Your market. One app.

**Subheadline**
> Stocks, ETFs, F&O, commodities and direct mutual funds — on a platform that loads fast, prices plainly, and stays out of your way.

**Primary CTA:** Open free account
**Secondary CTA:** See pricing

**CTA support line**
> Free account opening · Aadhaar eKYC · Ready to trade the same day

**Hero visual — description for design**
App on a dark field, order ticket open over a Nifty 50 candlestick chart. Second card floating: holdings list with day change. No fabricated P&L figures — use neutral, obviously-illustrative numbers, and stamp the visual with "Illustrative. Not a recommendation."

**Image alt text**
> ThinqProfit app showing a Nifty 50 chart with an open buy order

**Mandatory adjacent disclosure** — sits directly below the hero fold, not buried:
> Investments in the securities market are subject to market risk. Read all the related documents carefully before investing.

### Headline alternatives (for A/B)

| # | Headline | Angle |
|---|----------|-------|
| A | Your money. Your market. One app. | Ownership (recommended) |
| B | Trading that doesn't get in the way. | Product speed |
| C | Every market you need. One login. | Breadth |
| D | Start investing with what you have today. | Low barrier |

---

## 4. Trust strip

Thin band under the hero. Logos or text marks, muted, no heading competing with the H1.

**Label**
> Registered and regulated

**Items**
- SEBI Registered Broker — `[INZ000XXXXXX]`
- NSE Member — `[Member code]`
- BSE Member — `[Member code]`
- MCX Member — `[Member code]`
- CDSL Depository Participant — `[IN-DP-XXX-XXXX]`

> **TODO:** replace all five with verified registration and member codes before launch. If any segment is not yet live, remove the row entirely — do not display an unregistered segment.

---

## 5. Products

**Section eyebrow:** What you can trade
**Section heading:** One account, every Indian market
**Section subheading:** Equity, derivatives, commodities and funds — settled into a single portfolio view, so you always know what you actually own.

### 5.1 Stocks & ETFs
**Card title:** Stocks & ETFs
**Body:** Buy and hold across NSE and BSE, from blue chips to small caps. Shares land in your demat account; ETFs give you an index in one line item.
**Detail bullets:**
- Delivery and intraday from the same screen
- Company fundamentals, filings and results in-app
- Fractional-friendly SIPs on eligible ETFs
**CTA:** Explore stocks

### 5.2 Futures & Options
**Card title:** Futures & Options
**Body:** A full option chain with live Greeks, open interest and implied volatility, plus a payoff builder that shows you the shape of a position before you place it.
**Detail bullets:**
- Index and stock derivatives across NSE segments
- Multi-leg baskets placed as a single order
- Margin calculator with SPAN and exposure breakdown
**CTA:** Explore F&O
**Card-level disclosure (required, do not omit):**
> Derivatives carry a high risk of loss. SEBI studies have found that a large majority of individual traders in the equity F&O segment incur net losses. `[Insert the current SEBI-published figure and study reference — verify before publishing.]`

### 5.3 Mutual Funds
**Card title:** Mutual Funds
**Body:** Direct plans only. No distributor commission is built into your NAV, which is the entire point.
**Detail bullets:**
- Start an SIP from `[₹AMOUNT]` a month
- Switch, pause or step up without paperwork
- Consolidated holdings alongside your stocks
**CTA:** Explore mutual funds
**Disclosure:** Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.

### 5.4 IPO
**Card title:** IPO
**Body:** Apply to mainboard and SME issues with UPI. Funds stay blocked in your bank account until allotment — they never sit with us.
**Detail bullets:**
- Live and upcoming issue calendar
- Pre-filled applications from your existing details
- Allotment status without leaving the app
**CTA:** See open IPOs

### 5.5 Commodities
**Card title:** Commodities
**Body:** Trade gold, silver, crude oil, natural gas and agri contracts on MCX, with position and margin tracking that matches your equity view.
**Detail bullets:**
- Full MCX futures and options coverage
- Evening session support
- Contract specs and expiry calendar built in
**CTA:** Explore commodities

### 5.6 Currency
**Card title:** Currency
**Body:** USDINR, EURINR, GBPINR and JPYINR derivatives on the NSE currency segment.
**Detail bullets:**
- Hedge exposure or trade the pair directly
- Same order types as equity F&O
**CTA:** Explore currency
**Note for compliance:** confirm eligibility and underlying-exposure requirements before this section goes live.

### 5.7 Bonds & G-Secs
**Card title:** Bonds & G-Secs
**Body:** Government securities, T-Bills, SDLs and corporate bonds — the part of a portfolio that isn't supposed to be exciting.
**Detail bullets:**
- Yield and maturity shown before you commit
- Interest and redemption tracked automatically
**CTA:** Explore bonds

### 5.8 Baskets
**Card title:** Baskets
**Body:** Thematic sets of stocks and ETFs you can buy, rebalance or exit in a single order, instead of managing twelve tickers by hand.
**Detail bullets:**
- Weightings and rationale shown up front
- One-tap rebalance when the basket updates
- SIP into a basket, not just a fund
**CTA:** Explore baskets
**Disclosure:** Baskets are not advisory recommendations unless explicitly marked as such and issued under our Research Analyst registration `[INH000XXXXXX]`.

---

## 6. Platform & tools

**Eyebrow:** The platform
**Heading:** Built for the ten seconds that matter
**Subheading:** Order entry, charts and positions on one screen — because the market doesn't wait for a page to load.

| Feature | Copy |
|---------|------|
| **Charts** | 100+ indicators, 20 drawing tools, and layouts that save exactly where you left them. Trade directly from the chart. |
| **Option chain** | Live Greeks, OI change, IV and PCR in one grid. Filter by strike range, tap to build a leg. |
| **Screeners** | Filter the entire listed universe on 60+ fundamental and technical parameters. Save a screen, get alerted when a stock enters it. |
| **Alerts** | Price, percentage, indicator and open-interest triggers, delivered to your phone. |
| **GTT orders** | Set a target and stop-loss that stay live for up to a year. No re-placing every morning. |
| **Baskets & multi-leg** | Build a four-leg strategy, check the payoff, place it as one order. |
| **Paper trading** | Live market data, simulated money. Learn the mechanics before you risk anything. |
| **API** | REST and WebSocket endpoints, documented, with rate limits published openly. |
| **Reports** | Tax P&L, capital gains statements, contract notes and ledgers — downloadable, ITR-ready. |
| **Portfolio analytics** | Sector concentration, XIRR, realised versus unrealised, and what's actually driving your returns. |

**Section CTA:** Take a product tour

---

## 7. Pricing

**Eyebrow:** Pricing
**Heading:** Priced plainly, in advance
**Subheading:** One rate card. No hidden platform fee, no charge for calling support, no surprise on the contract note.

> **TODO — all amounts below are placeholders.** Fill from your approved rate card. Under SEBI's true-to-label rules, charges shown to clients must match what is actually levied; exchange, clearing, and statutory charges must be passed through at actuals and shown separately. Have compliance sign off on this table verbatim.

| Segment | Brokerage |
|---------|-----------|
| Equity delivery | `[₹0 / ₹X per order]` |
| Equity intraday | `[₹X or Y% per executed order, whichever is lower]` |
| Equity F&O | `[₹X per executed order]` |
| Currency F&O | `[₹X per executed order]` |
| Commodity F&O | `[₹X per executed order]` |
| Mutual funds (direct) | `[₹0]` |
| IPO application | `[₹0]` |
| Bonds & G-Secs | `[₹X]` |

**Always-visible line under the table**
> Plus statutory and exchange charges at actuals — STT/CTT, exchange transaction charges, SEBI turnover fees, stamp duty and GST. See the [full rate card](#) for the complete breakdown.

### Account charges

| Item | Amount |
|------|--------|
| Account opening | `[₹0]` |
| Annual demat maintenance (AMC) | `[₹X per year]` |
| Call & Trade | `[₹X per order]` |
| Auto square-off (intraday) | `[₹X per order]` |
| Physical statement request | `[₹X]` |

### Plan tiers (if you run tiered pricing)

**Basic — `[₹0]`**
For investors who buy and hold.
- Equity delivery and mutual funds
- Charts, screeners and alerts
- Standard support

**Active — `[₹X/month]`**
For traders who are in the market most days.
- Everything in Basic
- Advanced option chain and strategy builder
- Priority support queue
- `[N]` free GTT orders per month

**Pro — `[₹X/month]`**
For high-frequency and systematic traders.
- Everything in Active
- API access with higher rate limits
- Multi-chart desktop terminal
- Dedicated relationship manager

**Pricing CTA:** Open free account
**Fine print:** Charges are subject to change with prior notice as required by exchange and SEBI regulations.

---

## 8. Onboarding (how it works)

**Eyebrow:** Getting started
**Heading:** Open an account before your chai gets cold
**Subheading:** Fully online, Aadhaar-based, and no branch visit — assuming your KYC details are current.

**Step 1 — Verify yourself**
Enter your PAN and Aadhaar-linked mobile number. We pull your KYC from the registry, so you're not re-typing what the system already has.

**Step 2 — Add your details**
Link your bank account, complete video verification, and appoint a nominee. eSign with Aadhaar OTP and you're done with paperwork.

**Step 3 — Fund and trade**
Add money by UPI or net banking. Your demat account activates and you can place your first order the same day.

**Requirements strip**
> You'll need: PAN card · Aadhaar linked to your mobile number · Bank account details · Signature and photo

**Timing note**
> Most accounts are activated within `[X]` working hours. Some cases need extra verification and take longer — we'll tell you which, and why.

**CTA:** Start account opening

---

## 9. Mobile app

**Eyebrow:** On the go
**Heading:** The whole market, in your pocket
**Body:** Order entry, live charts, positions and funds — the mobile app does everything the web terminal does, minus the excuses. Biometric login, instant UPI funding, and alerts that arrive when they matter.

**Bullets**
- Face ID and fingerprint login
- Widgets for your watchlist and holdings
- Push alerts for orders, triggers and margin calls
- Works on a patchy connection — orders queue and confirm

**Store CTAs:** Download on the App Store · Get it on Google Play
**QR line:** Scan to install
**Rating line:** `[X.X]` on the App Store · `[X.X]` on Google Play `[TODO: use live ratings or delete this line]`

---

## 10. Safety & protection

**Eyebrow:** Safety
**Heading:** Your money and your shares stay yours
**Subheading:** Client assets sit where regulation says they should — not on our balance sheet.

**Pillar 1 — Shares in your demat account**
Every share you buy is credited directly to your CDSL demat account, held in your name. We can't move them without your authorisation.

**Pillar 2 — Funds handled per SEBI norms**
Client funds are kept in designated client bank accounts, segregated from ours, with settlement at the frequency SEBI mandates.

**Pillar 3 — You authorise every debit**
Selling requires your explicit approval each time, through CDSL TPIN or a SEBI-approved equivalent. No blanket power of attorney.

**Pillar 4 — Account security**
Two-factor authentication on every login, TOTP support, device binding, and session alerts when something signs in that shouldn't.

**Pillar 5 — Encryption and monitoring**
Data encrypted in transit and at rest, with continuous monitoring and independent security audits.

**Pillar 6 — Transparent grievance route**
If something goes wrong, the escalation path is published: our support desk, then our compliance officer, then SEBI SCORES and the Smart ODR portal.

**Honest note — keep this, do not soften it**
> Regulation protects how your assets are held. It does not protect you from market losses. Prices fall, and no broker can change that.

---

## 11. ThinqProfit Learn

**Eyebrow:** Learn
**Heading:** Understand the trade before you place it
**Subheading:** Free, open to everyone, and written in the language people actually use — no account required.

**Tracks**
- **First Steps** — What a demat account is, how settlement works, what you're actually buying
- **Reading the Market** — Charts, volumes, order types, and what moves a price
- **Derivatives, Carefully** — How F&O works, what margin means, and how positions go wrong
- **Funds & SIPs** — Direct versus regular, expense ratios, and why the difference compounds
- **Taxes** — STCG, LTCG, speculative income, and what your P&L statement means at filing time

**Formats:** Short articles · 3–5 minute videos · Interactive calculators · A glossary that doesn't define a term using the same term

**CTA:** Start learning — free
**Disclaimer:** Educational content only. Nothing in ThinqProfit Learn is investment advice or a recommendation to buy or sell any security.

---

## 12. Testimonials

> **TODO:** Every quote below is a placeholder written to show tone and length. Replace with real, consented, verifiable customer quotes. Do not publish invented testimonials, and do not publish any quote that states or implies a return figure — SEBI advertising rules and consumer protection law both apply.

**Heading:** What people actually say

**Quote 1**
> "I moved over because I was tired of guessing what a trade would cost. The contract note now matches the number the app showed me."
> — `[Name]`, `[City]` · Investing since `[YEAR]`

**Quote 2**
> "The option chain loads before I've finished deciding. That sounds small until you've used something that doesn't."
> — `[Name]`, `[City]` · F&O trader

**Quote 3**
> "I opened the account for the direct mutual funds and stayed for the tax report. Filing took an evening instead of a weekend."
> — `[Name]`, `[City]` · SIP investor

**Required line under the block**
> Individual experiences vary. Testimonials are not indicative of future performance or of any specific outcome.

---

## 13. Stats band

> **TODO:** publish only numbers you can substantiate on request. Delete any row you cannot evidence — an unverifiable stat is worse than a missing one.

| Value | Label |
|-------|-------|
| `[X lakh+]` | Accounts opened |
| `[₹X crore+]` | Daily turnover |
| `[X ms]` | Median order placement |
| `[X.X/5]` | Average app rating |
| `[99.X%]` | Platform uptime, last 12 months |

---

## 14. FAQ

**Heading:** Questions worth asking

**1. What do I need to open an account?**
PAN, an Aadhaar number linked to your mobile, bank account details, and a signature and photo. If your KYC is already registered, most of it is pre-filled.

**2. How long does account opening take?**
Usually `[X]` working hours after you finish eSign. Cases that need manual verification take longer, and we'll tell you when yours does.

**3. Is there a charge to open the account?**
Account opening is `[₹0]`. Annual demat maintenance is `[₹X]`, billed `[yearly]`.

**4. Where are my shares held?**
In a demat account in your own name with CDSL. We are the depository participant; the shares belong to you.

**5. What happens to my shares if ThinqProfit shuts down?**
They stay in your demat account with the depository, in your name. You can transfer them to another broker. Client funds are held in segregated client bank accounts as SEBI requires.

**6. Can I trade F&O as a beginner?**
You can, but consider whether you should. Derivatives are leveraged, losses can exceed the margin you post, and SEBI's own studies show most individual F&O traders lose money. Start with our derivatives course, then paper trade.

**7. Do you give buy or sell recommendations?**
`[Choose one and delete the other.]` **Option A:** No. We're an execution platform, not an advisor. **Option B:** Research is published only under our SEBI Research Analyst registration `[INH000XXXXXX]`, with disclosures attached to each report.

**8. Are mutual funds on ThinqProfit direct or regular?**
Direct plans only. We earn no distributor commission from your investment, which is why the expense ratio is lower.

**9. What charges apply besides brokerage?**
STT or CTT, exchange transaction charges, SEBI turnover fees, stamp duty, and GST — all levied at actuals and itemised on your contract note. See the [full rate card](#).

**10. Can I use my own trading systems?**
Yes. The API gives you REST and WebSocket access on the `[Pro]` plan, with published rate limits and documentation.

**11. How do I get my tax statements?**
Tax P&L, capital gains and ledger reports are downloadable from your account at any time, formatted for ITR filing.

**12. How do I raise a complaint?**
Start with support at `[support@thinqprofit.com]`. Unresolved issues escalate to our Compliance Officer at `[compliance@thinqprofit.com]`, and from there to SEBI's SCORES portal or the Smart ODR portal. All three routes are listed in the footer.

---

## 15. Support

**Heading:** Real people, published hours
**Subheading:** No charge to talk to us, and no phone tree designed to make you give up.

| Channel | Detail |
|---------|--------|
| In-app chat | `[Hours]`, trading days |
| Email | `[support@thinqprofit.com]` — replies within `[X]` hours |
| Phone | `[+91 XXXXX XXXXX]`, `[Hours]` |
| Help centre | Searchable articles for every screen in the app |
| Ticket status | Track any open request from your account |

**Escalation line**
> Not resolved? Write to our Compliance Officer, `[Name]`, at `[compliance@thinqprofit.com]` or `[phone]`.

---

## 16. Final CTA

**Heading:** Start with what you have today
**Subheading:** Free account opening, transparent pricing, and a platform that doesn't slow down when the market speeds up.

**Primary CTA:** Open free account
**Secondary CTA:** Talk to us first

**Support line**
> Free account opening · Aadhaar eKYC · `[X]`-hour activation

**Required disclosure directly beneath the CTA**
> Investments in the securities market are subject to market risk. Read all the related documents carefully before investing.

---

## 17. Footer

### 17.1 Brand block
`ThinqProfit`
> A SEBI-registered broker for Indian markets. Stocks, F&O, commodities, mutual funds and bonds in one account.

Social: X · LinkedIn · Instagram · YouTube · Telegram

### 17.2 Link columns

**Products**
Stocks & ETFs · Futures & Options · Intraday · Mutual Funds · IPO · Commodities · Currency · Bonds & G-Secs · MTF · Baskets · SIP

**Platform**
Mobile app · Web terminal · ThinqProfit Pro · Charts · Option chain · Screeners · Alerts · GTT orders · Paper trading · API docs · Status page

**Pricing**
Rate card · Brokerage calculator · Margin calculator · Account charges · Plans

**Learn**
Learn hub · Market digest · Glossary · Videos · Calculators · Webinars

**Company**
About us · Careers · Press · Blog · Partner with us · Contact

**Support**
Help centre · Raise a ticket · Contact us · Account opening status · Downloads & forms · Bulletins

**Legal**
Terms & conditions · Privacy policy · Risk disclosure · Policies & procedures · Rights & obligations · Do's and don'ts for investors · Refund policy · Cookie policy

**Regulatory**
Investor Charter · Investor grievances · Monthly complaint data · SEBI SCORES · Smart ODR portal · Investor awareness · Advisory for investors · Annual reports · Disclosures under SEBI regulations · Anti-money laundering policy

### 17.3 Registration block

> **TODO — fill every value with a verified number. Do not ship placeholder registrations.**

```
[ThinqProfit Securities Private Limited]
CIN: [U00000XX0000PTC000000]
Registered office: [Full address, City, State, PIN]

SEBI Registration (Stock Broker): [INZ000XXXXXX]
NSE Member Code: [XXXXX]  |  BSE Member Code: [XXXX]  |  MCX Member Code: [XXXXX]
CDSL Depository Participant ID: [IN-DP-XXX-XXXX]
AMFI Registration Number (Mutual Fund Distributor): [ARN-XXXXXX]
SEBI Research Analyst Registration: [INH000XXXXXX]

Compliance Officer: [Name] · [email] · [+91 XXXXX XXXXX]
Investor Grievances: [grievances@thinqprofit.com] · [+91 XXXXX XXXXX]
```

### 17.4 Statutory disclosures

**Standard market risk line (mandatory)**
> Investments in the securities market are subject to market risks. Read all the related documents carefully before investing.

**Derivatives risk disclosure**
> Trading in derivatives carries a high level of risk and is not suitable for every investor. Losses can exceed the margin deposited. SEBI's published studies on individual traders in the equity F&O segment report that a large majority incur net losses. `[Insert the exact current figure, study name and date — verify against SEBI's latest publication before publishing.]`

**No guaranteed returns**
> ThinqProfit does not offer, promise or guarantee any return on investment. Past performance is not indicative of future results. Any illustration on this site is hypothetical and provided for explanation only.

**Advisory boundary**
> Content on this website is for information and education. It does not constitute investment advice, a recommendation, or an offer to buy or sell any security. `[If research is published, add: Research reports are issued under SEBI Research Analyst registration INH000XXXXXX and carry their own disclosures.]`

### 17.5 Attention Investors block

Exchange-mandated notices. Verify the current text with your exchange circulars — the wording is prescribed and changes periodically.

> **Attention Investors**
>
> 1. Stock brokers can accept securities as margin from clients only by way of pledge in the depository system with effect from 1 September 2020.
> 2. Update your mobile number and email ID with your stock broker and depository participant. Receive information about your transactions directly from the exchange and depository on the same day.
> 3. Check your securities, mutual fund and other holdings in the consolidated account statement issued by NSDL and CDSL every month.
> 4. KYC is a one-time exercise while dealing in securities markets. Once KYC is done through a SEBI-registered intermediary, you need not repeat the process with another.
> 5. No need to issue cheques when subscribing to an IPO. Write your bank account number on the application form and authorise your bank to make the payment. Your funds stay in your own account until allotment.
> 6. Prevent unauthorised transactions in your account. Never share your login credentials, OTP or TPIN with anyone, including anyone claiming to be from ThinqProfit.
> 7. Beware of anyone promising assured or guaranteed returns in the securities market. We do not, and neither does anyone legitimate.

### 17.6 Grievance redressal ladder

> **How to escalate a complaint**
> 1. **Support** — `[support@thinqprofit.com]` or in-app chat
> 2. **Head of Customer Service** — `[name@thinqprofit.com]`
> 3. **Compliance Officer** — `[Name]`, `[compliance@thinqprofit.com]`, `[phone]`
> 4. **Exchange investor grievance cells** — NSE, BSE, MCX (links)
> 5. **SEBI SCORES** — `scores.sebi.gov.in`
> 6. **Smart ODR portal** — `smartodr.in`
>
> Monthly complaint data is published [here](#), as required by SEBI.

### 17.7 Bottom bar

> © `[YEAR]` `[ThinqProfit Securities Private Limited]`. All rights reserved.
> Terms · Privacy · Disclosures · Sitemap

---

## 18. Microcopy library

### 18.1 Lead capture form

| Element | Copy |
|---------|------|
| Field label | Mobile number |
| Placeholder | `+91 00000 00000` |
| Helper | We'll send a one-time password to verify it's you. |
| Button | Get OTP |
| Success | OTP sent. Check your messages. |
| Error — empty | Enter your mobile number. |
| Error — invalid | Enter a valid 10-digit Indian mobile number. |
| Error — rate limited | Too many attempts. Try again in `[X]` minutes. |
| Consent | By continuing you agree to our [Terms](#) and [Privacy Policy](#), and to receive account-related communication from ThinqProfit. |

### 18.2 Newsletter

| Element | Copy |
|---------|------|
| Heading | A five-minute read before the open |
| Body | Market digest, every trading day. No tips, no targets. |
| Placeholder | you@email.com |
| Button | Subscribe |
| Success | You're in. First issue lands tomorrow morning. |
| Error | Enter a valid email address. |

### 18.3 Cookie banner

> We use cookies to run the site, remember your preferences, and understand what's working. You can accept all, reject non-essential, or choose what you're comfortable with.
> Buttons: **Accept all** · **Reject non-essential** · **Manage preferences**

### 18.4 Loading and empty states

- Chart loading: `Loading market data…`
- Data unavailable: `Market data is temporarily unavailable. Prices shown may be delayed.`
- Market closed: `Markets are closed. Showing the last traded price from [DATE, TIME].`
- Search empty: `No results. Try a company name, ticker or ISIN.`

### 18.5 Buttons — canonical labels

Use these exact strings sitewide. One primary action per screen.

| Context | Label |
|---------|-------|
| Primary conversion | Open free account |
| Existing user | Log in |
| Product detail | Explore `[product]` |
| Education | Start learning — free |
| Pricing | See pricing |
| Demo | Take a product tour |
| Contact | Talk to us |

### 18.6 Accessibility

- Every image needs alt text; decorative visuals get `alt=""`
- Colour contrast at least 4.5:1 for body text — check the accent colour on dark backgrounds
- Do not signal profit or loss by colour alone; pair green/red with a sign or arrow
- All CTAs reachable and operable by keyboard, with a visible focus ring
- Announcement bar must be dismissible without a mouse

---

## 19. Voice & tone rules

**We sound like:** a competent friend who works in markets and refuses to oversell.

**Do**
- Lead with what the product does, then what it costs
- Use numbers only when they're verified and sourced
- Say "losses" when you mean losses
- Keep sentences short enough to read on a phone in sunlight
- Write "F&O" and "demat" — they're the words Indian traders use

**Don't**
- Promise, imply, or hint at returns
- Use "guaranteed", "assured", "risk-free", "sure shot", "multibagger"
- Frame trading as easy money, a game, or a lifestyle
- Use urgency mechanics — countdowns, "only 3 slots left" — on a financial product
- Compare against named competitors on this page
- Show a P&L screenshot with a large gain, even as an illustration

**Banned phrases:** guaranteed returns · assured profit · risk-free trading · double your money · become a crorepati · sure shot tips · beat the market every time

---

## 20. Design direction

Generated with the `ui-ux-pro-max` skill, then reconciled by hand. Full spec lives in two files:

- [design-system/thinqprofit/MASTER.md](../design-system/thinqprofit/MASTER.md) — raw skill output, global source of truth
- [design-system/thinqprofit/pages/landing.md](../design-system/thinqprofit/pages/landing.md) — **landing-page overrides, which win**

### Summary

| Dimension | Decision |
|-----------|----------|
| Style | Dark Mode (OLED) — dark is the brand mode, not a toggle |
| Landing pattern | Trust & Authority + Conversion (App-Store treatment confined to §9 Mobile app) |
| Typeface | Inter, 300–700, tabular numerals for all prices |
| Background / surface | `#0F172A` / `#1A2234` |
| CTA accent | Indigo `#4F46E5` |
| Gain / loss | `#22C55E` / `#EF4444` — **market data only** |
| Motion | Subtle tier, 150–300ms, transform and opacity only |
| Icons | Lucide, 1.5px stroke, single set |

### Four decisions that override the skill's raw output

1. **CTA is indigo, not green.** The skill proposed `#059669` as the accent. On a trading platform, green and red are semantically reserved for gain and loss — a green "Open free account" button sitting beside a green day-change number teaches the eye the wrong association. Indigo carries the brand action; green never leaves market data.
2. **Dark palette, not the light one shipped in MASTER.** The skill returned `Dark Mode (OLED)` as the style but a light `#F8FAFC` background alongside it. Resolved to the Fintech/Crypto dark set.
3. **Trust & Authority spine, not App Store Style.** A SEBI-registered broker converts on credibility first. The registration strip (§4) sits at position 4, directly after the hero — a visitor deciding where to keep their money asks "are you real" before "what do you cost". Safety (§10) is promoted above the mobile-app pitch for the same reason.
4. **No hover-lift on cards.** MASTER prescribes `translateY(-2px)`. Across an eight-card product grid that reads as jitter. Border and surface shift give the same affordance.

### Copy constraints the design imposes

- Product card body copy: **max 2 sentences, ~140 characters** — cards are fixed-height in a 3-up grid
- Nav mega-menu descriptions: **one line, ~48 characters**, they truncate below that width
- Hero headline: **max 6 words**, it renders at `clamp(2.25rem, 5vw, 3.75rem)`
- Section subheadings: **one sentence**, they sit in a `max-width: 42rem` centred block
- Every risk disclosure must be **live text at 4.5:1 contrast**, never baked into an image, never behind a blur

---

## Open questions for the team

1. **Legal entity name and all registration numbers** — needed for Sections 4, 17.3 and 17.4. Everything else is blocked on this.
2. **Which segments are actually live at launch?** Currency, commodities and bonds should be cut from the page if the registration isn't in place.
3. **Do you publish research?** Determines FAQ 7, the Baskets disclosure, and whether the RA registration appears at all.
4. **Final rate card** — Section 7 is entirely placeholder.
5. **Tiered plans or one flat rate?** If flat, delete the plan tiers and the Pro-only API line.
6. **Approved SEBI F&O statistic** — which study, which figure, which date. Do not guess.
7. **Real testimonials with written consent** — or Section 12 gets cut.
8. **Support hours and SLA** — Sections 15 and 18 reference them.
