import { useNavigate } from 'react-router-dom';
import { FiUsers, FiMessageCircle } from 'react-icons/fi';
import './CommunityCard.css';


export default function CommunityCard({ community }) {
  const navigate = useNavigate();

  return (
    <div className="commCard glass" onClick={() => navigate(`/community/${community.id}`)}>
      <div className="commCard__img">
        {community.image ? (
          <img src={community.image} alt={community.name} />
        ) : (
          <div className="commCard__imgFallback">{community.name?.charAt(0)}</div>
        )}
      </div>
      <div className="commCard__body">
        <div className="commCard__top">
          <h3>{community.name}</h3>
          <span className="commCard__members"><FiUsers /> {community.membersCount || 0}</span>
        </div>
        <p className="commCard__desc">{community.description}</p>
        {community.lastMessage ? (
          <p className="commCard__preview">
            <strong>{community.lastMessage.senderName}:</strong> {community.lastMessage.text}
          </p>
        ) : (
          <p className="commCard__preview commCard__preview--muted">No messages yet</p>
        )}
      </div>
      <button className="commCard__open" onClick={() => navigate(`/community/${community.id}`)}>
        <FiMessageCircle /> Open Chat
      </button>
    </div>
  );
}
