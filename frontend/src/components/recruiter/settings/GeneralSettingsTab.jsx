import { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';

export default function GeneralSettingsTab({ initialData, onSave }) {
  const [fullName, setFullName] = useState(initialData?.full_name || 'Jane Doe');
  const [email, setEmail] = useState(initialData?.email || 'jane.doe@nexusrecruit.com');
  const [language, setLanguage] = useState(initialData?.language || 'English (US)');
  const [timezone, setTimezone] = useState(initialData?.timezone || 'Pacific Time (PT)');
  const [avatar, setAvatar] = useState(initialData?.avatar || null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('general', { fullName, email, language, timezone, avatar });
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

        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-slate-400" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black cursor-pointer hover:bg-indigo-100 transition-colors">
                <span>Change Avatar</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>

              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
            <p className="text-[11px] font-bold text-slate-400">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Language Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Language</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 pl-3.5 pr-9 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Time Zone Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Time Zone</label>
            <div className="relative">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 pl-3.5 pr-9 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                <option value="Central Time (CT)">Central Time (CT)</option>
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
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
