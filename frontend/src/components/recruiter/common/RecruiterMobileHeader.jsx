import { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { useRecruiterUser } from '../../../context/RecruiterUserContext';
import RecruiterNotificationPanel from './RecruiterNotificationPanel';
import RecruiterAccountMenu from './RecruiterAccountMenu';

export default function RecruiterMobileHeader() {
  const { profile, unreadCount } = useRecruiterUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const { fullName } = profile.identity || {};
  const { profilePhotoUrl } = profile.recruiterProfile || {};

  return (
    <header className="lg:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-slate-150 shrink-0 sticky top-0 z-30 font-sans">
      {/* Left: Avatar & Brand Title */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="User account menu"
          onClick={() => {
            setShowAccountMenu(!showAccountMenu);
            setShowNotifications(false);
          }}
          className="h-8 w-8 rounded-full bg-white text-slate-900 font-black text-xs flex items-center justify-center border border-black shadow-xs overflow-hidden cursor-pointer focus:outline-none"
        >
          {profilePhotoUrl ? (
            <img src={profilePhotoUrl} alt={fullName || "Recruiter"} className="h-full w-full object-contain p-0.5 rounded-full" />
          ) : (
            <span>{fullName ? fullName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0, 2) : <User className="h-4.5 w-4.5 text-slate-900" />}</span>
          )}
        </button>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black text-slate-900 tracking-tight truncate leading-tight">
            {fullName || profile?.companySummary?.name || "Abu"}
          </span>
          <span className="text-[10px] font-bold text-indigo-600 tracking-wide">
            Recruiter
          </span>
        </div>
      </div>

      {/* Right: Notification Bell */}
      <div className="relative">
        <button 
          type="button" 
          aria-label="View notifications"
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowAccountMenu(false);
          }}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
          )}
        </button>

        {/* Mobile Notification Sheet/Panel */}
        {showNotifications && (
          <RecruiterNotificationPanel isMobile onClose={() => setShowNotifications(false)} />
        )}

        {/* Mobile Account Menu */}
        {showAccountMenu && (
          <RecruiterAccountMenu isMobile onClose={() => setShowAccountMenu(false)} />
        )}
      </div>
    </header>
  );
}
