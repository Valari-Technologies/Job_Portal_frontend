export default function OverviewMetricCard({ title, value, pctChange, icon, color = 'teal' }) {
  const isPositive = !String(pctChange ?? '').startsWith('-');
  
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
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
    </div>
  );
}
