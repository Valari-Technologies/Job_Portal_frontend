import { ChevronDown, Download } from 'lucide-react';

export default function ApplicationFilters({ 
  selectedStatus, 
  setSelectedStatus, 
  selectedJobId, 
  setSelectedJobId, 
  statuses = [], 
  jobs = [] 
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Left: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="relative min-w-[140px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 min-h-[44px] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((st) => (
              st.value !== 'ALL' && <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Role/Job Filter */}
        <div className="relative min-w-[140px]">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 min-h-[44px] cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            {jobs.filter(j => (j.id || j.value) !== 'ALL').map((job) => {
              const val = String(job.id || job.value);
              const label = job.title || job.label || val;
              return (
                <option key={val} value={val}>{label}</option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Right: Export Button */}
      <button
        type="button"
        disabled
        title="Export endpoint available once Django backend integration is configured."
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-400 opacity-60 cursor-not-allowed min-h-[44px] self-end sm:self-auto"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>
    </div>
  );
}
