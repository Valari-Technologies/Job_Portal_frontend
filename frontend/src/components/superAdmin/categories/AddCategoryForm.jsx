import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory, fetchAllCategoriesForSelect } from '../../../services/superAdmin/categorySkillService';

export default function AddCategoryForm() {
  const navigate = useNavigate();

  const [parentOptions, setParentOptions] = useState([]);
  const [loadingParents, setLoadingParents] = useState(true);

  const [formState, setFormState] = useState({
    categoryName: '',
    parentCategory: '',
    description: '',
    status: 'Active',
    sortOrder: 0
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadParents() {
      setLoadingParents(true);
      const list = await fetchAllCategoriesForSelect({ topLevelOnly: true });
      const topLevelParents = (list || []).filter(c => !c.parent && !c.parent_name);
      setParentOptions(topLevelParents);
      setLoadingParents(false);
    }
    loadParents();
  }, []);

  const validate = () => {
    const newErrors = {};

    const name = formState.categoryName.trim();
    if (!name) {
      newErrors.categoryName = 'Category Name is required.';
    } else if (name.length < 2) {
      newErrors.categoryName = 'Category Name must be at least 2 characters long.';
    }

    const desc = formState.description.trim();
    if (!desc) {
      newErrors.description = 'Description is required.';
    } else if (desc.length < 3) {
      newErrors.description = 'Description must be at least 3 characters long.';
    }

    if (formState.sortOrder < 0 || isNaN(formState.sortOrder)) {
      newErrors.sortOrder = 'Sort Order must be a non-negative integer.';
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
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] textarea');
        if (firstErrorEl) firstErrorEl.focus();
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formState.categoryName.trim(),
        parent_id: formState.parentCategory ? Number(formState.parentCategory) : null,
        description: formState.description.trim(),
        is_active: formState.status === 'Active',
        sort_order: Number(formState.sortOrder) || 0
      };

      const res = await createCategory(payload);
      if (res.success) {
        navigate('/super-admin/categories');
      } else {
        setServerError(res.message || 'Failed to create category.');
        if (res.errors) {
          const apiErrors = {};
          if (res.errors.name) apiErrors.categoryName = Array.isArray(res.errors.name) ? res.errors.name[0] : res.errors.name;
          if (res.errors.description) apiErrors.description = Array.isArray(res.errors.description) ? res.errors.description[0] : res.errors.description;
          if (res.errors.parent) apiErrors.parentCategory = Array.isArray(res.errors.parent) ? res.errors.parent[0] : res.errors.parent;
          if (res.errors.sort_order) apiErrors.sortOrder = Array.isArray(res.errors.sort_order) ? res.errors.sort_order[0] : res.errors.sort_order;
          setErrors(apiErrors);
        }
      }
    } catch (err) {
      console.error("Failed to create category", err);
      setServerError('An unexpected error occurred while saving the category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add category</h1>
        <p className="text-sm font-medium text-slate-450 mt-1">
          Create a top-level or sub-category in the TN Jobz taxonomy.
        </p>
      </div>

      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-slate-150 p-6 sm:p-8">
        
        {/* Category Name */}
        <div className="space-y-1.5" data-error={!!errors.categoryName}>
          <label htmlFor="categoryName" className="text-[13px] font-bold text-slate-700">Category Name *</label>
          <input 
            id="categoryName"
            type="text"
            value={formState.categoryName}
            onChange={(e) => {
              setFormState(prev => ({ ...prev, categoryName: e.target.value }));
              if (errors.categoryName) setErrors(prev => ({ ...prev, categoryName: null }));
              setServerError(null);
            }}
            placeholder="e.g. Information Technology"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
              errors.categoryName 
                ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
            }`}
          />
          {errors.categoryName && <p className="text-xs text-red-500 font-semibold">{errors.categoryName}</p>}
        </div>

        {/* Parent Category */}
        <div className="space-y-1.5" data-error={!!errors.parentCategory}>
          <label htmlFor="parentCategory" className="text-[13px] font-bold text-slate-700">Parent Category (Optional)</label>
          <select
            id="parentCategory"
            value={formState.parentCategory}
            onChange={(e) => setFormState(prev => ({ ...prev, parentCategory: e.target.value }))}
            disabled={loadingParents}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
          >
            <option value="">None (Top Level Category)</option>
            {parentOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.parentCategory && <p className="text-xs text-red-500 font-semibold">{errors.parentCategory}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5" data-error={!!errors.description}>
          <label htmlFor="description" className="text-[13px] font-bold text-slate-700">Description *</label>
          <textarea 
            id="description"
            rows={3}
            value={formState.description}
            onChange={(e) => {
              setFormState(prev => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              setServerError(null);
            }}
            placeholder="Brief explanation of jobs covered under this category..."
            className={`w-full rounded-xl border p-3 text-sm font-medium text-slate-800 focus:outline-none ${
              errors.description 
                ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
            }`}
          />
          {errors.description && <p className="text-xs text-red-500 font-semibold">{errors.description}</p>}
        </div>

        {/* Sort Order */}
        <div className="space-y-1.5" data-error={!!errors.sortOrder}>
          <label htmlFor="sortOrder" className="text-[13px] font-bold text-slate-700">Sort Order</label>
          <input 
            id="sortOrder"
            type="number"
            min="0"
            step="1"
            value={formState.sortOrder}
            onChange={(e) => {
              setFormState(prev => ({ ...prev, sortOrder: parseInt(e.target.value, 10) || 0 }));
              if (errors.sortOrder) setErrors(prev => ({ ...prev, sortOrder: null }));
            }}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
              errors.sortOrder 
                ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
            }`}
          />
          {errors.sortOrder && <p className="text-xs text-red-500 font-semibold">{errors.sortOrder}</p>}
        </div>

        {/* Active Status */}
        <div className="space-y-2" data-error={!!errors.status}>
          <label className="text-[13px] font-bold text-slate-700 block">Active Status *</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input 
                type="radio"
                name="categoryStatus"
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
                name="categoryStatus"
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
            onClick={() => navigate('/super-admin/categories')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/10 hover:bg-teal-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 min-h-[44px] cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create category"}
          </button>
        </div>

      </form>
    </div>
  );
}
