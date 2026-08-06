import MediaSection from '../ui/MediaSection'
import WaitlistForm from '../ui/WaitlistForm'
import { finalCta } from '../../data/footer'
import { platePoster } from '../../lib/media'


export default function FinalCta() {
  return (
    <MediaSection
      id="final-cta"
      className="isolate"
      height="short"
      place="center"

      anchor="center"
      scrim={0}
      scrimAt="50% 50%"
      measure="9em"
      voice="quiet"
      headline={finalCta.heading}
      body={finalCta.subheading}
      media={{
        alt: 'Final CTA',
        video: '/clips/floating_glass_tiles_in_void.mp4',
        poster: platePoster('closing'),
        blur: true,
      }}

    >
      <WaitlistForm variant="closing" className="mt-10" />
    </MediaSection>
  )
}



