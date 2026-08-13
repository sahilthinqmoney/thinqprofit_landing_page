---
doc: Thinq — Terms & Conditions and Consent Framework PRD
prd_id: THINQ-TNC-001
version: "1.13.0"
status: FINAL DRAFT
date: 2026-08-03
owner: Product + Compliance + Legal
feeds_from: THINQ-TNC-TEARDOWN-001 (competitor consent teardown)
aligns_with: THINQ-KYC-ONBOARDING-001 (§3 flow, §18.0 four unbundled consents), THINQ-SEBI-2FA-WEB-AUTH-001 (Activation)
---

# PRD — Thinq Terms & Conditions and Consent Framework

Authoritative spec for **every term, policy, disclosure, and consent** a Thinq user accepts across the broking KYC journey and platform use — **what** is presented, **when**, **how it is accepted**, **how it is stored/versioned**, and **how it is withdrawn**.

**Why this PRD.** The teardown (THINQ-TNC-TEARDOWN-001) showed the industry wraps ~20 artefacts into a single Aadhaar e-Sign OTP, buries cross-sell/third-party-data consents, and pre-ticks marketing. This PRD makes Thinq's consent model **unbundled, versioned, withdrawable, and audit-provable** — regulatory-complete without dark patterns.

**Design stance (four load-bearing rules):**
1. The SEBI/exchange/depository-mandated bundle stays in one AOF e-Sign (regulatorily correct) — **but the four fetch/processing/marketing consents are split out and captured discretely** at the welcome page.
2. **No pre-ticked consent. Ever.** Marketing is independently declinable without blocking onboarding.
3. **Every consent is a versioned, timestamped record** mapped to a named artefact; a version change forces re-consent.
4. **No message or checkbox may state or imply an expiry** unless something genuinely lapses (§10).

---

## 1. Goals & Non-Goals

**Goals.**
- Present the complete regulatory artefact set (SEBI Master Circular for Stock Brokers + Depositories, MITC mandatory since 1 Apr 2024) with lawful, provable acceptance.
- Unbundle processing / KRA-CKYC-fetch / DigiLocker-Aadhaar / marketing consents (DPDP-aligned).
- Make DDPI genuinely optional with a free e-DIS alternative; **do not offer POA**.
- Produce an immutable, versioned consent ledger usable in audit, dispute, and grievance redressal.

**Non-Goals.**
- Writing the legal prose of each artefact (Legal owns the text; this PRD owns the *framework*).
- Re-specifying the KYC step flow (owned by THINQ-KYC-ONBOARDING-001).
- PMS / advisory / research-analyst consents (out of scope for the broking-only product line).

---

## 2. Scope

**In scope.** Trading-account terms, demat/DP terms, statutory declarations, third-party fetch consents, marketing consent, product add-on terms (F&O, MTF, API, Account Aggregator), and platform Terms-of-Use / Privacy. Acceptance mechanics, storage, versioning, withdrawal, display/UX, audit.

**Out of scope.** Non-individual / HUF / NRI variants (future scope); PMS/IA/RA layers; corporate actions.

---

## 3. Consent Artefact Catalogue (authoritative)

Every artefact Thinq presents, its category, when it is shown, how it is accepted, and whether it is declinable. Acceptance modes: **eSign** (part of AOF Aadhaar e-Sign bundle) · **Acknowledge** (explicit tick/read receipt, no signature) · **Tick** (discrete checkbox) · **Opt** (opt-in/opt-out choice).

### 3.1 The Thinq consents — T&C / welcome page (Step 1)

**Model (per owner decision, D-7):** the three Required consents are shown as **statements** and are **accepted by proceeding** (tapping Continue) — they are **not** separate tick-to-proceed checkboxes. **Marketing is the only explicit control** on the page (an optional, declinable checkbox). Platform terms + the mobile PAN/bank fetch are covered by the **by-proceeding line** below. *(⚠ This qualifies D-5 "no pre-tick, discrete unbundled consent" — see the DPDP trade-off flagged in D-7 and open item T10.)*

| Code | Exact on-page copy | Category | Acceptance | Declinable? | Lawful basis (DPDP) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C-PROC** | "I consent to Thinq processing my information to open and provision my account." **(Required)** | Processing | **Accepted by proceeding** (statement) | No | Contract / legal obligation |
| **C-KRA** | "I consent to Thinq fetching my KRA / CKYC records." **(Required)** | Third-party fetch | **Accepted by proceeding** (statement) | No | Legal obligation (KYC) |
| **C-AADHAAR** | "I consent to Thinq fetching my Aadhaar details via DigiLocker." **(Required)** | Third-party fetch | **Accepted by proceeding** (statement) | No | Consent (Aadhaar Act + DPDP) |
| **C-MKTG** | "Send me marketing & promotional communications." | Marketing | **Accepted by proceeding** (statement) | **No — required at onboarding** *(owner decision v1.11.0; withdrawable post-onboarding, §8)* | Consent ⚠ **T21** |
| **C-PANBANK** | *(no named line)* — covered by the by-proceeding terms | Third-party fetch | **By-proceeding** | No | Contract / legal obligation |

**By-proceeding line (exact copy, no checkbox):**
> "By proceeding, you also agree to all **T&C**."

- THE SYSTEM SHALL render **"T&C"** in that line as a **hyperlink** that opens a single T&C page presenting **three tabs — Terms of Use · Privacy Policy · Tariff Rates** (one tab each). The **Tariff Rates** tab includes the brokerage & AMC charge disclosures. The page opens in-context (without losing the onboarding state).

- THE SYSTEM SHALL **NOT render any checkbox or "I accept" control for T&C / the Required consents / the platform terms** — there is no acceptance box. **Moving ahead IS the acceptance.**
- THE SYSTEM SHALL treat tapping the page's **Continue/Proceed** control as acceptance of the three Required consents (C-PROC, C-KRA, C-AADHAAR), the platform terms (U-TOU / U-PRIV / U-TAR + brokerage & AMC disclosures), and the **mobile-based PAN & bank fetch** (Setu Mobile-to-PAN / Mobile-to-Bank, C-PANBANK), and SHALL maintain the consent log (discrete, timestamped, versioned records) per §5–§6.
- THE SYSTEM SHALL render **C-MKTG unchecked by default** and SHALL allow the user to proceed with it declined, without blocking onboarding.
- THE SYSTEM SHALL still write a **discrete, timestamped consent record for each code** (including the by-proceeding ones), capturing that acceptance was via the proceed action and the exact copy/version shown (§5, §6).

### 3.2 Regulatory mandatory bundle — accepted in the AOF Aadhaar e-Sign (Step 11)

| Code | Artefact | Acceptance | Notes |
| :--- | :--- | :--- | :--- |
| T-AOF | Account Opening Form / KYC | eSign | Master record |
| T-RO | Rights & Obligations of Stock Broker, Authorised Person & Client (Equity + Derivatives) | eSign (deemed) | SEBI-prescribed, non-negotiable |
| T-RDD | Uniform Risk Disclosure Document | eSign (deemed) | — |
| T-DND | Guidance Note / Do's & Don'ts | Acknowledge | — |
| T-PP | Policies & Procedures | eSign (deemed) | Brokerage change, dormancy, penny stock, margin |
| T-TAR | Tariff / Brokerage schedule | eSign | Pricing |
| **T-MITC** | **Most Important Terms & Conditions (MITC)** | **Acknowledge** | **SEBI-mandated; new clients since 1 Apr 2024** |
| T-RAS | Running Account Settlement authorization | Opt | Monthly/quarterly settlement |
| T-ECN | Electronic Contract Note consent + email declaration | Tick | Copy drafted (§Appendix J). **Right to switch to physical at any time SHALL be stated**, and any physical-copy charge disclosed in the Tariff |
| **T-REGHIST** | **Regulatory history & connections declaration** — (a) any SEBI / exchange / statutory action or proceeding, taken or pending, in the **last 3 years**; (b) whether the applicant is a **director or employee of an exchange or its subsidiaries**, or **related to / associated with a member** of an exchange | eSign (declaration) | **[NEW v1.10.0 — was missing entirely.]** SEBI requires both on the trading account opening form and neither was catalogued. See T19 |
| T-FATCA | FATCA / CRS declaration | eSign | — |
| T-PMLA | PMLA / AML declaration | eSign | — |
| T-PEP | PEP declaration | eSign | Neutral framing downstream (§18 onboarding) |
| D-RO | Rights & Obligations of Beneficial Owner and DP (CDSL) | eSign (deemed) | Replaces old DP-Client agreement |
| D-TAR | DP Tariff | eSign | Demat charges |
| D-SMS | CDSL SMART / SMS-email alert consent | Tick | Transaction alerts |
| X-CHARTER | Investor Charter (Stock Broker + DP) | Acknowledge | Receipt |
| N-NOM | Nomination **or** Nomination opt-out (trading + demat) | Opt | Mandatory choice, both accounts |

### 3.3 Optional / conditional artefacts

| Code | Artefact | Acceptance | Condition |
| :--- | :--- | :--- | :--- |
| **O-DDPI** | DDPI (Demat Debit & Pledge Instruction) | **Opt-in eSign** | Optional; **e-DIS (TPIN+OTP) is the default alternative**; free at onboarding; **POA NOT offered** |
| O-FNO | F&O segment activation declaration + income proof | Tick + upload | Only if a derivatives segment selected |
| O-MTF | Margin Trading Facility — Rights & Obligations | eSign (deemed) | Only if MTF activated |
| O-API | API / algo terms | Tick | Only if API access requested |
| O-AA | Account Aggregator consent | Opt (AA flow) | Only for F&O income fetch |

