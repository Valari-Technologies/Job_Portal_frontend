import { useState, useRef } from 'react';
import { useSuperAdminUser } from '../../../context/SuperAdminUserContext';
import SuperAdminCropModal from '../../../components/superAdmin/profile/SuperAdminCropModal';
import SuperAdminLocationModal from '../../../components/superAdmin/common/SuperAdminLocationModal';
import { normalizeLocationWithCountry } from '../../../data/indiaLocations';
import { 
  User, 
  ShieldCheck, 
  Camera, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  Lock,
  MapPin
} from 'lucide-react';

export default function SuperAdminProfile() {
  const { profile, updateProfile, updatePhoto, removePhoto, updateLocation, isLoadingProfile } = useSuperAdminUser();

  const [isEditing, setIsEditing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    mobile_number: profile?.mobile_number || ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  // Photo Crop State
  const [selectedCropImage, setSelectedCropImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleStartEdit = () => {
    setFormData({
      full_name: profile?.full_name || '',
      mobile_number: profile?.mobile_number || ''
    });
    setFormErrors({});
    setIsEditing(true);
  };

  if (isLoadingProfile || !profile) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-32 w-full bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Initials fallback
  const getInitials = (name) => {
    if (!name) return 'SA';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(profile.full_name);

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters';
    }

    if (formData.mobile_number && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(formData.mobile_number.trim())) {
      errors.mobile_number = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSaveSuccessMsg('Profile information saved successfully.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setFormErrors({ general: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel edits
  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name || '',
      mobile_number: profile.mobile_number || ''
    });
    setFormErrors({});
    setIsEditing(false);
  };

  // Profile photo file selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Supported formats: JPG, PNG, WEBP');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedCropImage(objectUrl);
    setShowCropModal(true);

    // Reset input value so same file can be re-selected if needed
    e.target.value = '';
  };

  // Handle crop completion
  const handleCropComplete = async (croppedBlob) => {
    try {
      await updatePhoto(croppedBlob);
      setSaveSuccessMsg('Profile photo updated successfully.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to update photo:', err);
    } finally {
      if (selectedCropImage) {
        URL.revokeObjectURL(selectedCropImage);
        setSelectedCropImage(null);
      }
      setShowCropModal(false);
    }
  };

  // Remove photo
  const handleRemovePhoto = async () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      try {
        await removePhoto();
        setSaveSuccessMsg('Profile photo removed.');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } catch (err) {
        console.error('Failed to remove photo:', err);
      }
    }
  };

  return (
    <div className="space-y-8 font-sans animate-fadeIn max-w-5xl mx-auto">
      {/* Page Heading */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          View and manage your Super Admin information.
        </p>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs animate-slideDown">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 1. Profile Summary Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-teal-500/5 rounded-bl-full pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar Container */}
          <div className="relative shrink-0 group">
            {profile.profile_picture ? (
              <img 
                src={profile.profile_picture} 
                alt={profile.full_name} 
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-teal-500/20"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-teal-600 font-black text-white text-2xl flex items-center justify-center border-4 border-white shadow-md ring-2 ring-teal-500/20">
                {initials}
              </div>
            )}

            {/* Quick Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md hover:bg-teal-700 transition-transform active:scale-95 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* User Meta & Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile.full_name}</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{profile.email && !profile.email.includes('statejobz.tn.gov') ? profile.email : 'mohammeddhanais22@gmail.com'}</p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-extrabold text-slate-700 shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer self-center sm:self-start min-h-[44px]"
                >
                  <Edit2 className="h-3.5 w-3.5 text-teal-600" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                <span>Super Admin</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Account</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Personal Info vs Account Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Personal Information Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-150 pb-4">
            <div className="flex items-center gap-2.5">
              <User className="h-5 w-5 text-teal-600" />
              <h3 className="text-base font-extrabold text-slate-900">Personal Information</h3>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="full_name" className="text-xs font-extrabold text-slate-700">
                Full Name
              </label>
              {isEditing ? (
                <div>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${formErrors.full_name ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20'} bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2`}
                  />
                  {formErrors.full_name && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">{formErrors.full_name}</p>
                  )}
                </div>
              ) : (
                <p className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-2.5">
                  {profile.full_name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700">
                  Email Address
                </label>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Read-only
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={profile.email && !profile.email.includes('statejobz.tn.gov') ? profile.email : 'mohammeddhanais22@gmail.com'}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label htmlFor="mobile_number" className="text-xs font-extrabold text-slate-700">
                Mobile Phone Number
              </label>
              {isEditing ? (
                <div>
                  <input
                    id="mobile_number"
                    name="mobile_number"
                    type="text"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`w-full rounded-xl border ${formErrors.mobile_number ? 'border-red-400' : 'border-slate-200 focus:border-teal-500'} bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                  />
                  {formErrors.mobile_number && (
                    <p className="text-[11px] font-bold text-red-500 mt-1">{formErrors.mobile_number}</p>
                  )}
                </div>
              ) : (
                <p className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-2.5">
                  {profile.mobile_number || 'Not provided'}
                </p>
              )}
            </div>

            {/* Base Location (All-India LGD Catalog) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" />
                  <span>Base Location</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  className="text-xs font-black text-teal-600 hover:text-teal-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Change Location</span>
                </button>
              </div>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-2.5">
                <span className="text-xs font-bold text-slate-800">{normalizeLocationWithCountry(profile?.location || 'Delhi, India')}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  LGD Verified
                </span>
              </div>
            </div>

            {/* Profile Photo Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-700 block">
                Profile Photo Management
              </label>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
                >
                  <Camera className="h-3.5 w-3.5 text-teal-600" />
                  <span>Change Photo</span>
                </button>

                {profile.profile_picture && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Edit Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all cursor-pointer min-h-[44px]"
                >
                  <Check className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* 3. Account Information Section (Read-only) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-150 pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              <h3 className="text-base font-extrabold text-slate-900">Account & Security Status</h3>
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
              System Protected
            </span>
          </div>

          <div className="space-y-4">
            {/* System Role */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assigned Role</p>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">{profile.role_display || 'Super Admin'}</p>
              </div>
              <span className="rounded-xl bg-teal-100 px-2.5 py-1 text-xs font-black text-teal-800">
                SUPER_ADMIN
              </span>
            </div>

            {/* Account Status */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account Status</p>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">Active & Authorized</p>
              </div>
              <span className="rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800">
                ACTIVE
              </span>
            </div>

            {/* Verification & 2FA State */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Security State</p>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">{profile.verification_state || '2FA Enforced'}</p>
              </div>
              <span className="rounded-xl bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-800">
                VERIFIED
              </span>
            </div>

            {/* Last Login */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Portal Session</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{profile.last_login}</p>
                </div>
              </div>
            </div>

            {/* Account Created Date */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Member Since</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <SuperAdminCropModal
          imageSrc={selectedCropImage}
          onCropComplete={handleCropComplete}
          onClose={() => {
            if (selectedCropImage) URL.revokeObjectURL(selectedCropImage);
            setSelectedCropImage(null);
            setShowCropModal(false);
          }}
        />
      )}

      {/* Location Selector Modal */}
      <SuperAdminLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={profile?.location || 'Delhi'}
        onSaveLocation={updateLocation}
      />
    </div>
  );
}
