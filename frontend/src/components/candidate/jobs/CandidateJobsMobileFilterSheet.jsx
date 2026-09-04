import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { getJobFilterOptions, getDepartmentsForIndustry } from '../../../services/candidate/candidateJobsService';

export default function CandidateJobsMobileFilterSheet({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters
}) {
  const [localFilters, setLocalFilters] = useState(filters);
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
      if (isMounted) setOptions(data);
    }
    loadOptions();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadDepts() {
      if (localFilters.industryId) {
        const specs = await getDepartmentsForIndustry(localFilters.industryId);
        if (isMounted) setDepartments(specs);
      } else {
        if (isMounted) setDepartments([]);
      }
    }
    loadDepts();
    return () => { isMounted = false; };
  }, [localFilters.industryId]);

  if (!isOpen) return null;

  const handleChange = (key, val) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: val,
      ...(key === 'industryId' ? { departmentId: '' } : {})
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    onClearFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <div className="relative bg-white rounded-t-3xl max-h-[85vh] w-full flex flex-col z-10 shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
          <h2 className="text-base font-black text-slate-900">Filter Jobs</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Industry</label>
            <select
              value={localFilters.industryId || ''}
              onChange={(e) => handleChange('industryId', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-[#3B00FF]"
            >
              <option value="">All Industries</option>
              {options.industries.map((ind) => (
                <option key={ind.id} value={ind.id}>{ind.name}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Department</label>
            <select
              value={localFilters.departmentId || ''}
              disabled={!localFilters.industryId}
              onChange={(e) => handleChange('departmentId', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-[#3B00FF] disabled:opacity-50"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Location</label>
            <select
              value={localFilters.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-[#3B00FF]"
            >
              <option value="">All Locations</option>
              {options.locations.map((loc) => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Experience</label>
            <select
              value={localFilters.experience || ''}
              onChange={(e) => handleChange('experience', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-[#3B00FF]"
            >
              <option value="">Any Experience</option>
              {options.experienceRanges.map((exp) => (
                <option key={exp.id} value={exp.id}>{exp.label}</option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Work Mode</label>
            <select
              value={localFilters.workMode || ''}
              onChange={(e) => handleChange('workMode', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-[#3B00FF]"
            >
              <option value="">All Work Modes</option>
              {options.workModes.map((wm) => (
                <option key={wm.id} value={wm.id}>{wm.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-150 flex items-center justify-between gap-3 bg-slate-50 rounded-b-3xl">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 min-h-[44px]"
          >
            Clear All
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 rounded-xl bg-[#3B00FF] hover:bg-[#3000E0] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-[#3B00FF]/20 min-h-[44px]"
          >
            <Check className="h-4 w-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
