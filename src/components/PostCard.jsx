import { Heart, MoreHorizontal, Trash2 } from 'lucide-react';
import Avatar from './Avatar';

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return 'agora';
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp.toDate()) / 60000));
  if (minutes < 60) return `${minutes}min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
};

export default function PostCard({ post, currentUserId, onLike, onDelete }) {
  const liked = post.likedBy?.includes(currentUserId);
  return <article className="border-b border-slate-200 bg-white p-5 transition hover:bg-slate-50 sm:p-6"><div className="flex gap-3"><Avatar name={post.authorName} image={post.authorAvatar} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-sm"><strong className="truncate">{post.authorName || 'Usuário WhiteClouds'}</strong><span className="truncate text-slate-500">@{post.authorHandle || 'whitecloud'}</span><span className="text-slate-400">· {formatDate(post.createdAt)}</span>{post.authorId === currentUserId && <button type="button" onClick={() => onDelete(post.id)} className="ml-auto rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Excluir post"><Trash2 className="h-4 w-4" /></button>}</div><p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{post.content}</p><div className="mt-4 flex items-center gap-8 text-slate-400"><button type="button" onClick={() => onLike(post)} className={`flex items-center gap-2 text-sm transition ${liked ? 'text-rose-500' : 'hover:text-rose-500'}`}><Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />{post.likedBy?.length || 0}</button><button type="button" className="text-slate-400 hover:text-indigo-600" aria-label="Mais opções"><MoreHorizontal className="h-4 w-4" /></button></div></div></div></article>;
}