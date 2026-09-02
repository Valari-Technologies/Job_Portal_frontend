import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

export default function ApplicationsEmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-12 flex flex-col items-center justify-center text-center shadow-xs space-y-4">
      <div className="h-16 w-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
        <FileText className="h-8 w-8" />
      </div>
      <div>
        <h3 className="text-base font-black text-slate-805">No applications yet</h3>
        <p className="text-xs font-medium text-slate-450 mt-1 max-w-sm">
          Applications submitted to your company's jobs will appear here.
        </p>
      </div>

      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition-colors"
      >
        <span>View Active Jobs</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
