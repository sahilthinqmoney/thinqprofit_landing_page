export interface RegistrationDetail {
  label: string
  value: string
}

export const entityInfo = {
  name: 'Money Logix Private Ltd',
  cin: 'U64990MH2006PTC165522',
  sebiStockBroking: 'INZ000235531',
  sebiDP: 'IN-DP-22-2015',
  nseMember: '12971',
  bseMember: '3246',
  address: 'Vrindavan Annexe, 32 Mount Mary Road, Bandra (W), Mumbai 400050.',
  phone: '+91 22 67827171 / 7172',
  email: 'moneylogixs@gmail.com',
  brokingGrievance: 'complaints@moneylogix.in',
  dpGrievance: 'bogrievances@moneylogix.in',
}

export const registrationDetails: RegistrationDetail[] = [
  {
    label: 'Legal Entity',
    value: 'Money Logix Private Ltd (CIN: U64990MH2006PTC165522)',
  },
  {
    label: 'SEBI Registration',
    value: 'Stock Broking: INZ000235531 | Depository Participant (CDSL): IN-DP-22-2015',
  },
  {
    label: 'Exchange Memberships',
    value: 'NSE: 12971 | BSE: 3246',
  },
  {
    label: 'Registered & Corporate Office',
    value: 'Vrindavan Annexe, 32 Mount Mary Road, Bandra (W), Mumbai 400050.',
  },
  {
    label: 'Contact Information',
    value: 'Phone: +91 22 67827171 / 7172 | Email: moneylogixs@gmail.com',
  },
  {
    label: 'Grievance Redressal',
    value: 'Stock Broking: complaints@moneylogix.in | DP: bogrievances@moneylogix.in',
  },
]

export const brandOwnershipStatement =
  'Thinq is a brand owned by Money Logix Pvt. Ltd. All Thinq products are registered under MoneyLogix Pvt. Ltd. Clients are advised to refer to our company as MoneyLogix Pvt. Ltd when communicating with regulatory authorities.'

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
      'Investors should be cautious on unsolicited emails and SMS advising to buy, sell or hold securities and trade only on the basis of informed decisions. Investors are advised to invest after conducting appropriate analysis of respective companies and not to blindly follow unfounded rumours or tips. Further, you are requested to share your knowledge or evidence of systemic wrongdoing, potential frauds or unethical behaviour through the anonymous portal facility provided on BSE & NSE websites.',
  },
  {
    title: 'Warning on Fraudulent Schemes & Stock Tips',
    content:
      'Valued clients and investors, please be warned about fraudulent investment schemes being circulated. These scams often promise high returns with little to no risk. If they falsely claim to be from Money Logix or our partners, please report to us. We do not give stock tips or recommendations and have not authorized anyone to give them on our behalf. If you know anyone claiming to be a part of Money Logix or our associate companies or partners offering such services, please report to us.',
  },
  {
    title: 'Account Security & Transaction Alerts',
    content:
      'To prevent unauthorized transactions in your trading / demat account, do not share your account details, credentials or any personal details with anyone. Keep your mobile number updated with your Stock Broker, Depository Participant and ensure the same is registered with Stock Exchanges, Depository and KRAs. You will receive alerts and information on your registered mobile number / email for debit and other important transactions in your demat account directly from CDSL / Exchange on the same day.',
  },
  {
    title: 'KYC & ASBA IPO Guidelines',
    content:
      'KYC is a one-time exercise while dealing in securities markets — once KYC is done through a SEBI registered intermediary (Stock Broker, DP, Mutual Fund, etc.), the investor does not need to repeat the procedure when approaching another intermediary. No need to issue cheques when subscribing to IPOs; simply write your bank account number and sign the application form to authorize ASBA payment.',
  },
  {
    title: 'Guidelines on Margin Collection',
    content:
      'Stock brokers can accept securities as margins from clients only by way of pledge in the depository system w.e.f September 01, 2020. Update your e-mail and phone number with your stock broker / depository participant to receive OTP directly from depository to create pledge. Pay 20% upfront margin of transaction value to trade in cash market segment. Check your securities / MF / bonds in the consolidated account statement (CAS) issued by NSDL/CDSL every month.',
  },
]

