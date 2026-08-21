export default function LocationInsights() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Data Quality Card */}
      <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-3.5">
        <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Data quality</h3>
        <p className="text-sm font-bold text-slate-500 leading-normal">
          Data quality checks will appear after location records are configured.
        </p>
      </div>

      {/* Location Coverage Card */}
      <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-3.5">
        <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Location coverage</h3>
        <p className="text-sm font-bold text-slate-500 leading-normal">
          Coverage metrics will appear after the location hierarchy is configured.
        </p>
      </div>
    </div>
  );
}