### 3.4 Platform Terms-of-Use (context: using the app/web, distinct from KYC)

| Code | Artefact | Acceptance | Notes |
| :--- | :--- | :--- | :--- |
| U-TOU | Terms of Use / Terms & Conditions | **By-proceeding clickwrap** (reg + login first screen) | Licence, restrictions, liability, IP, termination, jurisdiction |
| U-PRIV | Privacy Policy (DPDP) | **By-proceeding clickwrap** | Collection, sharing, retention, cookies |
| U-TAR | Tariff Rates (T&C-page tab; includes brokerage & AMC charge disclosures) | **By-proceeding clickwrap** | One of the three tabs behind the "T&C" link; full tariff also in the AOF bundle (T-TAR) |
| U-REF | Referral T&C | Tick | Only if referral used |
| U-DISC | Advertisement / research disclaimers | Acknowledge | Displayed with content |
| U-COOKIE | Cookie / tracking consent | Opt | Web; granular |

---

## 3.5 Drafting register — what exists, what does not  **[NEW v1.7.0]**

*Reason: §3.1–3.4 catalogue 23 artefacts and specify how each is **accepted, versioned and recorded**. That is not the same as having them written. Only **one** artefact in this document has drafted text. Without this register the catalogue reads as coverage.*

**Adopt, do not author** — prescribed by SEBI, the exchanges or CDSL; Thinq reproduces the standard text and cannot vary it.

| Artefact | Source |
| :--- | :--- |
| T-RO · T-RDD · T-DND | Exchange/SEBI uniform documents |
| **T-MITC** | SEBI-prescribed format (mandatory for clients since 1 Apr 2024) |
| D-RO | CDSL BO–DP Rights & Obligations |
| X-CHARTER | SEBI Investor Charter (broker + DP) |
| T-FATCA · T-PMLA · T-PEP · T-RAS · T-ECN · N-NOM · D-SMS | Standard declaration/consent formats |

**Thinq must author** — nine documents, of which one is drafted.

| Artefact | Status |
| :--- | :--- |
| **U-TOU** Terms of Use | ✅ **Drafted** — Appendix A, pending Legal |
| **U-PRIV** Privacy Policy (DPDP) | ❌ **Not started — the critical gap.** See below |
| U-TAR Tariff Rates *(incl. brokerage + AMC disclosures)* | ❌ Not started |
| T-TAR Brokerage schedule · D-TAR DP tariff | ❌ Not started |
| T-PP Policies & Procedures *(brokerage change, dormancy, penny stock, margin)* | ❌ Not started |
| U-REF Referral T&C | ❌ Not started *(only if referral ships)* |
| U-DISC Advertisement / research disclaimers | ❌ Not started |
| U-COOKIE Cookie / tracking consent | ❌ Not started *(web)* |

🚫 **The Privacy Policy is the one that blocks, and it is absent.** Three of the four welcome-page consents (C-PROC, C-KRA, C-AADHAAR) and the by-proceeding clickwrap all name it as the document governing how data is collected, shared and retained — **and it does not exist**. Consequences, in order of severity:

- **The consents point at nothing.** A customer accepting *"I consent to Thinq processing my information"* is accepting terms that have not been written. DPDP requires the notice to state purpose, retention and recipients **before** consent.
- **It is the document that must name — or deliberately not name — the vendors.** §10 forbids naming Digio/Signzy/Setu in customer-facing text, but a DPDP notice must disclose **categories of recipients** and cross-border transfers. That tension is resolved in the Privacy Policy or nowhere.
- **It owns the retention window** that onboarding **C6** parks at a 30-day default. The number lives here.
- **It owns the DPDP rights** — access, correction, erasure, grievance, consent-manager — none of which appear in any Thinq document today. §8's withdrawal rules cover marketing consent only.

**T14 (P0)** — commission the Privacy Policy. Everything above depends on it, and no other artefact in this register is on the critical path in the same way.

## 4. Presentation & Unbundling Requirements (EARS)

- WHEN a prospect reaches the T&C / welcome page (Step 1), THE SYSTEM SHALL present the three Required consents (C-PROC, C-KRA, C-AADHAAR) as **plain-language statements** with their exact copy (§3.1), the marketing consent (C-MKTG) as the **only explicit checkbox** (optional, declinable), and the **by-proceeding line** (§3.1 exact copy) covering platform terms + brokerage & AMC disclosures + mobile PAN/bank fetch.
- THE SYSTEM SHALL treat tapping **Continue/Proceed** as acceptance of the three Required consents, the platform terms, and the mobile PAN/bank fetch; the three Required consents are **accepted-by-proceeding** (D-7), not separate tick-gates.
- THE SYSTEM SHALL render **C-MKTG unchecked by default** and SHALL allow the prospect to proceed with C-MKTG declined; declining C-MKTG SHALL NOT block onboarding or degrade the journey.
- THE SYSTEM SHALL NOT **pre-tick** the marketing checkbox and SHALL NOT bundle marketing into the proceed action (marketing is never accepted-by-proceeding).
- *(v1.11.0)* **THE SYSTEM SHALL present C-MKTG as a required statement accepted by proceeding**, per owner decision T21. THE SYSTEM SHALL nonetheless present it as its **own named line** — not folded silently into the by-proceeding bundle — so the customer sees what they are agreeing to, and SHALL surface the withdrawal control prominently after activation.
- THE SYSTEM SHALL write a discrete, timestamped, versioned consent record for **every** code on the page — the accepted-by-proceeding ones (C-PROC/C-KRA/C-AADHAAR/C-PANBANK + platform terms) tagged as `channel = proceed`, and C-MKTG as `channel = checkbox`.
- WHEN the AOF is generated (Step 10) and e-Signed (Step 11), THE SYSTEM SHALL bind the regulatory bundle (§3.2) to that single Aadhaar e-Sign transaction AND SHALL record each artefact code + version individually against the e-Sign transaction ID.
- THE SYSTEM SHALL present **T-MITC as an acknowledge (read-receipt) artefact**, not a signature, and SHALL record the acknowledgement separately from the e-Sign.
- THE SYSTEM SHALL render the T-MITC acknowledgement (at onboarding S7) with the **exact label**: **"I accept the SEBI Most Important Terms & Conditions. Running account settlement every 90 days."**, where the word **"Conditions"** is a **hyperlink** opening the full MITC document in-context. *(⚠ The onboarding S7 renders this control pre-checked; that conflicts with D-5 "no pre-ticked consent" — open item T1/Compliance to resolve pre-check vs affirmative-tick.)*
- THE SYSTEM SHALL present **O-DDPI as opt-in**, defaulting to **e-DIS**, and SHALL NEVER present POA as an option.
- THE SYSTEM SHALL surface conditional artefacts (§3.3) **only** when their condition is met (e.g. O-FNO only when a derivatives segment is selected).
- THE SYSTEM SHALL map **every** artefact to exactly one named consent record and SHALL refuse any downstream action (fetch, send, provision) whose governing consent is absent or withdrawn.

## 5. Acceptance Mechanics (EARS)

- WHEN any consent is accepted, THE SYSTEM SHALL capture: artefact code, artefact **version**, acceptance mode, accepted-boolean, UTC timestamp, IP address, device fingerprint, channel, and (for eSign artefacts) the **e-Sign transaction ID + document hash**.
- THE SYSTEM SHALL render every artefact's full text (or an in-context link that opens it without leaving the flow) **before** its control can be actioned.
- THE SYSTEM SHALL NOT accept a consent on the user's behalf, infer it from inaction, or carry a prior session's consent forward across an artefact version change.
- WHEN acceptance uses Aadhaar e-Sign, THE SYSTEM SHALL treat the signed PDF hash as the tamper-evident proof and store it immutably.

## 6. Storage, Versioning & Audit (EARS)

- THE SYSTEM SHALL store every consent as an **append-only, immutable record**; corrections SHALL be new records, never overwrites.
- THE SYSTEM SHALL pin each acceptance to the **exact artefact version** in force at acceptance time and SHALL retain every historical version of every artefact.
- WHEN an artefact's version changes materially, THE SYSTEM SHALL flag affected users for **re-consent** and SHALL NOT treat the prior-version acceptance as covering the new version.
- THE SYSTEM SHALL retain consent records for the regulatory **audit window (8 years)**, aligned with the Panel + auth PRDs.
- THE SYSTEM SHALL retain, then **auto-delete under the DPDP retention job**, the PAN/Aadhaar-reference/bank data of **abandoned** applications per the retention window (§10 onboarding PRD), while preserving the consent-event ledger.
- THE SYSTEM SHALL expose a per-user **consent history view** (artefact, version, timestamp, status) to Compliance and to the user on request.

## 7. Display & UX Requirements (EARS)

