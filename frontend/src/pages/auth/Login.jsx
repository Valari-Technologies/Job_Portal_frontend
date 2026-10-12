import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import logoJobz from '../../assets/logo-jobz.png';
import { loginAdmin, loginWithGoogle, clearAllAuthTokens } from '../../services/auth/adminAuthService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRole, setActiveRole] = useState('candidate'); // 'candidate' or 'hr'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [authError, setAuthError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authErrorRef = useRef(null);
  const authErrorTimerRef = useRef(null);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.registered) {
      setActiveRole(location.state.role || 'candidate');
      setSuccessMessage(location.state.message || 'Account created successfully! Please sign in to continue.');
    }
  }, [location.state]);

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
    return () => {
      if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
    };
  }, []);

  // Switch active role tab cleanly without API side-effects
  const handleRoleChange = (newRole) => {
    if (newRole === activeRole) return;
    setActiveRole(newRole);
    setPassword('');
    clearAuthError();
    setErrors({});
    setTouched({});
  };

  // Validate fields
  const validateField = (name, value) => {
    let errorMsg = '';
    const trimmed = typeof value === 'string' ? value.trim() : '';

    if (name === 'email') {
      if (!trimmed) {
        errorMsg = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        errorMsg = 'Enter a valid email address.';
      }
    } else if (name === 'password') {
      if (!value) {
        errorMsg = 'Password is required.';
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
    // Set all fields to touched to trigger validations on empty/unfocused fields
    setTouched({ email: true, password: true });
    setAuthError(null);

    const isEmailValid = validateField('email', email);
    const isPasswordValid = validateField('password', password);

    if (isEmailValid && isPasswordValid) {
      setIsSubmitting(true);
      try {
        const expectedRole = activeRole === 'candidate' ? 'CANDIDATE' : 'HR';
        const response = await loginAdmin({
          email: email.trim(),
          password: password,
          expectedRole: expectedRole,
        });

        if (response.success) {
          const role = response.role;
          if (activeRole === 'candidate') {
            if (role === 'CANDIDATE') {
              window.location.href = '/candidate/dashboard';
              return;
            } else {
              clearAllAuthTokens();
              triggerAuthError(
                (role === 'HR' || role === 'RECRUITER')
                  ? "This account is registered as an HR / Recruiter. Please switch to the 'HR / Recruiter' tab to login."
                  : "Access denied. Candidate login only."
              );
              return;
            }
          } else if (activeRole === 'hr') {
            if (role === 'HR' || role === 'RECRUITER') {
              window.location.href = '/recruiter/dashboard';
              return;
            } else {
              clearAllAuthTokens();
              triggerAuthError(
                role === 'CANDIDATE'
                  ? "This account is registered as a Candidate. Please switch to the 'Candidate' tab to login."
                  : "Access denied. HR / Recruiter login only."
              );
              return;
            }
          } else {
            clearAllAuthTokens();
            triggerAuthError('Unauthorized account role.');
          }
        } else {
          clearAllAuthTokens();
          triggerAuthError(response.message || 'Invalid email or password.');
        }
      } catch {
        clearAllAuthTokens();
        triggerAuthError('An unexpected authentication error occurred.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      triggerAuthError('Google sign-in did not return a valid credential.');
      return;
    }

    setIsSubmitting(true);
    clearAuthError();

    try {
      const expectedRole = activeRole === 'candidate' ? 'CANDIDATE' : 'HR';
      const response = await loginWithGoogle({
        token: credentialResponse.credential,
        expectedRole: expectedRole,
      });

      if (response.success) {
        const role = response.role;
        if (activeRole === 'candidate') {
          if (role === 'CANDIDATE') {
            window.location.href = '/candidate/dashboard';
            return;
          } else {
            clearAllAuthTokens();
            triggerAuthError(
              (role === 'HR' || role === 'RECRUITER')
                ? "This account is registered as an HR / Recruiter. Please switch to the 'HR / Recruiter' tab to login."
                : "Access denied. Candidate login only."
            );
            return;
          }
        } else if (activeRole === 'hr') {
          if (role === 'HR' || role === 'RECRUITER') {
            window.location.href = '/recruiter/dashboard';
            return;
          } else {
            clearAllAuthTokens();
            triggerAuthError(
              role === 'CANDIDATE'
                ? "This account is registered as a Candidate. Please switch to the 'Candidate' tab to login."
                : "Access denied. HR / Recruiter login only."
            );
            return;
          }
        }
      } else {
        clearAllAuthTokens();
        triggerAuthError(response.message || 'Google login failed.');
      }
    } catch {
      clearAllAuthTokens();
      triggerAuthError('An unexpected Google authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    triggerAuthError('Google sign-in was cancelled or encountered an error.');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 md:bg-[url('/src/assets/login/login-bg.png')] md:bg-cover md:bg-center relative overflow-y-auto md:overflow-hidden font-sans select-none p-4 md:p-6">
      {/* Light Overlay to meet contrast and design layout guidelines */}
      <div className="absolute inset-0 bg-sky-100/10 hidden md:block" />

      {/* Brand Logo repositioned to top-left of viewport (transparent background) */}
      <div className="absolute top-5 left-5 md:top-6 md:left-6 flex items-center gap-2 z-20">
        <img src={logoJobz} alt="TN Jobz Logo" className="h-8 md:h-9 w-auto object-contain" />
        <span className="text-lg md:text-xl font-black text-slate-805 tracking-tight">
          TN <span className="text-teal-600">Jobz</span>
        </span>
      </div>

      {/* Role Selection Tabs above the login card */}
      <div role="tablist" aria-label="Login Account Type" className="relative z-10 flex items-center justify-between bg-white/20 backdrop-blur-md rounded-[24px] p-1.5 w-full max-w-[92vw] md:max-w-[480px] border border-white/30 shadow-xs mb-3.5 md:mb-4">
        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'candidate'}
          aria-controls="login-form-card"
          onClick={() => handleRoleChange('candidate')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-[20px] text-xs font-extrabold transition-all duration-200 cursor-pointer ${
            activeRole === 'candidate' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-700 hover:bg-white/10 hover:text-slate-900'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Candidate</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'hr'}
          aria-controls="login-form-card"
          onClick={() => handleRoleChange('hr')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-[20px] text-xs font-extrabold transition-all duration-200 cursor-pointer ${
            activeRole === 'hr' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-700 hover:bg-white/10 hover:text-slate-900'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>HR / Recruiter</span>
        </button>
      </div>

      {/* Shared Centered Login Card */}
      <div id="login-form-card" className="relative z-10 w-full max-w-[92vw] md:max-w-[480px] bg-white rounded-[28px] md:rounded-[32px] p-6 md:py-7 md:px-9 shadow-xl border border-slate-100/50">

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-3.5">
          <div className="flex flex-col items-center text-center">
            <div className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              {activeRole === 'candidate' ? (
                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mt-2.5 tracking-tight">
              {activeRole === 'candidate' ? 'Candidate Login' : 'HR / Recruiter Login'}
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Welcome back! Please login to continue.</p>
          </div>
        </div>

        {/* Form-level Success Banner */}
        {successMessage && (
          <div className="mb-3.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button type="button" onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Form-level Authentication Error Alert */}
        {authError && (
          <div 
            ref={authErrorRef}
            tabIndex={-1}
            role="alert"
            aria-live="polite"
            className={`transition-all duration-500 ease-in-out transform ${
              isErrorVisible 
                ? 'opacity-100 translate-y-0 max-h-24 mb-3.5' 
                : 'opacity-0 -translate-y-2 max-h-0 mb-0 overflow-hidden pointer-events-none'
            }`}
          >
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2 focus:outline-none">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Action Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">

          {/* Email field with reserved error slot */}
          <div className="space-y-1 text-left">
            <label htmlFor="email" className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${touched.email && errors.email ? 'text-red-600' : 'text-slate-900'}`}>
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onBlur={() => handleBlur('email', email)}
                onChange={(e) => handleEmailChange(e.target.value)}
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby="email-field-error"
                className={`w-full rounded-xl border ${touched.email && errors.email ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-3 pl-11 pr-4 text-sm md:text-base text-slate-950 focus:outline-none transition-colors min-h-[44px]`}
              />
            </div>
            <div id="email-field-error" role="alert" aria-live="polite" className="min-h-[16px] pt-0.5 pl-1 text-[11px] font-semibold text-red-600 leading-tight">
              {touched.email && errors.email ? errors.email : ''}
            </div>
          </div>

          {/* Password field with reserved error slot */}
          <div className="space-y-1 text-left">
            <label htmlFor="password" className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${touched.password && errors.password ? 'text-red-600' : 'text-slate-900'}`}>
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onBlur={() => handleBlur('password', password)}
                onChange={(e) => handlePasswordChange(e.target.value)}
                aria-invalid={!!(touched.password && errors.password)}
                aria-describedby="password-field-error"
                className={`w-full rounded-xl border ${touched.password && errors.password ? 'border-red-500 focus:border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-blue-600'} bg-white py-3 pl-11 pr-11 text-sm md:text-base text-slate-950 focus:outline-none transition-colors min-h-[44px]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-9 w-9 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div id="password-field-error" role="alert" aria-live="polite" className="min-h-[16px] pt-0.5 pl-1 text-[11px] font-semibold text-red-600 leading-tight">
              {touched.password && errors.password ? errors.password : ''}
            </div>
          </div>

          {/* Remember me & Forgot password layout */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-650 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</Link>
          </div>

          {/* Sign In Primary Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 text-sm md:text-base shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider lines */}
        <div className="relative flex items-center justify-center my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-150" />
          </div>
          <span className="relative bg-white px-3 text-xs font-bold text-slate-400">or</span>
        </div>

        {/* Google OAuth Button */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-full md:max-w-[340px] flex justify-center [&>div]:w-full [&>div>iframe]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="340"
            />
          </div>
        </div>

        {/* Shared Footer Slot: Candidate Signup link vs HR reserved space */}
        <div className="mt-3.5 text-center text-xs font-bold leading-normal min-h-[18px]">
          {activeRole === 'candidate' ? (
            <span className="text-slate-600">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 hover:underline">Create Account</Link>
            </span>
          ) : (
            <span className="text-transparent select-none pointer-events-none" aria-hidden="true">
              &nbsp;
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

