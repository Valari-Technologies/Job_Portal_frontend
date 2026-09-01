import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SuperAdminBreadcrumbs from './SuperAdminBreadcrumbs';
import { 
  mockCandidates, 
  mockEmployers, 
  mockJobs 
} from '../../../pages/superAdmin/superAdminOverview/superAdminOverviewData';

export default function SuperAdminHeader({ 
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
        <div className="hidden sm:block">
          <SuperAdminBreadcrumbs pathname={location.pathname} />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4.5">
        {/* Search Bar Input */}
        <div className="relative hidden w-64 md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
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
            className="w-full rounded-xl border border-slate-150 py-2 pl-9.5 pr-4 text-xs font-bold text-slate-800 placeholder-slate-450 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />

          {showSearchDropdown && searchResults.length > 0 && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSearchDropdown(false)} />
              <div className="absolute left-0 z-20 mt-2 w-full rounded-xl border border-slate-100 bg-white p-2.5 shadow-xl">
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((res, i) => (
                    <div 
                      key={i}
                      onClick={() => handleResultClick(res)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate">{res.name}</span>
                        <span className="text-[10px] text-slate-450">{res.type}</span>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                        res.status === 'APPROVED' || res.status === 'ACTIVE' 
                          ? 'border border-green-200 bg-green-50 text-green-700' 
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

        {/* State Selection Dropdown Mock */}
        <div className="relative">
          <button className="flex items-center gap-1.5 rounded-xl border border-slate-150 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
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
