import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoJobz from '../../assets/logo-jobz.png';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Unicode-aware Name Sanitizer
  const sanitizeName = (val) => {
    return val.replace(/[^\p{L}\p{M}\s'-]/gu, '');
  };

  // Digits-only Mobile Sanitizer
  const sanitizeMobile = (val) => {
    return val.replace(/[^0-9]/g, '').slice(0, 10);
  };

  // Block Copy, Cut, Paste, Drop on Password Fields silently
  const handleBlockedPasswordAction = (e) => {
    e.preventDefault();
  };

  // Validate single field
  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'fullName') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        errorMsg = 'Full name is required.';
      }
    } else if (name === 'mobileNumber') {
      const digits = (value || '').trim();
      if (!digits) {
        errorMsg = 'Mobile number is required.';
      } else if (!/^[6-9]\d{9}$/.test(digits)) {
        errorMsg = 'Enter a valid 10-digit mobile number.';
      }
    } else if (name === 'email') {
      const trimmedEmail = (value || '').trim();
      if (!trimmedEmail) {
        errorMsg = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
        errorMsg = 'Enter a valid email address.';
      }
    } else if (name === 'password') {
      if (!value) {
        errorMsg = 'Password is required.';
      } else if (value.length < 8) {
        errorMsg = 'Password must be at least 8 characters.';
      }
    } else if (name === 'confirmPassword') {
      if (!value) {
        errorMsg = 'Confirm password is required.';
      } else if (value !== password) {
        errorMsg = 'Passwords do not match.';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));

    return !errorMsg;
  };

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedName = fullName.trim().replace(/\s+/g, ' ');
    const normalizedEmail = email.trim();

    setFullName(normalizedName);
    setEmail(normalizedEmail);

    const allFields = {
      fullName: true,
      mobileNumber: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(allFields);

    const v1 = validateField('fullName', normalizedName);
    const v2 = validateField('mobileNumber', mobileNumber);
    const v3 = validateField('email', normalizedEmail);
    const v4 = validateField('password', password);
    const v5 = validateField('confirmPassword', confirmPassword);

    if (v1 && v2 && v3 && v4 && v5) {
      alert('Candidate account validation passed! Ready for backend submission.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 md:bg-[url('/src/assets/login/login-bg.png')] md:bg-cover md:bg-center relative overflow-y-auto md:overflow-hidden font-sans select-none p-4 md:p-6">
      {/* Light Overlay to match Login page layout */}
      <div className="absolute inset-0 bg-sky-100/10 hidden md:block" />

      {/* Brand Logo repositioned to top-left of viewport (matching Login page) */}
      <div className="absolute top-5 left-5 md:top-6 md:left-6 flex items-center gap-2 z-20">
        <img src={logoJobz} alt="TN Jobz Logo" className="h-8 md:h-9 w-auto object-contain" />
        <span className="text-lg md:text-xl font-black text-slate-805 tracking-tight">
          TN <span className="text-teal-600">Jobz</span>
        </span>
      </div>

      {/* Shared Centered Signup Card matching Login design system */}
      <div id="signup-form-card" className="relative z-10 w-full max-w-[92vw] md:max-w-[480px] bg-white rounded-[28px] md:rounded-[32px] p-5 md:py-6 md:px-8 shadow-xl border border-slate-100/50 my-auto">

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-3">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-0.5">
            Join now and take the next step towards your dream job
          </p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-2.5">

          {/* Full Name */}
          <div className="space-y-0.5 text-left">
            <label htmlFor="fullName" className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${touched.fullName && errors.fullName ? 'text-red-600' : 'text-slate-900'}`}>
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="fullName"
                type="text"
                inputMode="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={fullName}
                onBlur={() => handleBlur('fullName', fullName)}
                onChange={(e) => {
                  const sanitized = sanitizeName(e.target.value);
                  setFullName(sanitized);
                  if (touched.fullName) validateField('fullName', sanitized);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text');
                  const sanitized = sanitizeName(pasted);
                  setFullName(sanitized);
                  if (touched.fullName) validateField('fullName', sanitized);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = e.dataTransfer.getData('text');
                  const sanitized = sanitizeName(dropped);
                  setFullName(sanitized);
                  if (touched.fullName) validateField('fullName', sanitized);
                }}
                aria-invalid={!!(touched.fullName && errors.fullName)}
                aria-describedby="fullName-field-error"
                className={`w-full rounded-xl border ${touched.fullName && errors.fullName ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-2.5 pl-11 pr-4 text-xs md:text-sm text-slate-950 focus:outline-none transition-colors min-h-[42px]`}
              />
            </div>
            <div id="fullName-field-error" role="alert" aria-live="polite" className="min-h-[14px] pt-0.5 pl-1 text-[11px] font-semibold text-red-600 leading-tight">
              {touched.fullName && errors.fullName ? errors.fullName : ''}
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-0.5 text-left">
            <label htmlFor="mobileNumber" className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${touched.mobileNumber && errors.mobileNumber ? 'text-red-600' : 'text-slate-900'}`}>
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                id="mobileNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                pattern="[0-9]*"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onBlur={() => handleBlur('mobileNumber', mobileNumber)}
                onChange={(e) => {
                  const sanitized = sanitizeMobile(e.target.value);
                  setMobileNumber(sanitized);
                  if (touched.mobileNumber) validateField('mobileNumber', sanitized);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text');
                  const sanitized = sanitizeMobile(pasted);
                  setMobileNumber(sanitized);
                  if (touched.mobileNumber) validateField('mobileNumber', sanitized);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = e.dataTransfer.getData('text');
                  const sanitized = sanitizeMobile(dropped);
                  setMobileNumber(sanitized);
                  if (touched.mobileNumber) validateField('mobileNumber', sanitized);
                }}
                aria-invalid={!!(touched.mobileNumber && errors.mobileNumber)}
                aria-describedby="mobileNumber-field-error"
                className={`w-full rounded-xl border ${touched.mobileNumber && errors.mobileNumber ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-2.5 pl-11 pr-4 text-xs md:text-sm text-slate-950 focus:outline-none transition-colors min-h-[42px]`}
              />
            </div>
            <div id="mobileNumber-field-error" role="alert" aria-live="polite" className="min-h-[14px] pt-0.5 pl-1 text-[11px] font-semibold text-red-600 leading-tight">
              {touched.mobileNumber && errors.mobileNumber ? errors.mobileNumber : ''}
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-0.5 text-left">
            <label htmlFor="email" className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${touched.email && errors.email ? 'text-red-600' : 'text-slate-900'}`}>
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onBlur={() => handleBlur('email', email.trim())}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) validateField('email', e.target.value.trim());
                }}
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby="email-field-error"
                className={`w-full rounded-xl border ${touched.email && errors.email ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-2.5 pl-11 pr-4 text-xs md:text-sm text-slate-950 focus:outline-none transition-colors min-h-[42px]`}
              />
            </div>
            <div id="email-field-error" role="alert" aria-live="polite" className="min-h-[14px] pt-0.5 pl-1 text-[11px] font-semibold text-red-600 leading-tight">
              {touched.email && errors.email ? errors.email : ''}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-0.5 text-left">
            <label htmlFor="password" className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${touched.password && errors.password ? 'text-red-600' : 'text-slate-900'}`}>
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter your password"
                value={password}
                onBlur={() => handleBlur('password', password)}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) validateField('password', e.target.value);
                }}
                onCopy={handleBlockedPasswordAction}
                onCut={handleBlockedPasswordAction}
                onPaste={handleBlockedPasswordAction}
                onDrop={handleBlockedPasswordAction}
                aria-invalid={!!(touched.password && errors.password)}
                aria-describedby="password-field-error"
                className={`w-full rounded-xl border ${touched.password && errors.password ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-2.5 pl-11 pr-11 text-xs md:text-sm text-slate-950 focus:outline-none transition-colors min-h-[42px]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div id="password-field-error" role="alert" aria-live="polite" className="min-h-[14px] pt-0.5 pl-1 text-[11px] font-semibold text-red-600 leading-tight">
              {touched.password && errors.password ? errors.password : ''}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-0.5 text-left">
            <label htmlFor="confirmPassword" className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${touched.confirmPassword && errors.confirmPassword ? 'text-red-600' : 'text-slate-900'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) validateField('confirmPassword', e.target.value);
                }}
                onCopy={handleBlockedPasswordAction}
                onCut={handleBlockedPasswordAction}
                onPaste={handleBlockedPasswordAction}
                onDrop={handleBlockedPasswordAction}
                aria-invalid={!!(touched.confirmPassword && errors.confirmPassword)}
                aria-describedby="confirmPassword-field-error"
                className={`w-full rounded-xl border ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-2.5 pl-11 pr-11 text-xs md:text-sm text-slate-950 focus:outline-none transition-colors min-h-[42px]`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div id="confirmPassword-field-error" role="alert" aria-live="polite" className="min-h-[14px] pt-0.5 pl-1 text-[11px] font-semibold text-red-600 leading-tight">
              {touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
            </div>
          </div>

          {/* Create Account Primary Action */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 text-sm md:text-base shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer mt-1"
          >
            Create Account
          </button>
        </form>

        {/* Bottom CTA to Sign In */}
        <div className="mt-3 text-center text-xs font-bold text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline">Sign In</Link>
        </div>

      </div>
    </div>
  );
}

