import { Briefcase } from 'lucide-react';

export default function RecruiterJobsEmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-12 flex flex-col items-center justify-center text-center shadow-xs">
      <div className="h-16 w-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
        <Briefcase className="h-8 w-8" />
      </div>
      <h3 className="text-base font-black text-slate-805">No jobs posted yet</h3>
      <p className="text-xs font-medium text-slate-450 mt-1 max-w-sm">
        Jobs created for your company will appear here.
      </p>
    </div>
  );
}
