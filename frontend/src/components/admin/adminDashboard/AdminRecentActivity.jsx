export default function AdminRecentActivity({ activities = [] }) {
  const getAvatarBgColor = (initials) => {
    switch (initials) {
      case 'AS': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'JD': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'MK': return 'bg-red-50 text-red-800 border-red-200';
      case 'SR': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'DL': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between flex-1 font-sans shadow-xs">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h3>
        
        <div className="divide-y divide-slate-100">
          {activities.map((act) => {
            const initials = act.employer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={act.id} className="flex items-start justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex gap-3">
                  <div className={`h-10 w-10 flex items-center justify-center rounded-full font-black text-sm shrink-0 border ${getAvatarBgColor(initials)}`}>
                    {initials}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-900 leading-normal">
                      {act.activity_type.replace('{name}', act.employer_name)}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      {act.company_name}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500 shrink-0 mt-0.5 font-mono">
                  {act.created_at}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100">
        <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer">
          View all activity &rarr;
        </button>
      </div>
    </div>
  );
}
