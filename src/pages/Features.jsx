import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import FeaturesSection from '../components/sections/Features';
import './Features.css';

export default function Features() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="features-page">
      <FeaturesSection />
    </div>
  );
}
