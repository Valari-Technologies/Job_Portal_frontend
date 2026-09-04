import { useLocation, Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Home, 
  FileCode, 
  User 
} from 'lucide-react';

export default function CandidateBottomNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isDashboardActive = currentPath === '/candidate/dashboard' || currentPath === '/candidate/overview';

  return (
    <nav 
      aria-label="Candidate mobile bottom navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-lg font-sans pb-safe select-none"
    >
      <div className="grid grid-cols-5 items-end justify-items-center w-full px-2 py-1.5 min-h-[56px] relative">
        
        {/* 1. Jobs Link */}
        <Link
          to="/candidate/jobs"
          aria-current={currentPath === '/candidate/jobs' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 w-full min-h-[44px] rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer ${
            currentPath === '/candidate/jobs'
              ? 'text-[#3B00FF]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="h-5 w-5 stroke-[2]" />
          <span>Jobs</span>
        </Link>

        {/* 2. Applications Link */}
        <Link
          to="/candidate/applications"
          aria-current={currentPath === '/candidate/applications' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 w-full min-h-[44px] rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer ${
            currentPath === '/candidate/applications'
              ? 'text-[#3B00FF]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="h-5 w-5 stroke-[2]" />
          <span>Application</span>
        </Link>

        {/* 3. Raised Center Electric Purple Home Circle (Matches Image 1) */}
        <Link
          to="/candidate/dashboard"
          aria-label="Home"
          aria-current={isDashboardActive ? 'page' : undefined}
          className="relative -mt-6 flex flex-col items-center justify-center cursor-pointer z-50 group focus:outline-none"
        >
          <div className={`h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-[#3B00FF] border-4 border-white shadow-md shadow-[#3B00FF]/30 flex items-center justify-center shrink-0 transition-transform duration-150 group-active:scale-95 ${
            isDashboardActive ? 'ring-4 ring-[#3B00FF]/25 scale-105' : 'hover:bg-[#3000E0]'
          }`}>
            <Home className="h-6 w-6 text-white stroke-[2.5] fill-white" />
          </div>
        </Link>

        {/* 4. Resume Link */}
        <Link
          to="/candidate/resume"
          aria-current={currentPath === '/candidate/resume' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 w-full min-h-[44px] rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer ${
            currentPath === '/candidate/resume'
              ? 'text-[#3B00FF]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCode className="h-5 w-5 stroke-[2]" />
          <span>Resume</span>
        </Link>

        {/* 5. Profile Link */}
        <Link
          to="/candidate/profile"
          aria-current={currentPath === '/candidate/profile' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 py-1 w-full min-h-[44px] rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer ${
            currentPath === '/candidate/profile'
              ? 'text-[#3B00FF]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="h-5 w-5 stroke-[2]" />
          <span>Profile</span>
        </Link>

      </div>
    </nav>
  );
}

