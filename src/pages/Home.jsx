import { useState } from 'react';
import { Pencil, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { usePosts } from '../hooks/usePosts';
import { useProfile } from '../hooks/useProfile';
import Composer from '../components/Composer';
import PostCard from '../components/PostCard';
import SocialLayout from '../components/SocialLayout';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile } = useProfile(user);
  const { posts, createPost, toggleLike, removePost } = usePosts(user?.uid);
  const [postText, setPostText] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!postText.trim() || isPublishing) return;
    setIsPublishing(true);
    try {
      await createPost(postText.trim(), profile);
      setPostText('');
      setIsComposerOpen(false);
    } finally {
      setIsPublishing(false);
    }
  };

  return <SocialLayout profile={profile} onCompose={() => setIsComposerOpen(true)} onEditProfile={() => navigate('/profile')}><div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8"><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Linha do tempo</p><h1 className="mt-1 text-2xl font-bold">Para você</h1></div><button type="button" onClick={() => setIsComposerOpen(true)} className="flex w-full gap-3 border-b border-slate-200 bg-white p-5 text-left hover:bg-slate-50 sm:p-6"><span className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400">O que está nas suas nuvens?</span><Send className="mt-3 h-4 w-4 text-indigo-500" /></button><div>{posts.length === 0 ? <div className="m-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Pencil className="mx-auto h-10 w-10 text-indigo-300" /><h2 className="mt-4 font-semibold">Sua timeline está começando</h2><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">Seja a primeira pessoa a compartilhar algo com a comunidade.</p><button type="button" onClick={() => setIsComposerOpen(true)} className="mt-5 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Criar primeiro post</button></div> : posts.map((post) => <PostCard key={post.id} post={post} currentUserId={user?.uid} onLike={toggleLike} onDelete={removePost} />)}</div>{isComposerOpen && <Composer value={postText} setValue={setPostText} isPublishing={isPublishing} onClose={() => setIsComposerOpen(false)} onPublish={handlePublish} profile={profile} />}</SocialLayout>;
}