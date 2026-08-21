export default function ReportDetailsPanel({ selectedReport }) {
  return (
    <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs">
      <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-6">Report details</h3>

      {selectedReport ? (
        <div className="space-y-5 text-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-orange-50 border border-orange-100 text-orange-600 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 leading-snug">#{selectedReport.id}</h4>
              <span className="text-xs font-bold text-slate-455 uppercase">{selectedReport.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4.5">
            <div className="space-y-1 col-span-2">
              <span className="text-xs font-black text-slate-455 uppercase block">Reason / Description</span>
              <span className="font-bold text-slate-800">{selectedReport.reason}</span>
              <p className="text-xs text-slate-500 leading-normal">{selectedReport.description || 'No description provided.'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-455 uppercase block">Reported Job ID</span>
              <span className="font-bold text-slate-800">{selectedReport.job_id}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-455 uppercase block">Submitted at</span>
              <span className="font-bold text-slate-800">{selectedReport.created_at}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center space-y-4">
          <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-extrabold text-slate-800">No report selected</h4>
            <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-normal">
              Select a reported job from the list to view its report details and linked job information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
