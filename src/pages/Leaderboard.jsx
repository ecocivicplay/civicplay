import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import LeaderboardSection from '../components/sections/Leaderboard';
import './Leaderboard.css';

export default function Leaderboard() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="leaderboard-page">
      <LeaderboardSection />
    </div>
  );
}