- THE SYSTEM SHALL write every consent label in plain language, SHALL avoid legalese in the control text, and SHALL link the full artefact for detail.
- THE SYSTEM SHALL NOT use dark patterns: no visually-suppressed decline, no confirm-shaming copy, no bundling of a declinable consent with a mandatory one.
- THE SYSTEM SHALL NOT state or imply an expiry on any artefact or consent **unless** something genuinely lapses — permitted only for **eSign session, AA consent validity, KRA data currency** — and SHALL verify the lapse is real before rendering expiry copy.
- THE SYSTEM SHALL support regional-language rendering of the SEBI client-registration set (Rights & Obligations, RDD, Do's & Don'ts) consistent with the exchange 14-language mandate. *(Assumption — confirm launch language set in open items.)*
- THE SYSTEM SHALL meet the onboarding PRD's accessibility bar (keyboard-operable, labelled controls, no state-by-colour-alone).

## 8. Withdrawal & Re-Consent (EARS)

- THE SYSTEM SHALL allow withdrawal of **C-MKTG (marketing)** at any time via a self-service control, effective in real time (< 60s), and SHALL suppress all marketing sends on withdrawal (aligns with onboarding §18.4 suppression).
- WHEN a user withdraws a consent that is legally required to hold the account (e.g. C-PROC), THE SYSTEM SHALL explain that withdrawal triggers account-closure/off-boarding rather than silently continuing, and SHALL route it to the closure flow.
- THE SYSTEM SHALL allow revocation of **O-DDPI** in writing/e-Sign, effective prospectively (not retroactive to instructions already acted on).
- WHEN a user re-consents to a new artefact version, THE SYSTEM SHALL write a new record and retain the prior one.

## 9. Mapping to the Onboarding Flow

| Onboarding step (§3) | Consents captured |
| :--- | :--- |
| Registration / Login **first screen** | **By-proceeding clickwrap**: "By proceeding, I agree to **T&C**, **Privacy Policy** & **Tariff Rates**" (U-TOU, U-PRIV, U-TAR hyperlinked) (+ U-COOKIE on web) |
| **Step 1 Welcome** | **C-PROC, C-KRA, C-AADHAAR, C-MKTG** (the four unbundled) |
| Step 6 DigiLocker | governed by C-AADHAAR |
| Step 9 Segments / F&O | O-FNO, O-AA (if F&O) |
| Step 10 AOF Generation | regulatory bundle assembled (§3.2) |
| **Step 11 Aadhaar e-Sign** | **T-* / D-* bundle eSigned; T-MITC acknowledged; O-DDPI opt-in; N-NOM chosen** |
| Step 13 Nominee | N-NOM (nominee section, own e-Sign) |

## 10. Compliance Constraints (must hold)

- **No competitor or vendor brand name in customer-facing legal text.** Permitted names are limited to SEBI, the exchanges, the depositories, DigiLocker/UIDAI and the KRA/CERSAI bodies. KYC vendors (Digio, Signzy, Setu, successors) SHALL be referred to only as a *"Govt.-approved partner"*, matching the onboarding journey's own wording. Applies to Terms, Privacy Policy, Tariff and every consent string. *(v1.4.0 — Appendix A previously carried 12 inline `(source: <broker>)` attributions inside the clause text.)*

- **MITC** SHALL be present and acknowledged for every new client (SEBI, since 1 Apr 2024).
- **DPDP Act 2023**: purpose-limited, unbundled consent; withdrawal; retention + deletion; consent ledger.
- **No POA** — DDPI-optional with e-DIS default (SEBI Oct-2022 direction; onboarding §9).
- **Sanctions / EDD** framing rules inherited from onboarding §18.0 (no-reason sanctions, neutral EDD).
- **WhatsApp Utility/Marketing** classification (onboarding §18.0) governs any consent-confirmation messaging; a marketing-consent confirmation is Utility only if it is a receipt, Marketing otherwise — classify with the BSP before build.
- **Signature** is a fraud-signal-not-auto-reject; not cited as PAN-signature mismatch (onboarding §18.0).

## 11. Consent Record — Data Model (representative)

```
ConsentRecord {
  consent_id            // uuid, immutable
  applicant_id
  artefact_code         // e.g. C-MKTG, T-MITC, O-DDPI
  artefact_version      // pinned at acceptance
  category              // processing | fetch | marketing | regulatory | platform | product
  acceptance_mode       // esign | acknowledge | tick | opt
  accepted              // bool
  lawful_basis          // contract | legal_obligation | consent
  declinable            // bool
  timestamp_utc
  ip_address
  device_fingerprint
  channel               // web | app | esign
  esign_txn_id          // nullable; for eSign bundle
  document_hash         // nullable; tamper-evident proof
  withdrawn             // bool
  withdrawal_timestamp  // nullable
  supersedes            // nullable consent_id (version chain)
}
```

## 12. Non-Functional Requirements

- **Immutability & integrity.** Append-only ledger; hash-chained or WORM storage for the consent log.
- **Latency.** Consent write < 1s; withdrawal effect < 60s across all channels.
- **Availability.** Consent capture SHALL NOT hard-fail the journey on a transient store error; queue-and-confirm with idempotency.
- **Security & privacy.** Aadhaar masked to last-4; artefact PII encrypted at rest; access-logged.
- **Auditability.** Every record reconstructable to the exact artefact text + version shown to the user.

## 13. Acceptance Criteria (representative, EARS)

- WHEN a prospect declines C-MKTG, THE SYSTEM SHALL complete onboarding normally AND SHALL send zero marketing communications.
- WHEN a prospect declines C-MKTG, THE SYSTEM SHALL continue to send **every drop-off, lifecycle and ops communication in onboarding §18** — all are classified `Utility` and **none may be gated on, or suppressed by, marketing consent**. *(Added v1.3.0 to close a gap the split creates: making C-MKTG independently declinable is only safe if declining it cannot cost the customer their activation notice, their rejection notice or their Client Master Report. Onboarding §18.0.)*
- WHERE the BSP or Meta reclassifies a §18 template as `Marketing`, THE SYSTEM SHALL treat that as a **defect in the template** and rewrite it, and SHALL NOT re-submit it under the Marketing category — which would silently make that message conditional on C-MKTG.
- WHEN a prospect proceeds past the welcome page, THE SYSTEM SHALL have four discrete consent records (C-PROC, C-KRA, C-AADHAAR, C-MKTG) with individual timestamps.
- WHEN the AOF is e-Signed, THE SYSTEM SHALL have one consent record per regulatory artefact, each pinned to its version and the e-Sign transaction ID.
- WHEN an artefact version changes, THE SYSTEM SHALL NOT treat any prior acceptance as covering the new version.
- THE SYSTEM SHALL present DDPI as opt-in with e-DIS default AND SHALL never render a POA option.
- THE SYSTEM SHALL allow marketing-consent withdrawal to take effect in < 60 seconds.

## 14. Open Items (owner · priority)

