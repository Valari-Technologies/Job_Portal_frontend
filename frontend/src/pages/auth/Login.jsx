import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoJobz from '../../assets/logo-jobz.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginFailed, setLoginFailed] = useState(false);

  // Validate fields
  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'email') {
      if (!value) {
        errorMsg = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errorMsg = 'Enter a valid email address';
      }
    } else if (name === 'password') {
      if (!value) {
        errorMsg = 'Password is required';
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
    
    // Set all fields to touched to trigger validations on empty/unfocused fields
    setTouched({ email: true, password: true });
    
    const isEmailValid = email && /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = !!password;
    
    validateField('email', email);
    validateField('password', password);

    if (isEmailValid && isPasswordValid) {
      // TODO: Connect Django Backend Authentication Security Requirements:
      // - POST /api/v1/auth/login/ using HTTPS
      // - Backend must enforce rate limiting (e.g. throttle requests by IP/User)
      // - Backend must hash passwords using PBKDF2/Argon2
      // - Backend must enforce temporary login-attempt limits (lockout logic)
      // - Backend must handle generic authentication responses (no distinct user-exist checks)
      // - Backend must handle secure JWT/Session attributes (HttpOnly cookies, secure flags)
      
      // Simulate generic login failure for demo purposes
      setLoginFailed(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 md:bg-[url('/src/assets/login/login-bg.png')] md:bg-cover md:bg-center relative">
      {/* Light Overlay to meet contrast and design layout guidelines */}
      <div className="absolute inset-0 bg-sky-100/10 hidden md:block" />

      {/* Centered Login Card - Refactored responsive sizes */}
      <div className="relative z-10 w-full max-w-[92vw] md:max-w-[560px] bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-slate-100/50 mx-4 sm:mx-6">
        
        {/* Brand Logo header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={logoJobz} alt="State Jobz Logo" className="h-10 w-auto object-contain" />
            <span className="text-2xl font-black text-slate-800 tracking-tight">State <span className="text-teal-600">Jobz</span></span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-6 tracking-tight">Welcome Back</h2>
          <p className="text-sm font-bold text-slate-400 mt-2">Sign in to continue your job search journey</p>
        </div>

        {/* Secure generic failure alert banner */}
        {loginFailed && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-650" role="alert">
            Email or password is invalid.
          </div>
        )}

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email field */}
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

          {/* Password field */}
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

          {/* Remember me & Forgot password layout */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-650 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-500">Remember me</span>
            </label>
            <a href="#forgot" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
          </div>

          {/* Sign In Primary Action */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 text-base shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Sign In
          </button>
        </form>

        {/* Divider lines */}
        <div className="relative flex items-center justify-center my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-150" />
          </div>
          <span className="relative bg-white px-3 text-sm font-bold text-slate-400">or</span>
        </div>

        {/* Google OAuth visual CTA - Horizontally centered, specific desktop width limits */}
        <div className="flex justify-center">
          <button
            type="button"
            className="w-full max-w-full md:max-w-[340px] h-[52px] md:h-[56px] flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 text-base font-bold text-slate-700 transition-colors focus:ring-2 focus:ring-slate-300 focus:outline-none"
          >
            <img src="/google-image.png" alt="Google Logo" className="h-5 w-5 shrink-0 object-contain" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Bottom CTA to Create Account */}
        <div className="mt-8 text-center text-sm font-bold text-slate-500">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 hover:underline">Create Account</Link>
        </div>

      </div>
    </div>
  );
}
