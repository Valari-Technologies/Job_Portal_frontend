import { AlertCircle } from 'lucide-react';
import ProfilePhotoUpload from './ProfilePhotoUpload';

export default function RecruiterInformationStep({ formState, setFormState, errors, setErrors, touched, setTouched }) {
  
  const validateField = (name, value) => {
    let err = null;
    if (!value || !value.trim()) {
      if (name === 'fullName') err = "Full Name is required.";
      if (name === 'email') err = "Email Address is required.";
      if (name === 'phone') err = "Phone Number is required.";
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        err = "Invalid email format.";
      }
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formState[name]);
  };

  const handleChange = (name, val) => {
    setFormState(prev => ({ ...prev, [name]: val }));
    if (touched[name]) {
      validateField(name, val);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Name and Email row grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Full Name *</label>
          <input 
            type="text"
            value={formState.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            placeholder="Enter full name"
            aria-invalid={!!errors.fullName}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px] ${
              errors.fullName && touched.fullName ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
            }`}
          />
          {errors.fullName && touched.fullName && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Email Address *</label>
          <input 
            type="email"
            value={formState.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="Enter email address"
            aria-invalid={!!errors.email}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px] ${
              errors.email && touched.email ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
            }`}
          />
          {errors.email && touched.email && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Phone input grid */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-slate-700">Phone Number *</label>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={formState.phoneCountryCode}
              onChange={(e) => handleChange('phoneCountryCode', e.target.value)}
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] font-medium text-slate-700 bg-white focus:outline-none min-h-[46px] appearance-none pr-8 cursor-pointer"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              ▼
            </div>
          </div>
          <input 
            type="tel"
            value={formState.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="Enter phone number"
            aria-invalid={!!errors.phone}
            className={`flex-1 rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px] ${
              errors.phone && touched.phone ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
            }`}
          />
        </div>
        {errors.phone && touched.phone && (
          <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.phone}</span>
          </div>
        )}
      </div>

      {/* File photo upload component */}
      <ProfilePhotoUpload 
        file={formState.profilePhoto}
        setFile={(file) => handleChange('profilePhoto', file)}
        error={errors.profilePhoto}
        setError={(err) => setErrors(prev => ({ ...prev, profilePhoto: err }))}
      />

    </div>
  );
}
