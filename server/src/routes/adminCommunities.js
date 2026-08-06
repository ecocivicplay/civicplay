import { Router } from 'express';
import { db } from '../firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

const memberDocId = (communityId, uid) => `${communityId}_${uid}`;

async function createNotification({ userId, type, title, message, communityId = null }) {
  await db.collection('notifications').add({
    userId,
    type,
    title,
    message,
    communityId,
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  });
}

/* Create a community directly from the admin panel — no join request, no
   approval step, created instantly since this is a trusted admin action. */
router.post('/', async (req, res) => {
  try {
    const { name, description, category, location, image, createdByUsername } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Community name is required' });
    }

    const communityRef = db.collection('communities').doc();
    await communityRef.set({
      name: name.trim(),
      description: description || '',
      category: category || 'Other',
      location: location || '',
      image: image || '',
      createdBy: 'admin',
      createdByUsername: createdByUsername || 'Admin',
      createdAt: FieldValue.serverTimestamp(),
      membersCount: 0,
      lastMessage: null,
    });

    const snap = await communityRef.get();
    res.json({ id: communityRef.id, ...snap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create community' });
  }
});

/* List every community on the platform, with pending request counts. */
router.get('/', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const snap = await db.collection('communities').orderBy('createdAt', 'desc').get();

    const communities = await Promise.all(
      snap.docs.map(async (doc) => {
        const requestsSnap = await db
          .collection('communityRequests')
          .where('communityId', '==', doc.id)
          .where('status', '==', 'pending')
          .get();
        return { id: doc.id, ...doc.data(), pendingRequestsCount: requestsSnap.size };
      })
    );

    const q = search.trim().toLowerCase();
    const filtered = communities.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q) || (c.location || '').toLowerCase().includes(q)
    );

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load communities' });
  }
});

/* Single community detail */
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

/* Members of a community */
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

router.delete('/:id/members/:uid', async (req, res) => {
  try {
    const { id: communityId, uid } = req.params;
    await db.collection('communityMembers').doc(memberDocId(communityId, uid)).delete();
    await db.collection('communities').doc(communityId).update({ membersCount: FieldValue.increment(-1) });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

/* Pending join requests for a community */
router.get('/:id/requests', async (req, res) => {
  try {
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
    const { id: communityId, requestUid } = req.params;
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
    const { id: communityId, requestUid } = req.params;
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

/* Delete a community outright (site-admin override, bypasses per-community admin role) */
router.delete('/:id', async (req, res) => {
  try {
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

export default router;
