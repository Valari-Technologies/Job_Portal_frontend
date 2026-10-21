import { Download } from 'lucide-react';
import CustomDropdown from '../../shared/CustomDropdown';

export default function ApplicationFilters({ 
  selectedStatus, 
  setSelectedStatus, 
  selectedJobId, 
  setSelectedJobId, 
  statuses = [], 
  jobs = [] 
}) {
  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    ...statuses.filter(st => st.value !== 'ALL').map(st => ({ value: st.value, label: st.label }))
  ];

  const jobOptions = [
    { value: 'ALL', label: 'All Roles' },
    ...jobs.filter(j => (j.id || j.value) !== 'ALL').map(job => ({
      value: String(job.id || job.value),
      label: job.title || job.label || String(job.id || job.value)
    }))
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Left: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <CustomDropdown
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          options={statusOptions}
          className="min-w-[150px]"
        />

        {/* Role/Job Filter */}
        <CustomDropdown
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          options={jobOptions}
          className="min-w-[160px]"
        />
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
