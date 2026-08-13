import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, XCircle, UserCheck, FileText } from 'lucide-react';

export default function DashboardStats() {
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Registered HR Professionals',
      val: '48',
      icon: Users,
      color: 'text-amber-500 bg-amber-50 border-amber-100',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
      ],
      path: '/superadmin-dashboard/hr-management'
    },
    {
      title: 'Live Job Listings',
      val: '32',
      icon: Briefcase,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
      ],
      path: '/superadmin-dashboard/jobs'
    },
    {
      title: 'Closed Jobs',
      val: '18',
      icon: XCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      avatars: [
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
      ],
      path: '/superadmin-dashboard/jobs'
    },
    {
      title: 'Total Candidates',
      val: '1,356',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      avatars: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
      ],
      path: '/superadmin-dashboard/candidates'
    },
    {
      title: 'Total Applications',
      val: '3,248',
      icon: FileText,
      color: 'text-[#8CC63F] bg-emerald-50/50 border-emerald-100',
      avatars: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      ],
      path: '/superadmin-dashboard/applications'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div 
            key={idx} 
            className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs flex flex-col justify-between min-h-[148px] text-left hover:-translate-y-0.5 transition-all duration-300 group relative overflow-visible"
          >
            {/* Top row: Icon */}
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${s.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Middle: Count & Avatars */}
            <div className="flex items-end justify-between mt-4">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{s.val}</span>
              <div className="flex items-center -space-x-1.5 overflow-hidden">
                {s.avatars.map((av, aIdx) => (
                  <img 
                    key={aIdx}
                    src={av} 
                    alt="" 
                    className="w-5 h-5 rounded-full object-cover border border-white shrink-0" 
                  />
                ))}
              </div>
            </div>

            {/* Bottom: Label & view action */}
            <div className="flex flex-col mt-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider leading-none">{s.title}</span>
              <button 
                type="button"
                onClick={() => navigate(s.path)}
                className="text-[11px] font-black text-[#8CC63F] hover:text-[#7ab533] transition-colors mt-1.5 text-left cursor-pointer w-fit uppercase"
              >
                view
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
