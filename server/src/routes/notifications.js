import { Router } from 'express';
import { db } from '../firebaseAdmin.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: 'uid is required' });
    const snap = await db
      .collection('notifications')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(30)
      .get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.id).update({ read: true });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

router.patch('/read-all', async (req, res) => {
  try {
    const { uid } = req.body;
    const snap = await db.collection('notifications').where('userId', '==', uid).where('read', '==', false).get();
    await Promise.all(snap.docs.map((d) => d.ref.update({ read: true })));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark all read' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { audience, emails, title, body, type } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    let targetUids = [];
    if (audience === 'Specific Users' && emails?.length) {
      const usersSnap = await db.collection('users').where('email', 'in', emails.slice(0, 10)).get();
      targetUids = usersSnap.docs.map((d) => d.id);
    } else if (audience === 'Suspended Users') {
      const usersSnap = await db.collection('users').where('status', '==', 'Banned').get();
      targetUids = usersSnap.docs.map((d) => d.id);
    } else {
      const usersSnap = await db.collection('users').get();
      targetUids = usersSnap.docs.map((d) => d.id);
    }

    const batch = db.batch();
    targetUids.forEach((uid) => {
      const ref = db.collection('notifications').doc();
      batch.set(ref, {
        userId: uid,
        title,
        message: body || '',
        type: type || 'info',
        read: false,
        createdAt: new Date(),
      });
    });
    await batch.commit();

    res.json({ ok: true, sentTo: targetUids.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export default router;