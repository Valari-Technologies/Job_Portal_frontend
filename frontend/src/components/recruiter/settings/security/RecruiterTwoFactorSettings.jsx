import { ShieldCheck } from 'lucide-react';

export default function RecruiterTwoFactorSettings({ twoFactorSupported, twoFactorEnabled, onManage2FA }) {
  if (!twoFactorSupported) {
    return (
      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-3 shadow-xs text-center">
        <ShieldCheck className="h-6 w-6 text-slate-400 mx-auto" />
        <h2 className="text-sm font-black text-slate-700">Two-Factor Authentication</h2>
        <p className="text-xs font-medium text-slate-450 max-w-sm mx-auto">
          Two-factor authentication is not configured for this account. Contact your platform administrator for support.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
      <div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
          <h2 className="text-base font-black text-slate-900">Two-Factor Auth</h2>
        </div>
        <p className="text-xs font-bold text-slate-450 mt-1">
          Add an extra layer of security to your account by enabling 2FA.
        </p>
      </div>

      <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Status</span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
            twoFactorEnabled
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {twoFactorEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      <button
        type="button"
        onClick={onManage2FA}
        className="w-full py-2.5 px-4 rounded-xl border border-indigo-600 bg-white text-indigo-600 text-xs font-black hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        Manage 2FA Settings
      </button>
    </div>
  );
}
