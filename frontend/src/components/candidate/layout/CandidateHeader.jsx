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
            className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden hover:border-[#3B00FF] transition-all cursor-pointer shadow-2xs"
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-slate-600" />
            )}
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
