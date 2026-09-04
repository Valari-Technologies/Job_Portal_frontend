import { useEffect, useRef } from 'react';
import { useCandidateUser } from '../../../context/CandidateUserContext';
import { Bell, CheckCheck, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CandidateNotificationPopover({ isOpen, onClose }) {
  const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useCandidateUser();
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={popoverRef}
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 font-sans select-none animate-fadeIn"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-150">
        <div className="flex items-center gap-2">
          <Bell className="h-4.5 w-4.5 text-[#3B00FF]" />
          <h3 className="text-sm font-black text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#3B00FF] text-white text-[10px] font-extrabold">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-bold text-[#3B00FF] hover:underline cursor-pointer flex items-center gap-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto py-2 space-y-2">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs font-bold text-slate-400">
            No notifications at this time.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.is_read) markNotificationAsRead(item.id);
              }}
              className={`p-3 rounded-xl transition-all border ${
                item.is_read 
                  ? 'bg-white border-slate-100 text-slate-600' 
                  : 'bg-indigo-50/50 border-[#3B00FF]/20 text-slate-900 font-semibold'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  {item.title}
                </h4>
                <span className="text-[10px] font-bold text-slate-400 shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1 leading-snug">
                {item.message}
              </p>

              {item.linkUrl && (
                <Link
                  to={item.linkUrl}
                  onClick={onClose}
                  className="mt-2 text-[11px] font-extrabold text-[#3B00FF] hover:underline inline-flex items-center gap-0.5"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
