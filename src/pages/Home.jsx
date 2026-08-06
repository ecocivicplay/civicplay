import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Hero from '../components/sections/Hero';
import TrustedBy from '../components/sections/TrustedBy';
import HowItWorks from '../components/sections/HowItWorks';
// import ImpactCounter from '../components/sections/ImpactCounter';
// import Gallery from '../components/sections/Gallery';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
// import GarbageMap from '../components/sections/GarbageMap';
import AwarenessPreview from '../components/sections/AwarenessPreview';

export default function Home() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope}>
      <Hero />
      <TrustedBy />
      <HowItWorks />
      {/* <ImpactCounter /> */}
      {/* <GarbageMap /> */}
      <AwarenessPreview />
      <Testimonials />
      {/* <Gallery /> */}
      <FAQ />
    </div>
  );
}
