import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminUser } from '../../../context/SuperAdminUserContext';
import { sendBroadcastNotificationService } from '../../../services/superAdmin/superAdminNotificationsService';
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
  ExternalLink,
  Send,
  Trash2,
  X,
  Clock,
  User,
  Tag,
  Briefcase
} from 'lucide-react';

export default function SuperAdminNotifications() {
  const navigate = useNavigate();
  const { 
    notifications, 
    isLoadingNotifications, 
    error, 
    refreshData, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useSuperAdminUser();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Notification for Details Modal
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Broadcast Announcement states
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState({ message: '', isError: false });

  // Clear All confirmation state
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      setBroadcastFeedback({ message: 'Please provide both title and message for the announcement.', isError: true });
      return;
    }
    setIsBroadcasting(true);
    setBroadcastFeedback({ message: '', isError: false });
    try {
      const res = await sendBroadcastNotificationService({
        targetRole: broadcastTarget,
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
        notificationType: 'SYSTEM_ANNOUNCEMENT'
      });
      if (res.success) {
        setBroadcastFeedback({ message: res.data?.message || 'Announcement broadcasted successfully!', isError: false });
        setShowBroadcastModal(false);
        setBroadcastTitle('');
        setBroadcastMessage('');
        await refreshData();
      } else {
        setBroadcastFeedback({ message: res.message || 'Failed to send broadcast.', isError: true });
      }
    } catch (err) {
      setBroadcastFeedback({ message: err.message || 'An error occurred while broadcasting.', isError: true });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleOpenDetails = (notification, e) => {
    if (e) e.stopPropagation();
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const handleDeleteSingle = async (notificationId, e) => {
    if (e) e.stopPropagation();
    try {
      setIsDeleting(true);
      await deleteNotification(notificationId);
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification(null);
      }
      setBroadcastFeedback({ message: 'Notification removed successfully.', isError: false });
    } catch (err) {
      setBroadcastFeedback({ message: err.message || 'Failed to delete notification.', isError: true });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmClearAll = async () => {
    try {
      setIsDeleting(true);
      await clearAllNotifications();
      setSelectedNotification(null);
      setShowClearConfirmModal(false);
      setBroadcastFeedback({ message: 'All notifications cleared successfully.', isError: false });
    } catch (err) {
      setBroadcastFeedback({ message: err.message || 'Failed to clear notifications.', isError: true });
    } finally {
      setIsDeleting(false);
    }
  };

  // Target navigation path resolver
  const getDestination = (notification) => {
    if (!notification) return null;
    const refType = (notification.reference_type || '').toLowerCase();
    const notifType = (notification.notification_type || '').toLowerCase();

    if (refType.includes('employer') || notifType.includes('employer')) {
      return { path: '/super-admin/employer-verification', label: 'Go to Employer Verification' };
    }
    if (refType === 'job' || notifType.includes('job') || notifType.includes('job_submission') || notifType.includes('job_review') || notifType.includes('job_pending')) {
      return { path: '/super-admin/job-review', label: 'Go to Job Moderation' };
    }
    if (refType.includes('application') || notifType.includes('application')) {
      return { path: '/super-admin/overview', label: 'Go to Overview & Applications' };
    }
    if (refType.includes('candidate') || notifType.includes('candidate') || (refType === 'user' && notifType.includes('candidate'))) {
      return { path: '/super-admin/candidates', label: 'Go to Candidate Directory' };
    }
    if (refType.includes('report') || notifType.includes('report')) {
      return { path: '/super-admin/reports', label: 'Go to Reports & Safety' };
    }
    if (refType.includes('admin') || notifType.includes('admin')) {
      return { path: '/super-admin/admins', label: 'Go to Admin Accounts' };
    }
    if (refType.includes('security') || notifType.includes('security')) {
      return { path: '/super-admin/audit-security', label: 'Go to Security Audit' };
    }
    return null;
  };

  // Icon mapping for event types
  const getEventIcon = (referenceType, notificationType) => {
    const typeStr = `${referenceType || ''} ${notificationType || ''}`.toUpperCase();
    if (typeStr.includes('EMPLOYER')) {
      return <UserCheck className="h-5 w-5 text-teal-600" />;
    }
    if (typeStr.includes('APPLICATION')) {
      return <Briefcase className="h-5 w-5 text-indigo-600" />;
    }
    if (typeStr.includes('CANDIDATE')) {
      return <Users className="h-5 w-5 text-emerald-600" />;
    }
    if (typeStr.includes('JOB') && !typeStr.includes('REPORT')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    if (typeStr.includes('REPORT')) {
      return <AlertTriangle className="h-5 w-5 text-rose-600" />;
    }
    if (typeStr.includes('SECURITY')) {
      return <ShieldAlert className="h-5 w-5 text-amber-600" />;
    }
    if (typeStr.includes('ADMIN')) {
      return <Users className="h-5 w-5 text-purple-600" />;
    }
    return <Bell className="h-5 w-5 text-slate-600" />;
  };

  // Filter logic
  const filteredNotifications = useMemo(() => {
    const notifList = Array.isArray(notifications) ? notifications : [];
    return notifList.filter(item => {
      // 1. Tab filter
      if (activeTab === 'unread' && item.is_read) return false;

      // 2. Category filter
      if (categoryFilter !== 'ALL') {
        const itemCat = `${item.reference_type || ''} ${item.notification_type || ''}`.toUpperCase();
        if (!itemCat.includes(categoryFilter.toUpperCase())) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesMsg = item.message?.toLowerCase().includes(q);
        const matchesUser = item.recipient_email?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg && !matchesUser) return false;
      }

      return true;
    });
  }, [notifications, activeTab, categoryFilter, searchQuery]);

  const notifArray = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notifArray.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Notifications</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowBroadcastModal(true)}
            className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs min-h-[44px]"
          >
            <Send className="h-4 w-4 text-teal-400" />
            <span>Broadcast Notice</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark all as read</span>
            </button>
          )}

          {notifArray.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirmModal(true)}
              className="w-full sm:w-auto justify-center px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              title="Clear all notifications"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {broadcastFeedback.message && (
        <div className={`p-4 rounded-xl text-xs font-extrabold flex items-center justify-between ${
          broadcastFeedback.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <span>{broadcastFeedback.message}</span>
          <button 
            type="button"
            onClick={() => setBroadcastFeedback({ message: '', isError: false })} 
            className="text-slate-400 hover:text-slate-600 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

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
            All ({notifArray.length})
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
              <option value="JOB">Job Moderation & Postings</option>
              <option value="APPLICATION">Job Applications</option>
              <option value="CANDIDATE">Candidate Registrations</option>
              <option value="EMPLOYER">Employer Verification</option>
              <option value="REPORT">Job Reports</option>
              <option value="ANNOUNCEMENT">System Announcements</option>
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
              {activeTab === 'unread' ? "You're all caught up!" : "No notifications right now"}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm mx-auto">
              {activeTab === 'unread' 
                ? "There are no unread notifications right now. Check back later for platform updates."
                : "Real platform events, job reports, verification requests, and announcements will appear here dynamically as users interact with the platform."}
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="h-3.5 w-3.5 text-teal-400" />
              <span>Send Broadcast Announcement</span>
            </button>
          </div>
        </div>
      ) : (
        /* Notifications List */
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-150 overflow-hidden">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenDetails(item)}
              className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                !item.is_read ? 'bg-teal-50/20 hover:bg-teal-50/40' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Notification Icon */}
                <div className={`p-3 rounded-2xl shrink-0 border ${
                  !item.is_read ? 'bg-white border-teal-200 shadow-2xs' : 'bg-slate-100 border-slate-200'
                }`}>
                  {getEventIcon(item.reference_type, item.notification_type)}
                </div>

                {/* Content Details */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-xs font-extrabold ${!item.is_read ? 'text-slate-900 font-black' : 'text-slate-700'}`}>
                      {item.title}
                    </h3>
                    {!item.is_read && (
                      <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {item.message}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleOpenDetails(item, e)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-extrabold text-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                >
                  <span>View Details</span>
                  <ExternalLink className="h-3.5 w-3.5 text-teal-600" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDeleteSingle(item.id, e)}
                  disabled={isDeleting}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 shadow-2xs transition-colors cursor-pointer min-h-[38px]"
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-150 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    selectedNotification.is_read
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-teal-50 text-teal-700 border-teal-200'
                  }`}>
                    {selectedNotification.is_read ? 'Read' : 'Unread'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    ID #{selectedNotification.id}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {selectedNotification.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Notification Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-150">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">Received Time</span>
                <span className="font-extrabold text-slate-800">
                  {selectedNotification.created_at ? new Date(selectedNotification.created_at).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">Category / Type</span>
                <span className="font-extrabold text-slate-800">
                  {selectedNotification.notification_type || 'GENERAL'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">Recipient</span>
                <span className="font-extrabold text-slate-800">
                  {selectedNotification.recipient_email || 'System / Admin'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">Linked Reference</span>
                <span className="font-extrabold text-slate-800">
                  {selectedNotification.reference_type ? `${selectedNotification.reference_type} #${selectedNotification.reference_id || ''}` : 'None'}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase block mb-1.5">Notification Message</span>
              <div className="p-4 bg-teal-50/20 border border-teal-150 rounded-2xl text-xs font-semibold text-slate-800 leading-relaxed">
                {selectedNotification.message}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-150 flex-wrap">
              <button
                type="button"
                onClick={() => handleDeleteSingle(selectedNotification.id)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                {getDestination(selectedNotification) && (
                  <button
                    type="button"
                    onClick={() => {
                      const dest = getDestination(selectedNotification);
                      setSelectedNotification(null);
                      navigate(dest.path);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>{getDestination(selectedNotification).label}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Clear All Notifications?</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Are you sure you want to permanently clear all notifications from the database? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-extrabold text-white cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? 'Clearing...' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-150 pb-4">
              <h3 className="text-lg font-black text-slate-900">Broadcast Platform Announcement</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Dispatch an official notification notice to candidates, employers, or all platform users.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Audience</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                >
                  <option value="ALL">All Platform Users (Candidates & Employers)</option>
                  <option value="CANDIDATE">Candidates Only</option>
                  <option value="HR">Employers / HRs Only</option>
                  <option value="ADMIN">Admins Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Platform Policy Update or Maintenance Notice"
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Body</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type the message that will be delivered to target users..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  disabled={isBroadcasting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-extrabold text-white shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isBroadcasting ? 'Broadcasting...' : 'Dispatch Announcement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
