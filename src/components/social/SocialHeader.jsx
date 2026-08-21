import { Cloud, Menu, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import UserSearch from './UserSearch';

export default function SocialHeader({ onCompose }) {
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"><NavLink to="/home" className="flex items-center gap-2 text-indigo-600"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white"><Cloud className="h-5 w-5" /></span><span className="text-xl font-bold tracking-tight">WhiteClouds</span></NavLink><div className="hidden items-center gap-3 md:flex"><UserSearch /><button type="button" onClick={onCompose} className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"><Plus className="h-4 w-4" />Postar</button></div><button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" onClick={onCompose} aria-label="Criar post"><Menu className="h-5 w-5" /></button></div></header>;
}