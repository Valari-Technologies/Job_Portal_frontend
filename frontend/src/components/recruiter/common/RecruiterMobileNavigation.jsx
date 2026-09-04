import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Plus, FileText, Users } from 'lucide-react';

export default function RecruiterMobileNavigation({ activeTab }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide the center + button during job creation workflow
  const isJobCreationFlow = location.pathname.startsWith('/recruiter/jobs/create');

  const isTabActive = (tabName, path) => {
    if (activeTab === tabName) return true;
    const currentPath = location.pathname;
    
    if (tabName === 'dashboard') {
      return currentPath === '/recruiter/dashboard' || currentPath === '/recruiter/overview';
    }
    if (tabName === 'jobs') {
      return currentPath === '/recruiter/jobs';
    }
    if (tabName === 'applications') {
      return currentPath.startsWith('/recruiter/applications');
    }
    if (tabName === 'candidates') {
      return currentPath.startsWith('/recruiter/candidates');
    }
    return currentPath === path;
  };

  const handlePostNewJob = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/recruiter/jobs/create');
  };

  return (
    <nav 
      aria-label="Recruiter mobile navigation" 
      className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-150 z-40 flex items-center justify-around px-2 shadow-lg select-none pb-[env(safe-area-inset-bottom)]"
    >
      {/* 1. Dashboard */}
      <Link 
        to="/recruiter/dashboard" 
        className={`flex flex-col items-center justify-center flex-1 py-1 relative min-h-[44px] ${
          isTabActive('dashboard', '/recruiter/dashboard') ? 'text-indigo-600 font-black' : 'text-slate-500 font-medium'
        }`}
      >
        {isTabActive('dashboard', '/recruiter/dashboard') && (
          <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
        )}
        <LayoutDashboard className="h-5 w-5 mb-1" />
        <span className="text-[10px] tracking-tight">Dashboard</span>
      </Link>

      {/* 2. Jobs */}
      <Link 
        to="/recruiter/jobs" 
        className={`flex flex-col items-center justify-center flex-1 py-1 relative min-h-[44px] ${
          isTabActive('jobs', '/recruiter/jobs') ? 'text-indigo-600 font-black' : 'text-slate-500 font-medium'
        }`}
      >
        {isTabActive('jobs', '/recruiter/jobs') && (
          <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
        )}
        <Briefcase className="h-5 w-5 mb-1" />
        <span className="text-[10px] tracking-tight">Jobs</span>
      </Link>

      {/* 3. Center + Action Button (Permanent mobile feature, hidden only in job creation flow) */}
      {!isJobCreationFlow && (
        <div className="flex-1 flex justify-center -mt-5 z-50">
          <button 
            type="button"
            onClick={handlePostNewJob} 
            aria-label="Post new job"
            className="h-[54px] w-[54px] rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/35 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
          >
            <Plus className="h-6 w-6 stroke-[3]" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* 4. Applications */}
      <Link 
        to="/recruiter/applications" 
        className={`flex flex-col items-center justify-center flex-1 py-1 relative min-h-[44px] ${
          isTabActive('applications', '/recruiter/applications') ? 'text-indigo-600 font-black' : 'text-slate-500 font-medium'
        }`}
      >
        {isTabActive('applications', '/recruiter/applications') && (
          <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
        )}
        <FileText className="h-5 w-5 mb-1" />
        <span className="text-[10px] tracking-tight">Applications</span>
      </Link>

      {/* 5. Candidates */}
      <Link 
        to="/recruiter/candidates" 
        className={`flex flex-col items-center justify-center flex-1 py-1 relative min-h-[44px] ${
          isTabActive('candidates', '/recruiter/candidates') ? 'text-indigo-600 font-black' : 'text-slate-500 font-medium'
        }`}
      >
        {isTabActive('candidates', '/recruiter/candidates') && (
          <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
        )}
        <Users className="h-5 w-5 mb-1" />
        <span className="text-[10px] tracking-tight">Candidates</span>
      </Link>
    </nav>
  );
}
