import { AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScheduleWarning({ scheduleWarning, setScheduleWarning }) {
  if (!scheduleWarning) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4.5 flex items-start justify-between gap-3 animate-fadeIn">
      <div className="flex gap-3">
        <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-slate-900">No candidates are ready for an interview</h4>
          <p className="text-xs font-bold text-slate-600 leading-normal">
            Shortlist an application first, then schedule an interview.
          </p>
          <div className="pt-2">
            <Link 
              to="/employer/applications" 
              className="inline-block rounded-lg bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 transition-colors"
            >
              View applications
            </Link>
          </div>
        </div>
      </div>
      <button 
        onClick={() => setScheduleWarning(false)} 
        className="p-1 text-slate-400 hover:text-slate-600 shrink-0" 
        aria-label="Dismiss warning alert"
      >
        <X className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}
