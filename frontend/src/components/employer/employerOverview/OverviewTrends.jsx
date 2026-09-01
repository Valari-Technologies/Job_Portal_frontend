import { Briefcase } from 'lucide-react';

export default function OverviewTrends() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Chart placeholder card */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs flex flex-col justify-between">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-6">Applications received</h3>
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">No application trends yet</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1 leading-normal">
              A chart tracking job applications will appear here once candidates apply to your job vacancy.
            </p>
          </div>
        </div>
      </div>

      {/* Action items list */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4">Required action</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">All caught up</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              There are no pending actions or candidate notifications requiring your attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
