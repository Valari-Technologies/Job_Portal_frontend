import { UserPlus, Mail, Users, Download } from 'lucide-react';

export default function AdminQuickActions({ onActionClick }) {
  const actions = [
    {
      id: 'create_recruiter',
      title: 'Create Recruiter',
      subtitle: 'Add a new recruiter',
      icon: <UserPlus className="h-5 w-5 text-indigo-600" />
    },
    {
      id: 'resend_activation',
      title: 'Resend Activation',
      subtitle: 'Resend activation email',
      icon: <Mail className="h-5 w-5 text-indigo-600" />
    },
    {
      id: 'view_recruiters',
      title: 'View Recruiters',
      subtitle: 'Browse all recruiters',
      icon: <Users className="h-5 w-5 text-indigo-600" />
    },
    {
      id: 'export_report',
      title: 'Export Report',
      subtitle: 'Download recruiter report',
      icon: <Download className="h-5 w-5 text-indigo-600" />
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 font-sans h-full shadow-xs">
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => onActionClick(act.id)}
            className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-3.5 bg-white hover:bg-indigo-50/50 hover:border-indigo-200 transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer min-h-[44px]"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 shrink-0">
              {act.icon}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 leading-tight">{act.title}</h4>
              <p className="text-xs font-medium text-slate-600 leading-none">{act.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
