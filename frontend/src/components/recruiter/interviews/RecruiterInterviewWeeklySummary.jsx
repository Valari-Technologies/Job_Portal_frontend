export default function RecruiterInterviewWeeklySummary({ summary }) {
  const completed = summary?.completed || 0;
  const upcoming = summary?.upcoming || 0;
  const rescheduled = summary?.rescheduled || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs">
      <h3 className="text-sm font-black text-slate-900">This Week</h3>

      <div className="space-y-3 text-xs font-bold text-slate-600 divide-y divide-slate-100">
        <div className="flex items-center justify-between pt-1">
          <span>Completed</span>
          <span className="text-sm font-black text-emerald-600">{completed}</span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span>Upcoming</span>
          <span className="text-sm font-black text-indigo-600">{upcoming}</span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span>Rescheduled</span>
          <span className="text-sm font-black text-amber-600">{rescheduled}</span>
        </div>
      </div>
    </div>
  );
}
