import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import logoJobz from '../../assets/logo-jobz.png';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setSuccessMessage(data.message || 'If an account exists for this email, reset instructions will be sent.');
      } else {
        setError(data.email?.[0] || data.detail || 'Failed to send password reset email.');
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
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password?</h1>
          <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
            Enter your registered email address below. We'll send you instructions to reset your password safely.
          </p>
        </div>

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center space-y-3">
            <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-emerald-900 leading-relaxed">
              {successMessage}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">
              Please check your inbox and follow the instructions in the email.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-teal-700 hover:text-teal-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Sign In</span>
              </Link>
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

            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-900 focus:border-teal-500 focus:outline-none min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 text-sm shadow-md transition-all focus:outline-none disabled:opacity-70 cursor-pointer min-h-[44px]"
            >
              {isSubmitting ? 'Sending Instructions...' : 'Send Reset Link'}
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
