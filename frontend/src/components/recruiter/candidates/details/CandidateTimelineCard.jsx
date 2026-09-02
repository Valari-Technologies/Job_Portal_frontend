import { History } from 'lucide-react';
import ApplicationStatusBadge from '../../applications/ApplicationStatusBadge';

export default function CandidateTimelineCard({ history = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <History className="h-4 w-4 text-indigo-600" />
        <h3 className="text-base font-black text-slate-900">Application Timeline</h3>
      </div>

      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-150 text-xs font-semibold">
              <div>
                <p className="font-bold text-slate-800">{item.job_title || 'Application Status'}</p>
                <span className="text-slate-450 text-[11px]">{item.timestamp}</span>
              </div>
              <ApplicationStatusBadge status={item.status} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs font-medium text-slate-450 italic py-2">No previous application history.</p>
      )}
    </div>
  );
}
