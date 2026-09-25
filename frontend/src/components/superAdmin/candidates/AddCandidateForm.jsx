import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createCandidateService } from '../../../services/superAdmin/superAdminService';
import { fetchLocations } from '../../../services/superAdmin/locationService';

export default function AddCandidateForm() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: '',
    countryCode: '+91',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
    dob: '',
    gender: '',
    stateId: '',
    districtId: '',
    cityId: '',
    localityId: '',
    salaryMin: '',
    salaryMax: '',
    jobType: '',
    workMode: ''
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial States from location catalog
  useEffect(() => {
    let active = true;
    async function loadStates() {
      const data = await fetchLocations({ location_type: 'STATE' });
      if (active) setStates(data);
    }
    loadStates();
    return () => { active = false; };
  }, []);

  // Fetch Districts when State changes
  useEffect(() => {
    let active = true;
    if (!formState.stateId) {
      setDistricts([]);
      setCities([]);
      setLocalities([]);
      return;
    }
    async function loadDistricts() {
      const data = await fetchLocations({ location_type: 'DISTRICT', parent_id: formState.stateId });
      if (active) setDistricts(data);
    }
    loadDistricts();
    return () => { active = false; };
  }, [formState.stateId]);

  // Fetch Cities when District changes
  useEffect(() => {
    let active = true;
    if (!formState.districtId) {
      setCities([]);
      setLocalities([]);
      return;
    }
    async function loadCities() {
      const data = await fetchLocations({ location_type: 'CITY', parent_id: formState.districtId });
      if (active) setCities(data);
    }
    loadCities();
    return () => { active = false; };
  }, [formState.districtId]);

  // Fetch Localities when City changes
  useEffect(() => {
    let active = true;
    if (!formState.cityId) {
      setLocalities([]);
      return;
    }
    async function loadLocalities() {
      const data = await fetchLocations({ location_type: 'LOCALITY', parent_id: formState.cityId });
      if (active) setLocalities(data);
    }
    loadLocalities();
    return () => { active = false; };
  }, [formState.cityId]);

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

    if (!formState.password) {
      newErrors.password = 'Password is required.';
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!formState.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
    setApiError(null);

    if (!validate()) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] select');
        if (firstErrorEl) firstErrorEl.focus();
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedLocationId = formState.localityId || formState.cityId || formState.districtId || formState.stateId || null;

      const payload = {
        full_name: formState.fullName.trim(),
        mobile_number: `${formState.countryCode}${formState.mobileNumber.trim()}`,
        email: formState.email.trim(),
        password: formState.password,
        confirmPassword: formState.confirmPassword,
        dob: formState.dob || null,
        gender: formState.gender || null,
        location_id: selectedLocationId ? Number(selectedLocationId) : null,
        salary_min: formState.salaryMin !== '' ? Number(formState.salaryMin) : null,
        salary_max: formState.salaryMax !== '' ? Number(formState.salaryMax) : null,
        job_type: formState.jobType || null,
        work_mode: formState.workMode || null
      };

      const res = await createCandidateService(payload);
      if (res.success) {
        navigate('/super-admin/candidates');
      } else {
        setApiError(res.message || 'Failed to create candidate account.');
        if (res.errors) {
          const fieldErrors = {};
          if (res.errors.email) fieldErrors.email = Array.isArray(res.errors.email) ? res.errors.email[0] : res.errors.email;
          if (res.errors.password) fieldErrors.password = Array.isArray(res.errors.password) ? res.errors.password[0] : res.errors.password;
          if (res.errors.confirmPassword) fieldErrors.confirmPassword = Array.isArray(res.errors.confirmPassword) ? res.errors.confirmPassword[0] : res.errors.confirmPassword;
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        }
      }
    } catch (err) {
      console.error("Failed to create candidate", err);
      setApiError('An unexpected error occurred. Please check connection.');
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

      {apiError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        
        {/* Account Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Account Information
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5" data-error={!!errors.fullName}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mobile Number */}
              <div className="space-y-1.5" data-error={!!errors.mobileNumber}>
                <label htmlFor="mobileNumber" className="text-[13px] font-bold text-slate-700">Mobile Number *</label>
                <div className="flex gap-2">
                  <select
                    value={formState.countryCode}
                    onChange={(e) => setFormState(prev => ({ ...prev, countryCode: e.target.value }))}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500 min-h-[44px]"
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

              {/* Password */}
              <div className="space-y-1.5" data-error={!!errors.password}>
                <label htmlFor="password" className="text-[13px] font-bold text-slate-700">Password *</label>
                <div className="relative">
                  <input 
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formState.password}
                    onChange={(e) => {
                      setFormState(prev => ({ ...prev, password: e.target.value }));
                      if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                    }}
                    placeholder="Minimum 8 characters"
                    className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                        : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 font-semibold">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5" data-error={!!errors.confirmPassword}>
                <label htmlFor="confirmPassword" className="text-[13px] font-bold text-slate-700">Confirm Password *</label>
                <div className="relative">
                  <input 
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formState.confirmPassword}
                    onChange={(e) => {
                      setFormState(prev => ({ ...prev, confirmPassword: e.target.value }));
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
                    }}
                    placeholder="Re-enter password"
                    className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                        : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 font-semibold">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Initial Candidate Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 space-y-5 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Initial Candidate Profile
          </h2>

          {/* Profile Photo */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 block">Profile Photo (Optional)</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center relative overflow-hidden shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Photo preview" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div className="space-y-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{photoPreview ? 'Change Photo' : 'Choose Photo'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
                </label>
                {photoPreview && (
                  <button type="button" onClick={removePhoto} className="ml-2 text-xs font-bold text-red-500 hover:underline">
                    Remove
                  </button>
                )}
                <p className="text-[11px] text-slate-400 font-semibold">JPG, PNG, or WebP up to 2MB.</p>
              </div>
            </div>
            {errors.profilePhoto && <p className="text-xs text-red-500 font-semibold mt-1">{errors.profilePhoto}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  value={formState.stateId}
                  onChange={(e) => setFormState(prev => ({ ...prev, stateId: e.target.value, districtId: '', cityId: '', localityId: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
                >
                  <option value="">Select State</option>
                  {states.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="district" className="text-xs font-semibold text-slate-500 block mb-1">District</label>
                <select
                  id="district"
                  disabled={!formState.stateId}
                  value={formState.districtId}
                  onChange={(e) => setFormState(prev => ({ ...prev, districtId: e.target.value, cityId: '', localityId: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="text-xs font-semibold text-slate-500 block mb-1">City / Town</label>
                <select
                  id="city"
                  disabled={!formState.districtId}
                  value={formState.cityId}
                  onChange={(e) => setFormState(prev => ({ ...prev, cityId: e.target.value, localityId: '' }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select City/Town</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="locality" className="text-xs font-semibold text-slate-500 block mb-1">Locality</label>
                <select
                  id="locality"
                  disabled={!formState.cityId}
                  value={formState.localityId}
                  onChange={(e) => setFormState(prev => ({ ...prev, localityId: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-400 min-h-[44px]"
                >
                  <option value="">Select Locality</option>
                  {localities.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {states.length === 0 && (
              <p className="text-[11px] text-amber-600 font-semibold">
                No location records configured yet. Populate location catalog under Location Management.
              </p>
            )}
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
