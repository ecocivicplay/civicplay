import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Link } from 'react-router-dom';
import {
  FiEdit2, FiMail, FiPhone, FiCalendar, FiUser,
  FiAward, FiTarget, FiCheckCircle, FiGift, FiClock,
  FiZap, FiTrendingUp, FiActivity, FiFileText, FiMapPin,
  FiArrowRight, FiFlag,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { challenges } from '../utils/data';
import './Profile.css';

/*
  RANK LADDER — derived-value note
  ----------------------------------------------------------------
  Unchanged from the original. The ladder is calculated live from
  points using round, easy-to-explain thresholds so no fake data
  is ever shown. If a real backend level system is added, this is
  the only function that needs to change.
*/
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2500, 4000];
const LEVEL_NAMES = [
  'Newcomer', 'Explorer', 'Contributor', 'Advocate',
  'Guardian', 'Champion', 'Steward', 'Legend',
];

function getLevelInfo(points) {
  const p = points ?? 0;
  let idx = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (p >= LEVEL_THRESHOLDS[i]) idx = i;
  }
  const floor = LEVEL_THRESHOLDS[idx];
  const nextThreshold = LEVEL_THRESHOLDS[idx + 1];
  const isMaxLevel = nextThreshold === undefined;
  const progressPct = isMaxLevel
    ? 100
    : Math.min(100, Math.round(((p - floor) / (nextThreshold - floor)) * 100));

  return {
    level: idx + 1,
    name: LEVEL_NAMES[idx],
    points: p,
    nextThreshold,
    isMaxLevel,
    progressPct,
    pointsToNext: isMaxLevel ? 0 : Math.max(0, nextThreshold - p),
  };
}

// Small helper — safely format a Firestore timestamp / date-ish value.
// Purely presentational; does not touch any stored data.
function formatDate(value) {
  if (!value) return null;
  try {
    // Firestore Timestamp support
    const d = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return null;
  }
}

// Map a free-form status string to one of our three visual states.
function statusClass(status) {
  const s = (status || '').toString().toLowerCase();
  if (s.includes('approve') || s.includes('resolved') || s.includes('done')) return 'approved';
  if (s.includes('reject') || s.includes('declin')) return 'rejected';
  return 'pending';
}

