import { Cloud, Pencil } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import UserSearch from './UserSearch';

export default function SocialHeader({ onCompose }) {
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"><NavLink to="/home" className="flex items-center gap-2 text-indigo-600"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white"><Cloud className="h-5 w-5" /></span><span className="text-xl font-bold tracking-tight">WhiteClouds</span></NavLink><div className="flex items-center gap-3"><div className="hidden md:block"><UserSearch /></div><button type="button" onClick={onCompose} title="Criar post" aria-label="Criar post" className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700"><Pencil className="h-4 w-4" /></button></div></div></header>;
}