import { useState, useEffect, useRef } from 'react';
import { FiX, FiSearch, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { searchUsers, inviteUser } from '../../services/communityService';
import './InviteMembersModal.css';


export default function InviteMembersModal({ community, onClose }) {
  const { user, profile } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [invited, setInvited] = useState({}); // uid -> 'sending' | 'sent' | 'error'
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const users = await searchUsers(query);
        setResults(users.filter((u) => u.uid !== user?.uid));
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, user]);

  async function handleInvite(target) {
    setInvited((s) => ({ ...s, [target.uid]: 'sending' }));
    try {
      await inviteUser(community.id, {
        senderId: user.uid,
        senderUsername: profile?.username || profile?.name || 'Admin',
        receiverUsername: target.username,
      });
      setInvited((s) => ({ ...s, [target.uid]: 'sent' }));
    } catch {
      setInvited((s) => ({ ...s, [target.uid]: 'error' }));
    }
  }

  return (
    <div className="ccModal__overlay" onClick={onClose}>
      <div className="ccModal glass" onClick={(e) => e.stopPropagation()}>
        <div className="ccModal__header">
          <h2>Invite Members</h2>
          <button className="ccModal__close" onClick={onClose}><FiX /></button>
        </div>

        <div className="inviteModal__search">
          <FiSearch />
          <input
            autoFocus
            placeholder="Search by username, e.g. @divy"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="inviteModal__results">
          {results.length === 0 && query.trim() && (
            <p className="inviteModal__empty">No users found</p>
          )}
          {results.map((u) => {
            const state = invited[u.uid];
            return (
              <div key={u.uid} className="inviteModal__row">
                <div className="inviteModal__avatar">{(u.name || u.username || '?').charAt(0).toUpperCase()}</div>
                <div className="inviteModal__info">
                  <strong>{u.name || u.username}</strong>
                  <span>@{u.username}</span>
                </div>
                <button
                  className={`inviteModal__btn ${state === 'sent' ? 'inviteModal__btn--sent' : ''}`}
                  onClick={() => handleInvite(u)}
                  disabled={state === 'sending' || state === 'sent'}
                >
                  {state === 'sent' ? <><FiCheck /> Invited</> : state === 'sending' ? 'Inviting…' : 'Invite'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
