import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function RecruiterPasswordForm({ onUpdatePassword }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    onUpdatePassword({ currentPassword, newPassword });
    setMessage({ type: 'success', text: 'Password update request submitted.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs">
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
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Enter current password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-3.5 pr-10 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New & Confirm Password Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-3.5 pr-10 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-3.5 pr-10 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
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
  );
}
