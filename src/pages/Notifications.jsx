import { Bell, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useNotifications } from '../hooks/useNotifications';
import SocialLayout from '../components/SocialLayout';

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile } = useProfile(user);
  const { notifications, loading, markAllAsRead } = useNotifications(user?.uid);

  useEffect(() => {
    if (!loading) markAllAsRead().catch(() => undefined);
  }, [loading, markAllAsRead]);
  return <SocialLayout profile={profile} onCompose={() => navigate('/home')} onEditProfile={() => navigate('/profile')}><div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8"><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Atividade</p><h1 className="mt-1 text-2xl font-bold">Notificações</h1></div>{loading ? <div className="m-5 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Carregando notificações...</div> : notifications.length === 0 ? <div className="m-5 rounded-2xl border border-slate-200 bg-white p-8 text-center"><Bell className="mx-auto h-9 w-9 text-indigo-500" /><h2 className="mt-3 font-semibold">Tudo tranquilo por aqui</h2><p className="mt-1 text-sm text-slate-500">Suas novas interações aparecerão nesta área.</p></div> : <div className="bg-white">{notifications.map((notification) => <div key={notification.id} className="flex gap-3 border-b border-slate-100 p-5"><Heart className="mt-1 h-5 w-5 text-rose-500" /><div><p className="text-sm text-slate-700"><strong>{notification.actorName || 'Alguém'}</strong> curtiu sua publicação.</p><p className="mt-1 text-xs text-slate-500">{notification.postPreview}</p></div></div>)}</div>}</SocialLayout>;
}