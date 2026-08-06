// Bypasses the Admin SDK's gRPC transport entirely and hits Firestore's
// plain REST/HTTPS endpoint directly, using the same service account's
// credentials via a Google OAuth2 access token. If this works where the
// gRPC-based Admin SDK doesn't, the cause is network interference with
// gRPC specifically (common with some firewalls/antivirus/school-corp
// networks), not the Firebase project or credentials themselves.
import { GoogleAuth } from 'google-auth-library';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json'));
const projectId = serviceAccount.project_id;

const auth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/datastore'],
});

const client = await auth.getClient();
const token = await client.getAccessToken();

const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/test123`;

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token.token}` },
});

console.log('HTTP status:', res.status);
const body = await res.text();
console.log('Body:', body);
