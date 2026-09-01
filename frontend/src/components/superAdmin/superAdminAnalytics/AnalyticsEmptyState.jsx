export default function AnalyticsEmptyState() {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-12 text-center shadow-2xs max-w-3xl mx-auto my-12 animate-fadeIn">
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-6">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-slate-800">Analytics will appear here</h3>
        <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
          Insights will be available after candidates, employers, jobs, and applications begin using the platform.
        </p>
        <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto pt-2">
          Platform data will be calculated from registrations, jobs, applications, verifications, reports, categories, and locations.
        </p>
      </div>
    </div>
  );
}
