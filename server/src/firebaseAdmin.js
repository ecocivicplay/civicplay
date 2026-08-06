import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync(new URL('../serviceAccountKey.json', import.meta.url))
);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'eco-civivplay-2.firebasestorage.app',
});

export const db = getFirestore(app);
export const bucket = getStorage(app).bucket();
export const authAdmin = getAuth(app);
export default app;