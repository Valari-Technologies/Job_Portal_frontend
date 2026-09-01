import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { createCandidateService } from '../../../services/superAdmin/superAdminService';

export default function AddCandidateForm() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: '',
    countryCode: '+91',
    mobileNumber: '',
    email: '',
    profilePhoto: null,
    dob: '',
    gender: '',
    state: '',
    district: '',
    city: '',
    locality: '',
    salaryMin: '',
    salaryMax: '',
    jobType: '',
    workMode: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Please select a JPG, PNG, or WebP image.' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Image size must be 2MB or less.' }));
        return;
      }
      setErrors(prev => ({ ...prev, profilePhoto: null }));
      setFormState(prev => ({ ...prev, profilePhoto: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setFormState(prev => ({ ...prev, profilePhoto: null }));
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formState.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    const trimmedMobile = formState.mobileNumber.trim();
    if (!trimmedMobile) {
      newErrors.mobileNumber = 'Mobile Number is required.';
    } else {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(trimmedMobile.replace(/\s+/g, ''))) {
        newErrors.mobileNumber = 'Enter a valid 10-digit mobile number.';
      }
    }

    const trimmedEmail = formState.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email Address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Enter a valid email address.';
      }
    }

    if (formState.salaryMin !== '' && Number(formState.salaryMin) < 0) {
      newErrors.salaryMin = 'Minimum salary cannot be negative.';
    }

    if (formState.salaryMax !== '' && Number(formState.salaryMax) < 0) {
      newErrors.salaryMax = 'Maximum salary cannot be negative.';
    }

    if (
      formState.salaryMin !== '' && 
      formState.salaryMax !== '' && 
      Number(formState.salaryMin) > Number(formState.salaryMax)
    ) {
      newErrors.salaryMax = 'Minimum expected salary must not exceed maximum expected salary.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] select');
        if (firstErrorEl) firstErrorEl.focus();
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        full_name: formState.fullName.trim(),
        mobile_number: `${formState.countryCode}${formState.mobileNumber.trim()}`,
        email: formState.email.trim(),
        dob: formState.dob || null,
        gender: formState.gender || null,
        state: formState.state || null,
        district: formState.district || null,
        city: formState.city || null,
        locality: formState.locality || null,
        salary_min: formState.salaryMin !== '' ? Number(formState.salaryMin) : null,
        salary_max: formState.salaryMax !== '' ? Number(formState.salaryMax) : null,
        job_type: formState.jobType || null,
        work_mode: formState.workMode || null
      };

      const res = await createCandidateService(payload);
      if (res.success) {
        navigate('/super-admin/candidates');
      }
    } catch (err) {
      console.error("Failed to create candidate", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add candidate</h1>
        <p className="text-sm font-medium text-slate-450 mt-1">
          Create candidate account and initial candidate profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl border border-slate-150 p-6 sm:p-8">
        
        {/* Section 1: Account Information */}
        <div className="space-y-5">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Account Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5 md:col-span-2" data-error={!!errors.fullName}>
              <label htmlFor="fullName" className="text-[13px] font-bold text-slate-700">Full Name *</label>
              <input 
                id="fullName"
                type="text"
                value={formState.fullName}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, fullName: e.target.value }));
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
                }}
                placeholder="Enter candidate full name"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.fullName 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.fullName && <p className="text-xs text-red-500 font-semibold">{errors.fullName}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5" data-error={!!errors.mobileNumber}>
              <label htmlFor="mobileNumber" className="text-[13px] font-bold text-slate-700">Mobile Number *</label>
              <div className="flex gap-2">
                <select
                  value={formState.countryCode}
                  onChange={(e) => setFormState(prev => ({ ...prev, countryCode: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  <option value="+91">+91 (IN)</option>
                </select>
                <input 
                  id="mobileNumber"
                  type="tel"
                  value={formState.mobileNumber}
                  onChange={(e) => {
                    setFormState(prev => ({ ...prev, mobileNumber: e.target.value }));
                    if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: null }));
                  }}
                  placeholder="10-digit mobile number"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                    errors.mobileNumber 
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                />
              </div>
              {errors.mobileNumber && <p className="text-xs text-red-500 font-semibold">{errors.mobileNumber}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5" data-error={!!errors.email}>
              <label htmlFor="email" className="text-[13px] font-bold text-slate-700">Email Address *</label>
              <input 
                id="email"
                type="email"
                value={formState.email}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                }}
                placeholder="candidate@example.com"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Initial Candidate Profile */}
        <div className="space-y-5">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Initial Candidate Profile</h2>

          {/* Profile Photo */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 block">Profile Photo (Optional)</label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative h-16 w-16 rounded-full overflow-hidden border border-slate-200">
                  <img src={photoPreview} alt="Candidate Preview" className="h-full w-full object-cover" />
                  <button 
                    type="button" 
                    onClick={removePhoto} 
                    className="absolute inset-0 bg-slate-900/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Upload className="h-5 w-5 text-slate-400" />
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
                </label>
              )}
              <span className="text-xs text-slate-450 font-medium">JPG, PNG, or WebP up to 2MB.</span>
            </div>
            {errors.profilePhoto && <p className="text-xs text-red-500 font-semibold">{errors.profilePhoto}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label htmlFor="dob" className="text-[13px] font-bold text-slate-700">Date of Birth</label>
              <input 
                id="dob"
                type="date"
                value={formState.dob}
                onChange={(e) => setFormState(prev => ({ ...prev, dob: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label htmlFor="gender" className="text-[13px] font-bold text-slate-700">Gender</label>
              <select
                id="gender"
                value={formState.gender}
                onChange={(e) => setFormState(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Cascading Location Selectors */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-slate-700 block">Location</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label htmlFor="state" className="text-xs font-semibold text-slate-500 block mb-1">State</label>
                <select
                  id="state"
                  value={formState.state}
                  onChange={(e) => setFormState(prev => ({ ...prev, state: e.target.value, district: '', city: '', locality: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  <option value="">Select State</option>
                </select>
              </div>

              <div>
                <label htmlFor="district" className="text-xs font-semibold text-slate-500 block mb-1">District</label>
                <select
                  id="district"
                  disabled={!formState.state}
                  value={formState.district}
                  onChange={(e) => setFormState(prev => ({ ...prev, district: e.target.value, city: '', locality: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select District</option>
                </select>
              </div>

              <div>
                <label htmlFor="city" className="text-xs font-semibold text-slate-500 block mb-1">City / Town</label>
                <select
                  id="city"
                  disabled={!formState.district}
                  value={formState.city}
                  onChange={(e) => setFormState(prev => ({ ...prev, city: e.target.value, locality: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select City/Town</option>
                </select>
              </div>

              <div>
                <label htmlFor="locality" className="text-xs font-semibold text-slate-500 block mb-1">Locality</label>
                <select
                  id="locality"
                  disabled={!formState.city}
                  value={formState.locality}
                  onChange={(e) => setFormState(prev => ({ ...prev, locality: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select Locality</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-450 italic">Location data will load from taxonomy after backend connection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Expected Salary Minimum */}
            <div className="space-y-1.5" data-error={!!errors.salaryMin}>
              <label htmlFor="salaryMin" className="text-[13px] font-bold text-slate-700">Expected Salary Min (Annual ₹)</label>
              <input 
                id="salaryMin"
                type="number"
                min="0"
                value={formState.salaryMin}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, salaryMin: e.target.value }));
                  if (errors.salaryMin) setErrors(prev => ({ ...prev, salaryMin: null }));
                }}
                placeholder="e.g. 300000"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.salaryMin 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.salaryMin && <p className="text-xs text-red-500 font-semibold">{errors.salaryMin}</p>}
            </div>

            {/* Expected Salary Maximum */}
            <div className="space-y-1.5" data-error={!!errors.salaryMax}>
              <label htmlFor="salaryMax" className="text-[13px] font-bold text-slate-700">Expected Salary Max (Annual ₹)</label>
              <input 
                id="salaryMax"
                type="number"
                min="0"
                value={formState.salaryMax}
                onChange={(e) => {
                  setFormState(prev => ({ ...prev, salaryMax: e.target.value }));
                  if (errors.salaryMax) setErrors(prev => ({ ...prev, salaryMax: null }));
                }}
                placeholder="e.g. 600000"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                  errors.salaryMax 
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                }`}
              />
              {errors.salaryMax && <p className="text-xs text-red-500 font-semibold">{errors.salaryMax}</p>}
            </div>

            {/* Preferred Job Type */}
            <div className="space-y-1.5">
              <label htmlFor="jobType" className="text-[13px] font-bold text-slate-700">Preferred Job Type</label>
              <select
                id="jobType"
                value={formState.jobType}
                onChange={(e) => setFormState(prev => ({ ...prev, jobType: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            {/* Preferred Work Mode */}
            <div className="space-y-1.5">
              <label htmlFor="workMode" className="text-[13px] font-bold text-slate-700">Preferred Work Mode</label>
              <select
                id="workMode"
                value={formState.workMode}
                onChange={(e) => setFormState(prev => ({ ...prev, workMode: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
              >
                <option value="">Select Work Mode</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => navigate('/super-admin/candidates')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/10 hover:bg-teal-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 min-h-[44px] cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create candidate"}
          </button>
        </div>

      </form>
    </div>
  );
}
