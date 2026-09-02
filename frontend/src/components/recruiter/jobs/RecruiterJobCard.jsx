import { Calendar } from 'lucide-react';

export default function RecruiterJobCard({ job }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
      case 'Published':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Pending Review':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Closed':
      case 'Expired':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-3.5 shadow-xs hover:border-indigo-200 transition-colors border-l-4 border-l-indigo-600">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(job.status)}`}>
            {job.status || 'Draft'}
          </span>
          {job.reference_code && (
            <span className="text-xs font-bold text-slate-600 uppercase font-mono">{job.reference_code}</span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{job.title}</h3>

      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>Posted: {job.posted_date || '-'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>Deadline: {job.deadline || '-'}</span>
        </div>
      </div>
    </div>
  );
}
