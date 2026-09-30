import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillsTable from '../../../components/superAdmin/superAdminSkills/SkillsTable';
import SkillDetailsPanel from '../../../components/superAdmin/superAdminSkills/SkillDetailsPanel';
import SkillsReviewPanel from '../../../components/superAdmin/superAdminSkills/SkillsReviewPanel';
import SkillModal from '../../../components/superAdmin/superAdminSkills/SkillModal';
import { fetchSkills, updateSkillStatus, deleteSkill, fetchAllCategoriesForSelect } from '../../../services/superAdmin/categorySkillService';

export default function SuperAdminSkills({ onToast }) {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categoriesList, setCategoriesList] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState(null);

  // Confirmation modal state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: null, // 'status' or 'delete'
    targetSkill: null,
  });

  // Load category filter options once
  useEffect(() => {
    async function loadCategoryFilterOptions() {
      const list = await fetchAllCategoriesForSelect();
      setCategoriesList(list);
    }
    loadCategoryFilterOptions();
  }, []);

  const loadSkillsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchSkills({
      search: searchTerm,
      status: statusFilter,
      category_id: categoryFilter,
      page_size: 100,
    });

    if (res.success) {
      setSkills(res.results);
      if (selectedSkill) {
        const updated = res.results.find(s => s.id === selectedSkill.id);
        setSelectedSkill(updated || null);
      }
    } else {
      setError(res.message || 'Failed to fetch skills.');
    }
    setLoading(false);
  }, [searchTerm, statusFilter, categoryFilter, selectedSkill]);

  useEffect(() => {
    loadSkillsData();
  }, [searchTerm, statusFilter, categoryFilter]);

  const handleOpenAddModal = () => {
    setSkillToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (skill) => {
    setSkillToEdit(skill);
    setModalOpen(true);
  };

  const handleToggleStatusClick = (skill) => {
    const nextStatus = !skill.is_active;
    const actionText = nextStatus ? 'activate' : 'deactivate';

    setConfirmState({
      isOpen: true,
      title: `${nextStatus ? 'Activate' : 'Deactivate'} Skill`,
      message: `Are you sure you want to ${actionText} skill "${skill.name}"? ${
        !nextStatus ? 'Deactivating a skill will hide it from new candidate profiles and job requirements.' : 'Activating a skill enables it across candidate profiles and jobs.'
      }`,
      actionType: 'status',
      targetSkill: skill,
    });
  };

  const handleDeleteClick = (skill) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Skill',
      message: `Are you sure you want to delete skill "${skill.name}"? Skills referenced by candidates or jobs cannot be deleted and must be deactivated instead.`,
      actionType: 'delete',
      targetSkill: skill,
    });
  };

  const handleConfirmAction = async () => {
    const { actionType, targetSkill } = confirmState;
    if (!targetSkill) return;

    if (actionType === 'status') {
      const nextStatus = !targetSkill.is_active;
      const res = await updateSkillStatus(targetSkill.id, nextStatus);
      if (res.success) {
        if (onToast) onToast(res.data.message || `Skill ${nextStatus ? 'activated' : 'deactivated'}.`);
        loadSkillsData();
      } else {
        if (onToast) onToast(res.message || 'Status update failed.');
      }
    } else if (actionType === 'delete') {
      const res = await deleteSkill(targetSkill.id);
      if (res.success) {
        if (onToast) onToast(`Skill "${targetSkill.name}" deleted.`);
        if (selectedSkill?.id === targetSkill.id) setSelectedSkill(null);
        loadSkillsData();
      } else {
        if (onToast) onToast(res.message || 'Deletion failed.');
      }
    }

    setConfirmState({ isOpen: false, title: '', message: '', actionType: null, targetSkill: null });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-805 tracking-tight">Skills management</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Keep skills searchable, clear and relevant.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto flex-wrap">
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
              placeholder="Search skills..."
              className="w-full sm:w-56 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-teal-500 transition-colors"
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

          <div className="relative w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
            >
              <option value="all">All categories</option>
              <option value="uncategorized">Uncategorized</option>
              {categoriesList.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigate('/super-admin/skills/create')}
            aria-label="Add skill"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4.5 py-2.5 text-sm font-extrabold text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 transition-colors cursor-pointer min-h-[42px]"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add skill</span>
          </button>
        </div>
      </div>

      {/* Grid container layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side Table */}
        <div className="lg:col-span-2 space-y-6">
          <SkillsTable 
            skills={skills}
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkill}
            onEditSkill={handleOpenEditModal}
            onToggleStatus={handleToggleStatusClick}
            onDeleteSkill={handleDeleteClick}
            loading={loading}
            error={error}
            onRetry={loadSkillsData}
            isFiltered={!!searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'}
          />
          <div className="text-sm font-bold text-slate-500">
            Showing {skills.length} skills
          </div>
        </div>

        {/* Right Side details and reviews */}
        <div className="space-y-6">
          <SkillDetailsPanel 
            selectedSkill={selectedSkill}
            onEditSkill={handleOpenEditModal}
            onToggleStatus={handleToggleStatusClick}
          />
          
          <SkillsReviewPanel />
        </div>
      </div>

      {/* Skill Modal Form Overlay */}
      <SkillModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        skillToEdit={skillToEdit}
        onSuccess={() => loadSkillsData()}
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
                onClick={() => setConfirmState({ isOpen: false, title: '', message: '', actionType: null, targetSkill: null })}
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

