import { Router } from 'express';
import { db } from '../firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

const memberDocId = (communityId, uid) => `${communityId}_${uid}`;

async function createNotification({ userId, type, title, message, communityId = null, inviteId = null }) {
  await db.collection('notifications').add({
    userId,
    type,
    title,
    message,
    communityId,
    inviteId,
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function isAdmin(communityId, uid) {
  if (!uid) return false;
  const snap = await db.collection('communityMembers').doc(memberDocId(communityId, uid)).get();
  return snap.exists && snap.data().role === 'admin' && snap.data().status === 'approved';
}

router.post('/', async (req, res) => {
  try {
    const { name, description, category, location, image, createdBy, createdByUsername } = req.body;
    if (!name || !createdBy || !createdByUsername) {
      return res.status(400).json({ error: 'name, createdBy and createdByUsername are required' });
    }

    const communityRef = db.collection('communities').doc();
    await communityRef.set({
      name,
      description: description || '',
      category: category || 'Other',
      location: location || '',
      image: image || '',
      createdBy,
      createdByUsername,
      createdAt: FieldValue.serverTimestamp(),
      membersCount: 1,
      lastMessage: null,
    });

    await db.collection('communityMembers').doc(memberDocId(communityRef.id, createdBy)).set({
      communityId: communityRef.id,
      userId: createdBy,
      username: createdByUsername,
      role: 'admin',
      status: 'approved',
      joinedAt: FieldValue.serverTimestamp(),
    });

    const snap = await communityRef.get();
    res.json({ id: communityRef.id, ...snap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create community' });
  }
});

// Suggested communities: all communities the given uid has NOT joined/requested.
router.get('/suggested', async (req, res) => {
  try {
    const { uid, search = '' } = req.query;
    const communitiesSnap = await db.collection('communities').orderBy('createdAt', 'desc').get();

    let excludeIds = new Set();
    if (uid) {
      const [membersSnap, requestsSnap] = await Promise.all([
        db.collection('communityMembers').where('userId', '==', uid).get(),
        db.collection('communityRequests').where('userId', '==', uid).where('status', '==', 'pending').get(),
      ]);
      membersSnap.docs.forEach((d) => excludeIds.add(d.data().communityId));
      requestsSnap.docs.forEach((d) => excludeIds.add(d.data().communityId));
    }

    const q = search.trim().toLowerCase();
    const results = communitiesSnap.docs
      .filter((d) => !excludeIds.has(d.id))
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((c) => !q || c.name.toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q) || (c.location || '').toLowerCase().includes(q));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load suggested communities' });
  }
});

// Joined communities for a user, with last message preview + member count.
router.get('/mine', async (req, res) => {
  try {
    const { uid, search = '' } = req.query;
    if (!uid) return res.status(400).json({ error: 'uid is required' });

    const membersSnap = await db
      .collection('communityMembers')
      .where('userId', '==', uid)
      .where('status', '==', 'approved')
      .get();

    const communityIds = membersSnap.docs.map((d) => d.data().communityId);
    if (communityIds.length === 0) return res.json([]);

    const communities = await Promise.all(
      communityIds.map(async (id) => {
        const snap = await db.collection('communities').doc(id).get();
        if (!snap.exists) return null;
        return { id: snap.id, ...snap.data() };
      })
    );

    const q = search.trim().toLowerCase();
    const filtered = communities
      .filter(Boolean)
      .filter((c) => !q || c.name.toLowerCase().includes(q));

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load joined communities' });
  }
});

// Search users by username prefix (for the @mention invite box).
router.get('/search-users', async (req, res) => {
  try {
    const query = (req.query.query || '').toLowerCase().replace('@', '').trim();
    if (!query) return res.json([]);

    const snapshot = await db
      .collection('users')
      .orderBy('username')
      .startAt(query)
      .endAt(query + '\uf8ff')
      .limit(10)
      .get();

    res.json(snapshot.docs.map((d) => ({ uid: d.id, username: d.data().username, name: d.data().name })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Pending invites for a user.
router.get('/invites/mine', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: 'uid is required' });
    const snap = await db
      .collection('communityInvites')
      .where('receiverId', '==', uid)
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load invites' });
  }
});

router.post('/invites/:inviteId/accept', async (req, res) => {
  try {
    const inviteRef = db.collection('communityInvites').doc(req.params.inviteId);
    const inviteSnap = await inviteRef.get();
    if (!inviteSnap.exists) return res.status(404).json({ error: 'Invite not found' });
    const invite = inviteSnap.data();

    await db.collection('communityMembers').doc(memberDocId(invite.communityId, invite.receiverId)).set({
      communityId: invite.communityId,
      userId: invite.receiverId,
      username: invite.receiverUsername,
      role: 'member',
      status: 'approved',
      joinedAt: FieldValue.serverTimestamp(),
    });
    await db.collection('communities').doc(invite.communityId).update({ membersCount: FieldValue.increment(1) });
    await inviteRef.update({ status: 'accepted' });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept invite' });
  }
});

router.post('/invites/:inviteId/reject', async (req, res) => {
  try {
    await db.collection('communityInvites').doc(req.params.inviteId).update({ status: 'rejected' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reject invite' });
  }
});

// Single community
router.get('/:id', async (req, res) => {
  try {
    const snap = await db.collection('communities').doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: 'Community not found' });
    res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
});

// Update community info (admin only)
router.patch('/:id', async (req, res) => {
  try {
    const { uid, ...updates } = req.body;
    if (!(await isAdmin(req.params.id, uid))) return res.status(403).json({ error: 'Admin only' });
    delete updates.membersCount;
    delete updates.createdBy;
    delete updates.createdAt;
    await db.collection('communities').doc(req.params.id).update(updates);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update community' });
  }
});

// Delete community (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!(await isAdmin(req.params.id, uid))) return res.status(403).json({ error: 'Admin only' });

    const communityId = req.params.id;
    const batchDeletes = [];
    for (const col of ['communityMembers', 'communityRequests', 'communityMessages']) {
      const snap = await db.collection(col).where('communityId', '==', communityId).get();
      snap.docs.forEach((d) => batchDeletes.push(d.ref.delete()));
    }
    await Promise.all(batchDeletes);
    await db.collection('communities').doc(communityId).delete();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete community' });
  }
});

/* ---------------- Members ---------------- */

router.get('/:id/members', async (req, res) => {
  try {
    const snap = await db
      .collection('communityMembers')
      .where('communityId', '==', req.params.id)
      .where('status', '==', 'approved')
      .get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load members' });
  }
});

// Check current membership/role for a uid in a community.
router.get('/:id/members/:uid', async (req, res) => {
  try {
    const snap = await db.collection('communityMembers').doc(memberDocId(req.params.id, req.params.uid)).get();
    res.json(snap.exists ? snap.data() : null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check membership' });
  }
});

router.delete('/:id/members/:uid', async (req, res) => {
  try {
    const { requesterUid } = req.query;
    const communityId = req.params.id;
    const targetUid = req.params.uid;
    const selfLeave = requesterUid === targetUid;

    if (!selfLeave && !(await isAdmin(communityId, requesterUid))) {
      return res.status(403).json({ error: 'Admin only' });
    }

    await db.collection('communityMembers').doc(memberDocId(communityId, targetUid)).delete();
    await db.collection('communities').doc(communityId).update({ membersCount: FieldValue.increment(-1) });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

/* ---------------- Invite by username ---------------- */

router.post('/:id/invites', async (req, res) => {
  try {
    const { senderId, senderUsername, receiverUsername } = req.body;
    const communityId = req.params.id;
    if (!(await isAdmin(communityId, senderId))) return res.status(403).json({ error: 'Admin only' });

    const userSnap = await db
      .collection('users')
      .where('username', '==', receiverUsername.toLowerCase().replace('@', ''))
      .limit(1)
      .get();
    if (userSnap.empty) return res.status(404).json({ error: 'User not found' });
    const receiver = userSnap.docs[0];

    const existingMember = await db.collection('communityMembers').doc(memberDocId(communityId, receiver.id)).get();
    if (existingMember.exists) return res.status(400).json({ error: 'User is already a member' });

    const communitySnap = await db.collection('communities').doc(communityId).get();
    if (!communitySnap.exists) return res.status(404).json({ error: 'Community not found' });

    const inviteRef = await db.collection('communityInvites').add({
      communityId,
      communityName: communitySnap.data().name,
      senderId,
      senderUsername,
      receiverId: receiver.id,
      receiverUsername: receiver.data().username,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    await createNotification({
      userId: receiver.id,
      type: 'invite',
      title: 'Community invite',
      message: `You have been invited to join ${communitySnap.data().name}`,
      communityId,
      inviteId: inviteRef.id,
    });

    res.json({ id: inviteRef.id, ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send invite' });
  }
});

/* ---------------- Join requests ---------------- */

router.post('/:id/requests', async (req, res) => {
  try {
    const { userId, username } = req.body;
    const communityId = req.params.id;

    const existingMember = await db.collection('communityMembers').doc(memberDocId(communityId, userId)).get();
    if (existingMember.exists) return res.status(400).json({ error: 'Already a member' });

    await db.collection('communityRequests').doc(memberDocId(communityId, userId)).set({
      communityId,
      userId,
      username,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    const communitySnap = await db.collection('communities').doc(communityId).get();
    if (communitySnap.exists) {
      await createNotification({
        userId: communitySnap.data().createdBy,
        type: 'join_request',
        title: 'New join request',
        message: `${username} requested to join ${communitySnap.data().name}`,
        communityId,
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send join request' });
  }
});

router.get('/:id/requests', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!(await isAdmin(req.params.id, uid))) return res.status(403).json({ error: 'Admin only' });
    const snap = await db
      .collection('communityRequests')
      .where('communityId', '==', req.params.id)
      .where('status', '==', 'pending')
      .get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load requests' });
  }
});

router.post('/:id/requests/:requestUid/approve', async (req, res) => {
  try {
    const { adminUid } = req.body;
    const communityId = req.params.id;
    const requestUid = req.params.requestUid;
    if (!(await isAdmin(communityId, adminUid))) return res.status(403).json({ error: 'Admin only' });

    const reqRef = db.collection('communityRequests').doc(memberDocId(communityId, requestUid));
    const reqSnap = await reqRef.get();
    if (!reqSnap.exists) return res.status(404).json({ error: 'Request not found' });
    const requestData = reqSnap.data();

    await db.collection('communityMembers').doc(memberDocId(communityId, requestUid)).set({
      communityId,
      userId: requestUid,
      username: requestData.username,
      role: 'member',
      status: 'approved',
      joinedAt: FieldValue.serverTimestamp(),
    });
    await db.collection('communities').doc(communityId).update({ membersCount: FieldValue.increment(1) });
    await reqRef.update({ status: 'approved' });

    const communitySnap = await db.collection('communities').doc(communityId).get();
    await createNotification({
      userId: requestUid,
      type: 'request_approved',
      title: 'Request approved',
      message: `Your request to join ${communitySnap.data().name} was approved`,
      communityId,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

router.post('/:id/requests/:requestUid/reject', async (req, res) => {
  try {
    const { adminUid } = req.body;
    const communityId = req.params.id;
    const requestUid = req.params.requestUid;
    if (!(await isAdmin(communityId, adminUid))) return res.status(403).json({ error: 'Admin only' });

    const reqRef = db.collection('communityRequests').doc(memberDocId(communityId, requestUid));
    await reqRef.update({ status: 'rejected' });

    const communitySnap = await db.collection('communities').doc(communityId).get();
    await createNotification({
      userId: requestUid,
      type: 'request_rejected',
      title: 'Request rejected',
      message: `Your request to join ${communitySnap.exists ? communitySnap.data().name : 'the community'} was rejected`,
      communityId,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

export default router;
