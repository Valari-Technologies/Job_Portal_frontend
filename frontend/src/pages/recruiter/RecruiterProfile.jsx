import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Camera, Trash2, Edit3, Check, ShieldCheck, Building2, Mail, Phone, Lock, Calendar, Briefcase, Sparkles, AlertCircle, CreditCard } from 'lucide-react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import { useRecruiterUser } from '../../context/RecruiterUserContext';
import ImageCropModal from '../../components/recruiter/profile/ImageCropModal';

export default function RecruiterProfile() {
  return (
    <RecruiterLayout activeTab="profile">
      <RecruiterProfileContent />
    </RecruiterLayout>
  );
}

function RecruiterProfileContent() {
  const { profile, updateProfile, uploadPhoto, removePhoto } = useRecruiterUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Crop Modal state
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const fileInputRef = useRef(null);

  // Safe normalized view model fallback
  const identity = profile?.identity || {};
  const recruiterProfile = profile?.recruiterProfile || {};
  const companySummary = profile?.companySummary || null;

  const { fullName, email, mobileNumber, mobileVerified, role, accountStatus, lastLoginAt } = identity;
  const { profilePhotoUrl, designation } = recruiterProfile;
  const companyName = companySummary?.name;

  // Form State
  const [formData, setFormData] = useState({
    fullName: fullName || '',
    mobileNumber: mobileNumber || '',
    designation: designation || ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleStartEdit = () => {
    setFormData({
      fullName: fullName || '',
      mobileNumber: mobileNumber || '',
      designation: designation || ''
    });
    setFormErrors({});
    setSaveMessage(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormErrors({});
    setSaveMessage(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedImageSrc(objectUrl);
    setShowCropModal(true);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedBlob) => {
    try {
      await uploadPhoto(croppedBlob);
      setSaveMessage({ type: 'success', text: 'Profile photo updated successfully.' });
    } catch (err) {
      console.error("Failed to upload photo:", err);
      setSaveMessage({ type: 'error', text: 'Failed to update photo. Please try again.' });
    } finally {
      if (selectedImageSrc) {
        URL.revokeObjectURL(selectedImageSrc);
        setSelectedImageSrc(null);
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      try {
        await removePhoto();
        setSaveMessage({ type: 'success', text: 'Profile photo removed.' });
      } catch (err) {
        console.error("Failed to remove photo:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveMessage(null);
    setFormErrors({});

    // Validate
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }
    if (formData.mobileNumber && !/^[+0-9\s-]{8,15}$/.test(formData.mobileNumber.trim())) {
      errors.mobileNumber = "Enter a valid mobile number.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setSaveMessage({ type: 'success', text: 'Profile information saved successfully.' });
        setIsEditing(false);
      } else {
        setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 font-sans select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <User className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
          </div>
          <p className="text-sm font-bold text-slate-500 mt-1">
            View and manage your personal recruiter information.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-colors cursor-pointer disabled:opacity-70"
              >
                <Check className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Save Status Alert Banner */}
      {saveMessage && (
        <div className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 ${
          saveMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {saveMessage.type === 'success' ? (
            <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Profile Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6 relative">
        {/* Avatar Section */}
        <div className="relative group shrink-0">
          <div className="h-28 w-28 rounded-full bg-white text-slate-900 font-black text-3xl flex items-center justify-center border-2 border-black shadow-md overflow-hidden relative">
            {profilePhotoUrl ? (
              <img src={profilePhotoUrl} alt={fullName || "Recruiter"} className="h-full w-full object-contain p-1 rounded-full" />
            ) : (
              <span>{fullName ? fullName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0, 2) : <User className="h-10 w-10 text-slate-900" />}</span>
            )}
          </div>

          {/* Change Photo Overlay Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile photo"
            className="absolute inset-0 rounded-full bg-slate-900/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-6 w-6" />
            <span className="text-[10px] font-extrabold mt-1">Change</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Details & Actions */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {fullName || <span className="text-slate-400 italic">Name not provided</span>}
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                {designation || "Recruiter"}
              </p>
            </div>

            {/* Photo Actions */}
            <div className="flex items-center justify-center md:justify-end gap-2 pt-1 md:pt-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5 text-indigo-600" />
                <span>Change Photo</span>
              </button>
              {profilePhotoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700">
              {role || "RECRUITER"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{accountStatus || "Active"}</span>
            </span>
          </div>

          {/* Linked Company Summary Banner */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Building2 className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-500 block leading-none">Linked Company</span>
                <span className="text-xs font-black text-slate-900 truncate block mt-0.5">
                  {companyName || "No company linked"}
                </span>
              </div>
            </div>

            <Link
              to="/recruiter/company-profile"
              className="text-xs font-extrabold text-indigo-600 hover:underline shrink-0"
            >
              View Company Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Content Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Personal Information</h3>
            <span className="text-xs font-semibold text-slate-400">Identity details</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Full Name
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors ${
                      formErrors.fullName ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{formErrors.fullName}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-900">
                  {fullName || <span className="text-slate-400 italic">Not provided</span>}
                </p>
              )}
            </div>

            {/* Email Address (Read-only System Identity) */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <p className="text-sm font-bold text-slate-900 truncate">
                  {email || <span className="text-slate-400 italic">Not provided</span>}
                </p>
                <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-auto" title="System Managed" />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Mobile Number
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="Enter mobile number"
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors ${
                      formErrors.mobileNumber ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.mobileNumber && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{formErrors.mobileNumber}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <p className="text-sm font-bold text-slate-900">
                    {mobileNumber || <span className="text-slate-400 italic">Not provided</span>}
                  </p>
                  {mobileVerified && (
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Designation
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Enter designation"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                  <p className="text-sm font-bold text-slate-900">
                    {designation || <span className="text-slate-400 italic">Not provided</span>}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Card 2: Account & Company Association */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Account & Security</h3>
            <span className="text-xs font-semibold text-slate-400">System credentials</span>
          </div>

          <div className="space-y-4">
            {/* Role */}
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                User Role
              </span>
              <p className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>{role || "RECRUITER"}</span>
                <span className="text-xs text-slate-400 font-semibold">Read-only</span>
              </p>
            </div>

            {/* Account Status */}
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Account Status
              </span>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{accountStatus || "Active"}</span>
              </p>
            </div>

            {/* Last Login */}
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Last Login
              </span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{lastLoginAt ? new Date(lastLoginAt).toLocaleString() : 'Recent session'}</span>
              </p>
            </div>

            {/* Company Profile Shortcut */}
            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-150 space-y-2">
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                  Company Information
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Company description, logo, website, and verification details are managed under Company Profile.
                </p>
                <Link
                  to="/recruiter/company-profile"
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 pt-1"
                >
                  <span>Manage Company Profile</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Payments & Billing Shortcut */}
            <div className="pt-2">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-150 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                    Payments & Billing
                  </h4>
                  <CreditCard className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Manage your posting plans, job credits, wallet balance, transactions and invoices.
                </p>
                <Link
                  to="/recruiter/payments"
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 pt-1"
                >
                  <span>Manage Payments & Billing</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Crop Modal */}
      {showCropModal && (
        <ImageCropModal
          imageSrc={selectedImageSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
}
