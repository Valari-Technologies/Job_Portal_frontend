import { useState } from 'react';
import { Calendar, Eye, MapPin, Briefcase, DollarSign, Building2, X } from 'lucide-react';

export default function RecruiterJobCard({ job }) {
  const [showModal, setShowModal] = useState(false);

  const getStatusStyle = (status, deadline) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isDeadlinePassed = Boolean(deadline && String(deadline).split('T')[0] < todayStr);

    if (status === 'EXPIRED' || status === 'Expired' || isDeadlinePassed) {
      return { badge: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Expired' };
    }

    switch (status) {
      case 'Active':
      case 'Published':
      case 'PUBLISHED':
        return { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Published' };
      case 'PENDING_REVIEW':
      case 'Pending Review':
        return { badge: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Pending Review' };
      case 'REJECTED':
      case 'Rejected':
        return { badge: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Rejected' };
      default:
        return { badge: 'bg-amber-50 text-amber-800 border-amber-200', label: job.status || 'Draft' };
    }
  };

  const statusInfo = getStatusStyle(job.status, job.deadline || job.application_deadline);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-3.5 shadow-xs hover:border-indigo-200 transition-colors border-l-4 border-l-indigo-600">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.badge}`}>
              {statusInfo.label}
            </span>
            {job.category && (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {job.category}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View Details</span>
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{job.title}</h3>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{job.location || 'Munnar, Kerala'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Posted: {job.posted_date || job.createdAt || '-'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Deadline: {job.deadline || '-'}</span>
          </div>
        </div>
      </div>

      {/* View Job Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col p-6 sm:p-8 shadow-2xl border border-slate-150 relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 pr-8">
              <div className="space-y-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.badge}`}>
                  {statusInfo.label}
                </span>
                <h2 className="text-2xl font-black text-indigo-950 tracking-tight">{job.title}</h2>
                <p className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{job.company_name || job.employer_name || 'MSD Tech'}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1 text-xs">
              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="text-slate-400 font-bold block">Category</span>
                  <span className="font-bold text-slate-800">{job.category || job.category_info?.name || 'Engineering'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="text-slate-400 font-bold block">Work Mode</span>
                  <span className="font-bold text-slate-800">{job.workMode || job.work_mode_info?.name || 'On-site'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="text-slate-400 font-bold block">Experience</span>
                  <span className="font-bold text-slate-800">
                    {job.minExperience || job.experience_min || '0'} - {job.maxExperience || job.experience_max || '3'} Yrs
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="text-slate-400 font-bold block">Salary Range</span>
                  <span className="font-bold text-slate-800">
                    {job.minSalary || job.salary_min ? `₹${Number(job.minSalary || job.salary_min).toLocaleString()} - ₹${Number(job.maxSalary || job.salary_max).toLocaleString()}` : '₹35,000 - ₹50,000'}
                  </span>
                </div>
              </div>

              {/* Location & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 font-bold block">Location</span>
                    <span className="font-bold text-slate-800">{job.location || 'Tambaram, Chennai, Tamil Nadu'}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 font-bold block">Application Deadline</span>
                    <span className="font-bold text-slate-800">{job.deadline || job.application_deadline || '2026-10-31'}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {Array.isArray(job.skills) && job.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((sk, idx) => {
                      const skillName = typeof sk === 'string' ? sk : (sk.name || sk.title || String(sk));
                      if (!skillName) return null;
                      return (
                        <span key={idx} className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold">
                          {skillName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              {job.description && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Description</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-150 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              )}

              {/* Key Responsibilities */}
              {(job.responsibilities || job.requirements) && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Responsibilities</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-150 whitespace-pre-line">
                    {job.responsibilities || job.requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
