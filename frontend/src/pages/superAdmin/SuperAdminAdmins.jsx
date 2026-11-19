import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UserCheck, AlertCircle, RefreshCw, MoreVertical, Eye } from 'lucide-react';
import { fetchAdminsService } from '../../services/superAdmin/superAdminService';
import SuperAdminPagination from '../../components/superAdmin/common/SuperAdminPagination';

function AdminActionMenu({ admin }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Actions menu"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-slate-150 bg-white p-1.5 shadow-lg z-30 space-y-0.5 animate-fadeIn text-left">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>View details</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function SuperAdminAdmins() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination config: 6 admins per page
  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(admins.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedAdmins = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return admins.slice(start, start + PAGE_SIZE);
  }, [admins, safeCurrentPage]);

  const loadAdmins = useCallback((query = '') => {
    setLoading(true);
    setError(null);
    fetchAdminsService(query)
      .then((data) => {
        setAdmins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admins", err);
        setError("Failed to load administrator accounts. Please ensure backend server is running.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadAdmins(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, loadAdmins]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Admins</h1>
        </div>
        <button
          onClick={() => navigate('/super-admin/admins/create')}
          className="w-full sm:w-auto justify-center flex items-center gap-2 rounded-xl bg-teal-600 px-4.5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Create Admin</span>
        </button>
      </div>

      {/* Toolbar controls and searches */}
      <div className="flex items-center max-w-md bg-white rounded-xl border border-slate-150 pl-3.5 pr-2 py-1.5 focus-within:border-teal-500 transition-colors">
        <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
        <input 
          type="text"
          id="admins-search-input"
          name="adminsSearch"
          aria-label="Search administrators"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search administrators by name, email, or status..."
          className="w-full bg-transparent border-none text-xs font-bold text-slate-800 placeholder-slate-450 focus:outline-none pl-2.5 py-1.5"
        />
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadAdmins(searchQuery)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-800 font-bold hover:bg-red-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Table listing cards */}
      <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-sm font-bold text-slate-450 animate-pulse">Loading admins list...</span>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4">
              <UserCheck className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              {searchQuery ? "No matching admins found" : "No admins yet"}
            </h3>
            <p className="text-xs font-medium text-slate-450 mt-1 max-w-sm">
              {searchQuery 
                ? "Try searching with a different name or email address."
                : "Admin accounts created by the Super Admin will appear here."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Created Date</th>
                  <th className="px-4 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Created By</th>
                  <th className="px-4 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAdmins.map((adm) => {
                  const displayName = adm.name || adm.full_name || adm.username || 'Admin';
                  const statusVal = adm.status || adm.account_status || 'ACTIVE';
                  const isStatusActive = statusVal.toUpperCase() === 'ACTIVE';
                  const createdByName = adm.created_by?.name || adm.created_by?.email || 'System';

                  return (
                    <tr key={adm.id || adm.email} className="hover:bg-slate-50/40">
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-900">{displayName}</td>
                      <td className="px-4 py-3.5 text-xs font-bold text-slate-500">{adm.email}</td>
                      <td className="px-4 py-3.5 text-xs font-bold text-slate-600">{adm.role || 'ADMIN'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          isStatusActive
                            ? 'border border-green-200 bg-green-50 text-green-700'
                            : 'border border-slate-200 bg-slate-50 text-slate-500'
                        }`}>
                          {statusVal}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-slate-500">{formatDate(adm.created_at)}</td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-slate-500">{createdByName}</td>
                      <td className="px-4 py-2 text-right whitespace-nowrap w-16">
                        <AdminActionMenu admin={adm} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {admins.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <SuperAdminPagination
              currentPage={safeCurrentPage}
              totalItems={admins.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemName="admins"
            />
          </div>
        )}
      </div>
    </div>
  );
}
