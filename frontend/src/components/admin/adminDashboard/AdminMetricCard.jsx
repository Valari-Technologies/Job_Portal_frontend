import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminMetricCard({ title, value, changeText, isNegative }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex-1 min-w-[200px] flex flex-col justify-between h-[120px] font-sans shadow-xs">
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      <div className="space-y-1 mt-2">
        <span className="text-3xl font-black text-slate-900 tracking-tight leading-none block">{value}</span>
        <div className={`flex items-center gap-1 text-xs font-semibold mt-1.5 ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
          {isNegative ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
          <span>{changeText}</span>
        </div>
      </div>
    </div>
  );
}
