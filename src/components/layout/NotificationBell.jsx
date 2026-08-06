import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { acceptInvite, rejectInvite } from '../../services/communityService';
import './NotificationBell.css';

export default function NotificationBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(user?.uid);
  const [open, setOpen] = useState(false);
  const [acting, setActing] = useState({});
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  async function handleInviteAction(notif, action) {
    setActing((s) => ({ ...s, [notif.id]: true }));
    try {
      // notifications don't carry the invite id directly, so route the user
      // to the community and let them accept from there if this lookup fails
      if (action === 'accept') await acceptInvite(notif.inviteId);
      else await rejectInvite(notif.inviteId);
      await markRead(notif.id);
    } finally {
      setActing((s) => ({ ...s, [notif.id]: false }));
    }
  }

  function handleClickNotif(notif) {
    markRead(notif.id);
    if (notif.communityId) navigate(`/community/${notif.communityId}`);
    setOpen(false);
  }

  return (
    <div className="notifBell" ref={ref}>
      <button className="notifBell__trigger" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        <FiBell />
        {unreadCount > 0 && <span className="notifBell__dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notifBell__dropdown glass">
          <div className="notifBell__header">
            <span>Notifications</span>
            {unreadCount > 0 && <button onClick={markAllRead}>Mark all read</button>}
          </div>
          <div className="notifBell__list">
            {notifications.length === 0 && <p className="notifBell__empty">You're all caught up</p>}
            {notifications.map((n) => (
              <div key={n.id} className={`notifBell__item ${!n.read ? 'notifBell__item--unread' : ''}`} onClick={() => handleClickNotif(n)}>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                {n.type === 'invite' && (
                  <div className="notifBell__inviteActions" onClick={(e) => e.stopPropagation()}>
                    <button disabled={acting[n.id]} onClick={() => handleInviteAction(n, 'accept')}>Accept</button>
                    <button disabled={acting[n.id]} onClick={() => handleInviteAction(n, 'reject')}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
