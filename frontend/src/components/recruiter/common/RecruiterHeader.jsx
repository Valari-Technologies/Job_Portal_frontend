import { useState, useEffect } from 'react';
import { Search, Bell, Settings, User, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecruiterUser } from '../../../context/RecruiterUserContext';
import RecruiterNotificationPanel from './RecruiterNotificationPanel';
import RecruiterAccountMenu from './RecruiterAccountMenu';
import { checkRecruiterPlanStatus } from '../../../services/recruiter/recruiterCommerceService';

export default function RecruiterHeader() {
  const { profile, unreadCount } = useRecruiterUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [planStatus, setPlanStatus] = useState(() => checkRecruiterPlanStatus());

  useEffect(() => {
    const handleCommerceUpdate = () => {
      setPlanStatus(checkRecruiterPlanStatus());
    };
    window.addEventListener('recruiter_commerce_updated', handleCommerceUpdate);
    return () => window.removeEventListener('recruiter_commerce_updated', handleCommerceUpdate);
  }, []);

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
      <div className="flex items-center gap-3.5 relative">
        {/* Live Plan & Credits Widget */}
        <Link
          to="/recruiter/payments"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-xs group shadow-2xs"
          title="Click to view Plan & Credits in Payments"
        >
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className={`flex h-2 w-2 rounded-full ${planStatus.isExpired ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-black text-indigo-600">{planStatus.availableCredits}</span>
            <span className="text-slate-500 font-semibold hidden xl:inline">Credits</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] font-bold text-slate-600 group-hover:text-indigo-600 truncate max-w-[130px]">
            {planStatus.planName}
          </span>
        </Link>

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
            <div className="h-9 w-9 rounded-full bg-white text-slate-900 font-black text-xs flex items-center justify-center border border-black shadow-xs overflow-hidden group-hover:ring-2 group-hover:ring-black/20 transition-all">
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt={fullName || "Recruiter"} className="h-full w-full object-contain p-0.5 rounded-full" />
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
