export default function AdminRecentActivity({ activities = [] }) {
  const getAvatarBgColor = (initials) => {
    switch (initials) {
      case 'AS': return 'bg-amber-50 text-amber-700';
      case 'JD': return 'bg-green-50 text-green-700';
      case 'MK': return 'bg-red-50 text-red-700';
      case 'SR': return 'bg-purple-50 text-purple-700';
      case 'DL': return 'bg-blue-50 text-blue-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-[18px] flex flex-col justify-between flex-1 font-sans">
      <div className="space-y-4">
        <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight">Recent Activity</h3>
        
        <div className="divide-y divide-slate-100">
          {activities.map((act) => {
            const initials = act.employer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={act.id} className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex gap-3">
                  <div className={`h-9 w-9 flex items-center justify-center rounded-full font-bold text-[13px] shrink-0 ${getAvatarBgColor(initials)}`}>
                    {initials}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[14px] font-medium text-slate-800 leading-normal">
                      {act.activity_type.replace('{name}', act.employer_name)}
                    </p>
                    <p className="text-[12px] font-normal text-slate-500">
                      {act.company_name}
                    </p>
                  </div>
                </div>
                <span className="text-[12px] font-normal text-slate-400 shrink-0 mt-0.5">
                  {act.created_at}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100">
        <button className="text-[14px] font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
          View all activity &rarr;
        </button>
      </div>
    </div>
  );
}
