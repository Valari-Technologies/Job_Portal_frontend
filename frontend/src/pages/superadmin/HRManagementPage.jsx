import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, Eye, Edit2, Trash2, MoreHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import AddHRModal from '../../components/superadmin/hrmanagement/AddHRModal';
import { getHRUsers, saveHRUsers } from '../../components/superadmin/hrmanagement/hrData';

export default function HRManagementPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters toggle
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRole, setSelectedRole] = useState('All Role');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Active dots action menu
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load on mount
  useEffect(() => {
    setUsers(getHRUsers());
  }, []);

  // Save list helper
  const handleSave = (updatedList) => {
    setUsers(updatedList);
    saveHRUsers(updatedList);
  };

  // Add / Edit save
  const handleSaveUser = (formData) => {
    let updated;
    if (editingUser) {
      updated = users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u);
    } else {
      const nextId = `HR-${users.length + 1001}`;
      const newUser = {
        ...formData,
        id: nextId,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        lastLogin: 'Never logged in'
      };
      updated = [...users, newUser];
    }
    handleSave(updated);
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Delete
  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete HR user "${name}"?`)) {
      const updated = users.filter(u => u.id !== id);
      handleSave(updated);
      setActiveMenuId(null);
    }
  };

  // Toggle status
  const toggleStatus = (id) => {
    const updated = users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return u;
    });
    handleSave(updated);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedRole('All Role');
    setCurrentPage(1);
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClose = () => setActiveMenuId(null);
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  // Filtered List
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All Status' || user.status === selectedStatus;
    const matchesRole = selectedRole === 'All Role' || user.role === selectedRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">HR Managements</h2>
      </div>

      {/* Main glass wrapper matching Organizations style */}
      <div className="bg-white/[0.05] backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-none p-6 flex flex-col gap-6">
        
        {/* Search & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search HR Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search user..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }}
              className={`flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                showFilters 
                  ? 'bg-slate-100 border-slate-300 text-slate-800' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            <button
              onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
              className="flex items-center justify-center gap-2 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add HR User</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Bar */}
        {showFilters && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50 flex flex-wrap items-center gap-3 animate-fadeIn">
            <CustomSelect
              value={selectedStatus}
              onChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
              options={['All Status', 'Active', 'Inactive']}
              placeholder="All Status"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            <CustomSelect
              value={selectedRole}
              onChange={(val) => { setSelectedRole(val); setCurrentPage(1); }}
              options={['All Role', 'HR', 'Org Admin']}
              placeholder="All Role"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            {(searchTerm || selectedStatus !== 'All Status' || selectedRole !== 'All Role') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-black text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer ml-auto"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        )}

        {/* HR Users Table */}
        {paginatedUsers.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/30 text-sm font-bold text-slate-700">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-6 text-slate-800 font-extrabold">{user.name}</td>

                    {/* Email */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{user.email}</td>

                    {/* Role */}
                    <td className="px-6 py-6 text-indigo-600 font-extrabold">{user.role}</td>

                    {/* Organization */}
                    <td className="px-6 py-6 font-semibold text-slate-600">{user.organization}</td>

                    {/* Status */}
                    <td className="px-6 py-6 text-center">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                          user.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/60' 
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100/60'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{user.createdDate}</td>

                    {/* Last Login */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{user.lastLogin}</td>

                    {/* Actions Row (Horizontal side-by-side icons) */}
                    <td className="px-6 py-6 text-center relative">
                      <div className="flex items-center gap-3 justify-center">
                        <button
                          onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                          className="text-slate-400 hover:text-[#8CC63F] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveMenuId(activeMenuId === user.id ? null : user.id); 
                            }}
                            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer block leading-none font-bold"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === user.id && (
                            <div className="absolute right-0 mt-1 w-24 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-30 text-left">
                              <button
                                onClick={() => toggleStatus(user.id)}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 font-bold block animate-fadeIn"
                              >
                                Toggle Status
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="w-full text-left px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50 font-bold block animate-fadeIn"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-3">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <h4 className="text-base font-black text-slate-700">No HR users found</h4>
            <p className="text-xs font-bold text-slate-400 max-w-xs">
              Try adjusting your search or filters to locate specific workspace records.
            </p>
          </div>
        )}

        {/* Custom Pagination Footer matching Figma: 1 2 3 4 5 ... 9 */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-100/50">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 text-xs font-bold cursor-pointer"
            >
              &lt;
            </button>
            
            <button 
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 1 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              1
            </button>
            <button 
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 2 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              2
            </button>
            <button 
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 3 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              3
            </button>
            <button 
              onClick={() => setCurrentPage(4)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 4 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              4
            </button>
            <button 
              onClick={() => setCurrentPage(5)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 5 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              5
            </button>
            <span className="text-xs font-bold text-slate-400 select-none">...</span>
            <button 
              onClick={() => setCurrentPage(9)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 9 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              9
            </button>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, 9))}
              disabled={currentPage === 9}
              className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 text-xs font-bold cursor-pointer"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <AddHRModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />

    </div>
  );
}
