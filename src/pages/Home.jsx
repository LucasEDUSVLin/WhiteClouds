import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { LogOut, User } from 'lucide-react';

export default function Home() {
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Se o usuário ainda não carregou do AuthContext, não faz nada
    if (!currentUser?.uid) return;

    const loadData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (err) {
        console.log('Erro ao carregar Firestore:', err);
      }
    };

    loadData();
  }, [currentUser]);

  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600 tracking-wider">WhiteClouds</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-sm rounded-lg border border-slate-200 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                Olá, {userData?.name || 'Seja bem-vindo'}!
              </h2>
              <p className="text-slate-600 text-sm">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
