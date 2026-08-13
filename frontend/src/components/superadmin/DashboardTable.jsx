import React from 'react';

export default function DashboardTable() {
  const activities = [
    {
      type: 'New HR created',
      desc: 'Sarah Johnson was added as HR Manager',
      time: '10 min ago',
      color: 'bg-blue-500'
    },
    {
      type: 'New Job Published',
      desc: 'Senior Product Designer published',
      time: '1 hr ago',
      color: 'bg-emerald-500'
    },
    {
      type: 'Candidate Applied',
      desc: 'Rahul Sharma applied for UI/UX Designer',
      time: '2 hr ago',
      color: 'bg-amber-500'
    },
    {
      type: 'Job Closed',
      desc: 'Marketing Manager position closed',
      time: '5 hr ago',
      color: 'bg-rose-500'
    }
  ];

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-xs flex flex-col justify-between text-left h-full">
      <div>
        <h3 className="text-sm font-black text-slate-800 tracking-tight mb-5 uppercase tracking-wider">Recent Activity</h3>
        
        <div className="flex flex-col divide-y divide-slate-50">
          {activities.map((act, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-500 hover:bg-slate-50/20 transition-all rounded-lg px-2">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${act.color} shrink-0`} />
                <span className="text-slate-800 font-extrabold w-36 shrink-0">{act.type}</span>
                <span className="text-slate-500 font-bold hidden sm:inline">{act.desc}</span>
              </div>
              <span className="text-slate-400 text-xs font-bold shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-50 pt-4 mt-4">
        <button 
          type="button"
          className="text-xs font-black text-[#8CC63F] hover:text-[#7ab533] uppercase transition-all tracking-wider cursor-pointer"
        >
          View All
        </button>
      </div>
    </div>
  );
}
