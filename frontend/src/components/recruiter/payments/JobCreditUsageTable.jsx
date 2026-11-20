import { Briefcase, Calendar, Zap, CheckCircle2 } from 'lucide-react';

export default function JobCreditUsageTable({ usageJobs = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            Job Credit Usage History
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Audit trail of credits deducted per job posting and remaining balance.
          </p>
        </div>
        <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl self-start sm:self-auto">
          {usageJobs.length} {usageJobs.length === 1 ? 'Job Posted' : 'Jobs Posted'}
        </span>
      </div>

      {usageJobs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Date Posted</th>
                <th className="py-3 px-4">Active Duration</th>
                <th className="py-3 px-4">Credit Used</th>
                <th className="py-3 px-4">Balance After</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
              {usageJobs.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <span className="truncate max-w-[220px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">
                    {item.duration_days ? `${item.duration_days} Days Live` : '30 Days Live'}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-indigo-700">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[11px]">
                      -1 Credit
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.remaining_balance ?? item.remaining ?? '—'} Credits
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">
                      <CheckCircle2 className="h-3 w-3" /> Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-50/70 rounded-2xl p-8 text-center space-y-2 border border-slate-150">
          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <Briefcase className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No job credits consumed yet</h4>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto">
            When you post a job using your active plan, 1 credit will be deducted and its usage history will be tracked here.
          </p>
        </div>
      )}
    </div>
  );
}
