import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  Bell,
  Cloud,
  Heart,
  Home as HomeIcon,
  ImagePlus,
  LogOut,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return 'agora';
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp.toDate()) / 60000));
  if (minutes < 60) return `${minutes}min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
};

const getInitials = (name) => name?.trim()?.slice(0, 2).toUpperCase() || 'WC';

export default function Home() {
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [activeView, setActiveView] = useState('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', handle: '', bio: '', avatarUrl: '' });

  useEffect(() => {
    if (!currentUser?.uid) return undefined;
    const loadProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      const profile = {
        name: data.name || currentUser.displayName || 'Usuário WhiteClouds',
        handle: data.handle || currentUser.email?.split('@')[0] || 'whitecloud',
        bio: data.bio || 'Explorando novas ideias nas nuvens.',
        avatarUrl: data.avatarUrl || '',
        ...data,
      };
      setUserData(profile);
      setProfileForm({ name: profile.name, handle: profile.handle, bio: profile.bio, avatarUrl: profile.avatarUrl });
    };
    loadProfile().catch(() => undefined);
    return undefined;
  }, [currentUser]);

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map((postDoc) => ({ id: postDoc.id, ...postDoc.data() })));
    }, () => setPosts([]));
  }, []);

  const profile = userData || { name: 'Carregando perfil', handle: 'whitecloud', bio: '' };
  const visiblePosts = activeView === 'profile' ? posts.filter((post) => post.authorId === currentUser?.uid) : posts;

  const handlePublish = async () => {
    const content = postText.trim();
    if (!content || !currentUser?.uid || isPublishing) return;
    setIsPublishing(true);
    try {
      await addDoc(collection(db, 'posts'), {
        content, authorId: currentUser.uid, authorName: profile.name, authorHandle: profile.handle,
        authorAvatar: profile.avatarUrl || '', likedBy: [], createdAt: serverTimestamp(),
      });
      setPostText('');
      setIsComposerOpen(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleLike = async (post) => {
    if (!currentUser?.uid) return;
    const likedBy = post.likedBy || [];
    const nextLikedBy = likedBy.includes(currentUser.uid) ? likedBy.filter((uid) => uid !== currentUser.uid) : [...likedBy, currentUser.uid];
    await updateDoc(doc(db, 'posts', post.id), { likedBy: nextLikedBy });
  };

  const handleDeletePost = async (postId) => {
    await deleteDoc(doc(db, 'posts', postId));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!currentUser?.uid || isSavingProfile) return;
    setIsSavingProfile(true);
    const nextProfile = {
      name: profileForm.name.trim() || 'Usuário WhiteClouds',
      handle: profileForm.handle.trim().replace(/\s+/g, '').replace(/^@/, '') || 'whitecloud',
      bio: profileForm.bio.trim(), avatarUrl: profileForm.avatarUrl.trim(),
    };
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), nextProfile);
      setUserData((current) => ({ ...current, ...nextProfile }));
      setIsProfileOpen(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Início', icon: HomeIcon },
    { id: 'profile', label: 'Perfil', icon: UserRound },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button type="button" className="flex items-center gap-2 text-indigo-600" onClick={() => setActiveView('home')}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white"><Cloud className="h-5 w-5" /></span>
            <span className="text-xl font-bold tracking-tight">WhiteClouds</span>
          </button>
          <div className="hidden items-center gap-3 md:flex"><div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500"><Search className="h-4 w-4" /><span>Buscar na rede</span></div><button type="button" onClick={() => setIsComposerOpen(true)} className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"><Plus className="h-4 w-4" /> Postar</button></div>
          <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" onClick={() => setIsComposerOpen(true)} aria-label="Criar post"><Menu className="h-5 w-5" /></button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="hidden border-r border-slate-200 px-4 py-8 md:block"><nav className="space-y-2">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveView(id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${activeView === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}><Icon className="h-5 w-5" /> {label}</button>)}</nav><div className="mt-10 border-t border-slate-200 pt-6"><button type="button" onClick={() => setIsProfileOpen(true)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-100"><Avatar name={profile.name} image={profile.avatarUrl} /><span className="min-w-0"><strong className="block truncate text-sm">{profile.name}</strong><span className="block truncate text-xs text-slate-500">@{profile.handle}</span></span><MoreHorizontal className="ml-auto h-4 w-4 text-slate-400" /></button><button type="button" onClick={() => signOut(auth)} className="mt-5 flex items-center gap-3 px-3 text-sm text-slate-500 hover:text-red-600"><LogOut className="h-4 w-4" /> Sair</button></div></aside>

        <main className="min-w-0 border-r border-slate-200"><div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{activeView === 'profile' ? 'Seu espaço' : 'Linha do tempo'}</p><h1 className="mt-1 text-2xl font-bold">{activeView === 'profile' ? 'Perfil' : 'Para você'}</h1></div><button type="button" onClick={() => setIsComposerOpen(true)} className="rounded-full p-2 text-indigo-600 hover:bg-indigo-50 md:hidden" aria-label="Criar post"><Pencil className="h-5 w-5" /></button></div></div>
          {activeView === 'profile' && <ProfileHeader profile={profile} postCount={posts.filter((post) => post.authorId === currentUser?.uid).length} onEdit={() => setIsProfileOpen(true)} />}
          {activeView === 'notifications' && <div className="m-5 rounded-2xl border border-slate-200 bg-white p-8 text-center"><Bell className="mx-auto h-9 w-9 text-indigo-500" /><h2 className="mt-3 font-semibold">Tudo tranquilo por aqui</h2><p className="mt-1 text-sm text-slate-500">Suas novas interações aparecerão nesta área.</p></div>}
          {activeView !== 'notifications' && <><button type="button" onClick={() => setIsComposerOpen(true)} className="flex w-full gap-3 border-b border-slate-200 bg-white p-5 text-left hover:bg-slate-50 sm:p-6"><Avatar name={profile.name} image={profile.avatarUrl} /><span className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">O que está nas suas nuvens?</span><Send className="mt-3 h-4 w-4 text-indigo-500" /></button><div>{visiblePosts.length === 0 ? <EmptyTimeline onCreate={() => setIsComposerOpen(true)} /> : visiblePosts.map((post) => <PostCard key={post.id} post={post} currentUserId={currentUser?.uid} onLike={handleToggleLike} onDelete={handleDeletePost} />)}</div></>}
        </main>

        <aside className="hidden px-6 py-8 lg:block"><section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Seu perfil</h2><div className="mt-5 flex items-center gap-3"><Avatar name={profile.name} image={profile.avatarUrl} size="large" /><div className="min-w-0"><strong className="block truncate">{profile.name}</strong><span className="text-sm text-slate-500">@{profile.handle}</span></div></div><p className="mt-4 text-sm leading-6 text-slate-600">{profile.bio}</p><button type="button" onClick={() => setIsProfileOpen(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Settings className="h-4 w-4" /> Editar perfil</button></section><section className="mt-5 rounded-2xl bg-indigo-600 p-5 text-white"><p className="text-sm font-semibold">WhiteClouds para você</p><p className="mt-2 text-sm leading-6 text-indigo-100">Compartilhe ideias, acompanhe pessoas e deixe sua marca nas nuvens.</p></section></aside>
      </div>
      {isComposerOpen && <Composer value={postText} setValue={setPostText} isPublishing={isPublishing} onClose={() => setIsComposerOpen(false)} onPublish={handlePublish} profile={profile} />}
      {isProfileOpen && <ProfileEditor form={profileForm} setForm={setProfileForm} isSaving={isSavingProfile} onClose={() => setIsProfileOpen(false)} onSave={handleSaveProfile} />}
    </div>
  );
}

function Avatar({ name, image, size = 'default' }) { return image ? <img src={image} alt={name} className={`${size === 'large' ? 'h-14 w-14' : 'h-10 w-10'} rounded-full object-cover ring-2 ring-white`} /> : <div className={`${size === 'large' ? 'h-14 w-14 text-base' : 'h-10 w-10 text-xs'} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 ring-2 ring-white`}>{getInitials(name)}</div>; }
function ProfileHeader({ profile, postCount, onEdit }) { return <div className="bg-white px-5 pb-6 pt-6 sm:px-8"><div className="flex items-start justify-between"><Avatar name={profile.name} image={profile.avatarUrl} size="large" /><button type="button" onClick={onEdit} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Pencil className="h-4 w-4" /> Editar</button></div><h2 className="mt-4 text-xl font-bold">{profile.name}</h2><p className="text-sm text-slate-500">@{profile.handle}</p><p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">{profile.bio}</p><div className="mt-5 flex gap-6 text-sm"><span><strong>{postCount}</strong> <span className="text-slate-500">posts</span></span><span><strong>0</strong> <span className="text-slate-500">seguidores</span></span><span><strong>0</strong> <span className="text-slate-500">seguindo</span></span></div></div>; }
function PostCard({ post, currentUserId, onLike, onDelete }) { const liked = post.likedBy?.includes(currentUserId); return <article className="border-b border-slate-200 bg-white p-5 transition hover:bg-slate-50 sm:p-6"><div className="flex gap-3"><Avatar name={post.authorName} image={post.authorAvatar} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-sm"><strong className="truncate">{post.authorName || 'Usuário WhiteClouds'}</strong><span className="truncate text-slate-500">@{post.authorHandle || 'whitecloud'}</span><span className="text-slate-400">· {formatDate(post.createdAt)}</span>{post.authorId === currentUserId && <button type="button" onClick={() => onDelete(post.id)} className="ml-auto rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Excluir post"><Trash2 className="h-4 w-4" /></button>}</div><p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{post.content}</p><div className="mt-4 flex items-center gap-8 text-slate-400"><button type="button" onClick={() => onLike(post)} className={`flex items-center gap-2 text-sm transition ${liked ? 'text-rose-500' : 'hover:text-rose-500'}`}><Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />{post.likedBy?.length || 0}</button><button type="button" className="text-slate-400 hover:text-indigo-600" aria-label="Mais opções"><MoreHorizontal className="h-4 w-4" /></button></div></div></div></article>; }
function EmptyTimeline({ onCreate }) { return <div className="m-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Cloud className="mx-auto h-10 w-10 text-indigo-300" /><h2 className="mt-4 font-semibold">Sua timeline está começando</h2><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">Seja a primeira pessoa a compartilhar algo com a comunidade.</p><button type="button" onClick={onCreate} className="mt-5 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Criar primeiro post</button></div>; }
function Composer({ value, setValue, isPublishing, onClose, onPublish, profile }) { return <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/30 p-0 backdrop-blur-sm sm:items-center sm:p-4"><div className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"><div className="flex items-center justify-between border-b border-slate-100 pb-4"><h2 className="font-bold">Novo post</h2><button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Fechar"><X className="h-5 w-5" /></button></div><div className="flex gap-3 py-5"><Avatar name={profile.name} image={profile.avatarUrl} /><textarea autoFocus value={value} onChange={(event) => setValue(event.target.value.slice(0, 300))} placeholder="O que está nas suas nuvens?" className="min-h-32 flex-1 resize-none border-0 text-[15px] outline-none placeholder:text-slate-400" /></div><div className="flex items-center justify-between border-t border-slate-100 pt-4"><div className="flex items-center gap-3 text-indigo-500"><ImagePlus className="h-5 w-5" /><span className="text-xs text-slate-400">{value.length}/300</span></div><button type="button" disabled={!value.trim() || isPublishing} onClick={onPublish} className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"><RefreshCw className={`h-4 w-4 ${isPublishing ? 'animate-spin' : ''}`} />{isPublishing ? 'Publicando...' : 'Publicar'}</button></div></div></div>; }
function ProfileEditor({ form, setForm, isSaving, onClose, onSave }) { const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value })); return <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"><form onSubmit={onSave} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Editar perfil</h2><button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Fechar"><X className="h-5 w-5" /></button></div><div className="mt-6 space-y-4"><label className="block text-sm font-semibold text-slate-700">Nome<input value={form.name} onChange={updateField('name')} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-500" required /></label><label className="block text-sm font-semibold text-slate-700">Nome de usuário<input value={form.handle} onChange={updateField('handle')} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-500" placeholder="whitecloud" /></label><label className="block text-sm font-semibold text-slate-700">Bio<textarea value={form.bio} onChange={updateField('bio')} maxLength={160} className="mt-2 min-h-24 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-500" placeholder="Conte algo sobre você" /></label><label className="block text-sm font-semibold text-slate-700">URL do avatar<input value={form.avatarUrl} onChange={updateField('avatarUrl')} type="url" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-500" placeholder="https://..." /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancelar</button><button type="submit" disabled={isSaving} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300">{isSaving ? 'Salvando...' : 'Salvar perfil'}</button></div></form></div>; }