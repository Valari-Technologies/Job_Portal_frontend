import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all required password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password fields do not match.');
      return;
    }
    
    // Mimic saving success
    alert('Password updated successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-sm border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Change Password
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-sm font-bold text-slate-700">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
