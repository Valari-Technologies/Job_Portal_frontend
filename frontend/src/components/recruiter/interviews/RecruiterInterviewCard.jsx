import { Video, Phone, MapPin, UserCheck } from 'lucide-react';

export default function RecruiterInterviewCard({ interview, onClickDetails }) {
  const candidate = interview?.candidate || {};
  const job = interview?.job || {};
  const scheduledBy = interview?.scheduled_by || {};

  const interviewType = interview?.interview_type || 'ONLINE';
  const meetingLink = interview?.meeting_link;
  const location = interview?.location;
  const phoneNumber = interview?.phone_number;

  const getActionControl = () => {
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
      className="bg-white rounded-2xl border border-slate-150 p-5 shadow-xs hover:border-indigo-200 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      {/* Left: Time Block */}
      <div className="sm:w-32 border-b sm:border-b-0 sm:border-r border-slate-150 pb-3 sm:pb-0 sm:pr-4">
        <span className="text-lg font-bold text-indigo-700 block">{interview.scheduled_time || '10:00 AM'}</span>
        {interview.duration && (
          <span className="text-xs font-semibold text-slate-600 block mt-0.5">{interview.duration}</span>
        )}
      </div>

      {/* Center: Candidate & Job Details */}
      <div className="flex-1 space-y-1">
        <h3 className="text-base font-bold text-slate-900">{candidate.full_name || 'Candidate Name'}</h3>
        <p className="text-sm font-semibold text-slate-700">{job.title || 'Role Title'}</p>
        
        <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-slate-600">
          <UserCheck className="h-4 w-4 text-slate-500" />
          <span>Interviewer: {scheduledBy.full_name || 'You'}</span>
        </div>
      </div>

      {/* Right: Badge & Action */}
      <div className="flex flex-col items-end gap-2.5 shrink-0">
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-bold uppercase tracking-wider">
          {interviewType.replace('_', ' ')}
        </span>
        {getActionControl()}
      </div>
    </div>
  );
}
