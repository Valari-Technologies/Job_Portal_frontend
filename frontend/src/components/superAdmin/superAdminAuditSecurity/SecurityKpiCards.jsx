import React from 'react';
import { Users, UserCheck, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function SecurityKpiCards({ posture, loading, error }) {
  const cards = [
    {
      title: 'Total Accounts',
      value: posture?.accounts_summary?.total_users ?? 0,
      subtext: 'Candidates & employers',
      icon: Users,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
      valColor: 'text-slate-800',
    },
    {
      title: 'Active Users',
      value: posture?.accounts_summary?.active_users ?? 0,
      subtext: 'Operational & verified',
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valColor: 'text-emerald-700',
    },
    {
      title: 'Suspended',
      value: posture?.accounts_summary?.suspended_users ?? 0,
      subtext: 'Restricted / disabled',
      icon: ShieldAlert,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      valColor: 'text-rose-700',
    },
    {
      title: 'Privileged Access',
      value: posture?.accounts_summary?.privileged_users ?? 0,
      subtext: 'Admins, HRs & Super Admins',
      icon: ShieldCheck,
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      valColor: 'text-teal-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((c, i) => {
        const IconComponent = c.icon;
        return (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl ${c.iconBg}`}>
                <IconComponent className={`w-4 h-4 ${c.iconColor}`} />
              </div>
            </div>

            <div className="mt-3">
              {loading ? (
                <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                <div className={`text-2xl sm:text-3xl font-black ${c.valColor}`}>
                  {c.value}
                </div>
              )}
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {c.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
