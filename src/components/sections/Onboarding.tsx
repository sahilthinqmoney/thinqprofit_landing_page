import Button from '../ui/Button'
import CopyText from '../ui/CopyText'
import MediaSection from '../ui/MediaSection'
import Reveal from '../ui/Reveal'
import { onboardingCopy, requirements, steps, timingNote } from '../../data/onboarding'

/**
 * §8 Onboarding — full-bleed, copy parked in the left 46% so it alternates
 * against Platform, which sits right.
 *
 * What went: the numbered-circle rail, the connector line and the bordered
 * requirements/CTA panel. Three bordered circles on a hairline rail is the
 * house style of every generic AI landing page, and a card-in-a-card CTA panel
 * re-boxes content the bleed section exists to un-box.
 *
 * What replaced it: the same three steps as a plain numbered sequence —
 * tabular numeral, label, and a hairline `border-l` doing the separating that
 * the rail used to do — and the requirements as one flowed line of text. The
 * media carries the weight; the type stays quiet on top of it.
 */
export default function Onboarding() {
  return (
    <MediaSection
      id="onboarding"
      height="tall"
      place="left"
      anchor="center"
      scrim={0.88}
      /* Dense core sits under the copy column, not the middle of the frame. */
      scrimAt="26% 50%"
      /* 12em: at 10 the measure clipped "Open an account before" one word early
         and stranded "before" alone on the second line. */
      measure="12em"
      headline={onboardingCopy.heading}
      body={onboardingCopy.subheading}
      actions={
        <Button href="#onboarding" size="lg">
          {onboardingCopy.cta}
        </Button>
      }
      /* Activation SLA is a service claim, so it is live text under the CTA —
         never collapsed, never behind blur. CopyText keeps the unfilled [X]
         visibly flagged, and the lift off /55 holds it above 4.5:1. */
      finePrint={<CopyText source={timingNote} className="text-white/75" />}
      media={{ alt: onboardingCopy.mediaAlt }}
    >
      <ol className="mt-12 flex w-full max-w-[44em] flex-col gap-6 sm:flex-row sm:gap-0">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={
              index === 0
                ? 'sm:flex-1 sm:pr-6'
                : 'border-white/15 sm:flex-1 sm:border-l sm:pl-6 sm:pr-6'
            }
          >
            <Reveal variant="right" delay={index * 60} className="flex items-baseline gap-3 sm:block">
              <span className="text-[1.75rem] font-medium leading-none tabular text-white/35">
                {index + 1}
              </span>
              <span className="block sm:mt-3">
                <span className="block text-base leading-snug text-white/85">{step.title}</span>
                {/* The detail line is the part a first-time account opener
                    actually needs — which documents, what eSign does, how the
                    first deposit works. Dropping it to keep the sequence tidy
                    would trade the section's only substance for its looks, so
                    the copy cut took the reassurance off each line and left
                    every fact standing. */}
                <span className="mt-2 block text-[0.8125rem] leading-relaxed text-white/60">
                  {step.body}
                </span>
              </span>
            </Reveal>
          </li>
        ))}
      </ol>

      {/* Two words of lead-in and four nouns. The label stays because without it
          the line is an unattributed list sitting under a numbered sequence; the
          items lost their connective tissue instead ("PAN card" → "PAN",
          "Aadhaar linked to your mobile number" → "Aadhaar linked to mobile"). */}
      <Reveal variant="right" delay={180} className="w-full">
        <p className="mt-8 max-w-[42em] text-[0.8125rem] leading-relaxed text-white/55">
          {`You'll need: ${requirements.join(', ')}.`}
        </p>
      </Reveal>
    </MediaSection>
  )
}
