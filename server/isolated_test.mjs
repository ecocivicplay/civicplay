import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json'));

// Deliberately not touching Storage or Auth admin here - Firestore only,
// to test whether those other initializeApp calls are somehow interfering.
const app = initializeApp({
  credential: cert(serviceAccount),
}, 'isolated-test-app');

const db = getFirestore(app);

try {
  const snap = await db.collection('users').doc('test123').get();
  console.log('SUCCESS - exists:', snap.exists);
} catch (err) {
  console.log('FAILED with code:', err.code, 'message:', err.message || '(empty)');
  console.log('Full error details field:', err.details || '(empty)');
}
