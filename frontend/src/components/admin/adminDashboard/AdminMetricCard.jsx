import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminMetricCard({ title, value, changeText, isNegative }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-[18px] flex-1 min-w-[200px] flex flex-col justify-between h-[115px] font-sans">
      <span className="text-[13px] font-medium text-slate-500">{title}</span>
      <div className="space-y-1 mt-2.5">
        <span className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">{value}</span>
        <div className={`flex items-center gap-1 text-[12px] font-normal mt-1.5 ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
          {isNegative ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
          <span>{changeText}</span>
        </div>
      </div>
    </div>
  );
}