| # | Item | Assumption | Owner | Priority |
| :--- | :--- | :--- | :--- | :--- |
| T1 | Exact **MITC template version** to adopt + acknowledge-copy | Latest SEBI standard | Compliance + Legal | P0 |
| T2 | **DPDP retention window** for abandoned-app PII + deletion job | 30 days (per onboarding §10) | Legal + Eng | P0 |
| T3 | **Regional-language launch set** for the client-registration docs | Exchange 14-language mandate | Compliance | P1 |
| T4 | **Material-change threshold** that triggers re-consent per artefact | Any material change | Legal | P1 |
| T5 | **MTF / API terms** in launch scope or fast-follow | Fast-follow | Product | P2 |
| T6 | **Consent-confirmation messaging** Utility vs Marketing classification with BSP | Receipt = Utility | Growth + Compliance | P0 |
| T7 | **Account-closure flow** on withdrawal of a required consent (C-PROC) | Route to off-boarding | Product + Ops | P1 |
| T8 | **WORM / hash-chain** choice for the immutable consent ledger | Hash-chained append-only | Eng | P1 |
| T10 | **DPDP/Aadhaar validity of accepted-by-proceeding Required consents (D-7)** — confirm that capturing the processing / KRA-CKYC / Aadhaar-DigiLocker consents by-proceeding (not explicit tick) satisfies DPDP purpose-limitation + Aadhaar-Act affirmative consent; if not, promote the Aadhaar consent to an explicit tick (Hybrid). | Accepted-by-proceeding per owner D-7 | Legal + Compliance | P0 |
| T9 | **Appendix A Thinq Terms of Use** — **entity details filled v1.6.0** (legal entity, registered office, CIN, GSTIN, SEBI/DP registrations, memberships, Mumbai jurisdiction); no placeholders remain in the clause text. Outstanding: **Legal review and confirmation that the drafting is Thinq's own**, not substantially similar to any published source. | Entity resolved; drafting originality unconfirmed | Legal | P0 |
| T14 | **Privacy Policy (U-PRIV) does not exist.** Three welcome-page consents and the by-proceeding clickwrap all reference it. It owns the DPDP notice (purpose, retention, recipients), the **vendor-disclosure** question §10 defers, the **retention window** onboarding C6 parks at 30 days, and the DPDP data-subject rights — none of which appear in any Thinq document. Nothing in §3.5's register is on the critical path in the same way. | Absent; consents reference it | Legal + Product | **P0** |
| T15 | **Seven further Thinq-authored artefacts unwritten** — Tariff (U-TAR/T-TAR/D-TAR), Policies & Procedures (T-PP), referral T&C, ad/research disclaimers, cookie consent. Tariff and P&P are needed for the AOF e-Sign bundle; the rest gate specific features. | See §3.5 register | Legal + Product | P1 |
| T19 | **The regulatory-history declaration was absent from the artefact catalogue.** SEBI's trading account opening form requires disclosure of (a) any action or proceeding by SEBI, an exchange or any statutory authority in the last three years, and (b) whether the applicant is a director/employee of an exchange or its subsidiaries, or related to/associated with an exchange member. Neither appeared in §3.2's 17 artefacts or anywhere in the onboarding PRD — so the flow collects neither. Added as **T-REGHIST**; the journey needs the fields, the AOF needs the clauses, and ops needs a review path for a "yes". | Now catalogued; not built | Compliance + Product | **P0** |
| T20 | **Construct T-REGHIST as a disclosure, not a confirmation.** The market pattern is a single tick — *"I confirm no action has been taken against me and I am not related to any exchange member."* That leaves an applicant who **is** related, or who **does** have a past proceeding, with no truthful path: they lie or they abandon. **Neither answer is disqualifying** — a connection is common and merely reportable, and a past proceeding is assessed on its facts. Build it as **yes/no with a details field on yes**, routed to ops review. Fifth instance of the invisible-population pattern (onboarding C18, C20, C22, C27, C35). | Disclosure construction recommended | Product + Compliance | P1 |
| T21 | **Marketing consent made Required at onboarding — owner decision, taken against advice.** Recorded so the trade-off is visible rather than inferred. **DPDP §6 requires consent to be free, specific, informed and unconditional**, and conditioning account opening on marketing consent is the pattern that requirement exists to prevent. It also reverses **D-5**, which was written expressly to counter the bundling seen in the market teardown. **Mitigation in place:** §8's self-service withdrawal survives — a customer can turn marketing off within 60 seconds of activation, so the consent is required to *open* but not to *keep*. Legal SHALL assess whether that mitigation is sufficient before publication. | Required at onboarding; withdrawable after | **Owner decision** — Legal to assess | **P0** |
| T16 | **Vendor disclosure — DPDP notice vs §10's no-vendor-names rule.** B.4 discloses *categories* of recipients, which DPDP requires and §10 permits. Confirm that category-level disclosure satisfies DPDP §5 notice, and that no cross-border transfer forces a named disclosure. If it does, §10's rule needs a carve-out for the Privacy Policy alone. | Category-level disclosure assumed sufficient | Legal | **P0** |
| T17 | **Retention periods set** *(owner, v1.13.0)*: **8 years** statutory for KYC and transaction records; **30 days** for abandoned applications. The second is onboarding **C6** — the number is now fixed, and **the deletion job must be built to honour it**. That job does not exist. | 8y / 30d confirmed | Eng | P1 |
| T18 | **Officers, addresses and response times all resolved** *(owner, v1.13.0)*. Manoj T. Mahamunkar is Grievance Officer, Compliance Officer **and DPO**; support/complaints/bogrievances/ig addresses live; SLAs confirmed at **T+1 working day** for support and **7 working days** at each escalation level. ⚠ **One person holding all three roles is normal at this size but is a single point of failure** — confirm a documented deputy for leave and escalation. | Resolved; deputy undefined | Compliance | P2 |

---

## Decision Log

- **D-1** Split the four fetch/processing/marketing consents out of the AOF e-Sign into discrete welcome-page controls. *Rationale: teardown showed the industry bundles ~20 artefacts under one OTP; DPDP wants purpose-limited, unbundled, withdrawable consent.*
- **D-2** Keep the SEBI/exchange/depository mandatory bundle inside one Aadhaar e-Sign, but record each artefact code + version individually against the transaction. *Rationale: regulatorily correct and operationally simple, without losing per-artefact provability.*
- **D-3** MITC is acknowledge-only, not a signature. *Rationale: SEBI defines MITC as a disclosure to be informed of, standardised across brokers.*
- **D-4** DDPI opt-in with e-DIS default; POA not offered. *Rationale: SEBI Oct-2022 direction; onboarding §9; avoids the legacy over-authorization risk POA carried.*
- **D-5** *(amended v1.11.0)* No pre-ticked consent. **Marketing is now Required at onboarding** per owner decision T21, reversing the "independently declinable" half of this decision; the no-pre-tick half stands, and withdrawal remains self-service and immediate (§8). Original rationale retained below because it explains what the change gives up. *Rationale: counters the pre-tick/bundling pattern (Groww group-sharing, Dhan-Equifax) flagged in the teardown.*
- **D-6** Immutable, version-pinned consent ledger with forced re-consent on version change. *Rationale: audit, dispute, and DPDP defensibility.*
- **D-7** On the T&C page, the three Required consents (processing, KRA/CKYC fetch, Aadhaar/DigiLocker) are shown as statements and **accepted-by-proceeding**; **marketing is the only explicit checkbox** (optional, declinable); platform terms + brokerage & AMC disclosures + the **mobile PAN/bank fetch** are covered by the by-proceeding line. *Rationale: owner decision for a low-friction single-action page. **Qualifies D-5** — the Required consents are no longer discrete tick-gates. **⚠ DPDP/Aadhaar trade-off:** an Aadhaar/KRA fetch consent captured by-proceeding is weaker than an explicit affirmative tick; Legal/Compliance must confirm this satisfies DPDP purpose-limitation and Aadhaar-Act consent (open item T10). Discrete per-code consent records are still written, so provability is retained even though capture is by-proceeding.*

---

## Appendix A — Thinq Terms of Use (Adapted Draft, Legal review required)  **[NEW]**

> **⚠ INTERNAL DRAFT — NOT legal advice, and NOT publishable in this form.** This appendix is a **coverage-checked starting draft for Legal**, synthesised from the clause structure common to Indian broker Terms pages. It exists so Legal starts from a complete outline rather than a blank page. **Legal SHALL rewrite, not merely approve.**

**THE FOLLOWING SHALL HOLD BEFORE ANY PART OF THIS APPENDIX REACHES A CUSTOMER.** Each is a publication gate, not a preference.

- **No third-party brand name SHALL appear in any Thinq customer-facing legal document** — Terms of Use, Privacy Policy, Tariff, consent copy — **except** where naming is legally required or factually unavoidable: **SEBI**, the **exchanges** (NSE/BSE/MCX), the **depositories** (NSDL/CDSL), **DigiLocker/UIDAI**, and the **KRA/CERSAI** bodies. Competitor names SHALL NOT appear anywhere, in any form, including provenance notes, comments, or tracked changes. *(The per-clause `(source: …)` attributions that previously sat inline in A.1–A.13 have been moved to the internal-only table below — v1.4.0. Inline, they would have travelled with the text into a CMS.)*
- **No KYC/verification vendor SHALL be named in customer-facing text.** Digio, Signzy, Setu and any successor are commercial arrangements, not disclosures the customer needs, and naming one binds Thinq's copy to a contract it may change. The onboarding journey already uses the correct formulation — *"fetched from a Govt.-approved partner"* — and legal documents SHALL match it.
- **No `[bracketed placeholder]` SHALL survive publication.** Outstanding: legal entity, SEBI registration number, DP ID, registered office and jurisdiction city, and the variation-notice period in A.12.
- **THE SYSTEM SHALL NOT publish this appendix until Legal has confirmed the drafting is Thinq's own.** Synthesising from three sources reduces but does not remove substantial-similarity risk, and another broker's Terms are their copyrighted work. This is a legal sign-off, not an editorial one (T10).

**Entity details — authoritative.**  *[v1.6.0 — supplied by the owner; supersedes all placeholders.]* **Thinq** is the brand and product name; **Money Logix Securities Private Limited** is the legal entity. Customer-facing surfaces use *Thinq*; anything that must identify the contracting or regulated entity — Terms, Privacy Policy, AOF, CMR, contract notes, invoices, statutory footers — uses the legal name, with *Thinq* usable alongside it as the brand.

| Field | Value |
| :--- | :--- |
| Brand / platform | **Thinq** ("Thinq Platform" — web + app) |
| Legal entity | **Money Logix Securities Private Limited** |
| Registered office | Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai 400 050 |
| CIN | U64990MH2006PTC165522 |
| GSTIN | 27AAECM8621N1Z0 |
| SEBI Stock Broker Reg. No. | **INZ000235531** |
| Exchange memberships | **NSE (12971) · BSE (3246)** |
| Depository | **CDSL** *(only — no NSDL DP)* |
| DP ID | **12063900** |
| SEBI DP Reg. No. | **IN-DP-22-2015** |
| Jurisdiction | Courts at **Mumbai**, India |

✅ **Every value above was supplied by the owner. Nothing else is assumed.** No email address, domain, phone number, officer name, website URL, brokerage rate or charge appears anywhere in this PRD as fact — each is an explicit **[TBD]** placeholder. *(v1.9.0: six `@thinq.in` addresses drafted into Appendices B and E were removed for this reason — even bracketed, they asserted a domain that was never given.)*

🚫 **Two limits this table sets, which the rest of the product does not yet reflect:**
- **There is no MCX membership**, so **commodity trading cannot be offered.** The onboarding flow currently presents *Commodity* as a selectable segment and gates it behind income proof. See onboarding open item **C54 (P0)**.
- **There is no NSDL DP.** Every demat account is a **CDSL** account under DP ID 12063900, so BO IDs are 16 digits beginning `12063900`. Documents offering a depository choice, or naming NSDL as Thinq's depository, are wrong. *(NSDL remains correct where it refers to **PAN verification** — a separate NSDL role.)*

### A.1 Acceptance of Terms
Your access to or use of the Thinq Platform, its services and products constitutes Your consent to these Terms of Use, the Privacy Policy, and the Tariff Rates. If You do not agree, do not use the Thinq Platform.