export const complaintsProcedures = {
  smartODR:
    'Procedure to file a complaint on SMART ODR: Register on Smart ODR portal. Mandatory details for filing complaints: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of grievances.',
  sebiScores:
    'Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of grievances.',
  scoresUrl: 'https://scores.sebi.gov.in/',
  scoresAndroidUrl: 'https://play.google.com/store/apps/details?id=com.sebiscores',
  scoresIosUrl: 'https://apps.apple.com/app/sebi-scores',
}

export const vernacularDownloads = {
  label: "Download client registration documents (Rights & Obligations, Risk Disclosure Document, Do's & Don'ts) in vernacular language:",
  links: [
    { name: 'BSE', url: 'https://www.bseindia.com' },
    { name: 'NSE', url: 'https://www.nseindia.com' },
    { name: 'MCX', url: 'https://www.mcxindia.com' },
  ],
}

export const advisoryGuidelines = {
  label: "Kindly read the Advisory Guidelines for investors as prescribed by the exchanges with reference to their circular dated 27th August, 2021 regarding investor awareness and safeguarding client's assets:",
  links: [
    { name: 'BSE', url: 'https://www.bseindia.com' },
    { name: 'NSE', url: 'https://www.nseindia.com' },
    { name: 'MCX', url: 'https://www.mcxindia.com' },
  ],
}

export const importantLinks = [
  { name: 'SEBI', url: 'https://www.sebi.gov.in' },
  { name: 'BSE', url: 'https://www.bseindia.com' },
  { name: 'NSE', url: 'https://www.nseindia.com' },
  { name: 'MCX', url: 'https://www.mcxindia.com' },
  { name: 'CDSL', url: 'https://www.cdslindia.com' },
  { name: 'SCORES', url: 'https://scores.sebi.gov.in' },
  { name: 'ODR Portal', url: 'https://smartodr.in' },
  { name: 'Investor Charter for Stock Brokers', url: 'https://www.nseindia.com' },
  { name: 'Investor Charter for DP', url: 'https://www.cdslindia.com' },
  { name: 'Advisory for Investors', url: 'https://www.nseindia.com' },
  { name: 'e-Voting for Shareholders', url: 'https://www.evotingindia.com' },
  { name: 'NCL Client Collateral details', url: 'https://www.ncl.co.in' },
  { name: 'MCXCCL Client Collateral details', url: 'https://www.mcxccl.com' },
]

export const disclaimers = [
  {
    title: 'Product & Service Disclaimer',
    content:
      'Money Logix Private Limited makes no warranties or representations, express or implied, on products offered through the platform. It accepts no liability for any damages or losses, however caused, with the use of, or on the reliance of its product or related services. Unless otherwise specified, all returns, expense ratio, NAV, etc. are historical and for illustrative purpose only. Future will greatly depend on personal and market circumstances. The information provided is educational only and is not investment or tax advice.',
  },
  {
    title: 'Market Risk & Brokerage Limit',
    content:
      'Investments in the securities market are subject to market risk. Read all the related documents carefully before investing. Brokerage will not exceed the SEBI prescribed limit.',
  },
  {
    title: 'Order Collection & Execution Disclaimer (BSE StarMF)',
    content:
      'Money Logix Private Limited (also known as Thinq - Product Name) is only an order collection platform that collects orders on behalf of clients and places them on BSE StarMF for execution. Client expressly agrees that Thinq is not liable or responsible and does not represent or warrant any damages regarding non-execution of orders or any incorrect execution of orders with regard to the funds chosen by the client or due to, but not limited to, any link/system failure, delay in transfer of funds on account of unforeseen circumstances/issues in the banking system/payment aggregators or any other problems that may result in a delay in crediting the funds into BSE Star MF’s bank account.',
  },
]

export const copyrightEntity = 'Money Logix Private Ltd'
export const copyrightSuffix = 'All rights reserved.'
