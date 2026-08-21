import { Bell, Home as HomeIcon, LogOut, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Avatar from '../Avatar';
import { useAuth } from '../../context/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

const navItems = [{ to: '/home', label: 'Início', icon: HomeIcon }, { to: '/profile', label: 'Perfil', icon: UserRound }, { to: '/notifications', label: 'Notificações', icon: Bell }];

export default function SocialSidebar({ profile, onEditProfile }) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.uid);
  return <aside className="hidden border-r border-slate-200 px-4 py-8 md:block"><nav className="space-y-2">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}><span className="relative"><Icon className="h-5 w-5" />{to === '/notifications' && unreadCount > 0 && <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 animate-pulse items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}</span>{label}</NavLink>)}</nav><div className="mt-10 border-t border-slate-200 pt-6"><button type="button" onClick={onEditProfile} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-100"><Avatar name={profile.name} image={profile.avatarUrl} /><span className="min-w-0"><strong className="block truncate text-sm">{profile.name}</strong><span className="block truncate text-xs text-slate-500">@{profile.handle}</span></span></button><button type="button" onClick={() => signOut(auth)} className="mt-5 flex items-center gap-3 px-3 text-sm text-slate-500 hover:text-red-600"><LogOut className="h-4 w-4" />Sair</button></div></aside>;
}