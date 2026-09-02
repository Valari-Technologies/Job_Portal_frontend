import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CandidateDetailsHeader({ candidateName, currentTitle, currentStage, onUpdateStatus }) {
  const navigate = useNavigate();

  const isShortlisted = currentStage === 'SHORTLISTED' || currentStage === 'Shortlisted';
  const isRejected = currentStage === 'REJECTED' || currentStage === 'Rejected';
  const isInterview = currentStage === 'INTERVIEW' || currentStage === 'Interview';
  const isSelected = currentStage === 'SELECTED' || currentStage === 'Selected';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-150 pb-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/recruiter/candidates')}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">
            {candidateName || 'Candidate Profile'}
          </h1>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">
            {currentTitle || 'Applicant'} • <span className="text-indigo-600 font-black">Current Stage: {currentStage || 'Applied'}</span>
          </p>
        </div>
      </div>

      {/* Contextual Action Buttons (Do NOT show Shortlist if already Shortlisted!) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {!isRejected && (
          <button
            type="button"
            onClick={() => onUpdateStatus('REJECTED')}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            Reject
          </button>
        )}

        {!isInterview && !isSelected && !isRejected && (
          <button
            type="button"
            onClick={() => onUpdateStatus('INTERVIEW')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule Interview</span>
          </button>
        )}

        {!isShortlisted && !isInterview && !isSelected && !isRejected && (
          <button
            type="button"
            onClick={() => onUpdateStatus('SHORTLISTED')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
          >
            Shortlist
          </button>
        )}
      </div>
    </div>
  );
}
