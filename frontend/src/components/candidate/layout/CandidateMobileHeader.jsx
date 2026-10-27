import { useState } from 'react';
import { useCandidateUser } from '../../../context/CandidateUserContext';
import { Bell } from 'lucide-react';
import CandidateNotificationPopover from '../dashboard/CandidateNotificationPopover';
import CandidateProfileMenu from '../dashboard/CandidateProfileMenu';

export default function CandidateMobileHeader() {
  const { profile, unreadCount } = useCandidateUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const firstName = profile?.firstName || (profile?.fullName ? profile.fullName.split(' ')[0] : 'Candidate');

  return (
    <header className="lg:hidden flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-slate-150 shrink-0 sticky top-0 z-30 font-sans">
      
      {/* Left: Avatar & Greeting */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowProfileMenu(prev => !prev)}
          className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs cursor-pointer"
        >
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-black text-[#3B00FF]">
              {firstName.charAt(0)}
            </span>
          )}
        </button>

        <div className="flex flex-col min-w-0">
          <h2 className="text-base font-black text-slate-900 leading-snug flex items-center gap-1 truncate">
            Hi, {firstName} <span className="text-sm">👋</span>
          </h2>
          <span className="text-xs font-bold text-slate-400">
            {getGreetingTime()}
          </span>
        </div>
      </div>

      {/* Right: Notification Icon */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowNotifications(prev => !prev)}
          aria-label="View notifications"
          className="p-2 text-slate-600 hover:text-[#3B00FF] rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        <CandidateNotificationPopover 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />

        <CandidateProfileMenu 
          isOpen={showProfileMenu} 
          onClose={() => setShowProfileMenu(false)} 
        />
      </div>

    </header>
  );
}
