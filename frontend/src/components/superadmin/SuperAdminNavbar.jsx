import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';

export default function SuperAdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const [adminProfile, setAdminProfile] = useState({
    fullName: 'Super Admin',
    email: 'superadmin@recruitpro.com',
    role: 'Super Admin',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
  });

  const loadProfile = () => {
    try {
      const data = localStorage.getItem('sa_profile');
      if (data) {
        const parsed = JSON.parse(data);
        setAdminProfile({
          fullName: parsed.name,
          email: parsed.email,
          role: parsed.role,
          image: parsed.photo
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('profileUpdate', loadProfile);
    
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('profileUpdate', loadProfile);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/superadmin-dashboard', end: true },
    { label: 'Organizations', path: '/superadmin-dashboard/organizations', end: false },
    { label: 'HR Management', path: '/superadmin-dashboard/hr-management', end: false },
    { label: 'Jobs', path: '/superadmin-dashboard/jobs', end: false },
    { label: 'Candidates', path: '/superadmin-dashboard/candidates', end: false },
    { label: 'Applications', path: '/superadmin-dashboard/applications', end: false },
    { label: 'Activity Logs', path: '/superadmin-dashboard/activity-logs', end: false },
    { label: 'Reports', path: '/superadmin-dashboard/reports', end: false },
    { label: 'Profile', path: '/superadmin-dashboard/profile', end: false },
    { label: 'Settings', path: '/superadmin-dashboard/settings', end: false }
  ];

  const isTabActive = (path, end = false) => {
    const current = location.pathname.endsWith('/') && location.pathname.length > 1
      ? location.pathname.slice(0, -1)
      : location.pathname;
    const target = path.endsWith('/') && path.length > 1
      ? path.slice(0, -1)
      : path;
    if (end) {
      return current === target;
    }
    return current.startsWith(target);
  };

  return (
    <header className="w-full flex items-center justify-between py-2.5 z-30 relative select-none">
      
      {/* Navigation menu tabs exactly matching the HR Navbar capsule design */}
      <nav className="flex items-center gap-1 bg-white/50 backdrop-blur-xs p-1.5 rounded-full border border-white/40 shadow-xs overflow-x-auto whitespace-nowrap scrollbar-none max-w-full shrink">
        {navItems.map((item) => {
          const active = isTabActive(item.path, item.end);
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={`px-2.5 xl:px-4 py-2 text-xs xl:text-base font-extrabold rounded-full transition-all duration-200 cursor-pointer ${
                active 
                  ? 'bg-[#8CC63F] text-white shadow-md shadow-[#8CC63F]/20' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Right Side Icons & Avatar */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className={`relative w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-colors shadow-xs shrink-0 cursor-pointer ${
              isNotifOpen ? 'ring-2 ring-[#8CC63F]/40' : ''
            }`}
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 z-30 animate-scaleUp text-left">
              <div className="px-4 pb-2 border-b border-slate-50">
                <h3 className="text-xs font-black text-slate-800">HR Alerts</h3>
              </div>
              <div className="p-3 text-[11px] leading-snug text-slate-500 flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full inline-block mt-1 mr-1 shrink-0" />
                <div>
                  <p className="text-slate-700 font-bold">New system audit report generated</p>
                  <span className="text-[9px] text-slate-400 font-bold block mt-1">10 min ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Area */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className={`flex items-center gap-3 bg-white pl-2.5 pr-4 py-1.5 rounded-full border border-slate-100 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors select-none ${
              isProfileOpen ? 'ring-2 ring-[#8CC63F]/40' : ''
            }`}
          >
            <img 
              src={adminProfile.image} 
              alt="User Avatar" 
              className="w-8 h-8 rounded-full object-cover border border-slate-100" 
            />
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-sm sm:text-base font-black text-slate-800">{adminProfile.fullName}</p>
              <p className="text-xs sm:text-sm font-bold text-slate-400">{adminProfile.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-30 animate-scaleUp text-left text-xs font-bold text-slate-600">
              <button 
                onClick={() => { navigate('/superadmin-dashboard/profile'); setIsProfileOpen(false); }}
                className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 transition-colors text-left"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>View Profile</span>
              </button>
              <button 
                onClick={() => { navigate('/superadmin-dashboard/settings'); setIsProfileOpen(false); }}
                className="w-full px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>
              <div className="border-t border-slate-50 my-1"></div>
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/login');
                }}
                className="w-full px-4 py-2.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
