import { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Bell, 
  UserCheck, 
  Building2, 
  MapPin, 
  Monitor, 
  Loader2 
} from 'lucide-react';
import { 
  getAdminSettings, 
  updateAdminSettings, 
  changeAdminPassword 
} from '../../services/admin/adminSettingsService';

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general'); // 'general' | 'notifications' | 'security'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // General Form
  const [generalForm, setGeneralForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
  });

  // Notifications Form
  const [notifForm, setNotifForm] = useState({
    in_app: true,
    email: true,
    recruiter_creation: true,
    recruiter_status: true,
    job_moderation: true,
    security_alerts: true,
  });

  // Security Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPassword, setShowPassword] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Live Session / Security Status
  const [accountMeta, setAccountMeta] = useState({
    role: 'ADMIN',
    status: 'ACTIVE',
    last_login: 'Active Now',
    date_joined: '',
    active_session: {
      ip_address: '127.0.0.1',
      device: 'Current Web Browser',
      status: 'Active Now',
    },
  });

  // Load live settings from database on mount
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const data = await getAdminSettings();
        if (!isMounted) return;

        setGeneralForm({
          full_name: data.full_name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
        });

        setNotifForm({
          in_app: data.notification_preferences?.in_app ?? true,
          email: data.notification_preferences?.email ?? true,
          recruiter_creation: data.notification_preferences?.recruiter_creation ?? true,
          recruiter_status: data.notification_preferences?.recruiter_status ?? true,
          job_moderation: data.notification_preferences?.job_moderation ?? true,
          security_alerts: true,
        });

        setAccountMeta({
          role: data.role || 'ADMIN',
          status: data.status || 'ACTIVE',
          last_login: data.last_login || 'Active Now',
          date_joined: data.date_joined || '',
          active_session: data.active_session || {
            ip_address: '127.0.0.1',
            device: 'Current Web Browser',
            status: 'Active Now',
          },
        });
      } catch (err) {
        console.error('Failed to load admin settings:', err);
        if (isMounted) setErrorMsg('Unable to load account settings from server. Please refresh.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4500);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 6000);
  };

  // Save General Preferences
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await updateAdminSettings({
        full_name: generalForm.full_name,
        phone_number: generalForm.phone_number,
      });
      showSuccess('Administrator profile updated successfully.');
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to update administrator profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Notification Preferences
  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await updateAdminSettings({
        notification_preferences: {
          in_app: notifForm.in_app,
          email: notifForm.email,
          recruiter_creation: notifForm.recruiter_creation,
          recruiter_status: notifForm.recruiter_status,
          job_moderation: notifForm.job_moderation,
        },
      });
      showSuccess('Notification preferences saved directly to your account.');
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to save notification preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!passwordForm.currentPassword) {
      showError('Please enter your current password.');
      return;
    }
    if (!passwordForm.newPassword) {
      showError('Please enter your new password.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showError('New password must be at least 8 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      showError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      });

      showSuccess(res.message || 'Password changed successfully! Please remember your new password.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to update password. Please check your credentials.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 font-sans text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A1DDF]" />
        <span className="text-sm font-semibold">Loading Administrator Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-10">
      {/* Header title */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-[#4A1DDF] border border-purple-100">
            Live
          </span>
        </div>
        <p className="text-sm font-medium text-slate-600 mt-1">
          Manage your administrator profile, operational preferences, notification channels, and account security.
        </p>
      </div>

      {/* Global Alerts */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-bold text-red-700 shadow-2xs">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span className="flex-1">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-800 shadow-2xs">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span className="flex-1">{successMsg}</span>
        </div>
      )}

      {/* Main settings panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-5xl items-start">
        {/* Navigation Sidebar Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2.5 flex flex-col gap-1.5 lg:col-span-1 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setActiveSection('general');
              setErrorMsg(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
              activeSection === 'general'
                ? 'bg-purple-50 text-[#4A1DDF] shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <UserCheck className="h-4.5 w-4.5 shrink-0" />
            <span>General Settings</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSection('notifications');
              setErrorMsg(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
              activeSection === 'notifications'
                ? 'bg-purple-50 text-[#4A1DDF] shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Bell className="h-4.5 w-4.5 shrink-0" />
            <span>Notifications</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSection('security');
              setErrorMsg(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
              activeSection === 'security'
                ? 'bg-purple-50 text-[#4A1DDF] shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Content Panel Box */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-2xs">
          {/* TAB 1: GENERAL SETTINGS */}
          {activeSection === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="text-lg font-black text-slate-900">Administrator Profile</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Your identity details saved directly to the database.
                </p>
              </div>

              {/* Admin Identity */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={generalForm.full_name}
                    onChange={(e) => setGeneralForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Administrator Name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-[#4A1DDF] focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={generalForm.email}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-500 cursor-not-allowed"
                    />
                    <span className="text-[11px] font-semibold text-slate-400">
                      Email is bound to your primary authentication identity.
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                      Official Phone Number
                    </label>
                    <input
                      type="tel"
                      value={generalForm.phone_number}
                      onChange={(e) => setGeneralForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-[#4A1DDF] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#4A1DDF] hover:bg-[#3B15CA] px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-purple-600/15 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="text-lg font-black text-slate-900">Notification Preferences</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Control which operational events trigger platform alerts and emails. Preferences are synced to your database profile.
                </p>
              </div>

              <div className="space-y-4">
                {/* In-app */}
                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-150 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="text-sm font-bold text-slate-850">In-app portal notifications</h4>
                    <p className="text-xs font-medium text-slate-500">
                      Receive notifications and badge counts inside the Admin Portal bell icon.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.in_app}
                    onChange={(e) => setNotifForm((prev) => ({ ...prev, in_app: e.target.checked }))}
                    className="h-5 w-5 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF] cursor-pointer shrink-0 mt-0.5"
                  />
                </div>

                {/* Email */}
                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-150 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="text-sm font-bold text-slate-850">Email notifications</h4>
                    <p className="text-xs font-medium text-slate-500">
                      Receive important platform updates and verification summaries at your official email.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.email}
                    onChange={(e) => setNotifForm((prev) => ({ ...prev, email: e.target.checked }))}
                    className="h-5 w-5 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF] cursor-pointer shrink-0 mt-0.5"
                  />
                </div>

                {/* Recruiter creation */}
                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-150 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="text-sm font-bold text-slate-850">Recruiter account registrations</h4>
                    <p className="text-xs font-medium text-slate-500">
                      Receive instant notification whenever a new employer or recruiter registers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.recruiter_creation}
                    onChange={(e) => setNotifForm((prev) => ({ ...prev, recruiter_creation: e.target.checked }))}
                    className="h-5 w-5 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF] cursor-pointer shrink-0 mt-0.5"
                  />
                </div>

                {/* Recruiter status */}
                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-150 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="text-sm font-bold text-slate-850">Recruiter verification & status changes</h4>
                    <p className="text-xs font-medium text-slate-500">
                      Receive updates when employer documents are submitted or review status changes.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.recruiter_status}
                    onChange={(e) => setNotifForm((prev) => ({ ...prev, recruiter_status: e.target.checked }))}
                    className="h-5 w-5 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF] cursor-pointer shrink-0 mt-0.5"
                  />
                </div>

                {/* Job moderation */}
                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-150 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="text-sm font-bold text-slate-850">Job moderation queue alerts</h4>
                    <p className="text-xs font-medium text-slate-500">
                      Receive alerts when new jobs are posted by unverified employers awaiting moderation.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForm.job_moderation}
                    onChange={(e) => setNotifForm((prev) => ({ ...prev, job_moderation: e.target.checked }))}
                    className="h-5 w-5 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF] cursor-pointer shrink-0 mt-0.5"
                  />
                </div>

                {/* Security (locked) */}
                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-150 bg-slate-50/60">
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-850">Important security & access alerts</h4>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                        Mandatory
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Critical login attempts, failed passwords, and account security notifications (Always active).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    className="h-5 w-5 rounded border-slate-300 text-[#4A1DDF] cursor-not-allowed shrink-0 mt-0.5 accent-[#4A1DDF]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#4A1DDF] hover:bg-[#3B15CA] px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-purple-600/15 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeSection === 'security' && (
            <div className="space-y-8">
              {/* Change Password Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="border-b border-slate-150 pb-4">
                  <h3 className="text-lg font-black text-slate-900">Change Account Password</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Update your password securely. Changes take effect immediately in the database.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        className="w-full rounded-xl border border-slate-200 pl-4 pr-11 py-2.5 text-sm font-bold text-slate-800 focus:border-[#4A1DDF] focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword.current ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password (at least 8 characters)"
                        className="w-full rounded-xl border border-slate-200 pl-4 pr-11 py-2.5 text-sm font-bold text-slate-800 focus:border-[#4A1DDF] focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword.new ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Password must be at least 8 characters long and cannot match your current password.
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        required
                        value={passwordForm.confirmNewPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        className="w-full rounded-xl border border-slate-200 pl-4 pr-11 py-2.5 text-sm font-bold text-slate-800 focus:border-[#4A1DDF] focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword.confirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="rounded-xl bg-[#4A1DDF] hover:bg-[#3B15CA] px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-purple-600/15 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Change Password</span>
                  </button>
                </div>
              </form>

              {/* Active Session & Account Security Overview Card */}
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <h4 className="text-sm font-black text-slate-850">Security & Session Overview</h4>
                  </div>
                  <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-black uppercase tracking-wider">
                    {accountMeta.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                      Assigned Role
                    </span>
                    <span className="text-slate-900 font-extrabold">{accountMeta.role}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                      Last Authentication
                    </span>
                    <span className="text-slate-900 font-extrabold">{accountMeta.last_login}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                      Active IP Address
                    </span>
                    <span className="text-slate-900 font-mono font-bold">
                      {accountMeta.active_session?.ip_address || '127.0.0.1'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                      Client Environment
                    </span>
                    <span className="text-slate-900 font-bold truncate max-w-[200px] block">
                      {accountMeta.active_session?.device || 'Current Browser'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
