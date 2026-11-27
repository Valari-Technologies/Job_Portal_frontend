import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Sparkles, Zap, X, ArrowRight } from 'lucide-react';
import { checkRecruiterPlanStatus } from '../../../services/recruiter/recruiterCommerceService';

const DISMISS_KEY = 'tnjobz_hr_plan_alert_dismissed';

/**
 * Centered alert notification modal for Recruiter Dashboard:
 * - Prompts new/approved HRs with no active plan to choose a suitable plan.
 * - Alerts HRs when their plan has expired, credits hit 0, or credits are low (<= 2).
 */
export default function RecruiterPlanAlertModal({ commerceSummary, isLoaded }) {
  const navigate = useNavigate();
  const [dismissedKey, setDismissedKey] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      setDismissedKey(sessionStorage.getItem(DISMISS_KEY) || '');
    } catch {}
  }, [commerceSummary]);

  if (!isLoaded || !commerceSummary) return null;

  const status = checkRecruiterPlanStatus();
  let alertConfig = null;

  if (!status.hasActivePlan) {
    alertConfig = {
      key: 'no_plan',
      tone: 'indigo',
      icon: Sparkles,
      badge: 'Action Required',
      title: 'Choose a Suitable Posting Plan',
      message:
        "Welcome! You don't have an active job posting plan yet. Choose a plan (Basic Free, Professional, or Premium) that fits your hiring needs to start posting jobs.",
      primaryLabel: 'Choose a Plan',
      primaryPath: '/recruiter/payments/plans',
      secondaryLabel: 'Later',
    };
  } else if (status.isExpired) {
    alertConfig = {
      key: `expired_${status.planId}`,
      tone: 'red',
      icon: AlertTriangle,
      badge: 'Plan Expired',
      title: 'Your Posting Plan Has Expired',
      message: `Your ${status.planName} expired on ${status.validUntil}. Select a new plan to continue publishing jobs.`,
      primaryLabel: 'Choose New Plan',
      primaryPath: '/recruiter/payments/plans',
      secondaryLabel: 'Dismiss',
    };
  } else if (status.availableCredits <= 0) {
    alertConfig = {
      key: `exhausted_${status.planId}`,
      tone: 'amber',
      icon: AlertTriangle,
      badge: 'Credits Finished',
      title: 'Job Posting Credits Exhausted',
      message: `You have used all ${status.totalAllowance} job posting credits in your ${status.planName}. Choose a new plan to continue posting jobs.`,
      primaryLabel: 'Choose New Plan',
      primaryPath: '/recruiter/payments/plans',
      secondaryLabel: 'Dismiss',
    };
  } else if (status.availableCredits <= 2) {
    alertConfig = {
      key: `low_${status.planId}_${status.availableCredits}`,
      tone: 'amber',
      icon: Zap,
      badge: 'Low Credits Alert',
      title: `Only ${status.availableCredits} Job Credit${status.availableCredits === 1 ? '' : 's'} Left`,
      message: `You have ${status.availableCredits} job posting credit(s) remaining on your ${status.planName} (valid until ${status.validUntil}). Once finished, you can choose your next plan.`,
      primaryLabel: 'View Plans & Billing',
      primaryPath: '/recruiter/payments',
      secondaryLabel: 'Got it',
    };
  }

  if (!alertConfig || dismissedKey === alertConfig.key) {
    return null;
  }

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, alertConfig.key);
    } catch {}
    setDismissedKey(alertConfig.key);
  };

  const toneStyles = {
    indigo: {
      iconBg: 'bg-indigo-100 text-indigo-600',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
    },
    amber: {
      iconBg: 'bg-amber-100 text-amber-600',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20',
    },
    red: {
      iconBg: 'bg-rose-100 text-rose-600',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20',
    },
  }[alertConfig.tone];

  const Icon = alertConfig.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4 font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recruiter-plan-alert-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-fadeIn">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close notification"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${toneStyles.iconBg}`}>
            <Icon className="h-7 w-7" />
          </div>

          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${toneStyles.badge}`}>
            {alertConfig.badge}
          </span>

          <div className="space-y-2">
            <h2 id="recruiter-plan-alert-title" className="text-xl font-black text-slate-900 tracking-tight">
              {alertConfig.title}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
              {alertConfig.message}
            </p>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer min-h-[42px]"
            >
              {alertConfig.secondaryLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                handleDismiss();
                navigate(alertConfig.primaryPath);
              }}
              className={`w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] ${toneStyles.btn}`}
            >
              <span>{alertConfig.primaryLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