export default function Profile() {
  const { user, profile, getRank } = useAuth();
  const [rank, setRank] = useState(null);
  const [rankLoading, setRankLoading] = useState(true);
  const [myReports, setMyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [myProofs, setMyProofs] = useState([]);
  const [loadingProofs, setLoadingProofs] = useState(true);

  useEffect(() => {
    if (!user) return;

    getRank().then((r) => {
      setRank(r);
      setRankLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "reports"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyReports(reports);
      setLoadingReports(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "proofs"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const proofs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyProofs(proofs);
      setLoadingProofs(false);
    });

    return () => unsubscribe();

  }, [user]);

  if (!user) {
    return (
      <div className="profilePage profilePage--empty">
        <div className="emptyState">
          <div className="emptyState__icon"><FiUser /></div>
          <h2>You're not logged in</h2>
          <p>Log in to view your CivicPlay dashboard, rewards and progress.</p>
          <Link to="/login" className="btnPrimary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user.displayName || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const stats = [
    { icon: FiAward, label: 'Civic Points', value: profile?.points ?? 0 },
    { icon: FiFileText, label: 'Reports Submitted', value: myReports.length },
    { icon: FiCheckCircle, label: 'Challenges Completed', value: profile?.completedChallenges ?? 0 },
    { icon: FiCheckCircle, label: 'Verified Proofs', value: myProofs.filter(p => p.verified).length },
    { icon: FiGift, label: 'Rewards Redeemed', value: profile?.redeemedRewards ?? 0 },
  ];

  // Same lookup pattern the Challenges page uses.
  const takenIds = profile?.takenChallengeIds || [];
  const completedIds = profile?.completedChallengeIds || [];
  const inProgress = challenges.filter((c) => takenIds.includes(c.id));
  const completed = challenges.filter((c) => completedIds.includes(c.id));

  const levelInfo = getLevelInfo(profile?.points);

  const location =
    typeof profile?.location === "object"
      ? profile.location?.address
      : profile?.location || profile?.city || profile?.address;
  const memberSince = formatDate(profile?.createdAt || user?.metadata?.creationTime);

  // Recent reports (newest-ish first) for the premium report cards.
  const recentReports = [...myReports]
    .sort((a, b) => {
      const da = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dbb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dbb - da;
    })
    .slice(0, 4);

  return (
    <div className="profilePage">
      {/* Floating background shapes */}
      <div className="profileBg" aria-hidden="true">
        <span className="profileBg__blob profileBg__blob--1" />
        <span className="profileBg__blob profileBg__blob--2" />
        <span className="profileBg__blob profileBg__blob--3" />
      </div>

      <div className="profilePage__layout">
        {/* ============ HERO ============ */}
        <div className="profilePage__card profilePage__identity profileHero">
          <div className="profileCover">
            <span className="profileCover__glow profileCover__glow--a" />
            <span className="profileCover__glow profileCover__glow--b" />
          </div>

          <div className="profileHero__body">
            <div className="profileHero__main">
              <div className="profileAvatar">
                <div className="profilePage__avatar">{initial}</div>
              </div>

              <div className="profileHero__identity">
                <h1>{displayName}</h1>
                <p className="profileHero__email"><FiMail /> {user.email}</p>

                <div className="profileHero__meta">
                  <span className={`profileRank profileRank--${(profile?.rank || "Bronze").toLowerCase()}`}>
                    <FiAward />
                    <span className="profileRank__name">{profile?.rank || "Bronze"}</span>
                  </span>
                  <span className="profileChip">🔥 {profile?.streak || 0} Day Streak</span>
                  {location && (
                    <span className="profileChip">
                      <FiMapPin />
                      {typeof location === "object" ? location.address : location}
                    </span>
                  )}
                  {memberSince && (
                    <span className="profileChip"><FiCalendar /> Since {memberSince}</span>
                  )}
                </div>
              </div>

              <Link to="/profile/edit" className="btnPrimary profileHero__edit">
                <FiEdit2 /> Edit Profile
              </Link>
            </div>

            {/* ============ LEVEL / XP ============ */}
            <div className="levelCard">
              <div className="levelCard__head">
                <span className="levelBadge"><FiZap /> Level {levelInfo.level}</span>
                <span className="levelCard__name">{levelInfo.name}</span>
              </div>

              <div
                className="xpBar"
                role="progressbar"
                aria-valuenow={levelInfo.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress to level ${levelInfo.level + 1}`}
              >
                <div className="xpFill" style={{ width: `${levelInfo.progressPct}%` }} />
              </div>

              <div className="xpText">
                <span>{levelInfo.points} XP</span>
                <span>
                  {levelInfo.isMaxLevel
                    ? 'Max level reached 🎉'
                    : `${levelInfo.pointsToNext} XP to Level ${levelInfo.level + 1}`}
                </span>
              </div>

              <div className="rankProgress">
                <span className="rankProgress__label">Next Rank</span>
                <span className="rankProgress__value">
                  {profile?.rank === "Bronze" && `${7 - (profile?.streak || 0)} more days to Silver`}
                  {profile?.rank === "Silver" && `${14 - (profile?.streak || 0)} more days to Gold`}
                  {profile?.rank === "Gold" && `${30 - (profile?.streak || 0)} more days to Platinum`}
                  {profile?.rank === "Platinum" && `${60 - (profile?.streak || 0)} more days to Diamond`}
                  {profile?.rank === "Diamond" && "Highest Rank Achieved 🎉"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ SIDEBAR ============ */}
        <aside className="profileSidebar">
          {/* STATS */}
          <div className="profilePage__card">
            <div className="profilePage__statsGrid">
              {stats.map((s) => (
                <div className="profilePage__statCard" key={s.label}>
                  <span className="profilePage__statIcon"><s.icon /></span>
                  <span className="profilePage__statValue">{s.value}</span>
                  <span className="profilePage__statLabel">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ABOUT */}
          <div className="profilePage__card">
            <h2 className="sectionTitle"><FiUser /> About</h2>
            <div className="profilePage__details">
              <div className="profilePage__row">
                <FiMail /> <span>{user.email}</span>
              </div>
              {profile?.mobile && (
                <div className="profilePage__row">
                  <FiPhone /> <span>{profile.mobile}</span>
                </div>
              )}
              {profile?.dob && (
                <div className="profilePage__row">
                  <FiCalendar /> <span>{profile.dob}</span>
                </div>
              )}
              {profile?.gender && (
                <div className="profilePage__row">
                  <FiUser /> <span style={{ textTransform: 'capitalize' }}>{profile.gender.replace(/_/g, ' ')}</span>
                </div>
              )}
              {location && (
                <div className="profilePage__row">
                  <FiMapPin />
                  <span>{typeof location === "object" ? location.address : location}</span>
                </div>
              )}
              {profile?.bio && (
                <div className="profilePage__row profilePage__row--bio">
                  <FiFileText /> <span>{profile.bio}</span>
                </div>
              )}
            </div>
          </div>

          {/* REWARDS */}
          <div className="profilePage__card">
            <h2 className="sectionTitle"><FiGift /> Rewards</h2>
            {profile?.rewards?.length > 0 ? (
              <div className="rewardGrid">
                {profile.rewards.map((reward) => (
                  <div className="rewardCard" key={reward}>
                    <span className="rewardCard__icon"><FiGift /></span>
                    <span className="rewardCard__name">{reward}</span>
                    <span className="rewardCard__status">Redeemed</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyState emptyState--sm">
                <div className="emptyState__icon emptyState__icon--sm"><FiGift /></div>
                <p>No rewards unlocked yet.</p>
              </div>
            )}
          </div>
        </aside>

        {/* ============ MAIN ACTIVITY COLUMN ============ */}
        <div className="profilePage__activity">
          {/* RECENT REPORTS */}
          <div className="profilePage__activitySection">
            <h2 className="sectionTitle">
              <FiFlag /> Recent Reports ({myReports.length})
            </h2>

            {loadingReports ? (
              <div className="skeletonGrid">
                {[0, 1, 2].map((i) => <div className="skeletonCard" key={i} />)}
              </div>
            ) : recentReports.length === 0 ? (
              <div className="emptyState emptyState--sm">
                <div className="emptyState__icon emptyState__icon--sm"><FiFlag /></div>
                <p>No reports submitted yet.</p>
                <Link to="/report" className="btnGhost">Report an issue</Link>
              </div>
            ) : (
              <div className="reportGrid">
                {recentReports.map((r) => {
                  const sc = statusClass(r.status);
                  const img = r.imageUrl || r.image || r.photoUrl || (Array.isArray(r.images) ? r.images[0] : null);
                  const date = formatDate(r.createdAt);
                  return (
                    <div className="reportCard" key={r.id}>
                      {img ? (
                        <div className="reportCard__media" style={{ backgroundImage: `url(${img})` }}>
                          <span className={`statusBadge statusBadge--${sc}`}>{r.status || 'Pending'}</span>
                        </div>
                      ) : (
                        <div className="reportCard__media reportCard__media--empty">
                          <FiFlag />
                          <span className={`statusBadge statusBadge--${sc}`}>{r.status || 'Pending'}</span>
                        </div>
                      )}
                      <div className="reportCard__body">
                        <h3 className="reportCard__title">{r.issueType || r.type || r.title || 'Reported Issue'}</h3>
                        {(r.address || r.location) && (
                          <p className="reportCard__addr">
                            <FiMapPin />{" "}
                            {typeof r.location === "object"
                              ? r.location?.address
                              : (r.address || r.location)}
                          </p>
                        )}
                        <div className="reportCard__footer">
                          {date && <span className="reportCard__date"><FiCalendar /> {date}</span>}
                          {(r.points != null) && <span className="reportCard__pts">+{r.points} pts</span>}
                        </div>
                        <Link to={`/reports/${r.id}`} className="reportCard__view">
                          View <FiArrowRight />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CIVIC PROOFS */}

          <div className="profilePage__activitySection">

            <h2 className="sectionTitle">
              <FiCheckCircle /> Civic Proofs ({myProofs.length})
            </h2>

            {loadingProofs ? (

              <div className="emptyState emptyState--sm">
                Loading proofs...
              </div>

            ) : myProofs.length === 0 ? (

              <div className="emptyState emptyState--sm">
                <p>No proofs uploaded yet.</p>
              </div>

            ) : (

              <div className="reportGrid">

                {myProofs.slice(0, 4).map((proof) => (

                  <div className="reportCard" key={proof.id}>

                    <div
                      className="reportCard__media"
                      style={{
                        backgroundImage: `url(${proof.mediaUrl})`
                      }}
                    >

                      <span className={`statusBadge statusBadge--${proof.verified ? "approved" : "rejected"
                        }`}>
                        {proof.verified ? "Verified" : "Rejected"}
                      </span>

                    </div>


                    <div className="reportCard__body">

                      <h3 className="reportCard__title">
                        {proof.activity || "Civic Activity"}
                      </h3>

                      <p>
                        Confidence: {Math.round((proof.confidence || 0) * 100)}%
                      </p>

                      <p>
                        {proof.reason}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* IN PROGRESS */}
          <div className="profilePage__activitySection">
            <h2 className="sectionTitle"><FiClock /> In Progress ({inProgress.length})</h2>
            {inProgress.length === 0 ? (
              <div className="emptyState emptyState--sm">
                <div className="emptyState__icon emptyState__icon--sm"><FiClock /></div>
                <p>No challenges in progress yet.</p>
                <Link to="/challenges" className="btnGhost">Browse challenges</Link>
              </div>
            ) : (
              <ul className="profilePage__challengeList profilePage__challengeList--cards">
                {inProgress.map((c) => (
                  <li key={c.id} className="challengeCard challengeCard--pending">
                    <div className="challengeCard__top">
                      <span className="challengeCard__title">{c.title}</span>
                      <span className="profilePage__challengePoints">+{c.points} pts</span>
                    </div>
                    {c.difficulty && (
                      <span className="challengeCard__badge">{c.difficulty}</span>
                    )}
                    <div className="challengeCard__progress">
                      <div className="challengeCard__progressFill" style={{ width: '35%' }} />
                    </div>
                    <Link to={`/challenges/${c.id}`} className="challengeCard__continue">
                      Continue <FiTrendingUp />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* COMPLETED */}
          <div className="profilePage__activitySection">
            <h2 className="sectionTitle"><FiCheckCircle /> Completed ({completed.length})</h2>
            {completed.length === 0 ? (
              <div className="emptyState emptyState--sm">
                <div className="emptyState__icon emptyState__icon--sm"><FiCheckCircle /></div>
                <p>Nothing completed yet — your finished challenges will show up here.</p>
              </div>
            ) : (
              <ul className="profilePage__challengeList profilePage__challengeList--cards profilePage__challengeList--done">
                {completed.map((c) => (
                  <li key={c.id} className="challengeCard challengeCard--done">
                    <div className="challengeCard__top">
                      <span className="challengeCard__title">{c.title}</span>
                      <span className="profilePage__challengePoints">+{c.points} pts</span>
                    </div>
                    <span className="challengeCard__badge challengeCard__badge--done">
                      <FiCheckCircle /> Completed
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RECENT ACTIVITY */}
          {completed.length > 0 && (
            <div className="profilePage__activitySection">
              <h2 className="sectionTitle"><FiActivity /> Recent Activity</h2>
              <ul className="activityTimeline">
                {completed.slice(-3).reverse().map((c) => (
                  <li key={c.id} className="activityTimeline__item">
                    <span className="activityTimeline__dot" />
                    <div>
                      <p className="activityTimeline__text">
                        Completed <strong>{c.title}</strong>
                      </p>
                      <span className="activityTimeline__meta">+{c.points} pts earned</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
