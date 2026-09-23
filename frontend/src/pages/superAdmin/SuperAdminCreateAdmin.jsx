import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { createAdminService } from '../../services/superAdmin/superAdminService';

export default function SuperAdminCreateAdmin() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formState.name.trim()) {
      newErrors.name = "Full Name is required.";
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formState.password) {
      newErrors.password = "Password is required.";
    }

    if (!formState.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formState.status) {
      newErrors.status = "Select an account status.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] button');
        if (firstErrorEl) firstErrorEl.focus();
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        password: formState.password,
        confirmPassword: formState.confirmPassword,
        status: formState.status
      };
      
      const res = await createAdminService(payload);
      if (res.success) {
        navigate('/super-admin/admins');
      } else {
        if (res.errors && typeof res.errors === 'object') {
          const fieldErrors = {};
          if (res.errors.email) fieldErrors.email = Array.isArray(res.errors.email) ? res.errors.email[0] : res.errors.email;
          if (res.errors.password) fieldErrors.password = Array.isArray(res.errors.password) ? res.errors.password[0] : res.errors.password;
          if (res.errors.confirmPassword) fieldErrors.confirmPassword = Array.isArray(res.errors.confirmPassword) ? res.errors.confirmPassword[0] : res.errors.confirmPassword;
          if (res.errors.status) fieldErrors.status = Array.isArray(res.errors.status) ? res.errors.status[0] : res.errors.status;
          
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          }
        }
        setApiError(res.message || 'Failed to create Admin user.');
      }
    } catch {
      setApiError("An unexpected error occurred while creating admin account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header sections */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Create Admin</h1>
        <p className="text-sm font-medium text-slate-450 mt-1">
          Add a new administrative user to manage recruiters and employers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-150 p-6 sm:p-8">
        {apiError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          
          {/* Field 1: Full Name */}
          <div className="space-y-1.5" data-error={!!errors.name}>
            <label className="text-[13px] font-bold text-slate-700">Full Name *</label>
            <input 
              type="text"
              value={formState.name}
              onChange={(e) => {
                setFormState(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
              placeholder="Enter admin full name"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 focus:outline-none min-h-[40px] ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                  : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
          </div>

          {/* Field 2: Email Address */}
          <div className="space-y-1.5" data-error={!!errors.email}>
            <label className="text-[13px] font-bold text-slate-700">Email Address *</label>
            <input 
              type="email"
              value={formState.email}
              onChange={(e) => {
                setFormState(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors(prev => ({ ...prev, email: null }));
              }}
              placeholder="Enter admin email address"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 focus:outline-none min-h-[40px] ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                  : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
          </div>

          {/* Field 3: Password */}
          <div className="space-y-1.5" data-error={!!errors.password}>
            <label className="text-[13px] font-bold text-slate-700">Password *</label>
            <input 
              type="password"
              autoComplete="new-password"
              value={formState.password}
              onChange={(e) => {
                setFormState(prev => ({ ...prev, password: e.target.value }));
                if (errors.password) setErrors(prev => ({ ...prev, password: null }));
              }}
              placeholder="Create a strong password"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 focus:outline-none min-h-[40px] ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                  : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
              }`}
            />
            {errors.password && <p className="text-xs text-red-500 font-semibold">{errors.password}</p>}
          </div>

          {/* Field 4: Confirm Password */}
          <div className="space-y-1.5" data-error={!!errors.confirmPassword}>
            <label className="text-[13px] font-bold text-slate-700">Confirm Password *</label>
            <input 
              type="password"
              autoComplete="new-password"
              value={formState.confirmPassword}
              onChange={(e) => {
                setFormState(prev => ({ ...prev, confirmPassword: e.target.value }));
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
              }}
              placeholder="Confirm password"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-[14px] font-medium text-slate-800 focus:outline-none min-h-[40px] ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                  : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
              }`}
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 font-semibold">{errors.confirmPassword}</p>}
          </div>

          {/* Field 5: Account Status */}
          <div className="space-y-2" data-error={!!errors.status}>
            <label className="text-[13px] font-bold text-slate-700 block">Account Status *</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                <input 
                  type="radio"
                  name="accountStatus"
                  value="ACTIVE"
                  checked={formState.status === 'ACTIVE'}
                  onChange={() => {
                    setFormState(prev => ({ ...prev, status: 'ACTIVE' }));
                    if (errors.status) setErrors(prev => ({ ...prev, status: null }));
                  }}
                  className="h-4.5 w-4.5 accent-teal-600 focus:ring-2 focus:ring-teal-500"
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                <input 
                  type="radio"
                  name="accountStatus"
                  value="INACTIVE"
                  checked={formState.status === 'INACTIVE'}
                  onChange={() => {
                    setFormState(prev => ({ ...prev, status: 'INACTIVE' }));
                    if (errors.status) setErrors(prev => ({ ...prev, status: null }));
                  }}
                  className="h-4.5 w-4.5 accent-teal-600 focus:ring-2 focus:ring-teal-500"
                />
                <span>Inactive</span>
              </label>
            </div>
            {errors.status && <p className="text-xs text-red-500 font-semibold">{errors.status}</p>}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 min-h-[44px] cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Admin"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
