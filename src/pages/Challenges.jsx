import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiPlay, FiAward, FiUser, FiUsers } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';
import { challenges } from '../utils/data';
import './Challenges.css';
// import { challengeImages } from '../utils/challengeImages';

const FILTERS = ['All', 'Not Started', 'In Progress', 'Completed'];
const CATEGORY_FILTERS = ['All', 'Cleanup', 'Tree Planting', 'Recycling', 'Restoration', 'Community', 'App Engagement'];
const MODE_FILTERS = ['All', 'Solo', 'Group'];

// Lightweight inline placeholder shown if a local image is missing
// (e.g. before you've run scripts/download-images.mjs). Avoids an
// extra network request and avoids layout shift.
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle" dy=".3em">Image unavailable</text>
    </svg>`
  );

function handleImgError(e) {
  e.currentTarget.onerror = null; // prevent infinite loop if fallback also fails
  e.currentTarget.src = FALLBACK_IMG;
}

export default function Challenges() {
  const scope = useRef(null);
  useScrollReveal(scope);
  const navigate = useNavigate();

  const { user, profile, joinChallenge } = useAuth();
  const [filter, setFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  // Tracks which single challenge is mid-request, so only that card's
  // button shows a loading state (and can't be double-clicked) rather
  // than freezing every card on the page.
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState('');

  const takenIds = profile?.takenChallengeIds || [];
  const completedIds = profile?.completedChallengeIds || [];

  const decorated = useMemo(() => {
    return challenges.map((c) => {
      let status = 'not-started';
      if (completedIds.includes(c.id)) status = 'completed';
      else if (takenIds.includes(c.id)) status = 'in-progress';
      return { ...c, status };
    });
  }, [takenIds, completedIds]);

  const visible = useMemo(() => {
    const statusMap = { 'Not Started': 'not-started', 'In Progress': 'in-progress', Completed: 'completed' };
    return decorated.filter((c) => {
      const matchesStatus = filter === 'All' || c.status === statusMap[filter];
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      const matchesMode = modeFilter === 'All' || c.mode === modeFilter;
      return matchesStatus && matchesCategory && matchesMode;
    });
  }, [decorated, filter, categoryFilter, modeFilter]);

  const completedCount = decorated.filter(
    (c) => c.status === "completed"
  ).length;

  const activeCount = decorated.filter(
    (c) => c.status === "in-progress"
  ).length;

  const availableCount = decorated.filter(
    (c) => c.status === "not-started"
  ).length;

  async function handleJoin(challengeId) {
    setError('');
    setPendingId(challengeId);
    try {
      await joinChallenge(challengeId);
    } catch (err) {
      console.error(err);
      setError('Could not join that challenge. Please try again.');
    } finally {
      setPendingId(null);
    }
  }

  async function handleComplete(challengeId, points) {
    setError('');
    // "Mark as Done" now sends the user through the verify-and-accept proof
    // flow instead of completing instantly. The challenge (with its own
    // points) is passed along so that flow awards this challenge's actual
    // points rather than a flat amount, once verification/acceptance
    // succeeds — completeChallenge itself is unchanged and still does the
    // actual completion + point award.
    const challenge = decorated.find((c) => c.id === challengeId) || { id: challengeId, points };
    navigate('/proof-upload', { state: { challenge } });
  }

  if (!user) {
    return (
      <div className="challengesPage challengesPage--empty">
        <h2>Challenges</h2>
        <p>You need to be logged in to view and join challenges.</p>
        <Link to="/login" className="challenges__cta">Go to Login</Link>
      </div>
    );
  }

  return (
    <div ref={scope} className="challengesPage">
      <div className="container">
        <div className="challengesHero" data-reveal="up">

          <div className="heroGlow heroGlow1"></div>
          <div className="heroGlow heroGlow2"></div>

          <div className="challengesHero__content">

            <span className="heroTag">
              🌍 CivicPlay Challenges
            </span>

            <h1>
              Make Your City Better
              <br />
              <span>One Challenge at a Time.</span>
            </h1>

            <p>
              Complete environmental challenges, protect your community,
              earn rewards, unlock achievements, and become one of
              CivicPlay's top citizens.
            </p>

          </div>
        </div>

        <div className="challenges__filters" data-reveal="up">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`challenges__filterBtn ${filter === f ? 'is-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="challenges__subFilters" data-reveal="up">
          <div className="challenges__filterGroup">
            <span className="challenges__filterLabel">Type</span>
            <div className="challenges__filters challenges__filters--sub">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f}
                  className={`challenges__filterBtn challenges__filterBtn--sub ${categoryFilter === f ? 'is-active' : ''}`}
                  onClick={() => setCategoryFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="challenges__filterGroup">
            <span className="challenges__filterLabel">Mode</span>
            <div className="challenges__filters challenges__filters--sub">
              {MODE_FILTERS.map((f) => (
                <button
                  key={f}
                  className={`challenges__filterBtn challenges__filterBtn--sub ${modeFilter === f ? 'is-active' : ''}`}
                  onClick={() => setModeFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="challenges__error">{error}</p>}

        <div className="challenges__grid" data-stagger>
          {visible.map((c) => (
            <div key={c.id} className={`challenge-card challenge-card--${c.status}`}>
              <div className="challenge-card__image">
                <img
                  src={c.image}
                  alt={c.title}
                  width={400}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  onError={handleImgError}
                />
                <div className={`statusRibbon statusRibbon--${c.status}`}>

                  {c.status === "completed" && "Completed"}

                  {c.status === "in-progress" && "In Progress"}

                  {c.status === "not-started" && "Available"}

                </div>
              </div>
              <div className="challenge-card__top">

                <span
                  className={`challenge-card__badge challenge-card__badge--${c.difficulty?.toLowerCase()}`}
                >
                  {c.difficulty}
                </span>

                <div className="rewardChip">
                  ⭐ +{c.points} XP
                </div>

              </div>
              <h3>{c.title}</h3>

              <div className="challenge-card__tags">
                {c.category && (
                  <span className="challenge-card__tag challenge-card__tag--category">
                    {c.category}
                  </span>
                )}
                {c.mode && (
                  <span className="challenge-card__tag challenge-card__tag--mode">
                    {c.mode === 'Group' ? <FiUsers /> : <FiUser />} {c.mode}
                  </span>
                )}
              </div>

              {c.status === 'completed' && (
                <div className="challenge-card__status challenge-card__status--completed">
                  <FiCheckCircle /> Completed
                </div>
              )}
              {c.status === 'in-progress' && (
                <div className="challenge-card__status challenge-card__status--progress">
                  <FiClock /> In progress
                </div>
              )}

              <div className="challenge-card__actions">
                {c.status === 'not-started' && (
                  <button
                    className="challenge-card__btn challenge-card__btn--primary"
                    disabled={pendingId === c.id}
                    onClick={() => handleJoin(c.id)}
                  >
                    <FiPlay /> {pendingId === c.id ? 'Joining…' : 'Join Challenge'}
                  </button>
                )}
                {c.status === 'in-progress' && (
                  <button
                    className="challenge-card__btn challenge-card__btn--success"
                    disabled={pendingId === c.id}
                    onClick={() => handleComplete(c.id, c.points)}
                  >
                    <FiCheckCircle /> {pendingId === c.id ? 'Saving…' : 'Mark as Done'}
                  </button>
                )}
                {c.status === 'completed' && (
                  <button className="challenge-card__btn challenge-card__btn--disabled" disabled>
                    <FiCheckCircle /> Done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="challenges__emptyState">No challenges in this category yet.</p>
        )}

        <div className="challengeBottom">

          {/* <div className="achievementPreview">

            <h2>🏆 Your Achievements</h2>

            <div className="achievementGrid">

              <div className="achievementCard unlocked">
                🌱
                <h4>Eco Starter</h4>
                <p>Complete your first challenge.</p>
              </div>

              <div className="achievementCard">
                ♻️
                <h4>Recycler</h4>
                <p>Complete 5 recycling challenges.</p>
              </div>

              <div className="achievementCard">
                🌍
                <h4>Green Guardian</h4>
                <p>Earn 1000 points.</p>
              </div>

              <div className="achievementCard">
                🔥
                <h4>7 Day Streak</h4>
                <p>Stay active for one week.</p>
              </div>

            </div>

          </div> */}

          {/* <div className="communityStats">

            <h2>🌍 Community Impact</h2>

            <div className="communityGrid">

              <div>
                <h3>12,540+</h3>
                <span>Challenges Completed</span>
              </div>

              <div>
                <h3>4,280</h3>
                <span>Active Citizens</span>
              </div>

              <div>
                <h3>₹1,20,000</h3>
                <span>Rewards Distributed</span>
              </div>

              <div>
                <h3>95%</h3>
                <span>Positive Impact</span>
              </div>

            </div>

          </div> */}
          {/* 
          <div className="dailyMission">

            <div>

              <span>🔥 DAILY MISSION</span>

              <h2>Help Keep Your Community Clean</h2>

              <p>
                Complete any one challenge today and earn an extra
                <strong> 50 Bonus XP</strong>.
              </p>

            </div>

            <button className="dailyMissionBtn">
              Explore Challenges
            </button>

          </div> */}

        </div>
      </div>
    </div>
  );
}