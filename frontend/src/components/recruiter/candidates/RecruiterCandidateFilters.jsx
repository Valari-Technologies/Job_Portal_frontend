import { X } from 'lucide-react';

export default function RecruiterCandidateFilters({ 
  isOpen, 
  onClose, 
  filterState, 
  setFilterState, 
  jobs = [], 
  statuses = [] 
}) {
  if (!isOpen) return null;

  const handleReset = () => {
    setFilterState({
      jobId: 'ALL',
      status: 'ALL',
      minExp: '',
      maxExp: '',
      location: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto font-sans">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-150 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-black text-slate-900">Filter Candidates</h2>
            <p className="text-xs font-bold text-slate-450 mt-0.5">Filter by job role, status, experience, or location</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Applied Job / Role */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Applied Role / Job</label>
            <select
              value={filterState.jobId}
              onChange={(e) => setFilterState(prev => ({ ...prev, jobId: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            >
              <option value="ALL">All Roles</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          {/* Application Status */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Application Status</label>
            <select
              value={filterState.status}
              onChange={(e) => setFilterState(prev => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map((st) => (
                st.value !== 'ALL' && <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Experience Range */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Experience Range (Years)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                placeholder="Min Yrs"
                value={filterState.minExp}
                onChange={(e) => setFilterState(prev => ({ ...prev, minExp: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
              />
              <input
                type="number"
                min="0"
                placeholder="Max Yrs"
                value={filterState.maxExp}
                onChange={(e) => setFilterState(prev => ({ ...prev, maxExp: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Location</label>
            <input
              type="text"
              placeholder="e.g. Chennai, Remote"
              value={filterState.location}
              onChange={(e) => setFilterState(prev => ({ ...prev, location: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 min-h-[44px]"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-150 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
}
