import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import logoJobz from '../../../assets/logo-jobz.png';
import { loginAdmin, loginWithGoogle, clearAllAuthTokens, getAuthItem } from '../../../services/auth/adminAuthService';

export default function AdminPortalLoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [authError, setAuthError] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const authErrorRef = useRef(null);
  const authErrorTimerRef = useRef(null);

  const triggerAuthError = (msg) => {
    if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
    setAuthError(msg);
    setIsErrorVisible(true);
    setTimeout(() => {
      authErrorRef.current?.focus();
    }, 50);

    authErrorTimerRef.current = setTimeout(() => {
      setIsErrorVisible(false);
      setTimeout(() => {
        setAuthError(null);
      }, 500);
    }, 4000);
  };

  const clearAuthError = () => {
    if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
    setIsErrorVisible(false);
    setTimeout(() => {
      setAuthError(null);
    }, 300);
  };

  useEffect(() => {
    // If already logged in as Admin / Super Admin, direct to overview
    const saToken = getAuthItem('super_admin_access_token');
    const saRole = getAuthItem('super_admin_auth_role');
    if (saToken && saRole === 'SUPER_ADMIN') {
      navigate('/super-admin/overview', { replace: true });
      return;
    }
    const adminToken = getAuthItem('admin_access_token');
    const adminRole = getAuthItem('admin_auth_role');
    if (adminToken && adminRole === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    return () => {
      if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
    };
  }, [navigate]);

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
    if (authError) clearAuthError();
    if (touched.email) validateField('email', val);
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (authError) clearAuthError();
    if (touched.password) validateField('password', val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
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

    setIsSubmitting(true);

    try {
      const response = await loginAdmin({
        email: email.trim(),
        password: password,
        expectedRole: 'ADMIN_PORTAL',
      });

      if (response.success) {
        const role = response.role;
        if (role === 'SUPER_ADMIN') {
          window.location.href = '/super-admin/overview';
        } else if (role === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else {
          triggerAuthError('Access denied. Candidate and HR users must log in at /login.');
        }
      } else {
        triggerAuthError(response.message || 'Invalid email or password.');
      }
    } catch {
      triggerAuthError('An unexpected authentication error occurred.');
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

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      triggerAuthError('Google sign-in did not return a valid credential.');
      return;
    }

    setIsSubmitting(true);
    clearAuthError();

    try {
      console.log('[AdminPortalLoginForm] Google credential received.');
      const response = await loginWithGoogle({
        token: credentialResponse.credential,
        expectedRole: 'ADMIN_PORTAL',
      });
      console.log('[AdminPortalLoginForm] loginWithGoogle response:', response);

      if (response.success) {
        const role = response.role;
        if (role === 'SUPER_ADMIN') {
          window.location.href = '/super-admin/overview';
        } else if (role === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else {
          triggerAuthError('Access denied. Admin portal is restricted to authorized Super Admins and Admins. Candidate and HR users please login at /login.');
        }
      } else {
        triggerAuthError(response.message || 'Google login failed.');
      }
    } catch (err) {
      console.error('[AdminPortalLoginForm] Error during Google login:', err);
      triggerAuthError('An unexpected Google authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    triggerAuthError('Google sign-in was cancelled or encountered an error.');
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
          className={`transition-all duration-500 ease-in-out transform ${
            isErrorVisible 
              ? 'opacity-100 translate-y-0 max-h-24 mb-4' 
              : 'opacity-0 -translate-y-2 max-h-0 mb-0 overflow-hidden pointer-events-none'
          }`}
        >
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2.5 focus:outline-none">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span className="leading-relaxed">{authError}</span>
          </div>
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
          {isSubmitting && (
            <p className="text-[11px] text-center text-slate-500 mt-2 font-medium animate-pulse">
              Connecting to server... If the backend was asleep, please allow ~30s.
            </p>
          )}
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
        <div className="flex justify-center w-full">
          <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="380"
            />
          </div>
        </div>

      </form>
    </div>
  );
}
