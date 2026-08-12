/**
 * §5 — the regulatory footer.
 *
 * Every value here was supplied by the business. Nothing in this file may be
 * written from inference, from a competitor's footer, or from an older draft:
 * docs/go-live-checklist.md is explicit that an invented registration number is
 * a regulatory offence rather than a typo.
 *
 * Anything still outstanding is written as `[ ... ]`. The renderer picks those
 * brackets out and prints them in warning amber, so an unfilled value cannot
 * ship by inattention — it has to be looked at. Do not remove a bracket by
 * guessing what belongs in it.
 */

export interface RegistrationDetail {
  label: string
  value: string
  isPlaceholder?: boolean
}

export const entityInfo = {
  name: 'Money Logix Private Limited',
  cin: 'U64990MH2006PTC165522',
  sebiStockBroking: 'INZ000235531',
  sebiDP: 'IN-DP-22-2015',
  nseMember: '12971',
  bseMember: '3246',
  address: 'Vrindavan Annexe, 32 Mount Mary Road, Bandra (W), Mumbai 400050',
  phone: '+91 22 67827171 / 7172',
  email: 'moneylogixs@gmail.com',
  complianceOfficer: '[ Name ] · [ officer@moneylogix.in ] · [ +91 22 XXXXXXXX ]',
  brokingGrievance: 'complaints@moneylogix.in',
  dpGrievance: 'bogrievances@moneylogix.in',
  derivativesRiskDisclosure:
    '[ Paste SEBI / exchange-approved derivatives risk disclosure verbatim, including the prescribed loss statistic. Do not paraphrase. ]',
}

export const registrationDetails: RegistrationDetail[] = [
  {
    label: 'Legal Entity',
    value:
      'Money Logix Private Limited (CIN: U64990MH2006PTC165522)\nThinq is a brand owned by Money Logix Private Limited. All Thinq products are registered under Money Logix Private Limited.\nClients are advised to refer to our company as Money Logix Pvt. Ltd. when communicating with regulatory authorities.',
  },
  {
    label: 'SEBI Registration',
    value:
      'Member of NSE and BSE — Stock Broking: INZ000235531\nDepository Participant with CDSL: IN-DP-22-2015\nExchange Membership No. — NSE: 12971 | BSE: 3246',
  },
  {
    label: 'Registered & Corporate Office',
    value:
      'Vrindavan Annexe, 32 Mount Mary Road, Bandra (W), Mumbai 400050\nPhone: +91 22 67827171 / 7172\nEmail: moneylogixs@gmail.com',
  },
  {
    label: 'Compliance Officer',
    value: '[ Name ] · [ officer@moneylogix.in ] · [ +91 22 XXXXXXXX ]',
    isPlaceholder: true,
  },
  {
    label: 'Grievance Redressal',
    value:
      'Stock broking: complaints@moneylogix.in\nDepository participant: bogrievances@moneylogix.in\nSEBI SCORES and the SMART ODR portal are linked below.',
  },
  {
    label: 'Risk Disclosure — Equity Derivatives',
    value:
      '[ Paste SEBI / exchange-approved derivatives risk disclosure verbatim, including the prescribed loss statistic. Do not paraphrase. ]',
    isPlaceholder: true,
  },
]

export const brandOwnershipStatement =
  'Please ensure that you carefully read the Risk Disclosure Document as prescribed by SEBI, our Terms & Conditions and Privacy Policy.'

export const communicationDisclaimer =
  'Disclaimer: All communications with the client via chat, phone, or email are for support purposes only. Any commitments or statements made by the agent (human or virtual) shall not be binding on the company.'

export interface InvestorAwarenessSection {
  title: string
  content: string
  /** Rendered as a numbered list beneath the content. */
  bullets?: string[]
}

export const investorAwarenessNotes: InvestorAwarenessSection[] = [
  {
    title: 'Attention Investors',
    content:
      'Investors should be cautious on unsolicited emails and SMS advising to buy, sell or hold securities and trade only on the basis of informed decision. Investors are advised to invest after conducting appropriate analysis of respective companies and not to blindly follow unfounded rumours, tips etc. Further, you are also requested to share your knowledge or evidence of systemic wrongdoing, potential frauds or unethical behaviour through the anonymous portal facility provided on the BSE and NSE websites.',
  },
  {
    title: 'Warning on Fraudulent Schemes',
    content:
      'Valued clients and investors, please be warned about fraudulent investment schemes being circulated. These scams often promise high returns with little to no risk. If they falsely claim to be from Money Logix or our partners, please report to us on [ reporting contact not supplied ].',
  },
  {
    title: 'We Do Not Give Stock Tips',
    content:
      'We do not give stock tips or recommendations and have not authorized anyone to give this on behalf of us. If you know anyone claiming to be a part of Money Logix or our associate companies or partners and offering such services, please report to us on [ reporting contact not supplied ].',
  },
  {
    title: 'Protect Your Account',
    content:
      'To prevent unauthorized transactions in your trading or demat account, do not share your account details, credentials or any personal details with anyone. Keep your mobile number updated with your Stock Broker and Depository Participant, and ensure that the same is registered with the Stock Exchanges, Depository and KRAs. You will receive alerts and information on your registered mobile number and email for debit and other important transactions in your demat account directly from CDSL and the Exchange on the same day.',
  },
  {
    title: 'KYC and IPO Applications',
    content:
      'KYC is a one time exercise while dealing in securities markets — once KYC is done through a SEBI registered intermediary (Stock Broker, DP, Mutual Fund, etc.), an investor does not need to repeat the procedure when approaching another intermediary. No need to issue cheques by investors while subscribing to an IPO: just write the bank account number and sign in the application form to authorise your bank to make payment in case of allotment. No worries for refund, as the money remains in the investor’s account.',
  },
  {
    title: 'Guidelines on Margin Collection',
    content: 'Issued in the interest of the investors.',
    bullets: [
      'Stock brokers can accept securities as margin from clients only by way of pledge in the depository system, with effect from September 01, 2020.',
      'Update your email and phone number with your stock broker or depository participant and receive the OTP directly from the depository on your email and/or mobile number to create a pledge.',
      'Pay 20% upfront margin of the transaction value to trade in the cash market segment.',
      'Investors may please refer to the Exchange’s Frequently Asked Questions issued vide circular reference NSE/INSP/45191 dated July 31, 2020 and NSE/INSP/45534 dated August 31, 2020, and other guidelines issued from time to time in this regard.',
      'Check your securities, mutual funds and bonds in the consolidated account statement issued by NSDL and CDSL every month.',
    ],
  },
]

