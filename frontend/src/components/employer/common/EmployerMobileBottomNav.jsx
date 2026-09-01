import { Link } from 'react-router-dom';
import { Briefcase, FileText, User } from 'lucide-react';

export default function EmployerMobileBottomNav({ activeTab }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-45" aria-label="Mobile Navigation">
      <Link to="/employer/overview" className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-605'}`}>
        <Briefcase className="h-5 w-5" />
        <span className={`text-[11px] ${activeTab === 'overview' ? 'font-extrabold' : 'font-bold'}`}>Overview</span>
      </Link>
      <Link to="/employer/jobs" className={`flex flex-col items-center gap-1 ${activeTab === 'jobs' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-605'}`}>
        <Briefcase className="h-5 w-5" />
        <span className={`text-[11px] ${activeTab === 'jobs' ? 'font-extrabold' : 'font-bold'}`}>Jobs</span>
      </Link>
      <Link to="/employer/applications" className={`flex flex-col items-center gap-1 ${activeTab === 'applications' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-605'}`}>
        <FileText className="h-5 w-5" />
        <span className={`text-[11px] ${activeTab === 'applications' ? 'font-extrabold' : 'font-bold'}`}>Applications</span>
      </Link>
      <Link to="/employer/company-profile" className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-650'}`}>
        <User className="h-5 w-5" />
        <span className={`text-[11px] ${activeTab === 'profile' ? 'font-extrabold' : 'font-bold'}`}>Profile</span>
      </Link>
    </nav>
  );
}
