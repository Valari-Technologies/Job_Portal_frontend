import { Video, Phone, MapPin, UserCheck, CheckCircle2, ClipboardCheck } from 'lucide-react';

export default function RecruiterInterviewCard({ interview, onClickDetails, isPastSession }) {
  const candidate = interview?.candidate || {};
  const job = interview?.job || {};
  const scheduledBy = interview?.scheduled_by || {};

  const interviewType = interview?.interview_type || 'ONLINE';
  const meetingLink = interview?.meeting_link;
  const location = interview?.location;
  const phoneNumber = interview?.phone_number;

  const isPast = Boolean(isPastSession || interview?.isPast || interview?.status === 'COMPLETED');
  const result = interview?.result || 'PENDING';

  const getActionControl = () => {
    if (isPast) {
      return (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold min-h-[38px] select-none">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Meeting Ended</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClickDetails(interview);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors min-h-[38px] cursor-pointer"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>{result !== 'PENDING' ? `Decision: ${result}` : 'Evaluate Candidate'}</span>
          </button>
        </div>
      );
    }

    if (interviewType === 'ONLINE' && meetingLink) {
      return (
        <a
          href={meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors min-h-[40px]"
        >
          <Video className="h-4 w-4" />
          <span>Join Interview</span>
        </a>
      );
    }
    if (interviewType === 'PHONE' && phoneNumber) {
      return (
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold min-h-[40px]">
          <Phone className="h-4 w-4" />
          <span>{phoneNumber}</span>
        </div>
      );
    }
    if (interviewType === 'IN_PERSON' && location) {
      return (
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold min-h-[40px]">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      );
    }
    return (
      <span className="text-xs font-semibold text-slate-500 italic">Details unavailable</span>
    );
  };

  return (
    <div 
      onClick={() => onClickDetails(interview)}
      className={`rounded-2xl border p-5 shadow-xs transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isPast 
          ? 'bg-white/90 border-slate-200 hover:border-slate-300' 
          : 'bg-white border-slate-150 hover:border-indigo-200'
      }`}
    >
      {/* Left: Time & Date Block */}
      <div className="sm:w-36 border-b sm:border-b-0 sm:border-r border-slate-150 pb-3 sm:pb-0 sm:pr-4">
        <span className={`text-lg font-bold block ${isPast ? 'text-slate-700' : 'text-indigo-700'}`}>
          {interview.scheduled_time || '10:00 AM'}
        </span>
        {interview.scheduled_date && (
          <span className="text-xs font-bold text-slate-500 block mt-0.5">
            {interview.scheduled_date}
          </span>
        )}
        {interview.duration && (
          <span className="text-xs font-semibold text-slate-400 block mt-0.5">{interview.duration}</span>
        )}
      </div>

      {/* Center: Candidate & Job Details */}
      <div className="flex-1 space-y-1">
        <h3 className={`text-base font-bold ${isPast ? 'text-slate-800' : 'text-slate-900'}`}>
          {candidate.full_name || 'Candidate Name'}
        </h3>
        <p className="text-sm font-semibold text-slate-600">{job.title || 'Role Title'}</p>
        
        <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-slate-500">
          <UserCheck className="h-4 w-4 text-slate-400" />
          <span>Interviewer: {scheduledBy.full_name || 'You'}</span>
        </div>
      </div>

      {/* Right: Badge & Action */}
      <div className="flex flex-col items-end gap-2.5 shrink-0">
        <div className="flex items-center gap-1.5">
          {isPast && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold">
              Completed
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-bold uppercase tracking-wider">
            {interviewType.replace('_', ' ')}
          </span>
        </div>
        {getActionControl()}
      </div>
    </div>
  );
}