export const complaintsProcedures = {
  smartODR:
    'Procedure to file a complaint on SMART ODR: Register on the Smart ODR portal. Mandatory details for filing complaints: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: effective communication and speedy redressal of grievances.',
  sebiScores:
    'Procedure to file a complaint on SEBI SCORES: Register on the SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: effective communication and speedy redressal of grievances. You may also download the SEBI SCORES app to log a complaint.',
  scoresUrl: 'https://scores.sebi.gov.in/',
  scoresAndroidUrl: 'https://play.google.com/store/apps/details?id=com.sebi.scores',
  scoresIosUrl: 'https://apps.apple.com/in/app/sebi-scores/id1493257302',
}

export const vernacularDownloads = {
  label:
    "Download client registration documents (Rights & Obligations, Risk Disclosure Document, Do's & Don'ts) in vernacular language:",
  links: [
    { name: 'BSE', url: 'https://www.bseindia.com' },
    { name: 'NSE', url: 'https://www.nseindia.com' },
    { name: 'MCX', url: 'https://www.mcxindia.com' },
  ],
}

export const advisoryGuidelines = {
  label:
    'Kindly read the Advisory Guidelines for investors as prescribed by the exchanges, with reference to their circular dated 27th August 2021 regarding investor awareness and safeguarding client assets:',
  links: [
    { name: 'BSE', url: 'https://www.bseindia.com' },
    { name: 'NSE', url: 'https://www.nseindia.com' },
    { name: 'MCX', url: 'https://www.mcxindia.com' },
  ],
}

export const importantLinks = [
  { name: 'Privacy Policy', url: '#' },
  { name: 'Terms', url: '#' },
  { name: 'Investor Charter — Broking', url: 'https://www.nseindia.com' },
  { name: 'Investor Charter — DP', url: 'https://www.cdslindia.com' },
  { name: 'Advisory for Investors', url: 'https://www.nseindia.com' },
  { name: 'e-Voting for Shareholders', url: 'https://www.evoting.nsdl.com' },
  { name: 'NCL Client Collateral', url: 'https://www.nseclearing.com' },
  { name: 'MCXCCL Client Collateral', url: 'https://www.mcxccl.com' },
  { name: 'SEBI', url: 'https://www.sebi.gov.in' },
  { name: 'NSE', url: 'https://www.nseindia.com' },
  { name: 'BSE', url: 'https://www.bseindia.com' },
  { name: 'MCX', url: 'https://www.mcxindia.com' },
  { name: 'CDSL', url: 'https://www.cdslindia.com' },
  { name: 'SCORES', url: 'https://scores.sebi.gov.in' },
  { name: 'SMART ODR', url: 'https://smartodr.in' },
]

export const disclaimers = [
  {
    title: 'Market Risk',
    content:
      'Investments in the securities market are subject to market risks. Read all the related documents carefully before investing. Brokerage will not exceed the SEBI prescribed limit. Nothing on this page is a recommendation to buy or sell any security.',
  },
  {
    title: 'No Warranty',
    content:
      'Money Logix Private Limited makes no warranties or representation, express or implied, on products offered through the platform. It accepts no liability for any damages or losses, however caused, with the use of, or on the reliance of, its product or related services. Unless otherwise specified, all returns, expense ratio, NAV, etc. are historical and for illustrative purposes only. Future results will vary greatly and depend on personal and market circumstances. The information provided by our blog is educational only and is not investment or tax advice.',
  },
  {
    title: 'Order Collection Platform',
    content:
      'Money Logix Private Limited, also known as Thinq, is only an order collection platform that collects orders on behalf of clients and places them on BSE StarMF for execution. The client expressly agrees that Thinq is not liable or responsible and does not represent or warrant any damages regarding non-execution of orders, or any incorrect execution of orders with regard to the funds chosen by the client, or due to — but not limited to — any link or system failure, delay in transfer of the funds on account of any unforeseen circumstances or issues in the banking system or payment aggregators, or any other problems that may result in a delay in crediting the funds into BSE StarMF.',
  },
]

export const copyrightEntity = 'Money Logix Private Limited'
export const copyrightSuffix = 'All rights reserved.'
