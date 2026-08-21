import { Bell, Home, LogOut, MoreHorizontal, Search, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../context/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import UserSearch from './UserSearch';

export default function MobileNav() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.uid);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return <>
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <MobileLink to="/home" label="Início" icon={Home} />
      <button type="button" onClick={() => setIsSearchOpen(true)} className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-500" aria-label="Buscar na rede"><Search className="h-5 w-5" /><span className="text-[10px]">Buscar</span></button>
      <MobileLink to="/notifications" label="Notificações" icon={Bell} unreadCount={unreadCount} />
      <MobileLink to="/profile" label="Perfil" icon={UserRound} />
      <button type="button" onClick={() => setIsMenuOpen(true)} className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-500" aria-label="Abrir menu"><MoreHorizontal className="h-5 w-5" /><span className="text-[10px]">Mais</span></button>
    </nav>
    {isSearchOpen && <div className="fixed inset-0 z-50 bg-slate-900/30 p-4 backdrop-blur-sm"><div className="mt-4 rounded-2xl bg-white p-4 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Buscar na rede</h2><button type="button" onClick={() => setIsSearchOpen(false)} aria-label="Fechar busca" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><UserSearch mobile /></div></div>}
    {isMenuOpen && <div className="fixed inset-0 z-50 flex items-end bg-slate-900/30 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}><div className="w-full rounded-t-2xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="font-bold">Menu</h2><button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><button type="button" onClick={() => signOut(auth)} className="mt-4 flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"><LogOut className="h-5 w-5" />Sair</button></div></div>}
  </>;
}

function MobileLink({ to, label, icon: Icon, unreadCount = 0 }) {
  return <NavLink to={to} className={({ isActive }) => `relative flex h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-500 ${isActive ? 'text-indigo-600' : ''}`}><span className="relative"><Icon className="h-5 w-5" />{unreadCount > 0 && <span className="absolute -right-3 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}</span><span className="text-[10px]">{label}</span></NavLink>;
}