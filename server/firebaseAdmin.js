import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

// On Koyeb (production) set an env var called FIREBASE_SERVICE_ACCOUNT
// containing the ENTIRE contents of serviceAccountKey.json as a single-line string.
// Locally, it will fall back to reading the file from disk as before.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : JSON.parse(readFileSync(new URL('../serviceAccountKey.json', import.meta.url)));

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'eco-civivplay-2.firebasestorage.app',
});

export const db = getFirestore(app);
export const bucket = getStorage(app).bucket();
export const authAdmin = getAuth(app);
export default app;
