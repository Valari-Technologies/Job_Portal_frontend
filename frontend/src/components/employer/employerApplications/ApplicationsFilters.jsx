import { Search } from 'lucide-react';
import CustomDropdown from '../../shared/CustomDropdown';

export default function ApplicationsFilters({
  searchQuery,
  setSearchQuery,
  jobFilter,
  setJobFilter,
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
}) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-4.5 shadow-2xs space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search candidate or job */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search candidate or job..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
          />
        </div>

        {/* Job dropdown selection */}
        <CustomDropdown
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          options={[{ value: 'all', label: 'All jobs' }]}
        />

        {/* Status dropdown selection */}
        <CustomDropdown
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'new', label: 'New' },
            { value: 'shortlisted', label: 'Shortlisted' },
            { value: 'interview', label: 'Interview' },
            { value: 'selected', label: 'Selected' },
            { value: 'rejected', label: 'Rejected' }
          ]}
        />

        {/* Location dropdown selection */}
        <CustomDropdown
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          options={[{ value: 'all', label: 'All locations' }]}
        />
      </div>
    </div>
  );
}
