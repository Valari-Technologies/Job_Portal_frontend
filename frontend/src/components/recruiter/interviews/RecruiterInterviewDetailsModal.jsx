import { useState } from 'react';
import { X, Calendar, Clock, Video, MapPin, Phone } from 'lucide-react';

export default function RecruiterInterviewDetailsModal({ interview, onClose, onUpdateStatus }) {
  const [resultNote, setResultNote] = useState(interview?.notes || '');
  const [selectedResult, setSelectedResult] = useState(interview?.result || 'PENDING');

  if (!interview) return null;

  const candidate = interview.candidate || {};
  const job = interview.job || {};

  const handleSaveResult = (e) => {
    e.preventDefault();
    onUpdateStatus(interview.id, 'COMPLETED', selectedResult, resultNote);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden font-sans border border-slate-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Interview Record</span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">{candidate.full_name || 'Candidate Interview'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Applied Role */}
          <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100 space-y-1">
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">Position Role</span>
            <h3 className="text-sm font-black text-slate-900">{job.title || 'Role Title'}</h3>
          </div>

          {/* Schedule Info */}
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>{interview.scheduled_date || 'Date'}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>{interview.scheduled_time || 'Time'}</span>
            </div>
          </div>

          {/* Connection Info */}
          {interview.interview_type === 'ONLINE' && interview.meeting_link && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-2.5 text-xs font-semibold">
              <Video className="h-4 w-4 text-indigo-600 shrink-0" />
              <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">
                {interview.meeting_link}
              </a>
            </div>
          )}
          {interview.interview_type === 'IN_PERSON' && interview.location && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{interview.location}</span>
            </div>
          )}
          {interview.interview_type === 'PHONE' && interview.phone_number && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <Phone className="h-4 w-4 text-teal-600 shrink-0" />
              <span>{interview.phone_number}</span>
            </div>
          )}

          {/* Record Result & Notes Form */}
          <form onSubmit={handleSaveResult} className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Record Result & Notes</h4>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Result Decision</label>
              <select
                value={selectedResult}
                onChange={(e) => setSelectedResult(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="PENDING">Pending Decision</option>
                <option value="SELECTED">Selected (Passed Interview)</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Internal Recruiter Notes</label>
              <textarea
                rows={3}
                value={resultNote}
                onChange={(e) => setResultNote(e.target.value)}
                placeholder="Enter feedback notes..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => onUpdateStatus(interview.id, 'CANCELLED', 'REJECTED', 'Cancelled')}
                className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                Cancel Interview
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
              >
                Save Feedback
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
