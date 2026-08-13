import { useState } from 'react'
import { FileText, Lock, DollarSign, ArrowLeft, Check, AlertTriangle, LifeBuoy, Scale, Building2, QrCode, FileSpreadsheet } from 'lucide-react'
import ThinqMark from '../ui/ThinqMark'
import Container from '../ui/Container'

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'tariff' | 'policies' | 'grievance' | 'bank' | 'risk' | 'complaints'>('terms')
  const [showQrModal, setShowQrModal] = useState(false)

  return (
    <div className="min-h-screen bg-[#040405] text-fg font-sans selection:bg-white/20 selection:text-white isolate">
      {/* Signature Thinq Ambient Teal Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[520px] z-0 overflow-hidden"
      >
        <div
          className="mx-auto h-full w-[90vw] max-w-[1100px] opacity-60 blur-[140px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(8, 45, 54, 0.85) 0%, rgba(8, 45, 54, 0.3) 55%, transparent 85%)',
          }}
        />
      </div>

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040405]/80 backdrop-blur-2xl">
        <Container>
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Brand Logo Lockup */}
            <a href="/" className="flex items-center gap-3 group">
              <ThinqMark size={32} tone="steel" />
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white group-hover:text-white/80 transition-colors">
                Thinq
              </span>
            </a>

            {/* Back to Home Button */}
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4.5 py-2 text-xs font-semibold text-white/90 hover:border-white/35 hover:bg-white/10 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </a>
          </div>
        </Container>
      </header>

      {/* Hero Header Section */}
      <section className="relative z-10 pt-10 pb-8 sm:pt-14 sm:pb-12 border-b border-white/10">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Terms & Regulatory Framework
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Authoritative platform terms, DPDP 2023 privacy policy, tariff schedule, policies & procedures, escalation matrix, risk disclosures, investor complaints data, and USCNB bank details.
            </p>

            {/* Statutory Registered Entity Details Card */}
            <div className="mt-8 rounded-2xl bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl text-xs sm:text-sm text-white/85 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-lg">
              <div>
                <span className="font-semibold text-white">Money Logix Securities Pvt Ltd</span> ("Thinq")
                <div className="text-white/60 text-xs mt-1 leading-relaxed">
                  Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai 400 050 · CIN: U64990MH2006PTC165522 · GSTIN: 27AAECM8621N1Z0
                </div>
                <div className="text-white/60 text-xs mt-0.5">
                  SEBI Reg: <span className="font-mono font-semibold text-white">INZ000235531</span> · CDSL DP ID: <span className="font-mono font-semibold text-white">12063900</span> (IN-DP-22-2015) · NSE: 12971 · BSE: 3246
                </div>
                <div className="text-white/70 text-xs mt-1 font-mono">
                  Compliance Officer: <span className="text-white font-semibold">Manoj T. Mahamunkar</span> (mahamunkarmanoj@moneylogix.in)
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Document Content */}
      <main className="relative z-10 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Tab Control Bar - 8 Column Responsive Grid Without Borders or Horizontal Scroll */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2 mb-8">
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === 'terms'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Terms</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Privacy</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tariff')}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === 'tariff'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Tariff</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('policies')}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === 'policies'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Scale className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Policies</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('grievance')}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === 'grievance'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <LifeBuoy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Escalation</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === 'bank'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">USCNB & Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('risk')}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === 'risk'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Risk Disclosure</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === 'complaints'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Complaints Data</span>
              </button>
            </div>

            {/* Document Body Card Frame */}
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#09090c]/90 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
              {/* Top Specular Edge Highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

              {/* Tab 1: Terms of Use */}
              {activeTab === 'terms' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Platform Terms of Use (Appendix A)
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      Governs access, licensing, user obligations, and legal boundaries for Thinq web and mobile terminals.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">A.1 Acceptance of Terms</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Your access to or use of the Thinq Platform, its services, and products constitutes your binding consent to these Terms of Use, the Privacy Policy, and the Tariff Rates. If you do not agree, do not access or use the Thinq Platform.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">A.2 Eligibility & Competence</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      By accepting these Terms, you represent that you are <strong className="text-white">18 years of age or older</strong>, competent to contract under applicable Indian law, and are <strong className="text-white">not debarred, suspended, or prohibited by SEBI, RBI, or any statutory authority</strong> from dealing in securities.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">A.3 Licence to Use</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Thinq grants you a limited, non-exclusive, non-transferable, revocable, royalty-free right to access and use the Thinq Platform solely for carrying out your own online trades, transactions, and portfolio monitoring in accordance with SEBI and Exchange regulations.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">A.4 Prohibited Use & Restrictions</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      You shall not copy, reproduce, database, scrape, reverse engineer, or exploit any part of the Thinq Platform; shall not data-mine or harvest user data; shall not attempt unauthorized access, transmit malware, or use the platform for unauthorized commercial marketing.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">A.5 User Security Obligations</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      You are responsible for maintaining the strict confidentiality of your account credentials (PIN, passkeys, 2FA OTPs) and for all activity under your account. You agree to provide accurate KYC information and comply with all SEBI, Exchange, and Depository regulations.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">A.12 Variation of Terms</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Thinq will notify you before any change to these Terms takes effect. Where a change is material — including any change to what you have consented to — Thinq will ask you to accept it again and will not rely on continued use alone.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">A.13 Governing Law & Exclusive Jurisdiction</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the <strong className="text-white">exclusive jurisdiction of the competent courts at Mumbai, India</strong>.
                    </p>
                  </section>
                </div>
              )}

              {/* Tab 2: Privacy Policy (DPDP 2023) */}
              {activeTab === 'privacy' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Privacy Policy & DPDP 2023 Framework (Appendix B)
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      Data Fiduciary notice under the Digital Personal Data Protection Act, 2023.
                    </p>
                  </div>

                  {/* Anti-Phishing Security Line Notice */}
                  <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-4 text-xs sm:text-sm text-white/90 flex items-start gap-3 shadow-sm">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-white/90 mt-0.5" />
                    <div>
                      <strong className="text-white">Anti-Phishing Security Line (B.9):</strong> Thinq will <strong className="text-white font-semibold">NEVER ask you for your PIN, an OTP, or your password</strong> — by call, message, email, or any other route. No one from Thinq has a legitimate reason to ask.
                    </div>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">B.1 Data Fiduciary Identification</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      <strong className="text-white">Money Logix Securities Pvt Ltd</strong> ("Thinq") is the Data Fiduciary for personal data collected across the platform. Registered office: Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai 400 050.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">B.2 Data We Collect & Lawful Basis</h3>
                    <div className="overflow-hidden rounded-xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">Category</th>
                            <th className="p-3">Examples</th>
                            <th className="p-3">Purpose & Lawful Basis</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr>
                            <td className="p-3 font-medium text-white">Identity</td>
                            <td className="p-3">Name, PAN, DOB, Photo, Liveness IPV</td>
                            <td className="p-3">SEBI KYC & Identity verification (Legal Obligation)</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Aadhaar XML</td>
                            <td className="p-3">DigiLocker address fetch (<strong className="text-white font-mono">storing last 4 digits only</strong>)</td>
                            <td className="p-3">Address proof & e-Sign (Consent / Aadhaar Act)</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Financial</td>
                            <td className="p-3">Bank account, IFSC, income proof for derivatives</td>
                            <td className="p-3">Settlement & F&O eligibility (Contract / SEBI Rule)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">B.6 Retention Windows (Fixed T17 Rule)</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Statutory KYC and transactional records required by SEBI and PMLA are retained for <strong className="text-white font-mono">8 years</strong> after account closure. Data from <strong className="text-white">abandoned applications</strong> (uncompleted KYC) is automatically deleted after <strong className="text-white font-mono">30 days</strong>.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">B.7 Data Subject Rights under DPDP 2023</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      You have the right to Access your data summary, Correct inaccuracies, Erase unneeded records, Withdraw marketing consent (<strong className="text-white">effective in &lt; 60 seconds</strong>), Nominate representatives, and Complain to the Data Protection Board of India. Exercise rights via Profile → Privacy or by emailing <span className="font-mono font-semibold text-white">ig@moneylogix.in</span> (SLA: 30 days).
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">B.8 Data Protection Officer (DPO)</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      DPO & Compliance Officer: <strong className="text-white">Manoj T. Mahamunkar</strong> · Email: <span className="font-mono font-semibold text-white">mahamunkarmanoj@moneylogix.in</span>.
                    </p>
                  </section>
                </div>
              )}

              {/* Tab 3: Tariff & Charges */}
              {activeTab === 'tariff' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Tariff & Schedule of Charges (Appendix C)
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      Official 6-month free offer structure and statutory levy disclosures.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-5 text-sm text-white flex items-center gap-4 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                      <Check className="h-6 w-6 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Waitlist Introductory Offer (6 Months Free)</h4>
                      <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                        ₹0 Thinq Brokerage for 6 months on Equity Delivery, Intraday, Futures & Options, and Commodity. Zero Demat AMC permanently.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-white">Detailed Fee Breakdown</h3>
                    <div className="overflow-hidden rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-4">Service</th>
                            <th className="p-4">Thinq Charge</th>
                            <th className="p-4">Statutory & Exchange Levies</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-medium text-white">Equity Delivery & Intraday</td>
                            <td className="p-4 text-white font-bold">₹0 (Free for 6 Months)</td>
                            <td className="p-4 text-white/60">STT, Exchange Fee, Stamp Duty, GST @ 18%</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-medium text-white">Futures & Options</td>
                            <td className="p-4 text-white font-bold">₹0 (Free for 6 Months)</td>
                            <td className="p-4 text-white/60">STT/CTT, Exchange Fee, Stamp Duty, GST @ 18%</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-medium text-white">Demat Maintenance (AMC)</td>
                            <td className="p-4 text-white font-bold">₹0 / Year (Zero AMC)</td>
                            <td className="p-4 text-white/60">Annual Maintenance Fees Waived</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-medium text-white">Client Master Report (CMR)</td>
                            <td className="p-4 text-white font-bold">₹0 Permanently</td>
                            <td className="p-4 text-white/60">Free Issue & Re-issue</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">
                    *Note: Statutory levies (STT/CTT, Exchange transaction charges, SEBI turnover fees, Stamp duty, and GST @ 18%) are government-mandated and passed through at actual cost.
                  </p>
                </div>
              )}

              {/* Tab 4: Policies & Procedures */}
              {activeTab === 'policies' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Policies & Procedures (Appendix D)
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      SEBI-mandated operational policies covering brokerage changes, dormancy, and settlement cycles.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">D.1 Brokerage Revision Notice</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Brokerage rates may be revised with <strong className="text-white">at least 30 days' written notice</strong> via email to your registered address.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">D.2 Inactive / Dormant Accounts</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Accounts with no trading activity for <strong className="text-white">12 months</strong> are marked dormant to prevent unauthorized misuse. Holdings and credit balances remain 100% safe. Reactivation requires identity re-verification.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">D.3 Running Account Settlement</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Unused credit funds are returned to your bank account on your chosen cycle: <strong className="text-white">Quarterly — every 90 days (default)</strong> or <strong className="text-white">Monthly — every 30 days</strong>.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">D.6 Margin Shortfall & Securities Sale</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Debit balances or margin shortfalls must be cleared by <strong className="text-white font-mono">T+1</strong>. Thinq provides <strong className="text-white font-mono">24 hours notice</strong> to clear debts before liquidating securities to cover shortfalls.
                    </p>
                  </section>
                </div>
              )}

              {/* Tab 5: Escalation Matrix */}
              {activeTab === 'grievance' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Escalation Matrix
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      Official Escalation Matrix table and SEBI/Exchange complaint escalation channels.
                    </p>
                  </div>

                  {/* Official Escalation Matrix Table */}
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-white">Escalation Matrix:</h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">Details</th>
                            <th className="p-3">Contact Person</th>
                            <th className="p-3">Address</th>
                            <th className="p-3">Time</th>
                            <th className="p-3">Contact No.</th>
                            <th className="p-3">Person Email ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">Customer Care</td>
                            <td className="p-3 font-medium text-white">Sunil Dharse</td>
                            <td className="p-3 text-white/70">
                              Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050
                            </td>
                            <td className="p-3 text-white/70">
                              Monday to Friday 9:30 AM to 5:30 PM &<br />Sat: - 9:30 AM to 3:00 PM
                            </td>
                            <td className="p-3 font-mono font-semibold text-white">8425853808</td>
                            <td className="p-3 font-mono text-white">moneylogixs@gmail.com</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">Client Care Head</td>
                            <td className="p-3 font-medium text-white">Kalpesh chichhiya</td>
                            <td className="p-3 text-white/70">
                              Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050
                            </td>
                            <td className="p-3 text-white/70">
                              Monday to Friday 9:30 AM to 5:30 PM &<br />Sat: - 9:30 AM to 3:00 PM
                            </td>
                            <td className="p-3 font-mono font-semibold text-white">8291079922</td>
                            <td className="p-3 font-mono text-white">kalpeshbhatiya@yahoo.com</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">Compliance Officer</td>
                            <td className="p-3 font-medium text-white">Manoj T. Mahamunkar.</td>
                            <td className="p-3 text-white/70">
                              Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050
                            </td>
                            <td className="p-3 text-white/70">
                              Monday to Friday 9:30 AM to 5:30 PM &<br />Sat: - 9:30 AM to 3:00 PM
                            </td>
                            <td className="p-3 font-mono font-semibold text-white">8425853815</td>
                            <td className="p-3 font-mono text-white">mahamunkarmanoj@moneylogix.in</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* SEBI SCORES & BSE Complaint Notice Box */}
                  <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5 space-y-3 text-xs sm:text-sm text-white/85">
                    <p className="leading-relaxed">
                      In absence of response/complaint not addressed to your satisfaction, you may lodge a complaint with SEBI at{' '}
                      <a
                        href="https://scores.gov.in/scores/Welcome.html"
                        target="_blank"
                        rel="noreferrer"
                        className="text-white font-mono underline hover:text-white/80"
                      >
                        https://scores.gov.in/scores/Welcome.html
                      </a>{' '}
                      or Exchange at{' '}
                      <a
                        href="https://bsecrs.bseindia.com/ecomplaint/frmInvestorHome.aspx"
                        target="_blank"
                        rel="noreferrer"
                        className="text-white font-mono underline hover:text-white/80"
                      >
                        https://bsecrs.bseindia.com/ecomplaint/frmInvestorHome.aspx
                      </a>
                    </p>
                    <p className="font-semibold text-white">
                      Please quote your Service Ticket/Complaint Ref No. while raising your complaint at SEBI SCORES/Exchange portal.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 6: Upstreaming Client Bank Nodal Account (USCNB) & UPI Details */}
              {activeTab === 'bank' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Upstreaming Client Bank Nodal Account (USCNB) & UPI Details
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      Official bank account disclosures prescribed by SEBI for client fund deposits and settlements.
                    </p>
                  </div>

                  {/* USCNB Nodal Bank Account Card */}
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Upstreaming Client Bank Nodal Account (USCNB)
                    </h3>
                    <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5 space-y-3 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-white/50 text-xs block">ACCOUNT NAME</span>
                          <span className="font-mono font-bold text-white text-sm sm:text-base">
                            MONEY LOGIX SECURITIES PVT LTD - USCNB A/C
                          </span>
                        </div>
                        <div>
                          <span className="text-white/50 text-xs block">BANK NAME</span>
                          <span className="font-semibold text-white text-sm sm:text-base">
                            HDFC BANK LTD
                          </span>
                        </div>
                        <div>
                          <span className="text-white/50 text-xs block">ACCOUNT NUMBER</span>
                          <span className="font-mono font-bold text-white text-sm sm:text-base tracking-wider">
                            00600340039678
                          </span>
                        </div>
                        <div>
                          <span className="text-white/50 text-xs block">IFSC CODE</span>
                          <span className="font-mono font-bold text-white text-sm sm:text-base">
                            HDFC0000060
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UPI Handles Card */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Details of Official UPI Handles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 space-y-1">
                        <span className="text-white/50 text-xs block">FOR BROKING PAYMENTS</span>
                        <span className="font-mono font-bold text-white text-sm sm:text-base">
                          moneylogix.brk@validhdfc
                        </span>
                      </div>
                      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 space-y-1">
                        <span className="text-white/50 text-xs block">FOR DP PAYMENTS</span>
                        <span className="font-mono font-bold text-white text-sm sm:text-base">
                          moneylogix.dp@validhdfc
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Official UPI QR Code Showcase Section */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Official UPI QR Code
                    </h3>
                    <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 text-center space-y-4 max-w-md mx-auto">
                      <button
                        type="button"
                        onClick={() => setShowQrModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-xs font-bold hover:bg-white/90 transition-all shadow-lg"
                      >
                        <QrCode className="h-4 w-4" />
                        Click here to view UPI QR code
                      </button>
                      <div className="pt-3">
                        <img
                          src="/upi-qr.jpg"
                          alt="Money Logix Securities Pvt Ltd UPI QR Code"
                          className="w-48 h-48 mx-auto object-contain rounded-xl border border-white/20 bg-white p-2 shadow-xl hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => setShowQrModal(true)}
                        />
                        <p className="mt-2 text-xs text-white/50">
                          Tap image to expand QR code
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: SEBI Annexure-I Risk Disclosures on Derivatives */}
              {activeTab === 'risk' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      SEBI Annexure-I: Risk Disclosures on Derivatives
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      Mandatory statutory risk disclosures prescribed by Securities and Exchange Board of India (SEBI).
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/20 bg-white/[0.03] p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
                      <div>
                        <span className="font-mono font-bold text-white tracking-widest text-xs uppercase bg-white/10 px-3 py-1 rounded-lg">
                          Annexure-I: Risk Disclosures
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                          RISK DISCLOSURES ON DERIVATIVES
                        </h3>
                      </div>
                    </div>

                    <ul className="space-y-4 text-xs sm:text-sm text-white/90 list-disc pl-5 leading-relaxed font-normal">
                      <li>
                        <strong className="text-white">9 out of 10 individual traders</strong> in equity Futures and Options Segment, incurred net losses.
                      </li>
                      <li>
                        On an average, loss makers registered net trading loss close to <strong className="text-white font-mono">₹ 50,000</strong>.
                      </li>
                      <li>
                        Over and above the net trading losses incurred, loss makers expended an additional <strong className="text-white font-mono">28%</strong> of net trading losses as transaction costs.
                      </li>
                      <li>
                        Those making net trading profits, incurred between <strong className="text-white font-mono">15% to 50%</strong> of such profits as transaction cost.
                      </li>
                    </ul>

                    <div className="pt-4 text-xs text-white/60 border-t border-white/15 space-y-1.5">
                      <div className="font-semibold text-white">Source:</div>
                      <p className="italic leading-relaxed">
                        1. SEBI study dated January 25, 2023 on "Analysis of Profit and Loss of Individual Traders dealing in equity Futures and Options (F&O) Segment", wherein Aggregate Level findings are based on annual Profit/Loss incurred by individual traders in equity F&O during FY 2021-22.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 8: Investor Complaints Data */}
              {activeTab === 'complaints' && (
                <div className="space-y-10 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Investor Complaints Data
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      Disclosures of investor complaints for Money Logix Securities Pvt Ltd in accordance with SEBI regulations.
                    </p>
                  </div>

                  {/* Table 1: Month Ending June 2026 */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Investor Complaints Data for Money Logix Securities Pvt Ltd
                      </h3>
                      <span className="font-mono text-xs font-semibold text-white/70 bg-white/10 px-2.5 py-1 rounded">
                        Data for Month ending – JUNE-2026
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">Sr. No</th>
                            <th className="p-3">Received From</th>
                            <th className="p-3">Carried Forward from previous month</th>
                            <th className="p-3">Received During the month</th>
                            <th className="p-3">Total Pending</th>
                            <th className="p-3">Resolved</th>
                            <th className="p-3">Pending for less than 3 months</th>
                            <th className="p-3">Pending for more than 3 months</th>
                            <th className="p-3">Average Resolution Time (in days)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">1</td>
                            <td className="p-3 font-medium text-white">Directly from Investors</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">2</td>
                            <td className="p-3 font-medium text-white">SEBI ( Scores )</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3"></td>
                            <td className="p-3 text-white/70 pl-6">BSE</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3"></td>
                            <td className="p-3 text-white/70 pl-6">NSE</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">3</td>
                            <td className="p-3 font-medium text-white">CDSL DP</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">4</td>
                            <td className="p-3 font-medium text-white">Other sources (if any)</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                          </tr>
                          <tr className="bg-white/10 font-bold text-white">
                            <td className="p-3"></td>
                            <td className="p-3">Grand Total</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 2: Monthly Complaint Details */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        MONTHLY COMPLAINT DETAILS
                      </h3>
                      <p className="text-xs text-white/60">
                        Trend of Monthly Disposal of Complaints (July 2025 – June 2026)
                      </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">Sr. No</th>
                            <th className="p-3">Month</th>
                            <th className="p-3">Carried forward from previous month</th>
                            <th className="p-3">Received</th>
                            <th className="p-3">Resolved</th>
                            <th className="p-3">Pending</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80 font-mono">
                          {[
                            { sr: 1, month: 'July 2025' },
                            { sr: 2, month: 'August 2025' },
                            { sr: 3, month: 'September 2025' },
                            { sr: 4, month: 'October 2025' },
                            { sr: 5, month: 'November 2025' },
                            { sr: 6, month: 'December 2025' },
                            { sr: 7, month: 'January 2026' },
                            { sr: 8, month: 'February 2026' },
                            { sr: 9, month: 'March 2026' },
                            { sr: 10, month: 'April 2026' },
                            { sr: 11, month: 'May 2026' },
                            { sr: 12, month: 'June 2026' },
                          ].map((row) => (
                            <tr key={row.sr} className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white font-sans">{row.sr}</td>
                              <td className="p-3 font-medium text-white font-sans">{row.month}</td>
                              <td className="p-3">0</td>
                              <td className="p-3">0</td>
                              <td className="p-3">0</td>
                              <td className="p-3">0</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 3: Annual Complaint Details */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        ANNUAL COMPLAINT DETAILS
                      </h3>
                      <p className="text-xs text-white/60">
                        Trend of Annual Disposal of Complaints as on 30.06.2026
                      </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">Sr. No</th>
                            <th className="p-3">Year</th>
                            <th className="p-3">Carried forward from previous year</th>
                            <th className="p-3">Received During the year</th>
                            <th className="p-3">Resolved during the year</th>
                            <th className="p-3">Pending at the end of the year</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80 font-mono">
                          {[
                            { sr: 1, year: '2019-2020' },
                            { sr: 2, year: '2020-2021' },
                            { sr: 3, year: '2021-2022' },
                            { sr: 4, year: '2022-2023' },
                            { sr: 5, year: '2023-2024' },
                            { sr: 6, year: '2024-2025' },
                            { sr: 7, year: '2025-2026' },
                          ].map((row) => (
                            <tr key={row.sr} className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white font-sans">{row.sr}</td>
                              <td className="p-3 font-medium text-white font-sans">{row.year}</td>
                              <td className="p-3">0</td>
                              <td className="p-3">0</td>
                              <td className="p-3">0</td>
                              <td className="p-3">0</td>
                            </tr>
                          ))}
                          <tr className="bg-white/10 font-bold text-white font-sans">
                            <td className="p-3"></td>
                            <td className="p-3">Total</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                            <td className="p-3 font-mono">0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      {/* Standalone QR Code Modal Dialog */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 isolate">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowQrModal(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-[#0c0c0e] p-6 text-center shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="font-display text-lg font-bold text-white mb-1">
              Official UPI QR Code
            </h3>
            <p className="text-xs text-white/60 mb-4">
              Money Logix Securities Pvt Ltd
            </p>
            <div className="rounded-2xl border border-white/15 bg-white p-3 inline-block shadow-lg">
              <img
                src="/upi-qr.jpg"
                alt="Money Logix Securities Pvt Ltd UPI QR Code"
                className="w-60 h-60 object-contain rounded-xl"
              />
            </div>
            <div className="mt-4 font-mono text-xs text-white/80 bg-white/5 p-2 rounded-xl border border-white/10">
              moneylogix.brk@validhdfc
            </div>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="mt-5 w-full rounded-xl bg-white text-black py-2.5 text-xs font-bold hover:bg-white/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-[#040405] text-xs text-white/50">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>
              © 2026 Money Logix Securities Pvt Ltd. All rights reserved.
            </p>
            <p className="font-mono font-medium text-white/60">
              SEBI Stock Broker Reg: INZ000235531 · CDSL DP ID: 12063900
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
