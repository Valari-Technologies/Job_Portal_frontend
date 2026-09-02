import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function CommerceSummaryCards({ commerceSummary }) {
  const credits = commerceSummary?.credits?.available || 0;
  const plan = commerceSummary?.current_plan;
  const usage = commerceSummary?.usage || { allowance: 0, used: 0, remaining: 0 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Job Posting Credits Card */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              $
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Available Balance</span>
          </div>

          <div>
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {credits} <span className="text-xl font-bold text-slate-700">Job Credits</span>
            </span>
            <p className="text-sm font-medium text-slate-600 mt-1 max-w-sm leading-relaxed">
              Credits are used to publish premium job listings. Your next credit refresh is subject to active plan validity.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/recruiter/payments/plans"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors min-h-[40px] flex items-center"
          >
            Buy Credits
          </Link>
          <Link
            to="/recruiter/payments/plans"
            className="px-4 py-2.5 rounded-xl bg-purple-50 text-indigo-700 border border-purple-100 text-xs font-bold hover:bg-purple-100 transition-colors min-h-[40px] flex items-center"
          >
            View Pricing
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
            {usage.allowance > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-bold">
                {usage.used} / {usage.allowance} Used
              </span>
            )}
          </div>

          {plan ? (
            <div>
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-sm font-bold text-indigo-600 mt-0.5">{plan.formatted_price || 'Free'}</p>
              <div className="flex items-center justify-between pt-3 text-sm font-semibold text-slate-600 border-t border-slate-100 mt-3">
                <span>Valid Until:</span>
                <span className="text-slate-900 font-bold">{plan.valid_until || 'N/A'}</span>
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
            className="text-sm font-bold text-indigo-600 flex items-center justify-between group hover:underline"
          >
            <span>Change Plan</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
