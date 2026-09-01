import { UserPlus, Mail, Users, Download } from 'lucide-react';

export default function AdminQuickActions({ onActionClick }) {
  const actions = [
    {
      id: 'create_recruiter',
      title: 'Create Recruiter',
      subtitle: 'Add a new recruiter',
      icon: <UserPlus className="h-5 w-5 text-slate-500" />
    },
    {
      id: 'resend_activation',
      title: 'Resend Activation',
      subtitle: 'Resend activation email',
      icon: <Mail className="h-5 w-5 text-slate-500" />
    },
    {
      id: 'view_recruiters',
      title: 'View Recruiters',
      subtitle: 'Browse all recruiters',
      icon: <Users className="h-5 w-5 text-slate-500" />
    },
    {
      id: 'export_report',
      title: 'Export Report',
      subtitle: 'Download recruiter report',
      icon: <Download className="h-5 w-5 text-slate-500" />
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-[18px] space-y-4 font-sans h-full">
      <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => onActionClick(act.id)}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 bg-white hover:bg-slate-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
          >
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-150 shrink-0">
              {act.icon}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[14px] font-semibold text-slate-805 leading-tight">{act.title}</h4>
              <p className="text-[12px] font-normal text-slate-455 leading-none">{act.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
