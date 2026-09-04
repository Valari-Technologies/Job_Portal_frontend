import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, FileText, Calendar, CreditCard, Briefcase, Building2, ChevronRight, Sparkles, Filter } from 'lucide-react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import { useRecruiterUser } from '../../context/RecruiterUserContext';

export default function RecruiterNotifications() {
  return (
    <RecruiterLayout activeTab="notifications">
      <RecruiterNotificationsContent />
    </RecruiterLayout>
  );
}

function RecruiterNotificationsContent() {
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoadingNotifications, notificationError, markAsRead, markAllAsRead, refreshNotifications } = useRecruiterUser();
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  const filteredNotifications = (notifications || []).filter(item => {
    if (filter === 'unread') return !item.is_read;
    return true;
  });

  const getCategoryIcon = (refType) => {
    switch (refType) {
      case 'application': return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'interview': return <Calendar className="h-5 w-5 text-emerald-600" />;
      case 'payment': return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'job': return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'company': return <Building2 className="h-5 w-5 text-amber-600" />;
      default: return <Bell className="h-5 w-5 text-indigo-600" />;
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.is_read) {
      markAsRead(item.id);
    }

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
        break;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 font-sans select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Bell className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
          </div>
          <p className="text-sm font-bold text-slate-500 mt-1">
            View and manage all your account, job, application, and interview alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Filter & Status Bar */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 mr-1" />
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({(notifications || []).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
              filter === 'unread'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {unreadCount} unread alert{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error State */}
      {notificationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700 flex items-center justify-between">
          <span>{notificationError}</span>
          <button
            type="button"
            onClick={() => refreshNotifications()}
            className="px-3 py-1 bg-red-600 text-white text-xs font-extrabold rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoadingNotifications ? (
          /* Loading Skeletons */
          <div className="divide-y divide-slate-100 p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse pt-3">
                <div className="h-10 w-10 bg-slate-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-150 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {filter === 'unread' ? 'You’re all caught up' : 'No notifications yet'}
            </h3>
            <p className="text-xs font-bold text-slate-500 max-w-sm leading-relaxed">
              {filter === 'unread'
                ? 'There are no unread notifications right now.'
                : 'Notifications about candidate applications, interview schedules, payment receipts, and job status updates will appear here.'}
            </p>
          </div>
        ) : (
          /* Notification Items List */
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-4 sm:p-5 flex items-start gap-4 hover:bg-indigo-50/40 transition-colors cursor-pointer relative ${
                  !item.is_read ? 'bg-indigo-50/20' : 'bg-white'
                }`}
              >
                <div className="p-3 rounded-2xl bg-slate-100 shrink-0 mt-0.5 border border-slate-200">
                  {getCategoryIcon(item.reference_type)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className={`text-sm ${!item.is_read ? 'font-black text-slate-900' : 'font-extrabold text-slate-700'}`}>
                      {item.title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-400 shrink-0">
                      {item.created_at || 'Just now'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-center">
                  {!item.is_read && (
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  )}
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
