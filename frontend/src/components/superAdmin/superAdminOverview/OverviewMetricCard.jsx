export default function OverviewMetricCard({ title, value, pctChange, icon, color = 'teal' }) {
  const isPositive = pctChange.startsWith('+');
  
  // Icon colors mapping
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
    }
  };

  const selectedColor = colorMap[color] || colorMap.teal;

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs transition-all duration-200 hover:shadow-md hover:border-slate-200/60">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-sm font-black text-slate-600 uppercase tracking-wider">{title}</span>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">
            {value ? value.toLocaleString() : '0'}
          </h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${selectedColor.bg} ${selectedColor.text} border ${selectedColor.border}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        <span className={`flex items-center text-sm font-extrabold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
          {isPositive ? (
            <svg className="mr-0.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="mr-0.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {pctChange}
        </span>
        <span className="text-sm font-bold text-slate-500">this month</span>
      </div>
    </div>
  );
}
