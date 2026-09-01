import { useState } from 'react';
import { X } from 'lucide-react';

export default function CategoryModal({ isOpen, onClose, onToast }) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState('true');
  const [sortOrder, setSortOrder] = useState('0');

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Category name is required
    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Category name is required';
    }

    // Display order must be a non-negative whole number
    const displayOrderVal = Number(sortOrder);
    if (isNaN(displayOrderVal) || displayOrderVal < 0 || !Number.isInteger(displayOrderVal)) {
      newErrors.sort_order = 'Display order must be a non-negative whole number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Future Django integration:
    // POST /api/admin/job-categories/
    // Body: { name, parent_id, description, is_active, sort_order }

    onToast('Category creation will be connected to the Django backend.');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Sticky Header */}
        <div className="relative border-b border-slate-100 px-6 py-5 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-black text-slate-900 leading-none">Add job category</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Category name */}
          <div className="space-y-1">
            <label htmlFor="category-name" className="block text-xs font-black text-slate-450 uppercase">Category name *</label>
            <input 
              id="category-name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Software Development"
              className={`w-full border ${errors.name ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.name && (
              <p className="text-xs font-bold text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Parent category */}
          <div className="space-y-1">
            <label htmlFor="parent-category" className="block text-xs font-black text-slate-450 uppercase">Parent category</label>
            <div className="relative">
              <select 
                id="parent-category"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
              >
                <option value="">No parent category</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="category-desc" className="block text-xs font-black text-slate-450 uppercase">Description</label>
            <textarea 
              id="category-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all"
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="category-status" className="block text-xs font-black text-slate-450 uppercase">Status</label>
            <div className="relative">
              <select 
                id="category-status"
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Display order */}
          <div className="space-y-1">
            <label htmlFor="sort-order" className="block text-xs font-black text-slate-450 uppercase">Display order *</label>
            <input 
              id="sort-order"
              type="number" 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={`w-full border ${errors.sort_order ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.sort_order && (
              <p className="text-xs font-bold text-red-500 mt-1">{errors.sort_order}</p>
            )}
          </div>

          {/* Sticky Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-extrabold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 text-sm transition-colors shadow-md shadow-teal-600/10"
            >
              Create category
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
