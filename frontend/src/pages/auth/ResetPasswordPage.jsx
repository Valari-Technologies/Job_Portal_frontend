import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import logoJobz from '../../assets/logo-jobz.png';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('New password is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!confirmPassword) {
      setError('Confirm password is required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/password-reset/confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          token,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errMsg =
          data.detail ||
          (Array.isArray(data.password) ? data.password[0] : data.password) ||
          (Array.isArray(data.confirm_password) ? data.confirm_password[0] : data.confirm_password) ||
          'Failed to reset password. The link may have expired.';
        setError(errMsg);
      }
    } catch {
      setError('Unable to connect to backend server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative p-4 md:p-6 font-sans select-none">
      
      {/* Brand Header */}
      <div className="absolute top-5 left-5 md:top-6 md:left-6 flex items-center gap-2 z-20">
        <img src={logoJobz} alt="TN Jobz Logo" className="h-8 md:h-9 w-auto object-contain" />
        <span className="text-lg md:text-xl font-black text-slate-805 tracking-tight">
          TN <span className="text-teal-600">Jobz</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 w-full max-w-[440px] shadow-xl space-y-6">
        
        <div className="space-y-2 text-center">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-150 flex items-center justify-center mx-auto text-teal-600">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset Password</h1>
          <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
            Enter your new account password below.
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center space-y-3">
            <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-900 leading-relaxed">
              Password Reset Successfully!
            </p>
            <p className="text-xs text-emerald-700 font-medium">
              You can now sign in with your new password.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 text-sm shadow-md transition-all cursor-pointer min-h-[44px]"
              >
                Sign In Now
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="password" className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                New Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-11 text-sm font-medium text-slate-900 focus:border-teal-500 focus:outline-none min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="confirmPassword" className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-11 text-sm font-medium text-slate-900 focus:border-teal-500 focus:outline-none min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 text-sm shadow-md transition-all focus:outline-none disabled:opacity-70 cursor-pointer min-h-[44px]"
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
