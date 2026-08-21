import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return undefined;
    const notificationsQuery = query(collection(db, 'notifications'), where('recipientId', '==', userId));
    return onSnapshot(notificationsQuery, (snapshot) => {
      const items = snapshot.docs.map((notification) => ({ id: notification.id, ...notification.data() }));
      items.sort((first, second) => (second.createdAt?.toMillis?.() || 0) - (first.createdAt?.toMillis?.() || 0));
      setNotifications(items);
      setLoading(false);
    }, () => setLoading(false));
  }, [userId]);

  return { notifications, loading };
}