import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSkillService } from '../../../services/superAdmin/superAdminService';

export default function AddSkillForm() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    skillName: '',
    category: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formState.skillName.trim()) {
      newErrors.skillName = 'Skill Name is required.';
    }

    if (!formState.status) {
      newErrors.status = 'Active Status is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] select');
        if (firstErrorEl) firstErrorEl.focus();
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formState.skillName.trim(),
        category_id: formState.category || null,
        is_active: formState.status === 'Active'
      };

      const res = await createSkillService(payload);
      if (res.success) {
        navigate('/super-admin/skills');
      }
    } catch (err) {
      console.error("Failed to create skill", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add skill</h1>
        <p className="text-sm font-medium text-slate-450 mt-1">
          Add a new skill taxonomy record connected to job categories.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-slate-150 p-6 sm:p-8">
        
        {/* Skill Name */}
        <div className="space-y-1.5" data-error={!!errors.skillName}>
          <label htmlFor="skillName" className="text-[13px] font-bold text-slate-700">Skill Name *</label>
          <input 
            id="skillName"
            type="text"
            value={formState.skillName}
            onChange={(e) => {
              setFormState(prev => ({ ...prev, skillName: e.target.value }));
              if (errors.skillName) setErrors(prev => ({ ...prev, skillName: null }));
            }}
            placeholder="e.g. React.js, Python, or Front Desk Management"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
              errors.skillName 
                ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
            }`}
          />
          {errors.skillName && <p className="text-xs text-red-500 font-semibold">{errors.skillName}</p>}
        </div>

        {/* Job Category */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="text-[13px] font-bold text-slate-700">Job Category (Optional)</label>
          <select
            id="category"
            value={formState.category}
            onChange={(e) => setFormState(prev => ({ ...prev, category: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
          >
            <option value="">None / Select Category</option>
          </select>
          <p className="text-[11px] text-slate-450 italic">Categories will load from backend API when connected.</p>
        </div>

        {/* Active Status */}
        <div className="space-y-2" data-error={!!errors.status}>
          <label className="text-[13px] font-bold text-slate-700 block">Active Status *</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input 
                type="radio"
                name="skillStatus"
                value="Active"
                checked={formState.status === 'Active'}
                onChange={() => {
                  setFormState(prev => ({ ...prev, status: 'Active' }));
                  if (errors.status) setErrors(prev => ({ ...prev, status: null }));
                }}
                className="h-4.5 w-4.5 accent-teal-600 focus:ring-2 focus:ring-teal-500"
              />
              <span>Active</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input 
                type="radio"
                name="skillStatus"
                value="Inactive"
                checked={formState.status === 'Inactive'}
                onChange={() => {
                  setFormState(prev => ({ ...prev, status: 'Inactive' }));
                  if (errors.status) setErrors(prev => ({ ...prev, status: null }));
                }}
                className="h-4.5 w-4.5 accent-teal-600 focus:ring-2 focus:ring-teal-500"
              />
              <span>Inactive</span>
            </label>
          </div>
          {errors.status && <p className="text-xs text-red-500 font-semibold">{errors.status}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => navigate('/super-admin/skills')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/10 hover:bg-teal-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 min-h-[44px] cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create skill"}
          </button>
        </div>

      </form>
    </div>
  );
}
