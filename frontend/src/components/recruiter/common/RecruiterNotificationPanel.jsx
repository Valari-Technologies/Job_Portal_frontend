import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, FileText, Calendar, CreditCard, Briefcase, Building2, ChevronRight, X, Sparkles } from 'lucide-react';
import { useRecruiterUser } from '../../../context/RecruiterUserContext';

export default function RecruiterNotificationPanel({ onClose, isMobile = false }) {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useRecruiterUser();
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const panelRef = useRef(null);

  // Close panel on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const filteredNotifications = notifications.filter(item => {
    if (filter === 'unread') return !item.is_read;
    return true;
  });

  const getCategoryIcon = (refType) => {
    switch (refType) {
      case 'application': return <FileText className="h-4 w-4 text-indigo-600" />;
      case 'interview': return <Calendar className="h-4 w-4 text-emerald-600" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'job': return <Briefcase className="h-4 w-4 text-blue-600" />;
      case 'company': return <Building2 className="h-4 w-4 text-amber-600" />;
      default: return <Bell className="h-4 w-4 text-indigo-600" />;
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.is_read) {
      markAsRead(item.id);
    }
    onClose?.();

    // Safe allow-listed navigation mapping
    switch (item.reference_type) {
      case 'application':
        navigate(item.reference_id ? `/recruiter/applications/${item.reference_id}` : '/recruiter/applications');
        break;
      case 'interview':
        navigate('/recruiter/interviews');
        break;
      case 'job':
        navigate('/recruiter/jobs');
        break;
      case 'payment':
        navigate('/recruiter/payments');
        break;
      case 'company':
        navigate('/recruiter/company-profile');
        break;
      default:
        navigate('/recruiter/notifications');
        break;
    }
  };

  const handleViewAll = () => {
    onClose?.();
    navigate('/recruiter/notifications');
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Recruiter notifications panel"
      className={`bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden font-sans z-50 flex flex-col ${
        isMobile 
          ? 'fixed inset-x-3 top-16 max-h-[80vh] shadow-slate-900/20 animate-fadeIn' 
          : 'absolute right-0 top-12 w-96 max-h-[520px] animate-fadeIn'
      }`}
    >
      {/* Panel Header */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-150 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-black">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 disabled:hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 shrink-0 bg-white">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filter === 'unread'
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification Rows List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-800">
              {filter === 'unread' ? 'You’re all caught up' : 'No notifications yet'}
            </h4>
            <p className="text-xs font-medium text-slate-500 max-w-[220px]">
              {filter === 'unread'
                ? 'There are no unread notifications.'
                : 'Activity alerts regarding jobs, candidates, and payments will appear here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3.5 flex items-start gap-3 hover:bg-indigo-50/40 transition-colors cursor-pointer relative ${
                !item.is_read ? 'bg-indigo-50/20' : 'bg-white'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                {getCategoryIcon(item.reference_type)}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs ${!item.is_read ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'} truncate`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0 ml-2">
                    {item.created_at || 'Just now'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-0.5 leading-snug">
                  {item.message}
                </p>
              </div>

              {!item.is_read && (
                <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-150 shrink-0 text-center">
        <button
          type="button"
          onClick={handleViewAll}
          className="w-full py-1.5 px-3 rounded-xl text-xs font-extrabold text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <span>View all notifications</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
