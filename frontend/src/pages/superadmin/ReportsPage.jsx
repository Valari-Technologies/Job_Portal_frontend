import React, { useState } from 'react';
import CustomSelect from '../../components/CustomSelect';

const STATS_DATA = [
  { label: 'Total Candidates', value: '24,685', change: '↑ 8.4%', trend: 'up' },
  { label: 'Total Applications', value: '18,452', change: '↑ 9.7%', trend: 'up' },
  { label: 'Total Jobs', value: '1,256', change: '↑ 6.3%', trend: 'up' },
  { label: 'Interviews', value: '2,145', change: '↑ 5.2%', trend: 'up' },
  { label: 'Offers', value: '685', change: '↑ 7.1%', trend: 'up' },
  { label: 'Hires', value: '685', change: '↑ 14.6%', trend: 'up' },
  { label: 'Rejection Rate', value: '32.4%', change: '↓ 2.1%', trend: 'down' }
];

const MONTHLY_HIRES = [
  { month: 'Jan', count: 65, height: '65%' },
  { month: 'Feb', count: 50, height: '50%' },
  { month: 'Mar', count: 70, height: '70%' },
  { month: 'Apr', count: 55, height: '55%' },
  { month: 'May', count: 68, height: '68%' },
  { month: 'Jun', count: 52, height: '52%' }
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Reports</h2>
      </div>

      {/* Row of 7 Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
        {STATS_DATA.map((card, i) => (
          <div 
            key={i} 
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-3xs flex flex-col gap-2 transition-transform hover:translate-y-[-2px] duration-200"
          >
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block leading-tight">
              {card.label}
            </span>
            <span className="text-2xl font-black text-indigo-600 block mt-1 tracking-tight">
              {card.value}
            </span>
            <span className="text-xs font-black text-emerald-500 block leading-none">
              {card.change}
            </span>
          </div>
        ))}
      </div>

      {/* Two Column Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Recruitment Funnel Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-3xs p-6 flex flex-col gap-6 min-h-[420px]">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Recruitment Funnel</h3>
          
          {/* Centered decreasing shape funnel container */}
          <div className="flex-grow flex items-center justify-center pt-2">
            <div 
              className="relative w-full max-w-[360px] h-[270px] flex flex-col justify-stretch overflow-hidden rounded-t-[20px]" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            >
              <div className="bg-[#7c3aed] flex-grow flex items-center justify-center text-white text-[11px] font-black tracking-wider select-none">
                Applications
              </div>
              <div className="bg-[#2563eb] flex-grow flex items-center justify-center text-white text-[11px] font-black tracking-wider select-none">
                Under Review
              </div>
              <div className="bg-[#06b6d4] flex-grow flex items-center justify-center text-white text-[11px] font-black tracking-wider select-none">
                Shortlisted
              </div>
              <div className="bg-[#8CC63F] flex-grow flex items-center justify-center text-white text-[11px] font-black tracking-wider select-none">
                Interview
              </div>
              <div className="bg-[#f59e0b] flex-grow flex items-center justify-center text-white text-[11px] font-black tracking-wider select-none">
                Offer
              </div>
              <div className="bg-[#ef4444] flex-grow flex items-center justify-center text-white text-[10px] font-black tracking-wider select-none pb-4">
                Hierd
              </div>
            </div>
          </div>
        </div>

        {/* Hires by Month Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-3xs p-6 flex flex-col gap-6 min-h-[420px]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Hires by Month</h3>
            
            {/* Period Selector */}
            <CustomSelect
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={['This Year', 'Last 6 Months', 'Last 3 Months']}
              placeholder="This Year"
              buttonClassName="w-32 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto flex items-center justify-between"
              accentColor="#8CC63F"
            />
          </div>

          {/* Bar Chart Container */}
          <div className="flex-grow flex items-end justify-between gap-4 px-4 pt-10 pb-4 relative">
            
            {/* Dotted threshold line markers in background */}
            <div className="absolute top-[30%] left-0 right-0 border-t border-dashed border-slate-100 pointer-events-none"></div>
            <div className="absolute top-[60%] left-0 right-0 border-t border-dashed border-slate-100 pointer-events-none"></div>

            {MONTHLY_HIRES.map((bar, k) => (
              <div key={k} className="flex-grow flex flex-col items-center gap-3 h-full justify-end relative z-10">
                <div 
                  style={{ height: bar.height }} 
                  className="w-full max-w-[45px] bg-[#8CC63F]/80 hover:bg-[#8CC63F] rounded-t-lg transition-all duration-300 relative group cursor-pointer"
                >
                  {/* Hover tooltips */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded-md whitespace-nowrap shadow-md z-20">
                    {bar.count} Hires
                  </div>
                </div>
                <span className="text-xs font-black text-slate-400">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
