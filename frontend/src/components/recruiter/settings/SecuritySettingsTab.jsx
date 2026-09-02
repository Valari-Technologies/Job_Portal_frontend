import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export default function SecuritySettingsTab({ onSave }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    onSave('security', { currentPassword, newPassword });
    setMessage({ type: 'success', text: 'Password updated successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 flex-1">
      {/* 1. Password Management Card */}
      <form onSubmit={handleUpdatePassword} className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="h-5 w-5 text-indigo-600 shrink-0" />
          <h2 className="text-base font-black text-slate-900">Password Management</h2>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {message && (
          <div className={`p-3 rounded-xl text-xs font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* New & Confirm Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* 2. Two-Factor Auth Card */}
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
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
            Enabled
          </span>
        </div>

        <button
          type="button"
          className="w-full py-2.5 px-4 rounded-xl border border-indigo-600 bg-white text-indigo-600 text-xs font-black hover:bg-indigo-50 transition-colors cursor-pointer"
        >
          Manage 2FA Settings
        </button>
      </div>
    </div>
  );
}
