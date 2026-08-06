import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LeaderboardSection from '../components/sections/Leaderboard';
import TestimonialsSection from '../components/sections/Testimonials';
import './CommunityPreview.css';

export default function CommunityPreview() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="community-page">
      <LeaderboardSection />
      <TestimonialsSection />
    </div>
  );
}
