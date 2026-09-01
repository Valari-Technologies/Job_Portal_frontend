import { Briefcase, Clock, FileText, XCircle } from 'lucide-react';

export default function JobsStats() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-50 text-teal-600 shrink-0">
          <Briefcase className="h-5.5 w-5.5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xs font-black text-slate-400 uppercase block leading-none">Active jobs</span>
          <span className="text-xl md:text-2xl font-black text-slate-800 block">0</span>
        </div>
      </div>
      
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
          <Clock className="h-5.5 w-5.5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xs font-black text-slate-400 uppercase block leading-none">Pending review</span>
          <span className="text-xl md:text-2xl font-black text-slate-800 block">0</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <FileText className="h-5.5 w-5.5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xs font-black text-slate-400 uppercase block leading-none">Drafts</span>
          <span className="text-xl md:text-2xl font-black text-slate-800 block">0</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 shrink-0">
          <XCircle className="h-5.5 w-5.5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xs font-black text-slate-400 uppercase block leading-none">Closed</span>
          <span className="text-xl md:text-2xl font-black text-slate-800 block">0</span>
        </div>
      </div>
    </div>
  );
}
