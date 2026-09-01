import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const DEFAULT_SETTINGS = {
  preferredLanguage: "English",
  timeZone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12-hour",
  inAppNotifications: true,
  emailNotifications: true,
  recruiterCreationUpdates: true,
  recruiterStatusUpdates: true,
  companyInformationUpdates: true,
  securityAlerts: true
};

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [saveWarning, setSaveWarning] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [error, setError] = useState(null);

  // Settings states
  const [settings, setSettings] = useState(() => {
    try {
      const savedKey = `statejobz:admin:current-admin:settings:v1`;
      const localData = localStorage.getItem(savedKey);
      if (localData) {
        const parsed = JSON.parse(localData);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse settings from localStorage, fallback to defaults.", e);
    }
    return DEFAULT_SETTINGS;
  });

  const [draftSettings, setDraftSettings] = useState(settings);

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState({});



  const handleChange = (key, value) => {
    setDraftSettings(prev => {
      const next = { ...prev, [key]: value };
      // Check if actually different from current saved state
      const diff = Object.keys(DEFAULT_SETTINGS).some(k => next[k] !== settings[k]);
      setHasUnsavedChanges(diff);
      return next;
    });
    setSaveWarning(null);
  };

  const handleCancelChanges = () => {
    setDraftSettings(settings);
    setHasUnsavedChanges(false);
    setSaveWarning(null);
    setError(null);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    try {
      const savedKey = `statejobz:admin:current-admin:settings:v1`;
      localStorage.setItem(savedKey, JSON.stringify(draftSettings));
      setSettings(draftSettings);
      setHasUnsavedChanges(false);
      setSaveWarning("Settings saved on this device.");
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Unable to save settings to localStorage.");
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset settings to default options?")) {
      try {
        const savedKey = `statejobz:admin:current-admin:settings:v1`;
        localStorage.removeItem(savedKey);
        setSettings(DEFAULT_SETTINGS);
        setDraftSettings(DEFAULT_SETTINGS);
        setHasUnsavedChanges(false);
        setSaveWarning("Settings reset to defaults on this device.");
        setError(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordState.currentPassword || !passwordState.newPassword || !passwordState.confirmNewPassword) {
      setError("Every password field is required.");
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmNewPassword) {
      setError("New password confirmation does not match.");
      return;
    }
    setError("Password changes will be available after backend integration.");
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-[13px] font-normal text-slate-500 mt-1">
          Manage your preferences, notifications, and account security.
        </p>
      </div>

      {/* Main settings panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-5xl items-start">
        
        {/* Navigation Sidebar Panel */}
        <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col gap-1.5 lg:col-span-1">
          <button 
            type="button"
            onClick={() => { setActiveSection('general'); setError(null); setSaveWarning(null); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer border-none bg-transparent ${
              activeSection === 'general' ? 'bg-indigo-50 text-[#4A1DDF]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            General Settings
          </button>
          <button 
            type="button"
            onClick={() => { setActiveSection('notifications'); setError(null); setSaveWarning(null); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer border-none bg-transparent ${
              activeSection === 'notifications' ? 'bg-indigo-50 text-[#4A1DDF]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            Notifications
          </button>
          <button 
            type="button"
            onClick={() => { setActiveSection('security'); setError(null); setSaveWarning(null); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer border-none bg-transparent ${
              activeSection === 'security' ? 'bg-indigo-50 text-[#4A1DDF]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* Content Panel Box */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 p-6 space-y-6">
          
          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-lg bg-red-50 border border-red-150 text-[13px] font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saveWarning && (
            <div className="flex items-center gap-2 p-3.5 rounded-lg bg-green-50 border border-green-150 text-[13px] font-medium text-green-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{saveWarning}</span>
            </div>
          )}

          {/* General settings tab details */}
          {activeSection === 'general' && (
            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="text-[16px] font-semibold text-slate-900">General Preferences</h3>
                <button 
                  type="button"
                  onClick={handleResetToDefaults}
                  className="text-[12px] font-bold text-red-650 hover:underline cursor-pointer"
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-705">Preferred Language</label>
                  <select
                    value={draftSettings.preferredLanguage}
                    onChange={(e) => handleChange('preferredLanguage', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-700 bg-white focus:outline-none min-h-[40px] cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-705">Time Zone</label>
                  <select
                    value={draftSettings.timeZone}
                    onChange={(e) => handleChange('timeZone', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-700 bg-white focus:outline-none min-h-[40px] cursor-pointer"
                  >
                    <option value="Asia/Kolkata">India Standard Time (Asia/Kolkata)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-705">Date Format</label>
                  <select
                    value={draftSettings.dateFormat}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-700 bg-white focus:outline-none min-h-[40px] cursor-pointer"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-705">Time Format</label>
                  <select
                    value={draftSettings.timeFormat}
                    onChange={(e) => handleChange('timeFormat', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-[14px] font-medium text-slate-700 bg-white focus:outline-none min-h-[40px] cursor-pointer"
                  >
                    <option value="12-hour">12-hour</option>
                    <option value="24-hour">24-hour</option>
                  </select>
                </div>
              </div>

              {hasUnsavedChanges && (
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                  <button 
                    type="button"
                    onClick={handleCancelChanges}
                    className="rounded-lg border border-slate-200 px-4.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] px-5 py-2 text-[13px] font-semibold text-white transition-colors cursor-pointer min-h-[44px]"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Notifications Section preferences */}
          {activeSection === 'notifications' && (
            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="text-[16px] font-semibold text-slate-900">Notification Preferences</h3>
                <button 
                  type="button"
                  onClick={handleResetToDefaults}
                  className="text-[12px] font-bold text-red-650 hover:underline cursor-pointer"
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-[14px] font-semibold text-slate-805">In-app notifications</h4>
                    <p className="text-[12px] font-medium text-slate-400">Receive notifications inside the Admin Portal.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={draftSettings.inAppNotifications}
                    onChange={(e) => handleChange('inAppNotifications', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF]"
                  />
                </div>

                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-[14px] font-semibold text-slate-805">Email notifications</h4>
                    <p className="text-[12px] font-medium text-slate-400">Receive important updates through email.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={draftSettings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF]"
                  />
                </div>

                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-[14px] font-semibold text-slate-805">Recruiter account creation updates</h4>
                    <p className="text-[12px] font-medium text-slate-400">Receive updates when recruiter accounts are created.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={draftSettings.recruiterCreationUpdates}
                    onChange={(e) => handleChange('recruiterCreationUpdates', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF]"
                  />
                </div>

                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-[14px] font-semibold text-slate-805">Recruiter activation and status updates</h4>
                    <p className="text-[12px] font-medium text-slate-400">Receive activation, suspension, and status-change updates.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={draftSettings.recruiterStatusUpdates}
                    onChange={(e) => handleChange('recruiterStatusUpdates', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF]"
                  />
                </div>

                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-[14px] font-semibold text-slate-805">Company information updates</h4>
                    <p className="text-[12px] font-medium text-slate-400">Receive updates when company information changes.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={draftSettings.companyInformationUpdates}
                    onChange={(e) => handleChange('companyInformationUpdates', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] accent-[#4A1DDF]"
                  />
                </div>

                <div className="flex items-start justify-between opacity-80">
                  <div className="space-y-0.5">
                    <h4 className="text-[14px] font-semibold text-slate-805">Important security alerts</h4>
                    <p className="text-[12px] font-medium text-slate-400">Receive critical login and account-security alerts.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={draftSettings.securityAlerts}
                    disabled={true}
                    className="h-4 w-4 rounded border-slate-300 text-[#4A1DDF] focus:ring-[#4A1DDF] cursor-not-allowed"
                  />
                </div>
              </div>

              {hasUnsavedChanges && (
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                  <button 
                    type="button"
                    onClick={handleCancelChanges}
                    className="rounded-lg border border-slate-200 px-4.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] px-5 py-2 text-[13px] font-semibold text-white transition-colors cursor-pointer min-h-[44px]"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Security & Password settings section */}
          {activeSection === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <h3 className="text-[16px] font-semibold text-slate-900 border-b border-slate-100 pb-3">Security & Password</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-705">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordState.currentPassword}
                      onChange={(e) => setPasswordState(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      className="w-full rounded-lg border border-slate-200 pl-3.5 pr-10 py-2 text-[14px] font-medium text-slate-805 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                    />
                    <button 
                      type="button" 
                      onClick={() => toggleShowPassword('current')}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-655"
                    >
                      {showPassword.current ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-705">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                      className="w-full rounded-lg border border-slate-200 pl-3.5 pr-10 py-2 text-[14px] font-medium text-slate-805 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                    />
                    <button 
                      type="button" 
                      onClick={() => toggleShowPassword('new')}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-655"
                    >
                      {showPassword.new ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-705">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordState.confirmNewPassword}
                      onChange={(e) => setPasswordState(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      className="w-full rounded-lg border border-slate-200 pl-3.5 pr-10 py-2 text-[14px] font-medium text-slate-805 focus:border-[#4A1DDF] focus:outline-none min-h-[40px]"
                    />
                    <button 
                      type="button" 
                      onClick={() => toggleShowPassword('confirm')}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-655"
                    >
                      {showPassword.confirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button 
                  type="submit"
                  className="rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] px-5 py-2 text-[13px] font-semibold text-white transition-colors cursor-pointer min-h-[44px]"
                >
                  Change Password
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
export { DEFAULT_SETTINGS };
// Temporary frontend persistence:
// Profile photo and Admin preferences are stored on this device
// until Django profile/settings endpoints are connected.
//
// Future integration:
// Replace localStorage persistence with authenticated backend APIs.
// Keep the current component interfaces and UI behavior.
