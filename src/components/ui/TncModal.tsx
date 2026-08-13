import { useState } from 'react'
import { X, FileText, Lock, DollarSign, Check } from 'lucide-react'
import ThinqMark from './ThinqMark'

interface TncModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: 'terms' | 'privacy' | 'tariff'
}

export default function TncModal({
  isOpen,
  onClose,
  initialTab = 'terms',
}: TncModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'tariff'>(initialTab)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 isolate">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#0c0c0e]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-200">
        {/* Specular Highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <ThinqMark size={28} tone="steel" />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Thinq Legal & Regulatory
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-white/10 bg-white/[0.02] px-6 sm:px-8">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'terms'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            Terms of Use
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'privacy'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Lock className="h-4 w-4" />
            Privacy Policy
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tariff')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'tariff'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Tariff & Charges
          </button>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6 text-sm text-white/80 leading-relaxed font-normal">
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/70">
                <span className="font-semibold text-white">Contracting Entity:</span> Money Logix Securities Private Limited ("Thinq") · SEBI Stock Broker Reg. No. <span className="font-mono text-amber-300">INZ000235531</span> · Member NSE (12971) & BSE (3246) · CDSL DP ID <span className="font-mono text-amber-300">12063900</span> (SEBI DP Reg. IN-DP-22-2015).
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h4>
                <p>
                  Your access to or use of the Thinq Platform, its services, and products constitutes your consent to these Terms of Use, the Privacy Policy, and the Tariff Rates. If you do not agree, do not access or use the Thinq Platform.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">2. Eligibility</h4>
                <p>
                  By accepting these Terms, you represent that you are 18 years of age or older, competent to contract under applicable Indian law, and not debarred by SEBI or any statutory authority from dealing in the securities market.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">3. License to Use & Platform Access</h4>
                <p>
                  Thinq grants you a limited, non-exclusive, non-transferable, revocable, royalty-free right to access and use the Thinq Platform solely for carrying out your own online trades and transactions in accordance with SEBI and Exchange regulations.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">4. User Obligations & Security</h4>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials (PIN, passkeys, 2FA OTP) and for all activities under your account. You agree to provide accurate KYC information and comply with all applicable regulatory guidelines.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">5. Disclaimers & Governing Law</h4>
                <p>
                  The platform is provided on an "as is" and "as available" basis. These Terms shall be governed by the laws of India, and disputes shall be subject to the exclusive jurisdiction of the competent courts at Mumbai, India.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/70">
                <span className="font-semibold text-white">DPDP Act 2023 Compliance:</span> Thinq collects data strictly for legally mandated KYC, order execution, and account operations. Your data is unbundled, versioned, and never sold to third parties.
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">1. Information We Collect</h4>
                <p>
                  We collect identity data (Name, PAN, DOB, Photo), address & demographic details via Govt.-approved DigiLocker / Aadhaar XML (last 4 digits only), contact information, and bank details required for SEBI mandatory KYC and trade settlement.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">2. Lawful Basis & Purpose</h4>
                <p>
                  Data collection is governed by legal obligations (SEBI Stock Broker Regulations, PMLA, Prevention of Money Laundering Act) and contract performance. Marketing communications are strictly opt-in and independently declinable.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">3. Data Retention & Security</h4>
                <p>
                  Regulatory records are retained for the statutory 8-year audit window in encrypted, append-only storage. Data from incomplete or abandoned applications is automatically deleted after 30 days.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tariff' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>
                  <strong className="text-white">Waitlist Benefit:</strong> 6 Months Zero Thinq Brokerage across Equity, F&O, and Intraday for all waitlist members.
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">Brokerage & AMC Schedule</h4>
                <div className="overflow-hidden rounded-xl border border-white/10 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-white/10 text-white font-semibold">
                      <tr>
                        <th className="p-3">Segment</th>
                        <th className="p-3">Thinq Brokerage</th>
                        <th className="p-3">Statutory Charges</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white/80">
                      <tr>
                        <td className="p-3 font-medium text-white">Equity Delivery</td>
                        <td className="p-3 text-emerald-400 font-semibold">₹0 (Free for 6 Months)</td>
                        <td className="p-3">STT, Exchange Transaction, GST, Stamp Duty</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">Equity Intraday</td>
                        <td className="p-3 text-emerald-400 font-semibold">₹0 (Free for 6 Months)</td>
                        <td className="p-3">STT, Exchange Transaction, GST, Stamp Duty</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">Futures & Options</td>
                        <td className="p-3 text-emerald-400 font-semibold">₹0 (Free for 6 Months)</td>
                        <td className="p-3">STT, Exchange Transaction, GST, Stamp Duty</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-white">Demat Maintenance (AMC)</td>
                        <td className="p-3 text-emerald-400 font-semibold">₹0 / Year</td>
                        <td className="p-3">Zero Account Maintenance Charges</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-6 py-4 sm:px-8">
          <p className="text-xs text-white/50">
            Registered with SEBI, NSE, BSE & CDSL.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 px-5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
