import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSkill, fetchAllCategoriesForSelect } from '../../../services/superAdmin/categorySkillService';

export default function AddSkillForm() {
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formState, setFormState] = useState({
    skillName: '',
    category: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);
      const list = await fetchAllCategoriesForSelect();
      setCategoryOptions(list);
      setLoadingCategories(false);
    }
    loadCategories();
  }, []);

  const validate = () => {
    const newErrors = {};

    const name = formState.skillName.trim();
    if (!name) {
      newErrors.skillName = 'Skill Name is required.';
    } else if (name.length < 2) {
      newErrors.skillName = 'Skill Name must be at least 2 characters long.';
    }

    if (!formState.status) {
      newErrors.status = 'Active Status is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

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
        category_id: formState.category ? Number(formState.category) : null,
        is_active: formState.status === 'Active'
      };

      const res = await createSkill(payload);
      if (res.success) {
        navigate('/super-admin/skills');
      } else {
        setServerError(res.message || 'Failed to create skill.');
        if (res.errors) {
          const apiErrors = {};
          if (res.errors.name) apiErrors.skillName = Array.isArray(res.errors.name) ? res.errors.name[0] : res.errors.name;
          if (res.errors.category) apiErrors.category = Array.isArray(res.errors.category) ? res.errors.category[0] : res.errors.category;
          setErrors(apiErrors);
        }
      }
    } catch (err) {
      console.error("Failed to create skill", err);
      setServerError('An unexpected error occurred while saving the skill.');
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

      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
          {serverError}
        </div>
      )}

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
              setServerError(null);
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
        <div className="space-y-1.5" data-error={!!errors.category}>
          <label htmlFor="category" className="text-[13px] font-bold text-slate-700">Job Category (Optional)</label>
          <select
            id="category"
            value={formState.category}
            onChange={(e) => setFormState(prev => ({ ...prev, category: e.target.value }))}
            disabled={loadingCategories}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
          >
            <option value="">None / Select Category</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parent_name ? `${cat.name} (Sub-category of ${cat.parent_name})` : cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 font-semibold">{errors.category}</p>}
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
