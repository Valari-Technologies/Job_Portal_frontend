import { useState } from 'react';
import { useCandidateUser } from '../../../context/CandidateUserContext';
import { Bell, User } from 'lucide-react';
import CandidateNotificationPopover from '../dashboard/CandidateNotificationPopover';
import CandidateProfileMenu from '../dashboard/CandidateProfileMenu';

export default function CandidateHeader() {
  const { profile, unreadCount } = useCandidateUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="hidden lg:flex h-16 w-full items-center justify-end px-8 bg-white border-b border-slate-200 sticky top-0 z-20 font-sans">
      <div className="flex items-center gap-4 relative">
        
        {/* Notification Bell Action */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(prev => !prev);
              if (showProfileMenu) setShowProfileMenu(false);
            }}
            aria-label="View notifications"
            className="p-2 text-slate-500 hover:text-[#3B00FF] rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer relative"
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
        </div>

        {/* Profile Avatar / Menu Action */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(prev => !prev);
              if (showNotifications) setShowNotifications(false);
            }}
            aria-label="Open profile menu"
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs"
          >
            <div className="h-8 w-8 rounded-full bg-white border border-black flex items-center justify-center overflow-hidden shrink-0">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile?.fullName || 'Candidate'} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-black text-slate-900">
                  {profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : (profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'C')}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
              {profile?.firstName || (profile?.fullName ? profile.fullName.split(' ')[0] : 'Candidate')}
            </span>
          </button>

          <CandidateProfileMenu 
            isOpen={showProfileMenu} 
            onClose={() => setShowProfileMenu(false)} 
          />
        </div>

      </div>
    </header>
  );
}
