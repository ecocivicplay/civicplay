import { Router } from 'express';
import multer from 'multer';
import { db, bucket } from '../firebaseAdmin.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('reports').get();

    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to fetch reports',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('reports').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const data = doc.data();
    const mediaUrl = data.mediaUrl || data.imageURL || data.videoURL;

    // Best-effort cleanup of the associated media file in Storage. This
    // should never block the report deletion itself if it fails.
    if (mediaUrl) {
      try {
        const prefix = `https://storage.googleapis.com/${bucket.name}/`;
        if (mediaUrl.startsWith(prefix)) {
          const filePath = mediaUrl.slice(prefix.length);
          await bucket.file(filePath).delete({ ignoreNotFound: true });
        }
      } catch (mediaErr) {
        console.error('Failed to delete report media:', mediaErr);
      }
    }

    await docRef.delete();
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { name, email, date, location, uid } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Media file is required' });

    const filename = `reports/${Date.now()}-${req.file.originalname}`;
    const fileRef = bucket.file(filename);
    await fileRef.save(req.file.buffer, { contentType: req.file.mimetype });
    await fileRef.makePublic();
    const mediaUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    const docRef = await db.collection('reports').add({
      uid: uid || null,
      name,
      email,
      date,
      location,
      mediaUrl,
      mediaType: req.file.mimetype.startsWith('video') ? 'video' : 'photo',
      status: 'pending',
      createdAt: new Date(),
    });

    res.status(201).json({ id: docRef.id, mediaUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

export default router;