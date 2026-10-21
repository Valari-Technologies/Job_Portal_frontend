import { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';
import { getJobFilterOptions, getDepartmentsForIndustry } from '../../../services/candidate/candidateJobsService';
import CustomDropdown from '../../shared/CustomDropdown';

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
        <CustomDropdown
          value={filters.industryId || ''}
          placeholder="Industry / Category"
          rounded="full"
          size="sm"
          buttonClassName={filters.industryId ? '!bg-indigo-50 !border-[#3B00FF] !text-[#3B00FF] font-black' : 'font-bold'}
          onChange={(e) => {
            onFilterChange('industryId', e.target.value);
            onFilterChange('departmentId', '');
          }}
          options={[
            { value: '', label: 'All Industries' },
            ...(options?.industries || options?.categories || []).map((ind) => ({ value: ind.id, label: ind.name }))
          ]}
        />

        {/* 2. Department / Specialization */}
        <CustomDropdown
          value={filters.departmentId || ''}
          placeholder="Department"
          disabled={!filters.industryId}
          rounded="full"
          size="sm"
          buttonClassName={filters.departmentId ? '!bg-indigo-50 !border-[#3B00FF] !text-[#3B00FF] font-black' : 'font-bold'}
          onChange={(e) => onFilterChange('departmentId', e.target.value)}
          options={[
            { value: '', label: 'All Departments' },
            ...(departments || []).map((dept) => ({ value: dept.id, label: dept.name }))
          ]}
        />

        {/* 3. Location */}
        <CustomDropdown
          value={filters.location || ''}
          placeholder="Location"
          rounded="full"
          size="sm"
          searchable={true}
          buttonClassName={filters.location ? '!bg-indigo-50 !border-[#3B00FF] !text-[#3B00FF] font-black' : 'font-bold'}
          onChange={(e) => onFilterChange('location', e.target.value)}
          options={[
            { value: '', label: 'All Locations' },
            ...(options?.locations || []).map((loc) => ({ value: loc.name, label: loc.name }))
          ]}
        />

        {/* 4. Experience */}
        <CustomDropdown
          value={filters.experience || ''}
          placeholder="Experience"
          rounded="full"
          size="sm"
          buttonClassName={filters.experience ? '!bg-indigo-50 !border-[#3B00FF] !text-[#3B00FF] font-black' : 'font-bold'}
          onChange={(e) => onFilterChange('experience', e.target.value)}
          options={[
            { value: '', label: 'All Experience' },
            ...(options?.experienceRanges || []).map((exp) => ({ value: exp.id, label: exp.label }))
          ]}
        />

        {/* 5. Job Type */}
        <CustomDropdown
          value={filters.jobType || ''}
          placeholder="Job Type"
          rounded="full"
          size="sm"
          buttonClassName={filters.jobType ? '!bg-indigo-50 !border-[#3B00FF] !text-[#3B00FF] font-black' : 'font-bold'}
          onChange={(e) => onFilterChange('jobType', e.target.value)}
          options={[
            { value: '', label: 'All Job Types' },
            ...(options?.jobTypes || []).map((jt) => ({ value: jt.id, label: jt.label }))
          ]}
        />

        {/* 6. Work Mode */}
        <CustomDropdown
          value={filters.workMode || ''}
          placeholder="Work Mode"
          rounded="full"
          size="sm"
          buttonClassName={filters.workMode ? '!bg-indigo-50 !border-[#3B00FF] !text-[#3B00FF] font-black' : 'font-bold'}
          onChange={(e) => onFilterChange('workMode', e.target.value)}
          options={[
            { value: '', label: 'All Work Modes' },
            ...(options?.workModes || []).map((wm) => ({ value: wm.id, label: wm.label }))
          ]}
        />
      </div>
    </div>
  );
}
