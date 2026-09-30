import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, Edit, X, Upload, CheckCircle2 } from 'lucide-react';
import { getAdminRecruiters, updateAdminRecruiter } from '../../services/admin/adminRecruitersService';

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) resolve(null);
    if (typeof file === 'string') resolve(file);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export default function AdminRecruiters() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Edit Modal State
  const [editingRecruiter, setEditingRecruiter] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    company_name: '',
    designation: '',
    industry: '',
    status: 'ACTIVE',
    company_logo: null
  });
  const [editLogoPreview, setEditLogoPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);

  const fetchRecruiters = () => {
    getAdminRecruiters().then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleEditClick = (rec) => {
    setEditingRecruiter(rec);
    setEditForm({
      full_name: rec.full_name || '',
      email: rec.email || '',
      phone_number: rec.phone || rec.raw?.phone_number || '',
      company_name: rec.company_name !== 'N/A' ? rec.company_name : '',
      designation: rec.designation || 'HR Manager',
      industry: rec.industry !== 'Human Resources' ? rec.industry : '',
      status: rec.raw?.status || (rec.account_status === 'Active' ? 'ACTIVE' : 'INACTIVE'),
      company_logo: rec.company_logo || rec.profile_photo || null
    });
    setEditLogoPreview(rec.company_logo || rec.profile_photo || null);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, company_logo: file }));
      setEditLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingRecruiter) return;
    setIsSaving(true);
    setEditError(null);
    setEditSuccess(null);

    try {
      let logoData = editForm.company_logo;
      if (editForm.company_logo && typeof editForm.company_logo !== 'string') {
        logoData = await fileToDataUrl(editForm.company_logo);
      }

      const payload = {
        full_name: editForm.full_name,
        email: editForm.email,
        phone_number: editForm.phone_number,
        company_name: editForm.company_name,
        designation: editForm.designation,
        industry: editForm.industry,
        status: editForm.status,
        company_logo: logoData,
        profile_photo: logoData
      };

      const res = await updateAdminRecruiter(editingRecruiter.id, payload);
      if (res.success) {
        setEditSuccess("Recruiter updated successfully!");
        fetchRecruiters();
        setTimeout(() => {
          setEditingRecruiter(null);
        }, 1000);
      } else {
        setEditError(res.message || "Failed to update recruiter.");
      }
    } catch {
      setEditError("An error occurred while updating.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-50 font-sans text-sm font-medium text-slate-600">
        Loading Recruiters...
      </div>
    );
  }

  const { status_counts, results, pagination } = data;
  const hasData = results && results.length > 0;

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Page title header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recruiters</h1>
          <p className="text-sm font-medium text-slate-600 mt-1">Manage recruiter accounts and organization permissions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4.5 py-2.5 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]">
            <Filter className="h-4 w-4 text-slate-600" />
            <span>Filters</span>
          </button>
          <button 
            onClick={() => navigate('/admin/recruiters/create')}
            className="flex items-center gap-2 rounded-xl bg-[#4A1DDF] hover:bg-[#3B15CA] px-4.5 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer min-h-[44px] shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create Recruiter</span>
          </button>
        </div>
      </div>

      {/* Table Panel Card container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Status Tabs if backend has data */}
        {status_counts && hasData && (
          <div className="border-b border-slate-150 flex items-center overflow-x-auto px-6 py-2.5 gap-6">
            {['all', 'pending_activation', 'active', 'inactive', 'suspended'].map((tab) => {
              const label = tab === 'all' ? 'All' : tab.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
              const count = status_counts[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'border-[#4A1DDF] text-slate-900 font-bold' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{label}</span>
                  {count !== undefined && (
                    <span className="h-5 px-2 min-w-5 flex items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Table Element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">NAME</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">COMPANY</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">EMAIL</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">PHONE</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">INDUSTRY</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">STATUS</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!hasData ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="max-w-md mx-auto space-y-2 px-6">
                      <h4 className="text-lg font-bold text-slate-900">No recruiters yet</h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        Employer accounts created by you will appear here after backend data is available.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        {rec.company_logo || rec.profile_photo ? (
                          <img 
                            src={rec.company_logo || rec.profile_photo} 
                            alt={rec.full_name} 
                            className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-indigo-100 text-[#4A1DDF] font-extrabold text-sm flex items-center justify-center shrink-0">
                            {(rec.full_name || 'H').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{rec.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{rec.company_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{rec.email}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">{rec.phone}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{rec.industry}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        rec.account_status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rec.account_status === 'Pending Activation'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : rec.account_status === 'Suspended'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {rec.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(rec)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination section if backend has data */}
        {pagination && hasData && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Showing {((pagination.page - 1) * pagination.page_size) + 1} to {Math.min(pagination.page * pagination.page_size, pagination.total_count)} of {pagination.total_count} entries
            </span>
          </div>
        )}

      </div>

      {/* Edit Recruiter Modal */}
      {editingRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Recruiter Account</h3>
              <button 
                onClick={() => setEditingRecruiter(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editSuccess && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{editSuccess}</span>
              </div>
            )}

            {editError && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              
              {/* Profile Photo upload field */}
              <div className="flex items-center gap-4">
                {editLogoPreview ? (
                  <img src={editLogoPreview} alt="Logo" className="h-14 w-14 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-indigo-50 border border-indigo-100 text-[#4A1DDF] font-bold text-lg flex items-center justify-center">
                    {(editForm.full_name || 'H').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A1DDF]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A1DDF]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone_number}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A1DDF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Company Name</label>
                  <input
                    type="text"
                    value={editForm.company_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A1DDF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Designation</label>
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(e) => setEditForm(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A1DDF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A1DDF]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecruiter(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] text-white px-5 py-2 text-xs font-bold disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
