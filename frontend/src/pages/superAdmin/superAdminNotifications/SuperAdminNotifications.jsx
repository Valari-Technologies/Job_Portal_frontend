import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminUser } from '../../../context/SuperAdminUserContext';
import { 
  Bell, 
  CheckCheck, 
  Search, 
  ShieldAlert, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  Users, 
  Inbox, 
  RotateCcw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function SuperAdminNotifications() {
  const navigate = useNavigate();
  const { 
    notifications, 
    isLoadingNotifications, 
    error, 
    refreshData, 
    markAsRead, 
    markAllAsRead 
  } = useSuperAdminUser();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping for event types
  const getEventIcon = (referenceType) => {
    switch (referenceType) {
      case 'employer_verification':
        return <UserCheck className="h-5 w-5 text-teal-600" />;
      case 'job_review':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'security':
        return <ShieldAlert className="h-5 w-5 text-amber-600" />;
      case 'admin':
        return <Users className="h-5 w-5 text-purple-600" />;
      case 'report':
      case 'query':
        return <AlertTriangle className="h-5 w-5 text-rose-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  // Safe navigation mapping
  const handleActionClick = (notification, e) => {
    e.stopPropagation();
    markAsRead(notification.id);

    const refType = notification.reference_type;
    switch (refType) {
      case 'employer_verification':
        navigate('/super-admin/employer-verification');
        break;
      case 'job_review':
        navigate('/super-admin/job-review');
        break;
      case 'admin':
        navigate('/super-admin/admins');
        break;
      case 'security':
        navigate('/super-admin/audit-security');
        break;
      case 'report':
      case 'query':
        navigate('/super-admin/reports');
        break;
      default:
        break;
    }
  };

  // Filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      // 1. Tab filter
      if (activeTab === 'unread' && item.is_read) return false;

      // 2. Category filter
      if (categoryFilter !== 'ALL' && item.reference_type !== categoryFilter) return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesMsg = item.message?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg) return false;
      }

      return true;
    });
  }, [notifications, activeTab, categoryFilter, searchQuery]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-8 font-sans animate-fadeIn max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Review platform, moderation, account, and security updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto min-h-[44px]"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Toolbar Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* All vs Unread Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'unread'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-teal-600 px-1.5 py-0.2 text-[10px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Search & Category Filter dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Category Select */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-bold text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="employer_verification">Employer Verification</option>
              <option value="job_review">Job Moderation</option>
              <option value="security">Security Alerts</option>
              <option value="admin">Admin Events</option>
              <option value="report">Reports & Queries</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoadingNotifications ? (
        /* Loading Skeleton */
        <div className="space-y-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Failed to load notifications</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={refreshData}
            className="px-4 py-2.5 rounded-xl bg-white border border-red-200 text-xs font-extrabold text-red-700 shadow-xs hover:bg-red-50 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      ) : filteredNotifications.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-xs">
          <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            {activeTab === 'unread' ? <CheckCircle2 className="h-8 w-8 text-teal-600" /> : <Inbox className="h-8 w-8" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {activeTab === 'unread' ? "You're all caught up!" : "No notifications yet"}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm mx-auto">
              {activeTab === 'unread' 
                ? "There are no unread notifications right now. Check back later for system updates."
                : "No notification records found matching your active filters."}
            </p>
          </div>
        </div>
      ) : (
        /* Notifications List */
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-150 overflow-hidden">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                !item.is_read ? 'bg-teal-50/20 hover:bg-teal-50/40' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Notification Icon */}
                <div className={`p-3 rounded-2xl shrink-0 border ${
                  !item.is_read ? 'bg-white border-teal-200 shadow-2xs' : 'bg-slate-100 border-slate-200'
                }`}>
                  {getEventIcon(item.reference_type)}
                </div>

                {/* Content Details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-xs font-extrabold ${!item.is_read ? 'text-slate-900 font-black' : 'text-slate-700'}`}>
                      {item.title}
                    </h3>
                    {!item.is_read && (
                      <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.message}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400">
                    {item.formatted_time || new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Contextual Action Button */}
              <div className="shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={(e) => handleActionClick(item, e)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-extrabold text-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                >
                  <span>View Details</span>
                  <ExternalLink className="h-3.5 w-3.5 text-teal-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
