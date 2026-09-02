import { SlidersHorizontal } from 'lucide-react';

export default function RecruiterCandidatesHeader({ onToggleFilters, activeFiltersCount = 0 }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 pb-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Candidates</h1>
        <p className="text-sm font-bold text-slate-450 mt-1">View candidates who applied to your company's jobs.</p>
      </div>

      {/* Right Side Action: Filters only (NO Add Candidate button!) */}
      <button
        type="button"
        onClick={onToggleFilters}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 min-h-[44px] cursor-pointer"
      >
        <SlidersHorizontal className="h-4 w-4 text-slate-500" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="h-5 w-5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
    </div>
  );
}
