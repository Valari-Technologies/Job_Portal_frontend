export default function RecruiterMetricCard({ title, value, icon: Icon, colorClass, iconBgClass, valueColorClass }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-5 flex flex-col justify-between shadow-xs hover:border-indigo-200 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${iconBgClass || 'bg-indigo-50'}`}>
            <Icon className={`h-5 w-5 ${colorClass || 'text-indigo-600'}`} />
          </div>
        )}
      </div>
      <div className="mt-3">
        <span className={`text-3xl font-black ${valueColorClass || 'text-slate-900'}`}>
          {value !== null && value !== undefined ? value : 0}
        </span>
      </div>
    </div>
  );
}
