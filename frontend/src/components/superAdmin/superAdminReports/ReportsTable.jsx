export default function ReportsTable({ 
  reports = [], 
  selectedReport, 
  onSelectReport 
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Report ID</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Reported job</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Report type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">No job reports yet</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        Reported job posts will appear here when users submit a report for a published job.
                      </p>
                      <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
                        Reports are reviewed by Admin before moderation actions are taken.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr 
                  key={r.id} 
                  onClick={() => onSelectReport && onSelectReport(r)}
                  className={`cursor-pointer hover:bg-slate-50/50 ${selectedReport?.id === r.id ? 'bg-teal-50/20' : ''}`}
                >
                  <td className="px-6 py-4 font-bold text-slate-850">#{r.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{r.reason}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{r.job_id}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">N/A</td>
                  <td className="px-6 py-4 text-sm text-slate-500">Job</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold border border-slate-200 bg-slate-50 text-slate-600">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{r.created_at}</td>
                  <td className="px-6 py-4 text-right">...</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
