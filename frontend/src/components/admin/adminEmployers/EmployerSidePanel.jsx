export default function EmployerSidePanel({ 
  isOpen, 
  onClose, 
  panelType, 
  panelTitle 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide Drawer Content Container */}
      <div className="relative z-10 flex h-full w-full sm:w-[520px] flex-col bg-white shadow-3xl animate-slideRight overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-teal-50/20 to-white px-6 pt-7 pb-5 border-b border-slate-150 shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all focus:outline-none"
            aria-label="Close details"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                Employer Workspace
              </span>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-2">
                {panelTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* Content view */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
          <div className="space-y-4 max-w-sm">
            <div className="h-14 w-14 mx-auto flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-150 text-slate-405">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10" />
              </svg>
            </div>
            
            {panelType === 'SIGNAL_PENDING' && (
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-800">No employer verifications pending</h4>
                <p className="text-sm font-bold text-slate-500">
                  New submissions waiting for verification will appear here once employers register on the platform.
                </p>
              </div>
            )}

            {panelType === 'SIGNAL_JOBS' && (
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-800">No jobs are waiting for approval</h4>
                <p className="text-sm font-bold text-slate-500">
                  Moderation queue jobs pending administrator review will appear here.
                </p>
              </div>
            )}

            {panelType === 'SIGNAL_TRUSTED' && (
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-800">No trusted employers yet</h4>
                <p className="text-sm font-bold text-slate-500">
                  Progressive trust level criteria configurations will be finalized in subsequent design revisions.
                </p>
              </div>
            )}

            {panelType === 'TRUST_INFO' && (
              <div className="space-y-2 text-left">
                <h4 className="text-base font-extrabold text-slate-800 text-center mb-2">Progressive Trust Model Overview</h4>
                <p className="text-sm font-bold text-slate-650 leading-relaxed">
                  Employer trust is built dynamically over time. The platform assigns trust levels based on documents verification status, compliance logs, historical review passes, and applicant activity.
                </p>
                <div className="rounded-xl border border-slate-150 p-4.5 bg-slate-50/50 space-y-2 mt-4 text-xs font-semibold text-slate-600">
                  <p className="font-extrabold text-slate-850">Future Trust progression levels:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong className="text-slate-805">New:</strong> Requires manual job reviews before publishing.</li>
                    <li><strong className="text-slate-805">Building trust:</strong> Higher verification pass rate; lower random audits.</li>
                    <li><strong className="text-slate-805">Trusted employer:</strong> Allowed direct publishing with post-publish verification checks.</li>
                  </ul>
                </div>
              </div>
            )}

            {panelType === 'EMPTY_PROFILE' && (
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-800">Profile preview disabled</h4>
                <p className="text-sm font-bold text-slate-500">
                  Please select an active employer from the management table to preview details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
