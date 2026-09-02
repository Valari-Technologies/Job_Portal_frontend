import { SlidersHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecruiterInterviewsHeader({ onToggleFilters, activeFiltersCount = 0 }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 pb-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Interviews Schedule</h1>
        <p className="text-sm font-bold text-slate-450 mt-1">Manage and join your upcoming candidate interviews.</p>
      </div>

      {/* Right Side Actions: Filters & + Schedule (NO Post New Job button!) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleFilters}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors min-h-[44px] cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <span className="h-5 w-5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/recruiter/interviews/schedule')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors min-h-[44px] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule</span>
        </button>
      </div>
    </div>
  );
}
