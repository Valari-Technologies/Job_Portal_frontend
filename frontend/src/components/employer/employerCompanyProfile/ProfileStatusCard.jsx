import { Building2 } from 'lucide-react';

export default function ProfileStatusCard({ profilePercent }) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 shrink-0">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <span className="rounded-full px-2.5 py-1 text-xs font-bold border border-amber-200 bg-amber-50 text-amber-700 inline-block font-sans">
              Profile incomplete
            </span>
            <h3 className="text-lg font-extrabold text-slate-850">Your Company Profile</h3>
            <p className="text-xs font-bold text-slate-450 leading-relaxed font-sans">
              Enter your company details to apply for recruiter verification status.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 shrink-0 font-sans">
          <div className="space-y-2 w-full md:w-48">
            <div className="flex items-center justify-between text-xs font-black text-slate-500">
              <span>Profile setup progress</span>
              <span>{profilePercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${profilePercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