### A.2 Eligibility
By accepting these Terms, You represent that You are **18 years of age or older**, are of legal age to form a binding contract, are competent to contract under applicable law, and are **not debarred by SEBI or any statutory authority** from dealing in the securities market.

### A.3 Licence to Use
Thinq grants You a **limited, non-exclusive, non-transferable, revocable, royalty-free** right to access, view and use the Thinq Platform **solely** for carrying out Your own online trades, transactions, and availing Thinq's services in accordance with these Terms and applicable law.

### A.4 Restrictions / Prohibited Use
You SHALL NOT copy, reproduce, sell, sublicense, redistribute, publish, database, display, modify, transmit, license, create derivatives from, or otherwise exploit any part of the Thinq Platform or its content; SHALL NOT data-mine, scrape, or harvest personal information without permission; SHALL NOT interfere with, damage, or overload the Platform or networks, attempt unauthorised access (hacking, password mining, illegitimate means), transmit unlawful content, or use the Platform for advertising/marketing without Thinq's consent.

### A.5 User Obligations & Account Security
*(synthesised)* — You are responsible for maintaining the confidentiality of Your credentials (PIN, passkey, OTP) and for all activity under Your account. You agree to provide accurate KYC information and to comply with SEBI, exchange, and depository regulations. *(Ties to THINQ-SEBI-2FA-WEB-AUTH-001.)*

### A.6 Intellectual Property Rights
Other than content You own, Thinq and/or its licensors own all intellectual property and materials on the Thinq Platform; the design, structure, selection, and arrangement of content are protected by copyright, patent, and trademark laws. Nothing on the Platform grants any licence or right to use any Thinq trade mark.

### A.7 Disclaimer
The Thinq Platform and services are provided on an **"as is" and "as available"** basis, without warranty of any kind, express or implied. Thinq, its licensors and affiliates make no warranty that the Platform will meet Your requirements or be uninterrupted, timely, secure, or error-free. Market data and information may not always be current.

### A.8 Limitation of Liability
To the maximum extent permitted by law, in no event shall Thinq, its affiliates, officers, directors, employees, agents, or licensors be liable for any **direct, indirect, incidental, special, consequential, punitive, or exemplary** damages arising out of or connected with Your use of or inability to use the Thinq Platform.

### A.9 Indemnification
You agree to indemnify and hold harmless Thinq, its group entities, affiliates, directors, and employees from any losses, damages, penalties, claims, costs, and demands (including reasonable legal costs) arising out of Your misuse of the services, breach of these Terms, breach of representations, misconduct, or unlawful disclosure of information.

### A.10 Termination / Suspension
Thinq may, in its sole discretion, restrict, suspend, cancel, or terminate Your access to the Thinq Platform (in whole or part) if Thinq considers that You have breached these Terms or any applicable law, subject to regulatory obligations on client off-boarding and settlement of dues.

### A.11 Force Majeure
Thinq shall not be liable for any failure or delay in performance caused by events beyond its reasonable control, including system unavailability, security breaches, sabotage, natural disasters, strikes, war, hacking, or hardware/computer failures.

### A.12 Variation of Terms
Thinq may revise these Terms. Thinq will **notify You of any change before it takes effect**, and Your continued use of the Thinq Platform after that date constitutes acceptance of the revised Terms. **Where a change is material — including any change to what You have consented to — Thinq will ask You to accept it again**, and will not rely on Your continued use alone.

*Drafting note (v1.5.0): the deemed-accepted-after-24-hours mechanic has been **removed**. It was the market pattern rather than a necessity — the clause only needs to establish that Terms can change and how acceptance works, and notice-plus-continued-use does that. Dropping it removes an aggressive term from a consumer financial contract, eliminates the last discretionary `[bracket]` in this appendix, and makes A.12 agree with §8's material-change re-consent rule instead of contradicting it (closes T9's second limb).*

### A.13 Governing Law & Jurisdiction
These Terms shall be governed by and construed in accordance with the laws of India, and disputes shall be subject to the **exclusive jurisdiction of the competent courts at Mumbai, India**, and to arbitration under the Arbitration and Conciliation Act, 1996 where applicable.

### A.14 Read-with documents
These Terms of Use SHALL be read with the **Thinq Privacy Policy**, the **Tariff Rates**, the SEBI-mandated client-registration documents (Rights & Obligations, RDD, Do's & Don'ts, MITC — §3.2), and the Depository (BO–DP) terms. The by-proceeding clickwrap on the registration/login first screen (auth D-32) governs acceptance of A-Terms + Privacy + Tariff.

**Statutory identification.** Every customer-facing surface carrying these Terms SHALL identify the contracting entity in full: **Money Logix Securities Private Limited** ("Thinq"), Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai 400 050 · CIN U64990MH2006PTC165522 · GSTIN 27AAECM8621N1Z0 · **SEBI Stock Broker Reg. No. INZ000235531** · Member: **NSE 12971**, **BSE 3246** · Depository Participant: **CDSL**, DP ID **12063900**, **SEBI DP Reg. No. IN-DP-22-2015**.

---

## Appendix B — Thinq Privacy Policy (DPDP)  **[NEW v1.8.0]**

> **⚠ INTERNAL DRAFT — Legal review required before publication.** Written to the Digital Personal Data Protection Act, 2023 and the SEBI/KYC obligations this product already carries. Placeholders in **[brackets]** need Thinq's own values. **This is the document three welcome-page consents point at, so it cannot ship after them.**

**B.1 Who we are.** **Money Logix Securities Private Limited** ("Thinq", "we") — Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai 400 050. CIN U64990MH2006PTC165522. SEBI Stock Broker INZ000235531; member NSE (12971) and BSE (3246); Depository Participant with CDSL, DP ID 12063900, SEBI DP Reg. IN-DP-22-2015. We are the **Data Fiduciary** for the personal data described here.

**B.2 What we collect, and why.** We collect only what opening and running a trading and demat account requires.

| Category | Examples | Why we need it | Lawful basis |
| :--- | :--- | :--- | :--- |
| Identity | Name, PAN, date of birth, father's name, photograph, signature | SEBI KYC; identity verification | Legal obligation |
| Aadhaar-derived | Address and demographic details fetched via DigiLocker; **last 4 digits only** of the Aadhaar number | Address proof; e-Sign | **Consent** (Aadhaar Act / DPDP) |
| Contact | Mobile, email | Account operation, contract notes, statements | Contract |
| Financial | Bank account and IFSC, income proof for derivatives | Settlement; SEBI derivatives eligibility | Legal obligation / Contract |
| Liveness | Selfie and in-person verification capture, with geo-tag | SEBI-mandated IPV | Legal obligation |
| Nominee | Name, relationship, contact, date of birth; guardian where the nominee is a minor | SEBI nomination requirement | Legal obligation |
| Usage | Device, browser, IP, app interaction logs | Security, fraud prevention, service quality | Legitimate use / Consent (analytics) |

**We do not collect** biometrics beyond the liveness check, contacts, photos, SMS content, or precise background location.

**B.3 Aadhaar.** We never store your full Aadhaar number and never display more than the last four digits. Aadhaar data is fetched only after your explicit consent, only through DigiLocker or a licensed KYC route, and is used only to verify identity and address and to e-Sign your account opening form.

**B.4 Who we share it with.** We do not sell personal data. Ever. We share only where a specific purpose requires it:

| Recipient category | What, and why |
| :--- | :--- |
| **Regulators and market infrastructure** | SEBI, the exchanges (NSE, BSE), the depository (CDSL), KRAs and CERSAI/CKYC — identity and account data, as SEBI requires |
| **Government-approved verification partners** | PAN, Aadhaar, bank and liveness verification, on our instruction and under contract |
| **Payment and banking partners** | Bank account verification and settlement |
| **Service providers** | Cloud hosting, communications delivery, customer support tooling — bound to confidentiality and processing only on our instruction |
| **Law enforcement / courts** | Where legally compelled |

*(⚠ **Drafting note — T16.** DPDP requires disclosure of **categories** of recipients, which this does; §10 separately forbids naming individual KYC vendors in customer-facing text. Both hold together only while the description stays at category level. Legal to confirm that satisfies DPDP notice and that no cross-border transfer requires named disclosure.)*

**B.5 Where it is processed.** Personal data is stored and processed **in India**. *(If any processor operates outside India, Legal SHALL disclose the country here and confirm it is not on a restricted list.)*

**B.6 How long we keep it.** Records SEBI and the PMLA require us to retain are kept for the periods those rules prescribe — **8 years** for transaction and KYC records — even after you close your account, because we are legally obliged to. **Abandoned applications** — where KYC was started and never completed — are deleted, along with the PAN, Aadhaar reference and bank details in them, after **30 days**. *(⚠ **T17** — the abandoned-application window is onboarding **C6**; the number is set here and the deletion job must exist to honour it.)*

**B.7 Your rights under DPDP.** You may:

- **Access** a summary of the personal data we hold about you and who we have shared it with;
- **Correct** anything inaccurate, and **complete** anything missing;
- **Erase** data we no longer need — except where we are legally required to keep it;
- **Withdraw consent** at any time, as easily as you gave it. Withdrawing consent for marketing stops marketing and nothing else. Withdrawing consent we rely on for KYC may mean we can no longer keep your account open;
- **Nominate** someone to exercise these rights if you die or become incapacitated;
- **Complain** to us, and then to the **Data Protection Board of India** if we do not resolve it.

