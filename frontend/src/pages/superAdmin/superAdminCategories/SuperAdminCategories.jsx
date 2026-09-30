import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryHierarchy from '../../../components/superAdmin/superAdminCategories/CategoryHierarchy';
import CategoryDetailsPanel from '../../../components/superAdmin/superAdminCategories/CategoryDetailsPanel';
import CategoryModal from '../../../components/superAdmin/superAdminCategories/CategoryModal';
import { fetchCategories, updateCategoryStatus, deleteCategory } from '../../../services/superAdmin/categorySkillService';

export default function SuperAdminCategories({ onToast }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  // Confirmation modal state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: null, // 'status' or 'delete'
    targetCategory: null,
  });

  const loadCategoriesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchCategories({
      search: searchTerm,
      status: statusFilter,
      page_size: 100,
    });

    if (res.success) {
      setCategories(res.results);
      if (selectedCategory) {
        const updated = res.results.find(c => c.id === selectedCategory.id);
        setSelectedCategory(updated || null);
      }
    } else {
      setError(res.message || 'Failed to fetch categories.');
    }
    setLoading(false);
  }, [searchTerm, statusFilter, selectedCategory]);

  useEffect(() => {
    loadCategoriesData();
  }, [searchTerm, statusFilter]);

  const handleOpenAddModal = () => {
    setCategoryToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setCategoryToEdit(category);
    setModalOpen(true);
  };

  const handleToggleStatusClick = (category) => {
    const nextStatus = !category.is_active;
    const actionText = nextStatus ? 'activate' : 'deactivate';
    
    setConfirmState({
      isOpen: true,
      title: `${nextStatus ? 'Activate' : 'Deactivate'} Category`,
      message: `Are you sure you want to ${actionText} "${category.name}"? ${
        !nextStatus ? 'Deactivating a category will hide it from job posting and filters.' : 'Activating a category enables it for job taxonomy.'
      }`,
      actionType: 'status',
      targetCategory: category,
    });
  };

  const handleDeleteClick = (category) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${category.name}"? Categories referenced by jobs or candidate profiles cannot be deleted and must be deactivated instead.`,
      actionType: 'delete',
      targetCategory: category,
    });
  };

  const handleConfirmAction = async () => {
    const { actionType, targetCategory } = confirmState;
    if (!targetCategory) return;

    if (actionType === 'status') {
      const nextStatus = !targetCategory.is_active;
      const res = await updateCategoryStatus(targetCategory.id, nextStatus);
      if (res.success) {
        if (onToast) onToast(res.data.message || `Category ${nextStatus ? 'activated' : 'deactivated'}.`);
        loadCategoriesData();
      } else {
        if (onToast) onToast(res.message || 'Status update failed.');
      }
    } else if (actionType === 'delete') {
      const res = await deleteCategory(targetCategory.id);
      if (res.success) {
        if (onToast) onToast(`Category "${targetCategory.name}" deleted.`);
        if (selectedCategory?.id === targetCategory.id) setSelectedCategory(null);
        loadCategoriesData();
      } else {
        if (onToast) onToast(res.message || 'Deletion failed.');
      }
    }

    setConfirmState({ isOpen: false, title: '', message: '', actionType: null, targetCategory: null });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-805 tracking-tight">Job categories</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Organize jobs with a clear category hierarchy to improve discovery and matching.
          </p>
        </div>
        
        {/* Actions Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full sm:w-60 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={() => navigate('/super-admin/categories/create')}
            aria-label="Add category"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4.5 py-2.5 text-sm font-extrabold text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 transition-colors cursor-pointer min-h-[42px]"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add category</span>
          </button>
        </div>
      </div>

      {/* Grid structure layout mapping */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left hierarchy */}
        <div className="lg:col-span-2 space-y-6">
          <CategoryHierarchy 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onEditCategory={handleOpenEditModal}
            onToggleStatus={handleToggleStatusClick}
            onDeleteCategory={handleDeleteClick}
            loading={loading}
            error={error}
            onRetry={loadCategoriesData}
            isFiltered={!!searchTerm || statusFilter !== 'all'}
          />
          <div className="text-sm font-bold text-slate-500">
            Showing {categories.length} categories
          </div>
        </div>

        {/* Right side insights details */}
        <div className="space-y-6">
          <CategoryDetailsPanel 
            selectedCategory={selectedCategory} 
            onEditCategory={handleOpenEditModal}
            onToggleStatus={handleToggleStatusClick}
          />
        </div>
      </div>

      {/* Category Modal Form Overlay */}
      <CategoryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        categoryToEdit={categoryToEdit}
        onSuccess={() => loadCategoriesData()}
        onToast={onToast} 
      />

      {/* Confirmation Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-slate-850">{confirmState.title}</h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              {confirmState.message}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmState({ isOpen: false, title: '', message: '', actionType: null, targetCategory: null })}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold text-white transition-colors cursor-pointer ${
                  confirmState.actionType === 'delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

