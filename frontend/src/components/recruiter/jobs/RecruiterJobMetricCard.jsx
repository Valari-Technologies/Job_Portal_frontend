export default function RecruiterJobMetricCard({ title, value, icon: Icon, accentBorderClass, iconBgClass, iconColorClass }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-150 p-4.5 flex items-center justify-between shadow-xs ${accentBorderClass || 'border-l-4 border-indigo-600'}`}>
      <div className="space-y-1">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">{title}</span>
        <span className="text-2xl font-black text-slate-900 block">
          {value !== null && value !== undefined ? value : 0}
        </span>
      </div>
      {Icon && (
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconBgClass || 'bg-indigo-50'}`}>
          <Icon className={`h-5 w-5 ${iconColorClass || 'text-indigo-600'}`} />
        </div>
      )}
    </div>
  );
}
