import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createSkill, updateSkill, fetchAllCategoriesForSelect } from '../../../services/superAdmin/categorySkillService';

export default function SkillModal({ isOpen, onClose, skillToEdit = null, onSuccess, onToast }) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState('true');

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadCategories() {
      setLoadingCategories(true);
      const list = await fetchAllCategoriesForSelect();
      setCategoryOptions(list);
      setLoadingCategories(false);
    }

    loadCategories();

    if (skillToEdit) {
      setName(skillToEdit.name || '');
      setCategoryId(skillToEdit.category ? String(skillToEdit.category) : (skillToEdit.category_id ? String(skillToEdit.category_id) : ''));
      setIsActive(skillToEdit.is_active ? 'true' : 'false');
    } else {
      setName('');
      setCategoryId('');
      setIsActive('true');
    }

    setErrors({});
    setServerError(null);
  }, [isOpen, skillToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const newErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Skill name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Skill name must be at least 2 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: trimmedName,
        category_id: categoryId ? Number(categoryId) : null,
        is_active: isActive === 'true',
      };

      let res;
      if (skillToEdit) {
        res = await updateSkill(skillToEdit.id, payload);
      } else {
        res = await createSkill(payload);
      }

      if (res.success) {
        if (onToast) {
          onToast(skillToEdit ? 'Skill updated successfully.' : 'Skill created successfully.');
        }
        if (onSuccess) onSuccess(res.data);
        onClose();
      } else {
        setServerError(res.message || 'Operation failed.');
        if (res.errors) {
          const apiErrors = {};
          if (res.errors.name) apiErrors.name = Array.isArray(res.errors.name) ? res.errors.name[0] : res.errors.name;
          if (res.errors.category) apiErrors.category = Array.isArray(res.errors.category) ? res.errors.category[0] : res.errors.category;
          setErrors(apiErrors);
        }
      }
    } catch {
      setServerError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="relative border-b border-slate-100 px-6 py-5 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-black text-slate-900 leading-none">
            {skillToEdit ? 'Edit skill' : 'Add skill'}
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Skill name */}
          <div className="space-y-1">
            <label htmlFor="skill-modal-name" className="block text-xs font-black text-slate-450 uppercase">Skill name *</label>
            <input 
              id="skill-modal-name"
              type="text" 
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
              placeholder="e.g. React.js, Python, or Front Desk Management"
              className={`w-full border ${errors.name ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.name && (
              <p className="text-xs font-bold text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Job Category */}
          <div className="space-y-1">
            <label htmlFor="skill-modal-category" className="block text-xs font-black text-slate-450 uppercase">Job category (Optional)</label>
            <div className="relative">
              <select 
                id="skill-modal-category"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                }}
                disabled={loadingCategories}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
              >
                <option value="">None / Select Category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent_name ? `${cat.parent_name} > ${cat.name}` : cat.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-xs font-bold text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="skill-modal-status" className="block text-xs font-black text-slate-450 uppercase">Active status</label>
            <div className="relative">
              <select 
                id="skill-modal-status"
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Sticky Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-extrabold text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 text-sm transition-colors shadow-md shadow-teal-600/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (skillToEdit ? 'Saving...' : 'Creating...') : (skillToEdit ? 'Save changes' : 'Create skill')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
