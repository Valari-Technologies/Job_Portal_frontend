import {
  AlertCircle,
} from 'lucide-react';

export default function OverviewStats({ profilePercent }) {
  return (
    <>
      {/* Verification profile completion widget */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-600 shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">Complete your employer profile</h3>
            <p className="text-sm font-bold text-slate-555 leading-relaxed">
              Add your company details and request admin verification to post jobs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 shrink-0">
          <div className="space-y-2 w-full md:w-48">
            <div className="flex items-center justify-between text-xs font-black text-slate-500">
              <span>Profile status</span>
              <span>{profilePercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${profilePercent}%` }} />
            </div>
          </div>
          <span className="rounded-full px-2.5 py-1 text-xs font-bold border border-amber-200 bg-amber-50 text-amber-700 shrink-0">
            Profile incomplete
          </span>
        </div>
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-1">
          <span className="text-xs font-black text-slate-455 uppercase block">Active jobs</span>
          <span className="text-2xl md:text-3xl font-black text-slate-800 block">0</span>
        </div>
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-1">
          <span className="text-xs font-black text-slate-455 uppercase block">Applications to review</span>
          <span className="text-2xl md:text-3xl font-black text-slate-800 block">0</span>
        </div>
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-1">
          <span className="text-xs font-black text-slate-455 uppercase block">Shortlisted</span>
          <span className="text-2xl md:text-3xl font-black text-slate-800 block">0</span>
        </div>
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-1">
          <span className="text-xs font-black text-slate-455 uppercase block">Interviews this week</span>
          <span className="text-2xl md:text-3xl font-black text-slate-800 block">0</span>
        </div>
      </div>
    </>
  );
}
