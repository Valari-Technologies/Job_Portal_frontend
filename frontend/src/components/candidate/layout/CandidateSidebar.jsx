import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  Briefcase, 
  FileText, 
  Calendar, 
  FileCode, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useCandidateUser } from '../../../context/CandidateUserContext';
import { useSignOut } from '../../../context/SignOutContext';

export default function CandidateSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useCandidateUser();
  const { requestSignOut } = useSignOut();

  const currentPath = location.pathname;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutGrid },
    { id: 'jobs', label: 'Jobs', path: '/candidate/jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', path: '/candidate/applications', icon: FileText },
    { id: 'interviews', label: 'Interviews', path: '/candidate/interviews', icon: Calendar },
    { id: 'resume', label: 'Resume', path: '/candidate/resume', icon: FileCode },
    { id: 'profile', label: 'Profile', path: '/candidate/profile', icon: User },
  ];

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden lg:flex flex-col border-r border-slate-200 bg-white select-none shrink-0 w-64 h-screen sticky top-0 z-30 font-sans">
      
      {/* 1. Brand & Account Header Card */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3.5">
        <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
          {profile?.avatarUrl ? (
            <img 
              src={profile.avatarUrl} 
              alt={profile.fullName || 'Candidate Avatar'} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-black text-[#3B00FF]">
              {getInitials(profile?.fullName)}
            </span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-base font-black text-[#3B00FF] tracking-tight truncate leading-tight">
            Job Portal
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Premium Tier
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Menu Items */}
      <nav aria-label="Candidate sidebar menu" className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.id === 'dashboard' && currentPath === '/candidate/overview');

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#3B00FF] text-white shadow-md shadow-[#3B00FF]/20 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. Bottom Sidebar Actions */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link
          to="/candidate/settings"
          className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
            currentPath === '/candidate/settings'
              ? 'bg-[#3B00FF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="h-4.5 w-4.5 text-slate-500 shrink-0" />
          <span>Settings</span>
        </Link>

        <button
          type="button"
          onClick={() => requestSignOut(() => navigate('/login'))}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-extrabold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
        >
          <LogOut className="h-4.5 w-4.5 text-slate-500 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
