import { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-150 bg-white p-3.5 shadow-xl space-y-1.5 font-sans">
        <p className="text-xs font-black text-slate-800 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-extrabold text-slate-900">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsChartsSection({ 
  trends = [], 
  dualPipelines = {}, 
  funnel = [], 
  overallConversion = '0.0%',
  districts = [], 
  categories = [], 
  workModes = [], 
  employerTrust = {} 
}) {
  const [activeSeries, setActiveSeries] = useState('ALL');

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Main Growth Trend & Pipeline Funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Trend activity area chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Platform activity trends</h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Application submissions, new talent registrations, and published jobs
              </p>
            </div>
            
            {/* Series filter tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveSeries('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSeries === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveSeries('APPS')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSeries === 'APPS' ? 'bg-white text-teal-700 shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                Applications
              </button>
              <button
                type="button"
                onClick={() => setActiveSeries('USERS')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSeries === 'USERS' ? 'bg-white text-blue-700 shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                Candidates
              </button>
            </div>
          </div>

          {/* Recharts chart area */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                />
                <Tooltip content={<CustomChartTooltip />} />

                {(activeSeries === 'ALL' || activeSeries === 'APPS') && (
                  <Area 
                    type="monotone" 
                    dataKey="applications" 
                    name="Applications" 
                    stroke="#0d9488" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorApps)" 
                  />
                )}
                {(activeSeries === 'ALL' || activeSeries === 'USERS') && (
                  <Area 
                    type="monotone" 
                    dataKey="candidates" 
                    name="Candidates" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorCandidates)" 
                  />
                )}
                {activeSeries === 'ALL' && (
                  <Area 
                    type="monotone" 
                    dataKey="jobs" 
                    name="Active Jobs" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorJobs)" 
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                Applications
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Candidates
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                Jobs
              </span>
            </div>
            <span className="text-slate-450">Daily platform activity index</span>
          </div>
        </div>

        {/* Right: Application Lifecycle Funnel */}
        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Application funnel</h3>
              <span className="text-[11px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-150">
                Conversion Pipeline
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-2 mb-4">
              Conversion rate across the candidate recruitment lifecycle
            </p>

            <div className="space-y-3">
              {(funnel || []).map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-700">{step.stage}</span>
                    <span className="text-slate-900">{step.count} ({step.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(step.percentage, step.count > 0 ? 8 : 0)}%`, backgroundColor: step.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-150 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700">Overall conversion</span>
              <span className="font-black text-emerald-700 text-sm">{overallConversion || '0.0%'}</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-1">
              Application to final selection ratio
            </p>
          </div>
        </div>
      </div>

      {/* 2. Hiring Streams & Channel Performance */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Hiring streams & channel performance
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Comparative metrics across professional resume recruitment and direct local employment
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-150 shrink-0">
            Multi-Stream Hiring
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Professional Recruitment */}
          <div className="rounded-2xl border border-slate-150 bg-slate-50/40 p-5 space-y-4 hover:border-teal-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {dualPipelines?.professional?.title || 'Professional recruitment'}
                </h4>
                <p className="text-xs font-medium text-slate-500">
                  Software, Engineering, Management & Office jobs
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              {dualPipelines?.professional?.description || 'Requires full candidate profile with resume attachment and multi-stage evaluation.'}
            </p>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-200/60 pt-3 text-center">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-450 block">Jobs</span>
                <span className="text-lg font-black text-slate-800">
                  {dualPipelines?.professional?.job_count ?? 2}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-450 block">Applications</span>
                <span className="text-lg font-black text-slate-800">
                  {dualPipelines?.professional?.application_count ?? 2}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-450 block">Avg Response</span>
                <span className="text-lg font-black text-teal-700">
                  {dualPipelines?.professional?.avg_response_time || '2.4 days'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Simple Local Hiring */}
          <div className="rounded-2xl border border-slate-150 bg-slate-50/40 p-5 space-y-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {dualPipelines?.simple_local?.title || 'Simple local hiring'}
                </h4>
                <p className="text-xs font-medium text-slate-500">
                  Hospitality, Retail, Drivers, Technicians & Helpers
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              {dualPipelines?.simple_local?.description || 'Zero-resume workflow where candidates apply with verified phone number for direct contact.'}
            </p>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-200/60 pt-3 text-center">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-450 block">Jobs</span>
                <span className="text-lg font-black text-slate-800">
                  {dualPipelines?.simple_local?.job_count ?? 1}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-450 block">Applications</span>
                <span className="text-lg font-black text-slate-800">
                  {dualPipelines?.simple_local?.application_count ?? 0}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-450 block">Direct Contact</span>
                <span className="text-lg font-black text-blue-700">
                  {dualPipelines?.simple_local?.direct_contact_rate || '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Geographic Distribution & Categories Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Geographic Location Distribution */}
        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Regional talent & hiring distribution</h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Live distribution across registered states & districts</p>
            </div>
            <span className="text-xs font-black text-teal-650 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-150">
              State / District
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {(districts || []).map((d, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 text-xs font-black">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{d.district}</h4>
                    <p className="text-[11px] font-medium text-slate-450">{d.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-xs font-bold">
                  <div className="text-right">
                    <span className="text-slate-900 font-extrabold block">{d.jobs} jobs</span>
                    <span className="text-slate-450 text-[11px]">{d.candidates} candidates • {d.employers || 0} employers</span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-black text-emerald-700 border border-emerald-200">
                    {d.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sectors & Job Categories Breakdown */}
        <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Sectors & job categories</h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Live demand index across active catalog categories</p>
            </div>
            <span className="text-xs font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              Catalog View
            </span>
          </div>

          <div className="space-y-4">
            {(categories || []).map((c, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-slate-800">{c.name}</span>
                  <span className="text-slate-500 font-bold">{c.jobs} jobs • {c.share}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(c.share, c.jobs > 0 ? 8 : 0)}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Work Modes distribution row */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2.5">
              Workplace modality distribution
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {(workModes || []).map((w, idx) => (
                <div key={idx} className="rounded-xl border border-slate-150 bg-slate-50/50 p-2">
                  <span className="text-xs font-black text-slate-800 block">{w.mode}</span>
                  <span className="text-sm font-black text-teal-700">{w.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Employer Trust & Verification Health */}
      <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Employer trust & verification health
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Progressive trust tiers determining moderation and auto-publishing compliance
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            Platform Governance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/30">
            <span className="text-[11px] font-black uppercase text-slate-450 block">Trusted employers</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {employerTrust?.trusted_count ?? 0}
            </span>
            <p className="text-xs font-medium text-slate-500 mt-1">Bypass repeated moderation</p>
          </div>

          <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/30">
            <span className="text-[11px] font-black uppercase text-slate-450 block">Approved employers</span>
            <span className="text-2xl font-black text-teal-700 mt-1 block">
              {employerTrust?.approved_count ?? 0}
            </span>
            <p className="text-xs font-medium text-slate-500 mt-1">Verified business credentials</p>
          </div>

          <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/30">
            <span className="text-[11px] font-black uppercase text-slate-450 block">Direct publish rate</span>
            <span className="text-2xl font-black text-blue-700 mt-1 block">
              {employerTrust?.direct_publish_rate || '0%'}
            </span>
            <p className="text-xs font-medium text-slate-500 mt-1">Trusted job approval ratio</p>
          </div>

          <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/30">
            <span className="text-[11px] font-black uppercase text-slate-450 block">Moderation queue</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">
              {employerTrust?.avg_review_hours || '0 in queue'}
            </span>
            <p className="text-xs font-medium text-slate-500 mt-1">Pending review approvals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
