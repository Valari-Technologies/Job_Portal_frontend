import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, AlertTriangle } from 'lucide-react';

export default function CommerceSummaryCards({ commerceSummary }) {
  const credits = commerceSummary?.credits?.available || 0;
  const totalAllowance = commerceSummary?.credits?.total_allowance || 10;
  const usedCredits = commerceSummary?.credits?.used || 0;
  const plan = commerceSummary?.current_plan;
  const usage = commerceSummary?.usage || { allowance: totalAllowance, used: usedCredits, remaining: credits };

  // Calculate plan expiration
  let isExpired = false;
  let daysRemaining = 30;
  if (plan?.valid_until) {
    const expiryTime = new Date(plan.valid_until).getTime();
    if (!isNaN(expiryTime)) {
      const diff = Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.max(0, diff);
      if (diff <= 0) isExpired = true;
    }
  }

  const usagePercent = Math.min(100, Math.round(((usage.used || usedCredits) / (usage.allowance || totalAllowance || 1)) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-sans">
      {/* 1. Job Posting Credits Card */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Available Balance</span>
            </div>
            <span className="text-xs font-extrabold text-indigo-700 bg-white/90 border border-indigo-100 px-3 py-1 rounded-xl shadow-2xs">
              1 Post = 1 Credit
            </span>
          </div>

          <div>
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {credits} <span className="text-xl font-bold text-slate-700">Job Credits</span>
            </span>
            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-sm leading-relaxed">
              Credits are used automatically when you publish a job. You can post {credits} more {credits === 1 ? 'job' : 'jobs'} without paying.
            </p>
          </div>

          {/* Credit Progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-600">
              <span>Credits Consumed: {usedCredits} / {totalAllowance}</span>
              <span>{usagePercent}% Used</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  usagePercent >= 90 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.max(usagePercent, 4)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/recruiter/payments/plans"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors min-h-[40px] flex items-center cursor-pointer"
          >
            Buy Credits
          </Link>
          <Link
            to="/recruiter/payments/plans"
            className="px-4 py-2.5 rounded-xl bg-purple-50 text-indigo-700 border border-purple-100 text-xs font-bold hover:bg-purple-100 transition-colors min-h-[40px] flex items-center cursor-pointer"
          >
            View Pricing & Plans
          </Link>
        </div>
      </div>

      {/* 2. Current Plan Card */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current Plan</span>
            </div>
            {isExpired ? (
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Plan Expired
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {daysRemaining} Days Remaining
              </span>
            )}
          </div>

          {plan ? (
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <span className="text-xs font-extrabold text-indigo-600">({plan.formatted_price || 'Free'})</span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Includes {plan.features?.[0] || 'Full portal access'} with {plan.duration_days || 30}-day active listing duration.
              </p>

              <div className="flex items-center justify-between pt-3 text-xs font-semibold text-slate-600 border-t border-slate-100 mt-3">
                <span className="text-slate-400">Plan Validity Window:</span>
                <span className={`font-bold ${isExpired ? 'text-red-600' : 'text-slate-900'}`}>
                  Valid until {plan.valid_until || 'N/A'}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-slate-900">No Active Plan</h3>
              <p className="text-sm font-medium text-slate-600 mt-1">Select a posting plan to start publishing job listings.</p>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100">
          <Link
            to="/recruiter/payments/plans"
            className="text-xs font-bold text-indigo-600 flex items-center justify-between group hover:underline"
          >
            <span>Upgrade or Change Plan</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
