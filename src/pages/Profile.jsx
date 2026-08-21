import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { usePosts } from '../hooks/usePosts';
import { useProfile } from '../hooks/useProfile';
import Avatar from '../components/Avatar';
import Composer from '../components/Composer';
import ProfileEditor from '../components/ProfileEditor';
import PostCard from '../components/PostCard';
import SocialLayout from '../components/SocialLayout';

export default function Profile() {
  const { user } = useAuth();
  const { profile, saveProfile, uploadProfileImage } = useProfile(user);
  const { posts, createPost, toggleLike, removePost } = usePosts(user?.uid, profile.blockedUsers);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState(profile);
  const ownPosts = posts.filter((post) => post.authorId === user?.uid);

  const openEditor = () => {
    setForm(profile);
    setIsEditorOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await saveProfile({ ...form, name: form.name.trim(), handle: form.handle.trim().replace(/\s+/g, '').replace(/^@/, ''), bio: form.bio.trim(), avatarUrl: form.avatarUrl.trim() });
      setIsEditorOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleUpload = async (file, type) => {
    if (file.size > 5 * 1024 * 1024) return;
    setIsUploading(true);
    try {
      await uploadProfileImage(file, type);
    } finally {
      setIsUploading(false);
    }
  };

  return <SocialLayout profile={profile} onCompose={() => setIsComposerOpen(true)} onEditProfile={openEditor}><div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8"><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Seu espaço</p><h1 className="mt-1 text-2xl font-bold">Perfil</h1></div><section className="bg-white px-5 pb-6 pt-6 sm:px-8"><div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-100 via-sky-100 to-slate-100">{profile.coverUrl && <img src={profile.coverUrl} alt="Capa do perfil" className="h-full w-full object-cover" />}<div className="absolute -bottom-1 left-4"><Avatar name={profile.name} image={profile.avatarUrl} size="large" /></div></div><div className="flex items-start justify-end pt-3"><button type="button" onClick={openEditor} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Pencil className="h-4 w-4" /> Editar</button></div><h2 className="mt-2 text-xl font-bold">{profile.name}</h2><p className="text-sm text-slate-500">@{profile.handle}</p><p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">{profile.bio}</p><div className="mt-5 flex gap-6 text-sm"><span><strong>{ownPosts.length}</strong> <span className="text-slate-500">posts</span></span><span><strong>0</strong> <span className="text-slate-500">seguidores</span></span><span><strong>0</strong> <span className="text-slate-500">seguindo</span></span></div></section><div>{ownPosts.map((post) => <PostCard key={post.id} post={post} currentUserId={user?.uid} onLike={toggleLike} onDelete={removePost} />)}</div>{isEditorOpen && <ProfileEditor form={form} setForm={setForm} isSaving={isSaving} isUploading={isUploading} onUpload={handleUpload} onClose={() => setIsEditorOpen(false)} onSave={handleSave} />}{isComposerOpen && <Composer value={postText} setValue={setPostText} isPublishing={isPublishing} onClose={() => setIsComposerOpen(false)} onPublish={handlePublish} profile={profile} />}</SocialLayout>;
}