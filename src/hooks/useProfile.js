import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const defaultProfile = (user) => ({
  name: user?.displayName || 'Usuário WhiteClouds',
  handle: user?.email?.split('@')[0] || 'whitecloud',
  bio: 'Explorando novas ideias nas nuvens.',
  avatarUrl: '',
  coverUrl: '',
  blockedUsers: [],
});

export function useProfile(user) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const loadProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      setProfile({ ...defaultProfile(user), ...data });
      setLoading(false);
    };
    loadProfile().catch(() => setLoading(false));
    return undefined;
  }, [user]);

  const saveProfile = async (nextProfile) => {
    await setDoc(doc(db, 'users', user.uid), nextProfile, { merge: true });
    setProfile((current) => ({ ...current, ...nextProfile }));
  };

  return { profile: profile || defaultProfile(user), loading, saveProfile };
}