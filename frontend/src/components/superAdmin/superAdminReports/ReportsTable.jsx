import React from 'react';

export default function ReportsTable({ 
  reports = [], 
  selectedReport, 
  onSelectReport,
  onOpenInspectModal,
  isLoading
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black border border-amber-200 bg-amber-50 text-amber-700 whitespace-nowrap shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending Review</span>
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black border border-emerald-200 bg-emerald-50 text-emerald-700 whitespace-nowrap shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Action Taken</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black border border-slate-200 bg-slate-100 text-slate-600 whitespace-nowrap shadow-2xs">
            <span>Dismissed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold border border-slate-200 bg-slate-50 text-slate-600 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-150 p-6 shadow-2xs space-y-3">
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
            <tr className="border-b border-slate-150 bg-slate-50/80 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3.5 w-20 whitespace-nowrap">Report ID</th>
              <th className="px-4 py-3.5 min-w-[140px]">Reason</th>
              <th className="px-4 py-3.5 min-w-[160px]">Reported Job</th>
              <th className="px-4 py-3.5 min-w-[110px] whitespace-nowrap">Company</th>
              <th className="px-4 py-3.5 w-32 whitespace-nowrap">Status</th>
              <th className="px-4 py-3.5 w-28 whitespace-nowrap">Submitted</th>
              <th className="px-4 py-3.5 w-24 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-800">No job reports found</h3>
                      <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto leading-normal">
                        Reported job posts will appear here dynamically when candidates report a job posting.
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
                    onClick={() => {
                      if (onSelectReport) onSelectReport(r);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-teal-50/50 border-l-4 border-l-teal-600' 
                        : 'hover:bg-slate-50/70 border-l-4 border-l-transparent'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-black text-slate-900 text-xs whitespace-nowrap">
                      #{r.id}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-bold text-slate-800">
                      <span className="line-clamp-2">
                        {r.reason_display || r.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-800">
                      <div className="font-extrabold text-slate-900 leading-snug">
                        {r.job_title || `Job #${r.job_id || r.job}`}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                        ID: #{r.job_id || r.job}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
                      {r.company_name || 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 font-semibold whitespace-nowrap">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenInspectModal) {
                            onOpenInspectModal(r);
                          } else if (onSelectReport) {
                            onSelectReport(r);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-teal-200 bg-white hover:bg-teal-50 text-xs font-black text-teal-800 shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer hover:border-teal-300"
                      >
                        <span>Details</span>
                        <svg className="h-3.5 w-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
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
