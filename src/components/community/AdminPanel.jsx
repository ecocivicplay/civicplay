import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiUserX, FiTrash2, FiUsers, FiInbox } from 'react-icons/fi';
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getMembers,
  removeMember,
  deleteCommunity,
} from '../../services/communityService';
import './AdminPanel.css';
import './Modal.css';

export default function AdminPanel({ community, adminUid, onClose, onDeleted }) {
  const [tab, setTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function loadRequests() {
    const data = await getPendingRequests(community.id, adminUid);
    setRequests(data);
  }
  async function loadMembers() {
    const data = await getMembers(community.id);
    setMembers(data);
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([loadRequests(), loadMembers()]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community.id]);

  async function handleApprove(uid) {
    await approveRequest(community.id, uid, adminUid);
    setRequests((r) => r.filter((req) => req.userId !== uid));
    loadMembers();
  }
  async function handleReject(uid) {
    await rejectRequest(community.id, uid, adminUid);
    setRequests((r) => r.filter((req) => req.userId !== uid));
  }
  async function handleRemoveMember(uid) {
    if (uid === adminUid) return;
    await removeMember(community.id, uid, adminUid);
    setMembers((m) => m.filter((mem) => mem.userId !== uid));
  }
  async function handleDeleteCommunity() {
    await deleteCommunity(community.id, adminUid);
    onDeleted();
  }

  return (
    <div className="ccModal__overlay" onClick={onClose}>
      <div className="ccModal glass adminPanel" onClick={(e) => e.stopPropagation()}>
        <div className="ccModal__header">
          <h2>Manage Community</h2>
          <button className="ccModal__close" onClick={onClose}><FiX /></button>
        </div>

        <div className="adminPanel__tabs">
          <button className={tab === 'requests' ? 'active' : ''} onClick={() => setTab('requests')}>
            <FiInbox /> Requests {requests.length > 0 && <span className="adminPanel__badge">{requests.length}</span>}
          </button>
          <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>
            <FiUsers /> Members ({members.length})
          </button>
          <button className={tab === 'danger' ? 'active' : ''} onClick={() => setTab('danger')}>
            <FiTrash2 /> Danger Zone
          </button>
        </div>

        {loading ? (
          <p className="adminPanel__loading">Loading…</p>
        ) : (
          <div className="adminPanel__content">
            {tab === 'requests' && (
              requests.length === 0 ? <p className="adminPanel__empty">No pending join requests</p> : (
                requests.map((req) => (
                  <div key={req.userId} className="adminPanel__row">
                    <div className="adminPanel__avatar">{req.username?.charAt(0).toUpperCase()}</div>
                    <span className="adminPanel__name">{req.username}</span>
                    <div className="adminPanel__actions">
                      <button className="adminPanel__approve" onClick={() => handleApprove(req.userId)}><FiCheck /></button>
                      <button className="adminPanel__reject" onClick={() => handleReject(req.userId)}><FiX /></button>
                    </div>
                  </div>
                ))
              )
            )}

            {tab === 'members' && (
              members.map((m) => (
                <div key={m.userId} className="adminPanel__row">
                  <div className="adminPanel__avatar">{m.username?.charAt(0).toUpperCase()}</div>
                  <span className="adminPanel__name">
                    {m.username} {m.role === 'admin' && <span className="adminPanel__roleTag">Admin</span>}
                  </span>
                  {m.userId !== adminUid && (
                    <button className="adminPanel__reject" onClick={() => handleRemoveMember(m.userId)}>
                      <FiUserX />
                    </button>
                  )}
                </div>
              ))
            )}

            {tab === 'danger' && (
              <div className="adminPanel__danger">
                <p>Deleting this community removes all members, requests, and messages permanently. This cannot be undone.</p>
                {!confirmingDelete ? (
                  <button className="adminPanel__deleteBtn" onClick={() => setConfirmingDelete(true)}>
                    <FiTrash2 /> Delete Community
                  </button>
                ) : (
                  <div className="adminPanel__confirmRow">
                    <button className="adminPanel__deleteBtn" onClick={handleDeleteCommunity}>Yes, delete permanently</button>
                    <button className="adminPanel__cancelBtn" onClick={() => setConfirmingDelete(false)}>Cancel</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
