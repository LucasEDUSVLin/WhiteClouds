import { Settings } from 'lucide-react';
import Avatar from '../Avatar';

export default function ProfileSummary({ profile, onEditProfile }) {
  return <aside className="hidden px-6 py-8 lg:block"><section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Seu perfil</h2><div className="mt-5 flex items-center gap-3"><Avatar name={profile.name} image={profile.avatarUrl} size="large" /><div className="min-w-0"><strong className="block truncate">{profile.name}</strong><span className="text-sm text-slate-500">@{profile.handle}</span></div></div><p className="mt-4 text-sm leading-6 text-slate-600">{profile.bio}</p><button type="button" onClick={onEditProfile} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Settings className="h-4 w-4" />Editar perfil</button></section></aside>;
}