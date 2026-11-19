import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SuperAdminBreadcrumbs from './SuperAdminBreadcrumbs';
import SuperAdminLocationModal from './SuperAdminLocationModal';
import { normalizeLocationWithCountry } from '../../../data/indiaLocations';
import { useSignOut } from '../../../context/SignOutContext';
import { useSuperAdminUser } from '../../../context/SuperAdminUserContext';
import { searchAdminRecordsService } from '../../../services/superAdmin/superAdminService';

export default function SuperAdminHeader({ 
  sidebarOpen, 
  setSidebarOpen, 
  onOpenDrawerDetails
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestSignOut } = useSignOut();
  const { profile, updateLocation, notifications, unreadCount, markAsRead, markAllAsRead } = useSuperAdminUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const currentLocation = normalizeLocationWithCountry(profile?.location || 'All India');

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileButtonRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Derive display values from context profile
  const fullName = profile?.full_name || 'Super Admin';
  const email = profile?.email || '';
  const profilePicture = profile?.profile_picture;
  
  // Initials fallback
  const getInitials = (name) => {
    if (!name) return 'SA';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(fullName);

  // Close profile dropdown on outside click or Escape
  useEffect(() => {
    if (!showProfileDropdown) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowProfileDropdown(false);
        profileButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current && 
        !profileDropdownRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Close notification dropdown on outside click or Escape
  useEffect(() => {
    if (!showNotificationDropdown) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowNotificationDropdown(false);
        notificationButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        notificationDropdownRef.current && 
        !notificationDropdownRef.current.contains(e.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(e.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationDropdown]);

  // Live search over real candidates, employers and jobs (debounced backend query)
  const [fetchedResults, setFetchedResults] = useState([]);
  const searchResults = searchQuery.trim().length >= 2 ? fetchedResults : [];

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const rows = await searchAdminRecordsService(q, controller.signal);
        setFetchedResults(rows.slice(0, 8).map(r => ({
          name: r.name,
          type: r.type,
          status: r.status,
          original: r.details
        })));
      } catch (err) {
        if (err.name !== 'AbortError') setFetchedResults([]);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  const handleResultClick = (res) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    
    let detailsType = '';
    if (res.type === 'Job') detailsType = 'JOB';
    else if (res.type === 'Candidate') detailsType = 'CANDIDATE';
    else if (res.type === 'Employer') detailsType = 'EMPLOYER';

    onOpenDrawerDetails?.({
      type: detailsType,
      title: res.name,
      details: res.original
    });
  };

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    setShowNotificationDropdown(false);
    
    // Map reference_type to safe route
    const refType = item.reference_type;
    if (refType === 'employer_verification') navigate('/super-admin/employer-verification');
    else if (refType === 'job_review') navigate('/super-admin/job-review');
    else if (refType === 'admin') navigate('/super-admin/admins');
    else if (refType === 'security') navigate('/super-admin/audit-security');
    else if (refType === 'report' || refType === 'query') navigate('/super-admin/reports');
    else navigate('/super-admin/notifications');
  };

  const canonicalPath = location.pathname
    .replace(/^\/super_admin/, '/super-admin')
    .replace(/^\/superadmin/, '/super-admin')
    .replace(/\/+$/, '');

  const isOverview = 
    canonicalPath === '/super-admin/overview' || 
    canonicalPath === '/super-admin' || 
    canonicalPath === '/dashboard';

  return (
    <header className={`sticky top-0 z-40 border-b border-slate-200 bg-white font-sans ${
      isOverview 
        ? 'flex items-center justify-between px-6 py-3 shadow-xs' 
        : 'flex lg:hidden items-center justify-between px-4 py-2.5 shadow-xs'
    }`}>
      {/* Sidebar Toggle for Mobile */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {!isOverview && (
          <span className="text-sm font-black text-slate-800 lg:hidden">TN Jobz</span>
        )}
      </div>

      {/* Header Actions - Only shown on Overview page */}
      {isOverview && (
        <div className="flex items-center gap-4">
        {/* Search Bar Input */}
        <div className="relative hidden w-64 md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search candidates, employers..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9.5 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
          />

          {showSearchDropdown && searchResults.length > 0 && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSearchDropdown(false)} />
              <div className="absolute left-0 z-20 mt-2 w-full rounded-2xl border border-slate-150 bg-white p-2 shadow-xl">
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((res, i) => (
                    <div 
                      key={i}
                      onClick={() => handleResultClick(res)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate">{res.name}</span>
                        <span className="text-[10px] text-slate-500">{res.type}</span>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                        res.status === 'APPROVED' || res.status === 'ACTIVE' 
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' 
                          : 'border border-blue-200 bg-blue-50 text-blue-700'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Location Picker Pill */}
        <div className="hidden sm:block">
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-teal-300 px-3.5 py-2 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-xs group"
            title={currentLocation}
          >
            <svg className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="max-w-[190px] lg:max-w-[240px] truncate">{currentLocation}</span>
            <svg className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            ref={notificationButtonRef}
            onClick={() => {
              // Mobile behavior: navigate to notifications page directly
              if (window.innerWidth < 768) {
                navigate('/super-admin/notifications');
              } else {
                setShowNotificationDropdown(!showNotificationDropdown);
              }
            }}
            className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer transition-colors"
            aria-label={`View notifications (${unreadCount} unread)`}
          >
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Desktop Notification Preview Panel */}
          {showNotificationDropdown && (
            <div 
              ref={notificationDropdownRef}
              className="absolute right-0 z-50 mt-2 w-88 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-scaleUp"
            >
              <div className="flex items-center justify-between border-b border-slate-150 px-4.5 py-3 bg-slate-50">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-extrabold text-teal-800">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      className={`flex flex-col px-4.5 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-teal-50/20' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-bold ${!n.is_read ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                          {n.formatted_time || 'Just now'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-xs font-bold text-slate-400">
                    No notifications yet
                  </div>
                )}
              </div>

              <div className="border-t border-slate-150 bg-slate-50 px-4 py-2.5 text-center">
                <Link
                  to="/super-admin/notifications"
                  onClick={() => setShowNotificationDropdown(false)}
                  className="text-xs font-extrabold text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>View all notifications</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Container */}
        <div className="relative">
          <button 
            ref={profileButtonRef}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 rounded-xl p-1 hover:bg-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer transition-colors"
            aria-expanded={showProfileDropdown}
            aria-haspopup="true"
            aria-label="Super Admin account menu"
          >
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={fullName} 
                className="h-9 w-9 rounded-full object-cover border border-teal-500 shadow-xs"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 font-black text-white text-xs tracking-wider shadow-xs">
                {initials}
              </div>
            )}
            <div className="hidden flex-col text-left md:flex pr-1">
              <span className="text-xs font-extrabold text-slate-900 leading-tight truncate max-w-[130px]">
                {fullName}
              </span>
              <span className="text-[10px] font-bold text-teal-700 leading-tight">
                Super Admin
              </span>
            </div>
            <svg className="h-4 w-4 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div 
              ref={profileDropdownRef}
              className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl animate-scaleUp font-sans"
              role="menu"
              aria-orientation="vertical"
            >
              {/* Menu Header Card */}
              <div className="border-b border-slate-100 px-3 py-2.5 mb-1 bg-slate-50/70 rounded-xl">
                <p className="text-xs font-black text-slate-900 truncate">{fullName}</p>
                <span className="inline-block rounded-md bg-teal-50 border border-teal-200 px-1.5 py-0.5 text-[9px] font-black text-teal-700 uppercase mt-0.5 mb-1">
                  Super Admin
                </span>
                <p className="text-[11px] font-semibold text-slate-500 truncate" title={email}>
                  {email}
                </p>
              </div>

              {/* Menu Item: My Profile */}
              <button
                role="menuitem"
                onClick={() => {
                  setShowProfileDropdown(false);
                  profileButtonRef.current?.focus();
                  navigate('/super-admin/profile');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>My Profile</span>
              </button>

              {/* Menu Item: Account Settings */}
              <button
                role="menuitem"
                onClick={() => {
                  setShowProfileDropdown(false);
                  profileButtonRef.current?.focus();
                  navigate('/super-admin/account-settings');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Account Settings</span>
              </button>

              <div className="my-1 border-t border-slate-150" />

              {/* Menu Item: Sign Out */}
              <button 
                role="menuitem"
                onClick={() => {
                  setShowProfileDropdown(false);
                  profileButtonRef.current?.focus();
                  requestSignOut('superAdmin');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-extrabold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    )}

      {/* Super Admin Location Selector Modal (Flow 3: All-India LGD Catalog) */}
      <SuperAdminLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={currentLocation}
        onSaveLocation={updateLocation}
      />
    </header>
  );
}
