import { useState } from 'react';
import NotificationPreferenceRow from './NotificationPreferenceRow';

export default function RecruiterNotificationSettings({ serverSnapshot, onSave }) {
  const [prevSnapshot, setPrevSnapshot] = useState(serverSnapshot);
  const [prefs, setPrefs] = useState(() => {
    const initial = {
      new_applications: true,
      in_app_alerts: true,
      daily_digest: false,
      fifteen_min_warning: true,
      product_updates: false
    };
    if (serverSnapshot?.definitions) {
      serverSnapshot.definitions.forEach((def) => {
        initial[def.key] = def.enabled;
      });
    }
    return initial;
  });

  if (serverSnapshot !== prevSnapshot) {
    setPrevSnapshot(serverSnapshot);
    if (serverSnapshot?.definitions) {
      const mapped = { ...prefs };
      serverSnapshot.definitions.forEach((def) => {
        mapped[def.key] = def.enabled;
      });
      setPrefs(mapped);
    }
  }

  const handleToggle = (key, val) => {
    setPrefs((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex-1">
      {/* 1. Application Alerts Card */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900">Application Alerts</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Get notified when candidates apply or advance stages.</p>
        </div>

        <div className="space-y-4 divide-y divide-slate-100">
          <NotificationPreferenceRow
            label="New Applications"
            description="Email notifications when a new candidate applies."
            checked={prefs.new_applications ?? true}
            onChange={(val) => handleToggle('new_applications', val)}
          />
          <NotificationPreferenceRow
            label="In-App Alerts"
            description="Pop-up notifications within the dashboard."
            checked={prefs.in_app_alerts ?? true}
            onChange={(val) => handleToggle('in_app_alerts', val)}
          />
        </div>
      </div>

      {/* 2. Interview Reminders Card */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900">Interview Reminders</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Manage notifications for upcoming interviews.</p>
        </div>

        <div className="space-y-4 divide-y divide-slate-100">
          <NotificationPreferenceRow
            label="Daily Digest"
            description="Receive a morning summary of today's interviews."
            checked={prefs.daily_digest ?? false}
            onChange={(val) => handleToggle('daily_digest', val)}
          />
          <NotificationPreferenceRow
            label="15-Minute Warning"
            description="In-app reminder before an interview starts."
            checked={prefs.fifteen_min_warning ?? true}
            onChange={(val) => handleToggle('fifteen_min_warning', val)}
          />
        </div>
      </div>

      {/* 3. System Updates Card */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900">System Updates</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Stay informed about platform changes and maintenance.</p>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <NotificationPreferenceRow
            label="Product Updates"
            description="Occasional emails about new features and improvements."
            checked={prefs.product_updates ?? false}
            onChange={(val) => handleToggle('product_updates', val)}
          />
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
