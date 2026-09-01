export default function AnalyticsMetricGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Active Jobs */}
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
        <span className="text-xs font-black text-slate-455 uppercase block">Active jobs</span>
        <span className="text-2xl font-black text-slate-800 mt-2 block">0</span>
      </div>

      {/* Applications */}
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
        <span className="text-xs font-black text-slate-455 uppercase block">Applications</span>
        <span className="text-2xl font-black text-slate-800 mt-2 block">0</span>
      </div>

      {/* Verified Employers */}
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
        <span className="text-xs font-black text-slate-455 uppercase block">Verified employers</span>
        <span className="text-2xl font-black text-slate-800 mt-2 block">0</span>
      </div>

      {/* Candidate Registrations */}
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
        <span className="text-xs font-black text-slate-455 uppercase block">Candidate registrations</span>
        <span className="text-2xl font-black text-slate-800 mt-2 block">0</span>
      </div>
    </div>
  );
}
