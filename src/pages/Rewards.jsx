import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import RewardsSection from '../components/sections/Rewards';
import './Rewards.css';

export default function Rewards() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="rewards-page">
      <RewardsSection />
    </div>
  );
}
