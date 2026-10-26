import { useState } from 'react';
import { Bookmark, Zap, CheckCircle2, MapPin, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CandidateJobCard({ job, onToggleSave, onQuickApply }) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onToggleSave(job.id);
    } finally {
      setIsSaving(false);
    }
  };

  const isApplied = Boolean(job.hasApplied || job.isApplied);

  const handleApplyClick = async (e) => {
    e.stopPropagation();
    if (isApplied || job.isExpired || isApplying) return;
    setIsApplying(true);
    try {
      await onQuickApply(job);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/candidate/jobs/${job.id}`);
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax && (!job.salary || job.salary === 'Salary not disclosed')) {
      return 'Salary not disclosed';
    }
    if (job.salary && job.salary !== 'Salary not disclosed') {
      return job.salary;
    }
    const minVal = job.salaryMin;
    const maxVal = job.salaryMax;
    const periodStr = job.salaryPeriod ? `/${job.salaryPeriod}` : '';

    if (minVal && maxVal) {
      if (minVal >= 100000) {
        const minLpa = (minVal / 100000).toLocaleString('en-IN');
        const maxLpa = (maxVal / 100000).toLocaleString('en-IN');
        return `₹${minLpa}L - ₹${maxLpa}L${periodStr}`;
      }
      return `₹${Number(minVal).toLocaleString('en-IN')} - ₹${Number(maxVal).toLocaleString('en-IN')}${periodStr}`;
    } else if (minVal) {
      if (minVal >= 100000) {
        return `₹${(minVal / 100000).toLocaleString('en-IN')}L${periodStr}`;
      }
      return `₹${Number(minVal).toLocaleString('en-IN')}${periodStr}`;
    }
    return 'Salary not disclosed';
  };

  return (
    <div 
      onClick={handleDetailsClick}
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-[#3B00FF]/40 flex flex-col justify-between font-sans relative group cursor-pointer"
    >
      {/* --- DESKTOP VIEW (Visible on sm: and up) --- */}
      <div className="hidden sm:flex flex-col justify-between h-full space-y-4">
        {/* Top Header: Logo + Title + Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="h-12 w-12 rounded-full bg-white border border-black flex items-center justify-center text-slate-900 font-black text-lg shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover rounded-full" />
              ) : (
                <span>{job.companyInitials || (job.company ? job.company.charAt(0).toUpperCase() : 'J')}</span>
              )}
            </div>

            <div className="space-y-0.5 min-w-0 flex-1">
              <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-[#3B00FF] transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-xs font-bold text-slate-500 truncate">
                {job.company}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
            aria-label={job.isSaved ? "Remove saved job" : "Save job"}
            className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              job.isSaved
                ? 'bg-indigo-50 border-[#3B00FF] text-[#3B00FF]'
                : 'border-slate-200 text-slate-400 hover:text-[#3B00FF] hover:border-[#3B00FF]'
            }`}
          >
            <Bookmark className={`h-4.5 w-4.5 ${job.isSaved ? 'fill-[#3B00FF]' : ''}`} />
          </button>
        </div>

        {/* Location & Salary Info */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-extrabold text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{job.location}</span>
            {job.isLocationMatch && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                In your location
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Banknote className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatSalary()}</span>
          </div>
        </div>

        {/* Chips Row */}
        <div className="flex flex-wrap items-center gap-2">
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
          {job.skills && job.skills.slice(0, 2).map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50/60 text-[#3B00FF] text-[10px] font-extrabold">
              {skill}
            </span>
          ))}
        </div>

        <div className="border-t border-slate-150 pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleDetailsClick}
            className="flex-1 py-2.5 rounded-xl border border-[#3B00FF] text-[#3B00FF] hover:bg-indigo-50 text-xs font-extrabold transition-colors cursor-pointer text-center"
          >
            Details
          </button>

          <button
            type="button"
            onClick={handleApplyClick}
            disabled={isApplied || job.isExpired || job.status === 'PENDING_REVIEW' || isApplying}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              isApplied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default select-none'
                : job.status === 'PENDING_REVIEW'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 cursor-not-allowed select-none'
                : job.isExpired
                ? 'bg-slate-100 text-slate-500 border border-slate-300 cursor-not-allowed select-none'
                : 'bg-[#3B00FF] hover:bg-[#3000E0] text-white cursor-pointer active:scale-98 shadow-[#3B00FF]/20'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Applied</span>
              </>
            ) : job.status === 'PENDING_REVIEW' ? (
              <span>Under Review</span>
            ) : job.isExpired ? (
              <span>Deadline Passed</span>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 fill-white text-white" />
                <span>{isApplying ? 'Applying...' : 'Quick Apply'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE VIEW (Visible below sm:) Matches Mobile Reference Image 2 --- */}
      <div className="flex sm:hidden flex-col space-y-3">
        {/* Top Header: Logo + Title/Company + Save Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="h-11 w-11 rounded-full bg-white border border-black flex items-center justify-center text-slate-900 font-black text-base shrink-0 overflow-hidden shadow-2xs">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover rounded-full" />
              ) : (
                <span>{job.companyInitials || (job.company ? job.company.charAt(0) : 'J')}</span>
              )}
            </div>

            <div className="space-y-0.5 min-w-0 flex-1">
              <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-[#3B00FF] transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-xs font-bold text-slate-400 truncate">
                {job.company}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
            aria-label={job.isSaved ? "Remove saved job" : "Save job"}
            className="p-1.5 text-slate-400 hover:text-[#3B00FF] cursor-pointer shrink-0"
          >
            <Bookmark className={`h-5 w-5 ${job.isSaved ? 'fill-[#3B00FF] text-[#3B00FF]' : ''}`} />
          </button>
        </div>

        {/* Location & Salary */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-500">
            <span>{job.location}</span>
            {job.isLocationMatch && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black border border-emerald-200">
                In your location
              </span>
            )}
          </div>
          <p className="font-black text-slate-900 text-sm">
            {formatSalary()}
          </p>
        </div>

        {/* Chips & Quick Apply Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {job.workMode && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-black">
                {job.workMode}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-black">
              {job.experienceMin ? `${job.experienceMin}–${job.experienceMax || job.experienceMin + 2} Yrs` : '3–5 Yrs'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleApplyClick}
            disabled={isApplied || job.isExpired || job.status === 'PENDING_REVIEW' || isApplying}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs ${
              isApplied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default select-none'
                : job.status === 'PENDING_REVIEW'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 cursor-not-allowed select-none'
                : job.isExpired
                ? 'bg-slate-100 text-slate-500 border border-slate-300 cursor-not-allowed select-none'
                : 'bg-[#3B00FF] hover:bg-[#3000E0] text-white cursor-pointer active:scale-98 shadow-[#3B00FF]/20'
            }`}
          >
            {isApplied ? 'Applied' : job.status === 'PENDING_REVIEW' ? 'Under Review' : job.isExpired ? 'Deadline Passed' : isApplying ? 'Applying...' : 'Quick Apply'}
          </button>
        </div>
      </div>

    </div>
  );
}
