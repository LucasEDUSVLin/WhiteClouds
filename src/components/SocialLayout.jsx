import { Bell, Cloud, Home as HomeIcon, LogOut, Menu, Plus, Search, Settings, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useAuth } from '../context/useAuth';
import { useSocialGraph } from '../hooks/useSocialGraph';
import Avatar from './Avatar';

const navItems = [{ to: '/home', label: 'Início', icon: HomeIcon }, { to: '/profile', label: 'Perfil', icon: UserRound }, { to: '/notifications', label: 'Notificações', icon: Bell }];

export default function SocialLayout({ children, profile, onCompose, onEditProfile }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [people, setPeople] = useState([]);
  useEffect(() => onSnapshot(collection(db, 'users'), (snapshot) => setPeople(snapshot.docs.map((person) => ({ id: person.id, ...person.data() })))), []);
  const results = people.filter((person) => `${person.name || ''} ${person.handle || ''} ${person.email || ''}`.toLowerCase().includes(search.toLowerCase())).slice(0, 5);

  function SearchResult({ person }) {
    const { following, blocked, toggleFollow, toggleBlock } = useSocialGraph(user?.uid, person.id);
    if (person.id === user?.uid) return null;
    return (
      <div className="flex items-center gap-3 border-t border-slate-100 px-3 py-3">
        <Avatar name={person.name} image={person.avatarUrl} />
        <div className="min-w-0 flex-1">
          <strong className="block truncate text-sm">{person.name}</strong>
          <span className="block truncate text-xs text-slate-500">@{person.handle}</span>
        </div>
        <button type="button" onClick={toggleFollow} className="rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">
          {following ? 'Seguindo' : 'Seguir'}
        </button>
        <button type="button" onClick={toggleBlock} className="text-xs text-slate-400 hover:text-red-600">
          {blocked ? 'Desbloquear' : 'Bloquear'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <NavLink to="/home" className="flex items-center gap-2 text-indigo-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white">
              <Cloud className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">WhiteClouds</span>
          </NavLink>
          <div className="relative hidden items-center gap-3 md:flex">
            <label className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar na rede" className="w-36 bg-transparent outline-none placeholder:text-slate-500" />
            </label>
            {search && (
              <div className="absolute right-28 top-12 w-96 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {results.length ? results.map((person) => <SearchResult key={person.id} person={person} />) : <p className="p-3 text-sm text-slate-500">Nenhuma pessoa encontrada.</p>}
              </div>
            )}
            <button type="button" onClick={onCompose} className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
              <Plus className="h-4 w-4" />Postar
            </button>
          </div>
          <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" onClick={onCompose} aria-label="Criar post">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="hidden border-r border-slate-200 px-4 py-8 md:block">
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 border-t border-slate-200 pt-6">
            <button type="button" onClick={onEditProfile} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-100">
              <Avatar name={profile.name} image={profile.avatarUrl} />
              <span className="min-w-0">
                <strong className="block truncate text-sm">{profile.name}</strong>
                <span className="block truncate text-xs text-slate-500">@{profile.handle}</span>
              </span>
            </button>
            <button type="button" onClick={() => signOut(auth)} className="mt-5 flex items-center gap-3 px-3 text-sm text-slate-500 hover:text-red-600">
              <LogOut className="h-4 w-4" />Sair
            </button>
          </div>
        </aside>
        <main className="min-w-0 border-r border-slate-200">{children}</main>
        <aside className="hidden px-6 py-8 lg:block">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold">Seu perfil</h2>
            <div className="mt-5 flex items-center gap-3">
              <Avatar name={profile.name} image={profile.avatarUrl} size="large" />
              <div className="min-w-0">
                <strong className="block truncate">{profile.name}</strong>
                <span className="text-sm text-slate-500">@{profile.handle}</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{profile.bio}</p>
            <button type="button" onClick={onEditProfile} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Settings className="h-4 w-4" />Editar perfil
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}