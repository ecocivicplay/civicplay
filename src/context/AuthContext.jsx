import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../utils/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

async function apiGet(uid) {
  const res = await fetch(`${API_BASE}/api/users/${uid}`);
  if (!res.ok) throw new Error(`GET /users/${uid} failed: ${res.status}`);
  return res.json();
}
async function apiCreate(uid, data) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, ...data }),
  });
  if (!res.ok) throw new Error(`POST /users failed: ${res.status}`);
}
async function apiPatch(uid, data) {
  const res = await fetch(`${API_BASE}/api/users/${uid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PATCH /users/${uid} failed: ${res.status}`);
}
async function apiPost(path, data) {
  const res = await fetch(`${API_BASE}/api/users${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data || {}),
  });
  if (!res.ok) throw new Error(`POST /users${path} failed: ${res.status}`);
  return res.json();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  async function refreshProfile(uid) {
    try {
      const data = await apiGet(uid);
      setProfile(data);
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  }

  async function reportSubmitted() {
    if (!user) throw new Error("User not logged in");

    const result = await apiPost(`/${user.uid}/report-submitted`);

    setProfile(result.profile);

    return result.profile;
  }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await refreshProfile(firebaseUser.uid);
        } catch (err) {
          console.error('Failed to load profile:', err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signup({
    name,
    username,
    email,
    mobile,
    gender,
    dob,
    city,
    password,
  }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const profileData = {
      name,
      username,
      email,
      mobile,
      gender,
      dob,

      points: 0,

      pendingChallenges: 0,

      completedChallenges: 0,

      redeemedRewards: 0,

      // Rank system
      streak: 0,

      rank: "Bronze",

      rewards: [],

      lastActiveDate: null,
      gender,
      dob,
      city,
    };
    await apiCreate(cred.user.uid, profileData);
    setProfile(profileData);
    return cred.user;
  }

  async function login(identifier, password) {
    const cred = await signInWithEmailAndPassword(auth, identifier, password);
    return cred.user;
  }

  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    try {
      const existing = await apiGet(cred.user.uid);
      if (!existing || !existing.name) {
        await apiCreate(cred.user.uid, {

          name: cred.user.displayName,

          email: cred.user.email,

          mobile: '',

          gender: '',

          dob: '',


          points: 0,

          pendingChallenges: 0,

          completedChallenges: 0,

          redeemedRewards: 0,


          streak: 0,

          rank: "Bronze",

          rewards: [],

          lastActiveDate: null,

        });
      }
    } catch (err) {
      console.error('Google login profile save failed:', err);
    }
    return cred.user;
  }

  async function updateUserProfile(updates) {
    if (!user) throw new Error('Not logged in');
    await apiPatch(user.uid, updates);
    if (updates.name) await updateProfile(user, { displayName: updates.name });
    setProfile((p) => ({ ...p, ...updates }));
  }

  function logout() {
    return signOut(auth);
  }

  async function getRank() {
    return null; // needs a dedicated backend route; skip for now
  }

  async function joinChallenge(challengeId) {
    if (!user) throw new Error('You must be logged in to join a challenge');
    // Optimistic local update for instant UI feedback...
    setProfile((p) => ({
      ...p,
      takenChallengeIds: [...(p?.takenChallengeIds || []), challengeId],
      pendingChallenges: (p?.pendingChallenges || 0) + 1,
    }));
    // ...then let the server do the real, race-safe write, and resync from
    // Firestore so local state can never drift from what's actually stored.
    await apiPost(`/${user.uid}/challenges/${challengeId}/join`);
    const fresh = await apiGet(user.uid);
    setProfile(fresh);
  }

  async function completeChallenge(challengeId, points = 0) {
    if (!user) throw new Error('You must be logged in');
    setProfile((p) => ({
      ...p,
      takenChallengeIds: (p?.takenChallengeIds || []).filter((id) => id !== challengeId),
      completedChallengeIds: [...(p?.completedChallengeIds || []), challengeId],
      pendingChallenges: Math.max((p?.pendingChallenges || 0) - 1, 0),
      completedChallenges: (p?.completedChallenges || 0) + 1,
      points: (p?.points || 0) + points,
    }));
    await apiPost(`/${user.uid}/challenges/${challengeId}/complete`, { points });
    const fresh = await apiGet(user.uid);
    setProfile(fresh);
  }

  async function resetPassword(identifier) {
    await sendPasswordResetEmail(auth, identifier);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setProfile,
        refreshProfile,
        reportSubmitted,
        API_BASE,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateUserProfile,
        getRank,
        resetPassword,
        joinChallenge,
        completeChallenge,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}