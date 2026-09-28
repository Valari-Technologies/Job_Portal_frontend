import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createCategory, updateCategory, fetchAllCategoriesForSelect } from '../../../services/superAdmin/categorySkillService';

export default function CategoryModal({ isOpen, onClose, categoryToEdit = null, onSuccess, onToast }) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState('true');
  const [sortOrder, setSortOrder] = useState('0');

  const [parentOptions, setParentOptions] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadParents() {
      setLoadingParents(true);
      const list = await fetchAllCategoriesForSelect();

      // In edit mode, exclude category itself and its descendants
      if (categoryToEdit) {
        const excludeIds = new Set([categoryToEdit.id]);
        let addedNew = true;
        while (addedNew) {
          addedNew = false;
          list.forEach(c => {
            if (c.parent && excludeIds.has(c.parent) && !excludeIds.has(c.id)) {
              excludeIds.add(c.id);
              addedNew = true;
            }
          });
        }
        setParentOptions(list.filter(c => !excludeIds.has(c.id)));
      } else {
        setParentOptions(list);
      }
      setLoadingParents(false);
    }

    loadParents();

    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setParentId(categoryToEdit.parent ? String(categoryToEdit.parent) : (categoryToEdit.parent_id ? String(categoryToEdit.parent_id) : ''));
      setDescription(categoryToEdit.description || '');
      setIsActive(categoryToEdit.is_active ? 'true' : 'false');
      setSortOrder(categoryToEdit.sort_order !== undefined ? String(categoryToEdit.sort_order) : '0');
    } else {
      setName('');
      setParentId('');
      setDescription('');
      setIsActive('true');
      setSortOrder('0');
    }

    setErrors({});
    setServerError(null);
  }, [isOpen, categoryToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const newErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Category name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters.';
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      newErrors.description = 'Description is required.';
    } else if (trimmedDesc.length < 3) {
      newErrors.description = 'Description must be at least 3 characters.';
    }

    const displayOrderVal = Number(sortOrder);
    if (isNaN(displayOrderVal) || displayOrderVal < 0 || !Number.isInteger(displayOrderVal)) {
      newErrors.sort_order = 'Display order must be a non-negative whole number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: trimmedName,
        parent_id: parentId ? Number(parentId) : null,
        description: trimmedDesc,
        is_active: isActive === 'true',
        sort_order: displayOrderVal,
      };

      let res;
      if (categoryToEdit) {
        res = await updateCategory(categoryToEdit.id, payload);
      } else {
        res = await createCategory(payload);
      }

      if (res.success) {
        if (onToast) {
          onToast(categoryToEdit ? 'Category updated successfully.' : 'Category created successfully.');
        }
        if (onSuccess) onSuccess(res.data);
        onClose();
      } else {
        setServerError(res.message || 'Operation failed.');
        if (res.errors) {
          const apiErrors = {};
          if (res.errors.name) apiErrors.name = Array.isArray(res.errors.name) ? res.errors.name[0] : res.errors.name;
          if (res.errors.description) apiErrors.description = Array.isArray(res.errors.description) ? res.errors.description[0] : res.errors.description;
          if (res.errors.parent) apiErrors.parent = Array.isArray(res.errors.parent) ? res.errors.parent[0] : res.errors.parent;
          if (res.errors.sort_order) apiErrors.sort_order = Array.isArray(res.errors.sort_order) ? res.errors.sort_order[0] : res.errors.sort_order;
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
            {categoryToEdit ? 'Edit job category' : 'Add job category'}
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
          
          {/* Category name */}
          <div className="space-y-1">
            <label htmlFor="category-modal-name" className="block text-xs font-black text-slate-450 uppercase">Category name *</label>
            <input 
              id="category-modal-name"
              type="text" 
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }}
              placeholder="e.g. Software Development"
              className={`w-full border ${errors.name ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.name && (
              <p className="text-xs font-bold text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Parent category */}
          <div className="space-y-1">
            <label htmlFor="category-modal-parent" className="block text-xs font-black text-slate-450 uppercase">Parent category</label>
            <div className="relative">
              <select 
                id="category-modal-parent"
                value={parentId}
                onChange={(e) => {
                  setParentId(e.target.value);
                  if (errors.parent) setErrors(prev => ({ ...prev, parent: null }));
                }}
                disabled={loadingParents}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
              >
                <option value="">None (Top Level Category)</option>
                {parentOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent_name ? `${cat.parent_name} > ${cat.name}` : cat.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.parent && (
              <p className="text-xs font-bold text-red-500 mt-1">{errors.parent}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="category-modal-desc" className="block text-xs font-black text-slate-450 uppercase">Description *</label>
            <textarea 
              id="category-modal-desc"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }}
              placeholder="Brief explanation of jobs covered under this category..."
              rows={3}
              className={`w-full border ${errors.description ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.description && (
              <p className="text-xs font-bold text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Display order */}
          <div className="space-y-1">
            <label htmlFor="category-modal-sort" className="block text-xs font-black text-slate-450 uppercase">Sort order *</label>
            <input 
              id="category-modal-sort"
              type="number" 
              min="0"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                if (errors.sort_order) setErrors(prev => ({ ...prev, sort_order: null }));
              }}
              className={`w-full border ${errors.sort_order ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.sort_order && (
              <p className="text-xs font-bold text-red-500 mt-1">{errors.sort_order}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="category-modal-status" className="block text-xs font-black text-slate-450 uppercase">Active status</label>
            <div className="relative">
              <select 
                id="category-modal-status"
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
              {isSubmitting ? (categoryToEdit ? 'Saving...' : 'Creating...') : (categoryToEdit ? 'Save changes' : 'Create category')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

