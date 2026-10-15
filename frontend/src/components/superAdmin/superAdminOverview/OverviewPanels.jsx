// Status color badges mapping
const getBadgeStyles = (status) => {
  const mapping = {
    // Employer verification status
    PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    
    // Job status
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    PENDING_REVIEW: 'bg-amber-50 text-amber-700 border-amber-100',
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    CLOSED: 'bg-red-50 text-red-700 border-red-100',
    EXPIRED: 'bg-rose-50 text-rose-700 border-rose-100',
    
    // Reports status
    OPEN: 'bg-rose-50 text-rose-700 border-rose-100',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-100',

    // Default fallbacks
    LOW_QUALITY: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    PENDING_VERIFICATION: 'bg-amber-50 text-amber-700 border-amber-100',
    REPORTED: 'bg-rose-50 text-rose-700 border-rose-100'
  };
  return mapping[status] || 'bg-slate-50 text-slate-600 border-slate-100';
};

/**
 * QueueDrawer component - slides out from the right showing all mock rows in that particular queue
 */
export function QueueDrawer({ isOpen, onClose, title, items, onViewRecord }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Drawer Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      {/* Sliding Body */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5">
          <div>
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Moderate and view incoming request submissions</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items && items.length > 0 ? (
            items.map((item, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-slate-100 bg-white p-4 transition-all hover:shadow-md hover:border-slate-200/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
                    {item.date && (
                      <span className="text-[10px] text-slate-400 block mt-2">Submitted: {item.date}</span>
                    )}
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase shrink-0 ${getBadgeStyles(item.badge)}`}>
                    {item.badge.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => onViewRecord({ type: item.badge, title: item.title, details: item.details })}
                    className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-colors"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <p className="text-sm text-slate-400 font-medium">No actions pending in this queue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * RecordDetailsDrawer component - slides out to show detailed fields for a specific database row
 */
export function RecordDetailsDrawer({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      {/* Sliding Panel */}
      <div className="relative z-20 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Entity Details</span>
            <h3 className="text-base font-bold text-slate-800 mt-0.5">{record.title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Detailed fields depending on record type */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            {Object.entries(record.details || {}).map(([key, val]) => {
              if (val === null || typeof val === 'object') return null;
              return (
                <div key={key} className="border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key.replace('_', ' ')}</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Approve/Reject or Close Actions inside Details Drawer */}
        <div className="border-t border-slate-100 p-6 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => {
              alert('Action processed successfully');
              onClose();
            }}
            className="flex-1 rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors"
          >
            Approve / Resolve
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ActionRequiredCard - renders lists of queues with view queue counts
 */
export function ActionRequiredCard({ queues, onOpenQueue }) {
  const items = [
    {
      key: 'employerVerifications',
      title: 'Employer verifications',
      subtitle: 'Awaiting admin review',
      count: queues.employerVerifications?.count || 0,
      icon: (
        <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bg: 'bg-orange-50',
      border: 'border-orange-100'
    },
    {
      key: 'jobsPendingReview',
      title: 'Jobs pending review',
      subtitle: 'Awaiting admin review',
      count: queues.jobsPendingReview?.count || 0,
      icon: (
        <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      ),
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    {
      key: 'reportedJobs',
      title: 'Reported jobs',
      subtitle: 'Flagged by users',
      count: queues.reportedJobs?.count || 0,
      icon: (
        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      bg: 'bg-red-50',
      border: 'border-red-100'
    },
    {
      key: 'lowQualityProfiles',
      title: 'Low-quality profiles',
      subtitle: 'Below profile quality threshold',
      count: queues.lowQualityProfiles?.count || 0,
      icon: (
        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Action required</h3>
      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3.5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border shrink-0 ${item.bg} ${item.border}`}>
                {item.icon}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-800 leading-snug">{item.title}</h4>
                <span className="text-sm font-bold text-slate-500 mt-1 block">{item.subtitle}</span>
              </div>
            </div>
            <div className="flex items-center gap-4.5">
              <span className="text-base font-extrabold text-slate-800">{item.count}</span>
              <button 
                onClick={() => onOpenQueue(item.key, item.title)}
                className="flex items-center gap-1.5 text-base font-bold text-teal-600 hover:text-teal-700 hover:underline"
              >
                <span>View queue</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * JobActivityCard - mini status graphs for jobs
 */
export function JobActivityCard({ jobActivity, onViewJobReview }) {
  const getPercentage = (value) => {
    if (!jobActivity.total) return '0%';
    return `${((value / jobActivity.total) * 100).toFixed(0)}%`;
  };

  const statusRows = [
    { label: 'Live', count: jobActivity.live, color: 'bg-teal-600' },
    { label: 'Pending review', count: jobActivity.pendingReview, color: 'bg-amber-500' },
    { label: 'Draft', count: jobActivity.draft, color: 'bg-slate-300' },
    { label: 'Closed', count: jobActivity.closed, color: 'bg-slate-400' }
  ];

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Job activity</h3>
          <button 
            onClick={onViewJobReview}
            className="text-base font-bold text-teal-600 hover:text-teal-700 hover:underline"
          >
            View job review
          </button>
        </div>
        <div className="space-y-4.5">
          {statusRows.map((row, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-650">{row.label}</span>
                <span className="text-slate-800">{row.count?.toLocaleString()}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${row.color} transition-all duration-500`}
                  style={{ width: getPercentage(row.count) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4.5 mt-6 flex items-center justify-between text-base font-extrabold text-slate-800">
        <span>Total jobs</span>
        <span>{jobActivity.total?.toLocaleString()}</span>
      </div>
    </div>
  );
}

/**
 * TopHiringDistrictsCard - Percentage shares by region (with custom View All districts popover)
 */
export function TopHiringDistrictsCard({ districts, onViewAllDistricts }) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Top hiring districts</h3>
          <button 
            onClick={onViewAllDistricts}
            className="text-base font-bold text-teal-600 hover:text-teal-700 hover:underline"
          >
            View all
          </button>
        </div>
        <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2.5 mb-3.5">
          <span>District</span>
          <div className="flex items-center gap-12">
            <span>Live jobs</span>
            <span className="w-16 text-right">Share</span>
          </div>
        </div>
        <div className="space-y-4">
          {districts.length > 0 ? (
            districts.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm font-semibold">
                <span className="text-slate-850 font-bold">{d.district}</span>
                <div className="flex items-center gap-6">
                  <span className="text-slate-900 font-extrabold">{(d.count ?? 0).toLocaleString()}</span>
                  <div className="flex items-center gap-2.5 w-28">
                    <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-teal-600 rounded-full" 
                        style={{ width: d.share || '0%' }}
                      />
                    </div>
                    <span className="text-xs font-extrabold text-slate-500 w-8 text-right">{d.share || '0%'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 font-medium py-6 text-center">No district data available.</p>
          )}
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4.5 mt-6 flex items-center justify-between text-base font-extrabold text-slate-800">
        <span>Total live jobs</span>
        <span>{districts.reduce((acc, curr) => acc + (curr.count || 0), 0).toLocaleString()}</span>
      </div>
    </div>
  );
}

/**
 * RecentActivityCard - list of activities triggering Details Drawer when clicked
 */
export function RecentActivityCard({ activities, onOpenRecord }) {
  // Activity icon picker
  const getActivityIcon = (type = '') => {
    const t = String(type).toUpperCase();
    if (t.includes('REPORT') || t.includes('FAIL') || t.includes('REJECT')) {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-700 border border-red-150 shrink-0">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    }
    if (t.includes('VERIF') || t.includes('PENDING')) {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-700 border border-orange-150 shrink-0">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10" />
          </svg>
        </div>
      );
    }
    if (t.includes('JOB') || t.includes('APPROV') || t.includes('CREATE')) {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-150 shrink-0">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
    if (t.includes('LOGIN') || t.includes('USER') || t.includes('PROFILE')) {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 border border-blue-150 shrink-0">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700 border border-teal-150 shrink-0">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Recent activity</h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live stream</span>
      </div>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((act) => (
            <div 
              key={act.id} 
              onClick={() => onOpenRecord({ type: act.type, title: act.message, details: act.details })}
              className="flex items-center justify-between py-2 hover:bg-slate-50/50 cursor-pointer rounded-xl p-2.5 transition-colors border border-transparent hover:border-slate-150"
            >
              <div className="flex items-center gap-3.5">
                {getActivityIcon(act.type)}
                <div>
                  <p className="text-base font-extrabold text-slate-800 leading-snug">{act.message}</p>
                  <span className="text-sm font-bold text-slate-450 mt-1.5 block">{act.time}</span>
                </div>
              </div>
              <svg className="h-4.5 w-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400 font-medium py-6 text-center">No recent activity recorded.</p>
        )}
      </div>
    </div>
  );
}