**How to exercise them:** in the app under **Profile → Privacy**, or by writing to **ig@moneylogix.in**. We respond within **30 days**.

**B.8 Grievance Officer.** **Manoj T. Mahamunkar**, **bogrievances@moneylogix.in** (demat) / **complaints@moneylogix.in** (broking), **8425853815**, at the registered office above. Manoj T. Mahamunkar is also the **Data Protection Officer** under DPDP — **Manoj T. Mahamunkar**, **Manoj T. Mahamunkar** (same person; also DPO under DPDP). *(⚠ **T18** — DPDP requires the Data Fiduciary's contact to be published; SEBI separately requires a Grievance Officer and an escalation matrix. Both must be real, named people.)*

**B.9 Security.** Data is encrypted in transit and at rest, access is role-based and logged, and personally identifiable fields are masked by default in our internal tools, revealable only with a recorded reason and a second factor. **We will never ask you for your PIN, an OTP, or your password — by call, message, email or any other route.** No one from Thinq has a legitimate reason to ask.

**B.10 Children.** Thinq accounts are for individuals aged 18 and over. We do not knowingly collect data from children. Where a **nominee** is a minor, we collect the guardian's details as SEBI requires — that is nominee record-keeping, not an account for the child.

**B.11 Cookies.** See the Cookie Policy (Appendix F).

**B.12 Changes.** We will tell you before this Policy changes. Where a change is material — including any change to what you have consented to — **we will ask you to accept it again**, and will not rely on your continued use alone. *(Mirrors A.12.)*

### A.15 — INTERNAL ONLY · DELETE BEFORE HANDING TO LEGAL OR A CMS

**This table SHALL NOT be published, forwarded to a customer, or pasted into a content system.** It exists so a reviewer can trace where each clause pattern came from and judge how much rewriting each needs. It is the reason the appendix is marked unpublishable.

| Clause | Title | Pattern derived from |
| :--- | :--- | :--- |
| **A.1** | Acceptance of Terms | Angel One |
| **A.2** | Eligibility | Groww, Angel One |
| **A.3** | Licence to Use | Dhan, Groww, Angel One |
| **A.4** | Restrictions / Prohibited Use | Dhan, Groww, Angel One |
| **A.6** | Intellectual Property Rights | Dhan, Groww, Angel One |
| **A.7** | Disclaimer | Dhan, Groww |
| **A.8** | Limitation of Liability | Dhan, Groww, Angel One |
| **A.9** | Indemnification | Dhan, Groww, Angel One |
| **A.10** | Termination / Suspension | Dhan, Groww |
| **A.11** | Force Majeure | Dhan |
| **A.12** | Variation of Terms | Dhan |
| **A.13** | Governing Law & Jurisdiction | Dhan/Angel One = Mumbai; Groww = Bengaluru |

Clause structure and language patterns were surveyed 2026-08-03 from live Indian broker Terms pages. Wording here is paraphrased and synthesised rather than lifted, **but "not verbatim of any single source" is a weaker claim than "original"** — three sources synthesised can still read as substantially similar to each. Legal owns that judgement.

⚠ **A.12 carries a term worth challenging on its merits, not just its provenance.** *"Deemed accepted [24 hours] after posting"* is the market pattern, and for a consumer financial contract a 24-hour deemed-acceptance window on unilateral changes is aggressive — it also contradicts §6's material-change re-consent rule (T9). Recommend a longer notice period and explicit re-consent for material changes, whatever the market does.

---

---

## Appendix C — Tariff / Schedule of Charges  **[v1.11.0 — introductory offer set]**

**Headline: free for six months.** From the day the account is activated, Thinq charges **₹0** for six months — account opening, demat AMC, brokerage on **equity, F&O and commodity derivatives**, DP debit, pledge/unpledge, rematerialisation, payment gateway, statements and call-and-trade.

- **THE SYSTEM SHALL NOT show ₹0 against statutory or exchange levies.** STT/CTT, exchange transaction charges, SEBI turnover fees, stamp duty and **GST at 18%** are levied by the government, the exchanges and the depository, are passed through **at cost**, and **cannot be waived by any broker**. A tariff showing zero against them is a claim the first contract note contradicts, and is the kind of "zero brokerage" presentation that attracts regulatory attention. The published page states this under its own heading.
- **THE SYSTEM SHALL keep delayed-payment interest and auction/short-delivery penalties outside the introductory offer** — they arise from the customer's own position, and waiving them would be a perverse incentive.
- **Client Master Report issue and re-issue SHALL be ₹0 permanently**, not only during the offer.
- **THE SYSTEM SHALL give at least 30 days' notice before the introductory period ends**, and again before any later increase.
- **THE SYSTEM SHALL NOT levy any charge not published on the tariff page.**

**Outstanding — commercial decisions, not drafting:** brokerage and AMC **from month seven**; delayed-payment interest rate; physical-statement charge; and the link to current statutory rates.

## Appendix D — Policies & Procedures (T-PP)  **[NEW v1.8.0]**

> SEBI requires brokers to publish a Policies & Procedures document and include it in the client-registration bundle. These are the mandated headings; the values are Thinq's to set.

**D.1 Change in brokerage.** Rates may be revised with **at least 30 days' written notice** by email to the registered address. Continued trading after the effective date constitutes acceptance.

**D.2 Inactive / dormant accounts.** An account with **no transaction for [12 months]** is marked **dormant**; trading is disabled until reactivation. Reactivation requires re-verification of identity and contact details. Credit balances and holdings are **not** affected by dormancy and remain yours. *(Ties to FAQ GEN-06.)*

**D.3 Running account settlement.** Unused credit is returned to the registered bank account on the cycle the customer chose: **Quarterly — every 90 days (default)** or **Monthly — every 30 days**, changeable any time from Profile → Settings. Thinq retains only what the exchanges permit against margin obligations. *(Both framings are stated because the KYC journey uses days — FAQ KYC-ABT-01 — and SEBI uses periods.)*

**D.4 Penny stocks and illiquid securities.** Thinq may **refuse or restrict** orders in securities it classifies as illiquid, in the Trade-to-Trade or GSM/ASM surveillance frameworks, or subject to exchange restriction. The list changes and is published in-app.

**D.5 Exposure and margin limits.** Limits are set by regulation and by Thinq's own risk assessment. Where markets move quickly they may be varied **immediately and without prior notice**, but **THE SYSTEM SHALL notify the customer as soon as reasonably possible and state why**. Thinq is not obliged to extend any particular limit. *(B2C: an unqualified "without notice" is a harsh term in a consumer contract.)*

**D.6 Right to sell client securities or close positions.** Where a debit balance or margin shortfall is not cleared by **T+1**, Thinq may close positions or sell pledged securities to recover it. **THE SYSTEM SHALL notify the customer first** at the registered email and mobile and allow **24 hours** to clear it themselves, unless market conditions make waiting impossible; **SHALL sell no more than is needed** to cover the shortfall; and any remaining amount stays payable. *(B2C: selling a consumer's securities before they have had a chance to pay is the harshest term in this document.)*

**D.7 Temporary suspension of trading.** You may request suspension in writing; Thinq may suspend an account for regulatory direction, suspected fraud, unresolved KYC deficiency, or non-payment. Suspension does not cancel obligations already incurred.

**D.8 Deregistration / closure.** Either party may close the relationship. Thinq will settle funds and transfer or rematerialise holdings before closure. Closure does not discharge obligations arising before it. *(Ties to FAQ GEN-10.)*

**D.9 Conflict of interest.** Thinq trades on its own account only as permitted, does not use client order information for proprietary advantage, and discloses any material conflict.

---

## Appendix E — Grievance Redressal & Escalation Matrix  **[v1.11.0 — contacts resolved]**

> **SEBI requires this published on the website** with named officers and response times. It is also the escalation path FAQ GEN-15 points at.

| Step | Who | Contact | Response |
| :--- | :--- | :--- | :--- |
| 1 | Customer Support | **support@moneylogix.in** | **T+1 working day** |
| 2 | Stock broking complaints *(trading account)* | **complaints@moneylogix.in** | **7 working days** |
| 2 | Depository Participant complaints *(demat account)* | **bogrievances@moneylogix.in** | **7 working days** |
| 3 | Investor Grievance | **ig@moneylogix.in** | **7 working days** |
| 4 | **Grievance & Compliance Officer** — Manoj T. Mahamunkar | **mahamunkarmanoj@moneylogix.in** · **8425853815** | **7 working days** |

**Beyond Thinq** — published as live links, not names:
- **SEBI SCORES** — `https://scores.sebi.gov.in/`
- **NSE** — `https://www.nseindia.com/static/complaints/file-a-complaint-online`
- **BSE** — `https://bsecrs.bseindia.com/ecomplaint/frmInvestorHome.aspx`
- **ODR portal** — `https://smartodr.in/` *(not owner-supplied; confirm)*

- **THE SYSTEM SHALL state that escalating to SEBI or an exchange requires no permission from Thinq and does not affect the customer's account.** *(Escalation ladders read as though each rung must be exhausted first. They need not be, and saying so costs nothing.)*
- **THE SYSTEM SHALL route trading and demat complaints separately** and SHALL say why — they sit under different regulators — while accepting either address and routing internally, because most customers will not know which theirs is.
- ⚠ **T18 reduced to response times only.** Officers and addresses are resolved; the four SLAs above remain assumptions and become public commitments on publication.

## Appendix F — Cookie Policy  **[NEW v1.8.0]**

**Strictly necessary** — session, authentication, security and fraud prevention. Cannot be switched off; the service does not work without them. **Preference** — remembering your settings. **Analytics** — how the product is used, so it can be improved. **We do not use advertising or cross-site tracking cookies.**

Analytics and preference cookies are **opt-in on the web**, are **off until you choose**, and can be changed at any time from the cookie banner or **Profile → Privacy**. Declining them does not restrict access to any part of the service.

---

## Appendix G — Disclaimers  **[NEW v1.8.0]**

**G.1 Market risk.** *"Investments in the securities market are subject to market risks. Read all the related documents carefully before investing."* — mandatory and SHALL appear on marketing and research content.

**G.2 No assurance from registration.** Registration granted by SEBI, membership of an exchange, and NISM certification in no way guarantee performance or assure returns.

**G.3 Research and content.** Educational content is not investment advice and not a recommendation to buy or sell. **Money Logix Securities is NOT a SEBI-registered Research Analyst or Investment Adviser** *(confirmed by owner v1.12.0)* and SHALL NOT hold itself out as one. Where third-party research is displayed, the provider and its SEBI registration SHALL be named alongside it.

- ⚠ **T22 — the "not an adviser" position constrains product, not just copy.** With no RA or IA registration, Thinq SHALL NOT publish buy/sell calls, target prices, model portfolios, curated "top picks", or anything a reasonable retail customer would read as a recommendation — however it is labelled. Screeners, factual data and neutral education are permitted. This binds marketing and any future content or advisory feature, and the constraint is easy to breach by accident once a content team starts writing. Revisit if registration is later obtained.

**G.4 Past performance** is not indicative of future results.

---

## Appendix H — Referral Terms  **[NEW v1.8.0]** *(only if a referral programme ships)*

Open to existing account holders. A referral qualifies when the referred person **completes KYC and is permitted to trade** — not on registration alone. Rewards, caps and expiry: **[TBD]**. Self-referral, duplicate PANs and any incentive that could be read as **payment for introducing business in breach of SEBI rules** are excluded. Thinq may vary or withdraw the programme with notice; accrued unredeemed rewards **[are / are not]** honoured.

---

## Appendix I — Website publication inventory  **[NEW v1.8.0]**

What must be live on the website, and where it comes from.

| Page | Source | Status |
| :--- | :--- | :--- |
| Terms of Use | Appendix A | ✅ drafted |
| Privacy Policy | Appendix B | ✅ drafted |
| Tariff / Charges | Appendix C | ⚠ structure only — figures TBD |
| Policies & Procedures | Appendix D | ✅ drafted, values TBD |
| Grievance & Escalation Matrix | Appendix E | ⚠ names TBD (**T18**) |
| Cookie Policy | Appendix F | ✅ drafted |
| Disclaimers | Appendix G | ✅ drafted |
| Referral Terms | Appendix H | ⚠ only if the feature ships |
| Rights & Obligations · RDD · Do's & Don'ts · MITC · Investor Charter | **Prescribed** — reproduce SEBI/exchange text | ❌ to be obtained |
| Basic details: registration numbers, registered office, compliance officer | §0/Appendix B header | ✅ available |
| Investor advisory / attention notices, bank details for funds, ODR link | **Prescribed** | ❌ to be obtained |

## Output Status

```
PRD Status: THINQ-TNC-001 v1.13.0 — FINAL DRAFT

v1.13.0 change: **owner confirmations applied — T18 effectively closed, T17 reduced to a build
task.**

- **Response times confirmed**: support **T+1 working day**; Grievance, Compliance and Investor
  Grievance **7 working days** each. These are now public commitments, not assumptions.
- **Manoj T. Mahamunkar is also the Data Protection Officer** under DPDP, alongside Grievance
  and Compliance Officer. ⚠ **T18 downgraded to P2 for one residual reason**: one person holding
  all three roles is normal at this size but is a single point of failure — confirm a documented
  deputy for leave and escalation.
- **Retention set**: **8 years** statutory, **30 days** for abandoned applications. **T17 is no
  longer a decision, it is a build task** — the 30-day number is onboarding **C6**, and the
  deletion job that must honour it does not exist.
- **Dormancy 12 months**; **margin shortfall T+1** with **24 hours** to clear it after notice.
- **Post-offer pricing deferred** by owner decision. The tariff stays at "free for six months"
  with month-seven charges marked to-be-published; the **30-days-notice-before-the-offer-ends**
  commitment stands and is the thing that eventually forces the decision.


v1.12.0 change: **two owner confirmations applied.**

**Thinq is NOT a registered Research Analyst or Investment Adviser.** G.3 states it as fact
rather than a placeholder, and **T22** records what that constrains: with no RA/IA registration
there can be **no buy/sell calls, target prices, model portfolios or curated "top picks"** —
nor anything a retail customer would read as a recommendation, whatever it is labelled.
Screeners, factual data and neutral education remain fine. This binds marketing and any future
content feature, and it is easy to breach by accident once someone starts writing content.

**Support address is support@moneylogix.in.** Replaced across the T&C PRD, the ops console
(main.js rejection templates) and **the shipped KYC prototype** — `help@thinq.in` no longer
appears in any of them.


v1.11.0 change: **marketing consent is now Required at onboarding** (owner decision), plus the
prototype sync — contacts, tariff and Policies & Procedures.

**T21 (P0) — recorded as an owner decision taken against advice**, so the trade-off is visible
rather than inferred later. DPDP §6 requires consent to be free, specific, informed and
**unconditional**; conditioning account opening on marketing consent is the pattern that
requirement exists to prevent. It reverses the "independently declinable" half of **D-5**, which
was written expressly to counter the bundling found in the market teardown. **The mitigation is
§8**: withdrawal stays self-service and effective within 60 seconds, so marketing consent is
required to *open* an account but not to *keep* one. Legal to assess sufficiency before publish.

Presentation requirement retained: C-MKTG is still shown as **its own named line**, never folded
silently into the by-proceeding bundle, and the withdrawal control is surfaced prominently after
activation.

**Also synced from the legal-pages prototype:** all officer and complaint addresses resolved
(support / complaints / bogrievances / ig / Manoj T. Mahamunkar, 8425853815); Appendix E rebuilt
with separate broking and depository routing plus live regulator links; **Appendix C set to the
six-month free offer** with the rule that statutory levies are never shown as ₹0 and that
delayed-payment interest and auction penalties stay outside the offer; Appendix D given the real
running-account cycles (90/30 days) and B2C-softened margin and sell-securities clauses.


v1.10.0 change: **T-REGHIST added — the regulatory-history declaration was missing entirely**,
and T-ECN's copy drafted.

🚫 **T19 (P0).** SEBI's trading account opening form requires two disclosures: any **action or
proceeding** by SEBI, an exchange or a statutory authority in the **last three years**, and
whether the applicant is a **director or employee of an exchange**, or **related to or
associated with an exchange member**. Neither was in §3.2's 17 artefacts, and neither appears
anywhere in the onboarding PRD — so the journey collects neither today. Catalogued as
**T-REGHIST**; the flow needs the fields, the AOF needs the clauses, and ops needs a review path
for a "yes".

⚠ **T20 (P1) — build it as a disclosure, not a confirmation.** The market pattern is one tick:
*"I confirm no action has been taken against me and I am not related to any exchange member."*
That leaves an applicant who **is** related, or who **does** have a past proceeding, with no
truthful path — they lie or they abandon. **Neither answer disqualifies anyone**: an industry
connection is common and merely reportable, and a past proceeding is assessed on its facts.
Yes/no with a details field on yes, routed to ops. **Fifth instance of the invisible-population
pattern** — the recurring defect this document set keeps surfacing.

**T-ECN copy drafted**, with two things the standard version omits: the **right to switch to
physical at any time**, and a plain statement that a bounced contract note is still one Thinq was
required to deliver — so a dead email address is the customer's problem to tell us about.


v1.9.0 change: **no company information beyond what the owner supplied.**

Drafting Appendices B and E introduced six `@thinq.in` addresses — privacy, grievance, DPO,
compliance, support and a director contact. All were bracketed, but a bracketed address still
asserts a **domain**, and no domain was given. Replaced with explicit **[TBD]** placeholders
that assert nothing.

The rule is now stated on the entity block: **only the owner-supplied values appear as fact** —
legal name, registered office, CIN, GSTIN, SEBI and DP registrations, exchange memberships and
codes, DP ID. Every email, phone number, officer name, website URL, brokerage rate and charge
is a placeholder.

Regulator URLs (SEBI SCORES, the ODR portal) are retained — they are public infrastructure, not
Thinq's information.


v1.8.0 change: **all Thinq-authored T&C documents drafted — Appendices B through I.**

v1.7.0's register said this PRD catalogued 23 artefacts and contained the text of one. It now
contains **eight**: Privacy Policy (B), Tariff (C), Policies & Procedures (D), Grievance &
Escalation Matrix (E), Cookie Policy (F), Disclaimers (G), Referral Terms (H), plus a **website
publication inventory (I)** listing every page that must be live and where it comes from.

**Appendix B closes T14 (P0).** It carries the DPDP notice — categories collected and why,
lawful basis per category, recipient categories, retention, and the full set of data-subject
rights, none of which existed in any Thinq document. It also states plainly that **we will never
ask for your PIN, an OTP or your password**, which is the anti-phishing line onboarding C45 has
been looking for a home for.

**Three P0s opened by drafting it**, because writing the document is what forces the answers:
- **T16** — DPDP requires disclosing recipient *categories*; §10 forbids naming vendors. B.4
  discloses at category level and both rules hold, but Legal must confirm that satisfies DPDP
  notice and that no cross-border transfer forces a named disclosure.
- **T17** — retention periods are unset. The abandoned-application window is onboarding **C6**,
  and its deletion job has to honour whatever number lands here.
- **T18** — **the Grievance Officer and DPO are unnamed.** SEBI requires a published escalation
  matrix and DPDP requires the Fiduciary's contact. Publishing Appendix E with placeholders in
  it would be worse than not publishing it.

**Commodity is struck from the tariff** (C.2) rather than left blank — no MCX membership,
onboarding C54.

Still to obtain rather than write: the **prescribed** documents — Rights & Obligations, RDD,
Do's & Don'ts, MITC, Investor Charter, investor advisory notices. Those are reproduced, not
authored, and Appendix I tracks them.


v1.7.0 change: **§3.5 drafting register — this PRD catalogues 23 artefacts and contains the
text of exactly one.**

§3.1–3.4 specify how each artefact is accepted, versioned and recorded. That is not the same as
having it written, and without saying so the catalogue reads as coverage. The register splits
them: **13 are prescribed** by SEBI, the exchanges or CDSL and are adopted rather than authored;
**9 are Thinq's to write**, of which **only Terms of Use (Appendix A) is drafted**.

🚫 **T14 (P0) — the Privacy Policy does not exist**, and it is the one that blocks. Three of the
four welcome-page consents and the by-proceeding clickwrap all name it. It owns the DPDP notice
(purpose, retention, recipients), the **vendor-disclosure** question §10 defers by forbidding
vendor names in customer text, the **retention window** onboarding C6 parks at a 30-day default,
and the DPDP data-subject rights — access, correction, erasure, grievance — which appear in no
Thinq document at all. A customer accepting *"I consent to Thinq processing my information"* is
today accepting terms nobody has written.

**T15 (P1)** — seven more unwritten: Tariff (×3), Policies & Procedures, referral T&C, ad and
research disclaimers, cookie consent. Tariff and P&P are needed for the AOF e-Sign bundle.


v1.6.0 change: **entity details filled — no placeholders left in Appendix A's clause text.**

**Thinq** is the brand; **Money Logix Securities Private Limited** is the legal entity. Customer
surfaces use *Thinq*; anything identifying the contracting or regulated entity uses the legal
name. Full statutory identification block added to A.14, and Mumbai set as jurisdiction (A.13).

🚫 **The registration table rules out two things the product currently assumes:**
- **No MCX membership** — NSE and BSE only. **Commodity trading cannot be offered**, yet the
  onboarding flow presents *Commodity* as a selectable segment and gates it behind income proof.
  Raised as onboarding **C54 (P0)**.
- **No NSDL DP** — every demat account is **CDSL**, DP ID 12063900, so BO IDs are 16 digits
  beginning `12063900`. Anything offering a depository choice or naming NSDL as Thinq's
  depository is wrong. *(NSDL stays correct for **PAN verification**, a separate role.)*

T9 reduced to one item: Legal's confirmation that the drafting is Thinq's own.


v1.5.0 change: **A.12's 24-hour deemed-acceptance mechanic dropped.**

It was never load-bearing. A variation clause has to establish two things — that Terms can
change, and how acceptance works — and **notice plus continued use does both**. The deemed-
accepted-after-24-hours limb was the market pattern, not a requirement, and it was the part
carrying the risk: an aggressive term in a consumer financial contract, and a direct
contradiction of §8's material-change re-consent rule.

A.12 now says Thinq notifies before a change takes effect, continued use accepts it, and
**material changes — including anything you consented to — require explicit re-acceptance**.

Three things close together: **T9's second limb is resolved** (the appendix defers to §8 rather
than competing with it), the **last discretionary `[bracket]` is gone** from the clause text,
and the clause is now shorter than the one it replaced. `[City]` remains, pending Thinq's
registered office.


v1.4.0 change: **compliance hardening of Appendix A — competitor and vendor names.**

Appendix A carried **12 inline `(source: Dhan, Groww, Angel One)` attributions inside the clause
text of A.1–A.13** — internal provenance markers sitting in the body of a document whose whole
purpose is to be handed to Legal and then into a CMS. They would have travelled with the text.
Moved to **A.15, an internal-only table marked delete-before-handing-on**. A.13 also carried
*"peers use Mumbai or Bengaluru"* inside the jurisdiction clause; removed.

**Four publication gates added to the appendix preamble, one constraint to §10:**
- **No third-party brand name in any customer-facing legal document.** Permitted: SEBI, the
  exchanges, the depositories, DigiLocker/UIDAI, KRA/CERSAI. Competitor names never, anywhere —
  including provenance notes and comments.
- **No KYC vendor named** — Digio, Signzy, Setu or successors. They are commercial arrangements,
  not disclosures the customer needs, and naming one binds the copy to a contract that may
  change. Legal documents SHALL use the journey's own wording, *"a Govt.-approved partner"*.
- **No `[bracketed placeholder]` survives publication** — entity, SEBI reg. no., DP ID,
  jurisdiction city, A.12 notice period.
- **Legal SHALL confirm the drafting is Thinq's own before publication.** Synthesising from
  three sources reduces but does not remove substantial-similarity risk; another firm's Terms
  are their copyrighted work. That is a sign-off, not an edit.

**Checked and clean:** the customer-facing consent strings in §3.1/§3.2 name only **DigiLocker**
and **CDSL**, both correct and necessary. No vendor or competitor name appears in any consent
copy, and it is consistent with the onboarding journey's *"Govt.-approved partner"* wording.

⚠ **Flagged on its merits, not its provenance:** A.12's *"deemed accepted [24 hours] after
posting"* is the market pattern and is aggressive for a consumer financial contract — and it
contradicts §6's material-change re-consent rule (T9). Recommend a longer notice period plus
explicit re-consent for material changes, whatever the market does.


v1.2.2 change: §3.1/§4 — explicit that NO checkbox / "I accept" control exists for T&C /
the Required consents / platform terms; moving ahead IS the acceptance, consent log
maintained per §5–§6. Marketing stays the only checkbox.

v1.2.1 change: by-proceeding line copy shortened to "By proceeding, you also agree to
all T&C." with "T&C" hyperlinked to a single T&C page of three tabs — Terms of Use ·
Privacy Policy · Tariff Rates (Tariff includes brokerage & AMC disclosures). Onboarding
Step 1 synced.

v1.2.0 change: §3.1 [MODIFIED] to the T&C-page consent model per owner decision D-7 —
three Required consents (processing / KRA-CKYC / Aadhaar-DigiLocker) shown as statements
and ACCEPTED BY PROCEEDING (not tick-gates); MARKETING is the only explicit checkbox
(optional, declinable); platform terms + brokerage & AMC disclosures + mobile PAN/bank
fetch (C-PANBANK) covered by the exact by-proceeding line "By proceeding, you also agree
to Thinq's Terms of Use, Privacy Policy & Tariff Rates, and brokerage & AMC charge
disclosures." Exact on-page copy captured. §4 presentation rewritten. D-7 added
(qualifies D-5); DPDP/Aadhaar trade-off flagged as open item T10 (Legal). Discrete
per-code consent records still written (channel = proceed | checkbox).

v1.1.0 change: [NEW] Appendix A — Thinq Terms of Use (Adapted Draft) — real clause
text extracted from live broker Terms (Dhan, Angel One, Groww; same template as Fyers/
Sahi/DreamStreet) and rebranded to Thinq, with entity/jurisdiction/figures as
[placeholders]. 14 clauses (Acceptance, Eligibility, Licence, Restrictions, User
Obligations, IP, Disclaimer, Limitation of Liability, Indemnity, Termination, Force
Majeure, Variation, Governing Law, Read-with). Marked DRAFT/Legal-review-required;
provenance noted per clause. A.12 vs §6 re-consent conflict flagged. Open item T9 added.
Also v1.0.1: §3.4 added U-TAR Tariff + by-proceeding clickwrap sync (auth D-32);
§3.1 T-MITC exact label + hyperlink.

Covers: the complete Terms & Conditions and consent framework for Thinq broking —
artefact catalogue (four unbundled consents + SEBI/depository mandatory bundle +
conditional add-ons + platform ToU/Privacy), unbundling + presentation rules,
acceptance mechanics, immutable version-pinned storage, withdrawal/re-consent,
display/UX (no dark patterns), onboarding-flow mapping, data model, acceptance
criteria, decision log, open items.

Grounded in: THINQ-TNC-TEARDOWN-001 (Fyers, Dhan, Angel One, Groww, Sahi,
DreamStreet consent teardown). Aligns with THINQ-KYC-ONBOARDING-001 (§3 flow,
§18.0 four unbundled consents) and the auth PRD's Activation boundary.

Open decisions: MITC template version, DPDP retention window, regional-language
set, re-consent threshold, MTF/API launch scope, consent-message BSP class,
closure-on-withdrawal flow, ledger storage tech (see §14).
```
