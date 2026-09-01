import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryHierarchy from '../../../components/superAdmin/superAdminCategories/CategoryHierarchy';
import CategoryDetailsPanel from '../../../components/superAdmin/superAdminCategories/CategoryDetailsPanel';
import CategoryModal from '../../../components/superAdmin/superAdminCategories/CategoryModal';

// TODO: Connect Django API:
// GET /api/admin/job-categories/
// Future data source: job_categories and jobs.
// Category taxonomy will be configured by Admin after backend integration.

export default function SuperAdminCategories({ onToast }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search categories..."
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none"
              disabled
            />
          </div>

          <button
            disabled
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
          >
            <span>Filter status</span>
          </button>

          <button
            onClick={() => navigate('/super-admin/categories/create')}
            aria-label="Add category"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4.5 py-2.5 text-sm font-extrabold text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 transition-colors cursor-pointer"
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
            categories={[]}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="text-sm font-bold text-slate-500">
            Showing 0 of 0 categories
          </div>
        </div>

        {/* Right side insights details */}
        <div className="space-y-6">
          <CategoryDetailsPanel 
            selectedCategory={selectedCategory} 
          />
        </div>
      </div>
      {/* Category Modal Form Overlay */}
      <CategoryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onToast={onToast} 
      />
    </div>
  );
}
