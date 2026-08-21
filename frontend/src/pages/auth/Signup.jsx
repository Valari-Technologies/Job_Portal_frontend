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

  // Validate fields
  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'fullName') {
      if (!value) {
        errorMsg = 'Full name is required';
      }
    } else if (name === 'mobileNumber') {
      if (!value) {
        errorMsg = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(value)) {
        errorMsg = 'Enter a valid Indian mobile number';
      }
    } else if (name === 'email') {
      if (!value) {
        errorMsg = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errorMsg = 'Enter a valid email address';
      }
    } else if (name === 'password') {
      if (!value) {
        errorMsg = 'Password is required';
      } else if (value.length < 8) {
        errorMsg = 'Password must be at least 8 characters';
      }
    } else if (name === 'confirmPassword') {
      if (!value) {
        errorMsg = 'Confirm password is required';
      } else if (value !== password) {
        errorMsg = 'Passwords do not match';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
  };

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all fields to show all validations
    const allFields = {
      fullName: true,
      mobileNumber: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(allFields);

    validateField('fullName', fullName);
    validateField('mobileNumber', mobileNumber);
    validateField('email', email);
    validateField('password', password);
    validateField('confirmPassword', confirmPassword);

    const isValid = fullName && 
      /^[6-9]\d{9}$/.test(mobileNumber) && 
      /\S+@\S+\.\S+/.test(email) && 
      password.length >= 8 && 
      confirmPassword === password;

    if (isValid) {
      // TODO: Connect Django registration API here.
      // Backend will create users, assign Candidate or Employer role,
      // validate mobile/email uniqueness, hash password, and send verification.
      alert('Sign up validation passed! Ready for backend implementation.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 md:bg-[url('/src/assets/login/login-bg.png')] md:bg-cover md:bg-center relative">
      {/* Light Overlay to meet contrast and design layout guidelines */}
      <div className="absolute inset-0 bg-sky-100/10 hidden md:block" />

      {/* Centered Signup Card */}
      <div className="relative z-10 w-full max-w-[92vw] md:max-w-[560px] bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-slate-100/50 mx-4 sm:mx-6">
        
        {/* Brand Logo header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={logoJobz} alt="State Jobz Logo" className="h-10 w-auto object-contain" />
            <span className="text-2xl font-black text-slate-800 tracking-tight">State <span className="text-teal-600">Jobz</span></span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-6 tracking-tight">Create Your Account</h2>
          <p className="text-sm font-bold text-slate-400 mt-2 text-center">Join now and take the next step towards your dream job</p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-extrabold text-slate-900">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onBlur={() => handleBlur('fullName', fullName)}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (touched.fullName) validateField('fullName', e.target.value);
                }}
                aria-invalid={!!(touched.fullName && errors.fullName)}
                aria-describedby={touched.fullName && errors.fullName ? "fullName-error" : undefined}
                className={`w-full rounded-xl border ${touched.fullName && errors.fullName ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-3.5 pl-12 pr-4 text-base text-slate-950 focus:outline-none transition-colors`}
              />
            </div>
            {touched.fullName && errors.fullName && (
              <p id="fullName-error" className="text-sm font-semibold text-red-650 mt-1" role="alert">{errors.fullName}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <label htmlFor="mobileNumber" className="block text-sm font-extrabold text-slate-900">Mobile Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                id="mobileNumber"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onBlur={() => handleBlur('mobileNumber', mobileNumber)}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  if (touched.mobileNumber) validateField('mobileNumber', e.target.value);
                }}
                aria-invalid={!!(touched.mobileNumber && errors.mobileNumber)}
                aria-describedby={touched.mobileNumber && errors.mobileNumber ? "mobileNumber-error" : undefined}
                className={`w-full rounded-xl border ${touched.mobileNumber && errors.mobileNumber ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-3.5 pl-12 pr-4 text-base text-slate-950 focus:outline-none transition-colors`}
              />
            </div>
            {touched.mobileNumber && errors.mobileNumber && (
              <p id="mobileNumber-error" className="text-sm font-semibold text-red-650 mt-1" role="alert">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-extrabold text-slate-900">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onBlur={() => handleBlur('email', email)}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) validateField('email', e.target.value);
                }}
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                className={`w-full rounded-xl border ${touched.email && errors.email ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-3.5 pl-12 pr-4 text-base text-slate-950 focus:outline-none transition-colors`}
              />
            </div>
            {touched.email && errors.email && (
              <p id="email-error" className="text-sm font-semibold text-red-650 mt-1" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-extrabold text-slate-900">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onBlur={() => handleBlur('password', password)}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) validateField('password', e.target.value);
                }}
                aria-invalid={!!(touched.password && errors.password)}
                aria-describedby={touched.password && errors.password ? "password-error" : undefined}
                className={`w-full rounded-xl border ${touched.password && errors.password ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-3.5 pl-12 pr-12 text-base text-slate-950 focus:outline-none transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p id="password-error" className="text-sm font-semibold text-red-650 mt-1" role="alert">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-extrabold text-slate-900">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) validateField('confirmPassword', e.target.value);
                }}
                aria-invalid={!!(touched.confirmPassword && errors.confirmPassword)}
                aria-describedby={touched.confirmPassword && errors.confirmPassword ? "confirmPassword-error" : undefined}
                className={`w-full rounded-xl border ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-3.5 pl-12 pr-12 text-base text-slate-950 focus:outline-none transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm font-semibold text-red-650 mt-1" role="alert">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Create Account Primary Action */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 text-base shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Create Account
          </button>
        </form>

        {/* Bottom CTA to Sign In */}
        <div className="mt-8 text-center text-sm font-bold text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline">Sign In</Link>
        </div>

      </div>
    </div>
  );
}
