export default function AdminMetricCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex-1 min-w-[200px] flex flex-col justify-center h-[100px] font-sans shadow-xs">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
      <div className="mt-2">
        <span className="text-3xl font-black text-slate-900 tracking-tight leading-none block">{value}</span>
      </div>
    </div>
  );
}
