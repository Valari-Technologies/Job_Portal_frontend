import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-purple-50 text-purple-700 border-purple-200',
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-rose-50 text-rose-700 border-rose-200',
];

export default function AdminRecentActivity({ activities = [] }) {
  const navigate = useNavigate();

  const getAvatarBgColor = (name) => {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between flex-1 font-sans shadow-xs">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h3>
        
        {activities.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {activities.map((act) => {
              const nameStr = act.employer_name || 'Recruiter';
              const initials = nameStr.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'R';
              return (
                <div key={act.id} className="flex items-start justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex gap-3">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-full font-black text-sm shrink-0 border ${getAvatarBgColor(nameStr)}`}>
                      {initials}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-900 leading-normal">
                        {act.activity_type.replace('{name}', nameStr)}
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
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Activity className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No recent recruiter activity yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Administrative actions and new recruiter registrations will be logged here in real time.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100">
        <button 
          onClick={() => navigate('/admin/activity')}
          className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all activity &rarr;
        </button>
      </div>
    </div>
  );
}
