/**
 * §3.5 copy — the roadmap beat between the problem and the feature list.
 *
 * It carries no date. A date on an unshipped capability is a promise the page
 * cannot keep, and docs/go-live-checklist.md rules roadmap dates out outright —
 * so "shortly" and "when we open" are deliberate, not vague.
 */
export interface SpecItem {
  title: string
  description: string
}

export const agenticHands = {
  headline: 'Agentic trading comes after launch.',
  subheading: "Free when it lands — for everyone, not a paid tier. Here's what it will be.",
  specs: [
    {
      title: 'Bring your own agent',
      description: 'Connect Claude, ChatGPT or your own model. You are not tied to ours.',
    },
    {
      title: 'Plain English, or code',
      description: 'Describe a strategy in words, or write it yourself against the API.',
    },
    {
      title: 'Test it on history first',
      description: 'Run it against past sessions before it touches live money.',
    },
    {
      title: 'Its own account, its own kill switch',
      description: 'The agent trades only what you fund it with. Stop it in one tap.',
    },
  ] as SpecItem[],
  finePrint:
    "Algorithmic execution is subject to SEBI's framework for retail algorithmic trading and to exchange approval.",
  robotAlt: 'Robotic AI hand reaching in from the left',
  humanAlt: 'Human trader hand reaching in from the right',
}
