import { useState } from 'react';
import { MoreVertical, MapPin, Phone, Mail, FileText, Briefcase } from 'lucide-react';
import ApplicationStatusBadge from './ApplicationStatusBadge';

export default function ApplicationCard({ application, onViewDetails, onUpdateStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const candidate = application?.candidate || {};
  const job = application?.job || {};

  const skillsList = Array.isArray(candidate.skills) ? candidate.skills.slice(0, 3) : ['Python', 'React.js', 'Django'];

  return (
    <div 
      onClick={() => onViewDetails(application)}
      className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-2xs hover:border-[#3B00FF]/40 hover:shadow-md transition-all relative flex flex-col justify-between cursor-pointer group"
    >
      
      {/* Top Row: Candidate Header & Three-dot menu */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {candidate.profile_photo ? (
            <img 
              src={candidate.profile_photo} 
              alt={candidate.full_name} 
              className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0" 
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-indigo-50 text-[#3B00FF] border border-indigo-100 flex items-center justify-center font-black text-sm shrink-0">
              {candidate.initials || candidate.full_name?.charAt(0) || 'C'}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900 leading-tight truncate group-hover:text-[#3B00FF] transition-colors">
              {candidate.full_name || 'Candidate Name'}
            </h3>
            <p className="text-xs font-bold text-[#3B00FF] truncate mt-0.5">
              {candidate.headline || 'Senior Full-Stack Developer'}
            </p>
            <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">
              Applied {application.applied_time || 'recently'}
            </span>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="More application options"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs font-bold text-slate-700">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onViewDetails(application); }}
                className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 hover:text-[#3B00FF] cursor-pointer"
              >
                View Full Profile & Resume
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onUpdateStatus(application.id, 'VIEWED'); }}
                className="w-full text-left px-3.5 py-2 hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
              >
                Mark as Under Review
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onUpdateStatus(application.id, 'SHORTLISTED'); }}
                className="w-full text-left px-3.5 py-2 hover:bg-indigo-50 hover:text-[#3B00FF] cursor-pointer"
              >
                Shortlist Candidate
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onViewDetails(application); }}
                className="w-full text-left px-3.5 py-2 hover:bg-purple-50 hover:text-[#3B00FF] cursor-pointer"
              >
                Schedule Interview
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onUpdateStatus(application.id, 'SELECTED'); }}
                className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
              >
                Mark as Selected
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onUpdateStatus(application.id, 'REJECTED'); }}
                className="w-full text-left px-3.5 py-2 hover:bg-red-50 hover:text-red-600 text-red-600 cursor-pointer border-t border-slate-100"
              >
                Reject Application
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Applied Role Info */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">APPLIED ROLE</span>
          <span className="text-[10px] font-bold text-slate-500">{job.company_name || 'MSD Tech'}</span>
        </div>
        <p className="text-sm font-black text-slate-900 leading-snug">{job.title || 'SDE'}</p>
      </div>

      {/* Candidate Contact & Details Row */}
      <div className="space-y-1.5 text-xs font-semibold text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            {candidate.location || 'Chennai, Tamil Nadu'}
          </span>
          {candidate.phone && (
            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
              <Phone className="h-3 w-3 text-emerald-600" />
              {candidate.phone}
            </span>
          )}
          {candidate.email && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Mail className="h-3 w-3 text-slate-400" />
              {candidate.email}
            </span>
          )}
        </div>
      </div>

      {/* Candidate Resume Pill */}
      {application.resume_filename && (
        <div className="pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50/70 text-red-700 border border-red-100 text-xs font-bold">
            <FileText className="h-3.5 w-3.5 text-red-600" />
            <span className="truncate max-w-[200px]">{application.resume_filename}</span>
            <span className="text-[10px] text-red-500 uppercase font-black">PDF</span>
          </div>
        </div>
      )}

      {/* Skills Pills */}
      {skillsList.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skillsList.map((sk, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200/60">
              {sk}
            </span>
          ))}
          {candidate.skills && candidate.skills.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
              +{candidate.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer: Status Badge & View Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <ApplicationStatusBadge status={application.status} />
        
        <span className="text-xs font-black text-[#3B00FF] group-hover:underline flex items-center gap-1">
          View Profile &rarr;
        </span>
      </div>

    </div>
  );
}
