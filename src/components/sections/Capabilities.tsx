import ImageSlider3D from '@/components/lightswind/3d-image-slider'
import SectionShell from '../ui/SectionShell'
import { capabilitiesIntro } from '../../data/capabilities'

export default function Capabilities() {
  return (
    <SectionShell
      id="capabilities"
      scale="standard"
      heading={capabilitiesIntro.heading}
      subheading={capabilitiesIntro.subheading}
    >
      {/* 3D Image Slider covering full width of screen */}
      <div className="-mx-4 sm:-mx-8 lg:-mx-16 xl:-mx-24 overflow-visible py-4 sm:py-8">
        <ImageSlider3D duration={30} cardWidth="18em" direction="right" />
      </div>
    </SectionShell>
  )
}
