import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../utils/firebase';

export function useCommunityMessages(communityId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) return;
    setLoading(true);
    const q = query(
      collection(db, 'communityMessages'),
      where('communityId', '==', communityId),
      orderBy('timestamp', 'asc'),
      limit(200)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Chat listener error:', err);
        setLoading(false);
      }
    );
    return unsub;
  }, [communityId]);

  const sendMessage = useCallback(
    async ({ communityId, senderId, username, avatar = '', message = '', image = '' }) => {
      if (!message.trim() && !image) return;
      await addDoc(collection(db, 'communityMessages'), {
        communityId,
        senderId,
        username,
        avatar,
        message: message.trim(),
        image,
        timestamp: serverTimestamp(),
      });
    },
    []
  );

  return { messages, loading, sendMessage };
}
