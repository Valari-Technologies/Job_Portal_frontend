import React from 'react';
import { UserPlus, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add HR',
      icon: UserPlus,
      color: 'bg-[#8CC63F]/10 hover:bg-[#8CC63F]/20 text-[#8CC63F]',
      path: '/superadmin-dashboard/hr-management'
    },
    {
      label: 'View HR List',
      icon: Users,
      color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600',
      path: '/superadmin-dashboard/hr-management'
    },
    {
      label: 'View Reports',
      icon: FileText,
      color: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600',
      path: '/superadmin-dashboard/reports'
    }
  ];

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-xs flex flex-col justify-between text-left h-full">
      <div>
        <h3 className="text-sm font-black text-slate-800 tracking-tight mb-5 uppercase tracking-wider">Quick Actions</h3>
        
        <div className="flex flex-col gap-3">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(act.path)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-black text-sm transition-all duration-200 cursor-pointer text-left focus:outline-none ${act.color}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
