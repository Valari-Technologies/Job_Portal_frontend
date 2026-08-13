import React, { useState, useEffect, useRef } from 'react';
import { Shield, Eye, EyeOff, Check } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import { getProfile, saveProfile } from '../../components/superadmin/profile/profileData';
import { getSettings, saveSettings } from '../../components/superadmin/settings/settingsData';
import ProfilePhotoCropModal from '../../components/profile/ProfilePhotoCropModal';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Account');

  // Shared state references
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isPhotoActionOpen, setIsPhotoActionOpen] = useState(false);

  // Notifications State
  const [notifs, setNotifs] = useState({
    newUserRegistered: true,
    newJobPosted: true,
    newApplication: true,
    candidateShortlisted: true,
    systemAlerts: true
  });

  // Password visibility states
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Change Password inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email Config test states
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState('Not Sent');

  const fileInputRef = useRef(null);

  // Load configuration
  useEffect(() => {
    setProfile(getProfile());
    setSettings(getSettings());
    
    const savedNotifs = localStorage.getItem('sa_notifications');
    if (savedNotifs) {
      setNotifs(JSON.parse(savedNotifs));
    }
  }, []);

  if (!profile || !settings) return null;

  const handleProfileSave = (e) => {
    e.preventDefault();
    saveProfile(profile);
    alert('Account profile settings updated successfully.');
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    saveSettings(settings);
    alert('Platform global configurations saved successfully.');
  };

  const handleNotifsSave = () => {
    localStorage.setItem('sa_notifications', JSON.stringify(notifs));
    alert('Notification preferences saved successfully.');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      alert('Please select a valid image file (JPG, JPEG, PNG, WEBP).');
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Maximum file size is 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target.result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation fields do not match.');
      return;
    }
    alert('Security password credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSendTestEmail = (e) => {
    e.preventDefault();
    if (!testEmail) return;
    setTestResult('Sending...');
    setTimeout(() => {
      setTestResult('Success: Test email dispatched successfully.');
    }, 1500);
  };

  const navItems = [
    { id: 'Account', label: 'Account' },
    { id: 'Platform Settings', label: 'Platform Settings' },
    { id: 'Notifications', label: 'Notifications' },
    { id: 'Security', label: 'Security' },
    { id: 'System Controls', label: 'System Controls' },
    { id: 'Email Configuration', label: 'Email Configuration' }
  ];

  // Custom toggle switch matching Figma screen
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className="cursor-pointer shrink-0 outline-none select-none"
    >
      {checked ? (
        <div className="w-11 h-6 rounded-full bg-[#8CC63F] p-0.5 flex items-center justify-end transition-all">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-xs">
            <Check className="w-3 h-3 text-white stroke-[3.5]" />
          </div>
        </div>
      ) : (
        <div className="w-11 h-6 rounded-full bg-slate-200 p-0.5 flex items-center justify-start transition-all">
          <div className="w-5 h-5 rounded-full bg-white shadow-2xs"></div>
        </div>
      )}
    </button>
  );

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h2>
      </div>

      {/* Main Settings Card Layout */}
      <div className="bg-white/[0.05] backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-none p-6 flex flex-col md:flex-row gap-6 w-full min-h-[500px]">
        
        {/* Left Side Sidebar Navigation */}
        <div className="md:w-1/4 flex flex-col gap-1 border-b md:border-b-0 md:border-r border-slate-100/50 md:pr-4 pb-4 md:pb-0 shrink-0 font-bold text-sm text-slate-500">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === item.id 
                  ? 'border-l-4 border-[#8CC63F] bg-[#8CC63F]/10 text-[#8CC63F]' 
                  : 'hover:bg-slate-50/20 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-grow md:pl-4">
          
          {/* Account Tab */}
          {activeTab === 'Account' && (
            <form onSubmit={handleProfileSave} className="flex flex-col gap-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Account Settings</h3>
              
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Profile Info Avatar block */}
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center gap-4 text-center shrink-0 w-full lg:w-48">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Profile Information</span>
                  <img 
                    src={profile.photo} 
                    alt="Profile Avatar"
                    className="w-24 h-24 rounded-full object-cover border border-slate-100/80 shadow-xs"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => setIsPhotoActionOpen(true)}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    Change Photo
                  </button>
                </div>

                {/* Right Input Form fields */}
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-xs font-black text-slate-400 uppercase tracking-wider">
                  <div>
                    <label className="block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Designation</label>
                    <input
                      type="text"
                      required
                      value={profile.designation}
                      onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100/50">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Update Profile
                </button>
              </div>
            </form>
          )}

          {/* Platform Settings Tab */}
          {activeTab === 'Platform Settings' && (
            <form onSubmit={handleSettingsSave} className="flex flex-col gap-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Platform Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                <div>
                  <label className="block mb-1.5">Platform Name</label>
                  <input
                    type="text"
                    required
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">Platform Logo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                      RP
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Platform logo selection triggered.')}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-black cursor-pointer"
                    >
                      Choose File
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5">Default Language</label>
                  <CustomSelect
                    value={settings.defaultLanguage}
                    onChange={(val) => setSettings({ ...settings, defaultLanguage: val })}
                    options={['English', 'Tamil', 'Hindi']}
                    placeholder="English"
                    buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl h-[44px] flex items-center justify-between"
                    accentColor="#8CC63F"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">Time Zone</label>
                  <CustomSelect
                    value={settings.timeZone}
                    onChange={(val) => setSettings({ ...settings, timeZone: val })}
                    options={['(GMT-05:30) Asia/Kolkata', '(GMT+00:00) UTC', '(GMT-08:00) Pacific Time']}
                    placeholder="(GMT-05:30) Asia/Kolkata"
                    buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl h-[44px] flex items-center justify-between"
                    accentColor="#8CC63F"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1.5">Date Format</label>
                  <CustomSelect
                    value={settings.dateFormat}
                    onChange={(val) => setSettings({ ...settings, dateFormat: val })}
                    options={['DD MMM YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']}
                    placeholder="DD MMM YYYY"
                    buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl h-[44px] flex items-center justify-between"
                    accentColor="#8CC63F"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100/50">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'Notifications' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Notification Settings</h3>

              <div className="flex flex-col gap-4 text-sm font-bold text-slate-700">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Email Notifications</span>
                
                {[
                  { key: 'newUserRegistered', title: 'New User Registered', desc: 'Receive an email when a new user registers.' },
                  { key: 'newJobPosted', title: 'New Job Posted', desc: 'Receive an email when a new job is posted.' },
                  { key: 'newApplication', title: 'New Application', desc: 'Receive an email when a new application is submitted.' },
                  { key: 'candidateShortlisted', title: 'Candidate Shortlisted', desc: 'Receive an email when a candidate is shortlisted.' },
                  { key: 'systemAlerts', title: 'System Alerts', desc: 'Receive important system alerts and updates.' }
                ].map((row) => (
                  <div key={row.key} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-3xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-800 font-extrabold">{row.title}</span>
                      <span className="text-xs font-semibold text-slate-400">{row.desc}</span>
                    </div>
                    {/* Functioning Custom Toggle Switch */}
                    <ToggleSwitch 
                      checked={notifs[row.key]}
                      onChange={() => setNotifs({ ...notifs, [row.key]: !notifs[row.key] })}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100/50">
                <button
                  onClick={handleNotifsSave}
                  className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'Security' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Security Settings</h3>

              {/* Change Password Panel */}
              <form onSubmit={handleUpdatePassword} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-2xs flex flex-col gap-4 text-xs font-black text-slate-400 uppercase tracking-wider">
                <h4 className="text-sm font-black text-slate-800 tracking-tight normal-case">Change Password</h4>
                
                <div>
                  <label className="block mb-1.5">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold normal-case"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block mb-1.5">New Password</label>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold normal-case"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPass(!showNewPass)} 
                      className="absolute right-4.5 top-[38px] text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block mb-1.5">Confirm Password</label>
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold normal-case"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPass(!showConfirmPass)} 
                      className="absolute right-4.5 top-[38px] text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>

              {/* 2FA Panel */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-2xs flex items-center justify-between gap-4 text-left">
                <div>
                  <h4 className="text-sm font-black text-slate-800 tracking-tight">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1">Add an extra layer of security to your account.</p>
                </div>
                
                {/* Custom active toggle with check icon */}
                <ToggleSwitch 
                  checked={settings.twoFactor}
                  onChange={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
                />
              </div>

            </div>
          )}

          {/* System Controls Tab */}
          {activeTab === 'System Controls' && (
            <form onSubmit={handleSettingsSave} className="flex flex-col gap-6 animate-fadeIn">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">System Controls</h3>

              <div className="bg-white border border-slate-100 rounded-[24px] p-2 shadow-2xs divide-y divide-slate-100">
                {[
                  {
                    key: 'userRegistration',
                    title: 'User Registration',
                    desc: 'Allow new users to register on the platform.',
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    ),
                    color: 'text-blue-500 bg-blue-50'
                  },
                  {
                    key: 'jobPosting',
                    title: 'Job Posting',
                    desc: 'Allow users to create and post new jobs.',
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    color: 'text-indigo-500 bg-indigo-50'
                  },
                  {
                    key: 'applicationSubmission',
                    title: 'Application Submission',
                    desc: 'Allow candidates to submit applications.',
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ),
                    color: 'text-fuchsia-500 bg-fuchsia-50'
                  },
                  {
                    key: 'maintenanceMode',
                    title: 'Maintenance Mode',
                    desc: 'Enable maintenance mode to restrict access to the platform.',
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    color: 'text-[#8CC63F] bg-[#8CC63F]/10'
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4.5 text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-800 block">{item.title}</span>
                        <span className="text-xs font-semibold text-slate-400 block mt-0.5">{item.desc}</span>
                      </div>
                    </div>

                    <ToggleSwitch 
                      checked={settings[item.key]}
                      onChange={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Email Configuration Tab */}
          {activeTab === 'Email Configuration' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              
              {/* Left Settings Panel */}
              <form onSubmit={handleSettingsSave} className="lg:col-span-2 flex flex-col gap-6 text-xs font-black text-slate-400 uppercase tracking-wider">
                <h3 className="text-lg font-black text-slate-800 tracking-tight normal-case">Email Configuration</h3>
                
                <div>
                  <label className="block mb-1.5">SMTP Host</label>
                  <input
                    type="text"
                    required
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold normal-case"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">SMTP Port</label>
                  <input
                    type="text"
                    required
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold normal-case"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={settings.emailAddress}
                    onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold normal-case"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value="••••••••••••"
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-100 rounded-xl text-slate-500 text-sm font-bold cursor-not-allowed normal-case"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">Encryption</label>
                  <input
                    type="text"
                    required
                    value={settings.encryption}
                    onChange={(e) => setSettings({ ...settings, encryption: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100/50">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              {/* Right Side Test Configuration Panel */}
              <div className="flex flex-col gap-6">
                
                {/* Send Test Email Card */}
                <form onSubmit={handleSendTestEmail} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-4 text-xs font-black text-slate-400 uppercase tracking-wider">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight normal-case">Send Test Email</h4>
                  
                  <div>
                    <label className="block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800 text-sm font-bold normal-case"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Send Test Email
                  </button>
                </form>

                {/* Test Result Card */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 text-left">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight">Test Result</h4>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className={`text-xs font-black block mt-1 ${testResult.startsWith('Success') ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {testResult}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      <PhotoActionModal
        isOpen={isPhotoActionOpen}
        onClose={() => setIsPhotoActionOpen(false)}
        onUploadNew={() => {
          if (fileInputRef.current) fileInputRef.current.click();
        }}
        onEditCurrent={() => {
          if (profile.photo) {
            setCropImageSrc(profile.photo);
            setIsCropOpen(true);
          } else {
            alert("No profile photo exists to edit. Please upload a new photo.");
          }
        }}
      />

      <ProfilePhotoCropModal
        isOpen={isCropOpen}
        imageSrc={cropImageSrc}
        onClose={() => setIsCropOpen(false)}
        onSave={(croppedBase64) => {
          const updated = { ...profile, photo: croppedBase64 };
          setProfile(updated);
          saveProfile(updated);
          setIsCropOpen(false);
        }}
      />
    </div>
  );
}

// Reusable Choice Modal for Upload vs Edit Photo
function PhotoActionModal({ isOpen, onClose, onUploadNew, onEditCurrent }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-fadeIn text-center">
      <div className="bg-white rounded-3xl w-full max-w-xs border border-slate-100 shadow-xl overflow-hidden p-6">
        <h4 className="text-xl font-bold text-slate-800 mb-5">Profile Photo</h4>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { onUploadNew(); onClose(); }}
            className="w-full py-3 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-base font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Upload New Photo
          </button>
          <button
            type="button"
            onClick={() => { onEditCurrent(); onClose(); }}
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-base font-semibold border border-slate-150 rounded-xl transition-colors cursor-pointer"
          >
            Edit Current Photo
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-500 text-[15px] font-medium rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
