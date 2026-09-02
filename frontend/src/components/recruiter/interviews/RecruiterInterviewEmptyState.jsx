import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';

export default function RecruiterInterviewEmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-12 flex flex-col items-center justify-center text-center shadow-xs space-y-4">
      <div className="h-16 w-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
        <Calendar className="h-8 w-8" />
      </div>
      <div>
        <h3 className="text-base font-black text-slate-805">No interviews scheduled</h3>
        <p className="text-xs font-medium text-slate-450 mt-1 max-w-sm">
          Schedule an interview after shortlisting an eligible candidate application.
        </p>
      </div>

      <Link
        to="/recruiter/interviews/schedule"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Schedule Interview</span>
      </Link>
    </div>
  );
}
