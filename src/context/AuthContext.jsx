// src/context/AuthContext.jsx
import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

