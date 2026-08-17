import { useState } from 'react'
import { FileText, Lock, DollarSign, ArrowLeft, AlertTriangle, LifeBuoy, Scale, Building2, FileSpreadsheet, Layers, Tag, ShieldCheck } from 'lucide-react'
import ThinqMark from '../ui/ThinqMark'
import Container from '../ui/Container'

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<
    | 'terms'
    | 'privacy'
    | 'consents'
    | 'tariff'
    | 'policies'
    | 'grievance'
    | 'escalation'
    | 'bank'
    | 'risk'
    | 'complaints'
    | 'cookies'
  >('bank')


  const handleBackToHome = (e: React.MouseEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

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
            <a href="/" onClick={handleBackToHome} className="flex items-center gap-3 group">
              <ThinqMark size={32} tone="steel" />
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white group-hover:text-white/80 transition-colors">
                Thinq
              </span>
            </a>

            {/* Back to Home Button */}
            <a
              href="/"
              onClick={handleBackToHome}
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
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Terms & Regulatory Framework
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              Verbatim legal terms, DPDP 2023 privacy policy (14 points), consent catalogue (5 sections), tariff schedule (3 complete tables & disclosures), policies & procedures (9 clauses), official Escalation Matrix & grievance redressal, risk disclosures, investor complaints data (monthly & annual trends), and USCNB bank details.
            </p>

            {/* Statutory Registered Entity Details Card */}
            <div className="mt-8 rounded-2xl bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl text-xs sm:text-sm text-white/85 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-lg">
              <div>
                <span className="font-semibold text-white">Money Logix Securities Private Limited</span>, trading as Thinq
                <div className="text-white/60 text-xs mt-1 leading-relaxed">
                  Registered office: Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai 400 050 · CIN: U64990MH2006PTC165522 · GSTIN: 27AAECM8621N1Z0
                </div>
                <div className="text-white/60 text-xs mt-0.5">
                  SEBI Reg: <span className="font-mono font-semibold text-white">INZ000235531</span> · CDSL DP ID: <span className="font-mono font-semibold text-white">12063900</span> (IN-DP-22-2015) · NSE: 12971 · BSE: 3246
                </div>
                <div className="text-white/70 text-xs mt-1 font-mono">
                  Compliance, Grievance & Data Protection Officer: <span className="text-white font-semibold">Manoj T. Mahamunkar</span> (mahamunkarmanoj@moneylogix.in · 8425853815)
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Document Content */}
      <main className="relative z-10 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-5xl">
            {/* Tab Control Bar - 11 Responsive Tab Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5 sm:gap-2 mb-8">
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'terms'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Terms</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Lock className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Privacy</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('consents')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'consents'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Consents</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tariff')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'tariff'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <DollarSign className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Tariff</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('policies')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'policies'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Scale className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Policies</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('escalation')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'escalation'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Escalation Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('grievance')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'grievance'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <LifeBuoy className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Grievance</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'bank'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">USCNB</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('risk')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'risk'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Risk</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'complaints'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Complaints</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cookies')}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                  activeTab === 'cookies'
                    ? 'bg-white text-black font-bold shadow-[0_0_24px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Tag className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Cookies</span>
              </button>
            </div>

            {/* Document Body Card Frame */}
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#09090c]/90 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
              {/* Top Specular Edge Highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

              {/* Tab 7: USCNB & Bank */}
              {activeTab === 'bank' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Upstreaming Client Bank Nodal Account (USCNB)
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5 space-y-3 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-white/50 text-xs block">ACCOUNT NAME</span>
                        <span className="font-mono font-bold text-white text-sm sm:text-base">MONEY LOGIX SECURITIES PVT LTD - USCNB A/C</span>
                      </div>
                      <div>
                        <span className="text-white/50 text-xs block">BANK NAME</span>
                        <span className="font-semibold text-white text-sm sm:text-base">HDFC BANK LTD</span>
                      </div>
                      <div>
                        <span className="text-white/50 text-xs block">ACCOUNT NUMBER</span>
                        <span className="font-mono font-bold text-white text-sm sm:text-base tracking-wider">00600340039678</span>
                      </div>
                      <div>
                        <span className="text-white/50 text-xs block">IFSC CODE</span>
                        <span className="font-mono font-bold text-white text-sm sm:text-base">HDFC0000060</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Escalation Matrix */}
              {activeTab === 'escalation' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Money Logix Securities Private Limited</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Escalation Matrix:
                    </h2>
                  </div>

                  {/* Verbatim Escalation Matrix Table */}
                  <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                        <tr>
                          <th className="p-3.5 border-r border-white/10">Details</th>
                          <th className="p-3.5 border-r border-white/10">Contact Person</th>
                          <th className="p-3.5 border-r border-white/10">Address</th>
                          <th className="p-3.5 border-r border-white/10">Time</th>
                          <th className="p-3.5 border-r border-white/10">Contact No.</th>
                          <th className="p-3.5">Person Email ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-white/90">
                        <tr className="hover:bg-white/[0.02]">
                          <td className="p-3.5 font-bold text-white border-r border-white/10">Customer Care</td>
                          <td className="p-3.5 font-semibold text-white border-r border-white/10">Sunil Dharse</td>
                          <td className="p-3.5 text-white/80 border-r border-white/10">
                            Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050
                          </td>
                          <td className="p-3.5 text-white/80 border-r border-white/10">
                            Monday to Friday 9:30 AM to 5:30 PM &<br />
                            Sat: - 9:30 AM to 3:00 PM
                          </td>
                          <td className="p-3.5 font-mono font-bold text-white border-r border-white/10">8425853808</td>
                          <td className="p-3.5 font-mono text-white">moneylogixs@gmail.com</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                          <td className="p-3.5 font-bold text-white border-r border-white/10">Client Care Head</td>
                          <td className="p-3.5 font-semibold text-white border-r border-white/10">Kalpesh chichhiya</td>
                          <td className="p-3.5 text-white/80 border-r border-white/10">
                            Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050
                          </td>
                          <td className="p-3.5 text-white/80 border-r border-white/10">
                            Monday to Friday 9:30 AM to 5:30 PM &<br />
                            Sat: - 9:30 AM to 3:00 PM
                          </td>
                          <td className="p-3.5 font-mono font-bold text-white border-r border-white/10">8291079922</td>
                          <td className="p-3.5 font-mono text-white">kalpeshbhatiya@yahoo.com</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                          <td className="p-3.5 font-bold text-white border-r border-white/10">Compliance Officer</td>
                          <td className="p-3.5 font-semibold text-white border-r border-white/10">Manoj T. Mahamunkar.</td>
                          <td className="p-3.5 text-white/80 border-r border-white/10">
                            Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050
                          </td>
                          <td className="p-3.5 text-white/80 border-r border-white/10">
                            Monday to Friday 9:30 AM to 5:30 PM &<br />
                            Sat: - 9:30 AM to 3:00 PM
                          </td>
                          <td className="p-3.5 font-mono font-bold text-white border-r border-white/10">8425853815</td>
                          <td className="p-3.5 font-mono text-white">mahamunkarmanoj@moneylogix.in</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5 space-y-3 text-xs sm:text-sm text-white/90">
                    <p className="font-semibold text-white">
                      In absence of response/complaint not addressed to your satisfaction, you may lodge a complaint with SEBI at
                    </p>
                    <p className="font-mono text-white">
                      <a
                        href="https://scores.gov.in/scores/Welcome.html"
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-white/80 text-teal-400"
                      >
                        https://scores.gov.in/scores/Welcome.html
                      </a>
                    </p>
                    <p className="font-semibold text-white">or Exchange at</p>
                    <p className="font-mono text-white">
                      <a
                        href="https://bsecrs.bseindia.com/ecomplaint/frmInvestorHome.aspx"
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-white/80 text-teal-400"
                      >
                        https://bsecrs.bseindia.com/ecomplaint/frmInvestorHome.aspx
                      </a>
                    </p>
                    <p className="font-bold text-white pt-2 border-t border-white/10">
                      Please quote your Service Ticket/Complaint Ref No. while raising your complaint at SEBI SCORES/Exchange portal.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 1: Terms of Use */}
              {activeTab === 'terms' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Appendix A · /legal/terms</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Terms of Use
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      Last updated 13 August 2026
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-white/80">
                    <strong className="text-white">Thinq</strong> is the brand under which <strong className="text-white">Money Logix Securities Private Limited</strong> provides its services. These Terms govern your use of the Thinq website at <strong className="text-white">thinq.co</strong> and the Thinq mobile application (together, the “Thinq Platform”). Please read them before you use the Platform. If you do not agree with them, please do not use it.
                  </p>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-xs sm:text-sm text-white/90">
                    <strong className="text-white">This is a consumer contract.</strong> Thinq serves individual investors, not businesses or institutions. Nothing in these Terms takes away any right you have under the <strong className="text-white">Consumer Protection Act, 2019</strong> or any other law that protects consumers — where a term here conflicts with such a right, that right prevails.
                  </div>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">1. Acceptance</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      By accessing or using the Thinq Platform, its services or its products, you agree to these Terms of Use, our <strong className="text-white">Privacy Policy</strong> and our <strong className="text-white">Tariff</strong>. Together they form the agreement between you and <strong className="text-white">Money Logix Securities Private Limited (“Thinq”, “we”, “us”)</strong>.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">2. Who may use Thinq</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Thinq is for <strong className="text-white">individual investors</strong>. You may open and hold an account if you are <strong className="text-white">18 years of age or older</strong>, are legally able to enter into a binding contract, and are a <strong className="text-white">resident individual</strong> in India.
                    </p>
                    <p className="text-sm leading-relaxed text-white/80">
                      We do not currently offer accounts to minors, non-resident individuals, HUFs, partnerships, companies or any other non-individual entity. An account is <strong className="text-white">personal to you</strong> — you may not open or operate one on someone else's behalf.
                    </p>
                    <p className="text-sm leading-relaxed text-white/80">
                      You confirm that the information you give us is true and complete, and that you will tell us if it changes.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">3. Your licence to use the Platform</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We grant you a <strong className="text-white">limited, non-exclusive, non-transferable and revocable</strong> right to access and use the Thinq Platform for your own personal, non-commercial use. This licence lasts as long as your account is open and in good standing.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">4. What you may not do</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-white/80 leading-relaxed">
                      <li>Copy, reproduce, sell, sub-licence, redistribute, publish or create derivative works from any part of the Platform or its content.</li>
                      <li>Use any robot, scraper or automated means to access the Platform or extract data from it.</li>
                      <li>Attempt to gain unauthorised access to the Platform, any account other than your own, or any connected system.</li>
                      <li>Interfere with the Platform's operation, security or availability.</li>
                      <li>Use the Platform for anything unlawful, or to trade on behalf of another person.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">5. Your account and its security</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Your account is personal to you and may not be shared, transferred or operated by anyone else.
                    </p>
                    <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-4 text-xs sm:text-sm text-white/90">
                      <strong className="text-white block mb-1">Anti-Phishing Notice:</strong>
                      We will never ask you for your PIN, an OTP, or your password — by call, message, email or any other route. Nobody at Thinq has a legitimate reason to ask. If someone does, it is not us. Tell us immediately at <span className="font-mono text-white font-semibold">support@moneylogix.in</span> if you think someone else has access to your account.
                    </div>
                    <p className="text-sm leading-relaxed text-white/80 mt-2">
                      You are responsible for activity on your account, except where it results from our own failure.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">6. Intellectual property</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Other than content you provide, everything on the Thinq Platform — its design, software, text, graphics, logos and data, including the <strong className="text-white">Thinq</strong> name and mark — belongs to <strong className="text-white">Money Logix Securities Private Limited (“Thinq”)</strong> or its licensors, and is protected by law. Nothing in these Terms transfers ownership of it to you.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">7. The Platform is provided “as is”</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      The Thinq Platform is provided on an <strong className="text-white">“as is” and “as available”</strong> basis. We work hard to keep it accurate and available, but we do not warrant that it will be uninterrupted, error-free, or free of delay — market data, connectivity and third-party systems are outside our control. Nothing on the Platform is investment advice or a recommendation to buy or sell.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">8. Limitation of liability</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      To the maximum extent permitted by law, <strong className="text-white">Money Logix Securities Private Limited (“Thinq”)</strong>, its group companies, directors, officers, employees and agents are not liable for any <strong className="text-white">indirect, incidental, special or consequential loss</strong>, or for loss of profit, revenue, data or opportunity, arising from your use of the Platform.
                    </p>
                    <p className="text-sm leading-relaxed text-white/80">
                      <strong className="text-white">Nothing here limits liability that cannot be limited by law</strong> — including liability for fraud, for wilful misconduct, for gross negligence, or any liability owed to you as a consumer under the Consumer Protection Act, 2019.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">9. Indemnity</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      If we suffer a loss because you have <strong className="text-white">deliberately or negligently</strong> breached these Terms, misused the Platform, or broken the law, you agree to make good that loss — limited to what was reasonably foreseeable and directly caused by what you did. This does not apply to an honest mistake, and it does not apply where the loss was caused or contributed to by us.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">10. Suspension and termination</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We may restrict, suspend or close your access to the Platform where we are directed to by a regulator, where we reasonably suspect fraud or misuse, where your KYC is deficient, or where amounts due to us are unpaid. Where we can, we will tell you first and explain why. You may close your account at any time — see <strong className="text-white">Policies & Procedures</strong>, clause 8.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">11. Events outside our control</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We are not liable for failure or delay caused by events beyond our reasonable control, including exchange or depository outages, telecom or power failure, cyber-attack, natural disaster, or regulatory action.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">12. Changes to these Terms</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We may revise these Terms. <strong className="text-white">We will tell you before a change takes effect</strong>, and your continued use of the Platform after that date means you accept the revised Terms. <strong className="text-white">Where a change is material — including any change to something you have consented to — we will ask you to accept it again.</strong> We will not treat your silence, or your continued use, as agreement to a material change.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">13. Governing law</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      These Terms are governed by the laws of India, and disputes are subject to the courts at <strong className="text-white">Mumbai</strong> and to any applicable arbitration under the Arbitration and Conciliation Act, 1996. As a consumer you keep your right under the Consumer Protection Act, 2019 to approach the consumer commission with jurisdiction over the place where you reside or work.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">14. Read these with</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Our <strong className="text-white">Privacy Policy</strong>, <strong className="text-white">Tariff</strong>, <strong className="text-white">Policies & Procedures</strong>, and the SEBI-mandated client registration documents — Rights & Obligations, the Risk Disclosure Document, Guidance Note (Do's & Don'ts), Most Important Terms & Conditions and the Investor Charter — together with the Depository (Beneficial Owner–Depository Participant) terms.
                    </p>
                  </section>
                </div>
              )}

              {/* Tab 2: Privacy Policy */}
              {activeTab === 'privacy' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Appendix B · /legal/privacy</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Privacy Policy (All 14 Sections Complete Text)
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      Prepared under the Digital Personal Data Protection Act, 2023 · Last updated 13 August 2026
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-white/80">
                    This policy explains what personal data we collect, why we need it, who we share it with, how long we keep it, and the rights you have over it. We have tried to write it in plain language rather than legal shorthand.
                  </p>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">1. Who we are</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      <strong className="text-white">Money Logix Securities Private Limited</strong>, which trades under the brand <strong className="text-white">Thinq</strong> at <strong className="text-white">thinq.co</strong>, of Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai 400050. We are the <strong className="text-white">Data Fiduciary</strong> for the personal data described here — meaning we decide why and how it is processed, and we are answerable for it.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">2. What we collect, and why</h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">What</th>
                            <th className="p-3">Why we need it</th>
                            <th className="p-3">Our lawful basis</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr>
                            <td className="p-3 font-medium text-white">Identity — name, PAN, date of birth, father's name, photograph, signature</td>
                            <td className="p-3">SEBI requires us to verify who you are before opening an account</td>
                            <td className="p-3">Legal obligation</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Mobile number & PAN/bank lookup</td>
                            <td className="p-3">So you can confirm details instead of typing them, and so we can check they match your KYC record</td>
                            <td className="p-3 font-semibold text-white">Your consent</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Aadhaar-derived (DigiLocker address, last 4 digits)</td>
                            <td className="p-3">Address proof and electronic signature of your account opening form</td>
                            <td className="p-3 font-semibold text-white">Your consent</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Contact — mobile number, email address</td>
                            <td className="p-3">To operate your account and send contract notes and statements</td>
                            <td className="p-3">Performing our contract</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Camera, microphone & location (IPV selfie/video)</td>
                            <td className="p-3">SEBI-mandated in-person verification, done digitally, and a geo-tagged audit trail</td>
                            <td className="p-3">Legal obligation</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Bank account number, IFSC & holder name</td>
                            <td className="p-3">To settle funds to you, and to confirm the account is yours</td>
                            <td className="p-3">Performing our contract</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Bank statement / Account Aggregator (F&O)</td>
                            <td className="p-3">SEBI requires proof of income before derivatives can be activated</td>
                            <td className="p-3 font-semibold text-white">Your consent</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">About you (marital status, occupation, income)</td>
                            <td className="p-3">SEBI KYC requires a risk and suitability profile</td>
                            <td className="p-3">Legal obligation</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Declarations — FATCA/CRS & PEP</td>
                            <td className="p-3">Required by law; both are declarations you make</td>
                            <td className="p-3">Legal obligation</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Screening results (sanctions, PEP, risk score)</td>
                            <td className="p-3">Anti-money-laundering law requires us to screen every applicant</td>
                            <td className="p-3">Legal obligation</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Nominee details (or opt-out choice)</td>
                            <td className="p-3">SEBI requires you to nominate or expressly opt out</td>
                            <td className="p-3">Legal obligation</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Regulatory identifiers (CKYC, KRA, UCC, BO ID)</td>
                            <td className="p-3">Created when your account is registered with CDSL & exchanges</td>
                            <td className="p-3">Legal obligation</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">Usage (device, browser, IP, app interaction logs)</td>
                            <td className="p-3">Security, fraud prevention and improving the service</td>
                            <td className="p-3">Legitimate use / consent</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">3. Your bank statement, if you trade derivatives</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      To activate F&O or Commodity, SEBI requires proof that you can bear the risk. You choose how to give it to us: through an <strong className="text-white">Account Aggregator</strong> (one-time share), or by <strong className="text-white">uploading a statement, salary slip or ITR</strong> yourself. If you choose equity only, we never ask for any of this.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">4. Screening, and how decisions are made</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Anti-money-laundering law requires us to screen every applicant against sanctions and watchlists. <strong className="text-white">A machine can pass your application, but only a person can refuse it.</strong> Anything unclear goes to a trained reviewer — no application is rejected by an automated decision alone.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">5. Aadhaar</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We never store your full Aadhaar number and never display more than the last four digits. We fetch Aadhaar data only after you have expressly consented, only through DigiLocker or another licensed route, and only to verify your identity and address and to electronically sign your account opening form.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">6. Who we share it with</h3>
                    <p className="text-xs text-white/70">We do not sell personal data. We share it only where a specific purpose requires it:</p>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">Who</th>
                            <th className="p-3">What, and why</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr><td className="p-3 font-medium text-white">Regulators and market infrastructure</td><td className="p-3">SEBI, the exchanges (NSE, BSE), CDSL depository, KRAs and CERSAI — identity and account info</td></tr>
                          <tr><td className="p-3 font-medium text-white">Government-approved verification partners</td><td className="p-3">To verify PAN, Aadhaar, bank account and liveness under contract</td></tr>
                          <tr><td className="p-3 font-medium text-white">Banking and payment partners</td><td className="p-3">To verify your bank account and settle funds</td></tr>
                          <tr><td className="p-3 font-medium text-white">Service providers</td><td className="p-3">Cloud hosting, message delivery and support tooling under confidentiality</td></tr>
                          <tr><td className="p-3 font-medium text-white">Courts and law enforcement</td><td className="p-3">Where we are legally compelled</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">7. Where it is processed</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Your personal data is stored and processed <strong className="text-white">in India</strong>. We do not transfer it outside India, and none of our processors operate outside India.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">8. How long we keep it</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Where SEBI or the PMLA requires us to retain records, we keep them for <strong className="text-white font-mono">8 years</strong> for transaction and KYC records — even after you close your account. Abandoned applications are deleted after <strong className="text-white font-mono">30 days</strong>.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">9. Your rights under DPDP Act 2023</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80 leading-relaxed">
                      <li><strong className="text-white">Access:</strong> Summary of personal data held and recipient categories.</li>
                      <li><strong className="text-white">Correct & Complete:</strong> Correct inaccurate data and complete missing info.</li>
                      <li><strong className="text-white">Erase:</strong> Erase data no longer needed, subject to statutory retention.</li>
                      <li><strong className="text-white">Withdraw Consent:</strong> Withdraw marketing consent in &lt; 60 seconds without affecting account status.</li>
                      <li><strong className="text-white">Nominate & Complain:</strong> Nominate representatives and complain to us or Data Protection Board of India.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">10. Grievance Officer and Data Protection Officer</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Data Protection Officer & Compliance Officer: <strong className="text-white">Manoj T. Mahamunkar</strong> — <span className="font-mono text-white">mahamunkarmanoj@moneylogix.in</span> · <span className="font-mono text-white">8425853815</span> · Registered address above. You may also write to <span className="font-mono text-white">ig@moneylogix.in</span>.
                    </p>
                  </section>

                  <section className="space-y-2 pt-2 border-t border-white/10">
                    <h3 className="text-base sm:text-lg font-bold text-white">11. How we protect it</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Data is encrypted in transit and at rest. Access inside Thinq is role-based and logged, and personal details are masked by default in our internal tools — revealing them requires a recorded reason and a second authentication factor.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">12. Children</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Thinq accounts are for individuals aged 18 and over, and we do not knowingly collect data from children. Where the <strong className="text-white">nominee</strong> you name is a minor, we collect their guardian's details because SEBI requires it — that is nominee record-keeping, not an account for a child.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">13. Cookies</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      See our <strong className="text-white">Cookie Policy</strong> tab (Appendix G).
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">14. Changes to this policy</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We will tell you before this policy changes. <strong className="text-white">Where a change is material — including any change to what you have consented to — we will ask you to accept it again</strong>, rather than relying on your continued use.
                    </p>
                  </section>
                </div>
              )}

              {/* Tab 3: Consents */}
              {activeTab === 'consents' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Appendix C · /legal/consents</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Consents Catalogue
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      What you agree to when you open an account · Last updated 13 August 2026
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-white/80">
                    Before we can open your account we need your agreement to a few specific things. This page lists every one of them, in the words you see on screen, so you can read them here rather than only in the moment.
                  </p>

                  <section className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">1. Shown on the welcome screen</h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">What you agree to</th>
                            <th className="p-3">Why it is needed</th>
                            <th className="p-3">Can you decline?</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr>
                            <td className="p-3 font-medium text-white">“I consent to Thinq processing my information to open and provision my account.”</td>
                            <td className="p-3">Without this we cannot open or run the account at all</td>
                            <td className="p-3 font-semibold text-white">Required</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">“I consent to Thinq fetching my KRA / CKYC records.”</td>
                            <td className="p-3">Lets us reuse your prior KYC instead of asking again</td>
                            <td className="p-3 font-semibold text-white">Required</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">“I consent to Thinq fetching my Aadhaar details via DigiLocker.”</td>
                            <td className="p-3">Address proof and electronic signature of your account opening form</td>
                            <td className="p-3 font-semibold text-white">Required</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">“I consent to Thinq using my mobile number to fetch my PAN, bank accounts & KYC details from Govt.-approved partners.”</td>
                            <td className="p-3">Lets you confirm details rather than type them in</td>
                            <td className="p-3 font-semibold text-white">Required</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-white">“Send me marketing & promotional communications.”</td>
                            <td className="p-3">News, offers and product updates</td>
                            <td className="p-3 font-semibold text-white">Withdrawable post-onboarding (&lt; 60s)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">2. Signed with your Aadhaar at the end</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      When you e-Sign your account opening form, you accept the documents SEBI and the depository require — Rights & Obligations, the Risk Disclosure Document, the Guidance Note, Most Important Terms & Conditions, Policies & Procedures, the Tariff, the FATCA and PMLA declarations, and the Depository terms.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">3. Two more you give as you go</h3>
                    <p className="text-sm font-semibold text-white mt-2">Contract notes and account communications by email:</p>
                    <p className="text-sm leading-relaxed text-white/80 italic pl-3 border-l-2 border-white/20">
                      “Send my contract notes, statements and other account communications to my registered email address.”
                    </p>
                    <p className="text-xs text-white/70">
                      You can switch to physical copies at any time — just tell us, and we will send them to your registered address.
                    </p>

                    <p className="text-sm font-semibold text-white mt-4">Regulatory history and connections:</p>
                    <p className="text-sm leading-relaxed text-white/80">
                      SEBI requires us to ask two things before opening your account: (a) whether any action or proceeding has been taken or is pending against you by SEBI/exchange in the last 3 years, and (b) whether you are a director/employee of an exchange or related to an exchange member. <strong className="text-white">Answering yes to either does not disqualify you.</strong>
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">4. Changing your mind</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      You can turn <strong className="text-white">marketing communications</strong> off at any time from <strong className="text-white">Profile → Privacy</strong>, and it takes effect within a minute.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">5. What we keep</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Every consent is recorded with what you agreed to, the exact wording you saw, and when. You can ask us for that record at any time.
                    </p>
                  </section>
                </div>
              )}

              {/* Tab 4: Tariff & Charges */}
              {activeTab === 'tariff' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Appendix D · /legal/tariff</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Tariff & Charges (Full Verbatim Copy)
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      Effective 13 August 2026
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-white/80">
                    Zero account opening. Zero brokerage on <strong className="text-white">equity, F&O and commodity</strong>. Zero maintenance. For your first <strong className="text-white">six months</strong> from the day your account is activated, Thinq charges you nothing.
                  </p>
                  <p className="text-xs text-white/70">
                    Government and exchange levies still apply — we cannot waive those, and no broker can. They are listed below at cost.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">Account Charges</h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3.5">Item</th>
                            <th className="p-3.5">Charge</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr><td className="p-3.5 font-medium text-white">Account opening — trading and demat</td><td className="p-3.5 font-bold text-white">₹0</td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Trading account maintenance</td><td className="p-3.5 font-bold text-white">₹0</td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Demat account maintenance (AMC)</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">Brokerage Charges</h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3.5">Segment</th>
                            <th className="p-3.5">Charge</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr><td className="p-3.5 font-medium text-white">Equity delivery</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Equity intraday</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Futures</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Options</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Commodity derivatives</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">Depository (CDSL) Charges</h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3.5">Item</th>
                            <th className="p-3.5">Charge</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr><td className="p-3.5 font-medium text-white">Debit per ISIN (sell)</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Pledge / unpledge</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Client Master Report — issue and re-issue</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(always)</span></td></tr>
                          <tr><td className="p-3.5 font-medium text-white">Rematerialisation</td><td className="p-3.5 font-bold text-white">₹0 <span className="text-white/60 font-normal">(first 6 months)</span></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <h3 className="text-base font-bold text-white">What is not free, and cannot be</h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-white/80">
                      <strong className="text-white">Securities Transaction Tax, exchange transaction charges, SEBI turnover fees, stamp duty and GST</strong> are levied by the government, the exchanges and the depository — not by us. We pass them through <strong className="text-white">at cost</strong>, add nothing to them, and cannot waive them. They apply from day one. Current statutory rates change from time to time.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">Other charges</h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-white/80">
                      Payment gateway, physical statements and call-and-trade: <strong className="text-white">₹0 for the first six months</strong>. Delayed payment interest, and auction and short-delivery penalties, are charged at the applicable rates throughout — they arise from your own position and are not part of the introductory offer.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-xs sm:text-sm text-white/85 space-y-1.5">
                    <div className="font-bold text-white">What happens after six months</div>
                    <p className="leading-relaxed">
                      Charges from month seven onward will be published transparently. We will tell you <strong className="text-white">at least 30 days before</strong> the introductory period ends, and again before any later increase — so you always know what you will pay before you pay it.
                    </p>
                    <p className="font-semibold text-white">
                      We will not levy any charge that is not published on this page.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 5: Policies & Procedures */}
              {activeTab === 'policies' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Appendix E · /legal/policies</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Policies & Procedures (All 9 Clauses Unabridged)
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      Published under SEBI requirements for stock brokers · Last updated 13 August 2026
                    </p>
                  </div>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">1. Change in brokerage</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We may revise brokerage rates with <strong className="text-white">at least 30 days' written notice</strong>, sent to your registered email address. If you continue trading after the effective date, the revised rates apply.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">2. Inactive and dormant accounts</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      An account with <strong className="text-white">no transaction for 12 months</strong> is marked dormant and trading is disabled until it is reactivated. Reactivating takes a short re-verification of your identity and contact details.
                    </p>
                    <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-xs sm:text-sm text-white/90">
                      <strong className="text-white block mb-0.5">Dormancy Protection Guarantee:</strong>
                      Your holdings and any credit balance are not affected by dormancy. They remain yours and are returned to you on request at any time.
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">3. Running account settlement</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Unused credit in your account is returned to your registered bank account on the cycle you chose when you opened it, in line with SEBI's running account rules:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-white/80">
                      <li><strong className="text-white">Quarterly — every 90 days</strong> (default)</li>
                      <li><strong className="text-white">Monthly — every 30 days</strong></li>
                    </ul>
                    <p className="text-sm leading-relaxed text-white/80">
                      You can change the cycle at any time from <strong className="text-white">Profile → Settings</strong>. We retain only what the exchanges permit us to hold against your margin obligations; everything else comes back to you on the chosen date, whether or not you ask.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">4. Penny stocks and illiquid securities</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We may refuse or restrict orders in securities we classify as illiquid, those in the Trade-to-Trade segment, and those under exchange surveillance frameworks such as GSM or ASM. These lists change; the current restrictions are shown in the app when you place the order.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">5. Exposure and margin limits</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Limits are set by regulation and by our own assessment of risk. Where market conditions change quickly we may have to vary them <strong className="text-white">immediately and without prior notice</strong> — but we will tell you as soon as we reasonably can, and explain why. We are not obliged to extend any particular limit to you.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">6. Right to sell securities or close positions</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      If a debit balance or margin shortfall is not cleared by T+1, we may close positions or sell securities pledged with us to recover it. <strong className="text-white">We will notify you first</strong> — at your registered email and mobile — and give you 24 hours to clear it yourself, unless market conditions make waiting impossible. We will sell no more than is needed to cover the shortfall, and any amount still outstanding stays payable by you.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">7. Temporary suspension</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      You may ask us in writing to suspend your account. We may suspend it where a regulator directs us to, where we reasonably suspect fraud, where your KYC is deficient, or where amounts due are unpaid. Suspension does not cancel obligations already incurred.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">8. Closing your account</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      Either of us may end the relationship. Before closure we will settle your funds and transfer or rematerialise your holdings. Obligations that arose before closure survive it. Closing an account does not prevent you from opening one again later.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">9. Conflicts of interest</h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      We trade on our own account only as regulation permits, we do not use client order information for proprietary advantage, and we disclose any material conflict that could affect you.
                    </p>
                  </section>
                </div>
              )}

              {/* Tab 6: Grievance Redressal */}
              {activeTab === 'grievance' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Appendix F · /legal/grievance</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Grievance Redressal & Escalation Matrix (Complete Spec)
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      Escalation matrix published under SEBI requirements · Last updated 13 August 2026
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-white/80">
                    If something has gone wrong, tell us — <span className="font-mono font-semibold text-white">support@moneylogix.in</span> is the fastest route and most things are resolved there. If yours is not, here is exactly where to go next and how long each stage should take.
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Complaints about your <strong className="text-white">trading account</strong> and your <strong className="text-white">demat account</strong> go to different addresses, because they sit under different regulators — the exchanges and the depository respectively. If you are not sure which yours is, write to either and we will route it internally.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-white">Internal Escalation Matrix (PRD Spec):</h3>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">Step</th>
                            <th className="p-3">Who</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Response SLA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr><td className="p-3 font-bold text-white">1</td><td className="p-3 font-medium text-white">Customer Support</td><td className="p-3 font-mono text-white">support@moneylogix.in</td><td className="p-3 font-semibold text-white">T+1 working day</td></tr>
                          <tr><td className="p-3 font-bold text-white">2</td><td className="p-3 font-medium text-white">Stock Broking Complaints (trading account)</td><td className="p-3 font-mono text-white">complaints@moneylogix.in</td><td className="p-3 font-semibold text-white">7 working days</td></tr>
                          <tr><td className="p-3 font-bold text-white">2</td><td className="p-3 font-medium text-white">Depository Participant Complaints (demat account)</td><td className="p-3 font-mono text-white">bogrievances@moneylogix.in</td><td className="p-3 font-semibold text-white">7 working days</td></tr>
                          <tr><td className="p-3 font-bold text-white">3</td><td className="p-3 font-medium text-white">Investor Grievance</td><td className="p-3 font-mono text-white">ig@moneylogix.in</td><td className="p-3 font-semibold text-white">7 working days</td></tr>
                          <tr><td className="p-3 font-bold text-white">4</td><td className="p-3 font-medium text-white">Compliance & Grievance Officer (Manoj T. Mahamunkar)</td><td className="p-3 font-mono text-white">mahamunkarmanoj@moneylogix.in · 8425853815</td><td className="p-3 font-semibold text-white">7 working days</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-base font-bold text-white">Official Officer Contact Matrix:</h3>
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
                            <td className="p-3 text-white/70">Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050</td>
                            <td className="p-3 text-white/70">Monday to Friday 9:30 AM to 5:30 PM & Sat: - 9:30 AM to 3:00 PM</td>
                            <td className="p-3 font-mono font-semibold text-white">8425853808</td>
                            <td className="p-3 font-mono text-white">moneylogixs@gmail.com</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">Client Care Head</td>
                            <td className="p-3 font-medium text-white">Kalpesh chichhiya</td>
                            <td className="p-3 text-white/70">Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050</td>
                            <td className="p-3 text-white/70">Monday to Friday 9:30 AM to 5:30 PM & Sat: - 9:30 AM to 3:00 PM</td>
                            <td className="p-3 font-mono font-semibold text-white">8291079922</td>
                            <td className="p-3 font-mono text-white">kalpeshbhatiya@yahoo.com</td>
                          </tr>
                          <tr className="hover:bg-white/[0.02]">
                            <td className="p-3 font-semibold text-white">Compliance Officer</td>
                            <td className="p-3 font-medium text-white">Manoj T. Mahamunkar.</td>
                            <td className="p-3 text-white/70">Vrindavan Annexe, 32, Mount Mary Road, Bandra West, Mumbai : 400050</td>
                            <td className="p-3 text-white/70">Monday to Friday 9:30 AM to 5:30 PM & Sat: - 9:30 AM to 3:00 PM</td>
                            <td className="p-3 font-mono font-semibold text-white">8425853815</td>
                            <td className="p-3 font-mono text-white">mahamunkarmanoj@moneylogix.in</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-base font-bold text-white">If we still have not resolved it (External Regulator Escalation):</h3>
                    <p className="text-xs text-white/70">You can escalate beyond us, and you do not need our permission to do so:</p>
                    <div className="overflow-x-auto rounded-2xl border border-white/15 text-xs sm:text-sm">
                      <table className="w-full text-left">
                        <thead className="bg-white/10 text-white font-semibold border-b border-white/15">
                          <tr>
                            <th className="p-3">Where</th>
                            <th className="p-3">What it is</th>
                            <th className="p-3">File Online</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80">
                          <tr>
                            <td className="p-3 font-bold text-white">SEBI SCORES</td>
                            <td className="p-3">The regulator's own complaint portal. Covers both trading and demat account.</td>
                            <td className="p-3"><a href="https://scores.sebi.gov.in/" target="_blank" rel="noreferrer" className="font-mono text-white underline hover:text-white/80">scores.sebi.gov.in</a></td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-white">NSE</td>
                            <td className="p-3">Investor grievance cell of the National Stock Exchange, for trades on NSE.</td>
                            <td className="p-3"><a href="https://www.nseindia.com/static/complaints/file-a-complaint-online" target="_blank" rel="noreferrer" className="font-mono text-white underline hover:text-white/80">File a complaint online</a></td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-white">BSE</td>
                            <td className="p-3">Investor grievance cell of BSE, for trades on BSE.</td>
                            <td className="p-3"><a href="https://bsecrs.bseindia.com/ecomplaint/frmInvestorHome.aspx" target="_blank" rel="noreferrer" className="font-mono text-white underline hover:text-white/80">BSE e-Complaint Portal</a></td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-white">ODR portal</td>
                            <td className="p-3">Online Dispute Resolution for the securities market — conciliation & arbitration.</td>
                            <td className="p-3"><a href="https://smartodr.in/" target="_blank" rel="noreferrer" className="font-mono text-white underline hover:text-white/80">smartodr.in</a></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5 space-y-2 text-xs sm:text-sm text-white/90">
                    <p className="font-semibold text-white">
                      You do not need our permission, and you do not have to wait for us. Going to SEBI or an exchange does not affect anything else about your account, and we will not treat it as a reason to restrict it.
                    </p>
                    <p className="text-white/70 text-xs">
                      When you write to us, please include your client code and what you would like us to do — it usually saves a round trip. Every address on this page, and our registration numbers, are repeated in the footer of every page.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 8: Risk Disclosures & Disclaimers */}
              {activeTab === 'risk' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Appendix H · /legal/disclaimers</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Disclaimers & SEBI Risk Disclosures (Unabridged)
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      Last updated 13 August 2026
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/20 bg-white/[0.03] p-6 sm:p-8 space-y-4 shadow-2xl">
                    <span className="font-mono font-bold text-white tracking-widest text-xs uppercase bg-white/10 px-3 py-1 rounded-lg">
                      Annexure-I: Risk Disclosures
                    </span>
                    <h3 className="text-lg font-bold text-white">RISK DISCLOSURES ON DERIVATIVES</h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-white/90 list-disc pl-5 leading-relaxed font-normal">
                      <li><strong className="text-white">9 out of 10 individual traders</strong> in equity Futures and Options Segment incurred net losses.</li>
                      <li>On an average, loss makers registered net trading loss close to <strong className="text-white font-mono">₹ 50,000</strong>.</li>
                      <li>Loss makers expended an additional <strong className="text-white font-mono">28%</strong> of net trading losses as transaction costs.</li>
                      <li>Those making net trading profits incurred between <strong className="text-white font-mono">15% to 50%</strong> of profits as transaction cost.</li>
                    </ul>
                  </div>

                  <div className="space-y-5 pt-2">
                    <h3 className="text-base font-bold text-white">Appendix H Statutory Disclaimers</h3>
                    <div className="space-y-4 text-xs sm:text-sm text-white/80">
                      <section className="rounded-2xl border border-white/15 bg-white/[0.02] p-5 space-y-1.5">
                        <div className="font-bold text-white text-sm">1. Market risk</div>
                        <p className="text-white/90 font-semibold leading-relaxed">
                          Investments in the securities market are subject to market risks. Read all the related documents carefully before investing.
                        </p>
                      </section>

                      <section className="rounded-2xl border border-white/15 bg-white/[0.02] p-5 space-y-1.5">
                        <div className="font-bold text-white text-sm">2. Registration is not an assurance</div>
                        <p className="text-white/80 leading-relaxed">
                          Registration granted by SEBI, membership of an exchange, and certification from NISM in no way guarantee the performance of the intermediary, nor provide any assurance of returns to investors.
                        </p>
                      </section>

                      <section className="rounded-2xl border border-white/15 bg-white/[0.02] p-5 space-y-1.5">
                        <div className="font-bold text-white text-sm">3. Content is not advice</div>
                        <p className="text-white/80 leading-relaxed">
                          Educational and market content on the Thinq Platform is for information only. It is not investment advice and not a recommendation to buy or sell any security. <strong className="text-white">Money Logix Securities Private Limited (“Thinq”) is not a SEBI-registered Research Analyst or Investment Adviser</strong>, and does not provide investment advice or recommendations. Where we display third-party research, we name the provider and its registration alongside it.
                        </p>
                      </section>

                      <section className="rounded-2xl border border-white/15 bg-white/[0.02] p-5 space-y-1.5">
                        <div className="font-bold text-white text-sm">4. Past performance</div>
                        <p className="text-white/80 leading-relaxed">
                          Past performance is not indicative of future results.
                        </p>
                      </section>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 9: Investor Complaints Data */}
              {activeTab === 'complaints' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Investor Complaints Data
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      Money Logix Securities Private Limited · Data for Month ending – JUNE-2026
                    </p>
                  </div>

                  {/* Table 1: Current Month Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-white">1. Current Month Complaint Data (JUNE-2026)</h3>
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
                            <th className="p-3">Pending for &lt; 3 months</th>
                            <th className="p-3">Pending for &gt; 3 months</th>
                            <th className="p-3">Average Resolution Time (in days)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/80 font-mono">
                          <tr>
                            <td className="p-3 font-sans font-bold text-white">1</td>
                            <td className="p-3 font-sans font-medium text-white">Directly from Investors</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-sans font-bold text-white">2</td>
                            <td className="p-3 font-sans font-medium text-white">SEBI ( Scores )</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-sans font-bold text-white"></td>
                            <td className="p-3 font-sans font-medium text-white pl-8">BSE</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-sans font-bold text-white"></td>
                            <td className="p-3 font-sans font-medium text-white pl-8">NSE</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-sans font-bold text-white">3</td>
                            <td className="p-3 font-sans font-medium text-white">CDSL DP</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-sans font-bold text-white">4</td>
                            <td className="p-3 font-sans font-medium text-white">Other sources (if any)</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                          </tr>
                          <tr className="bg-white/10 font-sans font-bold text-white">
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

                  {/* Table 2: Monthly Trend (July 2025 to June 2026) */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-base font-bold text-white">2. Monthly Complaint Details — Trend of Monthly Disposal of Complaints</h3>
                    <p className="text-xs text-white/60">Investor Complaints Data for Money Logix Securities Private Limited</p>
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
                          <tr><td className="p-3 font-sans font-bold text-white">1</td><td className="p-3 font-sans font-medium text-white">July 2025</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">2</td><td className="p-3 font-sans font-medium text-white">August 2025</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">3</td><td className="p-3 font-sans font-medium text-white">September 2025</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">4</td><td className="p-3 font-sans font-medium text-white">October 2025</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">5</td><td className="p-3 font-sans font-medium text-white">November 2025</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">6</td><td className="p-3 font-sans font-medium text-white">December 2025</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">7</td><td className="p-3 font-sans font-medium text-white">January 2026</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">8</td><td className="p-3 font-sans font-medium text-white">February 2026</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">9</td><td className="p-3 font-sans font-medium text-white">March 2026</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">10</td><td className="p-3 font-sans font-medium text-white">April 2026</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">11</td><td className="p-3 font-sans font-medium text-white">May 2026</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">12</td><td className="p-3 font-sans font-medium text-white">June 2026</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 3: Annual Trend (2019-2020 to 2025-2026) */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h3 className="text-base font-bold text-white">3. Annual Complaint Details — Trend of Annual Disposal of Complaints as on 30.06.2026</h3>
                    <p className="text-xs text-white/60">Investor Complaints Data for Money Logix Securities Private Limited</p>
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
                          <tr><td className="p-3 font-sans font-bold text-white">1</td><td className="p-3 font-sans font-medium text-white">2019-2020</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">2</td><td className="p-3 font-sans font-medium text-white">2020-2021</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">3</td><td className="p-3 font-sans font-medium text-white">2021-2022</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">4</td><td className="p-3 font-sans font-medium text-white">2022-2023</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">5</td><td className="p-3 font-sans font-medium text-white">2023-2024</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">6</td><td className="p-3 font-sans font-medium text-white">2024-2025</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr><td className="p-3 font-sans font-bold text-white">7</td><td className="p-3 font-sans font-medium text-white">2025-2026</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td><td className="p-3">0</td></tr>
                          <tr className="bg-white/10 font-sans font-bold text-white">
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

              {/* Tab 10: Cookie Policy */}
              {activeTab === 'cookies' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-xs font-mono text-white/50 block mb-1">Appendix G · /legal/cookies</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Cookie Policy (All 3 Sections)
                    </h2>
                    <p className="mt-1 text-xs text-white/60">
                      Applies to thinq.co and the Thinq app · Last updated 13 August 2026
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5 space-y-3 text-xs sm:text-sm text-white/80">
                    <p><strong className="text-white">1. What we use:</strong> Strictly necessary (session, auth, security), Preference (remembering choices), and Analytics (product usage).</p>
                    <p><strong className="text-white">2. What we do NOT use:</strong> We do not use advertising cookies, and we do not track you across other websites.</p>
                    <p><strong className="text-white">3. Your choice:</strong> Preference and analytics cookies are off until you turn them on under Profile → Privacy. Declining them does not restrict access to any part of the service.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      {/* Standalone QR Code Modal Dialog with Copy Button */}
      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-[#040405] text-xs text-white/50">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>
              © 2026 Money Logix Securities Private Limited ("Thinq"). All rights reserved.
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
