const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const BASE = `${API_BASE}/api/communities`;
const NOTIF_BASE = `${API_BASE}/api/notifications`;

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

/* Communities */
export const createCommunity = (payload) =>
  fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(handle);

export const getJoinedCommunities = (uid, search = '') =>
  fetch(`${BASE}/mine?uid=${encodeURIComponent(uid)}&search=${encodeURIComponent(search)}`).then(handle);

export const getSuggestedCommunities = (uid, search = '') =>
  fetch(`${BASE}/suggested?uid=${encodeURIComponent(uid || '')}&search=${encodeURIComponent(search)}`).then(handle);

export const getCommunity = (id) => fetch(`${BASE}/${id}`).then(handle);

export const updateCommunity = (id, payload) =>
  fetch(`${BASE}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(handle);

export const deleteCommunity = (id, uid) =>
  fetch(`${BASE}/${id}?uid=${encodeURIComponent(uid)}`, { method: 'DELETE' }).then(handle);

/* Members */
export const getMembers = (communityId) => fetch(`${BASE}/${communityId}/members`).then(handle);

export const getMembership = (communityId, uid) => fetch(`${BASE}/${communityId}/members/${uid}`).then(handle);

export const removeMember = (communityId, targetUid, requesterUid) =>
  fetch(`${BASE}/${communityId}/members/${targetUid}?requesterUid=${encodeURIComponent(requesterUid)}`, { method: 'DELETE' }).then(handle);

/* Search users for invite */
export const searchUsers = (query) => fetch(`${BASE}/search-users?query=${encodeURIComponent(query)}`).then(handle);

/* Invites */
export const inviteUser = (communityId, payload) =>
  fetch(`${BASE}/${communityId}/invites`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(handle);

export const getMyInvites = (uid) => fetch(`${BASE}/invites/mine?uid=${encodeURIComponent(uid)}`).then(handle);

export const acceptInvite = (inviteId) => fetch(`${BASE}/invites/${inviteId}/accept`, { method: 'POST' }).then(handle);

export const rejectInvite = (inviteId) => fetch(`${BASE}/invites/${inviteId}/reject`, { method: 'POST' }).then(handle);

/* Join requests */
export const requestToJoin = (communityId, payload) =>
  fetch(`${BASE}/${communityId}/requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(handle);

export const getPendingRequests = (communityId, uid) =>
  fetch(`${BASE}/${communityId}/requests?uid=${encodeURIComponent(uid)}`).then(handle);

export const approveRequest = (communityId, requestUid, adminUid) =>
  fetch(`${BASE}/${communityId}/requests/${requestUid}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminUid }),
  }).then(handle);

export const rejectRequest = (communityId, requestUid, adminUid) =>
  fetch(`${BASE}/${communityId}/requests/${requestUid}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminUid }),
  }).then(handle);

/* Notifications */
export const getNotifications = (uid) => fetch(`${NOTIF_BASE}?uid=${encodeURIComponent(uid)}`).then(handle);

export const markNotificationRead = (id) => fetch(`${NOTIF_BASE}/${id}/read`, { method: 'PATCH' }).then(handle);

export const markAllNotificationsRead = (uid) =>
  fetch(`${NOTIF_BASE}/read-all`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid }) }).then(handle);
