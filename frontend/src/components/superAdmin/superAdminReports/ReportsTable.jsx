import React from 'react';

export default function ReportsTable({ 
  reports = [], 
  selectedReport, 
  onSelectReport,
  isLoading
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="rounded-full px-2.5 py-0.5 text-xs font-bold border border-amber-200 bg-amber-50 text-amber-700">Pending Review</span>;
      case 'REVIEWED':
        return <span className="rounded-full px-2.5 py-0.5 text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700">Action Taken</span>;
      case 'REJECTED':
        return <span className="rounded-full px-2.5 py-0.5 text-xs font-bold border border-slate-200 bg-slate-100 text-slate-600">Dismissed</span>;
      default:
        return <span className="rounded-full px-2.5 py-0.5 text-xs font-bold border border-slate-200 bg-slate-50 text-slate-600">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-150 p-8 shadow-2xs space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Report ID</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Reported Job</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">No job reports found</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        Reported job posts will appear here when users submit a report for a published job.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((r) => {
                const isSelected = selectedReport?.id === r.id;
                return (
                  <tr 
                    key={r.id} 
                    onClick={() => onSelectReport && onSelectReport(r)}
                    className={`cursor-pointer transition-colors border-b border-slate-100 last:border-b-0 ${
                      isSelected ? 'bg-teal-50/40 border-l-4 border-l-teal-600' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="px-6 py-4 font-extrabold text-slate-850">#{r.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">
                      {r.reason_display || r.reason}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-800">
                      <div className="font-bold">{r.job_title || `Job #${r.job_id || r.job}`}</div>
                      <div className="text-[11px] text-slate-400">ID: #{r.job_id || r.job}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {r.company_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectReport) onSelectReport(r);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-extrabold text-slate-700 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
