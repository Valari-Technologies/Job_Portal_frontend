import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function CandidateJobsSearch({ 
  searchQuery, 
  onSearchChange, 
  onOpenFilterSheet,
  activeFilterCount = 0
}) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full font-sans">
      <div className="flex items-center gap-2.5 sm:gap-0">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search jobs, skills, companies..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-9 py-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-[#3B00FF] focus:outline-none focus:ring-4 focus:ring-[#3B00FF]/10 shadow-2xs transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile-only Filter Drawer Button with clear separation */}
        <button
          type="button"
          onClick={onOpenFilterSheet}
          aria-label="Open filter menu"
          className="sm:hidden shrink-0 h-[46px] w-[46px] rounded-2xl bg-[#3B00FF] hover:bg-[#3000E0] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 relative"
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
