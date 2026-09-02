import { Search, ChevronDown } from 'lucide-react';

export default function RecruiterJobsFilters({ searchQuery, setSearchQuery, selectedStatus, setSelectedStatus }) {
  const statusOptions = [
    { value: 'All Statuses', label: 'All Statuses' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Pending Review', label: 'Pending Review' },
    { value: 'Published', label: 'Published' },
    { value: 'Active', label: 'Active' },
    { value: 'Closed', label: 'Closed' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Suspended', label: 'Suspended' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs by ID or Title..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 min-h-[44px]"
        />
      </div>

      {/* Status Filter Dropdown */}
      <div className="relative shrink-0">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="appearance-none bg-white border border-slate-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 min-h-[44px] cursor-pointer"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
