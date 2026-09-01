import { Search, ChevronDown } from 'lucide-react';

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
            className="w-full border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Job dropdown selection */}
        <div className="relative">
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
          >
            <option value="all">All jobs</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <ChevronDown className="h-4.5 w-4.5" />
          </span>
        </div>

        {/* Status dropdown selection */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <ChevronDown className="h-4.5 w-4.5" />
          </span>
        </div>

        {/* Location dropdown selection */}
        <div className="relative">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
          >
            <option value="all">All locations</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <ChevronDown className="h-4.5 w-4.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
