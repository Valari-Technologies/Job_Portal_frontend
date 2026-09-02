import { Users, TrendingUp, Clock } from 'lucide-react';

export default function ApplicationMetrics({ metrics }) {
  const totalActive = metrics?.total_active !== undefined ? metrics.total_active : 0;
  const conversionRate = metrics?.conversion_rate !== null && metrics?.conversion_rate !== undefined 
    ? `${metrics.conversion_rate}%` 
    : '—';
  const avgTimeToHire = metrics?.average_time_to_hire_days !== null && metrics?.average_time_to_hire_days !== undefined 
    ? `${metrics.average_time_to_hire_days}d` 
    : '—';

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-150 shadow-xs">
      
      {/* 1. TOTAL ACTIVE */}
      <div className="flex items-center gap-3 w-full sm:w-1/3 justify-center sm:justify-start sm:px-4 py-1">
        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">TOTAL ACTIVE</span>
          <span className="text-xl font-black text-slate-900 leading-tight block">{totalActive}</span>
        </div>
      </div>

      {/* 2. CONVERSION RATE */}
      <div className="flex items-center gap-3 w-full sm:w-1/3 justify-center sm:justify-start sm:px-6 py-1 pt-3 sm:pt-1">
        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">CONVERSION RATE</span>
          <span className="text-xl font-black text-slate-900 leading-tight block">{conversionRate}</span>
        </div>
      </div>

      {/* 3. AVG TIME TO HIRE */}
      <div className="flex items-center gap-3 w-full sm:w-1/3 justify-center sm:justify-start sm:px-6 py-1 pt-3 sm:pt-1">
        <div className="h-9 w-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase text-red-500 tracking-wider block">AVG TIME TO HIRE</span>
          <span className="text-xl font-black text-slate-900 leading-tight block">{avgTimeToHire}</span>
        </div>
      </div>

    </div>
  );
}
