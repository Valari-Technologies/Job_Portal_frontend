import React, { useState, useEffect } from 'react';
import { Lock, Mail, Phone, ShieldAlert, LogOut, X, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

export default function Settings() {
  // --- First Row States ---
  // Notification Toggle States
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    appUpdates: true,
    interviewReminders: true,
    assessmentNotifications: false,
    emailNotifications: true,
    smsNotifications: false
  });

  // Privacy Options States
  const [profileVisibility, setProfileVisibility] = useState('Public');
  const [resumeVisibility, setResumeVisibility] = useState('Recruiters Only');
  const [allowRecruiters, setAllowRecruiters] = useState(true);
  const [hideProfile, setHideProfile] = useState(false);
  const [previousVisibility, setPreviousVisibility] = useState('Public');

  // --- Second Row States ---
  // Security States
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [activeSessions, setActiveSessions] = useState(3);
  const [lastLogin, setLastLogin] = useState('07 Aug 2026, 04:30 PM');
  const [loginLocation, setLoginLocation] = useState('Bengaluru, India');

  // Preferences States
  const [prefLocation, setPrefLocation] = useState('Bengaluru');
  const [prefDepartment, setPrefDepartment] = useState('UI/UX Design');
  const [prefJobType, setPrefJobType] = useState('Full-time');
  const [prefLanguage, setPrefLanguage] = useState('English');

  // Modal Control States
  const [activeModal, setActiveModal] = useState(null); // 'password' | 'email' | 'phone' | 'delete' | 'logoutConfirm' | 'logoutAllConfirm'
  
  // Validation Messages
  const [validationMsg, setValidationMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Inputs
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [phoneForm, setPhoneForm] = useState({ phone: '', password: '' });

  // Load from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('settings_notifications');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

    const savedProfileVis = localStorage.getItem('settings_profileVisibility');
    if (savedProfileVis) setProfileVisibility(savedProfileVis);

    const savedPrevVis = localStorage.getItem('settings_previousVisibility');
    if (savedPrevVis) setPreviousVisibility(savedPrevVis);

    const savedResumeVis = localStorage.getItem('settings_resumeVisibility');
    if (savedResumeVis) setResumeVisibility(savedResumeVis);

    const savedAllowRec = localStorage.getItem('settings_allowRecruiters');
    if (savedAllowRec !== null) setAllowRecruiters(JSON.parse(savedAllowRec));

    const savedHideProfile = localStorage.getItem('settings_hideProfile');
    if (savedHideProfile !== null) setHideProfile(JSON.parse(savedHideProfile));

    const saved2FA = localStorage.getItem('settings_2fa');
    if (saved2FA !== null) setIs2FAEnabled(JSON.parse(saved2FA));

    const savedSessions = localStorage.getItem('settings_sessions');
    if (savedSessions !== null) setActiveSessions(JSON.parse(savedSessions));

    const savedLoc = localStorage.getItem('settings_prefLocation');
    if (savedLoc) setPrefLocation(savedLoc);

    const savedDept = localStorage.getItem('settings_prefDept');
    if (savedDept) setPrefDepartment(savedDept);

    const savedJobType = localStorage.getItem('settings_prefJobType');
    if (savedJobType) setPrefJobType(savedJobType);

    const savedLang = localStorage.getItem('settings_prefLang');
    if (savedLang) setPrefLanguage(savedLang);
  }, []);

  // Sync helpers
  const handleNotifToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('settings_notifications', JSON.stringify(updated));
  };

  const handleProfileVisChange = (e) => {
    const value = e.target.value;
    setProfileVisibility(value);
    localStorage.setItem('settings_profileVisibility', value);
    if (value !== 'Private' && !hideProfile) {
      setPreviousVisibility(value);
      localStorage.setItem('settings_previousVisibility', value);
    }
  };

  const handleResumeVisChange = (e) => {
    const value = e.target.value;
    setResumeVisibility(value);
    localStorage.setItem('settings_resumeVisibility', value);
  };

  const handleAllowRecToggle = () => {
    const nextVal = !allowRecruiters;
    setAllowRecruiters(nextVal);
    localStorage.setItem('settings_allowRecruiters', JSON.stringify(nextVal));
  };

  const handleHideProfileToggle = () => {
    const nextVal = !hideProfile;
    setHideProfile(nextVal);
    localStorage.setItem('settings_hideProfile', JSON.stringify(nextVal));

    if (nextVal) {
      if (profileVisibility !== 'Private') {
        setPreviousVisibility(profileVisibility);
        localStorage.setItem('settings_previousVisibility', profileVisibility);
      }
      setProfileVisibility('Private');
      localStorage.setItem('settings_profileVisibility', 'Private');
    } else {
      setProfileVisibility(previousVisibility);
      localStorage.setItem('settings_profileVisibility', previousVisibility);
    }
  };

  const toggle2FA = () => {
    const nextVal = !is2FAEnabled;
    setIs2FAEnabled(nextVal);
    localStorage.setItem('settings_2fa', JSON.stringify(nextVal));
  };

  const handlePrefChange = (setter, key, value) => {
    setter(value);
    localStorage.setItem(key, value);
  };

  // Form Submit Handlers
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setValidationMsg('');
    setSuccessMsg('');

    if (passwordForm.new.length < 6) {
      setValidationMsg('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setValidationMsg('New passwords do not match.');
      return;
    }

    setSuccessMsg('Password changed successfully.');
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setActiveModal(null), 1500);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setValidationMsg('');
    setSuccessMsg('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.email)) {
      setValidationMsg('Please enter a valid email address.');
      return;
    }
    if (!emailForm.password) {
      setValidationMsg('Password is required.');
      return;
    }

    setSuccessMsg('Email updated successfully.');
    setEmailForm({ email: '', password: '' });
    setTimeout(() => setActiveModal(null), 1500);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setValidationMsg('');
    setSuccessMsg('');

    if (phoneForm.phone.length < 10) {
      setValidationMsg('Please enter a valid phone number.');
      return;
    }
    if (!phoneForm.password) {
      setValidationMsg('Password is required.');
      return;
    }

    setSuccessMsg('Phone number updated successfully.');
    setPhoneForm({ phone: '', password: '' });
    setTimeout(() => setActiveModal(null), 1500);
  };

  const handleLogoutAllDevicesConfirm = () => {
    setActiveSessions(1);
    localStorage.setItem('settings_sessions', JSON.stringify(1));
    setActiveModal(null);
    alert('Logged out from all other devices successfully.');
  };

  const handleDeleteAccountConfirm = () => {
    localStorage.clear();
    setActiveModal(null);
    window.location.href = '/register';
  };

  const handleDownloadData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'job_portal_profile_settings_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    setActiveModal('logoutConfirm');
  };

  // Custom Switch Component
  const CustomToggle = ({ isOn, onToggle, label }) => {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors outline-none ${
          isOn ? 'bg-[#E29D29]' : 'bg-slate-200'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full shadow-sm flex items-center justify-center transform transition-transform duration-200 ${
            isOn ? 'translate-x-6 bg-[#8CC63F] text-white' : 'translate-x-0 bg-white text-transparent'
          }`}
        >
          {isOn ? (
            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300/40" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="px-2 sm:px-6 md:px-8 mt-4 flex-grow space-y-6 animate-in fade-in duration-300 select-none text-left font-sans w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#84A43C] tracking-tight">Settings</h1>
        <p className="text-sm font-semibold text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Row 1: Account, Notifications, Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
        
        {/* Account Column */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-xs p-6 space-y-6 min-h-[380px]">
          <h2 className="text-xl font-bold text-[#3562D6]">Account</h2>
          <div className="space-y-5 text-sm font-bold text-slate-600 text-left">
            <button 
              type="button" 
              onClick={() => { setValidationMsg(''); setSuccessMsg(''); setActiveModal('password'); }}
              className="flex items-center gap-3 w-full py-2 hover:text-[#3562D6] transition-colors cursor-pointer text-left focus:outline-none"
            >
              <Lock className="w-5 h-5 text-slate-400 shrink-0" />
              <span>Change Password</span>
            </button>
            <button 
              type="button" 
              onClick={() => { setValidationMsg(''); setSuccessMsg(''); setActiveModal('email'); }}
              className="flex items-center gap-3 w-full py-2 hover:text-[#3562D6] transition-colors cursor-pointer text-left focus:outline-none"
            >
              <Mail className="w-5 h-5 text-slate-400 shrink-0" />
              <span>Change Email</span>
            </button>
            <button 
              type="button" 
              onClick={() => { setValidationMsg(''); setSuccessMsg(''); setActiveModal('phone'); }}
              className="flex items-center gap-3 w-full py-2 hover:text-[#3562D6] transition-colors cursor-pointer text-left focus:outline-none"
            >
              <Phone className="w-5 h-5 text-slate-400 shrink-0" />
              <span>Change Phone Number</span>
            </button>
          </div>
        </div>

        {/* Notifications Column */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-xs p-6 space-y-6 min-h-[380px]">
          <h2 className="text-xl font-bold text-[#3562D6]">Notifications</h2>
          <div className="space-y-4 text-sm font-bold text-slate-600 text-left">
            <div className="flex items-center justify-between py-1">
              <span>Job Alerts</span>
              <CustomToggle isOn={notifications.jobAlerts} onToggle={() => handleNotifToggle('jobAlerts')} label="Job Alerts" />
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Application Updates</span>
              <CustomToggle isOn={notifications.appUpdates} onToggle={() => handleNotifToggle('appUpdates')} label="Application Updates" />
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Interview Reminders</span>
              <CustomToggle isOn={notifications.interviewReminders} onToggle={() => handleNotifToggle('interviewReminders')} label="Interview Reminders" />
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Assessment Notifications</span>
              <CustomToggle isOn={notifications.assessmentNotifications} onToggle={() => handleNotifToggle('assessmentNotifications')} label="Assessment Notifications" />
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Email Notifications</span>
              <CustomToggle isOn={notifications.emailNotifications} onToggle={() => handleNotifToggle('emailNotifications')} label="Email Notifications" />
            </div>
            <div className="flex items-center justify-between py-1">
              <span>SMS Notifications</span>
              <CustomToggle isOn={notifications.smsNotifications} onToggle={() => handleNotifToggle('smsNotifications')} label="SMS Notifications" />
            </div>
          </div>
        </div>

        {/* Privacy Column */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-xs p-6 space-y-6 min-h-[380px]">
          <h2 className="text-xl font-bold text-[#3562D6]">Privacy</h2>
          <div className="space-y-4 text-sm font-bold text-slate-600 text-left">
            
             {/* Profile Visibility Dropdown (Figma style update) */}
             <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 text-left">
               <label className="text-xs text-slate-400 font-extrabold uppercase select-none">Profile Visibility</label>
               <CustomSelect
                 value={profileVisibility}
                 onChange={(val) => handleProfileVisChange({ target: { value: val } })}
                 disabled={hideProfile}
                 options={['Public', 'Recruiters Only', 'Private']}
               />
             </div>
 
             {/* Resume Visibility Dropdown (Figma style update) */}
             <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 text-left">
               <label className="text-xs text-slate-400 font-extrabold uppercase select-none">Resume Visibility</label>
               <CustomSelect
                 value={resumeVisibility}
                 onChange={(val) => handleResumeVisChange({ target: { value: val } })}
                 options={['Public', 'Recruiters Only', 'Private']}
               />
             </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Allow Recruiters to Contact</span>
              <CustomToggle isOn={allowRecruiters} onToggle={handleAllowRecToggle} label="Allow Recruiters to Contact" />
            </div>

            <div className="flex items-center justify-between">
              <span>Hide Profile</span>
              <CustomToggle isOn={hideProfile} onToggle={handleHideProfileToggle} label="Hide Profile" />
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Security, Preferences, Account Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
        
        {/* Security Column */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-xs p-6 space-y-6 min-h-[380px]">
          <h2 className="text-xl font-bold text-[#3562D6]">Security</h2>
          <div className="space-y-4 text-sm font-bold text-slate-600 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex flex-col">
                <span>Two-Factor</span>
                <span className="text-xs font-semibold text-slate-400">Authentication</span>
              </div>
              <button 
                type="button" 
                onClick={toggle2FA} 
                className="flex items-center gap-1 text-[#E29D29] hover:underline cursor-pointer focus:outline-none"
              >
                <span className="w-2.5 h-2.5 rounded-full border-2 border-[#E29D29] flex items-center justify-center text-[7px] font-black">✓</span>
                <span>{is2FAEnabled ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Active Sessions</span>
              <span className="text-emerald-600 font-bold">{activeSessions} Active</span>
            </div>

            <div className="space-y-1 pb-3 border-b border-slate-100">
              <span className="block text-xs font-semibold text-slate-400 uppercase">Last Login Details</span>
              <p className="text-slate-700 text-xs font-bold">{lastLogin}</p>
              <p className="text-slate-400 text-[10px] font-semibold">{loginLocation}</p>
            </div>

            <div className="pt-2">
              <button 
                type="button" 
                onClick={() => setActiveModal('logoutAllConfirm')} 
                className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-left focus:outline-none"
              >
                Logout from All Devices
              </button>
            </div>
          </div>
        </div>

        {/* Preferences Column */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-xs p-6 space-y-6 min-h-[380px]">
          <h2 className="text-xl font-bold text-[#3562D6]">Preferences</h2>
          <div className="space-y-4 text-sm font-bold text-slate-600 text-left">
            
            {/* Preferred Location (Figma style update) */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 text-left">
              <label className="text-xs text-slate-400 font-extrabold uppercase select-none">Preferred Location</label>
              <CustomSelect
                value={prefLocation}
                onChange={(val) => handlePrefChange(setPrefLocation, 'settings_prefLocation', val)}
                options={['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Remote']}
              />
            </div>

            {/* Preferred Department (Figma style update) */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 text-left">
              <label className="text-xs text-slate-400 font-extrabold uppercase select-none">Preferred Department</label>
              <CustomSelect
                value={prefDepartment}
                onChange={(val) => handlePrefChange(setPrefDepartment, 'settings_prefDept', val)}
                options={['Software Development', 'UI/UX Design', 'Data Science', 'Testing', 'DevOps', 'Marketing', 'HR']}
              />
            </div>

            {/* Preferred Job Type (Figma style update) */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 text-left">
              <label className="text-xs text-slate-400 font-extrabold uppercase select-none">Preferred Job Type</label>
              <CustomSelect
                value={prefJobType}
                onChange={(val) => handlePrefChange(setPrefJobType, 'settings_prefJobType', val)}
                options={['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote']}
              />
            </div>

            {/* Preferred Language (Figma style update) */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 text-left">
              <label className="text-xs text-slate-400 font-extrabold uppercase select-none">Preferred Language</label>
              <CustomSelect
                value={prefLanguage}
                onChange={(val) => handlePrefChange(setPrefLanguage, 'settings_prefLang', val)}
                options={['English', 'Tamil', 'Hindi']}
              />
            </div>
          </div>
        </div>

        {/* Account Management Column */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-xs p-6 space-y-6 min-h-[380px] flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#3562D6]">Account Management</h2>
            <div className="space-y-4 text-sm font-bold text-left">
              <div className="pb-3 border-b border-slate-100">
                <button 
                  type="button" 
                  onClick={handleDownloadData} 
                  className="text-slate-600 hover:text-slate-800 transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Download My Data
                </button>
              </div>

              <div>
                <button 
                  type="button" 
                  onClick={() => setActiveModal('delete')} 
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer text-left font-bold focus:outline-none"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Outlined Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 border border-[#8CC63F] hover:bg-[#8CC63F]/5 text-[#8CC63F] font-bold rounded-xl transition-all cursor-pointer focus:outline-none"
          >
            <span>Logout</span>
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>

      {/* --- Active Modal Dialog Popup --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-800">
                {activeModal === 'password' && 'Change Password'}
                {activeModal === 'email' && 'Change Email'}
                {activeModal === 'phone' && 'Change Phone Number'}
                {activeModal === 'delete' && 'Delete Account'}
                {activeModal === 'logoutConfirm' && 'Confirm Logout'}
                {activeModal === 'logoutAllConfirm' && 'Logout all other devices'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Messages */}
            {validationMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Modal Contents */}
            <div className="p-6 text-left">
              {activeModal === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-sm font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-extrabold uppercase">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-extrabold uppercase">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-extrabold uppercase">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C]"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#84A43C] text-white font-bold rounded-xl mt-2 cursor-pointer">
                    Update Password
                  </button>
                </form>
              )}

              {activeModal === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4 text-sm font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-extrabold uppercase">New Email Address</label>
                    <input
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C]"
                      placeholder="e.g. riya.mohan@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-extrabold uppercase">Confirm Password</label>
                    <input
                      type="password"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C]"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#84A43C] text-white font-bold rounded-xl mt-2 cursor-pointer">
                    Change Email
                  </button>
                </form>
              )}

              {activeModal === 'phone' && (
                <form onSubmit={handlePhoneSubmit} className="space-y-4 text-sm font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-extrabold uppercase">New Phone Number</label>
                    <input
                      type="tel"
                      value={phoneForm.phone}
                      onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C]"
                      placeholder="e.g. +91 98765 43210"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-extrabold uppercase">Confirm Password</label>
                    <input
                      type="password"
                      value={phoneForm.password}
                      onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#84A43C]"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#84A43C] text-white font-bold rounded-xl mt-2 cursor-pointer">
                    Change Phone Number
                  </button>
                </form>
              )}

              {activeModal === 'delete' && (
                <div className="space-y-4 text-sm font-semibold text-slate-600">
                  <p className="leading-relaxed">
                    Are you absolutely sure you want to delete your account? This action is permanent and all your profile settings, applications, and resume details will be deleted forever.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAccountConfirm}
                      className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'logoutConfirm' && (
                <div className="space-y-4 text-sm font-semibold text-slate-600">
                  <p className="leading-relaxed">
                    Are you sure you want to logout of your account?
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => { window.location.href = '/login'; }}
                      className="flex-1 py-2.5 bg-[#84A43C] text-white font-bold rounded-xl cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'logoutAllConfirm' && (
                <div className="space-y-4 text-sm font-semibold text-slate-600">
                  <p className="leading-relaxed">
                    Are you sure you want to log out from all other active sessions and devices? You will remain logged in only on this device.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleLogoutAllDevicesConfirm}
                      className="flex-1 py-2.5 bg-[#84A43C] text-white font-bold rounded-xl cursor-pointer"
                    >
                      Logout Others
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
