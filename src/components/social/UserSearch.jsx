import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/useAuth';
import { useSocialGraph } from '../../hooks/useSocialGraph';
import Avatar from '../Avatar';

function SearchResult({ person }) {
  const { user } = useAuth();
  const { following, blocked, toggleFollow, toggleBlock } = useSocialGraph(user?.uid, person.id);
  if (person.id === user?.uid) return null;

  return <div className="flex items-center gap-3 border-t border-slate-100 px-3 py-3"><Avatar name={person.name} image={person.avatarUrl} /><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{person.name}</strong><span className="block truncate text-xs text-slate-500">@{person.handle}</span></div><button type="button" onClick={toggleFollow} className="rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">{following ? 'Seguindo' : 'Seguir'}</button><button type="button" onClick={toggleBlock} className="text-xs text-slate-400 hover:text-red-600">{blocked ? 'Desbloquear' : 'Bloquear'}</button></div>;
}

export default function UserSearch() {
  const [search, setSearch] = useState('');
  const [people, setPeople] = useState([]);

  useEffect(() => onSnapshot(collection(db, 'users'), (snapshot) => setPeople(snapshot.docs.map((person) => ({ id: person.id, ...person.data() })))), []);
  const results = people.filter((person) => `${person.name || ''} ${person.handle || ''} ${person.email || ''}`.toLowerCase().includes(search.toLowerCase())).slice(0, 5);

  return <div className="relative"><label className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500"><Search className="h-4 w-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar na rede" className="w-36 bg-transparent outline-none placeholder:text-slate-500" /></label>{search && <div className="absolute right-0 top-12 z-30 w-96 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">{results.length ? results.map((person) => <SearchResult key={person.id} person={person} />) : <p className="p-3 text-sm text-slate-500">Nenhuma pessoa encontrada.</p>}</div>}</div>;
}