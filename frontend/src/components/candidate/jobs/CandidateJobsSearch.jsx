import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function CandidateJobsSearch({ 
  searchQuery, 
  onSearchChange, 
  onOpenFilterSheet,
  activeFilterCount = 0
}) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full font-sans">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search jobs, skills, companies..."
          className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-14 py-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-[#3B00FF] focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/10 shadow-2xs transition-all"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
            className="absolute right-12 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenFilterSheet}
          aria-label="Open filter menu"
          className="absolute right-2 h-9 w-9 rounded-xl bg-[#3B00FF] hover:bg-[#3000E0] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 relative"
        >
          <SlidersHorizontal className="h-4.5 w-4.5 stroke-[2.5]" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
