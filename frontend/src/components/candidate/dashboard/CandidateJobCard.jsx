import { useState } from 'react';
import { Bookmark, Zap, CheckCircle2 } from 'lucide-react';
import { toggleSavedJob, quickApplyJob } from '../../../services/candidate/candidateDashboardService';

export default function CandidateJobCard({ job, onStatusChange }) {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isApplied, setIsApplied] = useState(job.isApplied || false);
  const [isApplying, setIsApplying] = useState(false);

  const handleToggleBookmark = async (e) => {
    e.stopPropagation();
    const prev = isSaved;
    setIsSaved(!prev); // Optimistic update
    try {
      const res = await toggleSavedJob(job.id);
      setIsSaved(res.isSaved);
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error('Failed to toggle saved job:', err);
      setIsSaved(prev); // Rollback
    }
  };

  const handleQuickApply = async (e) => {
    e.stopPropagation();
    if (isApplied || isApplying) return;

    setIsApplying(true);
    try {
      const res = await quickApplyJob(job.id, {
        title: job.title,
        company: job.company
      });
      if (res.success) {
        setIsApplied(true);
        if (onStatusChange) onStatusChange();
      }
    } catch (err) {
      console.error('Failed to quick apply:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Competitive';
    const curr = job.currency || '$';
    const period = job.salaryPeriod || '/ year';
    if (curr === '₹' && job.salaryPeriod === 'LPA') {
      const minLpa = (job.salaryMin / 100000).toFixed(0);
      const maxLpa = (job.salaryMax / 100000).toFixed(0);
      return `₹${minLpa} – ${maxLpa} LPA`;
    }
    const minK = Math.round(job.salaryMin / 1000);
    const maxK = Math.round(job.salaryMax / 1000);
    return `${curr}${minK}k - ${curr}${maxK}k ${period}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-[#3B00FF]/40 flex flex-col justify-between select-none font-sans relative group">
      
      {/* Top Header: Company Avatar & Badges */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-center text-[#3B00FF] font-black text-lg shrink-0 overflow-hidden shadow-2xs">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover rounded-xl" />
          ) : (
            <span>{job.companyInitials || (job.company ? job.company.charAt(0) : 'J')}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {job.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-black uppercase tracking-wider">
              New
            </span>
          )}

          {job.isMatch && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black flex items-center gap-1">
              <Zap className="h-3 w-3 fill-emerald-600 text-emerald-600" />
              <span>Match</span>
            </span>
          )}

          {/* Bookmark Action */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-label={isSaved ? 'Remove saved job' : 'Save job'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                : 'border-slate-200 text-slate-400 hover:text-[#3B00FF] hover:border-[#3B00FF]'
            }`}
          >
            <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-[#3B00FF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-1.5 flex-1 mb-5">
        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-[#3B00FF] transition-colors">
          {job.title}
        </h3>
        
        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 flex-wrap">
          <span>{job.company}</span>
          <span>•</span>
          <span>{job.location}</span>
        </p>

        <p className="text-xs font-extrabold text-slate-700 pt-1">
          {formatSalary()}
        </p>

        {/* Tags if available */}
        {(job.workMode || job.employmentType) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {job.workMode && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-extrabold">
                {job.workMode}
              </span>
            )}
            {job.employmentType && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-extrabold">
                {job.employmentType}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Quick Apply Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleQuickApply}
          disabled={isApplied || isApplying}
          className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-xs min-h-[42px] ${
            isApplied
              ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
              : 'bg-[#3B00FF] hover:bg-[#3000E0] text-white cursor-pointer active:scale-98 shadow-[#3B00FF]/20'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Applied</span>
            </>
          ) : (
            <span>{isApplying ? 'Submitting...' : 'Quick Apply'}</span>
          )}
        </button>
      </div>

    </div>
  );
}
