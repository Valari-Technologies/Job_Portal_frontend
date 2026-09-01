import { ChevronDown } from 'lucide-react';

export default function InterviewsFilters({
  activeSubTab,
  setActiveSubTab,
}) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-4.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex border border-slate-200 rounded-xl p-1 bg-slate-50/50 shrink-0">
        <button 
          onClick={() => setActiveSubTab('today')}
          className={`rounded-lg px-4 py-2 text-xs font-extrabold transition-all ${
            activeSubTab === 'today' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-450 hover:text-slate-700'
          }`}
        >
          Today
        </button>
        <button 
          onClick={() => setActiveSubTab('week')}
          className={`rounded-lg px-4 py-2 text-xs font-extrabold transition-all ${
            activeSubTab === 'week' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-450 hover:text-slate-700'
          }`}
        >
          This week
        </button>
        <button 
          onClick={() => setActiveSubTab('upcoming')}
          className={`rounded-lg px-4 py-2 text-xs font-extrabold transition-all ${
            activeSubTab === 'upcoming' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-450 hover:text-slate-700'
          }`}
        >
          Upcoming
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select 
            disabled 
            className="border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-400 bg-slate-50 cursor-not-allowed appearance-none pr-8"
          >
            <option>All status</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
