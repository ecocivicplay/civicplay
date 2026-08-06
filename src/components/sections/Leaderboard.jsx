import { useEffect, useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { useAuth } from '../../context/AuthContext';
import './Leaderboard.css';

export default function Leaderboard() {
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const { user } = useAuth();

  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch(`${API_BASE}/api/users/leaderboard/all`);
        const data = await res.json();

        setLeaderboard(data);

        if (user) {
          const currentUser = data.find((u) => u.uid === user.uid);

          if (currentUser) {
            setMyRank(currentUser.rank);
          }
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      }
    }

    loadLeaderboard();
  }, [user]);

  const topUsers = leaderboard.slice(0, 10);

  const first = topUsers[0];
  const second = topUsers[1];
  const third = topUsers[2];

  const leaderList = topUsers.slice(3);

  return (
    <section className="section leaderboard" id="leaderboard">
      <div className="container">
        <SectionHeading
          eyebrow="Leaderboard"
          title="Climb the ranks of"
          highlight="top changemakers"
        />

        <div className="lb__podium" data-reveal="scale">

          {second && (
            <div className="podium podium--2">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(second.name)}&background=2563eb&color=fff`}
                alt={second.name}
              />

              <h4>{second.name}</h4>

              <span className="podium__pts">
                {second.points.toLocaleString()} pts
              </span>

              <div className="podium__stand">
                <span className="podium__medal">🥈</span>
                <span className="podium__rank">#2</span>
              </div>
            </div>
          )}

          {first && (
            <div className="podium podium--1">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(first.name)}&background=2563eb&color=fff`}
                alt={first.name}
              />

              <h4>{first.name}</h4>

              <span className="podium__pts">
                {first.points.toLocaleString()} pts
              </span>

              <div className="podium__stand">
                <span className="podium__medal">🥇</span>
                <span className="podium__rank">#1</span>
              </div>
            </div>
          )}

          {third && (
            <div className="podium podium--3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(third.name)}&background=2563eb&color=fff`}
                alt={third.name}
              />

              <h4>{third.name}</h4>

              <span className="podium__pts">
                {third.points.toLocaleString()} pts
              </span>

              <div className="podium__stand">
                <span className="podium__medal">🥉</span>
                <span className="podium__rank">#3</span>
              </div>
            </div>
          )}

        </div>

        <div className="lb__list" data-stagger>
          {leaderList.map((u) => (
            <div
              className={`lb-row ${u.uid === user?.uid ? 'lb-row--me' : ''}`}
              key={u.uid}
            >
              <span className="lb-row__rank">
                #{u.rank}
              </span>

              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  u.name
                )}&background=2563eb&color=fff`}
                alt={u.name}
              />

              <span className="lb-row__name">
                {u.name}
              </span>

              <span className="lb-row__pts">
                {u.points.toLocaleString()} pts
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h3>Your Rank: #{myRank ?? '--'}</h3>

          <p>
            Your Points:{' '}
            {leaderboard.find((u) => u.uid === user?.uid)?.points ?? 0}
          </p>

          <p>Total Users: {leaderboard.length}</p>
        </div>
      </div>
    </section>
  );
}