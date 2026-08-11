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
  email: 'support@moneylogix.in',
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
      'Money Logix Private Limited (CIN: U64990MH2006PTC165522)\nThinq is a brand of Money Logix Private Limited.',
  },
  {
    label: 'SEBI Registration',
    value:
      'Stock Broking: INZ000235531\nDepository Participant (CDSL): IN-DP-22-2015\nExchange Memberships — NSE: 12971 | BSE: 3246',
  },
  {
    label: 'Contact',
    value:
      'Vrindavan Annexe, 32 Mount Mary Road, Bandra (W), Mumbai 400050\nPhone: +91 22 67827171 / 7172\nEmail: support@moneylogix.in',
  },
  {
    label: 'Compliance Officer',
    value: '[ Name ] · [ officer@moneylogix.in ] · [ +91 22 XXXXXXXX ]',
    isPlaceholder: true,
  },
  {
    label: 'Grievance Redressal',
    value:
      'Stock Broking: complaints@moneylogix.in · DP: bogrievances@moneylogix.in\nSEBI SCORES and the SMART ODR portal are linked below.',
  },
  {
    label: 'Risk Disclosure — Equity Derivatives',
    value:
      '[ Paste SEBI / exchange-approved derivatives risk disclosure verbatim, including the prescribed loss statistic. Do not paraphrase. ]',
    isPlaceholder: true,
  },
]

export const brandOwnershipStatement =
  'Thinq is a brand of Money Logix Private Limited.'

export const communicationDisclaimer =
  'Disclaimer: All communications with the client via chat, phone, or email are for support purposes only. Any commitments or statements made by the agent (human or virtual) shall not be binding on the company.'

export interface InvestorAwarenessSection {
  title: string
  content: string
}

export const investorAwarenessNotes: InvestorAwarenessSection[] = [
  {
    title: 'Attention Investors',
    content:
      'Investors should be cautious on unsolicited emails and SMS advising to buy, sell or hold securities and trade only on the basis of informed decisions. Investors are advised to invest after conducting appropriate analysis of respective companies and not to blindly follow unfounded rumours or tips.',
  },
  {
    title: 'Warning on Fraudulent Schemes & Stock Tips',
    content:
      'Valued clients and investors, please be warned about fraudulent investment schemes being circulated. We do not give stock tips or recommendations and have not authorized anyone to give them on our behalf.',
  },
]

export const complaintsProcedures = {
  smartODR:
    'Procedure to file a complaint on SMART ODR: Register on Smart ODR portal. Mandatory details for filing complaints: Name, PAN, Address, Mobile Number, E-mail ID.',
  sebiScores:
    'Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID.',
  scoresUrl: 'https://scores.sebi.gov.in/',
  scoresAndroidUrl: 'https://play.google.com/store/apps/details?id=com.sebiscores',
  scoresIosUrl: 'https://apps.apple.com/app/sebi-scores',
}

export const vernacularDownloads = {
  label: "Download client registration documents in vernacular language:",
  links: [
    { name: 'BSE', url: 'https://www.bseindia.com' },
    { name: 'NSE', url: 'https://www.nseindia.com' },
    { name: 'MCX', url: 'https://www.mcxindia.com' },
  ],
}

export const advisoryGuidelines = {
  label: "Advisory Guidelines for investors prescribed by exchanges:",
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
  { name: 'SEBI', url: 'https://www.sebi.gov.in' },
  { name: 'NSE', url: 'https://www.nseindia.com' },
  { name: 'BSE', url: 'https://www.bseindia.com' },
  { name: 'CDSL', url: 'https://www.cdslindia.com' },
  { name: 'SCORES', url: 'https://scores.sebi.gov.in' },
  { name: 'SMART ODR', url: 'https://smartodr.in' },
]

export const disclaimers = [
  {
    title: 'Market Risk',
    content:
      'Investments in the securities market are subject to market risk. Read all the related documents carefully before investing. Brokerage will not exceed the SEBI prescribed limit. Nothing on this page is a recommendation to buy or sell any security.',
  },
]

export const copyrightEntity = 'Money Logix Private Limited'
export const copyrightSuffix = 'All rights reserved.'
