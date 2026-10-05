import { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';
import { getJobFilterOptions, getDepartmentsForIndustry } from '../../../services/candidate/candidateJobsService';

export default function CandidateJobsDesktopFilters({
  filters,
  onFilterChange,
  onResetFilters
}) {
  const [options, setOptions] = useState({
    industries: [],
    locations: [],
    experienceRanges: [],
    jobTypes: [],
    workModes: []
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadOptions() {
      const data = await getJobFilterOptions();
      if (isMounted) {
        setOptions(data);
      }
    }
    loadOptions();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadDepartments() {
      if (filters.industryId) {
        const specs = await getDepartmentsForIndustry(filters.industryId);
        if (isMounted) setDepartments(specs);
      } else {
        if (isMounted) setDepartments([]);
      }
    }
    loadDepartments();
    return () => { isMounted = false; };
  }, [filters.industryId]);

  const hasActiveFilters = Boolean(
    filters.industryId ||
    filters.departmentId ||
    filters.location ||
    filters.experience ||
    filters.jobType ||
    filters.workMode
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs font-sans space-y-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800">
          <SlidersHorizontal className="h-4.5 w-4.5 text-[#3B00FF]" />
          <span className="text-sm font-black tracking-tight">Filters</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-black text-[#3B00FF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Filter Dropdown Pills Row */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* 1. Industry */}
        <div className="relative inline-block">
          <select
            value={filters.industryId || ''}
            onChange={(e) => {
              onFilterChange('industryId', e.target.value);
              onFilterChange('departmentId', ''); // Reset department on industry change
            }}
            className={`appearance-none pl-4 pr-9 py-2 rounded-full text-xs font-black border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B00FF]/20 max-w-full truncate ${
              filters.industryId
                ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <option value="">Industry / Category</option>
            {(options?.industries || options?.categories || []).map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* 2. Department / Specialization */}
        <div className="relative inline-block max-w-full">
          <select
            value={filters.departmentId || ''}
            disabled={!filters.industryId}
            onChange={(e) => onFilterChange('departmentId', e.target.value)}
            className={`appearance-none pl-4 pr-9 py-2 rounded-full text-xs font-black border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B00FF]/20 max-w-full truncate ${
              !filters.industryId ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400' :
              filters.departmentId
                ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <option value="">Department</option>
            {(departments || []).map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* 3. Location */}
        <div className="relative inline-block max-w-full">
          <select
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className={`appearance-none pl-4 pr-9 py-2 rounded-full text-xs font-black border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B00FF]/20 max-w-full truncate ${
              filters.location
                ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <option value="">Location</option>
            {(options?.locations || []).map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* 4. Experience */}
        <div className="relative inline-block max-w-full">
          <select
            value={filters.experience || ''}
            onChange={(e) => onFilterChange('experience', e.target.value)}
            className={`appearance-none pl-4 pr-9 py-2 rounded-full text-xs font-black border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B00FF]/20 max-w-full truncate ${
              filters.experience
                ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <option value="">Experience</option>
            {(options?.experienceRanges || []).map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* 5. Job Type */}
        <div className="relative inline-block max-w-full">
          <select
            value={filters.jobType || ''}
            onChange={(e) => onFilterChange('jobType', e.target.value)}
            className={`appearance-none pl-4 pr-9 py-2 rounded-full text-xs font-black border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B00FF]/20 max-w-full truncate ${
              filters.jobType
                ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <option value="">Job Type</option>
            {(options?.jobTypes || []).map((jt) => (
              <option key={jt.id} value={jt.id}>
                {jt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* 6. Work Mode */}
        <div className="relative inline-block max-w-full">
          <select
            value={filters.workMode || ''}
            onChange={(e) => onFilterChange('workMode', e.target.value)}
            className={`appearance-none pl-4 pr-9 py-2 rounded-full text-xs font-black border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B00FF]/20 max-w-full truncate ${
              filters.workMode
                ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <option value="">Work Mode</option>
            {(options?.workModes || []).map((wm) => (
              <option key={wm.id} value={wm.id}>
                {wm.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
