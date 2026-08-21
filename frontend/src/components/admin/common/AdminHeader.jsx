import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  mockCandidates, 
  mockEmployers, 
  mockJobs 
} from '../../../pages/admin/adminOverview/overviewMockData';

export default function AdminHeader({ 
  sidebarOpen, 
  setSidebarOpen, 
  notifications,
  setNotifications,
  onOpenDrawerDetails
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();

  // Dynamic breadcrumb matching path
  const isCandidatePage = location.pathname.startsWith('/admin/candidates');
  const isEmployerPage = location.pathname.startsWith('/admin/employers');
  const isVerificationPage = location.pathname.startsWith('/admin/employer-verification');
  const isJobReviewPage = location.pathname.startsWith('/admin/job-review');
  const isCategoriesPage = location.pathname.startsWith('/admin/categories');
  const isLocationsPage = location.pathname.startsWith('/admin/locations');
  const isSkillsPage = location.pathname.startsWith('/admin/skills');
  const isReportsPage = location.pathname.startsWith('/admin/reports');
  const isNotificationsPage = location.pathname.startsWith('/admin/notifications');
  const isAnalyticsPage = location.pathname.startsWith('/admin/analytics');
  const isAuditSecurityPage = location.pathname.startsWith('/admin/audit-security');

  // Search candidate, employer, job, reports
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    
    const matchedCandidates = mockCandidates
      .filter(c => c.full_name.toLowerCase().includes(q))
      .map(c => ({ name: c.full_name, type: 'Candidate', status: `${c.profile_completion}% Completed`, original: c }));

    const matchedEmployers = mockEmployers
      .filter(e => e.company_name.toLowerCase().includes(q))
      .map(e => ({ name: e.company_name, type: 'Employer', status: e.status, original: e }));

    const matchedJobs = mockJobs
      .filter(j => j.title.toLowerCase().includes(q))
      .map(j => ({ name: j.title, type: 'Job', status: j.status, original: j }));

    return [...matchedCandidates, ...matchedEmployers, ...matchedJobs].slice(0, 8);
  };

  const searchResults = getSearchResults();

  const handleNotificationClick = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleResultClick = (res) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    
    let detailsType = '';
    if (res.type === 'Job') detailsType = 'JOB';
    else if (res.type === 'Candidate') detailsType = 'CANDIDATE';
    else if (res.type === 'Employer') detailsType = 'EMPLOYER';

    onOpenDrawerDetails({
      type: detailsType,
      title: res.name,
      details: res.original
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3 shadow-xs">
      {/* Sidebar Toggle for Mobile */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 lg:hidden focus:ring-2 focus:ring-teal-500 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden items-center gap-2.5 text-base text-slate-700 sm:flex" aria-label="Breadcrumb">
          <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {isCandidatePage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-500">Management</span>
              <span className="text-slate-350">/</span>
              <span className="font-bold text-slate-900">Candidates</span>
            </>
          ) : isEmployerPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-500">Management</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Employers</span>
            </>
          ) : isVerificationPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-500">Moderation</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Employer verification</span>
            </>
          ) : isJobReviewPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-500">Moderation</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Job review</span>
            </>
          ) : isCategoriesPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-505">Catalog</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Categories</span>
            </>
          ) : isLocationsPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-505">Catalog</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Locations</span>
            </>
          ) : isSkillsPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-505">Catalog</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Skills</span>
            </>
          ) : isReportsPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-505">Communication</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Reports</span>
            </>
          ) : isNotificationsPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-505">Communication</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Notifications</span>
            </>
          ) : isAnalyticsPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-505">Insights</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Analytics</span>
            </>
          ) : isAuditSecurityPage ? (
            <>
              <span className="text-slate-350">/</span>
              <span className="text-slate-550">System</span>
              <span className="text-slate-355">/</span>
              <span className="font-bold text-slate-900">Audit & security</span>
            </>
          ) : (
            <>
              <span className="text-slate-350">/</span>
              <span className="font-bold text-slate-900">Overview</span>
            </>
          )}
        </nav>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-5 sm:gap-6">
        {/* Global Search Input */}
        <div className="relative max-w-xs sm:max-w-md w-64 md:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4.5 w-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search candidates, employers, jobs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-12 text-base text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100 focus:outline-none transition-all duration-200"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="hidden rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-500 sm:inline-block">⌘K</kbd>
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSearchDropdown(false)} />
              <div className="absolute right-0 left-0 z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                {searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => handleResultClick(res)}
                      className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-800">{res.name}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 uppercase">{res.type}</span>
                      </div>
                      <span className="text-sm text-slate-500 mt-0.5">{res.status}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-sm text-slate-500">No results found for "{searchQuery}"</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Tamil Nadu scope indicator / selector */}
        <div className="relative">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base font-bold text-slate-800 shadow-2xs hover:bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:outline-none">
            <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Tamil Nadu</span>
            <svg className="h-4.5 w-4.5 text-slate-550" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Notifications Icon Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="relative rounded-full p-2.5 text-slate-600 hover:bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            aria-label="View notifications"
          >
            <svg className="h-6.5 w-6.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotificationDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotificationDropdown(false)} />
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h3 className="text-base font-bold text-slate-800">Notifications</h3>
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    }}
                    className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n.id)}
                        className={`flex flex-col border-b border-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-teal-50/20' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-bold text-slate-800">{n.title}</span>
                          <span className="text-xs text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-650 mt-1">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">No new notifications</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile super admin */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 font-bold text-white text-base">
              SA
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-sm font-extrabold text-slate-800 leading-none">Super Admin</span>
              <span className="text-xs font-bold text-slate-500 mt-1">Super Administrator</span>
            </div>
          </button>

          {showProfileDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                <div className="border-b border-slate-50 px-3 py-2 text-sm">
                  <p className="font-bold text-slate-800">Super Admin</p>
                  <p className="text-slate-500 truncate">admin@statejobz.tn.gov</p>
                </div>
                <button className="flex w-full items-center px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors rounded-lg">
                  Account Settings
                </button>
                <button className="flex w-full items-center px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg">
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
