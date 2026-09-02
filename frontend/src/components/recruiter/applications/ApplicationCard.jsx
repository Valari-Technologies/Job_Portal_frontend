import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import ApplicationStatusBadge from './ApplicationStatusBadge';

export default function ApplicationCard({ application, onViewDetails, onUpdateStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const candidate = application?.candidate || {};
  const job = application?.job || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-xs hover:border-indigo-200 transition-colors relative flex flex-col justify-between">
      
      {/* Top Row: Candidate Header & Three-dot menu */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {candidate.profile_photo ? (
            <img 
              src={candidate.profile_photo} 
              alt={candidate.full_name} 
              className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0" 
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs shrink-0">
              {candidate.initials || candidate.full_name?.charAt(0) || 'C'}
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">{candidate.full_name || 'Candidate Name'}</h3>
            <span className="text-xs font-semibold text-slate-500 mt-0.5 block">
              Applied {application.applied_time || 'recently'}
            </span>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="More application options"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 text-xs font-bold text-slate-700">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onViewDetails(application); }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
              >
                View Application
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onUpdateStatus(application.id, 'VIEWED'); }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
              >
                Mark as Under Review
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onUpdateStatus(application.id, 'SHORTLISTED'); }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
              >
                Shortlist Candidate
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onUpdateStatus(application.id, 'REJECTED'); }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-red-50 hover:text-red-600 text-red-600 cursor-pointer"
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
        <span className="text-xs font-bold uppercase text-slate-600 tracking-wider block">APPLIED ROLE</span>
        <p className="text-base font-bold text-slate-900 leading-snug">{job.title || 'Role Position'}</p>
      </div>

      {/* Footer: Status Badge & View Action */}
      <div className="flex items-center justify-between pt-2">
        <ApplicationStatusBadge status={application.status} />
        
        <button
          type="button"
          onClick={() => onViewDetails(application)}
          className="text-sm font-bold text-indigo-600 hover:underline cursor-pointer"
        >
          View Profile
        </button>
      </div>

    </div>
  );
}
