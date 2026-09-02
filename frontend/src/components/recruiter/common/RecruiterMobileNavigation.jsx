import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Plus, FileText, Users } from 'lucide-react';

export default function RecruiterMobileNavigation({ activeTab }) {
  const location = useLocation();

  const isTabActive = (tabName, path) => {
    if (activeTab === tabName) return true;
    if (tabName === 'jobs' && location.pathname.startsWith('/recruiter/jobs')) return true;
    return location.pathname === path;
  };

  const showMobileFab = location.pathname === '/recruiter/jobs';

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-150 z-40 flex items-center justify-around px-2 shadow-lg select-none">
      {/* 1. Dashboard */}
      <Link 
        to="/recruiter/dashboard" 
        className={`flex flex-col items-center justify-center flex-1 py-1 relative ${
          isTabActive('dashboard', '/recruiter/dashboard') ? 'text-indigo-600 font-black' : 'text-slate-500 font-medium'
        }`}
      >
        {isTabActive('dashboard', '/recruiter/dashboard') && (
          <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full"></span>
        )}
        <LayoutDashboard className="h-5 w-5 mb-1" />
        <span className="text-[10px]">Dashboard</span>
      </Link>

      {/* 2. Jobs */}
      <Link 
        to="/recruiter/jobs" 
        className={`flex flex-col items-center justify-center flex-1 py-1 relative ${
          isTabActive('jobs', '/recruiter/jobs') ? 'text-indigo-600 font-black' : 'text-slate-500 font-medium'
        }`}
      >
        {isTabActive('jobs', '/recruiter/jobs') && (
          <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full"></span>
        )}
        <Briefcase className="h-5 w-5 mb-1" />
        <span className="text-[10px]">Jobs</span>
      </Link>

      {/* 3. Center + FAB (Visible only on /recruiter/jobs) */}
      {showMobileFab ? (
        <div className="flex-1 flex justify-center -mt-5">
          <Link 
            to="/recruiter/jobs/create" 
            aria-label="Post new job"
            className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Plus className="h-6 w-6 stroke-[3]" />
          </Link>
        </div>
      ) : null}

      {/* 4. Applications */}
      <Link 
        to="/recruiter/applications" 
        className={`flex flex-col items-center justify-center flex-1 py-1 relative ${
          isTabActive('applications', '/recruiter/applications') ? 'text-indigo-600 font-black' : 'text-slate-500 font-medium'
        }`}
      >
        {isTabActive('applications', '/recruiter/applications') && (
          <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full"></span>
        )}
        <FileText className="h-5 w-5 mb-1" />
        <span className="text-[10px]">Applications</span>
      </Link>

      {/* 5. Candidates */}
      <Link 
        to="/recruiter/candidates" 
        className={`flex flex-col items-center justify-center flex-1 py-1 relative ${
          isTabActive('candidates', '/recruiter/candidates') ? 'text-indigo-600 font-black' : 'text-slate-500 font-medium'
        }`}
      >
        {isTabActive('candidates', '/recruiter/candidates') && (
          <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full"></span>
        )}
        <Users className="h-5 w-5 mb-1" />
        <span className="text-[10px]">Candidates</span>
      </Link>
    </nav>
  );
}
