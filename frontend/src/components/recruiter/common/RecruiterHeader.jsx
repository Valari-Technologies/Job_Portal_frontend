import { useState } from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecruiterUser } from '../../../context/RecruiterUserContext';
import RecruiterNotificationPanel from './RecruiterNotificationPanel';
import RecruiterAccountMenu from './RecruiterAccountMenu';

export default function RecruiterHeader() {
  const { profile, unreadCount } = useRecruiterUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const { fullName } = profile.identity || {};
  const { profilePhotoUrl } = profile.recruiterProfile || {};

  return (
    <header className="hidden lg:flex h-16 items-center justify-between px-6 bg-white border-b border-slate-150 shrink-0 sticky top-0 z-30 font-sans">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <input 
          type="text"
          placeholder="Search candidates, jobs..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            type="button" 
            aria-label="View notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAccountMenu(false);
            }}
            className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-indigo-600 text-white border-2 border-white leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Desktop Notification Panel Popover */}
          {showNotifications && (
            <RecruiterNotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Settings Button */}
        <Link 
          to="/recruiter/settings" 
          aria-label="Go to settings"
          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <Settings className="h-5 w-5" />
        </Link>

        {/* User Profile Avatar / Account Menu Trigger */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            type="button"
            aria-label="User account menu"
            onClick={() => {
              setShowAccountMenu(!showAccountMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 focus:outline-none cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center border border-indigo-200 shadow-xs overflow-hidden group-hover:ring-2 group-hover:ring-indigo-600/30 transition-all">
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt={fullName || "Recruiter"} className="h-full w-full object-cover" />
              ) : (
                <span>{fullName ? fullName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0, 2) : <User className="h-4.5 w-4.5" />}</span>
              )}
            </div>
          </button>

          {/* Desktop Account Menu Dropdown */}
          {showAccountMenu && (
            <RecruiterAccountMenu onClose={() => setShowAccountMenu(false)} />
          )}
        </div>
      </div>
    </header>
  );
}
