import { useState, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logoJobz from '../../../assets/logo-jobz.png';
import { loginAdmin } from '../../../services/auth/adminAuthService';
import { normalizeAuthError } from '../../../services/auth/authErrorNormalizer';

export default function AdminPortalLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const authErrorRef = useRef(null);

  const validateField = (fieldName, value) => {
    let errorMsg = '';
    const trimmedVal = typeof value === 'string' ? value.trim() : '';

    if (fieldName === 'email') {
      if (!trimmedVal) {
        errorMsg = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedVal)) {
        errorMsg = 'Enter a valid email address.';
      }
    } else if (fieldName === 'password') {
      if (!value) {
        errorMsg = 'Password is required.';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMsg
    }));

    return !errorMsg;
  };

  const handleBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (authError) setAuthError(null);
    if (touched.email) validateField('email', val);
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (authError) setAuthError(null);
    if (touched.password) validateField('password', val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setTouched({ email: true, password: true });

    const isEmailValid = validateField('email', email);
    const isPasswordValid = validateField('password', password);

    if (!isEmailValid) {
      emailInputRef.current?.focus();
      return;
    }
    if (!isPasswordValid) {
      passwordInputRef.current?.focus();
      return;
    }

    // Future Django authentication:
    // Normalize every rejected credential, account-state, and disallowed-role
    // response to the public message "Invalid email or password."
    // Do not expose account existence, role, status, or the incorrect field.

    setIsSubmitting(true);

    try {
      const response = await loginAdmin({
        email: email.trim(),
        password: password
      });

      if (response.success) {
        // When backend is connected: redirect based on verified backend role response
        // SUPER_ADMIN -> window.location.href = '/super-admin/overview'
        // ADMIN       -> window.location.href = '/admin/dashboard'
      } else {
        const normalized = normalizeAuthError(response);
        setAuthError(normalized.message);
        setTimeout(() => {
          authErrorRef.current?.focus();
        }, 50);
      }
    } catch (err) {
      const normalized = normalizeAuthError(err);
      setAuthError(normalized.message);
      setTimeout(() => {
        authErrorRef.current?.focus();
      }, 50);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Future Admin password recovery flow:
    // Initiate password reset verification without revealing account existence or role.
    alert("Password reset is managed by System Administration. Please contact your Super Admin.");
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    // Future Admin Google OAuth:
    // Permit Google login only if authorized for SUPER_ADMIN or ADMIN role by backend response.
    alert("Admin Google Single Sign-On is subject to backend OAuth configuration.");
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-3xl border border-slate-100 shadow-xl shadow-indigo-950/5 p-7 sm:p-9 relative z-10 font-sans">
      
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6 pt-1">
        {/* Prominent Logo */}
        <div className="flex items-center justify-center mb-4">
          <img src={logoJobz} alt="TN Jobz Logo" className="h-11 sm:h-25 w-auto object-contain" />
        </div>

        {/* Title Heading */}
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
          Welcome to <span className="text-[#4318FF]">TN Jobz</span>
        </h1>
      </div>

      {/* Form-level Authentication Error Alert (Exact text: "Invalid email or password.") */}
      {authError && (
        <div 
          ref={authErrorRef}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2.5 focus:outline-none"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span className="leading-relaxed">{authError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        
        {/* EMAIL Field with Reserved Error Slot */}
        <div className="space-y-1 text-left">
          <label htmlFor="admin-email" className="block text-xs font-extrabold text-[#4318FF] uppercase tracking-wider">
            EMAIL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <input
              ref={emailInputRef}
              id="admin-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              placeholder="Enter your email address"
              aria-invalid={touched.email && !!errors.email}
              aria-describedby="admin-email-error"
              className={`w-full bg-white border rounded-xl pl-10 pr-4 py-3 text-base text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 min-h-[46px] transition-colors ${
                touched.email && errors.email 
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500' 
                  : 'border-slate-200 focus:border-[#4318FF]'
              }`}
            />
          </div>
          {/* Reserved Fixed Feedback Slot */}
          <div
            id="admin-email-error"
            role="alert"
            aria-live="polite"
            className="min-h-[20px] pt-1 pl-1 text-[13px] font-semibold text-red-600 leading-[18px]"
          >
            {touched.email && errors.email ? errors.email : ''}
          </div>
        </div>

        {/* PASSWORD Field with Reserved Error Slot */}
        <div className="space-y-1 text-left">
          <label htmlFor="admin-password" className="block text-xs font-extrabold text-[#4318FF] uppercase tracking-wider">
            PASSWORD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <input
              ref={passwordInputRef}
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={(e) => handleBlur('password', e.target.value)}
              placeholder="Enter your password"
              aria-invalid={touched.password && !!errors.password}
              aria-describedby="admin-password-error"
              className={`w-full bg-white border rounded-xl pl-10 pr-11 py-3 text-base text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 min-h-[46px] transition-colors ${
                touched.password && errors.password 
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500' 
                  : 'border-slate-200 focus:border-[#4318FF]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {/* Reserved Fixed Feedback Slot */}
          <div
            id="admin-password-error"
            role="alert"
            aria-live="polite"
            className="min-h-[20px] pt-1 pl-1 text-[13px] font-semibold text-red-600 leading-[18px]"
          >
            {touched.password && errors.password ? errors.password : ''}
          </div>
        </div>

        {/* Forgot password link */}
        <div className="flex justify-end pt-0.5 pb-1">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer focus:outline-none"
          >
            Forgot password?
          </button>
        </div>

        {/* LOGIN Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#4318FF] to-[#4A1DDF] hover:from-[#3B15CA] hover:to-[#3311A6] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl py-3.5 min-h-[48px] shadow-md shadow-[#4318FF]/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4318FF] focus:ring-offset-2 disabled:opacity-70"
          >
            {isSubmitting ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </div>

        {/* Or Divider */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-3 bg-white text-xs font-medium text-slate-400 uppercase">
            or
          </span>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 flex items-center justify-center gap-2.5 min-h-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span className="text-sm font-bold text-slate-700">Google</span>
          </button>
        </div>

      </form>
    </div>
  );
}
