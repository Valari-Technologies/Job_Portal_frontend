import { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import ProfilePhotoUpload from './ProfilePhotoUpload';

export default function RecruiterInformationStep({ formState, setFormState, errors, setErrors, touched, setTouched }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const validateField = (name, value) => {
    let err = null;
    if (!value || !value.trim()) {
      if (name === 'fullName') err = "Full Name is required.";
      if (name === 'email') err = "Email Address is required.";
      if (name === 'phone') err = "Phone Number is required.";
      if (name === 'password') err = "Password is required.";
      if (name === 'confirmPassword') err = "Confirm Password is required.";
    } else {
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          err = "Invalid email format.";
        }
      }
      if (name === 'password') {
        if (value.length < 8) {
          err = "Password must be at least 8 characters long.";
        }
      }
      if (name === 'confirmPassword') {
        if (value !== formState.password) {
          err = "Passwords do not match.";
        }
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
    if (name === 'password' && touched.confirmPassword && formState.confirmPassword) {
      if (formState.confirmPassword !== val) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match." }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: null }));
      }
    }
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

      {/* Password & Confirm Password row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Password *</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              value={formState.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter password"
              aria-invalid={!!errors.password}
              className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px] ${
                errors.password && touched.password ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && touched.password && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-slate-700">Confirm Password *</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              value={formState.confirmPassword || ''}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirm password"
              aria-invalid={!!errors.confirmPassword}
              className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:border-[#4A1DDF] focus:ring-1 focus:ring-[#4A1DDF] focus:outline-none min-h-[46px] ${
                errors.confirmPassword && touched.confirmPassword ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && touched.confirmPassword && (
            <div className="flex items-center gap-1 text-[12px] text-red-500 font-medium min-h-[16px]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.confirmPassword}</span>
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

      {/* Profile photo upload component */}
      <ProfilePhotoUpload 
        file={formState.profilePhoto}
        setFile={(file) => handleChange('profilePhoto', file)}
        error={errors.profilePhoto}
        setError={(err) => setErrors(prev => ({ ...prev, profilePhoto: err }))}
      />

    </div>
  );
}
