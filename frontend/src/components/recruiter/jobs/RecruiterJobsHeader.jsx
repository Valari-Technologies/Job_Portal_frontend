import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function RecruiterJobsHeader() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 border-b border-slate-150 pb-5">
      {/* Title & Desktop Top-Right Action */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Job Management</h1>
          <p className="text-sm font-bold text-slate-450 mt-1">Manage active postings and review pipeline metrics.</p>
        </div>

        {/* Desktop Button (1024px+) */}
        <button
          type="button"
          onClick={() => navigate('/recruiter/jobs/create')}
          aria-label="Post new job"
          className="hidden lg:inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 min-h-[44px] cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" aria-hidden="true" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Mobile Full-Width Button (< 768px) */}
      <button
        type="button"
        onClick={() => navigate('/recruiter/jobs/create')}
        aria-label="Post new job"
        className="lg:hidden w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 min-h-[44px] cursor-pointer"
      >
        <Plus className="h-4.5 w-4.5 stroke-[2.5]" aria-hidden="true" />
        <span>Post New Job</span>
      </button>
    </div>
  );
}
