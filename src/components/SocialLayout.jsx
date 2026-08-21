import ProfileSummary from './social/ProfileSummary';
import SocialHeader from './social/SocialHeader';
import SocialSidebar from './social/SocialSidebar';
import MobileNav from './social/MobileNav';

export default function SocialLayout({ children, profile, onCompose, onEditProfile }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-16 text-slate-900 md:pb-0">
      <SocialHeader onCompose={onCompose} />
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)_280px]">
        <SocialSidebar profile={profile} onEditProfile={onEditProfile} />
        <main className="min-w-0 border-r border-slate-200">{children}</main>
        <ProfileSummary profile={profile} onEditProfile={onEditProfile} />
      </div>
      <MobileNav />
    </div>
  );
}