import { useEffect, useState } from 'react';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useSocialGraph(userId, targetId) {
  const [relationship, setRelationship] = useState({ following: false, blocked: false });

  useEffect(() => {
    if (!userId || !targetId || userId === targetId) return undefined;
    getDoc(doc(db, 'users', userId)).then((snapshot) => {
      const data = snapshot.exists() ? snapshot.data() : {};
      setRelationship({ following: (data.following || []).includes(targetId), blocked: (data.blockedUsers || []).includes(targetId) });
    }).catch(() => undefined);
    return undefined;
  }, [userId, targetId]);

  const toggleFollow = async () => {
    const field = relationship.following ? arrayRemove(targetId) : arrayUnion(targetId);
    await updateDoc(doc(db, 'users', userId), { following: field });
    setRelationship((current) => ({ ...current, following: !current.following }));
  };

  const toggleBlock = async () => {
    const field = relationship.blocked ? arrayRemove(targetId) : arrayUnion(targetId);
    await updateDoc(doc(db, 'users', userId), { blockedUsers: field });
    setRelationship((current) => ({ ...current, blocked: !current.blocked }));
  };

  return { ...relationship, toggleFollow, toggleBlock };
}