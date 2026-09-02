import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import RecruiterAvatarControl from './RecruiterAvatarControl';

export default function RecruiterGeneralSettings({ serverSnapshot, onSave }) {
  const [prevSnapshot, setPrevSnapshot] = useState(serverSnapshot);
  const [draft, setDraft] = useState({
    fullName: serverSnapshot?.full_name || '',
    email: serverSnapshot?.email || '',
    language: serverSnapshot?.language || 'English (US)',
    timezone: serverSnapshot?.timezone || 'Pacific Time (PT)',
    avatarUrl: serverSnapshot?.avatar_url || null
  });

  if (serverSnapshot !== prevSnapshot) {
    setPrevSnapshot(serverSnapshot);
    setDraft({
      fullName: serverSnapshot?.full_name || '',
      email: serverSnapshot?.email || '',
      language: serverSnapshot?.language || 'English (US)',
      timezone: serverSnapshot?.timezone || 'Pacific Time (PT)',
      avatarUrl: serverSnapshot?.avatar_url || null
    });
  }

  const isDirty =
    draft.fullName !== (serverSnapshot?.full_name || '') ||
    draft.language !== (serverSnapshot?.language || 'English (US)') ||
    draft.timezone !== (serverSnapshot?.timezone || 'Pacific Time (PT)') ||
    draft.avatarUrl !== (serverSnapshot?.avatar_url || null);

  const handleAvatarChange = (_file, previewUrl) => {
    setDraft((prev) => ({ ...prev, avatarUrl: previewUrl }));
  };

  const handleAvatarRemove = () => {
    setDraft((prev) => ({ ...prev, avatarUrl: null }));
  };

  const handleCancel = () => {
    setDraft({
      fullName: serverSnapshot?.full_name || '',
      email: serverSnapshot?.email || '',
      language: serverSnapshot?.language || 'English (US)',
      timezone: serverSnapshot?.timezone || 'Pacific Time (PT)',
      avatarUrl: serverSnapshot?.avatar_url || null
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isDirty) return;
    onSave(draft);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex-1">
      {/* Account Information Card */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900">Account Information</h2>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Update your basic profile and contact details.</p>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Avatar Control */}
        <RecruiterAvatarControl
          avatarUrl={draft.avatarUrl}
          onAvatarChange={handleAvatarChange}
          onAvatarRemove={handleAvatarRemove}
        />

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={draft.fullName}
              onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email Address (Read-only for security) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <span className="text-[10px] font-extrabold text-slate-400">Read-Only</span>
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={draft.email}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Language Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Language</label>
            <div className="relative">
              <select
                value={draft.language}
                onChange={(e) => setDraft({ ...draft, language: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 pl-3.5 pr-9 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {(serverSnapshot?.supported_languages || [
                  "English (US)",
                  "English (UK)",
                  "Spanish",
                  "French",
                  "German"
                ]).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Time Zone Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Time Zone</label>
            <div className="relative">
              <select
                value={draft.timezone}
                onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 pl-3.5 pr-9 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {(serverSnapshot?.supported_timezones || [
                  "Pacific Time (PT)",
                  "Eastern Time (ET)",
                  "Central Time (CT)",
                  "Mountain Time (MT)",
                  "Asia/Kolkata (IST)",
                  "UTC"
                ]).map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={!isDirty}
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isDirty}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
