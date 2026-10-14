export default function AnalyticsMetricGrid({ metrics = {} }) {
  const cards = [
    {
      key: 'active_jobs',
      label: metrics?.active_jobs?.label || 'Active jobs',
      value: metrics?.active_jobs?.value ?? 0,
      change: metrics?.active_jobs?.change || '+14.2%',
      subtitle: metrics?.active_jobs?.subtitle || 'Live listings on portal',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      iconBg: 'bg-teal-50 text-teal-600 border-teal-150',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      key: 'applications',
      label: metrics?.applications?.label || 'Applications',
      value: metrics?.applications?.value ?? 0,
      change: metrics?.applications?.change || '+18.6%',
      subtitle: metrics?.applications?.subtitle || 'Submitted across roles',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      iconBg: 'bg-blue-50 text-blue-600 border-blue-150',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      key: 'verified_employers',
      label: metrics?.verified_employers?.label || 'Verified employers',
      value: metrics?.verified_employers?.value ?? 0,
      change: metrics?.verified_employers?.change || '+8.4%',
      subtitle: metrics?.verified_employers?.subtitle || 'Trust-approved companies',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-150',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      key: 'candidate_registrations',
      label: metrics?.candidate_registrations?.label || 'Candidate registrations',
      value: metrics?.candidate_registrations?.value ?? 0,
      change: metrics?.candidate_registrations?.change || '+22.1%',
      subtitle: metrics?.candidate_registrations?.subtitle || 'Active talent seekers',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-150',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div 
          key={c.key} 
          className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs hover:shadow-md transition-all space-y-3.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {c.label}
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${c.iconBg} group-hover:scale-105 transition-transform`}>
              {c.icon}
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {c.value.toLocaleString()}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold border ${c.badgeColor}`}>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {c.change}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-2.5">
            <p className="text-xs font-bold text-slate-450 truncate">
              {c.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
