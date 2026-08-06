import { useState } from 'react';
import { FiUsers, FiMapPin } from 'react-icons/fi';
import './SuggestedCommunityCard.css';


export default function SuggestedCommunityCard({ community, onJoin }) {
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  async function handleJoin() {
    setStatus('sending');
    try {
      await onJoin(community.id);
      setStatus('sent');
    } catch {
      setStatus('idle');
    }
  }

  return (
    <div className="suggCard glass">
      <div className="suggCard__img">
        {community.image ? (
          <img src={community.image} alt={community.name} />
        ) : (
          <div className="suggCard__imgFallback">{community.name?.charAt(0)}</div>
        )}
      </div>
      <div className="suggCard__body">
        <h4>{community.name}</h4>
        <div className="suggCard__meta">
          <span className="suggCard__tag">{community.category}</span>
          {community.location && <span><FiMapPin /> {community.location}</span>}
        </div>
        <span className="suggCard__members"><FiUsers /> {community.membersCount || 0} members</span>
      </div>
      <button
        className={`suggCard__join ${status === 'sent' ? 'suggCard__join--sent' : ''}`}
        onClick={handleJoin}
        disabled={status !== 'idle'}
      >
        {status === 'sent' ? 'Requested' : status === 'sending' ? 'Sending…' : 'Join Now'}
      </button>
    </div>
  );
}
