import React, { useState } from 'react';
import CustomSelect from '../CustomSelect';

export default function DashboardCharts() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      
      {/* 1. Applications by Month (Line Chart) */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs flex flex-col justify-between text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-black text-slate-800 tracking-tight">Applications by Month</span>
          <CustomSelect 
            value={selectedPeriod}
            onChange={(val) => setSelectedPeriod(val)}
            options={['This Year', 'Last Year', 'Last 6 Months']}
            placeholder="This Year"
            className="w-28 shrink-0"
            buttonClassName="rounded-full bg-slate-100 hover:bg-slate-200/80 border-none text-slate-700 text-xs font-black px-4 h-8"
            accentColor="#8CC63F"
          />
        </div>
        
        {/* SVG Line Graph */}
        <div className="w-full h-44 relative">
          <svg className="w-full h-full" viewBox="0 0 400 150">
            {/* Horizontal Grid lines and Y Axis Labels */}
            {[
              { label: '1K', y: 10 },
              { label: '0.9K', y: 22 },
              { label: '0.8K', y: 34 },
              { label: '0.7K', y: 46 },
              { label: '0.6K', y: 58 },
              { label: '0.5K', y: 70 },
              { label: '0.4K', y: 82 },
              { label: '0.3K', y: 94 },
              { label: '0.2K', y: 106 },
              { label: '0.1K', y: 118 },
              { label: '0', y: 130 }
            ].map((grid, idx) => (
              <g key={idx}>
                <line 
                  x1="35" 
                  y1={grid.y} 
                  x2="390" 
                  y2={grid.y} 
                  stroke="#E2E8F0" 
                  strokeOpacity="0.5"
                  strokeWidth="1" 
                />
                <text 
                  x="28" 
                  y={grid.y + 3} 
                  textAnchor="end" 
                  className="text-[10px] font-black fill-slate-500 font-sans"
                >
                  {grid.y === 130 ? '0' : grid.label}
                </text>
              </g>
            ))}
            
            {/* Curved Path */}
            <path 
              d="M 35,118 Q 51.5,94 68,94 T 101,70 T 134,78 T 167,82 T 200,46 T 233,70 T 266,90 T 299,82 T 332,46 T 365,22 T 390,10" 
              fill="none" 
              stroke="#8CC63F" 
              strokeWidth="2.5" 
            />

            {/* Accent markers */}
            <circle cx="35" cy="118" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="68" cy="94" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="101" cy="70" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="134" cy="78" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="167" cy="82" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="200" cy="46" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="233" cy="70" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="266" cy="90" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="299" cy="82" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="332" cy="46" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="365" cy="22" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="390" cy="10" r="3" fill="#E29D29" stroke="#FFF" strokeWidth="1.5" />
          </svg>
        </div>

        {/* X Axis Labels aligned with shifted points */}
        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase mt-2 pl-[32px] pr-[5px]">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
            <span key={m} className="w-6 text-center">{m}</span>
          ))}
        </div>
      </div>

      {/* 2. Jobs by Department (Donut Chart) */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs flex flex-col justify-between text-left">
        <span className="text-sm font-black text-slate-800 tracking-tight mb-4 block">Jobs by Department</span>
        
        <div className="flex items-center justify-around gap-4 h-44">
          {/* Donut SVG */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Engineering (40%) - dark green */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#5C7C1E" strokeWidth="12" strokeDasharray="100.48 251.2" strokeDashoffset="0" />
              {/* Sales (25%) - yellow */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F5B000" strokeWidth="12" strokeDasharray="62.8 251.2" strokeDashoffset="-100.48" />
              {/* Marketing (20%) - light orange */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FFB300" strokeWidth="12" strokeDasharray="50.24 251.2" strokeDashoffset="-163.28" />
              {/* HR (10%) - dark gray */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#5A5A5A" strokeWidth="12" strokeDasharray="25.12 251.2" strokeDashoffset="-213.52" />
              {/* Others (5%) - dark red */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#B91C1C" strokeWidth="12" strokeDasharray="12.56 251.2" strokeDashoffset="-238.64" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center leading-none">
              <span className="text-2xl font-black text-slate-800">120</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">
            {[
              { label: 'Engineering', val: '40%', color: 'bg-[#5C7C1E]' },
              { label: 'Sales', val: '25%', color: 'bg-[#F5B000]' },
              { label: 'Marketing', val: '20%', color: 'bg-[#FFB300]' },
              { label: 'HR', val: 'bg-[#5A5A5A]' },
              { label: 'Others', val: '5%', color: 'bg-[#B91C1C]' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${item.label === 'HR' ? 'bg-[#5A5A5A]' : item.color}`} />
                  <span className="text-slate-600">{item.label}</span>
                </div>
                <span className="font-extrabold text-slate-800">{item.label === 'HR' ? '10%' : item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recruitment Overview (Bar Chart) */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs flex flex-col justify-between text-left">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-black text-slate-800 tracking-tight mt-1">Recruitment Overview</span>
          {/* Rounded Gray Legend Capsule */}
          <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-3 flex flex-col gap-1.5 text-[11px] font-bold text-slate-500 w-28 shadow-2xs select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5C7C1E]" />
              <span>Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F5B000]" />
              <span>Hires</span>
            </div>
          </div>
        </div>

        {/* Bar Graph SVG */}
        <div className="w-full h-44 relative">
          <svg className="w-full h-full" viewBox="0 0 300 150">
            {/* Horizontal Grid lines and Y Axis Labels */}
            {[
              { label: '1K', y: 10 },
              { label: '0.9K', y: 22 },
              { label: '0.8K', y: 34 },
              { label: '0.7K', y: 46 },
              { label: '0.6K', y: 58 },
              { label: '0.5K', y: 70 },
              { label: '0.4K', y: 82 },
              { label: '0.3K', y: 94 },
              { label: '0.2K', y: 106 },
              { label: '0.1K', y: 118 },
              { label: '0', y: 130 }
            ].map((grid, idx) => (
              <g key={idx}>
                <line 
                  x1="35" 
                  y1={grid.y} 
                  x2="295" 
                  y2={grid.y} 
                  stroke="#E2E8F0" 
                  strokeOpacity="0.5"
                  strokeWidth="1" 
                />
                <text 
                  x="28" 
                  y={grid.y + 3} 
                  textAnchor="end" 
                  className="text-[10px] font-black fill-slate-500 font-sans"
                >
                  {grid.y === 130 ? '0' : grid.label}
                </text>
              </g>
            ))}
            
            {/* Bars: Jan, Feb, Mar, May, Jun */}
            {[
              { x: 50, appH: 48, hireH: 30 },  // Jan: App=0.4K (h=48), Hire=0.25K (h=30)
              { x: 95, appH: 84, hireH: 60 },  // Feb: App=0.7K (h=84), Hire=0.5K (h=60)
              { x: 140, appH: 54, hireH: 36 }, // Mar: App=0.45K (h=54), Hire=0.3K (h=36)
              { x: 185, appH: 48, hireH: 24 }, // May: App=0.4K (h=48), Hire=0.2K (h=24)
              { x: 230, appH: 72, hireH: 48 }  // Jun: App=0.6K (h=72), Hire=0.4K (h=48)
            ].map((bar, idx) => (
              <g key={idx}>
                {/* Apps Bar (dark green) */}
                <rect x={bar.x} y={130 - bar.appH} width="8" height={bar.appH} rx="2" fill="#5C7C1E" />
                {/* Hires Bar (golden yellow) */}
                <rect x={bar.x + 10} y={130 - bar.hireH} width="8" height={bar.hireH} rx="2" fill="#F5B000" />
              </g>
            ))}
          </svg>
        </div>

        {/* X Axis Labels aligned with bar groups */}
        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase mt-2 pl-[42px] pr-[30px]">
          {['Jan', 'Feb', 'Mar', 'May', 'Jun'].map(m => (
            <span key={m} className="w-8 text-center">{m}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
