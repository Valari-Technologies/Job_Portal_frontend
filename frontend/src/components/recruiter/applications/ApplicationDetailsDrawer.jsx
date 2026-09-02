import { useState } from 'react';
import { X, FileText, Download, Briefcase, Calendar } from 'lucide-react';
import ApplicationStatusBadge from './ApplicationStatusBadge';

export default function ApplicationDetailsDrawer({ application, onClose, onUpdateStatus }) {
  const [internalNote, setInternalNote] = useState('');
  const [notesList, setNotesList] = useState([]);

  if (!application) return null;

  const candidate = application.candidate || {};
  const job = application.job || {};

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    setNotesList(prev => [...prev, { text: internalNote.trim(), date: new Date().toLocaleString() }]);
    setInternalNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto font-sans">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-150 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Application Details</span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">{candidate.full_name || 'Candidate Details'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Candidate Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
            {candidate.profile_photo ? (
              <img 
                src={candidate.profile_photo} 
                alt={candidate.full_name} 
                className="h-14 w-14 rounded-full object-cover border border-slate-300 shrink-0" 
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center border border-indigo-300 shrink-0">
                {candidate.initials || candidate.full_name?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <h3 className="text-base font-black text-slate-900">{candidate.full_name || 'Candidate Name'}</h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">{candidate.location || 'Location Not Specified'}</p>
              {candidate.profile_completion && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                  {candidate.profile_completion}% Profile Complete
                </span>
              )}
            </div>
          </div>

          {/* Application & Job Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Applied Position</h4>
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-600" />
                  {job.title || 'Role Title'}
                </span>
                <ApplicationStatusBadge status={application.status} />
              </div>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Applied: {application.applied_time || 'Recently'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Change Status</h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onUpdateStatus(application.id, 'VIEWED')}
                className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                Under Review
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(application.id, 'SHORTLISTED')}
                className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                Shortlist
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(application.id, 'INTERVIEW')}
                className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                Schedule Interview
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(application.id, 'REJECTED')}
                className="px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>

          {/* Resume Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Resume</h4>
            {application.resume_url ? (
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">{application.resume_filename || 'Candidate_Resume.pdf'}</span>
                </div>
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-xs font-medium text-slate-500">
                  No resume was required for this application.
                </p>
              </div>
            )}
          </div>

          {/* Internal Notes Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Internal Recruiter Notes</h4>
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea 
                rows={2}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add private recruiter note..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Add Note
              </button>
            </form>

            {notesList.length > 0 && (
              <div className="space-y-2 pt-2 divide-y divide-slate-100">
                {notesList.map((n, i) => (
                  <div key={i} className="pt-2 text-xs font-medium text-slate-700">
                    <p>{n.text}</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{n.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
