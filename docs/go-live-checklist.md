# Go-live checklist — internal

**This file is not page copy and must never be rendered.** It is the team's own
list. A customer reading a broker's unfinished to-do list is worse than a
customer reading nothing.

Everything under "Blocking" has to be closed before this page is served to the
public. Everything under "Decisions" is already settled — it is written down so
the next person to notice a gap finds the reasoning instead of filling it in.

---

## 1. Blocking — legal and regulatory

Publishing a broker landing page with invented SEBI or exchange registration
numbers is a regulatory offence, not a typo. Every value below currently renders
as a `[BRACKETED]` placeholder in warning amber with a dotted underline, which is
the mechanism that stops one shipping by inattention. Do not fill any of them
from imagination, from a competitor's footer, or from an older draft.

| Item | Where | Owner |
|---|---|---|
| Legal entity name | `src/data/footer.ts` → `registrationLines`, `copyrightEntity` | Compliance |
| CIN | `registrationLines` | Compliance |
| Registered office address | `registrationLines` | Compliance |
| SEBI stock broker registration (INZ…) | `registrationLines`, and `src/data/hero.ts` → `registrations` | Compliance |
| NSE member code | both files above | Compliance |
| BSE member code | both files above | Compliance |
| CDSL DP ID | both files above | Compliance |
| Compliance officer — name, email, phone | `registrationLines` | Compliance |
| Investor grievance email and phone | `registrationLines` | Compliance |

**Verbatim disclosure wording.** Three blocks currently carry a bracketed
instruction rather than final text, and all three are prescribed wording that
changes periodically. Transcribe from the current circular; do not paraphrase.

- **Derivatives risk disclosure** — the exchange-approved wording, plus the
  current SEBI study figure, its name and its date. `statutoryDisclosures` →
  `derivatives-risk`.
- **Retail algorithmic trading** — the exact current wording and approval
  references from the applicable SEBI circular and exchange notice.
  `statutoryDisclosures` → `algo-framework`.
- **Advisory boundary** — confirm the current form with compliance before
  publishing. `statutoryDisclosures` → `advisory-boundary`.

**Segment scope.** MCX and the mutual-fund ARN were removed from the trust band
and the footer because the page claims neither segment. If either goes live, add
the row; do not add a membership for a segment the product does not offer.

---

## 2. Blocking — the six security claims

`src/data/security.ts` publishes six statements about systems. They are not
marketing copy: each is either true of the product on launch day or it is a false
security claim published by a SEBI-registered broker.

Each needs sign-off from whoever owns the system it describes. Do not soften a
claim into "designed to" or "helps protect" — a hedged security claim reads as a
commitment to a customer and as a disclaimer to a lawyer. **If a claim cannot be
signed off, delete the row.**

1. **Securities credited to the customer's own demat account**, held in their
   name, not in a pooled account we control.
2. **Client funds segregated** from the company's own, with balances reported to
   the exchange.
3. **Two-factor on login _and_ on every withdrawal request.** The withdrawal half
   is the one to verify — it is the half most brokers do not have.
4. **Encrypted in transit and at rest.** Confirm both, not one.
5. **Active session list, with instant termination from any device.** Verify what
   "instant" means in the implementation: a kill that takes effect on the next
   token refresh is not instant, and the word is the claim.
6. **Complete, timestamped order trail, retrievable _by the customer_.** Every
   broker keeps one because regulation requires it; the claim here is that the
   customer can pull their own.

---

## 3. Blocking — the waitlist mechanic

**The form does not submit anything.** `src/components/ui/WaitlistForm.tsx` has
two stub functions, `submitPhone` and `submitOtp`, each marked with a TODO. They
validate, show a spinner for 600ms, and advance. Nothing is sent and nothing is
stored.

This is deliberate — a `fetch()` against an endpoint that does not exist would
produce a form that passes a click-through in review and silently discards every
number a real visitor gives it. Two consequences follow from the stub and both
are expected, not defects:

- any six digits "verify", because the stub cannot check a code it never sent;
- reloading the page loses the state.

To close:

- [ ] `submitPhone` → POST the number; the service sends the OTP. On a non-2xx,
      set `waitlistForm.errors.submit` and **stay on the phone step** — never
      advance to the code field for a number the service rejected, or the reader
      waits for a message that is not coming.
- [ ] `submitOtp` → POST number + code; advance to `done` **only** on a verified
      response. The success copy tells the reader they are on the list.
- [ ] Wire the `Resend code` button, which currently only clears the error.
- [ ] Rate-limit both endpoints. An unthrottled OTP send is an SMS bill and a
      way to use this page to text strangers.
- [ ] Consent and retention: record what the number was given for, and how long
      it is kept if the person never activates.

**The waitlist count is hardcoded.** `waitlistCount` in `src/data/waitlist.ts` is
`2412`. Read it from the signups table. It renders in two places — the hero and
the close — from that one constant, so there is one thing to change.

It deliberately renders as a plain figure rather than a flagged `[PLACEHOLDER]`:
an invented registration number is a regulatory offence and a stale marketing
count is a number that is briefly behind, and spending the warning treatment on
the second devalues it on the first. It is still unfilled, which is why it is
here.

---

## 4. Blocking — links

Every anchor in the footer's bottom bar (`Terms`, `Privacy`, `Risk disclosure`)
points at `#`. Either publish the documents or remove the links. A pre-launch
company's footer is the first place a careful reader checks whether it is real,
and dead links answer that the wrong way.

`SCORES` is the one real external link on the page and needs no work.

---

## 5. Decisions — settled, with reasons

Recorded so they are not silently reversed by someone who reads a gap as an
oversight.

**One feature in depth, not six in a grid.** §3 spends a full screen and a plate
on a single capability; §4 summarises the rest at one sentence each and is shaped
as a ledger so a reader can tell the two ranks apart before reading either. The
reader is not comparing feature counts — they are deciding whether an unlaunched
product is worth a phone number, and that is decided by one thing being
unarguably better.

**No roadmap dates.** Agentic trading is named in §4 as what is next and carries
no date. A date on an unshipped capability is a promise the page cannot keep.

**No rate card.** Nothing on this page says what brokerage costs after month six.
That is an honest silence, not a hidden term: nobody on the waitlist is being
charged, the offer's duration is stated exactly, and the previous build's pricing
section shipped every rate as an unfilled placeholder under the heading "Priced
plainly, in advance" — the one claim it could not support.

**No competitors named.** Anywhere.

**Statutory charges are itemised, not summarised.** §6 names STT, exchange
transaction charges, the SEBI turnover fee, GST and stamp duty individually,
because "statutory charges apply" is the phrase that lets a reader assume the
amount is small. The qualifier appears three times on the page — announcement
bar, hero, close — because the offer does, and a claim repeated three times with
the limit dropped once has been misrepresented by attrition.

**No emoji.** Anywhere.

**No manufactured urgency.** The page has two urgency lines — "the list closes
when we open" and "get in before we open" — and both state a fact about the
mechanism. No countdown, no seat counter, no "only N places left".

**No fabricated market data.** No prices, percentages, currency symbols, P&L,
candles or chart forms appear in any plate or any mock, including partial, out of
focus, or on a reflected surface. §3's two timestamps are a clock, not market
data; the moment that copy names a symbol or a level it becomes an invented
trade.

**If a product mock is ever put back in the hero**, it needs the "Illustrative.
Not a recommendation." stamp. The string was deleted with the old hero data. The
requirement did not go with it.
