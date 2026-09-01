export default function ApplicationsStats() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-1">
        <span className="text-xs font-black text-slate-400 uppercase block leading-none">New applications</span>
        <span className="text-2xl md:text-3xl font-black text-slate-800 block">0</span>
      </div>
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-1">
        <span className="text-xs font-black text-slate-400 uppercase block leading-none">Shortlisted</span>
        <span className="text-2xl md:text-3xl font-black text-slate-800 block">0</span>
      </div>
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-1">
        <span className="text-xs font-black text-slate-400 uppercase block leading-none">Interview stage</span>
        <span className="text-2xl md:text-3xl font-black text-slate-800 block">0</span>
      </div>
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-1">
        <span className="text-xs font-black text-slate-400 uppercase block leading-none">Selected</span>
        <span className="text-2xl md:text-3xl font-black text-slate-800 block">0</span>
      </div>
    </div>
  );
}
