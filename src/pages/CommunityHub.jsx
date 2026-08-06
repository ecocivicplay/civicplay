import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getJoinedCommunities, getSuggestedCommunities, requestToJoin } from '../services/communityService';
import CommunityCard from '../components/community/CommunityCard';
import SuggestedCommunityCard from '../components/community/SuggestedCommunityCard';
import CreateCommunityModal from '../components/community/CreateCommunityModal';
import './CommunityHub.css';

export default function CommunityHub() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [joined, setJoined] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [j, s] = await Promise.all([
        user ? getJoinedCommunities(user.uid, search) : Promise.resolve([]),
        getSuggestedCommunities(user?.uid, search),
      ]);
      setJoined(j);
      setSuggested(s);
    } catch (err) {
      console.error('Failed to load communities:', err);
    } finally {
      setLoading(false);
    }
  }, [user, search]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(loadAll, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [loadAll, search]);

  async function handleJoin(communityId) {
    if (!user) return;
    await requestToJoin(communityId, { userId: user.uid, username: profile?.username || profile?.name || 'User' });
  }

  function handleCreated(community) {
    setShowCreate(false);
    navigate(`/community/${community.id}`);
  }

  return (
    <div className="communityHub">
      <div className="container communityHub__top">
        <div>
          <h1>Community</h1>
          <p className="communityHub__subtitle">Join civic communities, organize local action, and chat with people who care about your neighborhood.</p>
        </div>
        <div className="communityHub__search">
          <FiSearch />
          <input placeholder="Search communities…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="container communityHub__grid">
        <section className="communityHub__main">
          <h2>Joined Communities</h2>
          {!user ? (
            <div className="communityHub__emptyState glass">
              <p>Log in to see and join civic communities.</p>
            </div>
          ) : loading ? (
            <p className="communityHub__loading">Loading…</p>
          ) : joined.length === 0 ? (
            <div className="communityHub__emptyState glass">
              <p>You haven't joined any community yet. Explore suggestions on the right, or start your own.</p>
            </div>
          ) : (
            <div className="communityHub__cards">
              {joined.map((c) => <CommunityCard key={c.id} community={c} />)}
            </div>
          )}
        </section>

        <aside className="communityHub__side">
          <h2>Suggested Communities</h2>
          {loading ? (
            <p className="communityHub__loading">Loading…</p>
          ) : suggested.length === 0 ? (
            <div className="communityHub__emptyState glass"><p>No suggestions right now.</p></div>
          ) : (
            suggested.map((c) => <SuggestedCommunityCard key={c.id} community={c} onJoin={handleJoin} />)
          )}
        </aside>
      </div>

      {user && (
        <button className="communityHub__fab" onClick={() => setShowCreate(true)} aria-label="Create community">
          <FiPlus />
        </button>
      )}

      {showCreate && (
        <CreateCommunityModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
