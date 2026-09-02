import { useState } from 'react';
import { Check } from 'lucide-react';

export default function NotificationsSettingsTab({ initialData, onSave }) {
  const [newApplications, setNewApplications] = useState(initialData?.new_applications ?? true);
  const [inAppAlerts, setInAppAlerts] = useState(initialData?.in_app_alerts ?? true);
  const [dailyDigest, setDailyDigest] = useState(initialData?.daily_digest ?? false);
  const [fifteenMinWarning, setFifteenMinWarning] = useState(initialData?.fifteen_min_warning ?? true);
  const [productUpdates, setProductUpdates] = useState(initialData?.product_updates ?? false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('notifications', {
      newApplications,
      inAppAlerts,
      dailyDigest,
      fifteenMinWarning,
      productUpdates
    });
  };

  const renderToggle = (checked, onChange) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5 ${
        checked ? 'bg-indigo-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white transition-transform flex items-center justify-center text-indigo-600 shadow-xs ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      >
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </span>
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex-1">
      {/* 1. Application Alerts Card */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900">Application Alerts</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Get notified when candidates apply or advance stages.</p>
        </div>

        <div className="space-y-5 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-emerald-600">New Applications</h3>
              <p className="text-xs font-medium text-slate-500">Email notifications when a new candidate applies.</p>
            </div>
            {renderToggle(newApplications, setNewApplications)}
          </div>

          <div className="flex items-center justify-between pt-5">
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-emerald-600">In-App Alerts</h3>
              <p className="text-xs font-medium text-slate-500">Pop-up notifications within the dashboard.</p>
            </div>
            {renderToggle(inAppAlerts, setInAppAlerts)}
          </div>
        </div>
      </div>

      {/* 2. Interview Reminders Card */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900">Interview Reminders</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Manage notifications for upcoming interviews.</p>
        </div>

        <div className="space-y-5 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-emerald-600">Daily Digest</h3>
              <p className="text-xs font-medium text-slate-500">Receive a morning summary of today's interviews.</p>
            </div>
            {renderToggle(dailyDigest, setDailyDigest)}
          </div>

          <div className="flex items-center justify-between pt-5">
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-emerald-600">15-Minute Warning</h3>
              <p className="text-xs font-medium text-slate-500">In-app reminder before an interview starts.</p>
            </div>
            {renderToggle(fifteenMinWarning, setFifteenMinWarning)}
          </div>
        </div>
      </div>

      {/* 3. System Updates Card */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900">System Updates</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Stay informed about platform changes and maintenance.</p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="space-y-0.5 pt-2">
            <h3 className="text-xs font-black text-emerald-600">Product Updates</h3>
            <p className="text-xs font-medium text-slate-500">Occasional emails about new features and improvements.</p>
          </div>
          {renderToggle(productUpdates, setProductUpdates)}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
